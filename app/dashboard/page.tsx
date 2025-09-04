'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/components/providers/AuthProvider';
import { FiUser, FiMusic, FiCalendar, FiShoppingBag, FiHeart, FiTrendingUp, FiEdit, FiSettings } from 'react-icons/fi';

export default function DashboardPage() {
  const { user, profile, tokenBalance, loading } = useAuth();
  const router = useRouter();
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number}>>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1
    }));
    setParticles(newParticles);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white">Cargando...</div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const stats = [
    { label: 'Tokens', value: tokenBalance.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }), icon: FiTrendingUp, color: 'text-yellow-400' },
    { label: 'Tracks Favoritos', value: '23', icon: FiMusic, color: 'text-primary-400' },
    { label: 'Eventos Asistidos', value: '8', icon: FiCalendar, color: 'text-green-400' },
    { label: 'Compras Realizadas', value: '12', icon: FiShoppingBag, color: 'text-purple-400' }
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/10 via-transparent to-accent-900/10"></div>
        
        {/* Floating Particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-primary-400/20 animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDelay: `${particle.id * 0.3}s`,
              animationDuration: `${4 + Math.random() * 2}s`
            }}
          />
        ))}
        
        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      
      <Header />
      
      <main className="flex-1 relative z-10 py-20">
        <div className="container mx-auto px-4">
          {/* Profile Header */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-primary-500/30 shadow-2xl shadow-primary-500/10">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {profile.first_name?.[0]}{profile.last_name?.[0]}
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {profile.display_name || `${profile.first_name} ${profile.last_name}`}
                </h1>
                <p className="text-gray-400 mb-4">@{profile.username}</p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <button className="flex items-center gap-2 px-4 py-2 bg-primary-500/20 text-primary-400 rounded-lg hover:bg-primary-500/30 transition-colors border border-primary-500/30">
                    <FiEdit className="w-4 h-4" />
                    Editar Perfil
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 text-white rounded-lg hover:bg-gray-600/50 transition-colors border border-gray-600/50">
                    <FiSettings className="w-4 h-4" />
                    Configuración
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, i) => (
              <div key={i} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-primary-500/40 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Tracks Favoritos */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <FiHeart className="w-5 h-5 text-red-400" />
                Tracks Favoritos
              </h3>
              <div className="space-y-4">
                {[
                  { title: "Calles de Fuego", artist: "MC Phantom", time: "3:45" },
                  { title: "Neon Dreams", artist: "Cyber Beats", time: "4:12" },
                  { title: "Mafia Code", artist: "Red Shadow", time: "3:28" }
                ].map((track, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-lg">🎵</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">{track.title}</div>
                      <div className="text-gray-400 text-sm">{track.artist}</div>
                    </div>
                    <div className="text-gray-400 text-sm">{track.time}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Próximos Eventos */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <FiCalendar className="w-5 h-5 text-green-400" />
                Próximos Eventos
              </h3>
              <div className="space-y-4">
                {[
                  { title: "Noche Cyberpunk", date: "15 Sep", venue: "Club Underground" },
                  { title: "Red Mafia Showcase", date: "22 Sep", venue: "Warehouse 47" },
                  { title: "Digital Rebellion", date: "12 Oct", venue: "Neon Club" }
                ].map((event, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-lg">🎤</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">{event.title}</div>
                      <div className="text-gray-400 text-sm">{event.venue}</div>
                    </div>
                    <div className="text-primary-400 text-sm font-medium">{event.date}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}