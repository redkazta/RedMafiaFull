'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiHeart, FiMinus, FiPlus } from 'react-icons/fi';
import { useCart } from '@/components/providers/CartProvider';
import { useAuth } from '@/components/providers/AuthProvider';

interface ProductActionsProps {
  productId: number; // ✅ Corregido: debe ser number según Supabase
  productName: string;
  productPrice: number;
  productImage: string;
  productCategory: string;
  stockQuantity?: number;
  className?: string;
}

export function ProductActions({
  productId,
  productName,
  productPrice,
  productImage,
  productCategory,
  stockQuantity = 999,
  className = ''
}: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const { addToCart, addToWishlist, isInWishlist } = useCart();
  const { user } = useAuth();

  const isInWishlistState = isInWishlist(productId);

  const handleAddToCart = async () => {
    if (quantity > stockQuantity) {
      alert('No hay suficiente stock disponible');
      return;
    }

    setLoading(true);
    try {
      await addToCart({
        product_id: productId,
        name: productName,
        price_tokens: productPrice,
        image: productImage,
        category: productCategory
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWishlist = async () => {
    setLoading(true);
    try {
      if (isInWishlistState) {
        // Remove from wishlist
        await addToWishlist({
          product_id: productId,
          name: productName,
          price_tokens: productPrice,
          image: productImage,
          category: productCategory
        });
      } else {
        // Add to wishlist
        await addToWishlist({
          product_id: productId,
          name: productName,
          price_tokens: productPrice,
          image: productImage,
          category: productCategory
        });
      }
    } catch (error) {
      console.error('Error managing wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const incrementQuantity = () => {
    if (quantity < stockQuantity) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Quantity Selector */}
      <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3 border border-gray-700">
        <span className="text-white font-medium">Cantidad:</span>
        <div className="flex items-center space-x-3">
          <button
            onClick={decrementQuantity}
            disabled={quantity <= 1}
            className="w-8 h-8 bg-gray-700 text-white rounded flex items-center justify-center hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiMinus className="w-4 h-4" />
          </button>
          <span className="text-white font-bold w-8 text-center">
            {quantity}
          </span>
          <button
            onClick={incrementQuantity}
            disabled={quantity >= stockQuantity}
            className="w-8 h-8 bg-gray-700 text-white rounded flex items-center justify-center hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiPlus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stock Info */}
      {stockQuantity <= 10 && (
        <div className="text-center">
          <span className={`text-sm font-medium ${
            stockQuantity === 0 ? 'text-red-400' :
            stockQuantity <= 5 ? 'text-orange-400' : 'text-yellow-400'
          }`}>
            {stockQuantity === 0 ? 'Sin stock' :
             stockQuantity <= 5 ? `Solo ${stockQuantity} disponibles` :
             `Últimas ${stockQuantity} unidades`}
          </span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        {/* Add to Cart Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddToCart}
          disabled={loading || stockQuantity === 0}
          className="flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:from-primary-600 hover:to-accent-600 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiShoppingCart className="w-5 h-5" />
          <span>{loading ? 'Agregando...' : 'Agregar al Carrito'}</span>
        </motion.button>

        {/* Wishlist Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddToWishlist}
          disabled={loading}
          className={`flex items-center justify-center space-x-2 py-3 rounded-lg transition-all duration-300 font-semibold disabled:opacity-50 ${
            isInWishlistState
              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
              : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600'
          }`}
        >
          <FiHeart className={`w-5 h-5 ${isInWishlistState ? 'fill-current' : ''}`} />
          <span>
            {isInWishlistState ? 'En Wishlist' : 'Agregar a Wishlist'}
          </span>
        </motion.button>
      </div>

      {/* Total Price */}
      <div className="text-center pt-2 border-t border-gray-700">
        <div className="text-sm text-gray-400">Total:</div>
        <div className="text-xl font-bold text-primary-400">
          {(productPrice * quantity).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} Tokens
        </div>
      </div>

      {/* Auth Reminder */}
      {!user && (
        <div className="text-center p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-blue-400 text-sm">
            💡 Inicia sesión para guardar tu carrito y wishlist permanentemente
          </p>
        </div>
      )}
    </div>
  );
}

// Componente simplificado para botones rápidos (solo iconos)
interface QuickActionsProps {
  productId: string;
  productName: string;
  productPrice: number;
  productImage: string;
  productCategory: string;
  className?: string;
}

export function QuickActions({
  productId,
  productName,
  productPrice,
  productImage,
  productCategory,
  className = ''
}: QuickActionsProps) {
  const [loading, setLoading] = useState(false);
  const { addToCart, addToWishlist, isInWishlist } = useCart();

  const isInWishlistState = isInWishlist(productId);

  const handleQuickAddToCart = async () => {
    setLoading(true);
    try {
      await addToCart({
        product_id: productId,
        name: productName,
        price_tokens: productPrice,
        image: productImage,
        category: productCategory
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAddToWishlist = async () => {
    setLoading(true);
    try {
      await addToWishlist({
        product_id: productId,
        name: productName,
        price_tokens: productPrice,
        image: productImage,
        category: productCategory
      });
    } catch (error) {
      console.error('Error managing wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleQuickAddToCart}
        disabled={loading}
        className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:from-primary-600 hover:to-accent-600 transition-all duration-300 disabled:opacity-50"
        title="Agregar al carrito"
      >
        <FiShoppingCart className="w-5 h-5" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleQuickAddToWishlist}
        disabled={loading}
        className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 disabled:opacity-50 ${
          isInWishlistState
            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
            : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600'
        }`}
        title={isInWishlistState ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      >
        <FiHeart className={`w-5 h-5 ${isInWishlistState ? 'fill-current' : ''}`} />
      </motion.button>
    </div>
  );
}
