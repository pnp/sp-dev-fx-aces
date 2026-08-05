---
name: verify-sample-pr-build
description: 'Verify that the SPFx ACE sample(s) touched by a pull request in this repo build successfully before merging. Use when: reviewing a PR, "verify PR build", "check if this PR builds", "test sample before merging", validating a submitted sample or an SPFx version upgrade in samples/**. Checks out the PR branch locally, installs dependencies only in the affected sample folder(s), runs the sample-specific build command (gulp or Heft toolchain), reports pass/fail, then cleans up.'
argument-hint: '<PR number or URL>'
---

# Verify Sample PR Build

Each sample under `samples/<SampleName>/` in this repo (pnp/sp-dev-fx-aces) is a
**fully standalone SPFx project** with its own `package.json` / `package-lock.json`.
There is no root-level package.json. A PR almost always touches exactly one sample
folder — dependencies only need to be installed there, never at the repo root.

## When to Use
- Before merging a PR that adds or modifies a sample
- Verifying an SPFx version upgrade (e.g. Gulp → Heft toolchain migration)
- Spot-checking a contributor's submission builds cleanly

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

### 1. Identify the affected sample folder(s)
Get the PR number/URL from the user, then find which `samples/<Name>/` directories
it touches:

```bash
gh pr view <PR_NUMBER> --repo pnp/sp-dev-fx-aces --json files --jq '.files[].path' \
  | grep -oE '^samples/[^/]+' | sort -u
```

Or use the helper: [get-changed-samples.sh](./scripts/get-changed-samples.sh)

If more than one sample folder is touched, repeat steps 2-5 for each.

### 2. Check out the PR branch locally
This is local-only and fully reversible (does not touch remote/origin):

```bash
gh pr checkout <PR_NUMBER> --repo pnp/sp-dev-fx-aces
```

### 3. Determine the required Node.js version
SPFx version requirements vary a lot across samples in this repo (some are years
old). Check, in order of preference, inside the affected sample folder:
1. `package.json` → `"engines": { "node": "..." }`
2. `.yo-rc.json` → `"@microsoft/generator-sharepoint" > "nodeVersion"`
3. If absent, infer roughly from the `.yo-rc.json` `"version"` (SPFx version):
   - SPFx 1.21+ → Node 22.x (Heft toolchain, `useGulp: false`)
   - SPFx 1.17–1.20 → Node 18.x or 22.x
   - SPFx 1.15–1.16 → Node 16.x or 18.x
   - SPFx < 1.15 → Node 12.x/14.x

Switch to that version with nvm (already available in this container):

```bash
nvm install <version> && nvm use <version>
```

### 4. Install dependencies (sample folder only)
Use an absolute path with `npm --prefix` instead of `cd` (see cwd-safety note above):

```bash
npm --prefix <abs-path>/samples/<SampleName> install
```

### 5. Determine the toolchain and build

Check `.yo-rc.json` for `"useGulp": false` (Heft) vs absent/true (Gulp), or just
inspect `package.json` scripts / presence of `gulpfile.js`:

- **Heft toolchain** (SPFx 1.21+, no `gulpfile.js`, has `@rushstack/heft` dep):
  ```bash
  npm --prefix <abs-path>/samples/<SampleName> run build
  ```
  (typically runs `heft test --clean --production && heft package-solution --production`)

- **Gulp toolchain** (older samples, has `gulpfile.js`):
  ```bash
  (cd <abs-path>/samples/<SampleName> && npx gulp bundle --ship && npx gulp package-solution --ship)
  ```
  Run as a single subshell command so the `cd` can't be dropped or leak into later
  commands. (`npm run build` alone may only run `gulp bundle` without `--ship`;
  prefer the exact commands listed in the sample's own README.md "Minimal Path to
  Awesome" section — it is the authoritative source per sample.)

Watch the output for: TypeScript compile errors, ESLint errors, Webpack failures,
and packaging errors. A successful run ends with the `.sppkg` written under
`sharepoint/solution/`.

### 6. Report result
Summarize per sample: pass/fail, and paste/summarize any errors encountered.
Do not push, comment on, or merge the PR yourself — only report findings.

### 7. Clean up
Always clean up after verification, whether it passed or failed.

Remove build artifacts using an absolute path (no `cd` required):
[cleanup-sample-build.sh](./scripts/cleanup-sample-build.sh)

```bash
./.github/skills/verify-sample-pr-build/scripts/cleanup-sample-build.sh <abs-path>/samples/<SampleName>
```

Then return to the repo root and switch branches as standalone commands,
verifying with `pwd` before continuing:

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

## Notes
- Never run this against `main`/`origin` destructively — `gh pr checkout` and
  `git branch -D` only affect the local clone.
- `npm install` inside a sample can print deprecation warnings and moderate/critical
  audit warnings from transitive deps — this is normal for older SPFx samples and
  not a build failure signal.
- Always double-check the working directory before running install/build/cleanup
  commands — see the cwd-safety note above. Prefer absolute paths and
  `npm --prefix` over relying on `cd` persisting across tool calls.
