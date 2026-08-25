@echo off
echo Starting Express Backend...
start /B node backend/server.js

echo.
echo Starting Vite React Frontend...
start /B npm run dev

echo.
echo Both servers are now running in this window!
echo Press Ctrl+C or close the window to stop them.
echo.
