#!/usr/bin/env bash
# Gathers raw facts about a sample folder to help populate assets/sample.json:
# SPFx version, whether React is used, existing assets (images), and whether
# assets/sample.json already exists. Read-only, makes no changes.
# Usage: gather-sample-facts.sh <abs-path-to-sample-folder>
set -euo pipefail

DIR="${1:?Usage: gather-sample-facts.sh <abs-path-to-sample-folder>}"

echo "== Folder =="
basename "$DIR"

echo
echo "== SPFx version (.yo-rc.json) =="
jq -r '.["@microsoft/generator-sharepoint"].version // "not found"' "$DIR/.yo-rc.json" 2>/dev/null || echo "no .yo-rc.json"

echo
echo "== React dependency (package.json) =="
jq -r 'if (.dependencies.react // .devDependencies.react) then "React: " + (.dependencies.react // .devDependencies.react) else "No react dependency found" end' "$DIR/package.json" 2>/dev/null || echo "no package.json"

echo
echo "== Existing assets/sample.json? =="
if [[ -f "$DIR/assets/sample.json" ]]; then
  echo "EXISTS: $DIR/assets/sample.json"
else
  echo "MISSING"
fi

echo
echo "== Image files in assets/ (candidates for thumbnails) =="
find "$DIR/assets" -maxdepth 1 -type f \( -iname '*.png' -o -iname '*.gif' -o -iname '*.jpg' -o -iname '*.jpeg' \) 2>/dev/null | sort || echo "no assets folder"

echo
echo "== README.md compatibility badges =="
grep -m1 -A5 '^## Compatibility' "$DIR/README.md" 2>/dev/null || echo "no Compatibility section found"

echo
echo "== README.md Solution/Authors table =="
awk '/^## Solution/{flag=1} flag; /^## Version history/{flag=0}' "$DIR/README.md" 2>/dev/null || echo "no Solution section found"
