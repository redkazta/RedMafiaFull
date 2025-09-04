'use client';

import { Suspense, useState, useRef, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { FiPlay, FiPause, FiHeart, FiDownload, FiSkipBack, FiSkipForward, FiVolume2, FiShuffle, FiRepeat } from 'react-icons/fi';

export default function MusicaPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(75);
  const [progress, setProgress] = useState(0);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number}>>([]);
  
  useEffect(() => {
    // Generate animated particles
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1
    }));
    setParticles(newParticles);
  }, []);

  const tracks = [
    { id: 1, title: "Calles de Fuego", artist: "MC Phantom", duration: "3:45", album: "Underground Kings" },
    { id: 2, title: "Neon Dreams", artist: "Cyber Beats", duration: "4:12", album: "Digital Streets" },
    { id: 3, title: "Mafia Code", artist: "Red Shadow", duration: "3:28", album: "Blood & Beats" },
    { id: 4, title: "Tokyo Nights", artist: "Neon Samurai", duration: "4:01", album: "Eastern Flow" },
    { id: 5, title: "Guadalajara Rising", artist: "Street Prophet", duration: "3:55", album: "City Chronicles" },
    { id: 6, title: "Digital Rebellion", artist: "Code Breaker", duration: "4:33", album: "Cyber Revolution" },
    { id: 7, title: "Blood Moon", artist: "Dark Phoenix", duration: "3:17", album: "Midnight Sessions" },
    { id: 8, title: "Neon Pulse", artist: "Electric Storm", duration: "4:08", album: "Voltage" }
  ];

  const togglePlay = () => setIsPlaying(!isPlaying);
  const nextTrack = () => setCurrentTrack((prev) => (prev + 1) % tracks.length);
  const prevTrack = () => setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/10 via-transparent to-accent-900/10"></div>
        
        {/* Animated Particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-primary-400/20 animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDelay: `${particle.id * 0.1}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
        
        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      
      <Header />
      
      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="relative py-20">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-6">
                <span className="bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 bg-clip-text text-transparent animate-pulse">
                  Biblioteca Musical
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Explora los beats más duros y las letras más reales de la escena underground de Guadalajara.
              </p>
            </div>
          </div>
        </section>

        {/* Music Player Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <Suspense fallback={<LoadingSpinner />}>
              {/* Advanced Music Player */}
              <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-primary-500/30 shadow-2xl shadow-primary-500/10">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  {/* Album Art */}
                  <div className="relative group">
                    <div className="w-64 h-64 bg-gradient-to-br from-primary-500/40 to-accent-500/40 rounded-xl flex items-center justify-center relative overflow-hidden border border-primary-500/30">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-accent-500/20 animate-pulse"></div>
                      <div className="text-8xl relative z-10 filter drop-shadow-lg">🎵</div>
                      {isPlaying && (
                        <div className="absolute inset-0 border-4 border-primary-400/50 rounded-xl animate-spin" style={{animationDuration: '3s'}}></div>
                      )}
                    </div>
                  </div>
                  
                  {/* Track Info & Controls */}
                  <div className="flex-1 text-center lg:text-left">
                    <h2 className="text-4xl font-bold text-white mb-2">{tracks[currentTrack].title}</h2>
                    <p className="text-2xl text-primary-400 mb-2">{tracks[currentTrack].artist}</p>
                    <p className="text-lg text-gray-400 mb-6">{tracks[currentTrack].album}</p>
                    
                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>1:23</span>
                        <span>{tracks[currentTrack].duration}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-accent-500/20 animate-pulse"></div>
                        <div 
                          className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all duration-300 relative"
                          style={{ width: `${progress}%` }}
                        >
                          <div className="absolute right-0 top-0 w-4 h-4 bg-white rounded-full -mt-1 shadow-lg shadow-primary-500/50"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Main Controls */}
                    <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
                      <button className="p-3 text-gray-400 hover:text-primary-400 transition-colors">
                        <FiShuffle className="w-6 h-6" />
                      </button>
                      <button 
                        onClick={prevTrack}
                        className="p-3 text-white hover:text-primary-400 transition-colors"
                      >
                        <FiSkipBack className="w-8 h-8" />
                      </button>
                      <button 
                        onClick={togglePlay}
                        className="p-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-full hover:from-primary-600 hover:to-accent-600 transition-all duration-300 shadow-lg shadow-primary-500/30"
                      >
                        {isPlaying ? <FiPause className="w-8 h-8" /> : <FiPlay className="w-8 h-8 ml-1" />}
                      </button>
                      <button 
                        onClick={nextTrack}
                        className="p-3 text-white hover:text-primary-400 transition-colors"
                      >
                        <FiSkipForward className="w-8 h-8" />
                      </button>
                      <button className="p-3 text-gray-400 hover:text-primary-400 transition-colors">
                        <FiRepeat className="w-6 h-6" />
                      </button>
                    </div>
                    
                    {/* Secondary Controls */}
                    <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                      <button className="flex items-center space-x-2 px-6 py-3 bg-gray-700/50 text-white rounded-lg hover:bg-gray-600/50 transition-colors border border-gray-600/50">
                        <FiHeart className="w-5 h-5" />
                        <span>Me Gusta</span>
                      </button>
                      <button className="flex items-center space-x-2 px-6 py-3 bg-gray-700/50 text-white rounded-lg hover:bg-gray-600/50 transition-colors border border-gray-600/50">
                        <FiDownload className="w-5 h-5" />
                        <span>Descargar - 50 Tokens</span>
                      </button>
                      <div className="flex items-center space-x-2 px-4 py-3 bg-gray-700/50 rounded-lg border border-gray-600/50">
                        <FiVolume2 className="w-5 h-5 text-gray-400" />
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={volume}
                          onChange={(e) => setVolume(Number(e.target.value))}
                          className="w-20 accent-primary-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tracks List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">Últimos Lanzamientos</h3>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-primary-500/20 text-primary-400 rounded-lg hover:bg-primary-500/30 transition-colors text-sm border border-primary-500/30">
                      Todos
                    </button>
                    <button className="px-4 py-2 bg-gray-700/50 text-gray-400 rounded-lg hover:bg-gray-600/50 transition-colors text-sm">
                      Hip-Hop
                    </button>
                    <button className="px-4 py-2 bg-gray-700/50 text-gray-400 rounded-lg hover:bg-gray-600/50 transition-colors text-sm">
                      Trap
                    </button>
                  </div>
                </div>
                
                {tracks.map((track, i) => (
                  <div 
                    key={track.id} 
                    className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-300 group cursor-pointer ${
                      currentTrack === i 
                        ? 'bg-gradient-to-r from-primary-500/20 to-accent-500/20 border border-primary-500/40' 
                        : 'bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700/50'
                    }`}
                    onClick={() => setCurrentTrack(i)}
                  >
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (currentTrack === i) {
                          togglePlay();
                        } else {
                          setCurrentTrack(i);
                          setIsPlaying(true);
                        }
                      }}
                      className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 ${
                        currentTrack === i && isPlaying
                          ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                          : 'bg-primary-500/20 text-primary-400 group-hover:bg-primary-500/30'
                      }`}
                    >
                      {currentTrack === i && isPlaying ? (
                        <FiPause className="w-5 h-5" />
                      ) : (
                        <FiPlay className="w-5 h-5" />
                      )}
                    </button>
                    
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-lg flex items-center justify-center relative overflow-hidden">
                      <span className="text-lg">🎵</span>
                      {currentTrack === i && isPlaying && (
                        <div className="absolute inset-0 bg-primary-500/20 animate-pulse"></div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className={`font-medium transition-colors ${
                        currentTrack === i ? 'text-primary-400' : 'text-white group-hover:text-primary-400'
                      }`}>
                        {track.title}
                      </h4>
                      <p className="text-gray-400 text-sm">{track.artist} • {track.album}</p>
                    </div>
                    
                    <div className="text-gray-400 text-sm">{track.duration}</div>
                    
                    <button 
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <FiHeart className="w-5 h-5" />
                    </button>
                    
                    <button 
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 text-gray-400 hover:text-primary-400 transition-colors"
                    >
                      <FiDownload className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </Suspense>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}