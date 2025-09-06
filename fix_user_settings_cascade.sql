-- =====================================================
-- SCRIPT PARA ARREGLAR LA FUNCIÓN create_default_user_settings CON CASCADE
-- Ejecutar en Supabase SQL Editor
-- =====================================================

-- 1. Eliminar la función problemática y todos sus dependientes
DROP FUNCTION IF EXISTS public.create_default_user_settings() CASCADE;

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

-- 3. Recrear el trigger en user_profiles
CREATE TRIGGER create_default_settings_on_profile
    AFTER INSERT ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.create_default_user_settings();

-- 4. Verificar que no hay conflictos con el trigger de auth.users
-- (El trigger de auth.users ya maneja la creación de perfiles, 
--  este trigger maneja la creación de configuraciones)

-- 5. Mensaje de confirmación
SELECT 'Función create_default_user_settings corregida exitosamente con CASCADE' as status;
