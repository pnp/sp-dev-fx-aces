---
name: generate-sample-metadata
description: 'Create or fix the assets/sample.json metadata file for a sample in pnp/sp-dev-fx-aces before merging a new-sample PR. Use when: a new-sample PR is missing assets/sample.json, "create sample.json", "generate sample metadata", "add sample.json before merge". Derives name/title/description/thumbnails/authors from the sample README, package.json/.yo-rc.json and assets folder, checks the generated "name" for uniqueness against every other sample.json in the repo, validates required fields against templates/metadata-schema.json, and writes samples/<SampleName>/assets/sample.json in the same array format used by every other sample.'
argument-hint: '<samples/SampleName path, or PR number>'
---

# Generate Sample Metadata (assets/sample.json)

Every sample under `samples/<Name>/` (and `scenarios/<Name>/`) must ship an
`assets/sample.json` file. A GitHub Action
([merge-sample-json.yml](../../workflows/merge-sample-json.yml)) concatenates all
of these files on every push to `main` into `samples.json` on the `gh-pages`
branch (the data source for the public samples gallery), and validates the
result against [templates/metadata-schema.json](../../../templates/metadata-schema.json).
A missing or malformed `assets/sample.json` breaks that build — this is why it
must exist and be correct **before merging**, not after.

This is a companion to `verify-new-sample-pr` — run that skill first to build
and manually test the sample, then use this skill as the final step before merge.

## When to Use
- A new-sample PR does not include `samples/<Name>/assets/sample.json`
- One was included but looks incomplete/copy-pasted (e.g. still has the literal
  word `TODO` from [sample-metadatatemplate.json](../../../samples/sample-metadatatemplate.json))
- You need to double check an existing `sample.json` against the schema before merge

## Reference material
- [samples/sample-metadatatemplate.json](../../../samples/sample-metadatatemplate.json) — the blank template (all `TODO` placeholders)
- [templates/metadata-schema.json](../../../templates/metadata-schema.json) — the JSON schema every entry must satisfy
- Any existing `samples/*/assets/sample.json` — real-world examples of the format, including multi-author and `company`/`categories` usage

## Procedure

### 1. Identify the sample folder
If given a PR number instead of a path, find the affected folder(s) the same
way `verify-new-sample-pr` does:

```bash
gh pr view <PR_NUMBER> --repo pnp/sp-dev-fx-aces --json files --jq '.files[].path' \
  | grep -oE '^samples/[^/]+' | sort -u
```

Check whether `assets/sample.json` already exists in that folder before doing
anything else — if it exists, skip to step 6 (validate) instead of generating
from scratch.

### 2. Gather raw facts
Run [gather-sample-facts.sh](./scripts/gather-sample-facts.sh) against the
sample's **absolute path** — it reports the SPFx version, whether React is a
dependency, the image files available in `assets/` (thumbnail candidates), the
README's Compatibility badges, and the README's Solution/Authors table, all
read-only:

```bash
./.github/skills/generate-sample-metadata/scripts/gather-sample-facts.sh <abs-path>/samples/<SampleName>
```

Also read the full `README.md` `## Summary` section for the description text.

### 3. Derive each field

| Field | How to derive it |
|---|---|
| `name` | `pnp-sp-fx-aces-<slug>` where `<slug>` is the folder name lowercased, with any character that isn't `a-z0-9` collapsed to `-`. Must be globally unique — verify with step 4 before finalizing. |
| `source` | Always the literal string `"pnp"`. |
| `title` | From the README's H1. If it still contains discouraged terms per the README template guidance (`SharePoint`, `WebPart`, `React`, `Angular`, `JavaScript`, `SPFx`, `ACE`/`sample`), flag it to the user instead of silently rewriting — title wording is subjective and worth a human look. |
| `shortDescription` | First sentence/paragraph of the README `## Summary` section (strip any leftover `>` template guidance lines). |
| `longDescription` | Array with one string — can reuse the full `## Summary` paragraph(s) verbatim. |
| `url` | `https://github.com/pnp/sp-dev-fx-aces/tree/main/samples/<SampleName>` (must match the schema's URL pattern exactly, including `tree/main/samples/`). |
| `creationDateTime` / `updateDateTime` | Today's date in `YYYY-MM-DD` (both the same for a brand-new sample). |
| `products` | Default `["SharePoint", "Office"]`. Add `"Viva"` if the README Compatibility section badges or text mention Viva Connections/Teams support. |
| `metadata` | `{"key": "CLIENT-SIDE-DEV", "value": "React"}` if `react` is a dependency (from `gather-sample-facts.sh`), else `"None"`. Plus `{"key": "SPFX-VERSION", "value": "<version>"}` from `.yo-rc.json`. |
| `thumbnails` | One entry per image file found in `assets/` (from `gather-sample-facts.sh`): `{"type": "image", "order": 100, "url": "https://raw.githubusercontent.com/pnp/sp-dev-fx-aces/main/samples/<SampleName>/assets/<file>", "alt": "Preview"}`. If no images exist, stop and tell the user — the contributor must add a screenshot (required per `CONTRIBUTING.md`) before this can be completed. |
| `authors` | Parse the README `## Solution` table row(s): `[Author Name](GitHubProfileUrl)` → `gitHubAccount` (last path segment of the URL) and `name`; `([@handle](https://twitter.com/handle))` → `twitter` (optional field, omit if absent); trailing text after the comma → `company` (optional, omit if absent). Always add `pictureUrl` as `https://github.com/<gitHubAccount>.png`. If the table is missing/unparseable, fall back to the PR author's GitHub login (`gh pr view <PR> --json author --jq .author.login`) as `gitHubAccount` and ask the user to confirm the display `name` since it can't be reliably inferred. |
| `references` | Default to keeping the standard entry used by virtually every existing sample: `{"name": "Viva Connections Extensibility guidance", "description": "Adaptive Card Extensions are client-side components that run in the context of a SharePoint page.", "url": "https://aka.ms/viva/connections/extensibility"}`. Add more only if the sample's README references something specific worth linking. |

### 4. Check name uniqueness
Never skip this — the schema doesn't enforce uniqueness, but a duplicate
`name` will confuse the public samples gallery data:

```bash
./.github/skills/generate-sample-metadata/scripts/check-name-uniqueness.sh pnp-sp-fx-aces-<slug>
```

If it collides, adjust the slug (e.g. include more of the folder name) and
re-check.

### 5. Write the file
Write a JSON array with a single object (matching the format of every existing
`samples/*/assets/sample.json`) to `samples/<SampleName>/assets/sample.json`.
Show the generated content to the user before finalizing — `title`,
`shortDescription`, and `authors` involve subjective/promotional wording a
human should sanity-check, not just structurally-valid JSON.

### 6. Validate required fields
Per `templates/metadata-schema.json`, these top-level fields are required:
`name`, `source`, `title`, `url`, `shortDescription`, `products`, `metadata`,
`thumbnails`, `authors`, `creationDateTime`, `updateDateTime`. Confirm none are
missing/empty, and that:
- `url` matches `https://github.com/pnp/sp-dev-fx-aces/tree/main/(samples|scenarios)/...`
- `name` matches `pnp-sp-fx-aces-.*`
- every `thumbnails[].url` actually resolves to a file that exists in `assets/`
- every `authors[].gitHubAccount` matches `^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$`

You can sanity-check the JSON is well-formed with:

```bash
jq . samples/<SampleName>/assets/sample.json
```

### 7. Hand off
This file needs to end up on the same branch as the rest of the PR's changes
before merging (see the maintainer-edits-a-PR guidance in repo memory /
`CONTRIBUTING.md` discussion) — either push it to the contributor's PR branch
yourself (if maintainer edits are allowed) or ask the contributor to add it.
Do not merge the PR yourself; only prepare and report the file.

## Notes
- Never fabricate an author's name, company, or Twitter handle — omit optional
  fields rather than guess, and ask the user when the README doesn't state them.
- Reuse an existing `samples/*/assets/sample.json` as a structural reference if
  unsure about formatting — the format has stayed consistent for years.
- This skill only produces/validates the metadata file — it does not build the
  sample or test the `.sppkg`. Use `verify-new-sample-pr` for that.
- **Expect the "Sample validation" PR check to fail** after you push this file
  for a brand-new sample — it fetches every `thumbnails[].url` and expects
  HTTP 200, but a URL pointing at `raw.githubusercontent.com/pnp/sp-dev-fx-aces/main/...`
  (the correct, canonical form used here) 404s until the PR is actually merged.
  This is a known false-negative, not a defect in the generated file — do not
  "fix" it by pointing thumbnails at the contributor's own fork/branch instead,
  that's the wrong long-term URL. Confirm `main` has no branch protection
  requiring this check before telling the user it's safe to merge anyway.
