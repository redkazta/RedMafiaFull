'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductActions } from '@/components/ui/ProductActions';
import { FiArrowLeft, FiStar, FiTruck, FiShield, FiRotateCcw, FiMusic, FiHeadphones, FiGift, FiAward } from 'react-icons/fi';
import { supabase } from '@/lib/supabase';

// Product interface matching actual Supabase data
interface ProductAttribute {
  id: number;
  name: string;
  value: string;
  type: string;
}

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
  product_categories?: { id: number; name: string; } | null;
  attributes?: ProductAttribute[];
  // Campos adicionales para compatibilidad - HACERLOS OBLIGATORIOS
  main_image_url: string | null;
  image_urls: string[] | null;
  status: string | null;
  is_featured: boolean | null;
  original_price_mxn: number | null;
}

// Función para determinar el tipo de producto
const getProductType = (product: Product): string => {
  const name = product.name.toLowerCase();
  
  if (name.includes('maqueta') || name.includes('remix') || name.includes('demo') || name.includes('track') || name.includes('drumkit') || name.includes('clase')) {
    return 'music';
  } else if (name.includes('hoodie') || name.includes('camiseta') || name.includes('gorra')) {
    return 'clothing';
  } else if (name.includes('cadena') || name.includes('anillo') || name.includes('collar')) {
    return 'accessories';
  } else if (name.includes('sticker') || name.includes('poster')) {
    return 'merchandise';
  } else if (name.includes('edición limitada') || name.includes('limitada')) {
    return 'limited';
  }
  
  return 'default';
};

// Componente para productos de música
const MusicProductDetails = ({ product }: { product: Product }) => {
  const duration = product.attributes?.find(attr => attr.name === 'Duración')?.value;
  const artist = product.attributes?.find(attr => attr.name === 'Artista')?.value;
  const format = product.attributes?.find(attr => attr.name === 'Formato')?.value;
  const quality = product.attributes?.find(attr => attr.name === 'Calidad')?.value;

  return (
    <div className="space-y-6">
      {/* Audio Player */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center">
            <FiMusic className="w-8 h-8 text-primary-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Vista Previa</h3>
            <p className="text-gray-400">Escucha una muestra del track</p>
          </div>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">00:00</span>
            <span className="text-sm text-gray-400">{duration || 'N/A'}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
            <div className="bg-primary-500 h-2 rounded-full w-0"></div>
          </div>
          <div className="flex items-center justify-center">
            <button className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white hover:bg-primary-600 transition-colors">
              <FiHeadphones className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Music Details */}
      <div className="grid grid-cols-2 gap-4">
        {artist && (
          <div className="bg-gray-800/30 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-400 mb-1">Artista</h4>
            <p className="text-white font-semibold">{artist}</p>
          </div>
        )}
        {duration && (
          <div className="bg-gray-800/30 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-400 mb-1">Duración</h4>
            <p className="text-white font-semibold">{duration}</p>
          </div>
        )}
        {format && (
          <div className="bg-gray-800/30 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-400 mb-1">Formato</h4>
            <p className="text-white font-semibold">{format}</p>
          </div>
        )}
        {quality && (
          <div className="bg-gray-800/30 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-400 mb-1">Calidad</h4>
            <p className="text-white font-semibold">{quality}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Componente para productos de ropa
const ClothingProductDetails = ({ product }: { product: Product }) => {
  const size = product.attributes?.find(attr => attr.name === 'Talla')?.value;
  const color = product.attributes?.find(attr => attr.name === 'Color')?.value;
  const material = product.attributes?.find(attr => attr.name === 'Material')?.value;

  return (
    <div className="space-y-6">
      {/* Size Selector */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4">Selecciona tu talla</h3>
        <div className="grid grid-cols-5 gap-2">
          {['S', 'M', 'L', 'XL', 'XXL'].map((talla) => (
            <button
              key={talla}
              className={`p-3 rounded-lg border transition-colors ${
                size === talla
                  ? 'border-primary-500 bg-primary-500/20 text-primary-400'
                  : 'border-gray-600 text-gray-300 hover:border-gray-500'
              }`}
            >
              {talla}
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-400 mt-2">Talla seleccionada: {size || 'N/A'}</p>
      </div>

      {/* Clothing Details */}
      <div className="grid grid-cols-1 gap-4">
        {color && (
          <div className="bg-gray-800/30 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-400 mb-1">Color</h4>
            <div className="flex items-center space-x-2">
              <div className={`w-6 h-6 rounded-full border-2 border-gray-600 ${
                color.toLowerCase() === 'negro' ? 'bg-black' :
                color.toLowerCase() === 'blanco' ? 'bg-white' :
                color.toLowerCase() === 'gris' ? 'bg-gray-500' :
                'bg-blue-500'
              }`}></div>
              <p className="text-white font-semibold">{color}</p>
            </div>
          </div>
        )}
        {material && (
          <div className="bg-gray-800/30 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-400 mb-1">Material</h4>
            <p className="text-white font-semibold">{material}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Componente para accesorios
const AccessoriesProductDetails = ({ product }: { product: Product }) => {
  const size = product.attributes?.find(attr => attr.name === 'Talla')?.value;
  const material = product.attributes?.find(attr => attr.name === 'Material')?.value;
  const length = product.attributes?.find(attr => attr.name === 'Longitud')?.value;
  const finish = product.attributes?.find(attr => attr.name === 'Acabado')?.value;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {size && (
          <div className="bg-gray-800/30 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-400 mb-1">Talla</h4>
            <p className="text-white font-semibold">{size}</p>
          </div>
        )}
        {material && (
          <div className="bg-gray-800/30 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-400 mb-1">Material</h4>
            <p className="text-white font-semibold">{material}</p>
          </div>
        )}
        {length && (
          <div className="bg-gray-800/30 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-400 mb-1">Longitud</h4>
            <p className="text-white font-semibold">{length}</p>
          </div>
        )}
        {finish && (
          <div className="bg-gray-800/30 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-400 mb-1">Acabado</h4>
            <p className="text-white font-semibold">{finish}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Componente para ediciones limitadas
const LimitedEditionDetails = ({ product }: { product: Product }) => {
  const editionNumber = product.attributes?.find(attr => attr.name === 'Número de edición')?.value;
  const limitedQuantity = product.attributes?.find(attr => attr.name === 'Cantidad limitada')?.value;
  const productType = product.attributes?.find(attr => attr.name === 'Tipo de producto')?.value;
  const specialFeatures = product.attributes?.find(attr => attr.name === 'Características especiales')?.value;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30">
        <div className="flex items-center space-x-3 mb-4">
          <FiAward className="w-8 h-8 text-yellow-400" />
          <div>
            <h3 className="text-xl font-bold text-white">Edición Limitada</h3>
            <p className="text-yellow-300">Producto exclusivo y numerado</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {editionNumber && (
            <div className="bg-black/30 rounded-lg p-4">
              <h4 className="text-sm font-medium text-yellow-400 mb-1">Número de Edición</h4>
              <p className="text-white font-bold text-2xl">{editionNumber}</p>
            </div>
          )}
          {limitedQuantity && (
            <div className="bg-black/30 rounded-lg p-4">
              <h4 className="text-sm font-medium text-yellow-400 mb-1">Cantidad Limitada</h4>
              <p className="text-white font-bold text-2xl">{limitedQuantity}</p>
            </div>
          )}
        </div>
        
        {specialFeatures && (
          <div className="mt-4 bg-black/30 rounded-lg p-4">
            <h4 className="text-sm font-medium text-yellow-400 mb-2">Características Especiales</h4>
            <p className="text-white">{specialFeatures}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default function ProductPage() {
  const params = useParams();
  const productIdString = params?.id as string;
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
      // Get product data (attributes removed due to relation issues)
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

      // Process product with attributes
      const data: Product = {
        ...productData,
        // Agregar campos faltantes con valores por defecto
        main_image_url: productData.image_url, // Usar image_url como main_image_url
        image_urls: null, // No hay múltiples imágenes
        status: productData.is_active ? 'active' : 'inactive', // Mapear is_active a status
        is_featured: false, // Por defecto no es destacado
        original_price_mxn: null, // No hay precio original por defecto
        // Procesar atributos (temporalmente vacío hasta que se resuelva la relación)
        attributes: []
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

  // Validar que params existe después de todos los hooks
  if (!params || !params.id) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-white">ID de producto no válido</div>
        </main>
        <Footer />
      </div>
    );
  }

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
                productId={product.id.toString()}
                productName={product.name}
                productPrice={product.price_tokens}
                productImage={product.image_url || '📦'}
                productCategory={product.product_categories?.name || 'Sin categoría'}
                stockQuantity={product.stock_quantity ?? undefined}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
              />

              {/* Product Type Specific Details */}
              {(() => {
                const productType = getProductType(product);
                switch (productType) {
                  case 'music':
                    return <MusicProductDetails product={product} />;
                  case 'clothing':
                    return <ClothingProductDetails product={product} />;
                  case 'accessories':
                    return <AccessoriesProductDetails product={product} />;
                  case 'limited':
                    return <LimitedEditionDetails product={product} />;
                  default:
                    return (
                      <div className="bg-gray-800/30 rounded-lg p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Detalles del Producto</h3>
                        {product.attributes && product.attributes.length > 0 && (
                          <div className="grid grid-cols-1 gap-3">
                            {product.attributes.map((attr) => (
                              <div key={attr.id} className="flex justify-between">
                                <span className="text-gray-400">{attr.name}:</span>
                                <span className="text-white font-medium">{attr.value}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                }
              })()}

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
