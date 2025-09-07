'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { FiShoppingCart, FiStar, FiHeart, FiTrendingUp, FiTag } from 'react-icons/fi';
import { useCart } from '@/components/providers/CartProvider';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface ProductAttribute {
  id: number;
  name: string;
  value: string;
  type: string;
}

interface Product {
  id: string; // Cambiado a string porque Supabase usa UUID
  name: string;
  slug: string;
  price: number;
  price_tokens: number;
  image_url: string | null;
  description: string | null;
  category_id: string | null; // Cambiado a string porque es UUID
  stock_quantity: number | null;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  product_categories: { id: string; name: string; } | null; // Cambiado a string
  attributes?: ProductAttribute[];
  // Campos adicionales para compatibilidad - HACERLOS OBLIGATORIOS
  main_image_url: string | null;
  image_urls: string[] | null;
  status: string | null;
  is_featured: boolean | null;
  original_price_mxn: number | null;
}

export default function TiendaPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Array<{key: string, label: string, icon: any}>>([]);
  const [loading, setLoading] = useState(true);
  const [animatingProduct, setAnimatingProduct] = useState<string | null>(null);
  const { addToCart, addToWishlist, isInWishlist, removeFromWishlist } = useCart();
  
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      // Get products data (attributes removed due to relation issues)
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          id,
          name,
          price,
          price_tokens,
          image_url,
          description,
          category_id,
          stock_quantity,
          is_active,
          created_at,
          updated_at
        `)
        .order('name');

      if (productsError) {
        console.error('Error loading products:', productsError);
        return;
      }

      if (!productsData || productsData.length === 0) {
        setProducts([]);
        return;
      }

      // Process products with attributes
      const data: Product[] = productsData.map(product => ({
        // Crear objeto Product manualmente sin spread para evitar errores de tipo
        id: String(product.id), // Convertir a string para compatibilidad con UUID
        name: product.name,
        slug: product.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'), // Generar slug desde el nombre
        price: product.price,
        price_tokens: product.price_tokens,
        image_url: product.image_url,
        description: product.description,
        // Propiedades requeridas por el tipo Product
        category_id: product.category_id ? String(product.category_id) : null, // Convertir a string
        stock_quantity: product.stock_quantity,
        is_active: product.is_active,
        created_at: product.created_at,
        updated_at: product.updated_at,
        // Propiedades adicionales para la interfaz local
        category: 'General', // Categoría por defecto
        stock: product.stock_quantity || 0,
        attributes: [],
        // Campos adicionales
        main_image_url: product.image_url,
        image_urls: null,
        status: product.is_active ? 'active' : 'inactive',
        is_featured: false,
        original_price_mxn: null,
        product_categories: null // Agregar esta propiedad que también se usa
      }));

      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error loading categories:', error);
        return;
      }

      const categoryOptions = [
    { key: 'all', label: 'Todo', icon: FiShoppingCart },
        { key: 'featured', label: 'Destacados', icon: FiTrendingUp },
        ...data.map(cat => ({
          key: cat.name.toLowerCase().replace(/\s+/g, '-'),
          label: cat.name,
          icon: cat.name.toLowerCase().includes('ropa') ? FiTag : FiStar
        }))
      ];

      setCategories(categoryOptions);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleAddToCart = async (product: Product) => {
    try {
                  setAnimatingProduct(product.id.toString());

              await addToCart({
      product_id: product.id, // ✅ Ahora usa string UUID directamente
      name: product.name,
          price_tokens: product.price_tokens,
          image: product.image_url || '',
          category: product.product_categories?.name || 'general'
        });

      toast.success(`${product.name} agregado al carrito!`, {
        icon: '🛒',
        duration: 3000,
      });

      setTimeout(() => setAnimatingProduct(null), 1000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Error al agregar al carrito');
    }
  };

  const handleToggleWishlist = async (product: Product) => {
    try {
    if (isInWishlist(product.id)) {
        await removeFromWishlist(product.id);
        toast.success('Removido de la wishlist', {
          icon: '💔',
          duration: 2000,
        });
    } else {
        await addToWishlist({
        product_id: product.id,
        name: product.name,
          price_tokens: product.price_tokens,
          image: product.image_url || '',
          category: product.product_categories?.name || 'general'
        });
        toast.success('Agregado a la wishlist!', {
          icon: '❤️',
          duration: 2000,
        });
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast.error('Error al actualizar wishlist');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/10 via-transparent to-accent-900/10"></div>
        
        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/6 w-80 h-80 bg-primary-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-accent-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      
      <Header />
      
      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="relative py-20">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-6">
                <span className="bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 bg-clip-text text-transparent animate-pulse">
                  Tienda Oficial
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                Productos exclusivos de la Red Mafia. Ropa cyberpunk, música digital y coleccionables únicos.
              </p>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="relative py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <motion.div
                    key={product.id} 
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 group hover:border-primary-500/50 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  >
                    {/* Product Image */}
                    <Link href={`/producto/${product.slug}`} className="block">
                      <div className="relative aspect-square bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center overflow-hidden cursor-pointer">
                        <Image
                          src={product.image_url || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop&crop=center'}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                           e.currentTarget.src = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop&crop=center';
                         }}
                       />
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-accent-500/10 group-hover:from-primary-500/20 group-hover:to-accent-500/20 transition-all duration-300"></div>
                      
                      {/* Quick Actions */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(product);
                            }}
                          className="w-12 h-12 bg-primary-500/80 rounded-full flex items-center justify-center text-white hover:bg-primary-500 transition-colors shadow-lg"
                          >
                            <FiShoppingCart className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleWishlist(product);
                            }}
                                                     className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-colors ${
                              isInWishlist(product.id)
                               ? 'bg-red-500/80 hover:bg-red-500'
                               : 'bg-gray-600/80 hover:bg-gray-500'
                            }`}
                          >
                          <FiHeart className="w-5 h-5" />
                        </motion.button>
                        </div>
                      </div>
                      </div>
                    </Link>
                    
                    {/* Product Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">{product.name}</h3>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {product.description || 'Descripción no disponible'}
                    </p>

                    {/* Product Attributes */}
                    {product.attributes && product.attributes.length > 0 && (
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-1">
                          {product.attributes.slice(0, 3).map((attr) => (
                            <span
                              key={attr.id}
                              className="inline-block bg-gray-700/50 text-gray-300 text-xs px-2 py-1 rounded-full border border-gray-600/50"
                            >
                              {attr.name}: {attr.value}
                            </span>
                          ))}
                          {product.attributes.length > 3 && (
                            <span className="inline-block bg-gray-700/50 text-gray-400 text-xs px-2 py-1 rounded-full border border-gray-600/50">
                              +{product.attributes.length - 3} más
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                                         <div className="flex items-center justify-between">
                       <div className="text-primary-400 font-bold text-lg">
                         {(product.price_tokens ?? 0).toLocaleString()} tokens
                       </div>
                       <div className="text-gray-300 text-sm">
                         ${product.price ? product.price.toFixed(2) : 'N/A'} USD
                        </div>
                      </div>
                      
                    {product.product_categories && (
                      <div className="mt-2">
                        <span className="inline-block bg-primary-500/20 text-primary-300 text-xs px-2 py-1 rounded-full">
                          {product.product_categories.name}
                        </span>
                      </div>
                          )}
                        </div>
                </motion.div>
              ))}
                      </div>
                      
            {products.length === 0 && (
              <div className="text-center py-16">
                <div className="text-gray-400 text-lg mb-4">No hay productos disponibles</div>
                <div className="text-gray-500 text-sm">Los productos aparecerán aquí una vez que sean agregados a la base de datos</div>
                      </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
