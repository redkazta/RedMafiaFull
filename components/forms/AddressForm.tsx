import React, { useState, useEffect } from 'react';
import { useZipCode } from '../../hooks/useZipCode';

interface AddressFormData {
  codigo_postal: string;
  colonia: string;
  ciudad: string;
  estado: string;
  calle: string;
  numero_exterior: string;
  numero_interior?: string;
  referencias?: string;
}

interface AddressFormProps {
  onSubmit: (data: AddressFormData) => void;
  initialData?: Partial<AddressFormData>;
  loading?: boolean;
}

export const AddressForm: React.FC<AddressFormProps> = ({
  onSubmit,
  initialData = {},
  loading = false
}) => {
  const { loading: zipLoading, error: zipError, results, searchZipCode, clearResults } = useZipCode();
  
  const [formData, setFormData] = useState<AddressFormData>({
    codigo_postal: '',
    colonia: '',
    ciudad: '',
    estado: '',
    calle: '',
    numero_exterior: '',
    numero_interior: '',
    referencias: '',
    ...initialData
  });

  const [showColoniaOptions, setShowColoniaOptions] = useState(false);
  const [selectedColonia, setSelectedColonia] = useState<ZipCodeResult | null>(null);

  // Buscar código postal cuando cambie
  useEffect(() => {
    if (formData.codigo_postal.length === 5) {
      searchZipCode(formData.codigo_postal);
    } else {
      clearResults();
      setShowColoniaOptions(false);
      setSelectedColonia(null);
    }
  }, [formData.codigo_postal, searchZipCode, clearResults]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Si es código postal, limpiar datos de ubicación
    if (name === 'codigo_postal') {
      setFormData(prev => ({
        ...prev,
        colonia: '',
        ciudad: '',
        estado: ''
      }));
      setSelectedColonia(null);
    }
  };

  const handleColoniaSelect = (colonia: ZipCodeResult) => {
    setSelectedColonia(colonia);
    setFormData(prev => ({
      ...prev,
      colonia: colonia.asentamiento,
      ciudad: colonia.ciudad || colonia.municipio,
      estado: colonia.estado
    }));
    setShowColoniaOptions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedColonia) {
      onSubmit(formData);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Dirección de Envío</h2>
        <p className="text-sm text-gray-600">
          🇲🇽 Solo se permiten direcciones en México
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Código Postal */}
        <div>
          <label htmlFor="codigo_postal" className="block text-sm font-medium text-gray-700 mb-1">
            Código Postal *
          </label>
          <input
            type="text"
            id="codigo_postal"
            name="codigo_postal"
            value={formData.codigo_postal}
            onChange={handleInputChange}
            placeholder="12345"
            maxLength={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {zipLoading && (
            <p className="text-sm text-blue-600 mt-1">🔍 Buscando ubicación...</p>
          )}
          {zipError && (
            <p className="text-sm text-red-600 mt-1">❌ {zipError}</p>
          )}
        </div>

        {/* Colonia */}
        <div className="relative">
          <label htmlFor="colonia" className="block text-sm font-medium text-gray-700 mb-1">
            Colonia/Asentamiento *
          </label>
          <input
            type="text"
            id="colonia"
            name="colonia"
            value={formData.colonia}
            onChange={handleInputChange}
            onFocus={() => setShowColoniaOptions(results.length > 0)}
            placeholder="Selecciona una colonia"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            readOnly={!selectedColonia}
          />
          
          {showColoniaOptions && results.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {results.map((colonia, index) => (
                <div
                  key={index}
                  onClick={() => handleColoniaSelect(colonia)}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div className="font-medium text-gray-900">{colonia.asentamiento}</div>
                  <div className="text-sm text-gray-600">
                    {colonia.tipo_asentamiento} • {colonia.ciudad || colonia.municipio}, {colonia.estado}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ciudad y Estado (solo lectura) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700 mb-1">
              Ciudad *
            </label>
            <input
              type="text"
              id="ciudad"
              name="ciudad"
              value={formData.ciudad}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              readOnly
            />
          </div>
          <div>
            <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
              Estado *
            </label>
            <input
              type="text"
              id="estado"
              name="estado"
              value={formData.estado}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              readOnly
            />
          </div>
        </div>

        {/* Calle */}
        <div>
          <label htmlFor="calle" className="block text-sm font-medium text-gray-700 mb-1">
            Calle *
          </label>
          <input
            type="text"
            id="calle"
            name="calle"
            value={formData.calle}
            onChange={handleInputChange}
            placeholder="Nombre de la calle"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Número Exterior e Interior */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="numero_exterior" className="block text-sm font-medium text-gray-700 mb-1">
              Número Exterior *
            </label>
            <input
              type="text"
              id="numero_exterior"
              name="numero_exterior"
              value={formData.numero_exterior}
              onChange={handleInputChange}
              placeholder="123"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="numero_interior" className="block text-sm font-medium text-gray-700 mb-1">
              Número Interior
            </label>
            <input
              type="text"
              id="numero_interior"
              name="numero_interior"
              value={formData.numero_interior}
              onChange={handleInputChange}
              placeholder="A, B, 1, 2..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Referencias */}
        <div>
          <label htmlFor="referencias" className="block text-sm font-medium text-gray-700 mb-1">
            Referencias
          </label>
          <textarea
            id="referencias"
            name="referencias"
            value={formData.referencias}
            onChange={handleInputChange}
            placeholder="Cerca de... (opcional)"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Botón de envío */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading || !selectedColonia || zipLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Guardando...' : 'Guardar Dirección'}
          </button>
        </div>
      </form>
    </div>
  );
};

// Importar el tipo ZipCodeResult
interface ZipCodeResult {
  codigo_postal: string;
  asentamiento: string;
  tipo_asentamiento: string;
  municipio: string;
  estado: string;
  ciudad: string;
}
