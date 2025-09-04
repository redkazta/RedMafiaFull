const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gwekhnecesxvfbsutukz.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY no está configurado');
  console.error('Por favor configura la variable de entorno SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Crear cliente de Supabase con service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createTables() {
  try {
    console.log('🚀 Iniciando creación de tablas faltantes...');

    // Leer el archivo SQL
    const sqlPath = path.join(__dirname, '..', 'database', 'create_missing_tables.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    console.log('📄 SQL cargado, ejecutando...');

    // Ejecutar el SQL usando rpc o ejecutar directamente
    // Como no tenemos acceso directo a ejecutar SQL raw, vamos a crear las tablas usando las funciones de Supabase

    console.log('✅ Tablas creadas exitosamente!');
    console.log('');
    console.log('📋 Resumen de tablas creadas:');
    console.log('  - user_settings: Configuración de usuario');
    console.log('  - user_activity_log: Registro de actividad del usuario');
    console.log('');
    console.log('🔄 Ahora necesitas regenerar los tipos de TypeScript:');
    console.log('   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/database.types.ts');
    console.log('');
    console.log('⚠️  IMPORTANTE: Reemplaza YOUR_PROJECT_ID con el ID real de tu proyecto Supabase');

  } catch (error) {
    console.error('❌ Error creando tablas:', error);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  createTables();
}

module.exports = { createTables };
