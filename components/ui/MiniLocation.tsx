'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin, FiLogIn } from 'react-icons/fi';
import { useAuth } from '@/components/providers/AuthProvider';
import { supabase } from '@/lib/supabase';

interface UserLocation {
  id: string;
  user_id: string | null;
  address_type: string;
  is_default: boolean | null;
  recipient_name: string;
  company?: string | null;
  phone?: string | null;
  address_line_1: string;
  address_line_2?: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string | null;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export function MiniLocation({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) {
  const [locations, setLocations] = useState<UserLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, profile } = useAuth();

  const loadLocations = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await (supabase
        .from('user_addresses') as any)
        .select('id, user_id, address_type, is_default, recipient_name, company, phone, address_line_1, address_line_2, city, state, postal_code, country, is_active, created_at, updated_at')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(3);

      if (!error && data) {
        setLocations(data);
      }
    } catch (error) {
      console.error('Error loading locations:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user && isOpen) {
      loadLocations();
    }
  }, [user, isOpen, loadLocations]);

  if (!user || !profile) {
    // Panel de ubicación para usuarios no autenticados
    return (
      <div className="relative">
        <button
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-600/20 to-red-700/20 hover:from-red-600/30 hover:to-red-700/30 border border-red-600/30 rounded-lg transition-all duration-300 group"
        >
          <div className="relative">
            <FiMapPin className="w-5 h-5 text-red-400 group-hover:text-red-300 transition-colors" />
          </div>
          <span className="text-sm font-medium text-white hidden sm:block">
            {user ? 'Ver mis ubicaciones' : 'Elige tu ubicación'}
          </span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 mt-2 w-64 bg-gray-900/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-700/50 z-50"
              >
                <div className="p-6">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl flex items-center justify-center mb-3 mx-auto">
                      <FiMapPin className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      Ubicación
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      {user ? 'Gestiona tus direcciones de entrega' : 'Inicia sesión para guardar tus direcciones'}
                    </p>
                  </div>

                  {!user ? (
                    <div className="space-y-3">
                      <Link
                        href="/login"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-500 hover:to-red-600 transition-all duration-300 font-semibold"
                      >
                        <FiLogIn className="w-4 h-4" />
                        <span>Iniciar Sesión</span>
                      </Link>
                      <Link
                        href="/registro"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 transition-colors border border-gray-600"
                      >
                        <span>Crear Cuenta</span>
                      </Link>
                    </div>
                  ) : (
                    <Link
                      href="/direcciones"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                    >
                      <FiMapPin className="w-4 h-4" />
                      <span>Ver mis ubicaciones</span>
                    </Link>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Panel de ubicación para usuarios autenticados
  return (
    <div className="relative">
      <button
        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-600/20 to-red-700/20 hover:from-red-600/30 hover:to-red-700/30 border border-red-600/30 rounded-lg transition-all duration-300 group"
      >
        <div className="relative">
          <FiMapPin className="w-5 h-5 text-red-400 group-hover:text-red-300 transition-colors" />
        </div>
        <span className="text-sm font-medium text-white hidden sm:block">
          Ver mis ubicaciones
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 mt-2 w-80 bg-gray-900/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-700/50 z-50"
            >
              <div className="p-6">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl flex items-center justify-center mb-3 mx-auto">
                    <FiMapPin className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Mis Ubicaciones
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Gestiona tus direcciones de entrega
                  </p>
                </div>

                {/* Locations List */}
                <div className="space-y-3 mb-4">
                  {loading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full mx-auto"></div>
                      <p className="text-gray-400 text-sm mt-2">Cargando ubicaciones...</p>
                    </div>
                  ) : locations.length > 0 ? (
                    locations.map((location) => (
                      <div key={location.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                        <div className="flex items-center space-x-2">
                          <FiMapPin className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="text-white text-sm font-medium">{location.address_line_1}</div>
                            <div className="text-gray-400 text-xs">{location.city}, {location.state}</div>
                          </div>
                        </div>
                        {location.is_default && (
                          <span className="text-xs bg-red-600/20 text-red-400 px-2 py-1 rounded-full">
                            Principal
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <FiMapPin className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">No tienes ubicaciones guardadas</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <Link
                    href="/direcciones"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                  >
                    <FiMapPin className="w-4 h-4" />
                    <span>Gestionar Ubicaciones</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
