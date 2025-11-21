# Script para iniciar o backend Python
Write-Host "🚀 Iniciando servidor FastAPI..." -ForegroundColor Green
Write-Host ""

$backendPath = "c:\Users\silva\OneDrive\Área de Trabalho\AED2\Ecomerce-AEDII\backend"

cd $backendPath

# Verifica se o uvicorn está instalado
$uvicornCheck = pip show uvicorn 2>$null

if (-not $uvicornCheck) {
    Write-Host "⚠️  Instalando dependências..." -ForegroundColor Yellow
    pip install -r requirements.txt
    Write-Host ""
}

Write-Host "✅ Servidor FastAPI iniciado em: http://localhost:8000" -ForegroundColor Cyan
Write-Host "📚 Documentação da API: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""

uvicorn app:app --reload --host 0.0.0.0 --port 8000
