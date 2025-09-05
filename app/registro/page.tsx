'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiChrome, FiCheck, FiPhone } from 'react-icons/fi';
import { supabase } from '@/lib/supabase';

export default function RegistroPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    firstName: '',
    lastName: '',
    phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumbers: false,
    hasNonalphas: false,
    isValid: false
  });
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number}>>([]);
  const router = useRouter();
  
  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1
    }));
    setParticles(newParticles);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Actualizar fortaleza de contraseña en tiempo real
    if (name === 'password') {
      setPasswordStrength(validatePassword(value));
    }
  };

  // Validaciones con regex
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasNonalphas = /\W/.test(password);

    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasNonalphas,
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasNonalphas
    };
  };

  const validateUsername = (username: string) => {
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    return usernameRegex.test(username);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = () => {
    // Validar email
    if (!validateEmail(formData.email)) {
      setError('El formato del email no es válido');
      return false;
    }

    // Validar username
    if (!validateUsername(formData.username)) {
      setError('El nombre de usuario debe tener entre 3-20 caracteres, solo letras, números, guiones y guiones bajos');
      return false;
    }

    // Validar teléfono
    if (!validatePhone(formData.phone)) {
      setError('El formato del teléfono no es válido');
      return false;
    }

    // Validar contraseña
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      const missing = [];
      if (!passwordValidation.minLength) missing.push('al menos 8 caracteres');
      if (!passwordValidation.hasUpperCase) missing.push('una letra mayúscula');
      if (!passwordValidation.hasLowerCase) missing.push('una letra minúscula');
      if (!passwordValidation.hasNumbers) missing.push('un número');
      if (!passwordValidation.hasNonalphas) missing.push('un carácter especial');

      setError(`La contraseña debe contener: ${missing.join(', ')}`);
      return false;
    }

    // Validar confirmación de contraseña
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }

    // Validar términos
    if (!acceptTerms) {
      setError('Debes aceptar los términos y condiciones para continuar');
      return false;
    }

    // Validar campos requeridos
    if (!formData.firstName.trim()) {
      setError('El nombre es requerido');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('El apellido es requerido');
      return false;
    }

    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
          data: {
            username: formData.username,
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone
          }
        }
      });

      if (error) {
        // Provide user-friendly error messages
        switch (error.message) {
          case 'User already registered':
            setError('Ya existe una cuenta con este email. Si no has confirmado tu email, revisa tu bandeja de entrada.');
            break;
          case 'Password should be at least 6 characters':
            setError('La contraseña debe tener al menos 6 caracteres.');
            break;
          case 'Unable to validate email address: invalid format':
            setError('El formato del email no es válido. Verifica e intenta de nuevo.');
            break;
          case 'Signup is disabled':
            setError('El registro está temporalmente deshabilitado. Intenta más tarde.');
            break;
          case 'Email rate limit exceeded':
            setError('Se han enviado demasiados emails. Espera unos minutos antes de intentar de nuevo.');
            break;
          default:
            setError(error.message || 'Error al crear la cuenta. Intenta de nuevo.');
        }
      } else {
        setSuccess(true);
        // Redirigir a home después de un tiempo
        setTimeout(() => {
          router.push('/');
        }, 4000);
      }
    } catch (err) {
      setError('Error inesperado. Verifica tu conexión a internet e intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
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
            setError('El registro con Google no está disponible en este momento.');
            break;
          default:
            setError('Error al registrarse con Google. Intenta de nuevo.');
        }
      }
    } catch (err) {
      setError('Error inesperado con Google. Verifica tu conexión e intenta de nuevo.');
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
                <h1 className="text-3xl font-bold text-white mb-4">¡Registro Exitoso!</h1>
                <p className="text-gray-300 mb-4">
                  Te hemos enviado un email de confirmación a <strong>{formData.email}</strong>
                </p>
                <p className="text-yellow-400 mb-6">
                  ⚠️ <strong>Importante:</strong> Debes confirmar tu email antes de poder iniciar sesión. Revisa tu bandeja de entrada y haz clic en el enlace de confirmación.
                </p>
                <p className="text-primary-400 mb-6">
                  🎉 ¡Recibirás 1000 tokens de bienvenida una vez que confirmes tu cuenta!
                </p>
                <div className="space-y-3">
                  <Link 
                    href="/"
                    className="inline-block px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:from-primary-600 hover:to-accent-600 transition-all duration-300 font-semibold"
                  >
                    Ir al Inicio
                  </Link>
                  <br />
                  <Link 
                    href="/login"
                    className="inline-block px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 font-semibold"
                  >
                    Ya confirmé mi email - Iniciar Sesión
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
        
        {/* Matrix Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-20 h-full">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="border-r border-primary-500/20 animate-pulse" style={{animationDelay: `${i * 0.1}s`}}></div>
            ))}
          </div>
        </div>
        
        {/* Floating Particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-accent-400/20 animate-bounce"
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
            {/* Register Card */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-primary-500/30 shadow-2xl shadow-primary-500/10">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-display font-bold text-white mb-2">
                  <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                    Únete a la Red
                  </span>
                </h1>
                <p className="text-gray-400">Crea tu cuenta y forma parte de la mafia</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Register Form */}
              <form onSubmit={handleRegister} className="space-y-6">
                {/* Username Field */}
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    Nombre de Usuario *
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-primary-500/50 focus:outline-none transition-colors"
                      placeholder="tu_username"
                      required
                    />
                  </div>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-primary-500/50 focus:outline-none transition-colors"
                      placeholder="Nombre"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">
                      Apellido *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-primary-500/50 focus:outline-none transition-colors"
                      placeholder="Apellido"
                      required
                    />
                  </div>
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    Teléfono *
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-primary-500/50 focus:outline-none transition-colors"
                      placeholder="+52 55 1234 5678"
                      required
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-primary-500/50 focus:outline-none transition-colors"
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    Contraseña *
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
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

                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${passwordStrength.isValid ? 'bg-green-500' : passwordStrength.minLength ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                        <span className={`text-xs ${passwordStrength.isValid ? 'text-green-400' : passwordStrength.minLength ? 'text-yellow-400' : 'text-red-400'}`}>
                          {passwordStrength.isValid ? 'Contraseña segura' : passwordStrength.minLength ? 'Contraseña aceptable' : 'Contraseña débil'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-xs">
                        <div className={`flex items-center space-x-1 ${passwordStrength.minLength ? 'text-green-400' : 'text-gray-500'}`}>
                          <FiCheck className="w-3 h-3" />
                          <span>8+ caracteres</span>
                        </div>
                        <div className={`flex items-center space-x-1 ${passwordStrength.hasUpperCase ? 'text-green-400' : 'text-gray-500'}`}>
                          <FiCheck className="w-3 h-3" />
                          <span>Mayúscula</span>
                        </div>
                        <div className={`flex items-center space-x-1 ${passwordStrength.hasLowerCase ? 'text-green-400' : 'text-gray-500'}`}>
                          <FiCheck className="w-3 h-3" />
                          <span>Minúscula</span>
                        </div>
                        <div className={`flex items-center space-x-1 ${passwordStrength.hasNumbers ? 'text-green-400' : 'text-gray-500'}`}>
                          <FiCheck className="w-3 h-3" />
                          <span>Número</span>
                        </div>
                        <div className={`flex items-center space-x-1 ${passwordStrength.hasNonalphas ? 'text-green-400' : 'text-gray-500'}`}>
                          <FiCheck className="w-3 h-3" />
                          <span>Especial</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    Confirmar Contraseña *
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-12 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-primary-500/50 focus:outline-none transition-colors"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="w-4 h-4 text-primary-500 bg-gray-700 border-gray-600 rounded focus:ring-primary-500 mt-1"
                  />
                  <span className="ml-2 text-sm text-gray-400">
                    Acepto los{' '}
                    <Link href="/terminos" className="text-primary-400 hover:text-primary-300 transition-colors">
                      términos y condiciones
                    </Link>
                    {' '}y la{' '}
                    <Link href="/privacidad" className="text-primary-400 hover:text-primary-300 transition-colors">
                      política de privacidad
                    </Link>
                  </span>
                </div>

                {/* Register Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:from-primary-600 hover:to-accent-600 transition-all duration-300 font-semibold shadow-lg shadow-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                </button>
              </form>

              {/* Divider */}
              <div className="my-8 flex items-center">
                <div className="flex-1 border-t border-gray-600"></div>
                <span className="px-4 text-gray-400 text-sm">O regístrate con</span>
                <div className="flex-1 border-t border-gray-600"></div>
              </div>

              {/* Social Signup */}
              <div className="space-y-3">
                <button
                  onClick={handleGoogleSignup}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 py-3 bg-gray-700/50 text-white rounded-lg hover:bg-gray-600/50 transition-colors border border-gray-600/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiChrome className="w-5 h-5" />
                  {loading ? 'Conectando...' : 'Continuar con Google'}
                </button>
              </div>

              {/* Login Link */}
              <div className="mt-8 text-center">
                <p className="text-gray-400">
                  ¿Ya tienes cuenta?{' '}
                  <Link href="/login" className="text-primary-400 hover:text-primary-300 transition-colors font-medium">
                    Inicia sesión aquí
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