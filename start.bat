@echo off
title Happy Birthday Jannat - App Launcher
cd /d "%~dp0"
echo ========================================================
echo   Launching Happy Birthday Jannat - PWA ^& Desktop App
echo ========================================================
echo.

:: Start local Python web server on port 8000 in background
start /b "" python -m http.server 8000 --bind 127.0.0.1 >nul 2>&1

:: Brief pause for server startup
timeout /t 1 /nobreak >nul 2>&1

:: Try to launch Chrome in native borderless app window mode
start "" chrome --app=http://localhost:8000/index.html 2>nul
if %errorlevel% equ 0 goto done

:: Otherwise try Microsoft Edge in native borderless app window mode
start "" msedge --app=http://localhost:8000/index.html 2>nul
if %errorlevel% equ 0 goto done

:: Fallback: Open in default browser
start http://localhost:8000/index.html

:done
echo.
echo Website launched at http://localhost:8000/
echo You can now install it via browser or keep this window.
