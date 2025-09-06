'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiHome,
  FiMusic,
  FiUsers,
  FiCalendar,
  FiShoppingBag,
  FiUser,
  FiMenu,
  FiX,
  FiLogIn,
  FiUserPlus,
  FiLogOut,
  FiZap,
  FiPlus,
  FiEdit,
  FiHeart,
  FiTrash2,
  FiMapPin,
  FiChevronDown
} from 'react-icons/fi';
import { useAuth } from '@/components/providers/AuthProvider';

// Importar el tipo Profile del AuthProvider
interface Profile {
  id: string;
  email: string;
  username?: string | null;
  first_name?: string;
  last_name?: string;
  display_name?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  is_verified?: boolean;
  is_active?: boolean;
  date_of_birth?: string | null;
  location?: string | null;
  phone?: string | null;
  website?: string | null;
  preferences?: any;
  social_links?: any;
  last_login_at?: string | null;
  created_at?: string;
  updated_at?: string;
}
import { MiniCart } from '@/components/ui/MiniCart';
import { MiniWishlist } from '@/components/ui/MiniWishlist';
import { MiniProfile } from '@/components/ui/MiniProfile';
import { MiniLocation } from '@/components/ui/MiniLocation';
import Image from 'next/image';

// Componente auxiliar para mostrar avatar del usuario
function UserAvatar({ avatarUrl, size = "small", className = "" }: {
  avatarUrl?: string | null;
  size?: "small" | "medium" | "large";
  className?: string;
}) {
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-16 h-16",
    large: "w-20 h-20"
  };

  const iconSizes = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-10 h-10"
  };

  if (avatarUrl) {
    return (
      <div className={`relative ${sizeClasses[size]} ${className}`}>
        <Image
          src={avatarUrl}
          alt="Avatar del usuario"
          fill
          className="rounded-full object-cover border-2 border-gray-600"
          onError={(e) => {
            // Si la imagen falla, mostrar el fallback
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              const fallback = parent.querySelector('.avatar-fallback') as HTMLElement;
              if (fallback) fallback.style.display = 'flex';
            }
          }}
        />
        <div className="avatar-fallback absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center border-2 border-blue-400/30 hidden">
          <FiUser className={`${iconSizes[size]} text-white`} />
        </div>
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center border-2 border-blue-400/30 ${className}`}>
      <FiUser className={`${iconSizes[size]} text-white`} />
    </div>
  );
}

const navigation = [
  { name: 'Inicio', href: '/', icon: FiHome },
  { name: 'Artistas', href: '/artistas', icon: FiUsers },
  { name: 'Música', href: '/musica', icon: FiMusic },
  { name: 'Eventos', href: '/eventos', icon: FiCalendar },
  { name: 'Tienda', href: '/tienda', icon: FiShoppingBag },
];

// User Panel Component - Always visible
function UserPanel({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) {
  const { user, session, profile, tokenBalance, loading, signOut } = useAuth();
  const [forceRender, setForceRender] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  // Debug: Mostrar estado actual con más detalle (solo en desarrollo)
  if (process.env.NODE_ENV === 'development') {
    console.log('UserPanel Debug:', {
      user: !!user,
      profile: !!profile,
      loading,
      userId: user?.id,
      userEmail: user?.email,
      profileId: profile?.id,
      profileName: profile?.display_name,
      tokenBalance,
      sessionExists: !!session,
      forceRender,
      isOpen
    });
  }

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
    }, 150); // Reduced for better UX
    setHoverTimeout(timeout);
  };

  // Reset hover state when panel is closed
  useEffect(() => {
    if (!isOpen) {
      setIsHovered(false);
    }
  }, [isOpen]);

  // Force render after 3 seconds if still loading
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        console.log('⚠️ Forcing UserPanel render after 3s timeout - Auth state may be stuck');
        console.log('Current state:', { user: !!user, profile: !!profile, loading, session: !!session });
        setForceRender(true);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setForceRender(false); // Reset if loading completes normally
    }
  }, [loading, user, profile, session]);

  if (loading && !forceRender) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2">
        <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse"></div>
        <div className="hidden md:block space-y-1">
          <div className="w-20 h-3 bg-gray-700 rounded animate-pulse"></div>
          <div className="w-16 h-2 bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  // Improved logic: handle all authentication states properly
  if (process.env.NODE_ENV === 'development') {
    console.log('🎯 UserPanel Render Decision:', {
      hasUser: !!user,
      hasProfile: !!profile,
      hasSession: !!session,
      isLoading: loading,
      forceRender,
      userId: user?.id,
      profileId: profile?.id,
      userEmail: user?.email,
      sessionUserId: session?.user?.id,
      decision: user && profile ? 'authenticated' : user ? 'partial-auth' : 'not-authenticated'
    });
  }

  // Check if user is authenticated (has session and user object)
  const isAuthenticated = !!user && !!session;

  if (isAuthenticated && profile) {
    // Authenticated user with complete profile
    return (
      <div className="relative">
        <button
          className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-red-400 transition-colors rounded-lg hover:bg-gray-800/50 group"
        >
          <div className="relative">
            <UserAvatar avatarUrl={profile?.avatar_url} size="small" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-gray-900 animate-pulse"></div>
          </div>
          <div className="hidden md:block text-left">
            <div className="text-sm font-medium text-white">
              {profile?.display_name || `${profile?.first_name || 'Usuario'} ${profile?.last_name || ''}`.trim()}
            </div>
            <div className="text-xs text-yellow-400 flex items-center space-x-1">
              <FiZap className="w-3 h-3" />
              <span>{tokenBalance?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) || '0'} tokens</span>
            </div>
          </div>
          <FiChevronDown className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
        </button>

        {/* User Panel Dropdown */}
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
                  {/* User Info Header */}
                  <div className="text-center mb-4">
                    <div className="flex justify-center mb-3">
                      <UserAvatar avatarUrl={profile?.avatar_url} size="medium" />
                    </div>
                    <div className="text-white font-semibold text-lg">
                      {profile?.display_name || `${profile?.first_name || 'Usuario'} ${profile?.last_name || ''}`.trim()}
                    </div>
                    <div className="text-gray-400 text-sm mb-2">{user?.email}</div>
                    <div className="flex items-center justify-center space-x-2 bg-yellow-500/10 rounded-lg px-3 py-1 border border-yellow-500/20">
                      <FiZap className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 text-sm font-medium">
                        {tokenBalance?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) || '0'} tokens
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-700 my-4"></div>

                  {/* Quick Actions */}
                  <div className="space-y-2 mb-4">
                    <Link
                      href="/perfil"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-red-900/20 rounded-lg transition-all duration-300 group"
                    >
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                        <FiUser className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <div className="font-medium">Mi Perfil</div>
                        <div className="text-xs text-gray-400">Gestiona tu información</div>
                      </div>
                    </Link>

                    <Link
                      href="/ordenes"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-red-900/20 rounded-lg transition-all duration-300 group"
                    >
                      <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                        <FiShoppingBag className="w-4 h-4 text-green-400" />
                      </div>
                      <div>
                        <div className="font-medium">Mis Órdenes</div>
                        <div className="text-xs text-gray-400">Historial de compras</div>
                      </div>
                    </Link>
                  </div>

                  {/* Locations Mini CRUD */}
                  <div className="border-t border-gray-700 pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-white font-medium text-sm">Mis Ubicaciones</h3>
                      <Link
                        href="/perfil"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-1 px-2 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 rounded-md transition-colors text-xs"
                      >
                        <FiPlus className="w-3 h-3" />
                        <span>Gestionar</span>
                      </Link>
                    </div>

                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {user && profile ? (
                        <div className="text-center py-4">
                          <FiMapPin className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-400 text-xs">Ubicaciones se gestionan en el perfil</p>
                          </div>
                      ) : (
                        <div className="text-center py-4">
                          <FiMapPin className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-400 text-xs">Inicia sesión para ver ubicaciones</p>
                        </div>
                      )}
                      </div>
                  </div>

                  {/* Logout */}
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

  if (isAuthenticated && !profile) {
    // Authenticated user but profile incomplete
    return (
      <div className="relative">
        <button
          className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-red-400 transition-colors rounded-lg hover:bg-gray-800/50 group border border-gray-700/50"
        >
          <div className="relative">
            <UserAvatar avatarUrl={null} size="small" />
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
                  {/* Header */}
                  <div className="text-center mb-6">
                    <div className="flex justify-center mb-4">
                      <UserAvatar avatarUrl={null} size="medium" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">¡Completa tu perfil!</h3>
                    <p className="text-gray-400 text-sm">
                      Para acceder a todas las funciones necesitas completar tu información
                    </p>
                  </div>

                  {/* Quick Actions */}
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

                  {/* Logout */}
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

  // Non-authenticated user - Login prompt with hover
  return (
    <div className="relative">
      <button
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-red-400 transition-colors rounded-lg hover:bg-gray-800/50 border border-gray-700/50 group"
      >
        <div className="relative">
          <div className="w-8 h-8 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center">
            <FiUser className="w-4 h-4 text-white" />
          </div>
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
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiUser className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">¡Bienvenido!</h3>
                  <p className="text-gray-400 text-sm">
                    Inicia sesión para acceder a todas las funciones
                  </p>
                </div>

                {/* Benefits */}
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

                {/* Actions */}
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

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isUserPanelOpen, setIsUserPanelOpen] = useState(false);
  const [isMiniLocationOpen, setIsMiniLocationOpen] = useState(false);
  const pathname = usePathname();

  // Debug log para Header (solo en desarrollo)
  if (process.env.NODE_ENV === 'development') {
    console.log('🏠 Header Debug:', {
      component: 'Header',
      pathname,
      mobileMenuOpen,
      isUserPanelOpen,
      isMiniLocationOpen
    });
  }
  const { user, profile, tokenBalance, signOut, loading } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };


  return (
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-red-900/50 shadow-lg shadow-red-900/20 w-full">
      <div className="w-full max-w-full px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
                    {/* Left Side - Logo + Centered MiniLocation */}
          <div className="flex items-center flex-shrink-0 relative">
            {/* Logo - Stretched 80% wider */}
            <Link href="/" className="flex items-center group">
              <div className="relative">
                <div className="w-20 h-12 sm:w-32 sm:h-16 lg:w-56 lg:h-20 group-hover:shadow-xl group-hover:shadow-red-600/40 transition-all duration-300">
                  <Image
                    src="/redmafialogo.png"
                    alt="LA RED MAFIA"
                    width={80}
                    height={80}
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-br from-red-600 to-red-900 rounded-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-md"></div>
              </div>
            </Link>

            {/* Mini Location - Centered between logo end and navigation start */}
            <div
              className="hidden md:block absolute left-full ml-4"
              style={{ transform: 'translateX(-50%)' }}
              onMouseEnter={() => setIsMiniLocationOpen(true)}
              onMouseLeave={() => setIsMiniLocationOpen(false)}
            >
              <MiniLocation isOpen={isMiniLocationOpen} setIsOpen={setIsMiniLocationOpen} />
            </div>
          </div>

          {/* Center - Navigation */}
          <nav className="hidden md:flex items-center space-x-2 xl:space-x-3 flex-1 justify-center px-6 lg:px-8">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative flex items-center space-x-1 xl:space-x-2 px-2 xl:px-3 py-2 xl:py-3 rounded-lg text-sm font-medium transition-all duration-300 group ${
                    isActive
                      ? 'bg-gradient-to-r from-red-600/30 to-red-700/30 text-red-300 border border-red-500/40 shadow-lg shadow-red-600/20'
                      : 'text-gray-300 hover:text-red-200 hover:bg-red-900/20 hover:border-red-700/30 border border-transparent'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-red-400' : 'group-hover:text-red-400'} transition-colors`} />
                  <span className="hidden xl:block font-medium">{item.name}</span>
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-red-700/10 rounded-lg blur-sm"></div>
                  )}
                </Link>
              );
            })}
          </nav>

                    {/* Right Side - Cart + User/Auth */}
          <div className="flex items-center space-x-4 md:space-x-6 lg:space-x-8">
            {/* Cart & Wishlist - Always visible on larger screens */}
            <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
              <MiniWishlist />
              <MiniCart />
            </div>

            {/* User Panel - Always Visible */}
            <div
              className="flex items-center ml-2 md:ml-0"
              onMouseEnter={() => setIsUserPanelOpen(true)}
              onMouseLeave={() => setIsUserPanelOpen(false)}
            >
              <UserPanel isOpen={isUserPanelOpen} setIsOpen={setIsUserPanelOpen} />
            </div>

            {/* Mobile Menu Button - Only on small screens */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              {mobileMenuOpen ? (
                <FiX className="w-6 h-6 text-white" />
              ) : (
                <FiMenu className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 border-t border-red-900/50"
          >
            <div className="px-6 py-6 space-y-6">
              {/* Logo + Mini Location */}
              <div className="flex items-center justify-between pb-6 border-b border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8">
                    <Image
                      src="/redmafialogo.png"
                      alt="LA RED MAFIA Logo"
                      width={32}
                      height={32}
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>
                  <div className="text-sm font-bold text-white">
                    LA RED MAFIA
                  </div>
                </div>
                <div className="flex items-center">
                  <MiniLocation isOpen={isMiniLocationOpen} setIsOpen={setIsMiniLocationOpen} />
                </div>
              </div>

              {/* Navigation */}
              <div className="space-y-3">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                      isActive
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              </div>

              {/* Cart & Wishlist for Mobile */}
              <div className="flex items-center justify-center space-x-8 pt-6 border-t border-gray-700">
                <MiniWishlist />
                <MiniCart />
              </div>

                            {/* Mobile User Panel - Always visible */}
              <div className="pt-6 border-t border-gray-700">
                <div className="px-6 py-3">
                  <UserPanel isOpen={isUserPanelOpen} setIsOpen={setIsUserPanelOpen} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
