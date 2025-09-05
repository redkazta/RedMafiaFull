'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Link
              href="/registro"
              className="inline-flex items-center space-x-2 text-primary-400 hover:text-primary-300 transition-colors mb-8"
            >
              <FiArrowLeft className="w-4 h-4" />
              <span>Volver al registro</span>
            </Link>

            {/* Content */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-primary-500/30 shadow-2xl">
              <h1 className="text-4xl font-display font-bold text-white mb-8">
                <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                  Política de Privacidad
                </span>
              </h1>

              <div className="space-y-6 text-gray-300">
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">1. Información que Recopilamos</h2>
                  <p className="leading-relaxed mb-4">
                    En LA RED MAFIA recopilamos la siguiente información:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Información de registro (nombre, email, nombre de usuario)</li>
                    <li>Datos de perfil (biografía, avatar, ubicación)</li>
                    <li>Información de uso de la plataforma</li>
                    <li>Datos de transacciones con tokens</li>
                    <li>Información de dispositivos y navegación</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">2. Cómo Usamos tu Información</h2>
                  <p className="leading-relaxed mb-4">
                    Utilizamos tu información para:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Proporcionar y mantener nuestros servicios</li>
                    <li>Procesar transacciones y gestionar tu cuenta</li>
                    <li>Mejorar la experiencia del usuario</li>
                    <li>Comunicarnos contigo sobre actualizaciones</li>
                    <li>Garantizar la seguridad de la plataforma</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">3. Compartir Información</h2>
                  <p className="leading-relaxed">
                    No vendemos, alquilamos ni compartimos tu información personal con terceros,
                    excepto en los siguientes casos:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                    <li>Con tu consentimiento explícito</li>
                    <li>Para cumplir con obligaciones legales</li>
                    <li>Para proteger nuestros derechos y seguridad</li>
                    <li>Con proveedores de servicios que nos ayudan a operar</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">4. Seguridad de Datos</h2>
                  <p className="leading-relaxed">
                    Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger
                    tu información personal contra acceso no autorizado, alteración, divulgación o destrucción.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">5. Tus Derechos</h2>
                  <p className="leading-relaxed mb-4">
                    Tienes derecho a:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Acceder a tu información personal</li>
                    <li>Rectificar información inexacta</li>
                    <li>Solicitar la eliminación de tus datos</li>
                    <li>Oponerte al procesamiento de tus datos</li>
                    <li>Solicitar la portabilidad de tus datos</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">6. Cookies y Tecnologías Similares</h2>
                  <p className="leading-relaxed">
                    Utilizamos cookies y tecnologías similares para mejorar tu experiencia,
                    recordar tus preferencias y analizar el uso de nuestros servicios.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">7. Retención de Datos</h2>
                  <p className="leading-relaxed">
                    Conservamos tu información personal durante el tiempo necesario para cumplir
                    con los fines para los que fue recopilada, o según lo requieran las leyes aplicables.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">8. Cambios a esta Política</h2>
                  <p className="leading-relaxed">
                    Podemos actualizar esta política de privacidad periódicamente. Te notificaremos
                    sobre cambios significativos mediante un aviso en nuestra plataforma.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">9. Contacto</h2>
                  <p className="leading-relaxed">
                    Si tienes preguntas sobre esta política de privacidad o deseas ejercer tus derechos,
                    puedes contactarnos a través de nuestro sistema de soporte.
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-700">
                <p className="text-sm text-gray-400">
                  Última actualización: {new Date().toLocaleDateString('es-ES')}
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
