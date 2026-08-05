#!/usr/bin/env bash
# Prints any Microsoft Graph / SharePoint API permission requests declared by
# the sample. These require manual admin approval (SharePoint Admin Center ->
# API access) after the package is deployed, or the ACE fails at runtime.
# Usage: get-api-permissions.sh samples/<SampleName>
set -euo pipefail

SAMPLE_DIR="${1:?Usage: get-api-permissions.sh samples/<SampleName>}"
FILE="$SAMPLE_DIR/config/package-solution.json"

if [[ ! -f "$FILE" ]]; then
  echo "No config/package-solution.json found in $SAMPLE_DIR"
  exit 0
fi

jq -r '
  .solution.webApiPermissionRequests // []
  | if length == 0 then
      "None declared in config/package-solution.json"
    else
      (.[] | "- \(.resource): \(.scope)")
    end
' "$FILE"
