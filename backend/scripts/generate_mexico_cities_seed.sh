#!/usr/bin/env bash
set -euo pipefail

# Downloads GeoNames cities1000.zip, extracts, and runs the Node generator to create mexico_cities_seed.json
# Usage: ./generate_mexico_cities_seed.sh [output-path]

OUT=${1:-"$(dirname "$0")/mexico_cities_seed.json"}
TMPDIR=$(mktemp -d)
URL="https://download.geonames.org/export/dump/cities1000.zip"

echo "Downloading GeoNames cities1000.zip to $TMPDIR..."
curl -sSL "$URL" -o "$TMPDIR/cities1000.zip"

echo "Extracting cities1000.txt..."
unzip -p "$TMPDIR/cities1000.zip" > "$TMPDIR/cities1000.txt"

echo "Generating seed JSON at $OUT..."
node "$(dirname "$0")/generate_mexico_cities_seed.js" "$TMPDIR/cities1000.txt" "$OUT"

echo "Cleaning up..."
rm -rf "$TMPDIR"

echo "Done."
