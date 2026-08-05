#!/usr/bin/env bash
# Detects whether a PR is a "new sample" PR or an upgrade/bug-fix/feature PR,
# based on the repo's PR template Q&A table in the PR body.
# Usage: get-pr-type.sh <PR_NUMBER> [owner/repo]
# Prints one of: new-sample | upgrade-or-fix | ambiguous
set -euo pipefail

PR_NUMBER="${1:?Usage: get-pr-type.sh <PR_NUMBER> [owner/repo]}"
REPO="${2:-pnp/sp-dev-fx-aces}"

BODY=$(gh pr view "$PR_NUMBER" --repo "$REPO" --json body --jq '.body')

# Extract the answer cell for a given Q&A row label, e.g. "| New sample? | yes |"
extract_answer() {
  local label="$1"
  { printf '%s\n' "$BODY" \
    | grep -iE "\\|[[:space:]]*${label}\\??[[:space:]]*\\|" \
    | head -1 \
    | sed -E "s/.*\\|[[:space:]]*${label}\\??[[:space:]]*\\|[[:space:]]*([^|]*)\\|.*/\\1/I" \
    | tr -d '[:space:]' \
    | tr '[:upper:]' '[:lower:]'; } || true
}

NEW_SAMPLE_ANSWER=$(extract_answer "new sample")
NEW_FEATURE_ANSWER=$(extract_answer "new feature")
BUG_FIX_ANSWER=$(extract_answer "bug fix")

if [[ "$NEW_SAMPLE_ANSWER" == "yes" ]]; then
  echo "new-sample"
elif [[ "$NEW_SAMPLE_ANSWER" == *"no-yes"* ]]; then
  echo "ambiguous"
elif [[ "$NEW_FEATURE_ANSWER" == "yes" || "$BUG_FIX_ANSWER" == "yes" || "$NEW_SAMPLE_ANSWER" == "no" ]]; then
  echo "upgrade-or-fix"
else
  echo "ambiguous"
fi
