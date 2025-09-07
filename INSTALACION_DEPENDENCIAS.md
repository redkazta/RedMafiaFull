# 🔧 Instalación de Dependencias - Red Mafia Kiro

## 🚨 Problema Detectado
El proyecto necesita instalar `lucide-react` y otras dependencias, pero Node.js no está disponible en la terminal actual.

## 📋 Soluciones Disponibles

### Opción 1: Ejecutar Scripts de Instalación
He creado dos scripts que puedes ejecutar:

#### Script de Windows (Recomendado)
```bash
# Doble clic en el archivo o ejecutar en terminal:
install_dependencies.bat
```

#### Script de PowerShell
```powershell
# Ejecutar en PowerShell:
.\install_dependencies.ps1
```

### Opción 2: Instalación Manual
Si los scripts no funcionan, sigue estos pasos:

1. **Instalar Node.js** (si no está instalado):
   - Ve a https://nodejs.org/
   - Descarga la versión LTS
   - Instala siguiendo las instrucciones

2. **Abrir nueva terminal**:
   - Presiona `Win + R`
   - Escribe `cmd` o `powershell`
   - Presiona Enter

3. **Navegar al proyecto**:
   ```bash
   cd "C:\Users\Angel Castañeda\Desktop\red-mafia-kiro"
   ```

4. **Instalar dependencias**:
   ```bash
   npm install
   ```

5. **Verificar instalación**:
   ```bash
   npm list lucide-react
   ```

### Opción 3: Usar Visual Studio Code
Si usas VS Code:

1. Abre la terminal integrada (`Ctrl + `` ` ``)
2. Ejecuta: `npm install`
3. Verifica que se instaló correctamente

## ✅ Verificación
Después de la instalación, deberías ver:
- `lucide-react` en `node_modules/`
- `package-lock.json` actualizado
- Sin errores de importación en el código

## 🚀 Ejecutar el Proyecto
Una vez instaladas las dependencias:

```bash
npm run dev
```

El proyecto estará disponible en: http://localhost:3000

## 🐛 Solución de Problemas

### Error: "npm no se reconoce"
- Node.js no está instalado o no está en el PATH
- Solución: Reinstalar Node.js y reiniciar la terminal

### Error: "Permission denied"
- Ejecutar terminal como administrador
- O usar: `npm install --no-optional`

### Error: "Network timeout"
- Verificar conexión a internet
- Usar: `npm install --registry https://registry.npmjs.org/`

## 📞 Soporte
Si tienes problemas:
1. Verifica que Node.js esté instalado: `node --version`
2. Verifica que npm esté disponible: `npm --version`
3. Revisa la conexión a internet
4. Intenta eliminar `node_modules` y `package-lock.json`, luego `npm install`

---
**¡Una vez instaladas las dependencias, el proyecto estará listo para funcionar! 🎉**
