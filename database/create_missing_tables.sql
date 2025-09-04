-- Crear tabla user_settings
CREATE TABLE IF NOT EXISTS public.user_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    theme TEXT DEFAULT 'dark' CHECK (theme IN ('light', 'dark', 'auto')),
    language TEXT DEFAULT 'es' CHECK (language IN ('es', 'en')),
    timezone TEXT DEFAULT 'America/Mexico_City',
    notifications_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id)
);

-- Crear tabla user_activity_log
CREATE TABLE IF NOT EXISTS public.user_activity_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL,
    description TEXT NOT NULL,
    reference_type TEXT,
    reference_id UUID,
    ip_address INET,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON public.user_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_user_id ON public.user_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_action_type ON public.user_activity_log(action_type);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_created_at ON public.user_activity_log(created_at);

-- Configurar Row Level Security (RLS)
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_log ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para user_settings
CREATE POLICY "Users can view own settings" ON public.user_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON public.user_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON public.user_settings
    FOR UPDATE USING (auth.uid() = user_id);

-- Políticas RLS para user_activity_log
CREATE POLICY "Users can view own activity" ON public.user_activity_log
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity" ON public.user_activity_log
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para user_settings
CREATE TRIGGER handle_user_settings_updated_at
    BEFORE UPDATE ON public.user_settings
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();

-- Insertar configuración por defecto para usuarios existentes
INSERT INTO public.user_settings (user_id, theme, language, timezone, notifications_enabled)
SELECT
    up.id,
    'dark',
    'es',
    'America/Mexico_City',
    true
FROM public.user_profiles up
LEFT JOIN public.user_settings us ON up.id = us.user_id
WHERE us.user_id IS NULL;

-- Función para crear configuración por defecto para nuevos usuarios
CREATE OR REPLACE FUNCTION public.create_default_user_settings()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_settings (user_id, theme, language, timezone, notifications_enabled)
    VALUES (NEW.id, 'dark', 'es', 'America/Mexico_City', true);
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para crear configuración por defecto en nuevos usuarios
CREATE TRIGGER create_default_settings_on_profile
    AFTER INSERT ON public.user_profiles
    FOR EACH ROW
    EXECUTE PROCEDURE public.create_default_user_settings();
