'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FiShoppingCart, FiPlus, FiMinus, FiTrash2, FiArrowLeft, FiCreditCard } from 'react-icons/fi';
import { useCart } from '@/components/providers/CartProvider';
import { useAuth } from '@/components/providers/AuthProvider';

export default function CarritoPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, getCartItemsCount, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const total = getCartTotal();
  const itemsCount = getCartItemsCount();

  const handleUpdateQuantity = async (productId: number, newQuantity: number) => {
    setLoading(true);
    await updateQuantity(productId, newQuantity);
    setLoading(false);
  };

  const handleRemoveItem = async (productId: number) => {
    setLoading(true);
    await removeFromCart(productId);
    setLoading(false);
  };

  const handleClearCart = async () => {
    if (confirm('¿Estás seguro de que quieres vaciar tu carrito?')) {
      setLoading(true);
      await clearCart();
      setLoading(false);
    }
  };

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
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link
                href="/tienda"
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <FiArrowLeft className="w-5 h-5" />
                <span>Volver a la Tienda</span>
              </Link>
              <div className="w-px h-6 bg-gray-600"></div>
              <h1 className="text-3xl font-bold text-white flex items-center space-x-3">
                <FiShoppingCart className="w-8 h-8 text-primary-400" />
                <span>Mi Carrito ({itemsCount})</span>
              </h1>
            </div>
            
            {cart.length > 0 && (
              <button
                onClick={handleClearCart}
                disabled={loading}
                className="px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
              >
                Vaciar Carrito
              </button>
            )}
          </div>

          {cart.length === 0 ? (
            /* Empty Cart */
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiShoppingCart className="w-12 h-12 text-gray-600" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Tu carrito está vacío</h2>
              <p className="text-gray-400 mb-8">
                Explora nuestra tienda y encuentra productos increíbles
              </p>
              <Link
                href="/tienda"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:from-primary-600 hover:to-accent-600 transition-all duration-300 font-semibold"
              >
                <FiShoppingCart className="w-5 h-5" />
                <span>Ir a la Tienda</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.map((item) => (
                  <div key={item.product_id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center space-x-4">
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                        {item.image}
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {item.name}
                        </h3>
                        <p className="text-gray-400 text-sm mb-2">
                          {item.category}
                        </p>
                        <p className="text-primary-400 font-bold text-lg">
                          {item.price_tokens.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} Tokens
                        </p>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2 bg-gray-700 rounded-lg p-1">
                          <button
                            onClick={() => handleUpdateQuantity(item.product_id, item.quantity - 1)}
                            disabled={loading || item.quantity <= 1}
                            className="w-8 h-8 bg-gray-600 text-white rounded flex items-center justify-center hover:bg-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FiMinus className="w-4 h-4" />
                          </button>
                          <span className="text-white font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.product_id, item.quantity + 1)}
                            disabled={loading}
                            className="w-8 h-8 bg-gray-600 text-white rounded flex items-center justify-center hover:bg-gray-500 transition-colors disabled:opacity-50"
                          >
                            <FiPlus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => handleRemoveItem(item.product_id)}
                          disabled={loading}
                          className="w-10 h-10 bg-red-500/20 text-red-400 rounded-lg flex items-center justify-center hover:bg-red-500/30 transition-colors disabled:opacity-50"
                          title="Eliminar del carrito"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Subtotal */}
                    <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center">
                      <span className="text-gray-400">Subtotal:</span>
                      <span className="text-white font-bold">
                        {(item.price_tokens * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} Tokens
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 sticky top-24">
                  <h2 className="text-xl font-bold text-white mb-6">Resumen del Pedido</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Productos ({itemsCount})</span>
                      <span className="text-white">{total.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} Tokens</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Envío</span>
                      <span className="text-green-400">Gratis</span>
                    </div>
                    <div className="border-t border-gray-700 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-white">Total</span>
                        <span className="text-xl font-bold text-primary-400">
                          {total.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} Tokens
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {user ? (
                    <Link
                      href="/checkout"
                      className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:from-primary-600 hover:to-accent-600 transition-all duration-300 font-semibold"
                    >
                      <FiCreditCard className="w-5 h-5" />
                      <span>Proceder al Pago</span>
                    </Link>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-gray-400 text-sm text-center">
                        Inicia sesión para continuar con tu compra
                      </p>
                      <Link
                        href="/login"
                        className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:from-primary-600 hover:to-accent-600 transition-all duration-300 font-semibold"
                      >
                        <span>Iniciar Sesión</span>
                      </Link>
                    </div>
                  )}
                  
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <Link
                      href="/tienda"
                      className="w-full block text-center py-2 text-gray-400 hover:text-white transition-colors"
                    >
                      Continuar Comprando
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}