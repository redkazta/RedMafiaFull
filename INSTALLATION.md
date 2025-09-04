# 🚀 Guía de Instalación - LA RED MAFIA

## 📋 Prerrequisitos

- **Node.js** 18.0 o superior
- **npm** o **yarn**
- Cuenta en **Supabase**
- **Git**

## 🛠️ Instalación Paso a Paso

### 1. Clonar el Repositorio
```bash
git clone <tu-repo-url>
cd red-mafia-kiro
```

### 2. Instalar Dependencias
```bash
npm install
# o
yarn install
```

### 3. Configurar Supabase

#### 3.1 Crear Proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Crea una nueva cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Anota la URL y las API Keys

#### 3.2 Configurar Base de Datos
1. Ve a la sección SQL Editor en tu proyecto de Supabase
2. Copia y pega el contenido de `database/schema.sql`
3. Ejecuta el script para crear todas las tablas

#### 3.3 Configurar Storage (Opcional)
1. Ve a Storage en tu proyecto de Supabase
2. Crea los siguientes buckets:
   - `avatars` (para fotos de perfil)
   - `covers` (para portadas de música)
   - `banners` (para banners de eventos)
   - `products` (para imágenes de productos)

### 4. Configurar Variables de Entorno
```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="LA RED MAFIA"
```

### 5. Generar Tipos de TypeScript (Opcional)
```bash
# Instalar Supabase CLI
npm install -g supabase

# Generar tipos
npm run db:generate-types
```

### 6. Ejecutar en Desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🔧 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run start        # Servidor de producción
npm run lint         # Linting con ESLint
npm run type-check   # Verificación de tipos TypeScript
```

## 🚀 Deployment en Vercel

### 1. Conectar con Vercel
```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### 2. Configurar Variables de Entorno en Vercel
En el dashboard de Vercel, agrega las mismas variables de entorno:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### 3. Configurar Dominio (Opcional)
En Vercel, ve a Settings > Domains y configura tu dominio personalizado.

## 🔐 Configuración de Seguridad

### Row Level Security (RLS)
El esquema incluye políticas de RLS básicas. Para producción:

1. Revisa las políticas en `database/schema.sql`
2. Ajusta según tus necesidades específicas
3. Prueba exhaustivamente antes de lanzar

### Autenticación
- Email/Password habilitado por defecto
- Para OAuth (Google, GitHub), configura en Supabase Auth

## 📊 Datos de Prueba

Para poblar la base de datos con datos de prueba:

1. Ve a SQL Editor en Supabase
2. Ejecuta queries INSERT para crear:
   - Usuarios de prueba
   - Artistas
   - Música
   - Eventos
   - Productos

## 🐛 Solución de Problemas

### Error: "Invalid API Key"
- Verifica que las variables de entorno estén correctas
- Asegúrate de que el proyecto de Supabase esté activo

### Error: "Table doesn't exist"
- Ejecuta el script `database/schema.sql` en Supabase
- Verifica que todas las tablas se crearon correctamente

### Error de CORS
- Configura las URLs permitidas en Supabase Auth settings
- Agrega tu dominio de producción

### Problemas de Performance
- Verifica que los índices estén creados (incluidos en schema.sql)
- Optimiza las queries si es necesario
- Considera usar CDN para imágenes

## 📞 Soporte

Si tienes problemas:
1. Revisa la documentación de [Next.js](https://nextjs.org/docs)
2. Consulta la documentación de [Supabase](https://supabase.com/docs)
3. Revisa los issues en GitHub

## 🎉 ¡Listo!

Tu aplicación LA RED MAFIA debería estar funcionando correctamente. 

### Próximos Pasos:
1. Personaliza los colores y estilos en `tailwind.config.js`
2. Agrega más funcionalidades según tus necesidades
3. Configura analytics y monitoreo
4. Implementa tests automatizados

---

**¡Desarrollado con ❤️ por Kiro AI!**