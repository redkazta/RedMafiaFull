'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import { supabase } from '@/lib/supabase';

export interface CartItem {
  id: string;
  product_id: string;
  name: string;
  price_tokens: number;
  quantity: number;
  image: string;
  category: string;
}

export interface WishlistItem {
  id: string;
  product_id: string;
  name: string;
  price_tokens: number;
  image: string;
  category: string;
}

interface CartContextType {
  cart: CartItem[];
  wishlist: WishlistItem[];
  loading: boolean;
  addToCart: (item: Omit<CartItem, 'id' | 'quantity'>) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  addToWishlist: (item: Omit<WishlistItem, 'id'>) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  migrateLocalStorageToDatabase: () => Promise<void>;
}

const CartContext = createContext<CartContextType>({
  cart: [],
  wishlist: [],
  loading: false,
  addToCart: async () => {},
  removeFromCart: async () => {},
  updateQuantity: async () => {},
  clearCart: async () => {},
  getCartTotal: () => 0,
  getCartItemsCount: () => 0,
  addToWishlist: async () => {},
  removeFromWishlist: async () => {},
  isInWishlist: () => false,
  migrateLocalStorageToDatabase: async () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [userCartId, setUserCartId] = useState<string | null>(null);

  // Load data when auth state changes
  useEffect(() => {
    if (!authLoading) {
      if (user) {
        loadUserData();
      } else {
        loadGuestData();
      }
    }
  }, [user, authLoading]);

  const loadUserData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Get or create user's cart
      let { data: cartData, error: cartError } = await supabase
        .from('shopping_cart')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (cartError && cartError.code === 'PGRST116') {
        // Create cart if it doesn't exist
        const { data: newCart, error: createError } = await supabase
          .from('shopping_cart')
          .insert({ user_id: user.id })
          .select('id')
          .single();

        if (createError) {
          console.error('Error creating cart:', createError);
          return;
        }
        cartData = newCart;
      }

      if (cartData) {
        setUserCartId(cartData.id);

        // Load cart items
        const { data: cartItems, error: cartItemsError } = await supabase
          .from('cart_items')
          .select(`
            id,
            product_id,
            quantity,
            price_tokens,
            products (
              name,
              main_image_url,
              product_categories (name)
            )
          `)
          .eq('cart_id', cartData.id);

        if (!cartItemsError && cartItems) {
          const formattedCart = cartItems
            .filter(item => item.product_id !== null)
            .map(item => ({
              id: item.id,
              product_id: item.product_id!,
              name: item.products?.name || '',
              price_tokens: item.price_tokens,
              quantity: item.quantity,
              image: item.products?.main_image_url || '',
              category: item.products?.product_categories?.name || ''
            }));
          setCart(formattedCart);
        }
      }

      // Load wishlist from database
      const { data: wishlistItems, error: wishlistError } = await supabase
        .from('ecommerce_wishlists')
        .select(`
          id,
          product_id,
          products (
            name,
            main_image_url,
            price_tokens,
            product_categories (name)
          )
        `)
        .eq('user_id', user.id);

      if (!wishlistError && wishlistItems) {
        const formattedWishlist = wishlistItems.map(item => ({
          id: item.id,
          product_id: item.product_id,
          name: item.products?.name || '',
          price_tokens: item.products?.price_tokens || 0,
          image: item.products?.main_image_url || '',
          category: item.products?.product_categories?.name || ''
        }));
        setWishlist(formattedWishlist);
      } else {
        // Fallback to localStorage if database fails
        const savedWishlist = localStorage.getItem('red-mafia-wishlist');
        if (savedWishlist) {
          try {
            setWishlist(JSON.parse(savedWishlist));
          } catch (error) {
            console.error('Error loading wishlist from localStorage:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadGuestData = () => {
    // Load from localStorage for guest users
    const savedCart = localStorage.getItem('red-mafia-cart');
    const savedWishlist = localStorage.getItem('red-mafia-wishlist');

    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }

    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error);
      }
    }
  };

  // Save to localStorage for guest users
  useEffect(() => {
    if (!user) {
      localStorage.setItem('red-mafia-cart', JSON.stringify(cart));
    }
  }, [cart, user]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem('red-mafia-wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, user]);

  const addToCart = async (item: Omit<CartItem, 'id' | 'quantity'>) => {
    if (user && userCartId) {
      // Add to database
      try {
        const existing = cart.find(cartItem => cartItem.product_id === item.product_id);

        if (existing) {
          // Update quantity
          await updateQuantity(item.product_id, existing.quantity + 1);
        } else {
          // Add new item
          const { data, error } = await supabase
            .from('cart_items')
            .insert({
              cart_id: userCartId,
              product_id: item.product_id,
              quantity: 1,
              price_tokens: item.price_tokens
            })
            .select('id')
            .single();

          if (!error && data) {
            const newItem: CartItem = {
              id: data.id,
              product_id: item.product_id,
              name: item.name,
              price_tokens: item.price_tokens,
              quantity: 1,
              image: item.image,
              category: item.category
            };
            setCart(prev => [...prev, newItem]);
          }
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    } else {
      // Add to localStorage
      setCart(prev => {
        const existing = prev.find(cartItem => cartItem.product_id === item.product_id);
        if (existing) {
          return prev.map(cartItem =>
            cartItem.product_id === item.product_id
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          );
        }
        return [...prev, {
          ...item,
          id: `local-${Date.now()}`,
          quantity: 1
        }];
      });
    }
  };

  const removeFromCart = async (productId: string) => {
    if (user && userCartId) {
      // Remove from database
      try {
        const item = cart.find(cartItem => cartItem.product_id === productId);
        if (item) {
          const { error } = await supabase
            .from('cart_items')
            .delete()
            .eq('id', item.id);

          if (!error) {
            setCart(prev => prev.filter(item => item.product_id !== productId));
          }
        }
      } catch (error) {
        console.error('Error removing from cart:', error);
      }
    } else {
      // Remove from localStorage
      setCart(prev => prev.filter(item => item.product_id !== productId));
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    if (user && userCartId) {
      // Update in database
      try {
        const item = cart.find(cartItem => cartItem.product_id === productId);
        if (item) {
          const { error } = await supabase
            .from('cart_items')
            .update({ quantity })
            .eq('id', item.id);

          if (!error) {
            setCart(prev =>
              prev.map(item =>
                item.product_id === productId ? { ...item, quantity } : item
              )
            );
          }
        }
      } catch (error) {
        console.error('Error updating quantity:', error);
      }
    } else {
      // Update in localStorage
      setCart(prev =>
        prev.map(item =>
          item.product_id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = async () => {
    if (user && userCartId) {
      // Clear from database
      try {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('cart_id', userCartId);

        if (!error) {
          setCart([]);
        }
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    } else {
      // Clear from localStorage
      setCart([]);
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price_tokens * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const addToWishlist = async (item: Omit<WishlistItem, 'id'>) => {
    if (user) {
      // Add to database
      try {
        const existing = wishlist.find(wishItem => wishItem.product_id === item.product_id);
        if (existing) return; // Already in wishlist

        const { data, error } = await supabase
          .from('ecommerce_wishlists')
          .insert({
            user_id: user.id,
            product_id: item.product_id
          })
          .select('id')
          .single();

        if (!error && data) {
          const newItem: WishlistItem = {
            id: data.id,
            product_id: item.product_id,
            name: item.name,
            price_tokens: item.price_tokens,
            image: item.image,
            category: item.category
          };
          setWishlist(prev => [...prev, newItem]);
        }
      } catch (error) {
        console.error('Error adding to wishlist:', error);
      }
    } else {
      // Add to localStorage
      setWishlist(prev => {
        const existing = prev.find(wishItem => wishItem.product_id === item.product_id);
        if (existing) return prev;
        return [...prev, { ...item, id: `wish-${Date.now()}` }];
      });
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (user) {
      // Remove from database
      try {
        const item = wishlist.find(wishItem => wishItem.product_id === productId);
        if (item) {
          const { error } = await supabase
            .from('ecommerce_wishlists')
            .delete()
            .eq('id', item.id);

          if (!error) {
            setWishlist(prev => prev.filter(item => item.product_id !== productId));
          }
        }
      } catch (error) {
        console.error('Error removing from wishlist:', error);
      }
    } else {
      // Remove from localStorage
      setWishlist(prev => prev.filter(item => item.product_id !== productId));
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.product_id === productId);
  };

  const migrateLocalStorageToDatabase = async () => {
    if (!user || !userCartId) return;

    try {
      // Migrate cart items
      const localCart = localStorage.getItem('red-mafia-cart');
      if (localCart) {
        const cartItems = JSON.parse(localCart);
        for (const item of cartItems) {
          await supabase
            .from('cart_items')
            .insert({
              cart_id: userCartId,
              product_id: item.product_id,
              quantity: item.quantity,
              price_tokens: item.price_tokens
            });
        }
      }

      // Migrate wishlist items
      const localWishlist = localStorage.getItem('red-mafia-wishlist');
      if (localWishlist) {
        const wishlistItems = JSON.parse(localWishlist);
        for (const item of wishlistItems) {
          await supabase
            .from('ecommerce_wishlists')
            .insert({
              user_id: user.id,
              product_id: item.product_id
            });
        }
      }

      // Clear localStorage
      localStorage.removeItem('red-mafia-cart');
      localStorage.removeItem('red-mafia-wishlist');

      // Reload data
      await loadUserData();
    } catch (error) {
      console.error('Error migrating data:', error);
    }
  };

  const value = {
    cart,
    wishlist,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    migrateLocalStorageToDatabase
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};