-- =====================================================
-- SCRIPT PARA ARREGLAR LA FUNCIÓN create_default_user_settings
-- Ejecutar en Supabase SQL Editor
-- =====================================================

-- 1. Eliminar la función problemática si existe
DROP FUNCTION IF EXISTS public.create_default_user_settings();

-- 2. Crear la función correcta basada en la estructura real de user_settings
CREATE OR REPLACE FUNCTION public.create_default_user_settings()
RETURNS TRIGGER AS $$
BEGIN
    -- Insertar configuraciones por defecto usando la estructura real
    INSERT INTO public.user_settings (user_id, setting_key, setting_value) VALUES
    (NEW.id, 'theme', 'dark'),
    (NEW.id, 'language', 'es'),
    (NEW.id, 'timezone', 'America/Mexico_City'),
    (NEW.id, 'email_notifications', 'true'),
    (NEW.id, 'push_notifications', 'true'),
    (NEW.id, 'order_notifications', 'true'),
    (NEW.id, 'marketing_emails', 'false'),
    (NEW.id, 'profile_visibility', 'public'),
    (NEW.id, 'show_online_status', 'true'),
    (NEW.id, 'allow_messages', 'true'),
    (NEW.id, 'content_filter', 'moderate');
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't fail the user creation
        RAISE WARNING 'Error in create_default_user_settings: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Verificar si existe un trigger que use esta función
SELECT 
    trigger_name,
    event_object_table,
    action_statement
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
AND action_statement LIKE '%create_default_user_settings%';

-- 4. Si existe el trigger, recrearlo
DROP TRIGGER IF EXISTS on_auth_user_created_settings ON auth.users;

-- 5. Crear el trigger correcto
CREATE TRIGGER on_auth_user_created_settings
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.create_default_user_settings();

-- 6. Mensaje de confirmación
SELECT 'Función create_default_user_settings corregida exitosamente' as status;
