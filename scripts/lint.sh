#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "[lint] PHP syntax checks"
while IFS= read -r file; do
  php -l "$file" >/dev/null
  echo "  ok $file"
done < <(rg --files app api public/api -g '*.php')

echo "[lint] JS syntax checks"
while IFS= read -r file; do
  node --check "$file" >/dev/null
  echo "  ok $file"
done < <(rg --files public -g '*.js')

echo "[lint] complete"
