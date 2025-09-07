'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Heart, Share2, Star, Play, Pause, Volume2 } from 'lucide-react';
import { useCart } from '@/components/providers/CartProvider';
import { toast } from 'sonner';

interface ProductAttribute {
  id: number;
  name: string;
  value: string;
  type: string;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
  attributes: ProductAttribute[];
}

export default function ProductDetailPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!params || !params.slug) {
          throw new Error('Slug de producto no válido');
        }
        const response = await fetch(`/api/products/slug/${params.slug}`);
        if (!response.ok) {
          throw new Error('Producto no encontrado');
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el producto');
      } finally {
        setLoading(false);
      }
    };

    if (params?.slug) {
      fetchProduct();
    }
  }, [params.slug]);

  const handleAddToCart = () => {
    if (!product) return;

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url,
      quantity: 1,
      selectedSize,
      selectedColor,
    };

    addToCart(cartItem);
    toast.success('Producto agregado al carrito');
  };

  const getProductType = () => {
    if (!product) return 'default';
    
    const typeAttribute = product.attributes.find(attr => 
      attr.name.toLowerCase().includes('tipo') || 
      attr.name.toLowerCase().includes('categoría')
    );
    
    if (typeAttribute) {
      const type = typeAttribute.value.toLowerCase();
      if (type.includes('música') || type.includes('audio')) return 'music';
      if (type.includes('ropa') || type.includes('camiseta')) return 'clothing';
      if (type.includes('accesorio') || type.includes('joyería')) return 'accessory';
      if (type.includes('limitada') || type.includes('edición')) return 'limited';
    }
    
    return 'default';
  };

  const renderMusicPlayer = () => {
    if (getProductType() !== 'music') return null;

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Vista Previa Musical
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                <Play className="h-8 w-8" />
              </div>
              <div>
                <h3 className="font-bold text-lg">{product?.name}</h3>
                <p className="text-white/80">Vista previa de 30 segundos</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <div className="flex-1 bg-white/20 rounded-full h-2">
                <div className="bg-white rounded-full h-2 w-1/3"></div>
              </div>
              <span className="text-sm text-white/80">0:30</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderClothingOptions = () => {
    if (getProductType() !== 'clothing') return null;

    const sizes = product?.attributes.filter(attr => 
      attr.name.toLowerCase().includes('talla') || 
      attr.name.toLowerCase().includes('size')
    ) || [];

    const colors = product?.attributes.filter(attr => 
      attr.name.toLowerCase().includes('color')
    ) || [];

    return (
      <div className="space-y-4">
        {sizes.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Talla</h4>
            <div className="flex gap-2">
              {sizes.map((size) => (
                <Button
                  key={size.id}
                  variant={selectedSize === size.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSize(size.value)}
                >
                  {size.value}
                </Button>
              ))}
            </div>
          </div>
        )}

        {colors.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Color</h4>
            <div className="flex gap-2">
              {colors.map((color) => (
                <Button
                  key={color.id}
                  variant={selectedColor === color.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedColor(color.value)}
                  className="capitalize"
                >
                  {color.value}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderAccessoryDetails = () => {
    if (getProductType() !== 'accessory') return null;

    const measurements = product?.attributes.filter(attr => 
      attr.name.toLowerCase().includes('medida') || 
      attr.name.toLowerCase().includes('tamaño') ||
      attr.name.toLowerCase().includes('dimension')
    ) || [];

    const materials = product?.attributes.filter(attr => 
      attr.name.toLowerCase().includes('material') || 
      attr.name.toLowerCase().includes('acabado')
    ) || [];

    return (
      <div className="space-y-4">
        {measurements.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Medidas</h4>
            <div className="grid grid-cols-2 gap-2">
              {measurements.map((measurement) => (
                <div key={measurement.id} className="text-sm">
                  <span className="font-medium">{measurement.name}:</span>
                  <span className="ml-2">{measurement.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {materials.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Materiales y Acabados</h4>
            <div className="space-y-1">
              {materials.map((material) => (
                <div key={material.id} className="text-sm">
                  <span className="font-medium">{material.name}:</span>
                  <span className="ml-2">{material.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderLimitedEdition = () => {
    if (getProductType() !== 'limited') return null;

    return (
      <Card className="mb-6 border-2 border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-700">
            <Star className="h-5 w-5 fill-yellow-400" />
            Edición Limitada
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-yellow-700 font-medium">
              Solo quedan {product?.stock} unidades disponibles
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-yellow-200 text-yellow-800">
                Exclusivo
              </Badge>
              <Badge variant="secondary" className="bg-yellow-200 text-yellow-800">
                Numerado
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Producto no encontrado</h1>
          <p className="text-gray-600 mb-6">{error || 'El producto que buscas no existe'}</p>
          <Button asChild>
            <a href="/tienda">Volver a la tienda</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Imagen del producto */}
        <div className="space-y-4">
          <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Información del producto */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary">{product.category}</Badge>
              {product.stock > 0 ? (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  En stock ({product.stock})
                </Badge>
              ) : (
                <Badge variant="destructive">Agotado</Badge>
              )}
            </div>
            <p className="text-3xl font-bold text-gray-900">${product.price.toLocaleString()}</p>
          </div>

          <Separator />

          {/* Contenido específico según el tipo */}
          {renderMusicPlayer()}
          {renderClothingOptions()}
          {renderAccessoryDetails()}
          {renderLimitedEdition()}

          <div>
            <h3 className="font-medium mb-2">Descripción</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>

          {/* Atributos del producto */}
          {product.attributes.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Características</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.attributes.map((attribute) => (
                  <div key={attribute.id} className="flex justify-between text-sm">
                    <span className="font-medium text-gray-600">{attribute.name}:</span>
                    <span className="text-gray-900">{attribute.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Botones de acción */}
          <div className="space-y-4">
            <Button 
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full"
              size="lg"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {product.stock > 0 ? 'Agregar al carrito' : 'Agotado'}
            </Button>
            
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <Heart className="h-4 w-4 mr-2" />
                Favoritos
              </Button>
              <Button variant="outline" className="flex-1">
                <Share2 className="h-4 w-4 mr-2" />
                Compartir
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
