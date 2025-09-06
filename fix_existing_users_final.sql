-- =====================================================
-- SCRIPT FINAL PARA ARREGLAR USUARIOS EXISTENTES
-- Ejecutar después de fix_database_final.sql
-- Basado en la estructura real de la base de datos
-- =====================================================

-- 1. Crear perfiles para usuarios que no los tienen (usando estructura real)
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
SELECT 
    u.id,
    u.email,
    COALESCE(u.raw_user_meta_data->>'username', split_part(u.email, '@', 1)),
    COALESCE(u.raw_user_meta_data->>'first_name', 'Usuario'),
    COALESCE(u.raw_user_meta_data->>'last_name', 'Prueba'),
    COALESCE(
        u.raw_user_meta_data->>'display_name', 
        COALESCE(u.raw_user_meta_data->>'first_name', 'Usuario') || ' ' || COALESCE(u.raw_user_meta_data->>'last_name', 'Prueba'),
        split_part(u.email, '@', 1)
    ),
    CASE WHEN u.email_confirmed_at IS NOT NULL THEN true ELSE false END,
    true
FROM auth.users u
LEFT JOIN public.user_profiles up ON u.id = up.id
WHERE up.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- 2. Crear tokens para usuarios que no los tienen (usando estructura real)
INSERT INTO public.user_tokens (
    user_id,
    balance,
    current_balance,
    total_earned,
    total_spent
)
SELECT 
    u.id,
    1000,
    1000,
    1000,
    0
FROM auth.users u
LEFT JOIN public.user_tokens ut ON u.id = ut.user_id
WHERE ut.user_id IS NULL
ON CONFLICT (user_id) DO NOTHING;

-- 3. Asignar rol de usuario a usuarios que no lo tienen
INSERT INTO public.user_roles (user_id, role_id)
SELECT 
    u.id,
    r.id
FROM auth.users u
CROSS JOIN public.roles r
LEFT JOIN public.user_roles ur ON u.id = ur.user_id AND r.id = ur.role_id
WHERE r.name = 'user' AND ur.user_id IS NULL
ON CONFLICT (user_id, role_id) DO NOTHING;

-- 4. Verificar usuarios problemáticos específicos
SELECT 
    u.id,
    u.email,
    up.id as profile_exists,
    ut.user_id as tokens_exist,
    ur.user_id as role_exists
FROM auth.users u
LEFT JOIN public.user_profiles up ON u.id = up.id
LEFT JOIN public.user_tokens ut ON u.id = ut.user_id
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.id = '7972685f-06ac-4ffb-8442-c8bed2aa76f8';

-- 5. Crear perfil específico para el usuario problemático si no existe
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
SELECT 
    u.id,
    u.email,
    COALESCE(u.raw_user_meta_data->>'username', split_part(u.email, '@', 1)),
    COALESCE(u.raw_user_meta_data->>'first_name', 'Usuario'),
    COALESCE(u.raw_user_meta_data->>'last_name', 'Prueba'),
    COALESCE(
        u.raw_user_meta_data->>'display_name', 
        'Usuario Prueba'
    ),
    CASE WHEN u.email_confirmed_at IS NOT NULL THEN true ELSE false END,
    true
FROM auth.users u
WHERE u.id = '7972685f-06ac-4ffb-8442-c8bed2aa76f8'
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    username = EXCLUDED.username,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    display_name = EXCLUDED.display_name,
    is_verified = EXCLUDED.is_verified,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- 6. Crear tokens específicos para el usuario problemático si no existen
INSERT INTO public.user_tokens (
    user_id,
    balance,
    current_balance,
    total_earned,
    total_spent
)
SELECT 
    u.id,
    1000,
    1000,
    1000,
    0
FROM auth.users u
WHERE u.id = '7972685f-06ac-4ffb-8442-c8bed2aa76f8'
ON CONFLICT (user_id) DO UPDATE SET
    balance = 1000,
    current_balance = 1000,
    total_earned = 1000,
    total_spent = 0,
    updated_at = NOW();

-- 7. Asignar rol específico para el usuario problemático si no lo tiene
INSERT INTO public.user_roles (user_id, role_id)
SELECT 
    u.id,
    r.id
FROM auth.users u
CROSS JOIN public.roles r
WHERE u.id = '7972685f-06ac-4ffb-8442-c8bed2aa76f8'
AND r.name = 'user'
ON CONFLICT (user_id, role_id) DO NOTHING;

-- 8. Verificación final
SELECT 
    'Usuario problemático verificado' as status,
    u.id,
    u.email,
    up.display_name,
    ut.current_balance,
    r.name as role_name
FROM auth.users u
LEFT JOIN public.user_profiles up ON u.id = up.id
LEFT JOIN public.user_tokens ut ON u.id = ut.user_id
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
LEFT JOIN public.roles r ON ur.role_id = r.id
WHERE u.id = '7972685f-06ac-4ffb-8442-c8bed2aa76f8';
