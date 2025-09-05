import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gwekhnecesxvfbsutukz.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3ZWtobmVjZXN4dmZic3V0dWt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNTExMjgsImV4cCI6MjA3MTcyNzEyOH0.laJrA9lJUFY_JKGw8OemdwHsUaSEkyTBl1AR83ls9ZE';

console.log('🔧 Supabase config:', {
  url: supabaseUrl,
  hasKey: !!supabaseAnonKey,
  usingDefaultUrl: !process.env.NEXT_PUBLIC_SUPABASE_URL,
  usingDefaultKey: !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  envUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  envKeyLength: supabaseAnonKey?.length
});

// Cliente para el lado del cliente
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Cliente para el lado del servidor (con service role key)
// Solo disponible en el servidor
export const createSupabaseAdmin = () => {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for admin operations');
  }
  
  return createClient<Database>(
    supabaseUrl,
    supabaseServiceKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
};

// Tipos útiles
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];

// Tipos específicos para las tablas principales
export type UserProfile = Tables<'user_profiles'>;
export type Product = Tables<'products'>;
export type Event = Tables<'events'>;
export type MusicTrack = Tables<'music_tracks'>;
export type PurchaseOrder = Tables<'purchase_orders'>;
export type TokenTransaction = Tables<'token_transactions'>;

// Funciones de utilidad
export const getPublicUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};

export const uploadFile = async (
  bucket: string,
  path: string,
  file: File,
  options?: { upsert?: boolean }
) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, options);
  
  if (error) throw error;
  return data;
};

export const deleteFile = async (bucket: string, path: string) => {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw error;
};

// Función para obtener el usuario actual con su perfil
export const getCurrentUser = async () => {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { user: null, profile: null, error: authError };
  }

  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select(`
      *,
      user_roles (
        roles (
          name,
          display_name,
          permissions
        )
      ),
      user_tokens (
        current_balance,
        total_earned,
        total_spent
      )
    `)
    .eq('id', user.id)
    .single();

  return {
    user,
    profile,
    error: profileError,
  };
};

// Función para verificar si el usuario tiene un rol específico
export const hasRole = (profile: UserProfile & { user_roles: any[] }, roleName: string): boolean => {
  if (!profile?.user_roles) return false;
  return profile.user_roles.some((ur: any) => ur.roles?.name === roleName);
};

// Función para obtener el balance de tokens
export const getTokenBalance = async (userId: string): Promise<number> => {
  const { data, error } = await supabase
    .from('user_tokens')
    .select('current_balance')
    .eq('user_id', userId)
    .single();

  if (error || !data) return 0;
  return data.current_balance ?? 0;
};

// Función para crear una transacción de tokens
export const createTokenTransaction = async (
  userId: string,
  type: 'earn' | 'spend' | 'refund' | 'bonus' | 'penalty',
  amount: number,
  description: string,
  referenceType?: string,
  referenceId?: string
) => {
  // Obtener balance actual
  const currentBalance = await getTokenBalance(userId);
  const newBalance = type === 'spend' || type === 'penalty' 
    ? currentBalance - amount 
    : currentBalance + amount;

  // Verificar que no quede en negativo
  if (newBalance < 0) {
    throw new Error('Saldo insuficiente');
  }

  // Crear la transacción
  const { data: transaction, error: transactionError } = await supabase
    .from('token_transactions')
    .insert({
      user_id: userId,
      transaction_type: type,
      amount,
      balance_before: currentBalance,
      balance_after: newBalance,
      description,
      reference_type: referenceType,
      reference_id: referenceId,
    })
    .select()
    .single();

  if (transactionError) throw transactionError;

  // Actualizar el balance del usuario
  const { error: updateError } = await supabase
    .from('user_tokens')
    .upsert({
      user_id: userId,
      current_balance: newBalance,
      total_earned: type === 'earn' || type === 'bonus' ? currentBalance + amount : undefined,
      total_spent: type === 'spend' || type === 'penalty' ? currentBalance + amount : undefined,
      last_transaction_at: new Date().toISOString(),
    });

  if (updateError) throw updateError;

  return { transaction, newBalance };
};

export default supabase;