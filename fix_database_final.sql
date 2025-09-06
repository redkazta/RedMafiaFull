-- =====================================================
-- SCRIPT FINAL BASADO EN LA ESTRUCTURA REAL DE LA BASE DE DATOS
-- Ejecutar en Supabase SQL Editor
-- =====================================================

-- 1. Limpiar políticas existentes problemáticas
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view own tokens" ON public.user_tokens;
DROP POLICY IF EXISTS "Users can update own tokens" ON public.user_tokens;
DROP POLICY IF EXISTS "Users can insert own tokens" ON public.user_tokens;

-- 2. Verificar que las tablas existen (ya existen según la estructura)
-- user_profiles: id (uuid), email (text), username (text), first_name (text), last_name (text), display_name (text), etc.
-- user_tokens: id (integer), user_id (uuid), balance (integer), current_balance (integer), total_earned (integer), total_spent (integer), etc.
-- roles: id (integer), name (varchar), description (text), etc.
-- user_roles: id (integer), user_id (uuid), role_id (integer), etc.

-- 3. Crear índices necesarios si no existen
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON public.user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_tokens_user_id ON public.user_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON public.user_roles(role_id);

-- 4. Habilitar RLS (ya está habilitado según el estado)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

-- 5. Crear políticas RLS correctas para user_profiles
CREATE POLICY "Enable read access for users based on user_id" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users only" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for users based on user_id" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- 6. Crear políticas RLS correctas para user_tokens
CREATE POLICY "Enable read access for users based on user_id" ON public.user_tokens
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for authenticated users only" ON public.user_tokens
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users based on user_id" ON public.user_tokens
    FOR UPDATE USING (auth.uid() = user_id);

-- 7. Crear políticas RLS para user_roles
CREATE POLICY "Enable read access for users based on user_id" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for authenticated users only" ON public.user_roles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 8. Crear políticas RLS para roles (lectura pública)
CREATE POLICY "Enable read access for all users" ON public.roles
    FOR SELECT USING (true);

-- 9. Función para actualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 10. Crear triggers para updated_at
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_tokens_updated_at ON public.user_tokens;
CREATE TRIGGER update_user_tokens_updated_at
    BEFORE UPDATE ON public.user_tokens
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 11. Función mejorada para crear perfil automáticamente (basada en estructura real)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Crear perfil de usuario (usando estructura real)
    INSERT INTO public.user_profiles (
        id,
        email,
        username,
        first_name,
        last_name,
        display_name,
        is_verified,
        is_active
    )
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'first_name', 'Usuario'),
        COALESCE(NEW.raw_user_meta_data->>'last_name', 'Prueba'),
        COALESCE(
            NEW.raw_user_meta_data->>'display_name', 
            COALESCE(NEW.raw_user_meta_data->>'first_name', 'Usuario') || ' ' || COALESCE(NEW.raw_user_meta_data->>'last_name', 'Prueba'),
            split_part(NEW.email, '@', 1)
        ),
        CASE WHEN NEW.email_confirmed_at IS NOT NULL THEN true ELSE false END,
        true
    );

    -- Crear tokens iniciales (usando estructura real: balance, current_balance, total_earned, total_spent)
    INSERT INTO public.user_tokens (
        user_id,
        balance,
        current_balance,
        total_earned,
        total_spent
    )
    VALUES (
        NEW.id,
        1000,
        1000,
        1000,
        0
    );

    -- Asignar rol de usuario por defecto
    INSERT INTO public.user_roles (user_id, role_id)
    SELECT NEW.id, id FROM public.roles WHERE name = 'user';

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't fail the user creation
        RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. Recrear trigger para ejecutar la función cuando se crea un usuario
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 13. Verificar que las tablas existen y tienen la estructura correcta
DO $$
BEGIN
    -- Verificar user_profiles
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_profiles' AND table_schema = 'public') THEN
        RAISE EXCEPTION 'Tabla user_profiles no existe';
    END IF;
    
    -- Verificar user_tokens
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_tokens' AND table_schema = 'public') THEN
        RAISE EXCEPTION 'Tabla user_tokens no existe';
    END IF;
    
    RAISE NOTICE 'Todas las tablas verificadas correctamente';
END $$;

-- 14. Verificar políticas RLS
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('user_profiles', 'user_tokens', 'user_roles', 'roles')
ORDER BY tablename, policyname;

-- 15. Mensaje final
SELECT 'Base de datos configurada correctamente. Todas las tablas y políticas RLS han sido creadas/actualizadas.' as status;
