# Script de instalación de dependencias para Red Mafia Kiro
Write-Host "Instalando dependencias de Red Mafia Kiro..." -ForegroundColor Green
Write-Host ""

# Verificar si Node.js está instalado
try {
    $nodeVersion = node --version 2>$null
    Write-Host "Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Node.js no está instalado o no está en el PATH" -ForegroundColor Red
    Write-Host "Por favor instala Node.js desde https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Presiona Enter para salir"
    exit 1
}

# Verificar si npm está disponible
try {
    $npmVersion = npm --version 2>$null
    Write-Host "npm encontrado: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: npm no está disponible" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}

Write-Host ""
Write-Host "Instalando dependencias..." -ForegroundColor Yellow

# Instalar dependencias
try {
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "¡Dependencias instaladas correctamente!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Ahora puedes ejecutar:" -ForegroundColor Cyan
        Write-Host "  npm run dev    - Para iniciar el servidor de desarrollo" -ForegroundColor White
        Write-Host "  npm run build  - Para construir el proyecto" -ForegroundColor White
        Write-Host ""
    } else {
        Write-Host "ERROR: Falló la instalación de dependencias" -ForegroundColor Red
    }
} catch {
    Write-Host "ERROR: Error durante la instalación: $_" -ForegroundColor Red
}

Read-Host "Presiona Enter para salir"
