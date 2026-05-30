#!/usr/bin/env sh
set -eu

PROJECT_ROOT="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
CHECK_ONLY="${1:-}"

step() {
  printf '\n==> %s\n' "$1"
}

cd "$PROJECT_ROOT"

printf 'MoodWeave one-click starter\n'
printf 'Project: %s\n' "$PROJECT_ROOT"

if ! command -v node >/dev/null 2>&1; then
  printf '\nNode.js is not installed or not available in PATH.\n' >&2
  printf 'Install Node.js 20.19+ or 22.12+ from https://nodejs.org/ and run this script again.\n' >&2
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  printf '\nnpm is not installed or not available in PATH.\n' >&2
  printf 'Install Node.js from https://nodejs.org/ because npm is bundled with the official installer.\n' >&2
  exit 1
fi

NODE_VERSION="$(node -p 'process.versions.node')"
if ! node -e 'const [major, minor, patch] = process.versions.node.split(".").map(Number); const ok = (major === 20 && (minor > 19 || (minor === 19 && patch >= 0))) || (major >= 22 && (major > 22 || minor > 12 || (minor === 12 && patch >= 0))); process.exit(ok ? 0 : 1);'; then
  printf '\nUnsupported Node.js version: v%s\n' "$NODE_VERSION" >&2
  printf 'MoodWeave uses Vite 8, which requires Node.js 20.19+ or 22.12+.\n' >&2
  exit 1
fi

step "Node and npm detected"
printf 'Node: %s\n' "$(node -v)"
printf 'npm:  %s\n' "$(npm -v)"

if [ ! -d "$PROJECT_ROOT/node_modules" ]; then
  step "Installing dependencies"
  npm install
else
  step "Dependencies already installed"
fi

if [ ! -f "$PROJECT_ROOT/.env" ]; then
  printf '\nOptional: create .env from .env.example if you want AI image generation.\n'
  printf 'The app still starts without an API key.\n'
fi

if [ "$CHECK_ONLY" = "--check" ]; then
  step "Environment check complete"
  exit 0
fi

step "Starting MoodWeave"
printf 'Open http://127.0.0.1:5173 in your browser.\n'
npm run start
