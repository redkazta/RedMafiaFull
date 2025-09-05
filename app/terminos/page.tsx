'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

export default function TerminosPage() {
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
                  Términos y Condiciones
                </span>
              </h1>

              <div className="space-y-6 text-gray-300">
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">1. Aceptación de los Términos</h2>
                  <p className="leading-relaxed">
                    Al acceder y utilizar LA RED MAFIA, aceptas estar sujeto a estos términos y condiciones.
                    Si no estás de acuerdo con alguna parte de estos términos, no podrás acceder al servicio.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">2. Uso del Servicio</h2>
                  <p className="leading-relaxed mb-4">
                    LA RED MAFIA es una plataforma musical que permite:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Descubrir y escuchar música de artistas independientes</li>
                    <li>Comprar productos oficiales de artistas</li>
                    <li>Asistir a eventos musicales</li>
                    <li>Conectar con la comunidad musical</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">3. Cuentas de Usuario</h2>
                  <p className="leading-relaxed">
                    Para utilizar ciertos servicios, debes crear una cuenta. Eres responsable de mantener
                    la confidencialidad de tu contraseña y de todas las actividades que ocurran bajo tu cuenta.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">4. Contenido del Usuario</h2>
                  <p className="leading-relaxed">
                    Al subir contenido a nuestra plataforma, garantizas que tienes los derechos necesarios
                    y que el contenido no viola los derechos de terceros ni infringe nuestras políticas.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">5. Sistema de Tokens</h2>
                  <p className="leading-relaxed">
                    Nuestra plataforma utiliza un sistema de tokens para transacciones. Los tokens tienen
                    valor y deben ser utilizados de acuerdo con nuestras políticas de uso justo.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">6. Propiedad Intelectual</h2>
                  <p className="leading-relaxed">
                    Todo el contenido de LA RED MAFIA está protegido por derechos de autor y otras leyes
                    de propiedad intelectual. No puedes copiar, distribuir o crear obras derivadas sin
                    autorización expresa.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">7. Limitación de Responsabilidad</h2>
                  <p className="leading-relaxed">
                    LA RED MAFIA no se hace responsable por daños indirectos, incidentales o consecuentes
                    derivados del uso de nuestros servicios.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">8. Modificaciones</h2>
                  <p className="leading-relaxed">
                    Nos reservamos el derecho de modificar estos términos en cualquier momento.
                    Los cambios entrarán en vigor inmediatamente después de su publicación.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">9. Contacto</h2>
                  <p className="leading-relaxed">
                    Si tienes preguntas sobre estos términos, puedes contactarnos a través de nuestro
                    sistema de soporte en la plataforma.
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
