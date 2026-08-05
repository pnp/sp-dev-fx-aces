#!/usr/bin/env bash
# Removes generated build/install artifacts from a sample folder after a
# local build verification, so `git status` is clean again.
# Does NOT `cd` - operates directly on the given path (absolute or relative to
# wherever this script is invoked from), so it's immune to stale shell cwd.
# Usage: cleanup-sample-build.sh /abs/path/to/samples/<SampleName>
set -euo pipefail

SAMPLE_DIR="${1:?Usage: cleanup-sample-build.sh /abs/path/to/samples/<SampleName>}"

if [[ ! -d "$SAMPLE_DIR" ]]; then
  echo "No such directory: $SAMPLE_DIR" >&2
  exit 1
fi

rm -rf \
  "$SAMPLE_DIR/node_modules" \
  "$SAMPLE_DIR/dist" \
  "$SAMPLE_DIR/lib" \
  "$SAMPLE_DIR/lib-commonjs" \
  "$SAMPLE_DIR/lib-esm" \
  "$SAMPLE_DIR/lib-dts" \
  "$SAMPLE_DIR/temp" \
  "$SAMPLE_DIR/jest-output" \
  "$SAMPLE_DIR/.heft" \
  "$SAMPLE_DIR/coverage" \
  "$SAMPLE_DIR/release" \
  "$SAMPLE_DIR/sharepoint"

echo "Cleaned build artifacts in $SAMPLE_DIR"
