import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { slug } = req.query;

  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ message: 'Slug requerido' });
  }

  try {
    // Buscar producto por slug
    const { data: product, error: productError } = await supabase
      .from('products')
      .select(`
        *,
        product_categories(id, name)
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (productError || !product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Buscar atributos del producto (si existe la tabla)
    let attributes = [];
    try {
      const { data: attributesData, error: attributesError } = await supabase
        .from('product_attribute_values')
        .select(`
          value,
          product_attributes(name, type)
        `)
        .eq('product_id', product.id);

      if (!attributesError && attributesData) {
        attributes = attributesData.map(attr => ({
          id: Math.random(), // ID temporal
          name: attr.product_attributes?.name || 'Atributo',
          value: attr.value,
          type: attr.product_attributes?.type || 'text'
        }));
      }
    } catch (attrError) {
      // Si no existe la tabla de atributos, continuar sin error
      console.log('Atributos no disponibles:', attrError);
    }

    const productWithAttributes = {
      ...product,
      attributes: attributes,
      // Campos adicionales para compatibilidad
      price_tokens: product.price_tokens || 0,
      stock: product.stock_quantity || 0,
      category: product.product_categories?.name || 'Sin categoría',
      main_image_url: product.main_image_url || product.image_url,
      image_urls: product.image_urls || [],
      status: product.status || 'active',
      is_featured: product.is_featured || false,
      original_price_mxn: product.original_price_mxn || null
    };

    res.status(200).json(productWithAttributes);

  } catch (error) {
    console.error('Error al buscar producto por slug:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}
