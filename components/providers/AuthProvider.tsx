'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface Profile {
  id: string;
  email: string;
  username?: string | null;
  first_name?: string;
  last_name?: string;
  display_name?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  is_verified?: boolean;
  is_active?: boolean;
  date_of_birth?: string | null;
  location?: string | null;
  phone?: string | null;
  website?: string | null;
  preferences?: any;
  social_links?: any;
  last_login_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface UserSettings {
  id: string;
  user_id: string;
  theme: string;
  language: string;
  timezone: string;
  email_notifications: boolean;
  push_notifications: boolean;
  order_notifications: boolean;
  marketing_emails: boolean;
  profile_visibility: string;
  show_online_status: boolean;
  allow_messages: boolean;
  content_filter: string;
  created_at: string;
  updated_at: string;
}

interface UserTokens {
  id: string;
  user_id: string;
  current_balance: number;
  total_earned: number;
  total_spent: number;
  last_transaction_at?: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  settings: UserSettings | null;
  tokens: UserTokens | null;
  tokenBalance: number;
  loading: boolean;
  isEmailConfirmed: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  settings: null,
  tokens: null,
  tokenBalance: 0,
  loading: true,
  isEmailConfirmed: false,
  signOut: async () => {},
  refreshProfile: async () => {},
  updateSettings: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [tokens, setTokens] = useState<UserTokens | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // PGRST116 = No profile found, this is normal for new users
        if (error.code === 'PGRST116') {
          return null;
        }

        // Log actual errors with meaningful information
        console.error('Error fetching profile:', {
          message: error.message || 'Unknown error',
          code: error.code || 'No code',
          details: error.details || 'No details',
          hint: error.hint || 'No hint'
        });
        return null;
      }

      return data;
    } catch (error: any) {
      // Only log unexpected errors
      if (error && typeof error === 'object') {
        console.error('Unexpected error fetching profile:', {
          message: error.message || 'Unknown error',
          name: error.name || 'Unknown error type',
          stack: error.stack || 'No stack trace'
        });
      } else {
        console.error('Unknown error fetching profile:', error);
      }
      return null;
    }
  };

  const fetchTokens = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_tokens')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No tokens found, this might be a new user
          console.log('No tokens found for user:', userId);
          return null;
        }
        console.error('Error fetching tokens:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching tokens:', error);
      return null;
    }
  };

  const fetchSettings = async (userId: string) => {
    try {
      // User settings table doesn't exist yet, use default settings
      const defaultSettings = {
        id: userId, // Use userId as id for now
        user_id: userId,
        theme: 'dark',
        language: 'es',
        timezone: 'America/Mexico_City',
        email_notifications: true,
        push_notifications: true,
        order_notifications: true,
        marketing_emails: false,
        profile_visibility: 'public',
        show_online_status: true,
        allow_messages: true,
        content_filter: 'moderate',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setSettings(defaultSettings);
      return defaultSettings;
    } catch (error: any) {
      console.error('Error fetching settings:', error);
      return null;
    }
  };

  const createUserProfile = async (user: User) => {
    try {
      // Create profile
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email || '',
          username: user.user_metadata?.username || user.email?.split('@')[0] || '',
          first_name: user.user_metadata?.first_name || '',
          last_name: user.user_metadata?.last_name || '',
          display_name: user.user_metadata?.display_name || `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim(),
          is_verified: !!user.email_confirmed_at,
          is_active: true
        })
        .select()
        .single();

      if (profileError) {
        // PGRST116 = No profile found, PGRST301 = Row level security violation
        // 23505 = Unique violation (already exists)
        if (profileError.code === '23505') {
          // Profile already exists, this is normal
          return null;
        }

        // Log actual errors with meaningful information
        console.error('Error creating profile:', {
          message: profileError.message || 'Unknown error',
          code: profileError.code || 'No code',
          details: profileError.details || 'No details',
          hint: profileError.hint || 'No hint'
        });
        return null;
      }

      // Create initial tokens
      const { data: tokensData, error: tokensError } = await supabase
        .from('user_tokens')
        .insert({
          user_id: user.id,
          current_balance: 1000,
          total_earned: 1000,
          total_spent: 0
        })
        .select()
        .single();

      if (tokensError) {
        // 23505 = Unique violation (already exists)
        if (tokensError.code === '23505') {
          // Tokens already exist, this is normal
        } else {
          // Log actual errors with meaningful information
          console.error('Error creating tokens:', {
            message: tokensError.message || 'Unknown error',
            code: tokensError.code || 'No code',
            details: tokensError.details || 'No details',
            hint: tokensError.hint || 'No hint'
          });
        }
      }

      return { profile: profileData, tokens: tokensData };
    } catch (error: any) {
      // Only log unexpected errors
      if (error && typeof error === 'object') {
        console.error('Unexpected error creating user profile:', {
          message: error.message || 'Unknown error',
          name: error.name || 'Unknown error type',
          stack: error.stack || 'No stack trace'
        });
      } else {
        console.error('Unknown error creating user profile:', error);
      }
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      let [profileData, tokensData, settingsData] = await Promise.all([
        fetchProfile(user.id),
        fetchTokens(user.id),
        fetchSettings(user.id)
      ]);

      // If profile doesn't exist, create it
      if (!profileData || !tokensData) {
        const created = await createUserProfile(user);
        if (created) {
          profileData = created.profile;
          tokensData = created.tokens;
        }
      }

      setProfile(profileData);
      setTokens(tokensData);
      setSettings(settingsData);
    }
  };

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    if (!user || !settings) return;

    try {
      // User settings table doesn't exist yet, just update local state
      const updatedSettings = {
        ...settings,
        ...newSettings,
        updated_at: new Date().toISOString()
      };

      setSettings(updatedSettings);
    } catch (error: any) {
      if (error && typeof error === 'object') {
        console.error('Error updating settings:', {
          message: error.message || 'Unknown error',
          code: error.code || 'No code',
          details: error.details || 'No details'
        });
      } else {
        console.error('Unknown error updating settings:', error);
      }
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      setSettings(null);
      setTokens(null);
    } catch (error: any) {
      if (error && typeof error === 'object') {
        console.error('Error signing out:', {
          message: error.message || 'Unknown error',
          name: error.name || 'Unknown error type'
        });
      } else {
        console.error('Unknown error signing out:', error);
      }
    }
  };

  useEffect(() => {
    console.log('🔄 AuthProvider useEffect: Starting initial session check');

    // Test Supabase connection first
    const testSupabaseConnection = async () => {
      try {
        console.log('🧪 Testing Supabase connection...');
        console.log('🔗 Testing Supabase connection...');

        // Try to get current user first (this should work even without tables)
        const { data: userData, error: userError } = await supabase.auth.getUser();
        console.log('👤 Current user check:', {
          hasUser: !!userData.user,
          userId: userData.user?.id,
          userEmail: userData.user?.email,
          error: userError
        });

        // Then try to query users table
        const { data, error } = await supabase.from('users').select('count').limit(1).single();

        if (error) {
          console.error('❌ Supabase users query failed:', {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint
          });
        } else {
          console.log('✅ Supabase connection and user_profiles query successful');
        }
      } catch (testError) {
        console.error('❌ Supabase connection test error:', testError);
      }
    };

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('🔍 Checking Supabase session...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('❌ Session error:', sessionError);
        }

        console.log('📊 Session data:', {
          hasSession: !!session,
          userId: session?.user?.id,
          userEmail: session?.user?.email,
          expiresAt: session?.expires_at
        });

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          console.log('✅ User authenticated, fetching profile data...');

          let [profileData, tokensData, settingsData] = await Promise.all([
            fetchProfile(session.user.id),
            fetchTokens(session.user.id),
            fetchSettings(session.user.id)
          ]);

          console.log('📈 Profile fetch results:', {
            hasProfile: !!profileData,
            profileId: profileData?.id,
            profileName: profileData?.display_name,
            hasTokens: !!tokensData,
            tokenBalance: tokensData?.current_balance,
            hasSettings: !!settingsData
          });

          // If profile doesn't exist, create it
          if (!profileData || !tokensData) {
            console.log('⚠️ Profile or tokens missing, creating new profile...');
            const created = await createUserProfile(session.user);
            if (created) {
              profileData = created.profile;
              tokensData = created.tokens;
              console.log('✅ New profile created successfully');
            } else {
              console.error('❌ Failed to create new profile');
            }
          }

          setProfile(profileData);
          setTokens(tokensData);
          setSettings(settingsData);

          console.log('🎉 Auth state fully loaded:', {
            user: !!session?.user,
            profile: !!profileData,
            tokens: !!tokensData,
            settings: !!settingsData
          });
        } else {
          console.log('❌ No authenticated user found');
          setProfile(null);
          setTokens(null);
          setSettings(null);
        }
      } catch (error) {
        console.error('❌ Error in getInitialSession:', error);
        console.error('Auth state will be set to not authenticated');
        setProfile(null);
        setTokens(null);
        setSettings(null);
      } finally {
        // Always set loading to false, even if there are errors
        console.log('✅ Setting loading to false in AuthProvider');
        setLoading(false);
      }
    };

    // Test connection first, then get session
    testSupabaseConnection().then(() => {
      getInitialSession();
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state change detected:', {
          event,
          hasSession: !!session,
          userId: session?.user?.id,
          userEmail: session?.user?.email
        });

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          console.log('✅ User signed in, fetching profile data...');

          let [profileData, tokensData, settingsData] = await Promise.all([
            fetchProfile(session.user.id),
            fetchTokens(session.user.id),
            fetchSettings(session.user.id)
          ]);

          console.log('📈 Auth change - Profile fetch results:', {
            hasProfile: !!profileData,
            profileId: profileData?.id,
            hasTokens: !!tokensData,
            hasSettings: !!settingsData
          });

          // If profile doesn't exist, create it
          if (!profileData || !tokensData) {
            console.log('⚠️ Creating new profile after auth change...');
            const created = await createUserProfile(session.user);
            if (created) {
              profileData = created.profile;
              tokensData = created.tokens;
              console.log('✅ Profile created after auth change');
            }
          }

          setProfile(profileData);
          setTokens(tokensData);
          setSettings(settingsData);

          console.log('🎉 Auth state updated after login');
        } else {
          console.log('❌ User signed out, clearing data');
          // Clear data when user logs out
          setProfile(null);
          setTokens(null);
          setSettings(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    user,
    session,
    profile,
    settings,
    tokens,
    tokenBalance: tokens?.current_balance || 0,
    loading,
    isEmailConfirmed: user?.email_confirmed_at != null,
    signOut,
    refreshProfile,
    updateSettings,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};