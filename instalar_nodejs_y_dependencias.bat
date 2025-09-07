@echo off
echo ========================================
echo   INSTALADOR AUTOMATICO - RED MAFIA KIRO
echo ========================================
echo.

echo [1/4] Verificando si Node.js esta instalado...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Node.js ya esta instalado
    node --version
    goto :instalar_dependencias
) else (
    echo ❌ Node.js no esta instalado
)

echo.
echo [2/4] Descargando Node.js...
powershell -Command "Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.10.0/node-v20.10.0-x64.msi' -OutFile 'nodejs-installer.msi'"

echo.
echo [3/4] Instalando Node.js...
msiexec /i nodejs-installer.msi /quiet /norestart

echo.
echo [4/4] Esperando instalacion...
timeout /t 10 /nobreak >nul

echo.
echo ✅ Instalacion completada!
echo.
echo Ahora ejecutando: npm install
echo.

REM Refrescar PATH
call refrescar_path.bat

REM Instalar dependencias
npm install

if %errorlevel% equ 0 (
    echo.
    echo ✅ ¡TODAS LAS DEPENDENCIAS INSTALADAS CORRECTAMENTE!
    echo.
    echo Ahora puedes ejecutar:
    echo   npm run dev    - Para iniciar el servidor
    echo   npm run build  - Para construir el proyecto
    echo.
) else (
    echo.
    echo ❌ Error al instalar dependencias
    echo Intenta ejecutar manualmente: npm install
    echo.
)

echo.
echo Presiona cualquier tecla para salir...
pause >nul

:instalar_dependencias
echo.
echo Instalando dependencias del proyecto...
npm install

if %errorlevel% equ 0 (
    echo.
    echo ✅ ¡DEPENDENCIAS INSTALADAS CORRECTAMENTE!
    echo.
    echo Ahora puedes ejecutar:
    echo   npm run dev    - Para iniciar el servidor
    echo   npm run build  - Para construir el proyecto
    echo.
) else (
    echo.
    echo ❌ Error al instalar dependencias
    echo Intenta ejecutar manualmente: npm install
    echo.
)

echo.
echo Presiona cualquier tecla para salir...
pause >nul
