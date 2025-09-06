import { NextApiRequest, NextApiResponse } from 'next';

interface ZipCodeData {
  codigo_postal: string;
  asentamiento: string;
  tipo_asentamiento: string;
  municipio: string;
  estado: string;
  ciudad: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { cp } = req.query;

  if (!cp || typeof cp !== 'string') {
    return res.status(400).json({ error: 'Código postal requerido' });
  }

  // Validar que sea un código postal mexicano válido (5 dígitos)
  if (!/^\d{5}$/.test(cp)) {
    return res.status(400).json({ error: 'Código postal debe tener 5 dígitos' });
  }

  try {
    // Usar la API de Sepomex (Servicio Postal Mexicano)
    const response = await fetch(`https://api.copomex.com/query/info_cp/${cp}?token=pruebas`);
    
    if (!response.ok) {
      // Si la API principal falla, usar una alternativa
      const altResponse = await fetch(`https://api-sepomex.hckdrk.mx/query/info_cp/${cp}`);
      
      if (!altResponse.ok) {
        return res.status(404).json({ error: 'Código postal no encontrado' });
      }
      
      const altData = await altResponse.json();
      return res.status(200).json(altData);
    }

    const data = await response.json();
    
    if (!data || data.error) {
      return res.status(404).json({ error: 'Código postal no encontrado' });
    }

    // Procesar los datos para unificar el formato
    const processedData = Array.isArray(data) ? data : [data];
    
    const results: ZipCodeData[] = processedData.map((item: any) => ({
      codigo_postal: item.codigo_postal || cp,
      asentamiento: item.asentamiento || item.colonia || '',
      tipo_asentamiento: item.tipo_asentamiento || item.tipo || '',
      municipio: item.municipio || item.ciudad || '',
      estado: item.estado || '',
      ciudad: item.ciudad || item.municipio || ''
    }));

    res.status(200).json({
      codigo_postal: cp,
      resultados: results,
      total: results.length
    });

  } catch (error) {
    console.error('Error al buscar código postal:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}
