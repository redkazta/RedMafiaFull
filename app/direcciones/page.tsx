'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FiArrowLeft, FiMapPin, FiPlus, FiEdit, FiTrash2, FiCheck, FiHome, FiBriefcase } from 'react-icons/fi';
import { useAuth } from '@/components/providers/AuthProvider';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

interface UserLocation {
  id: string;
  user_id: string;
  address_type: string;
  street_address: string;
  apartment?: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  is_active: boolean;
  recipient_name?: string | null;
  phone?: string | null;
  company?: string | null;
  instructions?: string | null;
  created_at: string;
  updated_at: string;
}

interface LocationFormData {
  address_type: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  recipient_name: string;
  phone: string;
  company: string;
  instructions: string;
  is_default: boolean;
}

export default function AddressesPage() {
  const { user, profile, loading } = useAuth();
  const [locations, setLocations] = useState<UserLocation[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingLocation, setEditingLocation] = useState<UserLocation | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<LocationFormData>({
    address_type: 'shipping',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'México',
    recipient_name: '',
    phone: '',
    company: '',
    instructions: '',
    is_default: false
  });

  const loadLocations = useCallback(async () => {
    if (!user) return;

    setLoadingLocations(true);
    try {
      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (!error && data) {
        setLocations(data);
      }
    } catch (error) {
      console.error('Error loading locations:', error);
    } finally {
      setLoadingLocations(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadLocations();
    }
  }, [user, loadLocations]);

  const handleInputChange = (field: keyof LocationFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      address_type: 'shipping',
      address_line_1: '',
      address_line_2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'México',
      recipient_name: '',
      phone: '',
      company: '',
      instructions: '',
      is_default: false
    });
    setEditingLocation(null);
    setShowForm(false);
  };

  const getAddressTypeIcon = (addressType: string) => {
    switch (addressType) {
      case 'billing':
        return <FiBriefcase className="w-5 h-5 text-primary-400" />;
      case 'shipping':
      case 'both':
      default:
        return <FiHome className="w-5 h-5 text-primary-400" />;
    }
  };

  const getAddressTypeText = (addressType: string) => {
    switch (addressType) {
      case 'billing':
        return 'Facturación';
      case 'shipping':
        return 'Envío';
      case 'both':
        return 'Facturación y Envío';
      default:
        return addressType;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      if (editingLocation) {
        // Update existing location
        const { error } = await supabase
          .from('user_addresses')
          .update({
            address_type: formData.address_type,
            address_line_1: formData.address_line_1,
            address_line_2: formData.address_line_2 || undefined,
            city: formData.city,
            state: formData.state,
            postal_code: formData.postal_code,
            country: formData.country,
            recipient_name: formData.recipient_name || undefined,
            phone: formData.phone || undefined,
            company: formData.company || undefined,
            instructions: formData.instructions || undefined,
            is_default: formData.is_default,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingLocation.id);

        if (error) throw error;
        toast.success('Ubicación actualizada correctamente');
      } else {
        // Create new location
        const insertData: any = {
          address_type: formData.address_type,
          address_line_1: formData.address_line_1,
          city: formData.city,
          state: formData.state,
          postal_code: formData.postal_code,
          country: formData.country,
          is_default: formData.is_default
        };

        // Add optional fields only if they have values
        if (formData.address_line_2) insertData.address_line_2 = formData.address_line_2;
        if (formData.recipient_name) insertData.recipient_name = formData.recipient_name;
        if (formData.phone) insertData.phone = formData.phone;
        if (formData.company) insertData.company = formData.company;
        if (formData.instructions) insertData.instructions = formData.instructions;

        const { error } = await supabase
          .from('user_addresses')
          .insert(insertData);

        if (error) throw error;
        toast.success('Ubicación agregada correctamente');
      }

      await loadLocations();
      resetForm();
    } catch (error) {
      console.error('Error saving location:', error);
      toast.error('Error al guardar la ubicación');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (location: UserLocation) => {
    setFormData({
      address_type: location.address_type,
      address_line_1: location.street_address,
      address_line_2: location.apartment || '',
      city: location.city,
      state: location.state,
      postal_code: location.postal_code,
      country: location.country,
      recipient_name: location.recipient_name || '',
      phone: location.phone || '',
      company: location.company || '',
      instructions: location.instructions || '',
      is_default: location.is_default
    });
    setEditingLocation(location);
    setShowForm(true);
  };

  const handleDelete = async (locationId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta ubicación?')) return;

    try {
      const { error } = await supabase
        .from('user_addresses')
        .update({ is_active: false })
        .eq('id', locationId);

      if (error) throw error;

      toast.success('Ubicación eliminada correctamente');
      await loadLocations();
    } catch (error) {
      console.error('Error deleting location:', error);
      toast.error('Error al eliminar la ubicación');
    }
  };

  const handleSetDefault = async (locationId: string) => {
    if (!user) return;

    try {
      // Remove default from all locations
      await supabase
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', user.id);

      // Set new default
      const { error } = await supabase
        .from('user_addresses')
        .update({ is_default: true })
        .eq('id', locationId);

      if (error) throw error;

      toast.success('Ubicación por defecto actualizada');
      await loadLocations();
    } catch (error) {
      console.error('Error setting default location:', error);
      toast.error('Error al establecer ubicación por defecto');
    }
  };

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

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiMapPin className="w-12 h-12 text-gray-600" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Acceso requerido</h2>
            <p className="text-gray-400 mb-8">
              Debes iniciar sesión para gestionar tus ubicaciones
            </p>
            <Link
              href="/login"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:from-primary-600 hover:to-accent-600 transition-all duration-300 font-semibold"
            >
              <FiMapPin className="w-5 h-5" />
              <span>Iniciar Sesión</span>
            </Link>
          </div>
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
              href="/perfil"
              className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
              <span>Volver al perfil</span>
            </Link>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">
                Mis Direcciones
              </h1>
              <p className="text-gray-300 text-lg">
                Gestiona tus direcciones de envío y facturación
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:from-primary-600 hover:to-accent-600 transition-all duration-300 font-semibold"
            >
              <FiPlus className="w-5 h-5" />
              <span>Agregar Dirección</span>
            </button>
          </div>

          <div className="max-w-6xl mx-auto">
            {loadingLocations ? (
              <div className="text-center py-20">
                <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-400">Cargando direcciones...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Addresses List */}
                <div className="space-y-6">
                  {locations.length === 0 ? (
                    <div className="text-center py-20">
                      <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiMapPin className="w-12 h-12 text-gray-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-white mb-4">No tienes direcciones</h2>
                      <p className="text-gray-400 mb-8">
                        Agrega tu primera dirección para facilitar tus compras
                      </p>
                      <button
                        onClick={() => setShowForm(true)}
                        className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:from-primary-600 hover:to-accent-600 transition-all duration-300 font-semibold"
                      >
                        <FiPlus className="w-5 h-5" />
                        <span>Agregar Dirección</span>
                      </button>
                    </div>
                  ) : (
                    locations.map((address) => (
                      <div
                        key={address.id}
                        className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-primary-500/50 transition-colors"
                      >
                        {/* Address Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            {getAddressTypeIcon(address.address_type)}
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="text-white font-medium">
                                  {getAddressTypeText(address.address_type)}
                                </span>
                                {address.is_default && (
                                  <span className="inline-flex items-center space-x-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                                    <FiCheck className="w-3 h-3" />
                                    <span>Por defecto</span>
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-400 text-sm">
                                {address.recipient_name}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEdit(address)}
                              className="p-2 text-gray-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-colors"
                              title="Editar dirección"
                            >
                              <FiEdit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(address.id)}
                              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                              title="Eliminar dirección"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Address Details */}
                        <div className="space-y-2 text-gray-300">
                          <p>{address.street_address}</p>
                          {address.apartment && <p>{address.apartment}</p>}
                          <p>{address.city}, {address.state} {address.postal_code}</p>
                          <p>{address.country}</p>
                          {address.recipient_name && (
                            <p className="text-primary-400">Destinatario: {address.recipient_name}</p>
                          )}
                          {address.company && (
                            <p className="text-gray-400">Empresa: {address.company}</p>
                          )}
                          {address.phone && (
                            <p className="text-primary-400">Tel: {address.phone}</p>
                          )}
                          {address.instructions && (
                            <div className="mt-3 p-3 bg-gray-700/30 rounded-lg">
                              <p className="text-sm text-gray-400">
                                <strong>Instrucciones:</strong> {address.instructions}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        {!address.is_default && (
                          <div className="mt-4 pt-4 border-t border-gray-700">
                            <button
                              onClick={() => handleSetDefault(address.id)}
                              className="text-primary-400 hover:text-primary-300 text-sm font-medium"
                            >
                              Establecer como dirección por defecto
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Add/Edit Form */}
                {(showForm || editingLocation) && (
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">
                        {editingLocation ? 'Editar Dirección' : 'Nueva Dirección'}
                      </h3>
                      <button
                        onClick={resetForm}
                        className="p-2 text-gray-400 hover:text-white rounded-lg"
                      >
                        <FiArrowLeft className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Address Type */}
                      <div>
                        <label className="text-white font-medium mb-3 block">Tipo de dirección</label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { value: 'shipping', label: 'Envío', icon: FiHome },
                            { value: 'billing', label: 'Facturación', icon: FiBriefcase },
                            { value: 'both', label: 'Ambos', icon: FiMapPin }
                          ].map((type) => (
                            <button
                              key={type.value}
                              type="button"
                              onClick={() => handleInputChange('address_type', type.value)}
                              className={`flex items-center justify-center space-x-2 p-3 rounded-lg border transition-colors ${
                                formData.address_type === type.value
                                  ? 'bg-primary-500/20 border-primary-500 text-primary-400'
                                  : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-600/50'
                              }`}
                            >
                              <type.icon className="w-4 h-4" />
                              <span className="text-sm font-medium">{type.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Personal Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-white font-medium mb-2 block">
                            Nombre del destinatario *
                          </label>
                          <input
                            type="text"
                            value={formData.recipient_name}
                            onChange={(e) => handleInputChange('recipient_name', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-white font-medium mb-2 block">Teléfono</label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      {/* Company */}
                      <div>
                        <label className="text-white font-medium mb-2 block">Empresa (opcional)</label>
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => handleInputChange('company', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      {/* Address Line 1 */}
                      <div>
                        <label className="text-white font-medium mb-2 block">
                          Dirección línea 1 *
                        </label>
                        <input
                          type="text"
                          value={formData.address_line_1}
                          onChange={(e) => handleInputChange('address_line_1', e.target.value)}
                          placeholder="Calle, número, colonia"
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        />
                      </div>

                      {/* Address Line 2 */}
                      <div>
                        <label className="text-white font-medium mb-2 block">
                          Dirección línea 2 (opcional)
                        </label>
                        <input
                          type="text"
                          value={formData.address_line_2}
                          onChange={(e) => handleInputChange('address_line_2', e.target.value)}
                          placeholder="Apartamento, suite, piso, etc."
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      {/* Location */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-white font-medium mb-2 block">Ciudad *</label>
                          <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-white font-medium mb-2 block">Estado *</label>
                          <input
                            type="text"
                            value={formData.state}
                            onChange={(e) => handleInputChange('state', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-white font-medium mb-2 block">Código Postal *</label>
                          <input
                            type="text"
                            value={formData.postal_code}
                            onChange={(e) => handleInputChange('postal_code', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            required
                          />
                        </div>
                      </div>

                      {/* Country */}
                      <div>
                        <label className="text-white font-medium mb-2 block">País *</label>
                        <select
                          value={formData.country}
                          onChange={(e) => handleInputChange('country', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        >
                          <option value="México">México</option>
                          <option value="Estados Unidos">Estados Unidos</option>
                          <option value="Canadá">Canadá</option>
                        </select>
                      </div>

                      {/* Instructions */}
                      <div>
                        <label className="text-white font-medium mb-2 block">
                          Instrucciones especiales (opcional)
                        </label>
                        <textarea
                          value={formData.instructions}
                          onChange={(e) => handleInputChange('instructions', e.target.value)}
                          placeholder="Ej: Tocar el timbre, dejar en portería, etc."
                          rows={3}
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                        />
                      </div>

                      {/* Set as Default */}
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="is_default"
                          checked={formData.is_default}
                          onChange={(e) => handleInputChange('is_default', e.target.checked)}
                          className="w-4 h-4 text-primary-500 bg-gray-700 border-gray-600 rounded focus:ring-primary-500"
                        />
                        <label htmlFor="is_default" className="text-white font-medium">
                          Establecer como dirección por defecto
                        </label>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-700">
                        <button
                          type="button"
                          onClick={resetForm}
                          className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          disabled={saving}
                          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:from-primary-600 hover:to-accent-600 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {saving ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>Guardando...</span>
                            </>
                          ) : (
                            <>
                              <FiCheck className="w-4 h-4" />
                              <span>{editingLocation ? 'Actualizar' : 'Guardar'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
