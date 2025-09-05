'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AvatarUpload } from '@/components/ui/AvatarUpload';
import { FiEdit, FiSettings, FiShoppingBag, FiMapPin, FiArrowLeft, FiCalendar, FiMail, FiUser, FiGlobe, FiHeart, FiLogIn, FiPhone } from 'react-icons/fi';
import { useAuth } from '@/components/providers/AuthProvider';
import { useCart, WishlistItem } from '@/components/providers/CartProvider';
import { supabase } from '@/lib/supabase';

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
  const [activeTab, setActiveTab] = useState('overview');

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
      // Mock recent activity since table doesn't exist
      setRecentActivity([
        {
          id: '1',
          activity_type: 'purchase',
          description: 'Compra realizada - Red Mafia Hoodie',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          activity_type: 'login',
          description: 'Inicio de sesión',
          created_at: new Date(Date.now() - 86400000).toISOString()
        }
      ]);
    } catch (error) {
      console.error('Error loading recent activity:', error);
    }
  }, [user]);

  const loadUserAddresses = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(5);

      if (!error && data) {
        setAddresses(data);
      } else {
        console.log('No addresses found or error:', error);
        setAddresses([]);
      }
    } catch (error) {
      console.error('Error loading user addresses:', error);
      setAddresses([]);
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

  useEffect(() => {
    if (user) {
      loadUserStats();
      loadRecentActivity();
      loadUserAddresses();
      loadUserOrders();
      // Refresh profile data to ensure we have latest info
      refreshProfile();
    }
  }, [user, loadUserStats, loadRecentActivity, loadUserAddresses, loadUserOrders, refreshProfile]);

  const handleAvatarUpdate = (newAvatarUrl: string) => {
    refreshProfile();
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
                { key: 'orders', label: 'Mis Órdenes', icon: FiShoppingBag },
                { key: 'wishlist', label: 'Lista de Deseos', icon: FiHeart },
                { key: 'addresses', label: 'Direcciones', icon: FiMapPin },
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
                          `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() :
                          'No especificado'
                        }
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Nombre de usuario</label>
                      <p className="text-white">@{profile?.username || user?.email?.split('@')[0] || 'No establecido'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Teléfono</label>
                      <p className="text-white">{profile?.phone || 'No especificado'}</p>
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
                  <button className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:from-primary-600 hover:to-accent-600 transition-all duration-300 font-semibold text-sm">
                    <FiMapPin className="w-4 h-4" />
                    <span>Agregar Dirección</span>
                  </button>
                </div>

                {addresses.length === 0 ? (
                  <div className="text-center py-12">
                    <FiMapPin className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">No tienes direcciones guardadas</p>
                    <p className="text-sm text-gray-500">Agrega tu primera dirección para facilitar tus compras</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div key={address.id} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
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
                          <button className="text-gray-400 hover:text-white transition-colors">
                            <FiEdit className="w-4 h-4" />
                          </button>
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
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-6">Configuraciones</h3>
                <div className="text-center py-12">
                  <FiSettings className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">Configuraciones de usuario próximamente</p>
                  <Link
                    href="/configuraciones"
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:from-primary-600 hover:to-accent-600 transition-all duration-300 font-semibold"
                  >
                    <FiSettings className="w-5 h-5" />
                    <span>Ir a Configuraciones</span>
                  </Link>
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
