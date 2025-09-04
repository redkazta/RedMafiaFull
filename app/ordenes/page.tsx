'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FiArrowLeft, FiShoppingBag, FiEye, FiPackage, FiTruck, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';
import { useAuth } from '@/components/providers/AuthProvider';
import { supabase } from '@/lib/supabase';

interface Order {
  id: number;
  order_number: string;
  total_amount: number;
  total_tokens: number;
  status: string | null;
  user_id: string | null;
  created_at: string | null;
  updated_at: string | null;
  purchase_order_items: Array<{
    id: number;
    order_id: number | null;
    product_id: number | null;
    quantity: number;
    total_price: number;
    total_tokens: number;
    unit_price: number;
    unit_price_tokens: number;
    created_at: string | null;
  }>;
}

export default function OrdersPage() {
  const { user, profile, loading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const loadOrders = useCallback(async () => {
    if (!user) return;

    setLoadingOrders(true);
    try {
      // First, get all orders for the user
      const { data: ordersData, error: ordersError } = await supabase
        .from('purchase_orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Error loading orders:', ordersError);
        return;
      }

      if (!ordersData || ordersData.length === 0) {
        setOrders([]);
        return;
      }

      // Get all order IDs
      const orderIds = ordersData.map(order => order.id);

      // Then, get all order items for these orders
      const { data: itemsData, error: itemsError } = await supabase
        .from('purchase_order_items')
        .select('*')
        .in('order_id', orderIds);

      if (itemsError) {
        console.error('Error loading order items:', itemsError);
        // Still set orders without items if items fail
        const ordersWithEmptyItems = ordersData.map(order => ({
          ...order,
          purchase_order_items: []
        }));
        setOrders(ordersWithEmptyItems);
        return;
      }

      // Combine orders with their items
      const ordersWithItems = ordersData.map(order => ({
        ...order,
        purchase_order_items: itemsData?.filter(item => item.order_id === order.id) || []
      }));

      setOrders(ordersWithItems);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user, loadOrders]);

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case 'pending':
        return <FiClock className="w-5 h-5 text-yellow-400" />;
      case 'confirmed':
        return <FiPackage className="w-5 h-5 text-blue-400" />;
      case 'processing':
        return <FiPackage className="w-5 h-5 text-orange-400" />;
      case 'shipped':
        return <FiTruck className="w-5 h-5 text-purple-400" />;
      case 'delivered':
        return <FiCheckCircle className="w-5 h-5 text-green-400" />;
      case 'cancelled':
        return <FiXCircle className="w-5 h-5 text-red-400" />;
      default:
        return <FiClock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'confirmed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'processing':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'shipped':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'delivered':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusText = (status: string | null) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'confirmed':
        return 'Confirmada';
      case 'processing':
        return 'Procesando';
      case 'shipped':
        return 'Enviada';
      case 'delivered':
        return 'Entregada';
      case 'cancelled':
        return 'Cancelada';
      default:
        return 'Desconocido';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiShoppingBag className="w-12 h-12 text-gray-600" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Acceso requerido</h2>
            <p className="text-gray-400 mb-8">
              Debes iniciar sesión para ver tus órdenes
            </p>
            <Link
              href="/login"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:from-primary-600 hover:to-accent-600 transition-all duration-300 font-semibold"
            >
              <FiShoppingBag className="w-5 h-5" />
              <span>Iniciar Sesión</span>
            </Link>
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
          <div className="mb-8">
            <Link
              href="/perfil"
              className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
              <span>Volver al perfil</span>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Mis Órdenes
            </h1>
            <p className="text-gray-300 text-lg">
              Historial completo de tus compras
            </p>
          </div>

          {/* Orders List */}
          <div className="max-w-4xl mx-auto">
            {loadingOrders ? (
              <div className="text-center py-20">
                <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-400">Cargando órdenes...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiShoppingBag className="w-12 h-12 text-gray-600" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">No tienes órdenes aún</h2>
                <p className="text-gray-400 mb-8">
                  ¡Es hora de hacer tu primera compra!
                </p>
                <Link
                  href="/tienda"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:from-primary-600 hover:to-accent-600 transition-all duration-300 font-semibold"
                >
                  <FiShoppingBag className="w-5 h-5" />
                  <span>Ir a la Tienda</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden hover:border-primary-500/50 transition-colors"
                  >
                    {/* Order Header */}
                    <div className="p-6 border-b border-gray-700">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(order.status)}
                          <div>
                            <h3 className="text-lg font-bold text-white">
                              Orden #{order.order_number}
                            </h3>
                            <p className="text-gray-400 text-sm">
                              {order.created_at ? new Date(order.created_at).toLocaleDateString('es-ES') : 'Fecha no disponible'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg border ${getStatusColor(order.status)}`}>
                            <span className="text-sm font-medium">
                              {getStatusText(order.status)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-gray-400 text-sm">Total</p>
                          <p className="text-xl font-bold text-primary-400">
                            {order.total_tokens.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} Tokens
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Productos</p>
                          <p className="text-white font-medium">
                            {order.purchase_order_items.length} artículo{order.purchase_order_items.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Estado</p>
                          <p className="text-white font-medium">
                            {getStatusText(order.status)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="p-6">
                      <h4 className="text-white font-medium mb-4">Productos</h4>
                      <div className="space-y-3">
                        {order.purchase_order_items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                            <div className="flex-1">
                              <h5 className="text-white font-medium">Producto #{item.product_id}</h5>
                              <p className="text-gray-400 text-sm">
                                {item.unit_price_tokens} Tokens × {item.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-primary-400 font-bold">
                                {item.total_tokens.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} Tokens
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Timeline */}
                    <div className="px-6 pb-6">
                      <h4 className="text-white font-medium mb-4">Cronograma</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3 text-sm">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-gray-400">Orden creada:</span>
                          <span className="text-white">
                            {new Date(order.created_at).toLocaleString('es-ES')}
                          </span>
                        </div>
                        {order.confirmed_at && (
                          <div className="flex items-center space-x-3 text-sm">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span className="text-gray-400">Confirmada:</span>
                            <span className="text-white">
                              {new Date(order.confirmed_at).toLocaleString('es-ES')}
                            </span>
                          </div>
                        )}
                        {order.shipped_at && (
                          <div className="flex items-center space-x-3 text-sm">
                            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                            <span className="text-gray-400">Enviada:</span>
                            <span className="text-white">
                              {new Date(order.shipped_at).toLocaleString('es-ES')}
                            </span>
                          </div>
                        )}
                        {order.delivered_at && (
                          <div className="flex items-center space-x-3 text-sm">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-gray-400">Entregada:</span>
                            <span className="text-white">
                              {new Date(order.delivered_at).toLocaleString('es-ES')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
