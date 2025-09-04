'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiSettings, FiShoppingBag, FiHeart, FiMapPin, FiLogOut, FiChevronDown, FiZap, FiUserPlus } from 'react-icons/fi';
import { useAuth } from '@/components/providers/AuthProvider';
import { useCart } from '@/components/providers/CartProvider';
import { AvatarDisplay } from './AvatarUpload';

export function MiniProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const { user, profile, tokenBalance, signOut, loading } = useAuth();
  const { wishlist } = useCart();

  // Hover state management
  const handleMouseEnter = () => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setIsOpen(true);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsOpen(false);
      setIsHovered(false);
    }, 150); // Small delay to prevent flickering
    setHoverTimeout(timeout);
  };

  // Debug logs para MiniProfile
  console.log('🎭 MiniProfile Debug:', {
    component: 'MiniProfile',
    user: !!user,
    profile: !!profile,
    loading,
    userId: user?.id,
    userEmail: user?.email,
    profileId: profile?.id,
    profileName: profile?.display_name,
    tokenBalance,
    wishlistCount: wishlist.length,
    isOpen
  });

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  if (loading) {
    return (
      <div className="w-8 h-8 bg-gray-800 rounded-full animate-pulse"></div>
    );
  }

  // This component shows different content based on auth state
  if (!user) {
    // Not authenticated - show login prompt
    return (
      <div className="relative">
        <button
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-red-400 transition-colors rounded-lg hover:bg-gray-800/50 group"
        >
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center">
              <FiUser className="w-4 h-4 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-gray-900 animate-pulse"></div>
          </div>
          <div className="hidden md:block text-left">
            <div className="text-sm font-medium text-white">
              Inicia Sesión
            </div>
            <div className="text-xs text-gray-400">
              Acceder a tu cuenta
            </div>
          </div>
          <FiChevronDown className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full right-0 mt-2 w-80 bg-gray-900/95 backdrop-blur-md border border-gray-700/50 rounded-xl shadow-2xl z-50"
              >
                <div className="p-6">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiUser className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">¡Bienvenido!</h3>
                    <p className="text-gray-400 text-sm">
                      Inicia sesión para acceder a todas las funciones
                    </p>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                      <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                        <FiShoppingBag className="w-4 h-4 text-red-400" />
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium">Compra y Vende</div>
                        <div className="text-gray-400 text-xs">Accede al marketplace</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <FiHeart className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium">Lista de Deseos</div>
                        <div className="text-gray-400 text-xs">Guarda tus favoritos</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                      <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                        <FiZap className="w-4 h-4 text-yellow-400" />
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium">Sistema de Tokens</div>
                        <div className="text-gray-400 text-xs">Gana y gasta tokens</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-500 hover:to-red-600 transition-all duration-300 font-semibold"
                    >
                      <FiUser className="w-4 h-4 mr-2" />
                      Iniciar Sesión
                    </Link>

                    <Link
                      href="/registro"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center w-full px-4 py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-all duration-300"
                    >
                      <FiUserPlus className="w-4 h-4 mr-2" />
                      Crear Cuenta
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

  if (!profile) {
    // Authenticated but no profile - show setup prompt
    return (
      <div className="relative">
        <button
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-red-400 transition-colors rounded-lg hover:bg-gray-800/50 group border border-gray-700/50"
        >
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
              <FiUser className="w-4 h-4 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full border border-gray-900 animate-pulse"></div>
          </div>
          <div className="hidden md:block text-left">
            <div className="text-sm font-medium text-white">
              {user.email?.split('@')[0] || 'Usuario'}
            </div>
            <div className="text-xs text-yellow-400 flex items-center space-x-1">
              <FiZap className="w-3 h-3" />
              <span>{tokenBalance?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) || '0'} tokens</span>
            </div>
            <div className="text-xs text-orange-400">
              Completar perfil
            </div>
          </div>
          <FiChevronDown className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full right-0 mt-2 w-80 bg-gray-900/95 backdrop-blur-md border border-gray-700/50 rounded-xl shadow-2xl z-50"
              >
                <div className="p-6">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiUser className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">¡Completa tu perfil!</h3>
                    <p className="text-gray-400 text-sm">
                      Para acceder a todas las funciones necesitas completar tu información
                    </p>
                  </div>

                  <div className="space-y-3 mb-6">
                    <Link
                      href="/perfil"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-red-900/20 rounded-lg transition-all duration-300 group"
                    >
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                        <FiUser className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <div className="font-medium">Completar Perfil</div>
                        <div className="text-xs text-gray-400">Añade tu información personal</div>
                      </div>
                    </Link>
                  </div>

                  <div className="border-t border-gray-700 pt-4 mt-4">
                    <button
                      onClick={() => {
                        signOut();
                        setIsOpen(false);
                      }}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-all duration-300 group"
                    >
                      <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center group-hover:bg-red-500/30 transition-colors">
                        <FiLogOut className="w-4 h-4 text-red-400" />
                      </div>
                      <div>
                        <div className="font-medium">Cerrar Sesión</div>
                        <div className="text-xs text-gray-400">Salir de tu cuenta</div>
                      </div>
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Mini perfil para usuarios autenticados
  return (
    <div className="relative">
      <button
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 hover:border-red-500/30 transition-all duration-300 group"
      >
        <div className="relative">
          <AvatarDisplay
            src={profile.avatar_url ?? undefined}
            size="sm"
            fallback={`${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`}
          />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-gray-900"></div>
        </div>
        <div className="hidden xl:block text-left">
          <div className="text-sm font-medium text-white">
            {profile.display_name || `${profile.first_name} ${profile.last_name}`}
          </div>
          <div className="text-xs text-yellow-400 flex items-center space-x-1">
            <FiZap className="w-3 h-3" />
            <span>{tokenBalance.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} tokens</span>
          </div>
        </div>
        <FiChevronDown className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 mt-2 w-80 bg-gray-900/95 backdrop-blur-md border border-gray-700/50 rounded-xl shadow-2xl z-50"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="p-6">
                {/* Header with gradient */}
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-red-500/30">
                    <AvatarDisplay
                      src={profile.avatar_url ?? undefined}
                      size="md"
                      fallback={`${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`}
                    />
                  </div>
                  <div className="text-white font-semibold text-lg">
                    {profile.display_name || `${profile.first_name} ${profile.last_name}`}
                  </div>
                  <div className="text-gray-400 text-sm mb-2">{profile.email}</div>
                  <div className="flex items-center justify-center space-x-2 bg-yellow-500/10 rounded-lg px-3 py-1 border border-yellow-500/20">
                    <FiZap className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400 text-sm font-medium">
                      {tokenBalance.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} tokens
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-700 my-4"></div>

                {/* Menu Options */}
                <div className="space-y-1">
                  <Link
                    href="/perfil"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <FiUser className="w-4 h-4" />
                    <span>Mi Perfil</span>
                  </Link>

                  <Link
                    href="/configuraciones"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <FiSettings className="w-4 h-4" />
                    <span>Configuraciones</span>
                  </Link>

                  <Link
                    href="/perfil?tab=orders"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <FiShoppingBag className="w-4 h-4" />
                    <span>Mis Órdenes</span>
                  </Link>

                  <Link
                    href="/perfil?tab=wishlist"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <FiHeart className="w-4 h-4" />
                    <span>Lista de Deseos</span>
                    {wishlist.length > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {wishlist.length}
                      </span>
                    )}
                  </Link>

                  <Link
                    href="/perfil?tab=addresses"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <FiMapPin className="w-4 h-4" />
                    <span>Mis Direcciones</span>
                  </Link>
                </div>

                {/* Logout */}
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <FiLogOut className="w-4 h-4" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
