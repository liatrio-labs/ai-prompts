#!/usr/bin/env bash
# Downloads all Liatrio brand logos from liatrio.com into assets/logos/.
# Run this before committing if you need refreshed bundled logo assets.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ASSETS_DIR="$SCRIPT_DIR/../assets/logos"
BRAND_API="https://www.liatrio.com/brand-data.json"
BASE_URL="https://www.liatrio.com"

mkdir -p "$ASSETS_DIR"
echo "Fetching brand data from $BRAND_API..."
BRAND_DATA=$(curl -sf "$BRAND_API")

echo "$BRAND_DATA" | jq -r '.. | objects | (.svgFile?, .pngFile?) | select(. != null)' | while read -r path; do
  filename=$(basename "$path")
  url="$BASE_URL$path"
  echo "Downloading $filename..."
  curl -sf "$url" -o "$ASSETS_DIR/$filename"
done

echo "Done. Assets saved to $ASSETS_DIR"
