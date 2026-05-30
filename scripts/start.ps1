param(
  [switch]$CheckOnly
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $PSScriptRoot

function Write-Step($Message) {
  Write-Host ""
  Write-Host "==> $Message" -ForegroundColor Cyan
}

function Test-Command($Name) {
  return $null -ne (Get-Command $Name -ErrorAction SilentlyContinue)
}

function Get-NodeVersion() {
  return [version]((& node -v).Trim().TrimStart("v"))
}

Set-Location $ProjectRoot

Write-Host "MoodWeave one-click starter" -ForegroundColor Magenta
Write-Host "Project: $ProjectRoot"

if (-not (Test-Command "node")) {
  Write-Host ""
  Write-Host "Node.js is not installed or not available in PATH." -ForegroundColor Red
  Write-Host "Install Node.js 20.19+ or 22.12+ from https://nodejs.org/ and run this script again."
  exit 1
}

if (-not (Test-Command "npm")) {
  Write-Host ""
  Write-Host "npm is not installed or not available in PATH." -ForegroundColor Red
  Write-Host "Install Node.js from https://nodejs.org/ because npm is bundled with the official installer."
  exit 1
}

$nodeVersion = Get-NodeVersion
if (
  -not (
    ($nodeVersion -ge [version]'20.19.0' -and $nodeVersion -lt [version]'21.0.0') -or
    ($nodeVersion -ge [version]'22.12.0')
  )
) {
  Write-Host ""
  Write-Host "Unsupported Node.js version: $(& node -v)" -ForegroundColor Red
  Write-Host "MoodWeave uses Vite 8, which requires Node.js 20.19+ or 22.12+."
  exit 1
}

Write-Step "Node and npm detected"
Write-Host "Node: $(& node -v)"
Write-Host "npm:  $(& npm -v)"

if (-not (Test-Path -LiteralPath (Join-Path $ProjectRoot "node_modules"))) {
  Write-Step "Installing dependencies"
  npm install
} else {
  Write-Step "Dependencies already installed"
}

if (-not (Test-Path -LiteralPath (Join-Path $ProjectRoot ".env"))) {
  Write-Host ""
  Write-Host "Optional: create .env from .env.example if you want AI image generation." -ForegroundColor Yellow
  Write-Host "The app still starts without an API key."
}

if ($CheckOnly) {
  Write-Step "Environment check complete"
  exit 0
}

Write-Step "Starting MoodWeave"
Write-Host "Open http://127.0.0.1:5173 in your browser."
npm run start
