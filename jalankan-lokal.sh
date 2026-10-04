#!/usr/bin/env bash
set -e
cd -- "$(dirname -- "$0")"
printf 'Buka http://localhost:8080 di browser. Hentikan dengan Ctrl+C.\n'
python3 -m http.server 8080 --bind 127.0.0.1
