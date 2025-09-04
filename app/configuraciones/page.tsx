'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FiArrowLeft, FiSave, FiUser, FiBell, FiShield, FiGlobe, FiSun, FiMoon, FiMonitor } from 'react-icons/fi';
import { useAuth } from '@/components/providers/AuthProvider';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user, profile, settings, updateSettings, refreshProfile, loading } = useAuth();
  const [saving, setSaving] = useState(false);
  const [localSettings, setLocalSettings] = useState({
    theme: 'dark',
    language: 'es',
    timezone: 'America/Mexico_City',
    email_notifications: true,
    push_notifications: true,
    order_notifications: true,
    marketing_emails: false,
    profile_visibility: 'public',
    show_online_status: true,
    allow_messages: true,
    content_filter: 'moderate'
  });

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const handleSettingChange = (key: string, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = async () => {
    if (!user) return;

    setSaving(true);
    try {
      await updateSettings(localSettings);
      toast.success('Configuraciones guardadas correctamente');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Error al guardar las configuraciones');
    } finally {
      setSaving(false);
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
              <FiUser className="w-12 h-12 text-gray-600" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Acceso requerido</h2>
            <p className="text-gray-400 mb-8">
              Debes iniciar sesión para acceder a las configuraciones
            </p>
            <Link
              href="/login"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:from-primary-600 hover:to-accent-600 transition-all duration-300 font-semibold"
            >
              <FiUser className="w-5 h-5" />
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
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Configuraciones
            </h1>
            <p className="text-gray-300 text-lg">
              Personaliza tu experiencia en LA RED MAFIA
            </p>
          </div>

          {/* Settings Sections */}
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Appearance Settings */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-3">
                <FiSun className="w-6 h-6 text-primary-400" />
                <span>Apariencia</span>
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="text-white font-medium mb-3 block">Tema de la aplicación</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'light', label: 'Claro', icon: FiSun },
                      { value: 'dark', label: 'Oscuro', icon: FiMoon },
                      { value: 'auto', label: 'Automático', icon: FiMonitor }
                    ].map((theme) => (
                      <button
                        key={theme.value}
                        onClick={() => handleSettingChange('theme', theme.value)}
                        className={`flex items-center justify-center space-x-2 p-3 rounded-lg border transition-colors ${
                          localSettings.theme === theme.value
                            ? 'bg-primary-500/20 border-primary-500 text-primary-400'
                            : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-600/50'
                        }`}
                      >
                        <theme.icon className="w-5 h-5" />
                        <span className="text-sm font-medium">{theme.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-white font-medium mb-3 block">Idioma</label>
                  <select
                    value={localSettings.language}
                    onChange={(e) => handleSettingChange('language', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="es">Español</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div>
                  <label className="text-white font-medium mb-3 block">Zona horaria</label>
                  <select
                    value={localSettings.timezone}
                    onChange={(e) => handleSettingChange('timezone', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="America/Mexico_City">Ciudad de México (CST)</option>
                    <option value="America/Tijuana">Tijuana (PST)</option>
                    <option value="America/Cancun">Cancún (EST)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-3">
                <FiBell className="w-6 h-6 text-primary-400" />
                <span>Notificaciones</span>
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Notificaciones por email</h4>
                    <p className="text-gray-400 text-sm">Recibe actualizaciones importantes por correo</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSettings.email_notifications}
                      onChange={(e) => handleSettingChange('email_notifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Notificaciones push</h4>
                    <p className="text-gray-400 text-sm">Recibe notificaciones en tiempo real</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSettings.push_notifications}
                      onChange={(e) => handleSettingChange('push_notifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Notificaciones de órdenes</h4>
                    <p className="text-gray-400 text-sm">Actualizaciones sobre tus compras</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSettings.order_notifications}
                      onChange={(e) => handleSettingChange('order_notifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Emails de marketing</h4>
                    <p className="text-gray-400 text-sm">Ofertas especiales y novedades</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSettings.marketing_emails}
                      onChange={(e) => handleSettingChange('marketing_emails', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-3">
                <FiShield className="w-6 h-6 text-primary-400" />
                <span>Privacidad</span>
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="text-white font-medium mb-3 block">Visibilidad del perfil</label>
                  <select
                    value={localSettings.profile_visibility}
                    onChange={(e) => handleSettingChange('profile_visibility', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="public">Público</option>
                    <option value="friends">Solo amigos</option>
                    <option value="private">Privado</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Mostrar estado en línea</h4>
                    <p className="text-gray-400 text-sm">Otros usuarios pueden ver cuando estás activo</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSettings.show_online_status}
                      onChange={(e) => handleSettingChange('show_online_status', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Permitir mensajes privados</h4>
                    <p className="text-gray-400 text-sm">Otros usuarios pueden enviarte mensajes</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSettings.allow_messages}
                      onChange={(e) => handleSettingChange('allow_messages', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  </label>
                </div>

                <div>
                  <label className="text-white font-medium mb-3 block">Filtro de contenido</label>
                  <select
                    value={localSettings.content_filter}
                    onChange={(e) => handleSettingChange('content_filter', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="none">Sin filtro</option>
                    <option value="moderate">Moderado</option>
                    <option value="strict">Estricto</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-center">
              <button
                onClick={handleSaveSettings}
                disabled={saving}
                className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:from-primary-600 hover:to-accent-600 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <FiSave className="w-5 h-5" />
                    <span>Guardar Configuraciones</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
