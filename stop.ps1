# ContentGen Stop Script
Write-Host ""
Write-Host "Stopping ContentGen Application..." -ForegroundColor Yellow
Write-Host ""

# Stop Python (Backend)
$pythonProcesses = Get-Process python -ErrorAction SilentlyContinue
if ($pythonProcesses) {
    $pythonProcesses | Stop-Process -Force
    Write-Host "[OK] Backend stopped" -ForegroundColor Green
} else {
    Write-Host "[INFO] No backend running" -ForegroundColor Gray
}

# Stop Node (Frontend)
$nodeProcesses = Get-Process node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    $nodeProcesses | Stop-Process -Force
    Write-Host "[OK] Frontend stopped" -ForegroundColor Green
} else {
    Write-Host "[INFO] No frontend running" -ForegroundColor Gray
}

Write-Host ""
Write-Host "All servers stopped!" -ForegroundColor Cyan
Write-Host ""
