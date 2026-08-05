---
name: merge-new-sample-pr
description: 'End-to-end review-and-merge workflow for a new-sample PR in pnp/sp-dev-fx-aces. Use when: "review and merge PR", "process this new sample PR", "merge PR <N> after testing", ready to take a new-sample PR all the way from build verification to merged-into-main. Orchestrates verify-new-sample-pr (build + manual test checklist) and generate-sample-metadata (assets/sample.json), then commits just that file, pushes it to the contributor''s branch, merges to main matching repo convention, posts a thank-you comment crediting the contributor with a link to the community call demo request form, and cleans up — pausing for your explicit go-ahead at each consequential step (manual test result, generated metadata review, the merge itself, and the thank-you comment).'
argument-hint: '<PR number or URL>'
---

# Merge New Sample PR (orchestrator)

This is a thin orchestrator over two existing skills — it doesn't duplicate their
logic, it sequences them and adds the git/GitHub mechanics needed to actually get
a fix committed onto someone else's PR branch and merged:

1. [verify-new-sample-pr](../verify-new-sample-pr/SKILL.md) — build + manual test checklist
2. [generate-sample-metadata](../generate-sample-metadata/SKILL.md) — `assets/sample.json`

Four hard pause points, matching how impactful/reversible each step is — never
skip these or combine them without the user's explicit go-ahead:
- **After build+checklist**: wait for the user to confirm manual deploy/test passed
- **After generating `sample.json`**: wait for the user to approve the content
- **Before merging**: wait for explicit "merge it" — this is the only step that
  isn't easily reversible
- **Before posting the thank-you comment**: wait for approval of the rendered
  text — it's a public, PR-visible comment

## Procedure

### 1. Confirm PR type and permissions
```bash
gh pr view <PR_NUMBER> --repo pnp/sp-dev-fx-aces --json body --jq '.body'
gh pr view <PR_NUMBER> --repo pnp/sp-dev-fx-aces --json maintainerCanModify,author,headRefName,headRepositoryOwner,state --jq '.'
```
If it's not a new-sample PR, stop and suggest `verify-sample-pr-build` instead.
If `maintainerCanModify` is `false`, stop — see the maintainer-edit-a-PR guidance
in repo memory before proceeding (ask the contributor, don't force anything).

### 2. Run `verify-new-sample-pr` in full
Follow that skill's procedure exactly: checkout, build, locate `.sppkg`, check
API permissions, extract the deployment/testing checklist, flag README gaps.

**STOP and wait** for the user to manually deploy/test and report back
("all ok" or a problem). Do not proceed past this point without that
confirmation — this is the whole point of that skill.

### 3. Run `generate-sample-metadata` on the same checked-out branch
Only if `assets/sample.json` is missing or needs fixing (check first — some
contributors include one). Follow that skill's procedure: gather facts, derive
fields, check name uniqueness, write the file.

**Show the generated file to the user and wait for approval** before touching
git — title/description/author wording needs a human look.

### 4. Stage, commit, and push — only the metadata file
Local `npm install`/build steps often leave incidental diffs (e.g.
`package-lock.json` version bumps) and this repo may have other unrelated
uncommitted files sitting in the working tree (e.g. skill files not yet
committed to `main`). Stage **only** the new/changed `assets/sample.json`:

```bash
git add samples/<SampleName>/assets/sample.json
git status --short   # confirm nothing else is staged
git commit -m "Add sample.json metadata for <SampleName>"
```

Push to the contributor's branch to update the same PR (no separate PR):

```bash
git push <fork-remote-or-full-fork-url> <PR-branch-name>
```

**Known auth quirks in this Codespace** — try in this order if push fails:
1. `Authentication error: ... push access` — the default Codespaces
   `GITHUB_TOKEN` is scoped only to `pnp/sp-dev-fx-aces`, not third-party forks.
   Fix: have the user run `unset GITHUB_TOKEN && gh auth login` (interactive,
   needs a personal token with `repo` scope) — don't attempt this yourself,
   it needs their browser/device-code interaction.
2. `Authentication error: ... verify locks` (even after #1) — this is Git LFS
   lock verification, unrelated to normal push permissions (repo has no
   LFS-tracked files). Fix: add `-c lfs.https://github.com/<owner>/<repo>.git/info/lfs.locksverify=false`
   **before** `push` on the git invocation (global option, not a push flag).
3. If the named remote was removed in an earlier cleanup, push straight to the
   fork's full URL instead of re-adding a named remote.

### 5. Expect (and don't chase) the "Sample validation" false-negative
The `Sample validation` PR check will likely fail after pushing — this is
**expected** for brand-new samples using the canonical
`raw.githubusercontent.com/pnp/sp-dev-fx-aces/main/...` thumbnail URLs, since
those files don't exist on `main` until after merge. Confirm (once, cache the
finding) that `main` has no branch-protection rule requiring this check:

```bash
gh api repos/pnp/sp-dev-fx-aces/branches/main/protection
```

If unprotected, this check failing does not block merging. Do not "fix" it by
pointing thumbnails at the contributor's fork/branch instead — that's the
wrong long-term URL.

### 6. Wait for explicit merge go-ahead, then merge matching repo convention
This repo merges via **merge commit** (not squash/rebase) — confirm if unsure:
```bash
git log origin/main --oneline -10   # look for "Merge pull request #NNN" pattern
```
Only after the user explicitly says to merge:
```bash
gh pr merge <PR_NUMBER> --repo pnp/sp-dev-fx-aces --merge
```

### 7. Post a thank-you comment on the PR
After a successful merge, thank the contributor and invite them to present the
sample in a community call. Get their GitHub login from the PR (already fetched
in step 1 as `author`), then post:

```
Thank you @<author> for this new sample. If you would like to present your work in a community call please fill out the form https://aka.ms/community/request/demo
```

```bash
gh pr comment <PR_NUMBER> --repo pnp/sp-dev-fx-aces --body "Thank you @<author> for this new sample. If you would like to present your work in a community call please fill out the form https://aka.ms/community/request/demo"
```

Show the exact rendered text (with the real username substituted) to the user
before posting — this is a public, PR-visible comment, so confirm the target
PR and wording are right before running it. Only post once per merged PR.

### 8. Clean up
```bash
./.github/skills/verify-new-sample-pr/scripts/cleanup-sample-build.sh <abs-path>/samples/<SampleName>
rm -rf <abs-path>/samples/<SampleName>/node_modules
git checkout -- samples/<SampleName>/package-lock.json   # discard incidental npm-install diff, if any
git checkout main && git pull origin main
git branch -D <pr-branch-name>
git status --short   # confirm only pre-existing unrelated changes remain (e.g. uncommitted skill files)
```
Only remove a fork remote you added yourself for this session if it's no longer needed.

## Notes
- Never push, merge, or clean up without having reached the corresponding pause
  point above — this skill exists to make the *sequence* consistent, not to
  remove the user's checkpoints.
- If the PR touches more than one sample folder, or isn't a clean new-sample
  PR, stop and flag it (same as `verify-new-sample-pr`).
- See `/memories/repo/sp-dev-fx-aces-build-verify.md` for the accumulated
  quirks (disk space, nvm, auth, LFS, validation false-negative) this skill
  references.
