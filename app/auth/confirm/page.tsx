'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FiCheck, FiX, FiLoader } from 'react-icons/fi';
import { supabase } from '@/lib/supabase';

function ConfirmContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        const token_hash = searchParams?.get('token_hash');
        const type = searchParams?.get('type');

        if (token_hash && type) {
          const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type: type as any,
          });

          if (error) {
            setStatus('error');
            setMessage('Error al confirmar tu email. El enlace puede haber expirado.');
          } else {
            setStatus('success');
            setMessage('¡Email confirmado exitosamente! Ya puedes iniciar sesión.');
            
            // Redirigir al dashboard después de 3 segundos
            setTimeout(() => {
              router.push('/dashboard');
            }, 3000);
          }
        } else {
          setStatus('error');
          setMessage('Enlace de confirmación inválido.');
        }
      } catch (err) {
        setStatus('error');
        setMessage('Error inesperado al confirmar tu email.');
      }
    };

    handleEmailConfirmation();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/20 via-transparent to-accent-900/20"></div>
      </div>
      
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-20 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-primary-500/30 shadow-2xl shadow-primary-500/10 text-center">
              
              {status === 'loading' && (
                <>
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FiLoader className="w-8 h-8 text-blue-400 animate-spin" />
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-4">Confirmando Email...</h1>
                  <p className="text-gray-300">
                    Estamos verificando tu email. Espera un momento.
                  </p>
                </>
              )}

              {status === 'success' && (
                <>
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FiCheck className="w-8 h-8 text-green-400" />
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-4">¡Email Confirmado!</h1>
                  <p className="text-gray-300 mb-6">{message}</p>
                  <p className="text-primary-400 mb-6">
                    🎉 ¡Has recibido 1000 tokens de bienvenida!
                  </p>
                  <div className="space-y-3">
                    <Link 
                      href="/dashboard"
                      className="inline-block px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:from-primary-600 hover:to-accent-600 transition-all duration-300 font-semibold"
                    >
                      Ir al Dashboard
                    </Link>
                    <br />
                    <Link 
                      href="/"
                      className="inline-block px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 font-semibold"
                    >
                      Ir al Inicio
                    </Link>
                  </div>
                </>
              )}

              {status === 'error' && (
                <>
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FiX className="w-8 h-8 text-red-400" />
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-4">Error de Confirmación</h1>
                  <p className="text-gray-300 mb-6">{message}</p>
                  <div className="space-y-3">
                    <Link 
                      href="/login"
                      className="inline-block px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:from-primary-600 hover:to-accent-600 transition-all duration-300 font-semibold"
                    >
                      Intentar Iniciar Sesión
                    </Link>
                    <br />
                    <Link 
                      href="/registro"
                      className="inline-block px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 font-semibold"
                    >
                      Registrarse de Nuevo
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col relative overflow-hidden">
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        </div>
        <Header />
        <main className="flex-1 flex items-center justify-center py-20 relative z-10">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-primary-500/30 shadow-2xl shadow-primary-500/10 text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiLoader className="w-8 h-8 text-blue-400 animate-spin" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-4">Cargando...</h1>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <ConfirmContent />
    </Suspense>
  );
}