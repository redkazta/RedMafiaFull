const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gwekhnecesxvfbsutukz.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3ZWtobmVjZXN4dmZic3V0dWt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNTExMjgsImV4cCI6MjA3MTcyNzEyOH0.laJrA9lJUFY_JKGw8OemdwHsUaSEkyTBl1AR83ls9ZE';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabase() {
  console.log('🧪 Iniciando pruebas de Supabase...');
  console.log('🔗 URL:', supabaseUrl);
  console.log('🔑 Key length:', supabaseAnonKey.length);

  try {
    // 1. Test basic auth
    console.log('\n1️⃣ Probando autenticación básica...');
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    console.log('📊 Session result:', {
      hasSession: !!sessionData.session,
      userId: sessionData.session?.user?.id,
      userEmail: sessionData.session?.user?.email,
      error: sessionError
    });

    // 2. Test user_profiles table
    console.log('\n2️⃣ Probando tabla user_profiles...');
    const { data: profilesData, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);

    if (profilesError) {
      console.error('❌ Error en user_profiles:', {
        message: profilesError.message,
        code: profilesError.code,
        details: profilesError.details,
        hint: profilesError.hint
      });
    } else {
      console.log('✅ user_profiles funciona:', profilesData);
    }

    // 3. Test user_tokens table
    console.log('\n3️⃣ Probando tabla user_tokens...');
    const { data: tokensData, error: tokensError } = await supabase
      .from('user_tokens')
      .select('*')
      .limit(1);

    if (tokensError) {
      console.error('❌ Error en user_tokens:', {
        message: tokensError.message,
        code: tokensError.code,
        details: tokensError.details,
        hint: tokensError.hint
      });
    } else {
      console.log('✅ user_tokens funciona:', tokensData);
    }

    // 4. Test user_settings table
    console.log('\n4️⃣ Probando tabla user_settings...');
    const { data: settingsData, error: settingsError } = await supabase
      .from('user_settings')
      .select('*')
      .limit(1);

    if (settingsError) {
      console.error('❌ Error en user_settings:', {
        message: settingsError.message,
        code: settingsError.code,
        details: settingsError.details,
        hint: settingsError.hint
      });
    } else {
      console.log('✅ user_settings funciona:', settingsData);
    }

    // 5. Test user_activity_log table
    console.log('\n5️⃣ Probando tabla user_activity_log...');
    const { data: activityData, error: activityError } = await supabase
      .from('user_activity_log')
      .select('*')
      .limit(1);

    if (activityError) {
      console.error('❌ Error en user_activity_log:', {
        message: activityError.message,
        code: activityError.code,
        details: activityError.details,
        hint: activityError.hint
      });
    } else {
      console.log('✅ user_activity_log funciona:', activityData);
    }

    console.log('\n🎉 Pruebas completadas!');

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  testSupabase();
}

module.exports = { testSupabase };
