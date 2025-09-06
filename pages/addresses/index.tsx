import React, { useState, useEffect, useCallback } from 'react';
import { AddressForm } from '../../components/forms/AddressForm';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface Address {
  id: number;
  user_id: string;
  codigo_postal: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  numero_exterior: string;
  numero_interior?: string;
  referencias?: string;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function AddressesPage() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user, fetchAddresses]);

  const fetchAddresses = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_active', true)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAddresses(data || []);
    } catch (error) {
      console.error('Error al cargar direcciones:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const handleSubmit = async (formData: any) => {
    try {
      setLoading(true);
      
      const addressData = {
        user_id: user?.id,
        codigo_postal: formData.codigo_postal,
        street: formData.calle,
        city: formData.ciudad,
        state: formData.estado,
        postal_code: formData.codigo_postal,
        numero_exterior: formData.numero_exterior,
        numero_interior: formData.numero_interior || null,
        referencias: formData.referencias || null,
        is_default: addresses.length === 0, // Primera dirección es por defecto
        is_active: true
      };

      if (editingAddress) {
        // Actualizar dirección existente
        const { error } = await supabase
          .from('user_addresses')
          .update(addressData)
          .eq('id', editingAddress.id);

        if (error) throw error;
      } else {
        // Crear nueva dirección
        const { error } = await supabase
          .from('user_addresses')
          .insert([addressData]);

        if (error) throw error;
      }

      await fetchAddresses();
      setShowForm(false);
      setEditingAddress(null);
    } catch (error) {
      console.error('Error al guardar dirección:', error);
      alert('Error al guardar la dirección');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta dirección?')) return;

    try {
      const { error } = await supabase
        .from('user_addresses')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
      await fetchAddresses();
    } catch (error) {
      console.error('Error al eliminar dirección:', error);
      alert('Error al eliminar la dirección');
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      // Quitar default de todas las direcciones
      await supabase
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', user?.id);

      // Establecer como default la seleccionada
      const { error } = await supabase
        .from('user_addresses')
        .update({ is_default: true })
        .eq('id', id);

      if (error) throw error;
      await fetchAddresses();
    } catch (error) {
      console.error('Error al establecer dirección por defecto:', error);
      alert('Error al establecer dirección por defecto');
    }
  };

  if (loading && addresses.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando direcciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mis Direcciones</h1>
          <p className="text-gray-600 mt-2">Gestiona tus direcciones de envío en México</p>
        </div>

        {!showForm ? (
          <div className="space-y-6">
            {/* Botón para agregar nueva dirección */}
            <div className="flex justify-end">
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                + Agregar Nueva Dirección
              </button>
            </div>

            {/* Lista de direcciones */}
            {addresses.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <div className="text-gray-400 text-6xl mb-4">📍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No tienes direcciones</h3>
                <p className="text-gray-600 mb-6">Agrega tu primera dirección para comenzar</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                >
                  Agregar Primera Dirección
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className={`bg-white rounded-lg shadow-md p-6 border-2 ${
                      address.is_default ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    {address.is_default && (
                      <div className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full inline-block mb-3">
                        🏠 Dirección Principal
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <p className="font-semibold text-gray-900">
                        {address.street} {address.numero_exterior}
                        {address.numero_interior && ` Int. ${address.numero_interior}`}
                      </p>
                      <p className="text-gray-600">
                        {address.street}, {address.city}, {address.state}
                      </p>
                      <p className="text-gray-500">
                        CP: {address.codigo_postal}
                      </p>
                      {address.referencias && (
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Ref:</span> {address.referencias}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 flex space-x-2">
                      {!address.is_default && (
                        <button
                          onClick={() => handleSetDefault(address.id)}
                          className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200"
                        >
                          Establecer Principal
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(address)}
                        className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(address.id)}
                        className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingAddress(null);
                }}
                className="text-blue-600 hover:text-blue-800 flex items-center"
              >
                ← Volver a direcciones
              </button>
            </div>
            
            <AddressForm
              onSubmit={handleSubmit}
              initialData={editingAddress ? {
                codigo_postal: editingAddress.codigo_postal,
                calle: editingAddress.street,
                ciudad: editingAddress.city,
                estado: editingAddress.state,
                numero_exterior: editingAddress.numero_exterior,
                numero_interior: editingAddress.numero_interior || '',
                referencias: editingAddress.referencias || ''
              } : {}}
              loading={loading}
            />
          </div>
        )}
      </div>
    </div>
  );
}
