'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiX, FiPlus, FiMinus, FiTrash2, FiUser } from 'react-icons/fi';
import { useCart } from '@/components/providers/CartProvider';
import { useAuth } from '@/components/providers/AuthProvider';

export function MiniCart() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const { cart, removeFromCart, updateQuantity, getCartTotal, getCartItemsCount } = useCart();
  const { user } = useAuth();

  const itemsCount = getCartItemsCount();
  const total = getCartTotal();

  const dec = (productId: string, current: number) => {
    if (current <= 1) {
      // remove when going below 1
      removeFromCart(productId);
    } else {
      updateQuantity(productId, current - 1);
    }
  };

  const inc = (productId: string, current: number) => {
    updateQuantity(productId, current + 1);
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
      {/* Cart Button with Text */}
      <button
        className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-gray-800/50"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="relative">
          <FiShoppingCart className="w-5 h-5" />
          {itemsCount > 0 && (
            <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
              {itemsCount > 99 ? '99+' : itemsCount}
            </span>
          )}
        </div>
        <span className="text-sm font-medium hidden xl:block">Mi Carrito</span>
      </button>

      {/* Cart Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop - only for mobile */}
            <div 
              className="fixed inset-0 z-40 lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Cart Panel */}
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
                  Carrito ({itemsCount})
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                  aria-label="Cerrar"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="max-h-64 overflow-y-auto">
                {cart.length === 0 ? (
                  <div className="p-6 text-center">
                    <FiShoppingCart className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">Tu carrito está vacío</p>
                    <Link
                      href="/tienda"
                      onClick={() => setIsOpen(false)}
                      className="inline-block mt-3 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm"
                    >
                      Ir a la Tienda
                    </Link>
                  </div>
                ) : (
                  <div className="p-2">
                    {cart.map((item) => (
                      <div key={item.product_id} className="flex items-center gap-3 p-3 hover:bg-gray-700/50 rounded-lg transition-colors">
                        {/* Product Image */}
                        {item.image && item.image.startsWith('http') ? (
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-700/50">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                            <div className="w-12 h-12 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-lg flex items-center justify-center hidden">
                              <FiShoppingCart className="w-5 h-5 text-primary-400" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-lg flex items-center justify-center">
                            <FiShoppingCart className="w-5 h-5 text-primary-400" />
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
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => dec(item.product_id, item.quantity)}
                            className="w-6 h-6 bg-gray-700 text-white rounded flex items-center justify-center hover:bg-gray-600 transition-colors"
                            aria-label="Disminuir"
                          >
                            <FiMinus className="w-3 h-3" />
                          </button>
                          <span className="text-white text-sm w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => inc(item.product_id, item.quantity)}
                            className="w-6 h-6 bg-gray-700 text-white rounded flex items-center justify-center hover:bg-gray-600 transition-colors"
                            aria-label="Aumentar"
                          >
                            <FiPlus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.product_id)}
                            className="w-6 h-6 bg-red-500/20 text-red-400 rounded flex items-center justify-center hover:bg-red-500/30 transition-colors ml-1"
                            aria-label="Eliminar"
                          >
                            <FiTrash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {cart.length > 0 && (
                <div className="p-4 border-t border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white font-semibold">Total:</span>
                    <span className="text-primary-400 font-bold text-lg">
                      {total.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} Tokens
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/carrito"
                      onClick={() => setIsOpen(false)}
                      className="block text-center py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 font-semibold text-sm"
                    >
                      Ver Carrito
                    </Link>
                    <Link
                      href="/carrito"
                      onClick={() => setIsOpen(false)}
                      className="block text-center py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:from-primary-600 hover:to-accent-600 transition-all duration-300 font-semibold text-sm"
                    >
                      Pagar
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}