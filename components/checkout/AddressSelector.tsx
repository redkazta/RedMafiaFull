import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface Address {
  id: number;
  user_id: string | null;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  is_default: boolean | null;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  codigo_postal: string;
  numero_exterior: string;
  numero_interior?: string | null;
  referencias?: string | null;
}

interface AddressSelectorProps {
  onAddressSelect: (address: Address) => void;
  selectedAddressId?: number;
}

export const AddressSelector: React.FC<AddressSelectorProps> = ({
  onAddressSelect,
  selectedAddressId
}) => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchAddresses = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAddresses((data || []) as unknown as Address[]);
    } catch (error) {
      console.error('Error al cargar direcciones:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user, fetchAddresses]);

  const handleAddressSelect = (address: Address) => {
    onAddressSelect(address);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (addresses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <div className="text-gray-400 text-4xl mb-4">📍</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No tienes direcciones</h3>
        <p className="text-gray-600 mb-4">Agrega una dirección para continuar</p>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Agregar Dirección
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Selecciona una dirección de envío
      </h3>
      
      <div className="space-y-3">
        {addresses.map((address) => (
          <div
            key={address.id}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
              selectedAddressId === address.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleAddressSelect(address)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {address.is_default && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full mb-2">
                    🏠 Principal
                  </span>
                )}
                
                <div className="space-y-1">
                  <p className="font-medium text-gray-900">
                    {address.street} {address.numero_exterior}
                    {address.numero_interior && ` Int. ${address.numero_interior}`}
                  </p>
                  <p className="text-gray-600">
                    {address.city}, {address.state} - CP: {address.codigo_postal}
                  </p>
                  {address.referencias && (
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Ref:</span> {address.referencias}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="ml-4">
                <input
                  type="radio"
                  name="address"
                  checked={selectedAddressId === address.id}
                  onChange={() => handleAddressSelect(address)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={() => setShowAddForm(true)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          + Agregar nueva dirección
        </button>
      </div>
    </div>
  );
};
