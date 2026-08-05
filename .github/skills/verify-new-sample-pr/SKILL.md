---
name: verify-new-sample-pr
description: 'Verify a "new sample" PR in pnp/sp-dev-fx-aces builds successfully, then produce a deployment + testing checklist from the sample README so it can be manually deployed and tested before merging. Use when: reviewing a PR that adds a brand-new ACE sample, "verify new sample PR", "test new sample before merging", checking a first-time contributor submission. Detects PR type from the PR template Q&A table, builds the sample, locates the generated .sppkg, extracts/summarizes deployment and testing steps (and required API permission approvals) from the README, flags missing README guidance, and defers cleanup until the user confirms manual testing passed.'
argument-hint: '<PR number or URL>'
---

# Verify New Sample PR

Companion to the `verify-sample-pr-build` skill (use that one for upgrade/fix PRs —
a straight compile/build check is enough there). This skill is for PRs that
introduce a **brand-new** sample into `samples/<SampleName>/`, where a human needs
to manually deploy the generated `.sppkg` and validate it actually works before
merging.

## When to Use
- PR template body has `New sample? | yes`
- First-time contributor submitting an entirely new ACE sample
- You need a deployment + testing checklist, not just a compile check

## Known Tool Quirk: Verify Your Working Directory
The terminal tool can silently "simplify" a chained `cd <path> && <command>` and
drop the `cd`, leaving a **stale cwd from a previous task/session** in place. This
has caused commands to silently run against the wrong sample folder.

Mitigation — apply both:
1. **Prefer absolute paths over `cd`.** Use `npm --prefix /abs/path/to/samples/<Name> install`
   and `npm --prefix /abs/path/to/samples/<Name> run build` instead of `cd ... && npm ...`.
   This works regardless of the shell's persisted cwd.
2. **If you must `cd`**, issue it as its own standalone command, then immediately
   run `pwd` as a separate call and confirm it matches the expected sample path
   before running anything else. Never assume a chained `cd` took effect.

## Procedure

### 1. Confirm this is a "new sample" PR
Detect from the PR body's Q&A table (this repo's PR template has rows like
`Bug fix? / New feature? / New sample?`):

```bash
gh pr view <PR_NUMBER> --repo pnp/sp-dev-fx-aces --json body --jq '.body'
```

Or use [get-pr-type.sh](./scripts/get-pr-type.sh), which prints `new-sample`,
`upgrade-or-fix`, or `ambiguous`.

**If ambiguous** (leftover placeholder text, multiple rows marked yes, or no clear
answer) — **ask the user to confirm** before proceeding. If it turns out to be an
upgrade/fix PR, use the `verify-sample-pr-build` skill instead.

### 2. Identify the affected sample folder(s)

```bash
gh pr view <PR_NUMBER> --repo pnp/sp-dev-fx-aces --json files --jq '.files[].path' \
  | grep -oE '^samples/[^/]+' | sort -u
```

Or [get-changed-samples.sh](./scripts/get-changed-samples.sh). A new-sample PR
should touch exactly one new `samples/<Name>/` folder — if it touches more than
one, or modifies existing unrelated samples, flag that to the user.

### 3. Check out the PR branch locally

```bash
gh pr checkout <PR_NUMBER> --repo pnp/sp-dev-fx-aces
```

Local-only and fully reversible — does not touch remote/origin.

### 4. Determine Node.js version & toolchain, then build
Same detection logic as `verify-sample-pr-build`. Use the sample's **absolute path**
throughout (see cwd-safety note above) — do not rely on a prior `cd`:
1. Check `package.json` → `engines.node`, or `.yo-rc.json` → `nodeVersion`
2. `nvm install <version> && nvm use <version>`
3. `npm --prefix <abs-path>/samples/<SampleName> install`
4. Build:
   - **Heft toolchain** (SPFx 1.21+, no `gulpfile.js`): `npm --prefix <abs-path>/samples/<SampleName> run build`
   - **Gulp toolchain** (older samples, has `gulpfile.js`): `(cd <abs-path>/samples/<SampleName> && npx gulp bundle --ship && npx gulp package-solution --ship)` — run as a single subshell command so the `cd` can't be dropped or leak into later commands.

After each step, sanity-check output paths/errors reference the expected sample
folder name — if they reference a different sample, stop and re-verify cwd.

If the build fails: stop here, report the errors, clean up (step 9), and do not
proceed to README/deployment analysis for a broken build.

### 5. Locate and report the .sppkg

```bash
find samples/<SampleName>/sharepoint/solution -name '*.sppkg'
```

Report the full absolute path so the user can copy/download it for manual
deployment to a SharePoint app catalog.

### 6. Check for required API permission approvals
New samples that call Microsoft Graph or other APIs often declare
`webApiPermissionRequests` in `config/package-solution.json`. These **must** be
approved in the SharePoint Admin Center → API access page after the package is
deployed, or the ACE will fail at runtime — this is easy for a README to omit.

```bash
./scripts/get-api-permissions.sh samples/<SampleName>
```

Always surface these explicitly in the checklist, regardless of whether the
README mentions them.

### 7. Extract a deployment + testing checklist from the README
Read `samples/<SampleName>/README.md` and produce a **summarized, actionable
checklist** (not a verbatim quote) covering:
- **Prerequisites**: tenant settings, site/list provisioning, sample data, feature flags
- **Deployment steps**: upload to app catalog, trust/deploy, approve the API
  permissions found in step 6, any ACE property-pane config needed
- **How to add the ACE**: Viva Connections dashboard / Teams / SharePoint page
- **How to verify it works**: expected behavior, what to click, what result to expect

**Flag gaps explicitly.** If the README is missing any of the above — e.g. no
mention of the Graph permissions found in step 6, no clear "how to test" section,
missing prerequisite setup (like a required SharePoint list schema or sample
data) — call it out as "missing from README — consider asking the PR author to
add this" so the user can request changes from the contributor before merging.

### 8. Present results and STOP — wait for manual confirmation
Report: build status, `.sppkg` absolute path, deployment checklist, testing
checklist, and any README gaps found. Then **pause and wait**. Do not clean up yet
— the user needs the checked-out branch/build artifacts while they manually
download, deploy, and test the package.

### 9. Clean up only after explicit confirmation
Once the user confirms manual testing passed (e.g. "all ok"):

```bash
./scripts/cleanup-sample-build.sh <abs-path>/samples/<SampleName>
```

(uses absolute paths internally, no `cd` required)

Then return to the repo root and switch branches as standalone commands, verifying with `pwd`:

```bash
cd <abs-repo-root>
pwd   # confirm it printed the repo root before continuing
git checkout main
git branch -D <pr-branch-name>
```

Finally, verify with `git status --short` that the sample folder has no leftover
untracked build artifacts (e.g. toolchain-specific output directories the cleanup
script doesn't yet know about). If something remains, remove it manually and
consider adding it to `cleanup-sample-build.sh` for next time.

If the user reports a problem instead, keep the branch and build artifacts in
place so they can keep investigating — only clean up once they're done or ask to
abandon it.

## Notes
- Never push, comment on, or merge the PR yourself — only report findings and act on the user's explicit instructions.
- `gh pr checkout` and `git branch -D` only ever affect the local clone.
- `npm install` deprecation/audit warnings on older transitive deps are normal and not a build failure signal.
- Always double-check the working directory before running install/build/cleanup commands — see the cwd-safety note above. Prefer absolute paths and `npm --prefix` over relying on `cd` persisting across tool calls.
