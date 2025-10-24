@echo off
echo Starting ContentGen Application...
echo.

REM Start Backend in new window
echo [1/2] Starting Backend Server...
start "ContentGen Backend" cmd /k "cd /d %~dp0backend && poetry run uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload"

REM Wait 3 seconds for backend to initialize
timeout /t 3 /nobreak >nul

REM Start Frontend in new window
echo [2/2] Starting Frontend Server...
start "ContentGen Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ========================================
echo   ContentGen is starting!
echo ========================================
echo   Backend:  http://127.0.0.1:8000
echo   Frontend: http://localhost:5173
echo ========================================
echo.
echo Press any key to close this window...
pause >nul
