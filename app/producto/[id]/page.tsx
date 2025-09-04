'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductActions } from '@/components/ui/ProductActions';
import { FiArrowLeft, FiStar, FiTruck, FiShield, FiRotateCcw } from 'react-icons/fi';
import { supabase } from '@/lib/supabase';

// Product interface matching actual Supabase data
interface Product {
  id: number;
  name: string;
  price: number;
  price_tokens: number;
  image_url: string | null;
  description: string | null;
  category_id: number | null;
  stock_quantity: number | null;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  product_categories: { id: number; name: string; } | null;
  // Campos adicionales para compatibilidad - HACERLOS OBLIGATORIOS
  main_image_url: string | null;
  image_urls: string[] | null;
  status: string | null;
  is_featured: boolean | null;
  original_price_mxn: number | null;
}

export default function ProductPage() {
  const params = useParams();
  const productIdString = params.id as string;
  const productId = parseInt(productIdString, 10); // ✅ Convertir string a number
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  const loadProduct = useCallback(async () => {
    if (isNaN(productId)) {
      console.error('Invalid product ID');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Get product data
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .eq('is_active', true)
        .single();

      if (productError) {
        console.error('Error loading product:', productError);
        return;
      }

      if (!productData) {
        console.error('Product not found');
        return;
      }

      // Get category data separately if category_id exists
      let categoryData = null;
      if (productData.category_id) {
        const { data: catData, error: catError } = await supabase
          .from('product_categories')
          .select('id, name')
          .eq('id', productData.category_id)
          .single();

        if (!catError && catData) {
          categoryData = catData;
        }
      }

      // Combine data
      const data: Product = {
        ...productData,
        product_categories: categoryData,
        // Agregar campos faltantes con valores por defecto
        main_image_url: productData.image_url, // Usar image_url como main_image_url
        image_urls: null, // No hay múltiples imágenes
        status: productData.is_active ? 'active' : 'inactive', // Mapear is_active a status
        is_featured: false, // Por defecto no es destacado
        original_price_mxn: null // No hay precio original por defecto
      };

      setProduct(data);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  // Load real product data
  useEffect(() => {
    loadProduct();
  }, [productId, loadProduct]);

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

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-white">Producto no encontrado</div>
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
              href="/tienda"
              className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
              <span>Volver a la Tienda</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-xl overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-9xl">
                  {product.image_url || product.main_image_url || '📦'}
                </div>
              </div>

              {/* Thumbnail Images */}
              {product.image_urls && product.image_urls.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.image_urls.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square bg-gradient-to-br from-primary-500/10 to-accent-500/10 rounded-lg flex items-center justify-center text-3xl transition-all ${
                        selectedImage === index ? 'ring-2 ring-primary-500' : ''
                      }`}
                    >
                      {image}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Title and Rating */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <h1 className="text-3xl md:text-4xl font-bold text-white">
                    {product.name}
                  </h1>
                  {product.is_featured && (
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      DESTACADO
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1">
                    <FiStar className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-white font-medium">4.9</span>
                    <span className="text-gray-400">(156 reseñas)</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-400">{product.product_categories?.name}</span>
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="text-4xl font-bold text-primary-400">
                    {product.price_tokens.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} Tokens
                  </span>
                  {product.original_price_mxn && (
                    <span className="text-xl text-gray-500 line-through">
                      ${product.original_price_mxn} MXN
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400">
                  200 Tokens = 1 MXN aproximadamente
                </p>
              </div>

              {/* Stock Status */}
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  (product.stock_quantity ?? 0) > 10 ? 'bg-green-400' :
                  (product.stock_quantity ?? 0) > 0 ? 'bg-yellow-400' : 'bg-red-400'
                }`}></div>
                <span className={`text-sm ${
                  (product.stock_quantity ?? 0) > 10 ? 'text-green-400' :
                  (product.stock_quantity ?? 0) > 0 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {(product.stock_quantity ?? 0) > 10 ? 'En stock' :
                   (product.stock_quantity ?? 0) > 0 ? `Solo ${(product.stock_quantity ?? 0)} disponibles` :
                   'Sin stock'}
                </span>
              </div>

              {/* Product Actions */}
              <ProductActions
                productId={product.id}
                productName={product.name}
                productPrice={product.price_tokens}
                productImage={product.image_url || '📦'}
                productCategory={product.product_categories?.name || 'Sin categoría'}
                stockQuantity={product.stock_quantity}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
              />

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-t border-gray-700">
                <div className="flex items-center space-x-3 text-gray-300">
                  <FiTruck className="w-5 h-5 text-primary-400" />
                  <div>
                    <div className="text-sm font-medium">Envío Gratis</div>
                    <div className="text-xs text-gray-400">En pedidos +500 tokens</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <FiShield className="w-5 h-5 text-primary-400" />
                  <div>
                    <div className="text-sm font-medium">Garantía</div>
                    <div className="text-xs text-gray-400">30 días de devolución</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <FiRotateCcw className="w-5 h-5 text-primary-400" />
                  <div>
                    <div className="text-sm font-medium">Devoluciones</div>
                    <div className="text-xs text-gray-400">Fáciles y rápidas</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Description */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-6">Descripción del Producto</h2>
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
