# 🔧 Tablas Faltantes - Solución de Errores de TypeScript

## 📋 Problema

Los errores de TypeScript indican que faltan las siguientes tablas en la base de datos:
- `user_profiles` - Perfiles de usuario
- `user_settings` - Configuración del usuario
- `user_activity_log` - Registro de actividad del usuario

## 🚀 Solución Rápida

### Paso 1: Crear las tablas en Supabase

Ve al **SQL Editor** de tu proyecto Supabase y ejecuta **PRIMERO** el contenido del archivo:
```
database/create_user_profiles.sql
```

Luego ejecuta el contenido del archivo:
```
database/create_missing_tables.sql
```

### Archivos necesarios:
1. ✅ **`database/create_user_profiles.sql`** - Crea tabla `user_profiles`
2. ✅ **`database/create_missing_tables.sql`** - Crea tablas `user_settings` y `user_activity_log`

Cada archivo contiene:
- ✅ Creación de tablas con estructura completa
- ✅ Índices para rendimiento
- ✅ Políticas RLS (seguridad)
- ✅ Triggers automáticos
- ✅ Datos por defecto para usuarios existentes

### Paso 2: Regenerar Tipos de TypeScript

Después de crear las tablas, ejecuta este comando para actualizar los tipos:

```bash
npx supabase gen types typescript --project-id TU_PROJECT_ID > lib/database.types.ts
```

**⚠️ IMPORTANTE:** Reemplaza `TU_PROJECT_ID` con el ID real de tu proyecto Supabase.

### Paso 3: Verificar

Después de completar los pasos anteriores:
1. Los errores de TypeScript deberían desaparecer
2. El mini perfil debería funcionar correctamente
3. Los datos se guardarán correctamente en Supabase

## 🔍 Verificación de Errores

Si aún ves errores después de seguir estos pasos, verifica:

### 1. Variables de Entorno
Asegúrate de tener configuradas estas variables:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio
```

### 2. Conexión a Supabase
Los logs deberían mostrar:
```
🔧 Supabase config: { url: 'https://...', hasKey: true, usingDefaultUrl: false }
🧪 Testing Supabase connection...
✅ Supabase connection successful
```

### 3. Autenticación
Los logs deberían mostrar:
```
🔍 Checking Supabase session...
📊 Session data: { hasSession: true, userId: "..." }
✅ User authenticated, fetching profile data...
```

## 📞 Soporte

Si sigues teniendo problemas:

1. **Revisa los logs de la consola** del navegador (F12 → Console)
2. **Verifica la conexión** ejecutando la aplicación
3. **Confirma las tablas** en el Dashboard de Supabase
4. **Regenera los tipos** después de crear las tablas

## 🎯 Resultado Esperado

Después de completar estos pasos:
- ✅ El mini perfil se mostrará correctamente
- ✅ Los datos vendrán de Supabase (no mock data)
- ✅ La autenticación funcionará correctamente
- ✅ No habrá errores de TypeScript
- ✅ La aplicación será completamente funcional

---

**💡 Tip:** Si usas el script `scripts/create-tables.js`, necesitarás configurar `SUPABASE_SERVICE_ROLE_KEY` en tus variables de entorno.
