'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FiMail, FiLock, FiEye, FiEyeOff, FiChrome } from 'react-icons/fi';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number}>>([]);
  const router = useRouter();
  
  useEffect(() => {
    const newParticles = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1
    }));
    setParticles(newParticles);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Provide user-friendly error messages
        switch (error.message) {
          case 'Invalid login credentials':
            setError('Email o contraseña incorrectos. Si acabas de registrarte, asegúrate de haber confirmado tu email primero.');
            break;
          case 'Email not confirmed':
            setError('⚠️ Debes confirmar tu email antes de iniciar sesión. Revisa tu bandeja de entrada (incluyendo la carpeta de spam) y haz clic en el enlace de confirmación.');
            break;
          case 'Too many requests':
            setError('Demasiados intentos de inicio de sesión. Espera unos minutos antes de intentar de nuevo.');
            break;
          case 'User not found':
            setError('No existe una cuenta con este email. ¿Quieres registrarte?');
            break;
          case 'Signup requires email confirmation':
            setError('⚠️ Debes confirmar tu email antes de iniciar sesión. Revisa tu bandeja de entrada y haz clic en el enlace de confirmación.');
            break;
          default:
            // Check if it's an email confirmation related error
            if (error.message.toLowerCase().includes('confirm') || error.message.toLowerCase().includes('verification')) {
              setError('⚠️ Debes confirmar tu email antes de iniciar sesión. Revisa tu bandeja de entrada y haz clic en el enlace de confirmación.');
            } else {
              setError(error.message || 'Error al iniciar sesión. Intenta de nuevo.');
            }
        }
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Error inesperado. Verifica tu conexión a internet e intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) {
        switch (error.message) {
          case 'OAuth provider not enabled':
            setError('El inicio de sesión con Google no está disponible en este momento.');
            break;
          default:
            setError('Error al iniciar sesión con Google. Intenta de nuevo.');
        }
      }
    } catch (err) {
      setError('Error inesperado con Google. Verifica tu conexión e intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!email) {
      setError('Por favor ingresa tu email primero.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`
        }
      });

      if (error) {
        setError('Error al reenviar el email. Intenta de nuevo más tarde.');
      } else {
        setError('');
        alert('Email de confirmación reenviado. Revisa tu bandeja de entrada.');
      }
    } catch (err) {
      setError('Error inesperado. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/20 via-transparent to-accent-900/20"></div>
        
        {/* Circuit Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M10 10h80v80h-80z" fill="none" stroke="currentColor" strokeWidth="1"/>
                <circle cx="20" cy="20" r="3" fill="currentColor"/>
                <circle cx="80" cy="80" r="3" fill="currentColor"/>
                <path d="M20 20L80 80" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit)" className="text-primary-500"/>
          </svg>
        </div>
        
        {/* Floating Particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-primary-400/30 animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDelay: `${particle.id * 0.2}s`,
              animationDuration: `${4 + Math.random() * 2}s`
            }}
          />
        ))}
        
        {/* Glowing Orbs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '3s'}}></div>
      </div>
      
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-20 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            {/* Login Card */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-primary-500/30 shadow-2xl shadow-primary-500/10">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-display font-bold text-white mb-2">
                  <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                    Iniciar Sesión
                  </span>
                </h1>
                <p className="text-gray-400">Accede a tu cuenta de la Red Mafia</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
                  <p className="text-red-400 text-sm">{error}</p>
                  {(error.includes('confirmado') || error.includes('confirmed')) && (
                    <button
                      onClick={handleResendConfirmation}
                      className="mt-2 text-primary-400 hover:text-primary-300 text-sm underline"
                    >
                      Reenviar email de confirmación
                    </button>
                  )}
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-primary-500/50 focus:outline-none transition-colors"
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-primary-500/50 focus:outline-none transition-colors"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input type="checkbox" className="w-4 h-4 text-primary-500 bg-gray-700 border-gray-600 rounded focus:ring-primary-500" />
                    <span className="ml-2 text-sm text-gray-400">Recordarme</span>
                  </label>
                  <Link href="/forgot-password" className="text-sm text-primary-400 hover:text-primary-300 transition-colors">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:from-primary-600 hover:to-accent-600 transition-all duration-300 font-semibold shadow-lg shadow-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </button>
              </form>

              {/* Divider */}
              <div className="my-8 flex items-center">
                <div className="flex-1 border-t border-gray-600"></div>
                <span className="px-4 text-gray-400 text-sm">O continúa con</span>
                <div className="flex-1 border-t border-gray-600"></div>
              </div>

              {/* Social Login */}
              <div className="space-y-3">
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 py-3 bg-gray-700/50 text-white rounded-lg hover:bg-gray-600/50 transition-colors border border-gray-600/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiChrome className="w-5 h-5" />
                  {loading ? 'Conectando...' : 'Continuar con Google'}
                </button>
              </div>

              {/* Register Link */}
              <div className="mt-8 text-center">
                <p className="text-gray-400">
                  ¿No tienes cuenta?{' '}
                  <Link href="/registro" className="text-primary-400 hover:text-primary-300 transition-colors font-medium">
                    Regístrate aquí
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}