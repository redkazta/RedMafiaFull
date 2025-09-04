'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FiHeart, FiShoppingCart, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import { useCart } from '@/components/providers/CartProvider';
import { useAuth } from '@/components/providers/AuthProvider';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, addToCart, isInWishlist } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async (item: any) => {
    setLoading(true);
    await addToCart({
      product_id: item.product_id,
      name: item.name,
      price_tokens: item.price_tokens,
      image: item.image,
      category: item.category
    });
    setLoading(false);
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    setLoading(true);
    await removeFromWishlist(productId);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-red-900/20 via-transparent to-pink-900/20"></div>
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
                <FiHeart className="w-8 h-8 text-red-400" />
                <span>Mi Lista de Deseos ({wishlist.length})</span>
              </h1>
            </div>
          </div>

          {wishlist.length === 0 ? (
            /* Empty Wishlist */
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiHeart className="w-12 h-12 text-gray-600" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Tu lista de deseos está vacía</h2>
              <p className="text-gray-400 mb-8">
                Guarda tus productos favoritos para comprarlos más tarde
              </p>
              <Link
                href="/tienda"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 font-semibold"
              >
                <FiHeart className="w-5 h-5" />
                <span>Explorar Productos</span>
              </Link>
            </div>
          ) : (
            /* Wishlist Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.map((item) => (
                <div key={item.product_id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 hover:border-red-500/50 transition-all duration-300 group">
                  {/* Product Image */}
                  <div className="aspect-square bg-gradient-to-br from-red-500/20 to-pink-500/20 flex items-center justify-center text-6xl relative overflow-hidden">
                    <div className="text-8xl opacity-50 group-hover:opacity-70 transition-opacity">
                      {item.image}
                    </div>
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveFromWishlist(item.product_id)}
                      disabled={loading}
                      className="absolute top-3 right-3 w-10 h-10 bg-red-500/80 text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                      title="Quitar de favoritos"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="text-gray-400 text-sm mb-3">
                        {item.category}
                      </p>
                      <p className="text-red-400 font-bold text-xl">
                        {item.price_tokens.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} Tokens
                      </p>
                    </div>
                    
                    {/* Actions */}
                    <div className="space-y-3">
                      <button
                        onClick={() => handleAddToCart(item)}
                        disabled={loading}
                        className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:from-primary-600 hover:to-accent-600 transition-all duration-300 font-semibold disabled:opacity-50"
                      >
                        <FiShoppingCart className="w-5 h-5" />
                        <span>Agregar al Carrito</span>
                      </button>
                      
                      <button
                        onClick={() => handleRemoveFromWishlist(item.product_id)}
                        disabled={loading}
                        className="w-full flex items-center justify-center space-x-2 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <FiHeart className="w-4 h-4" />
                        <span>Quitar de Favoritos</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Actions Bar */}
          {wishlist.length > 0 && (
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700">
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-semibold text-white mb-1">
                  {wishlist.length} producto{wishlist.length !== 1 ? 's' : ''} en tu lista
                </h3>
                <p className="text-gray-400 text-sm">
                  Agrega todos al carrito o continúa explorando
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Link
                  href="/tienda"
                  className="px-6 py-3 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Seguir Explorando
                </Link>
                <button
                  onClick={async () => {
                    setLoading(true);
                    for (const item of wishlist) {
                      await handleAddToCart(item);
                    }
                    setLoading(false);
                  }}
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 font-semibold disabled:opacity-50"
                >
                  {loading ? 'Agregando...' : 'Agregar Todo al Carrito'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}