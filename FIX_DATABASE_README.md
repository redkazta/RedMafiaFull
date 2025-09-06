# 🔧 Solución para Errores de Base de Datos

## Problema Identificado
Los errores 406 y 400 en `user_profiles` y `user_tokens` indican problemas con:
- Políticas RLS (Row Level Security) mal configuradas
- Estructura de tablas incompleta
- Usuarios existentes sin perfiles/tokens

## Solución Paso a Paso

### 1. Ejecutar Script Principal
Ve a [Supabase SQL Editor](https://supabase.com/dashboard/project/YOUR_PROJECT/sql) y ejecuta:

```sql
-- Copia y pega el contenido completo de fix_database_complete.sql
```

### 2. Ejecutar Script para Usuarios Existentes
Después del primer script, ejecuta:

```sql
-- Copia y pega el contenido completo de fix_existing_users.sql
```

### 3. Verificar la Solución
Los scripts harán lo siguiente:

✅ **Crear/Verificar Tablas:**
- `user_profiles` - Perfiles de usuario
- `user_tokens` - Tokens de usuario
- `roles` - Roles del sistema
- `user_roles` - Asignación de roles

✅ **Configurar Políticas RLS:**
- Políticas correctas para lectura/escritura
- Permisos basados en `auth.uid()`

✅ **Crear Triggers:**
- Creación automática de perfiles al registrarse
- Actualización automática de `updated_at`

✅ **Arreglar Usuario Problemático:**
- ID: `7972685f-06ac-4ffb-8442-c8bed2aa76f8`
- Crear perfil y tokens si no existen

## Cambios en el Código

### AuthProvider Mejorado
- Manejo mejorado de errores 406/400
- Uso de `upsert` en lugar de `insert`
- Verificación de perfiles existentes antes de crear

### Funciones de Fetch Mejoradas
- Detección específica de errores RLS
- Logs más informativos
- Manejo graceful de errores

## Verificación Post-Fix

1. **Revisar Consola del Navegador:**
   - No más errores 406/400
   - Mensajes informativos en lugar de errores

2. **Probar Flujo de Usuario:**
   - Login/Registro
   - Acceso al perfil
   - Visualización de tokens

3. **Verificar en Supabase:**
   - Tablas creadas correctamente
   - Políticas RLS activas
   - Usuarios con perfiles completos

## Archivos Modificados

- `fix_database_complete.sql` - Script principal de reparación
- `fix_existing_users.sql` - Script para usuarios existentes
- `components/providers/AuthProvider.tsx` - Código mejorado
- `FIX_DATABASE_README.md` - Esta documentación

## Notas Importantes

- Los scripts son idempotentes (se pueden ejecutar múltiples veces)
- No afectan datos existentes válidos
- Incluyen manejo de errores y rollback automático
- Compatibles con la estructura actual de Supabase

## Soporte

Si persisten los errores después de ejecutar los scripts:
1. Verificar que el proyecto de Supabase esté activo
2. Revisar los logs de Supabase para errores específicos
3. Confirmar que las políticas RLS estén habilitadas
4. Verificar que el usuario tenga permisos de autenticación
