#!/usr/bin/env bash
# Downloads all Liatrio brand logos from liatrio.com into assets/logos/.
# Run this before committing if you need refreshed bundled logo assets.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ASSETS_DIR="$SCRIPT_DIR/../assets/logos"
BRAND_API="https://www.liatrio.com/brand-data.json"
BASE_URL="https://www.liatrio.com"
BASE_URL="${BASE_URL%/}"

mkdir -p "$ASSETS_DIR"
echo "Fetching brand data from $BRAND_API..."
BRAND_DATA=$(curl -sfS --connect-timeout 10 --max-time 30 --retry 3 --retry-delay 1 "$BRAND_API")

echo "$BRAND_DATA" | jq -r '.. | objects | (.svgFile?, .pngFile?) | select(type == "string" and length > 0)' | while read -r path; do
  normalized_path="${path//\\//}"
  filename=$(basename "$normalized_path")
  if [[ "$normalized_path" =~ ^https?:// ]]; then
    url="$normalized_path"
  else
    url="$BASE_URL/${normalized_path#/}"
  fi
  echo "Downloading $filename..."
  if ! curl -sfS --connect-timeout 10 --max-time 60 --retry 3 --retry-delay 1 "$url" -o "$ASSETS_DIR/$filename"; then
    echo "Failed to download $url" >&2
    continue
  fi
done

echo "Done. Assets saved to $ASSETS_DIR"
