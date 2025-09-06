'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AvatarUpload } from '@/components/ui/AvatarUpload';
import { AddressForm } from '@/components/forms/AddressForm';
import { FiEdit, FiSettings, FiShoppingBag, FiMapPin, FiArrowLeft, FiCalendar, FiMail, FiUser, FiGlobe, FiHeart, FiLogIn, FiPhone, FiSun, FiMoon, FiMonitor, FiBell, FiShield, FiSave, FiCheck, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '@/components/providers/AuthProvider';
import { useCart, WishlistItem } from '@/components/providers/CartProvider';
import { supabase } from '@/lib/supabase';

interface UserLocation {
  id: number;
  user_id: string | null;
  city: string;
  country: string | null;
  postal_code: string;
  state: string;
  street: string;
  is_default: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export default function ProfilePage() {
  const { user, profile, settings, tokenBalance, refreshProfile, loading } = useAuth();
  const { wishlist } = useCart();

  const [stats, setStats] = useState({
    ordersCount: 0,
    wishlistCount: 0,
    reviewsCount: 0
  });
  const [recentActivity, setRecentActivity] = useState<Array<{
    id: string;
    activity_type: string;
    description: string;
    created_at: string;
  }>>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [orders, setOrders] = useState<Array<{
    id: string;
    status: string;
    total_amount: number;
    created_at: string;
    items_count: number;
  }>>([]);
  const [userSettings, setUserSettings] = useState({
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
    content_filter: 'moderate'
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [profileForm, setProfileForm] = useState({
    first_name: '',
    last_name: '',
    username: '',
    phone: '',
    location: '',
    website: '',
    bio: ''
  });
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Address form state
  const [showForm, setShowForm] = useState(false);
  const [editingLocation, setEditingLocation] = useState<UserLocation | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'México',
    is_default: false
  });

  const loadUserStats = useCallback(async () => {
    if (!user) return;

    try {
      // Get orders count (try multiple table names)
      let ordersCount = 0;
      try {
        const { count } = await supabase
          .from('purchase_orders')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
        ordersCount = count || 0;
      } catch (error) {
        console.log('purchase_orders table not available, trying orders...');
        try {
          // orders table doesn't exist, skip
          ordersCount = 0;
        } catch (error2) {
          console.log('orders table not available either');
          ordersCount = 0;
        }
      }

      // Get wishlist count from cart provider
      const wishlistCount = wishlist.length;

      // Get reviews count (placeholder for now)
      const reviewsCount = 0;

      setStats({
        ordersCount: ordersCount,
        wishlistCount: wishlistCount,
        reviewsCount: reviewsCount
      });
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  }, [user, wishlist]);

  const loadRecentActivity = useCallback(async () => {
    if (!user) return;

    try {
      // Load real activity from user_activity_log
      const { data, error } = await supabase
        .from('user_activity_log')
        .select('id, description, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (!error && data) {
        // Convertir los datos al formato esperado
        const formattedData = data.map((activity: any) => ({
          id: activity.id.toString(),
          activity_type: 'activity', // Valor por defecto
          description: activity.description || 'Actividad sin descripción',
          created_at: activity.created_at || new Date().toISOString()
        }));
        setRecentActivity(formattedData);
      } else {
        // Fallback to mock data if no real activity exists or table not available
        console.log('user_activity_log table not available or no data:', error);
        setRecentActivity([
          {
            id: '1',
            activity_type: 'login',
            description: 'Inicio de sesión en la plataforma',
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            activity_type: 'profile_view',
            description: 'Visualización del perfil',
            created_at: new Date(Date.now() - 86400000).toISOString()
          }
        ]);
      }
    } catch (error: any) {
      console.error('Error loading recent activity:', error);
      // If table doesn't exist, use mock data
      if (error.message?.includes('does not exist') || error.code === 'PGRST205') {
        console.log('user_activity_log table not available, using mock data');
      }
      // Fallback to mock data on error
      setRecentActivity([
        {
          id: '1',
          activity_type: 'login',
          description: 'Inicio de sesión en la plataforma',
          created_at: new Date().toISOString()
        }
      ]);
    }
  }, [user]);

  const loadUserAddresses = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (!error && data) {
        setAddresses(data);
      } else {
        console.log('No addresses found or table not available:', error);
        setAddresses([]);
      }
    } catch (error: any) {
      console.error('Error loading user addresses:', error);
      // If table doesn't exist, show empty state
      if (error.message?.includes('does not exist') || error.code === 'PGRST205') {
        console.log('user_addresses table not available, showing empty state');
        setAddresses([]);
      } else {
      setAddresses([]);
      }
    }
  }, [user]);

  const loadUserOrders = useCallback(async () => {
    if (!user) return;

    try {
      // Try to load orders from possible table names
      let ordersData: any[] = [];

      try {
        const { data, error } = await supabase
          .from('purchase_orders')
          .select('id, status, total_amount, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (!error && data) {
          ordersData = data.map((order: any) => ({
            ...order,
            items_count: 0 // Placeholder, would need order_items table
          }));
        }
              } catch (error) {
          console.log('purchase_orders table not available');
        }

      setOrders(ordersData);
    } catch (error) {
      console.error('Error loading user orders:', error);
      setOrders([]);
    }
  }, [user]);

  const loadUserSettings = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id);

      if (!error && data) {
        const settings: any = { ...userSettings };
        data.forEach((setting: any) => {
          // Convert string values to appropriate types
          if (setting.setting_value === 'true') {
            settings[setting.setting_key] = true;
          } else if (setting.setting_value === 'false') {
            settings[setting.setting_key] = false;
          } else {
            settings[setting.setting_key] = setting.setting_value;
          }
        });
        setUserSettings(settings);
      } else {
        console.log('user_settings table not available or no data:', error);
        // Keep default settings if table doesn't exist
      }
    } catch (error: any) {
      console.error('Error loading user settings:', error);
      // If table doesn't exist, keep default settings
      if (error.message?.includes('does not exist') || error.code === 'PGRST205') {
        console.log('user_settings table not available, using default settings');
      }
    }
  }, [user, userSettings]);

  const saveUserSettings = async () => {
    if (!user) return;

    try {
      const settingsToSave = Object.entries(userSettings).map(([key, value]) => ({
        user_id: user.id,
        setting_key: key,
        setting_value: String(value),
        updated_at: new Date().toISOString()
      }));

      // Upsert settings
      const { error } = await supabase
        .from('user_settings')
        .upsert(settingsToSave, {
          onConflict: 'user_id,setting_key'
        });

      if (error) throw error;

      alert('Configuraciones guardadas correctamente');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error al guardar las configuraciones');
    }
  };

  const updateSetting = (key: string, value: any) => {
    setUserSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  useEffect(() => {
    if (user) {
      loadUserStats();
      loadRecentActivity();
      loadUserAddresses();
      loadUserOrders();
      loadUserSettings();
      // Refresh profile data to ensure we have latest info
      refreshProfile();
    }
  }, [user, loadUserStats, loadRecentActivity, loadUserAddresses, loadUserOrders, loadUserSettings, refreshProfile]);

  // Initialize profile form when profile data is available
  useEffect(() => {
    if (profile) {
      setProfileForm({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        username: profile.username || '',
        phone: profile.phone || '',
        location: profile.location || '',
        website: profile.website || '',
        bio: profile.bio || ''
      });
    }
  }, [profile]);

  const handleAvatarUpdate = (newAvatarUrl: string) => {
    refreshProfile();
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setUpdatingProfile(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          first_name: profileForm.first_name,
          last_name: profileForm.last_name,
          username: profileForm.username,
          phone: profileForm.phone,
          location: profileForm.location,
          website: profileForm.website,
          bio: profileForm.bio,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      // Refresh profile data
      refreshProfile();
      setActiveTab('overview'); // Go back to overview
      alert('Perfil actualizado correctamente');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      alert('Error al actualizar el perfil');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleEditAddress = (address: any) => {
    setFormData({
      street: address.address_line_1 || '',
      city: address.city || '',
      state: address.state || '',
      postal_code: address.postal_code || '',
      country: address.country || 'México',
      is_default: address.is_default || false
    });
    setEditingLocation(address);
    setShowForm(true);
  };

  const handleDeleteAddress = async (addressId: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta dirección?')) return;

    try {
      const { error } = await supabase
        .from('user_addresses')
        .delete()
        .eq('id', addressId);

      if (error) throw error;

      loadUserAddresses();
      alert('Dirección eliminada correctamente');
    } catch (error) {
      console.error('Error deleting address:', error);
      alert('Error al eliminar la dirección');
    }
  };

  const handleSetDefaultAddress = async (addressId: number) => {
    if (!user) return;

    try {
      // Remove default from all addresses
      await supabase
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', user.id);

      // Set new default
      const { error } = await supabase
        .from('user_addresses')
        .update({ is_default: true })
        .eq('id', addressId);

      if (error) throw error;

      loadUserAddresses();
      alert('Dirección por defecto actualizada');
    } catch (error) {
      console.error('Error setting default address:', error);
      alert('Error al establecer dirección por defecto');
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      street: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'México',
      is_default: false
    });
    setEditingLocation(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validar campos requeridos
    if (!formData.street.trim() || !formData.city.trim() || !formData.state.trim()) {
      alert('Por favor completa los campos requeridos: Calle, Ciudad y Estado');
      setSaving(false);
      return;
    }

    setSaving(true);
    try {
      console.log('🔄 Intentando guardar dirección:', {
        userId: user.id,
        formData,
        isEditing: !!editingLocation
      });

      if (editingLocation) {
        // Update existing address
        console.log('📝 Actualizando dirección existente:', editingLocation.id);
        const { data, error } = await supabase
          .from('user_addresses')
          .update({
            street: formData.street,
            city: formData.city,
            state: formData.state,
            postal_code: formData.postal_code,
            country: formData.country,
            is_default: formData.is_default,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingLocation.id)
          .select();

        console.log('📊 Resultado actualización:', { data, error });

        if (error) throw error;
        alert('Dirección actualizada correctamente');
      } else {
        // Create new address
        console.log('➕ Creando nueva dirección');
        const { data, error } = await supabase
          .from('user_addresses')
          .insert({
            user_id: user.id,
            street: formData.street,
            city: formData.city,
            state: formData.state,
            postal_code: formData.postal_code,
            country: formData.country,
            is_default: formData.is_default
          })
          .select();

        console.log('📊 Resultado inserción:', { data, error });

        if (error) throw error;
        alert('Dirección agregada correctamente');
      }

      loadUserAddresses();
      resetForm();
    } catch (error: any) {
      console.error('❌ Error detallado al guardar dirección:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        fullError: error
      });
      alert(`Error al guardar la dirección: ${error.message || 'Error desconocido'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleAddressSubmit = async (data: any) => {
    if (!user) return;

    setSaving(true);
    try {
      console.log('🔄 Intentando guardar dirección mexicana:', {
        userId: user.id,
        data,
        isEditing: !!editingLocation
      });

      const addressData = {
        user_id: user.id,
        street: data.calle,
        city: data.ciudad,
        state: data.estado,
        postal_code: data.codigo_postal,
        codigo_postal: data.codigo_postal,
        numero_exterior: data.numero_exterior,
        numero_interior: data.numero_interior || null,
        referencias: data.referencias || null,
        is_default: addresses.length === 0, // Primera dirección es por defecto
        updated_at: new Date().toISOString()
      };

      if (editingLocation) {
        // Update existing address
        console.log('📝 Actualizando dirección existente:', editingLocation.id);
        const { data: result, error } = await supabase
          .from('user_addresses')
          .update(addressData)
          .eq('id', editingLocation.id)
          .select();

        console.log('📊 Resultado actualización:', { data: result, error });

        if (error) throw error;
        alert('Dirección actualizada correctamente');
      } else {
        // Create new address
        console.log('➕ Creando nueva dirección mexicana');
        const { data: result, error } = await supabase
          .from('user_addresses')
          .insert([addressData])
          .select();

        console.log('📊 Resultado inserción:', { data: result, error });

        if (error) throw error;
        alert('Dirección guardada correctamente');
      }

      // Refresh addresses
      loadUserAddresses();
      resetForm();
    } catch (error: any) {
      console.error('❌ Error al guardar dirección:', error);
      alert(`Error al guardar la dirección: ${error.message || 'Error desconocido'}`);
    } finally {
      setSaving(false);
    }
  };

  // Función para forzar recarga del perfil
  const handleRefreshProfile = () => {
    window.location.reload();
  };

  // Estado para controlar la carga inicial
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  useEffect(() => {
    if (user && profile && !loading && !initialLoadComplete) {
      // Una vez que tenemos usuario, perfil y no estamos cargando, marcar como carga inicial completa
      setInitialLoadComplete(true);
    }
  }, [user, profile, loading, initialLoadComplete]);

  if (loading && !initialLoadComplete) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Cargando tu perfil...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiUser className="w-12 h-12 text-gray-600" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Acceso requerido</h2>
            <p className="text-gray-400 mb-8">
              Debes iniciar sesión para ver tu perfil
            </p>
            <Link
              href="/login"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-500 hover:to-red-600 transition-all duration-300 font-semibold"
            >
              <FiLogIn className="w-5 h-5" />
              <span>Iniciar Sesión</span>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Si hay usuario pero no perfil después de la carga inicial, mostrar mensaje de completar perfil
  if (user && !profile && initialLoadComplete) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <FiUser className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Completando tu perfil...</h2>
            <p className="text-gray-400 mb-6">
              Estamos configurando tu información personal. Esto puede tomar unos segundos.
            </p>
            <div className="space-y-4">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Reintentar
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }



  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/20 via-transparent to-accent-900/20"></div>
      </div>

      <Header />

      <main className="flex-1 py-20 relative z-10">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <div className="mb-8 flex justify-between items-center">
            <Link
              href="/"
              className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
              <span>Volver al inicio</span>
            </Link>
            <button
              onClick={handleRefreshProfile}
              className="inline-flex items-center space-x-2 px-4 py-2 text-gray-400 hover:text-white transition-colors border border-gray-600 rounded-lg hover:border-gray-500"
            >
              <FiSettings className="w-4 h-4" />
              <span>Refrescar</span>
            </button>
          </div>

          {/* Profile Header */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 mb-8">
            <div className="flex flex-col items-center space-y-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <AvatarUpload
                  currentAvatar={profile?.avatar_url || undefined}
                  onAvatarUpdate={handleAvatarUpdate}
                  size="xl"
                />
              </div>

              {/* Profile Info */}
              <div className="text-center">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {profile?.display_name || `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || user?.email?.split('@')[0] || 'Usuario'}
                </h1>
                <p className="text-gray-400 flex items-center justify-center space-x-2 mb-2">
                  <FiMail className="w-4 h-4" />
                  <span>{profile?.email || user?.email}</span>
                </p>
                {profile?.phone && (
                  <p className="text-gray-400 flex items-center justify-center space-x-2 mb-2">
                    <FiPhone className="w-4 h-4" />
                    <span>{profile.phone}</span>
                  </p>
                )}
                {profile?.bio && (
                  <p className="text-gray-300 mt-2 mb-4">{profile.bio}</p>
                )}

                {/* Tokens */}
                <div className="mb-6">
                  <div className="text-2xl font-bold text-primary-400">{(tokenBalance ?? 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
                  <div className="text-sm text-gray-400">Tokens</div>
                </div>

                {/* Quick Stats */}
                <div className="flex justify-center mt-6">
                  <div className="flex items-center space-x-8">
                    <div className="text-center">
                      <div className="text-xl font-bold text-white">{stats.ordersCount ?? 0}</div>
                      <div className="text-sm text-gray-400">Órdenes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-white">{stats.wishlistCount ?? 0}</div>
                      <div className="text-sm text-gray-400">Favoritos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-white">{stats.reviewsCount ?? 0}</div>
                      <div className="text-sm text-gray-400">Reseñas</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mb-8">
            <div className="flex flex-wrap gap-4">
              {[
                { key: 'overview', label: 'Resumen', icon: FiUser },
                { key: 'activity', label: 'Actividad', icon: FiCalendar },
                { key: 'orders', label: 'Mis Órdenes', icon: FiShoppingBag },
                { key: 'wishlist', label: 'Lista de Deseos', icon: FiHeart },
                { key: 'addresses', label: 'Direcciones', icon: FiMapPin },
                { key: 'edit-profile', label: 'Editar Perfil', icon: FiEdit },
                { key: 'settings', label: 'Configuraciones', icon: FiSettings },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === tab.key
                      ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                      : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50 border border-gray-600/50'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'activity' && (
              <div className="space-y-6">
                {/* Activity Header */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                  <h3 className="text-xl font-bold text-white mb-6">Actividad Reciente</h3>
                  <div className="space-y-4">
                    {recentActivity.length === 0 ? (
                      <p className="text-gray-400 text-center py-8">No hay actividad reciente para mostrar</p>
                    ) : (
                      recentActivity.map((activity: any) => (
                        <div key={activity.id} className="flex items-start space-x-3 p-4 bg-gray-700/50 rounded-lg">
                          <div className="w-10 h-10 bg-primary-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <FiCalendar className="w-5 h-5 text-primary-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-white text-sm font-medium">{activity.description}</p>
                            <p className="text-gray-400 text-xs mt-1">
                              {activity.created_at ? new Date(activity.created_at).toLocaleString('es-ES', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              }) : 'Fecha no disponible'}
                            </p>
                            <span className="inline-block mt-2 px-2 py-1 bg-gray-600/50 text-gray-300 text-xs rounded">
                              {activity.activity_type || 'Actividad'}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Activity Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 text-center">
                    <div className="text-2xl font-bold text-primary-400 mb-2">{stats.ordersCount}</div>
                    <div className="text-gray-400 text-sm">Compras realizadas</div>
                  </div>
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 text-center">
                    <div className="text-2xl font-bold text-green-400 mb-2">{stats.wishlistCount}</div>
                    <div className="text-gray-400 text-sm">Artículos deseados</div>
                  </div>
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 text-center">
                    <div className="text-2xl font-bold text-blue-400 mb-2">{recentActivity.length}</div>
                    <div className="text-gray-400 text-sm">Actividades recientes</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                  <h3 className="text-xl font-bold text-white mb-6">Información Personal</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400">Nombre completo</label>
                      <p className="text-white">
                        {profile?.first_name || profile?.last_name ?
                          `${profile.first_name || ''} ${profile.last_name || ''}`.trim() :
                          user?.email?.split('@')[0] || 'Usuario'
                        }
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Nombre de usuario</label>
                      <p className="text-white">@{profile?.username || user?.email?.split('@')[0] || 'usuario'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Teléfono</label>
                      <p className="text-white">{profile?.phone || 'No registrado'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Ubicación</label>
                      <p className="text-white">{profile?.location || 'No especificada'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Sitio web</label>
                      <p className="text-white">
                        {profile?.website ? (
                          <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300">
                            {profile.website}
                          </a>
                        ) : 'No especificado'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Miembro desde</label>
                      <p className="text-white">
                        {profile?.created_at ?
                          new Date(profile.created_at).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) :
                          user?.created_at ?
                            new Date(user.created_at).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            }) :
                            'Fecha no disponible'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                  <h3 className="text-xl font-bold text-white mb-6">Actividad Reciente</h3>
                  <div className="space-y-4">
                    {recentActivity.length === 0 ? (
                      <p className="text-gray-400 text-center py-8">No hay actividad reciente</p>
                    ) : (
                      recentActivity.map((activity: any) => (
                        <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-700/50 rounded-lg">
                          <div className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <FiCalendar className="w-4 h-4 text-primary-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-white text-sm">{activity.description}</p>
                            <p className="text-gray-400 text-xs">
                              {activity.created_at ? new Date(activity.created_at).toLocaleString('es-ES') : 'Fecha no disponible'}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-6">Mis Órdenes</h3>

                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <FiShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">No tienes órdenes realizadas aún</p>
                    <p className="text-sm text-gray-500 mb-6">Tus futuras compras aparecerán aquí</p>
                    <Link
                      href="/tienda"
                      className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:from-primary-600 hover:to-accent-600 transition-all duration-300 font-semibold"
                    >
                      <FiShoppingBag className="w-5 h-5" />
                      <span>Ir a la Tienda</span>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="text-white font-medium">
                              Orden #{order.id.slice(-8)}
                            </div>
                            <div className="text-gray-400 text-sm">
                              {new Date(order.created_at).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-white font-bold">
                              ${order.total_amount?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              order.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                              order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                              order.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {order.status === 'completed' ? 'Completada' :
                               order.status === 'pending' ? 'Pendiente' :
                               order.status === 'cancelled' ? 'Cancelada' : order.status}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="text-gray-400 text-sm">
                            {order.items_count || 0} artículo{order.items_count !== 1 ? 's' : ''}
                          </div>
                          <button className="text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors">
                            Ver detalles →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-6">Lista de Deseos ({wishlist.length})</h3>
                {wishlist.length === 0 ? (
                  <div className="text-center py-12">
                    <FiHeart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">Tu lista de deseos está vacía</p>
                    <Link
                      href="/tienda"
                      className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 font-semibold"
                    >
                      <FiHeart className="w-5 h-5" />
                      <span>Explorar Productos</span>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wishlist.map((item: WishlistItem) => (
                      <div key={item.product_id} className="bg-gray-700/50 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center text-xl">
                            {item.image}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white font-medium">{item.name}</h4>
                            <p className="text-primary-400 text-sm">{item.price_tokens} Tokens</p>
                            <p className="text-gray-400 text-xs">{item.category}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white">Mis Direcciones</h3>
                  <button
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:from-primary-600 hover:to-accent-600 transition-all duration-300 font-semibold text-sm"
                  >
                    <FiMapPin className="w-4 h-4" />
                    <span>Agregar Dirección</span>
                  </button>
                </div>

                {addresses.length === 0 ? (
                  <div className="text-center py-12">
                    <FiMapPin className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">No tienes direcciones guardadas</p>
                    <p className="text-sm text-gray-500 mb-6">Agrega tu primera dirección para facilitar tus compras</p>
                    <button
                      onClick={() => setShowForm(true)}
                      className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:from-primary-600 hover:to-accent-600 transition-all duration-300 font-semibold"
                    >
                      <FiMapPin className="w-5 h-5" />
                      <span>Agregar Dirección</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div key={address.id} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600 hover:border-primary-500/50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                                                  <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-medium">
                            Dirección
                          </span>
                          {address.is_default && (
                            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs font-medium">
                              Predeterminada
                            </span>
                          )}
                        </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditAddress(address)}
                              className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                              title="Editar dirección"
                            >
                            <FiEdit className="w-4 h-4" />
                          </button>
                            <button
                              onClick={() => handleDeleteAddress(address.id)}
                              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                              title="Eliminar dirección"
                            >
                              <FiTrash2 className="w-4 h-4" />
                          </button>
                          </div>
                        </div>

                        <div className="text-white font-medium mb-1">
                          {address.recipient_name || 'Dirección'}
                        </div>
                        <div className="text-gray-300 text-sm">
                          {address.address_line_1 || address.address_line_2 || 'Sin dirección específica'}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {address.city && address.state ?
                            `${address.city}, ${address.state}${address.postal_code ? ` ${address.postal_code}` : ''}` :
                            'Ubicación no especificada'
                          }
                        </div>

                        {!address.is_default && (
                          <div className="mt-4 pt-4 border-t border-gray-600">
                            <button
                              onClick={() => handleSetDefaultAddress(address.id)}
                              className="text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors"
                            >
                              Establecer como dirección por defecto
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Address Form */}
                {(showForm || editingLocation) && (
                  <div className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">
                        {editingLocation ? 'Editar Dirección' : 'Nueva Dirección'}
                      </h3>
                      <button
                        onClick={resetForm}
                        className="p-2 text-gray-400 hover:text-white rounded-lg transition-colors"
                      >
                        <FiArrowLeft className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                      <AddressForm
                        onSubmit={handleAddressSubmit}
                        initialData={editingLocation ? {
                          codigo_postal: editingLocation.postal_code,
                          calle: editingLocation.street,
                          ciudad: editingLocation.city,
                          estado: editingLocation.state,
                          numero_exterior: '',
                          numero_interior: '',
                          referencias: ''
                        } : {}}
                        loading={saving}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'edit-profile' && (
              <div className="space-y-8">
                {/* Edit Profile Form */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                  <h3 className="text-xl font-bold text-white mb-6">Editar Perfil</h3>
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-white font-medium mb-2 block">Nombre</label>
                        <input
                          type="text"
                          value={profileForm.first_name}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, first_name: e.target.value }))}
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Tu nombre"
                        />
                      </div>
                      <div>
                        <label className="text-white font-medium mb-2 block">Apellido</label>
                        <input
                          type="text"
                          value={profileForm.last_name}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, last_name: e.target.value }))}
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Tu apellido"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-white font-medium mb-2 block">Nombre de usuario</label>
                      <input
                        type="text"
                        value={profileForm.username}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, username: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="@usuario"
                      />
                    </div>

                    <div>
                      <label className="text-white font-medium mb-2 block">Teléfono</label>
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="+52 55 1234 5678"
                      />
                    </div>

                    <div>
                      <label className="text-white font-medium mb-2 block">Ubicación</label>
                      <input
                        type="text"
                        value={profileForm.location}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Ciudad, Estado"
                      />
                    </div>

                    <div>
                      <label className="text-white font-medium mb-2 block">Sitio web</label>
                      <input
                        type="url"
                        value={profileForm.website}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, website: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="https://tu-sitio.com"
                      />
                    </div>

                    <div>
                      <label className="text-white font-medium mb-2 block">Biografía</label>
                      <textarea
                        value={profileForm.bio}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                        rows={4}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                        placeholder="Cuéntanos sobre ti..."
                      />
                    </div>

                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={() => setProfileForm({
                          first_name: profile?.first_name || '',
                          last_name: profile?.last_name || '',
                          username: profile?.username || '',
                          phone: profile?.phone || '',
                          location: profile?.location || '',
                          website: profile?.website || '',
                          bio: profile?.bio || ''
                        })}
                        className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={updatingProfile}
                        className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:from-primary-600 hover:to-accent-600 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {updatingProfile ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Guardando...</span>
                          </>
                        ) : (
                          <>
                            <FiSave className="w-4 h-4" />
                            <span>Guardar Cambios</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-8">
                {/* Appearance Settings */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-3">
                    <FiSun className="w-6 h-6 text-primary-400" />
                    <span>Apariencia</span>
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <label className="text-white font-medium mb-3 block">Tema de la aplicación</label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { value: 'light', label: 'Claro', icon: FiSun },
                          { value: 'dark', label: 'Oscuro', icon: FiMoon },
                          { value: 'auto', label: 'Automático', icon: FiMonitor }
                        ].map((theme) => (
                          <button
                            key={theme.value}
                            onClick={() => updateSetting('theme', theme.value)}
                            className={`flex items-center justify-center space-x-2 p-3 rounded-lg border transition-colors ${
                              userSettings.theme === theme.value
                                ? 'bg-primary-500/20 border-primary-500 text-primary-400'
                                : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-600/50'
                            }`}
                          >
                            <theme.icon className="w-5 h-5" />
                            <span className="text-sm font-medium">{theme.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-white font-medium mb-3 block">Idioma</label>
                      <select
                        value={userSettings.language}
                        onChange={(e) => updateSetting('language', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="es">Español</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-3">
                    <FiBell className="w-6 h-6 text-primary-400" />
                    <span>Notificaciones</span>
                  </h3>

                  <div className="space-y-4">
                    {[
                      { key: 'email_notifications', label: 'Notificaciones por email', desc: 'Recibe actualizaciones importantes por correo' },
                      { key: 'push_notifications', label: 'Notificaciones push', desc: 'Recibe notificaciones en tiempo real' },
                      { key: 'order_notifications', label: 'Notificaciones de órdenes', desc: 'Actualizaciones sobre tus compras' },
                      { key: 'marketing_emails', label: 'Emails de marketing', desc: 'Ofertas especiales y novedades' }
                    ].map((notif) => (
                      <div key={notif.key} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                        <div>
                          <h4 className="text-white font-medium">{notif.label}</h4>
                          <p className="text-gray-400 text-sm">{notif.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={userSettings[notif.key as keyof typeof userSettings] as boolean}
                            onChange={(e) => updateSetting(notif.key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Privacy Settings */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-3">
                    <FiShield className="w-6 h-6 text-primary-400" />
                    <span>Privacidad</span>
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <label className="text-white font-medium mb-3 block">Visibilidad del perfil</label>
                      <select
                        value={userSettings.profile_visibility}
                        onChange={(e) => updateSetting('profile_visibility', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="public">Público</option>
                        <option value="friends">Solo amigos</option>
                        <option value="private">Privado</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                      <div>
                        <h4 className="text-white font-medium">Mostrar estado en línea</h4>
                        <p className="text-gray-400 text-sm">Otros usuarios pueden ver cuando estás activo</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={userSettings.show_online_status}
                          onChange={(e) => updateSetting('show_online_status', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-center">
                  <button
                    onClick={saveUserSettings}
                    className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:from-primary-600 hover:to-accent-600 transition-all duration-300 font-semibold"
                  >
                    <FiSave className="w-5 h-5" />
                    <span>Guardar Configuraciones</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
