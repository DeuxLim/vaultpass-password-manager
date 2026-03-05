#!/usr/bin/env bash
set -euo pipefail

out_path="${1:-}"
if [[ -z "$out_path" ]]; then
  echo "usage: $0 <output.sql>"
  exit 2
fi

if [[ -e "$out_path" ]]; then
  echo "[backup] Refusing to overwrite existing file: $out_path"
  exit 2
fi

DB_HOST="${DB_HOST:-127.0.0.1}"
DB_PORT="${DB_PORT:-3306}"
DB_NAME="${DB_NAME:-}"
DB_USER="${DB_USER:-}"
DB_PASS="${DB_PASS:-}"

if [[ -z "$DB_NAME" || -z "$DB_USER" ]]; then
  echo "[backup] Missing DB_NAME/DB_USER env vars (see .env.example)"
  exit 2
fi

mkdir -p "$(dirname "$out_path")"

echo "[backup] Dumping $DB_NAME -> $out_path"

mysqldump \
  --host="$DB_HOST" \
  --port="$DB_PORT" \
  --user="$DB_USER" \
  --password="$DB_PASS" \
  --single-transaction \
  --quick \
  --routines \
  --triggers \
  --databases "$DB_NAME" > "$out_path"

echo "[backup] Done"

