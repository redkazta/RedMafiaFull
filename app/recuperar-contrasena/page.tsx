'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FiMail, FiArrowLeft, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { supabase } from '@/lib/supabase';

export default function RecuperarContrasenaPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number}>>([]);
  const router = useRouter();

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1
    }));
    setParticles(newParticles);
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        switch (error.message) {
          case 'User not found':
            setError('No existe una cuenta con este email.');
            break;
          case 'Email rate limit exceeded':
            setError('Se han enviado demasiados emails. Espera unos minutos antes de intentar de nuevo.');
            break;
          default:
            setError(error.message || 'Error al enviar el email. Intenta de nuevo.');
        }
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError('Error inesperado. Verifica tu conexión a internet e intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col relative overflow-hidden">
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-green-900/20 via-transparent to-primary-900/20"></div>
        </div>

        <Header />

        <main className="flex-1 flex items-center justify-center py-20 relative z-10">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-green-500/30 shadow-2xl shadow-green-500/10 text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiCheck className="w-8 h-8 text-green-400" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-4">Email Enviado</h1>
                <p className="text-gray-300 mb-4">
                  Te hemos enviado un email con instrucciones para restablecer tu contraseña a <strong>{email}</strong>
                </p>
                <p className="text-yellow-400 mb-6">
                  ⚠️ <strong>Importante:</strong> Revisa tu bandeja de entrada (incluyendo la carpeta de spam) y haz clic en el enlace para crear una nueva contraseña.
                </p>
                <div className="space-y-3">
                  <Link
                    href="/login"
                    className="inline-block px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:from-primary-600 hover:to-accent-600 transition-all duration-300 font-semibold"
                  >
                    Volver al Inicio de Sesión
                  </Link>
                </div>
              </div>
            </div>
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
            className="absolute rounded-full bg-accent-400/20 animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDelay: `${particle.id * 0.15}s`,
              animationDuration: `${3 + Math.random() * 3}s`
            }}
          />
        ))}

        {/* Glowing Orbs */}
        <div className="absolute top-1/3 left-1/5 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/5 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <Header />

      <main className="flex-1 flex items-center justify-center py-20 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            {/* Back Button */}
            <Link
              href="/login"
              className="inline-flex items-center space-x-2 text-primary-400 hover:text-primary-300 transition-colors mb-8"
            >
              <FiArrowLeft className="w-4 h-4" />
              <span>Volver al inicio de sesión</span>
            </Link>

            {/* Reset Password Card */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-primary-500/30 shadow-2xl shadow-primary-500/10">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-display font-bold text-white mb-2">
                  <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                    Recuperar Contraseña
                  </span>
                </h1>
                <p className="text-gray-400">Ingresa tu email para recibir instrucciones</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-2">
                    <FiAlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                </div>
              )}

              {/* Reset Form */}
              <form onSubmit={handleResetPassword} className="space-y-6">
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

                {/* Reset Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:from-primary-600 hover:to-accent-600 transition-all duration-300 font-semibold shadow-lg shadow-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Enviando...' : 'Enviar Instrucciones'}
                </button>
              </form>

              {/* Info */}
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-blue-400 text-sm">
                  💡 Recibirás un email con un enlace seguro para crear una nueva contraseña.
                  El enlace expirará en 1 hora por seguridad.
                </p>
              </div>

              {/* Back to Login */}
              <div className="mt-8 text-center">
                <p className="text-gray-400">
                  ¿Recordaste tu contraseña?{' '}
                  <Link href="/login" className="text-primary-400 hover:text-primary-300 transition-colors font-medium">
                    Iniciar sesión
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
