#!/usr/bin/env bash
# Prints the unique samples/<Name> directories touched by a PR.
# Usage: get-changed-samples.sh <PR_NUMBER> [repo]
set -euo pipefail

PR_NUMBER="${1:?Usage: get-changed-samples.sh <PR_NUMBER> [owner/repo]}"
REPO="${2:-pnp/sp-dev-fx-aces}"

gh pr view "$PR_NUMBER" --repo "$REPO" --json files --jq '.files[].path' \
  | grep -oE '^samples/[^/]+' \
  | sort -u
