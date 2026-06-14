#!/usr/bin/env bash
# 사용법: codemod-toolkit-react.sh <대상디렉토리>
# @withwiz/toolkit/react → @withwiz/ui/react (순수 prefix). 비-react 경로 불변.
set -euo pipefail
ROOT="${1:?대상 디렉토리 필요}"
grep -rl '@withwiz/toolkit/react' "$ROOT" \
  --include='*.ts' --include='*.tsx' --include='*.js' --include='*.jsx' \
  2>/dev/null | while read -r f; do
  sed -i '' 's#@withwiz/toolkit/react#@withwiz/ui/react#g' "$f"
done
