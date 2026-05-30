@echo off
setlocal

set "ROOT=%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%ROOT%scripts\start.ps1"

if errorlevel 1 (
  echo.
  echo MoodWeave failed to start. See the message above for the next step.
  pause
)
