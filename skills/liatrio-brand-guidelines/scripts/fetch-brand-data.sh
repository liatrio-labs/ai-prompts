#!/usr/bin/env bash
# Fetches the latest Liatrio brand data from the official API.
# Use this when you need always-current brand information.
set -euo pipefail

curl -sfS --connect-timeout 10 --max-time 30 https://www.liatrio.com/brand-data.json | jq .
