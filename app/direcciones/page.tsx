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
  id: number;
  user_id: string | null;
  city: string;
  country: string | null;
  postal_code: string;
  state: string;
  street: string;
  is_default: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

interface LocationFormData {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
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
    street: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'México',
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
      street: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'México',
      is_default: false
    });
    setEditingLocation(null);
    setShowForm(false);
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
            street: formData.street,
            city: formData.city,
            state: formData.state,
            postal_code: formData.postal_code,
            country: formData.country,
            is_default: formData.is_default,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingLocation.id);

        if (error) throw error;
        toast.success('Ubicación actualizada correctamente');
      } else {
        // Create new location
        const { error } = await supabase
          .from('user_addresses')
          .insert({
            user_id: user!.id,
            street: formData.street,
          city: formData.city,
          state: formData.state,
          postal_code: formData.postal_code,
          country: formData.country,
          is_default: formData.is_default
          });

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
      street: location.street,
      city: location.city,
      state: location.state,
      postal_code: location.postal_code,
      country: location.country || 'México',
      is_default: location.is_default || false
    });
    setEditingLocation(location);
    setShowForm(true);
  };

  const handleDelete = async (locationId: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta ubicación?')) return;

    try {
      const { error } = await supabase
        .from('user_addresses')
        .delete()
        .eq('id', locationId);

      if (error) throw error;

      toast.success('Ubicación eliminada correctamente');
      await loadLocations();
    } catch (error) {
      console.error('Error deleting location:', error);
      toast.error('Error al eliminar la ubicación');
    }
  };

  const handleSetDefault = async (locationId: number) => {
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
                            <FiMapPin className="w-5 h-5 text-primary-400" />
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="text-white font-medium">
                                  Dirección
                                </span>
                                {address.is_default && (
                                  <span className="inline-flex items-center space-x-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                                    <FiCheck className="w-3 h-3" />
                                    <span>Por defecto</span>
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-400 text-sm">
                                Usuario
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
                          <p>{address.street}</p>
                          <p>{address.city}, {address.state} {address.postal_code}</p>
                          <p>{address.country}</p>
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
                      {/* Street Address */}
                        <div>
                          <label className="text-white font-medium mb-2 block">
                          Dirección completa *
                          </label>
                          <input
                            type="text"
                          value={formData.street}
                          onChange={(e) => handleInputChange('street', e.target.value)}
                          placeholder="Calle, número, colonia, ciudad"
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        />
                      </div>

                      {/* City and State */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-white font-medium mb-2 block">
                            Ciudad *
                        </label>
                          <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-white font-medium mb-2 block">
                            Estado *
                          </label>
                          <input
                            type="text"
                            value={formData.state}
                            onChange={(e) => handleInputChange('state', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            required
                          />
                        </div>
                      </div>

                      {/* Postal Code and Country */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-white font-medium mb-2 block">
                            Código Postal *
                          </label>
                          <input
                            type="text"
                            value={formData.postal_code}
                            onChange={(e) => handleInputChange('postal_code', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            required
                          />
                        </div>
                      <div>
                          <label className="text-white font-medium mb-2 block">
                            País *
                          </label>
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
