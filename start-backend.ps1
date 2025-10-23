# Start ContentGen Backend Server
Write-Host "🚀 Starting ContentGen Backend..." -ForegroundColor Green
Set-Location "d:\MCA-RVCE\Projects\C-Gen-3\backend"
poetry run uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
