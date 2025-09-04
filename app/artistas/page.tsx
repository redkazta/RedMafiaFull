'use client';

import { Suspense, useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { FiPlay, FiHeart, FiUsers, FiMusic, FiCalendar, FiTrendingUp, FiStar, FiInstagram, FiTwitter } from 'react-icons/fi';

export default function ArtistasPage() {
  const [selectedArtist, setSelectedArtist] = useState<number | null>(null);
  const [filter, setFilter] = useState('all');
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number}>>([]);
  
  useEffect(() => {
    const newParticles = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1
    }));
    setParticles(newParticles);
  }, []);

  const artists = [
    {
      id: 1,
      name: "MC Phantom",
      genre: "Hip-Hop/Cyberpunk",
      followers: 15420,
      tracks: 45,
      rating: 4.9,
      status: "trending",
      bio: "El fantasma del underground. Sus letras cortan como cuchillas en la oscuridad digital de Guadalajara.",
      nextEvent: "Noche Cyberpunk - 15 Sep",
      topTrack: "Calles de Fuego",
      featured: true
    },
    {
      id: 2,
      name: "Cyber Beats",
      genre: "Electronic/Hip-Hop",
      followers: 12800,
      tracks: 38,
      rating: 4.8,
      status: "active",
      bio: "Productor visionario que fusiona beats electrónicos con la esencia del rap callejero.",
      nextEvent: "Digital Rebellion - 12 Oct",
      topTrack: "Neon Dreams"
    },
    {
      id: 3,
      name: "Red Shadow",
      genre: "Hip-Hop/Trap",
      followers: 18900,
      tracks: 52,
      rating: 4.9,
      status: "trending",
      bio: "La sombra roja que domina las calles. Su flow es leyenda en el underground tapatío.",
      nextEvent: "Mafia Reunion - 19 Oct",
      topTrack: "Mafia Code"
    },
    {
      id: 4,
      name: "Neon Samurai",
      genre: "Electronic/Hip-Hop",
      followers: 9650,
      tracks: 28,
      rating: 4.7,
      status: "active",
      bio: "Guerrero digital del futuro. Sus beats transportan a un Tokio cyberpunk en pleno Guadalajara.",
      nextEvent: "Neon Dreams Live - 28 Sep",
      topTrack: "Tokyo Nights"
    },
    {
      id: 5,
      name: "Street Prophet",
      genre: "Hip-Hop/Conscious",
      followers: 11200,
      tracks: 41,
      rating: 4.8,
      status: "active",
      bio: "Profeta de las calles que predica verdades urbanas con cada verso que escupe.",
      nextEvent: "Underground Showcase - 22 Sep",
      topTrack: "Guadalajara Rising"
    },
    {
      id: 6,
      name: "Dark Phoenix",
      genre: "Hip-Hop/Trap",
      followers: 14300,
      tracks: 35,
      rating: 4.6,
      status: "rising",
      bio: "Renace de las cenizas del underground para conquistar la escena con su estilo único.",
      nextEvent: "Mafia Reunion - 19 Oct",
      topTrack: "Blood Moon"
    }
  ];

  const filteredArtists = filter === 'all' 
    ? artists 
    : artists.filter(artist => 
        filter === 'trending' ? artist.status === 'trending' :
        filter === 'hip-hop' ? artist.genre.includes('Hip-Hop') :
        filter === 'electronic' ? artist.genre.includes('Electronic') :
        artist.genre.toLowerCase().includes(filter)
      );

  const featuredArtist = artists.find(a => a.featured) || artists[0];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/10 via-transparent to-accent-900/10"></div>
        
        {/* Hexagonal Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hexagons" x="0" y="0" width="50" height="43.4" patternUnits="userSpaceOnUse">
                <polygon points="25,2 45,15 45,35 25,48 5,35 5,15" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hexagons)" className="text-primary-500"/>
          </svg>
        </div>
        
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
              animationDelay: `${particle.id * 0.15}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
        
        {/* Glowing Orbs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      
      <Header />
      
      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="relative py-20">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-6">
                <span className="bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 bg-clip-text text-transparent animate-pulse">
                  Nuestros Artistas
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                Descubre el talento más épico de Guadalajara. Cada artista tiene su propia historia y sonido único.
              </p>
              
              {/* Filter Buttons */}
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                {[
                  { key: 'all', label: 'Todos', icon: FiUsers },
                  { key: 'trending', label: 'Trending', icon: FiTrendingUp },
                  { key: 'hip-hop', label: 'Hip-Hop', icon: FiMusic },
                  { key: 'electronic', label: 'Electronic', icon: FiPlay }
                ].map((filterOption) => (
                  <button
                    key={filterOption.key}
                    onClick={() => setFilter(filterOption.key)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 ${
                      filter === filterOption.key
                        ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/30'
                        : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white border border-gray-700/50'
                    }`}
                  >
                    <filterOption.icon className="w-4 h-4" />
                    {filterOption.label}
                  </button>
                ))}
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                {[
                  { label: "Artistas activos", value: "25+", icon: FiUsers },
                  { label: "Tracks totales", value: "300+", icon: FiMusic },
                  { label: "Seguidores", value: "50K+", icon: FiHeart },
                  { label: "Rating promedio", value: "4.8★", icon: FiStar }
                ].map((stat, i) => (
                  <div key={i} className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-primary-500/20">
                    <stat.icon className="w-6 h-6 text-primary-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Artist */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Suspense fallback={<LoadingSpinner />}>
              <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-primary-500/30 shadow-2xl shadow-primary-500/10">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  {/* Artist Avatar */}
                  <div className="relative group">
                    <div className="w-48 h-48 bg-gradient-to-br from-primary-500/40 to-accent-500/40 rounded-full flex items-center justify-center relative overflow-hidden border-4 border-primary-500/30">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-accent-500/20 animate-pulse"></div>
                      <div className="text-8xl relative z-10 filter drop-shadow-lg">🎤</div>
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                        FEATURED
                      </div>
                    </div>
                  </div>
                  
                  {/* Artist Info */}
                  <div className="flex-1 text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                      <h2 className="text-4xl font-bold text-white">{featuredArtist.name}</h2>
                      {featuredArtist.status === 'trending' && (
                        <FiTrendingUp className="w-6 h-6 text-green-400" />
                      )}
                    </div>
                    <p className="text-xl text-primary-400 mb-2">{featuredArtist.genre}</p>
                    <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <FiStar className="w-4 h-4 text-yellow-400" />
                        <span className="text-white">{featuredArtist.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiUsers className="w-4 h-4 text-primary-400" />
                        <span className="text-white">{featuredArtist.followers.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiMusic className="w-4 h-4 text-accent-400" />
                        <span className="text-white">{featuredArtist.tracks} tracks</span>
                      </div>
                    </div>
                    <p className="text-gray-300 mb-6 max-w-2xl">{featuredArtist.bio}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-800/50 p-4 rounded-lg">
                        <div className="text-sm text-gray-400 mb-1">Próximo Evento</div>
                        <div className="text-white font-medium">{featuredArtist.nextEvent}</div>
                      </div>
                      <div className="bg-gray-800/50 p-4 rounded-lg">
                        <div className="text-sm text-gray-400 mb-1">Track Más Popular</div>
                        <div className="text-white font-medium">{featuredArtist.topTrack}</div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                      <button 
                        onClick={() => setSelectedArtist(featuredArtist.id)}
                        className="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:from-primary-600 hover:to-accent-600 transition-all duration-300 font-semibold shadow-lg shadow-primary-500/30"
                      >
                        Ver Perfil Completo
                      </button>
                      <button className="px-6 py-3 bg-gray-700/50 text-white rounded-lg hover:bg-gray-600/50 transition-colors border border-gray-600/50">
                        Reproducir Top Track
                      </button>
                      <button className="px-6 py-3 bg-gray-700/50 text-white rounded-lg hover:bg-gray-600/50 transition-colors border border-gray-600/50">
                        Seguir Artista
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Suspense>
          </div>
        </section>

        {/* Artists Grid */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <Suspense fallback={<LoadingSpinner />}>
              <h3 className="text-2xl font-bold text-white mb-8">
                {filter === 'all' ? 'Todos los Artistas' : 
                 filter === 'trending' ? 'Artistas Trending' :
                 filter === 'hip-hop' ? 'Artistas Hip-Hop' :
                 filter === 'electronic' ? 'Artistas Electronic' : 'Artistas'}
                <span className="text-primary-400 ml-2">({filteredArtists.length})</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredArtists.filter(a => !a.featured).map((artist) => (
                  <div 
                    key={artist.id} 
                    className="group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-primary-500/40 transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedArtist(artist.id)}
                  >
                    <div className="relative aspect-square bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center overflow-hidden">
                      <div className="text-6xl text-primary-400/70">🎤</div>
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-accent-500/10 group-hover:from-primary-500/20 group-hover:to-accent-500/20 transition-all duration-300"></div>
                      
                      {/* Status Badge */}
                      {artist.status === 'trending' && (
                        <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <FiTrendingUp className="w-3 h-3" />
                          TRENDING
                        </div>
                      )}
                      {artist.status === 'rising' && (
                        <div className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          RISING
                        </div>
                      )}
                      
                      {/* Hover Play Button */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button className="w-16 h-16 bg-primary-500/80 rounded-full flex items-center justify-center text-white hover:bg-primary-500 transition-colors">
                          <FiPlay className="w-6 h-6 ml-1" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">
                          {artist.name}
                        </h3>
                        <div className="flex items-center gap-1">
                          <FiStar className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm text-white">{artist.rating}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-400 mb-4">{artist.genre}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-1 text-gray-400">
                          <FiUsers className="w-4 h-4" />
                          <span>{artist.followers.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400">
                          <FiMusic className="w-4 h-4" />
                          <span>{artist.tracks} tracks</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-primary-400">
                          {artist.nextEvent.split(' - ')[0]}
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedArtist(artist.id);
                          }}
                          className="px-4 py-2 bg-primary-500/20 text-primary-400 rounded-lg hover:bg-primary-500/30 transition-colors border border-primary-500/30"
                        >
                          Ver Perfil
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Suspense>
          </div>
        </section>
        
        {/* Artist Profile Modal */}
        {selectedArtist && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-primary-500/30 shadow-2xl">
              {(() => {
                const artist = artists.find(a => a.id === selectedArtist);
                if (!artist) return null;
                
                return (
                  <>
                    <div className="flex items-start gap-6 mb-6">
                      <div className="w-24 h-24 bg-gradient-to-br from-primary-500/40 to-accent-500/40 rounded-full flex items-center justify-center">
                        <div className="text-4xl">🎤</div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-3xl font-bold text-white">{artist.name}</h3>
                          {artist.status === 'trending' && (
                            <FiTrendingUp className="w-5 h-5 text-green-400" />
                          )}
                        </div>
                        <p className="text-primary-400 text-lg mb-2">{artist.genre}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <FiStar className="w-4 h-4 text-yellow-400" />
                            <span>{artist.rating} rating</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FiUsers className="w-4 h-4" />
                            <span>{artist.followers.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} seguidores</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FiMusic className="w-4 h-4" />
                            <span>{artist.tracks} tracks</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="text-lg font-bold text-white mb-2">Biografía</h4>
                      <p className="text-gray-300">{artist.bio}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-800/50 p-4 rounded-lg">
                        <h5 className="text-white font-medium mb-1">Próximo Evento</h5>
                        <p className="text-primary-400">{artist.nextEvent}</p>
                      </div>
                      <div className="bg-gray-800/50 p-4 rounded-lg">
                        <h5 className="text-white font-medium mb-1">Track Más Popular</h5>
                        <p className="text-accent-400">{artist.topTrack}</p>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="text-lg font-bold text-white mb-4">Redes Sociales</h4>
                      <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-4 py-2 bg-pink-500/20 text-pink-400 rounded-lg hover:bg-pink-500/30 transition-colors border border-pink-500/30">
                          <FiInstagram className="w-4 h-4" />
                          Instagram
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors border border-blue-500/30">
                          <FiTwitter className="w-4 h-4" />
                          Twitter
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <button 
                        onClick={() => setSelectedArtist(null)}
                        className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        Cerrar
                      </button>
                      <button className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:from-primary-600 hover:to-accent-600 transition-all duration-300 font-semibold">
                        Seguir Artista
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}