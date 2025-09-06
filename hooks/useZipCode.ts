import { useState, useCallback } from 'react';

interface ZipCodeResult {
  codigo_postal: string;
  asentamiento: string;
  tipo_asentamiento: string;
  municipio: string;
  estado: string;
  ciudad: string;
}

interface ZipCodeResponse {
  codigo_postal: string;
  resultados: ZipCodeResult[];
  total: number;
}

export const useZipCode = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<ZipCodeResult[]>([]);

  const searchZipCode = useCallback(async (cp: string): Promise<ZipCodeResult[]> => {
    if (!cp || !/^\d{5}$/.test(cp)) {
      setError('Código postal debe tener 5 dígitos');
      return [];
    }

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const response = await fetch(`/api/zipcode/${cp}`);
      const data: ZipCodeResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al buscar código postal');
      }

      setResults(data.resultados);
      return data.resultados;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error en búsqueda de código postal:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    loading,
    error,
    results,
    searchZipCode,
    clearResults
  };
};
