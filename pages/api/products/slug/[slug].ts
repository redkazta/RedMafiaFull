import { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { slug } = req.query;

  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ message: 'Slug requerido' });
  }

  try {
    const client = await pool.connect();

    // Buscar producto por slug con sus atributos
    const productQuery = `
      SELECT 
        p.id,
        p.name,
        p.slug,
        p.description,
        p.price,
        p.image_url,
        p.category,
        p.stock,
        p.created_at,
        p.updated_at
      FROM products p
      WHERE p.slug = $1
    `;

    const productResult = await client.query(productQuery, [slug]);

    if (productResult.rows.length === 0) {
      client.release();
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const product = productResult.rows[0];

    // Buscar atributos del producto
    const attributesQuery = `
      SELECT 
        pa.id,
        pa.name,
        pa.value,
        pa.type,
        pa.created_at
      FROM product_attributes pa
      WHERE pa.product_id = $1
      ORDER BY pa.name, pa.created_at
    `;

    const attributesResult = await client.query(attributesQuery, [product.id]);

    client.release();

    const productWithAttributes = {
      ...product,
      attributes: attributesResult.rows
    };

    res.status(200).json(productWithAttributes);

  } catch (error) {
    console.error('Error al buscar producto por slug:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}
