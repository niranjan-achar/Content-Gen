@echo off
echo Stopping ContentGen Application...

REM Kill all Python processes (backend)
taskkill /F /IM python.exe 2>nul
if %errorlevel% equ 0 (
    echo [OK] Backend stopped
) else (
    echo [INFO] No backend running
)

REM Kill all Node processes (frontend)
taskkill /F /IM node.exe 2>nul
if %errorlevel% equ 0 (
    echo [OK] Frontend stopped
) else (
    echo [INFO] No frontend running
)

echo.
echo All servers stopped!
timeout /t 2 /nobreak >nul
