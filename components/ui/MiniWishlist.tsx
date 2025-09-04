'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiX, FiShoppingCart, FiTrash2, FiUser } from 'react-icons/fi';
import { useCart } from '@/components/providers/CartProvider';
import { useAuth } from '@/components/providers/AuthProvider';
import type { WishlistItem } from '@/components/providers/CartProvider';

export function MiniWishlist() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const { wishlist, removeFromWishlist, addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = async (item: WishlistItem) => {
    await addToCart({
      product_id: item.product_id,
      name: item.name,
      price_tokens: item.price_tokens,
      image: item.image,
      category: item.category,
    });
    // Opcional: mover al carrito elimina de wishlist
    await removeFromWishlist(item.product_id);
  };

  return (
    <div 
      className="relative"
      onMouseEnter={() => {
        if (hoverTimeout) clearTimeout(hoverTimeout);
        setIsOpen(true);
      }}
      onMouseLeave={() => {
        const timeout = setTimeout(() => setIsOpen(false), 300);
        setHoverTimeout(timeout);
      }}
    >
      {/* Wishlist Button with Text */}
      <button
        className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-red-400 transition-colors rounded-lg hover:bg-gray-800/50"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="relative">
          <FiHeart className="w-5 h-5" />
          {wishlist.length > 0 && (
            <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
              {wishlist.length > 99 ? '99+' : wishlist.length}
            </span>
          )}
        </div>
        <span className="text-sm font-medium hidden xl:block">Mi Wishlist</span>
      </button>

      {/* Wishlist Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop - only for mobile */}
            <div 
              className="fixed inset-0 z-40 lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Wishlist Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-2xl border border-gray-700 z-50 max-h-96 overflow-hidden"
              onMouseEnter={() => {
                if (hoverTimeout) clearTimeout(hoverTimeout);
                setIsOpen(true);
              }}
              onMouseLeave={() => {
                const timeout = setTimeout(() => setIsOpen(false), 300);
                setHoverTimeout(timeout);
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-white">
                  Lista de Deseos ({wishlist.length})
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                  aria-label="Cerrar"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Wishlist Items */}
              <div className="max-h-64 overflow-y-auto">
                {wishlist.length === 0 ? (
                  <div className="p-6 text-center">
                    <FiHeart className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">Tu lista de deseos está vacía</p>
                    <Link
                      href="/tienda"
                      onClick={() => setIsOpen(false)}
                      className="inline-block mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                    >
                      Explorar Productos
                    </Link>
                  </div>
                ) : (
                  <div className="p-2">
                    {wishlist.map((item) => (
                      <div key={item.product_id} className="flex items-center gap-3 p-3 hover:bg-gray-700/50 rounded-lg transition-colors">
                        {/* Product Image */}
                        {item.image ? (
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-700/50">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-lg flex items-center justify-center">
                            <FiHeart className="w-5 h-5 text-red-400" />
                          </div>
                        )}
                        
                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white text-sm font-medium truncate">
                            {item.name}
                          </h4>
                          <p className="text-primary-400 text-sm font-semibold">
                            {item.price_tokens} Tokens
                          </p>
                          <p className="text-gray-500 text-xs">
                            {item.category}
                          </p>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="w-8 h-8 bg-primary-500/20 text-primary-400 rounded flex items-center justify-center hover:bg-primary-500/30 transition-colors"
                            title="Agregar al carrito"
                            aria-label="Agregar al carrito"
                          >
                            <FiShoppingCart className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeFromWishlist(item.product_id)}
                            className="w-8 h-8 bg-red-500/20 text-red-400 rounded flex items-center justify-center hover:bg-red-500/30 transition-colors"
                            title="Quitar de favoritos"
                            aria-label="Quitar de favoritos"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {wishlist.length > 0 && (
                <div className="p-4 border-t border-gray-700 space-y-3">
                  <Link
                    href="/wishlist"
                    onClick={() => setIsOpen(false)}
                    className="w-full block text-center py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 font-semibold"
                  >
                    Ver Lista Completa
                  </Link>

                  {/* Auth Message for non-authenticated users */}
                  {!user && (
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <FiUser className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-400 text-sm font-medium">¡Inicia sesión!</span>
                      </div>
                      <p className="text-blue-300 text-xs">
                        Guarda tu lista de deseos permanentemente
                      </p>
                      <Link
                        href="/login"
                        onClick={() => setIsOpen(false)}
                        className="inline-block mt-2 px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded hover:bg-blue-500/30 transition-colors"
                      >
                        Iniciar Sesión
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}