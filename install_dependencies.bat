@echo off
echo Instalando dependencias de Red Mafia Kiro...
echo.

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js no está instalado o no está en el PATH
    echo Por favor instala Node.js desde https://nodejs.org/
    pause
    exit /b 1
)

REM Verificar si npm está disponible
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm no está disponible
    pause
    exit /b 1
)

echo Node.js y npm encontrados correctamente
echo.

REM Instalar dependencias
echo Instalando dependencias...
npm install

if %errorlevel% neq 0 (
    echo ERROR: Falló la instalación de dependencias
    pause
    exit /b 1
)

echo.
echo ¡Dependencias instaladas correctamente!
echo.
echo Ahora puedes ejecutar:
echo   npm run dev    - Para iniciar el servidor de desarrollo
echo   npm run build  - Para construir el proyecto
echo.
pause
