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
  addToWishlist: (item: Omit<WishlistItem, 'id'>) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  clearCart: () => Promise<void>;
  migrateLocalStorageToDatabase: () => Promise<void>;
}

const CartContext = createContext<CartContextType>({
  cart: [],
  wishlist: [],
  loading: false,
  addToCart: async () => {},
  removeFromCart: async () => {},
  updateQuantity: async () => {},
  addToWishlist: async () => {},
  removeFromWishlist: async () => {},
  isInWishlist: () => false,
  getCartTotal: () => 0,
  getCartItemsCount: () => 0,
  clearCart: async () => {},
  migrateLocalStorageToDatabase: async () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [userCartId, setUserCartId] = useState<string | null>(null);
  const [hasMigrated, setHasMigrated] = useState(false);

  // Load data when auth state changes
  useEffect(() => {
    if (!authLoading) {
      if (user) {
        loadUserData();
      } else {
        loadLocalStorageData();
        setHasMigrated(false);
      }
    }
  }, [user, authLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  // After user cart id is available, migrate any guest data once
  useEffect(() => {
    const doMigration = async () => {
      if (user && userCartId && !hasMigrated) {
        await migrateLocalStorageToDatabase();
        setHasMigrated(true);
      }
    };
    doMigration();
  }, [user, userCartId, hasMigrated]);

  const loadLocalStorageData = () => {
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
      // Add to localStorage (guest user)
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

  const addToWishlist = async (item: Omit<WishlistItem, 'id'>) => {
    // TEMPORARILY DISABLED: Database wishlist functionality
    // TODO: Create ecommerce_wishlists table in Supabase schema
    /*
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
      // Add to localStorage (works for both authenticated and guest users)
      setWishlist(prev => {
        const existing = prev.find(wishItem => wishItem.product_id === item.product_id);
        if (existing) return prev;
        return [...prev, { ...item, id: `wish-${Date.now()}` }];
      });
    }
  */

  const removeFromWishlist = async (productId: string) => {
    // TEMPORARILY DISABLED: Database wishlist functionality
    // TODO: Create ecommerce_wishlists table in Supabase schema
    /*
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
    */

    // Remove from localStorage (works for both authenticated and guest users)
    setWishlist(prev => prev.filter(item => item.product_id !== productId));
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.product_id === productId);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price_tokens * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const clearCart = async () => {
    if (user && userCartId) {
      // Clear database cart
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
      // Clear localStorage cart
      setCart([]);
    }
  };

  const migrateLocalStorageToDatabase = async () => {
    if (!user || !userCartId) return;

    const localCart = localStorage.getItem('red-mafia-cart');
    const localWishlist = localStorage.getItem('red-mafia-wishlist');

    if (localCart) {
      try {
        const cartItems: CartItem[] = JSON.parse(localCart);

        for (const item of cartItems) {
          const existing = cart.find((c) => c.product_id === item.product_id);
          if (existing) {
            // Increase existing quantity by the local quantity (default to 1)
            const addedQty = Math.max(1, item.quantity || 1);
            await updateQuantity(item.product_id, existing.quantity + addedQty);
          } else {
            // Ensure item exists then set desired quantity
            await addToCart({
              product_id: item.product_id,
              name: item.name,
              price_tokens: item.price_tokens,
              image: item.image,
              category: item.category,
            });
            const desiredQty = Math.max(1, item.quantity || 1);
            if (desiredQty > 1) {
              await updateQuantity(item.product_id, desiredQty);
            }
          }
        }

        // Clear localStorage after migration
        localStorage.removeItem('red-mafia-cart');
      } catch (error) {
        console.error('Error migrating cart:', error);
      }
    }

    if (localWishlist) {
      try {
        const wishlistItems: WishlistItem[] = JSON.parse(localWishlist);
        for (const item of wishlistItems) {
          const already = wishlist.some((w) => w.product_id === item.product_id);
          if (!already) {
            await addToWishlist({
              product_id: item.product_id,
              name: item.name,
              price_tokens: item.price_tokens,
              image: item.image,
              category: item.category,
            });
          }
        }
        localStorage.removeItem('red-mafia-wishlist');
      } catch (error) {
        console.error('Error migrating wishlist:', error);
      }
    }
  };

  const value = {
    cart,
    wishlist,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    getCartTotal,
    getCartItemsCount,
    clearCart,
    migrateLocalStorageToDatabase,
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