#!/usr/bin/env bash
# Checks whether a candidate "name" value (pnp-sp-fx-aces-*) already exists in
# any samples/**/assets/sample.json or scenarios/**/assets/sample.json in the repo.
# Usage: check-name-uniqueness.sh <candidate-name> [repo-root]
set -euo pipefail

CANDIDATE="${1:?Usage: check-name-uniqueness.sh <candidate-name> [repo-root]}"
ROOT="${2:-.}"

MATCHES=$(jq -r '.[].name' "$ROOT"/samples/*/assets/sample.json "$ROOT"/scenarios/*/assets/sample.json 2>/dev/null | grep -Fx "$CANDIDATE" || true)

if [[ -n "$MATCHES" ]]; then
  echo "COLLISION: '$CANDIDATE' is already used by an existing sample.json" >&2
  grep -rl "\"name\": *\"$CANDIDATE\"" "$ROOT"/samples/*/assets/sample.json "$ROOT"/scenarios/*/assets/sample.json 2>/dev/null || true
  exit 1
fi

echo "OK: '$CANDIDATE' is unique"
