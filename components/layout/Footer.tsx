'use client';

import Link from 'next/link';
import { FiInstagram, FiTwitter, FiYoutube, FiFacebook, FiHeart } from 'react-icons/fi';

const footerLinks = {
  platform: [
    { name: 'Artistas', href: '/artists' },
    { name: 'Música', href: '/music' },
    { name: 'Eventos', href: '/events' },
    { name: 'Tienda', href: '/store' },
  ],
  support: [
    { name: 'Centro de Ayuda', href: '/help' },
    { name: 'Contacto', href: '/contact' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Reportar Problema', href: '/report' },
  ],
  legal: [
    { name: 'Términos de Uso', href: '/terms' },
    { name: 'Política de Privacidad', href: '/privacy' },
    { name: 'Cookies', href: '/cookies' },
    { name: 'Derechos de Autor', href: '/copyright' },
  ],
};

const socialLinks = [
  { name: 'Instagram', href: '#', icon: FiInstagram },
  { name: 'Twitter', href: '#', icon: FiTwitter },
  { name: 'YouTube', href: '#', icon: FiYoutube },
  { name: 'Facebook', href: '#', icon: FiFacebook },
];

export function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center font-bold text-white text-xl">
                RM
              </div>
              <div>
                <div className="font-display font-bold text-xl text-white">
                  LA RED MAFIA
                </div>
                <div className="text-xs text-gray-400 -mt-1">
                  Plataforma Musical
                </div>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-6 max-w-sm">
              La plataforma musical más épica de Guadalajara. Conectamos artistas, 
              fans y la cultura urbana en un solo lugar.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary-500 transition-all duration-300"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Plataforma</h3>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Soporte</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="max-w-md">
            <h3 className="font-semibold text-white mb-2">
              Mantente al día
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Recibe las últimas noticias sobre artistas, eventos y lanzamientos.
            </p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="tu@email.com"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
              />
              <button className="btn-primary px-6">
                Suscribirse
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-gray-400 text-sm">
            © {new Date().getFullYear()} LA RED MAFIA. Todos los derechos reservados.
          </div>
          
          <div className="flex items-center space-x-1 text-gray-400 text-sm">
            <span>Hecho con</span>
            <FiHeart className="w-4 h-4 text-primary-500" />
            <span>por</span>
            <span className="text-white font-medium">Kiro AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}