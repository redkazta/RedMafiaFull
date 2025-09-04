'use client';

import { Suspense, useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { FiCalendar, FiMapPin, FiClock, FiUsers, FiStar, FiMusic, FiCreditCard, FiTrendingUp } from 'react-icons/fi';

export default function EventosPage() {
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number}>>([]);
  
  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1
    }));
    setParticles(newParticles);
  }, []);

  const events = [
    {
      id: 1,
      title: "Noche Cyberpunk",
      artist: "MC Phantom & Cyber Beats",
      date: "15 Sep 2024",
      time: "21:00 - 03:00",
      venue: "Club Underground GDL",
      price: 500,
      capacity: 300,
      sold: 180,
      category: "Concierto",
      genre: "Hip-Hop/Cyberpunk",
      featured: true
    },
    {
      id: 2,
      title: "Red Mafia Showcase",
      artist: "Varios Artistas",
      date: "22 Sep 2024",
      time: "20:00 - 02:00",
      venue: "Warehouse 47",
      price: 350,
      capacity: 500,
      sold: 120,
      category: "Festival",
      genre: "Hip-Hop/Trap"
    },
    {
      id: 3,
      title: "Neon Dreams Live",
      artist: "Neon Samurai",
      date: "28 Sep 2024",
      time: "22:00 - 01:00",
      venue: "Rooftop Sessions",
      price: 400,
      capacity: 150,
      sold: 95,
      category: "Concierto",
      genre: "Electronic/Hip-Hop"
    },
    {
      id: 4,
      title: "Underground Battle",
      artist: "Competencia Abierta",
      date: "5 Oct 2024",
      time: "19:00 - 24:00",
      venue: "Street Arena",
      price: 200,
      capacity: 400,
      sold: 250,
      category: "Batalla",
      genre: "Freestyle/Rap"
    },
    {
      id: 5,
      title: "Digital Rebellion",
      artist: "Code Breaker & Electric Storm",
      date: "12 Oct 2024",
      time: "21:30 - 03:30",
      venue: "Neon Club",
      price: 450,
      capacity: 250,
      sold: 80,
      category: "Concierto",
      genre: "Cyberpunk/Electronic"
    },
    {
      id: 6,
      title: "Mafia Reunion",
      artist: "Red Shadow & Dark Phoenix",
      date: "19 Oct 2024",
      time: "20:30 - 02:30",
      venue: "Secret Location",
      price: 600,
      capacity: 100,
      sold: 45,
      category: "Exclusivo",
      genre: "Hip-Hop/Trap"
    }
  ];

  const featuredEvent = events.find(e => e.featured) || events[0];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/10 via-transparent to-accent-900/10"></div>
        
        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-12 h-full">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="border-r border-primary-500/20 animate-pulse" style={{animationDelay: `${i * 0.1}s`}}></div>
            ))}
          </div>
        </div>
        
        {/* Floating Particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-accent-400/30 animate-bounce"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDelay: `${particle.id * 0.2}s`,
              animationDuration: `${4 + Math.random() * 3}s`
            }}
          />
        ))}
        
        {/* Glowing Orbs */}
        <div className="absolute top-1/3 left-1/5 w-80 h-80 bg-primary-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/5 w-80 h-80 bg-accent-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '3s'}}></div>
      </div>
      
      <Header />
      
      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="relative py-20">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-6">
                <span className="bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 bg-clip-text text-transparent animate-pulse">
                  Eventos Épicos
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Vive la experiencia más intensa en los eventos más exclusivos de la escena underground.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
                {[
                  { label: "Eventos este mes", value: "12", icon: FiCalendar },
                  { label: "Artistas confirmados", value: "25+", icon: FiMusic },
                  { label: "Boletos vendidos", value: "1.2K", icon: FiCreditCard },
                  { label: "Satisfacción", value: "98%", icon: FiStar }
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

        {/* Events Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <Suspense fallback={<LoadingSpinner />}>
              {/* Featured Event */}
              <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl overflow-hidden mb-12 border border-primary-500/30 shadow-2xl shadow-primary-500/10">
                <div className="relative aspect-video bg-gradient-to-br from-primary-500/40 to-accent-500/40 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-accent-500/20 animate-pulse"></div>
                  <div className="text-8xl relative z-10 filter drop-shadow-lg">🎤</div>
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                    FEATURED
                  </div>
                  {/* Animated border */}
                  <div className="absolute inset-0 border-2 border-primary-400/30 animate-pulse"></div>
                </div>
                
                <div className="p-8">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm border border-primary-500/30">
                      {featuredEvent.category}
                    </span>
                    <span className="px-3 py-1 bg-accent-500/20 text-accent-400 rounded-full text-sm border border-accent-500/30">
                      {featuredEvent.genre}
                    </span>
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm border border-green-500/30 flex items-center gap-1">
                      <FiTrendingUp className="w-3 h-3" />
                      Trending
                    </span>
                  </div>
                  
                  <h2 className="text-4xl font-bold text-white mb-2">{featuredEvent.title}</h2>
                  <p className="text-xl text-primary-400 mb-4">{featuredEvent.artist}</p>
                  <p className="text-gray-300 mb-6">
                    La noche más épica del año con los mejores artistas de la Red Mafia. 
                    Prepárate para una experiencia que jamás olvidarás en el corazón del underground de Guadalajara.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="flex items-center space-x-2 text-gray-300 bg-gray-800/30 p-3 rounded-lg">
                      <FiCalendar className="w-5 h-5 text-primary-400" />
                      <span>{featuredEvent.date}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-300 bg-gray-800/30 p-3 rounded-lg">
                      <FiClock className="w-5 h-5 text-primary-400" />
                      <span>{featuredEvent.time}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-300 bg-gray-800/30 p-3 rounded-lg">
                      <FiMapPin className="w-5 h-5 text-primary-400" />
                      <span>{featuredEvent.venue}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-300 bg-gray-800/30 p-3 rounded-lg">
                      <FiUsers className="w-5 h-5 text-primary-400" />
                      <span>{featuredEvent.sold}/{featuredEvent.capacity}</span>
                    </div>
                  </div>
                  
                  {/* Availability Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                      <span>Disponibilidad</span>
                      <span>{Math.round((featuredEvent.sold / featuredEvent.capacity) * 100)}% vendido</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-yellow-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${(featuredEvent.sold / featuredEvent.capacity) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4">
                    <button 
                      onClick={() => setSelectedEvent(featuredEvent.id)}
                      className="px-8 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:from-primary-600 hover:to-accent-600 transition-all duration-300 font-semibold shadow-lg shadow-primary-500/30"
                    >
                      Comprar Boletos - {featuredEvent.price} Tokens
                    </button>
                    <button className="px-8 py-3 bg-gray-700/50 text-white rounded-lg hover:bg-gray-600/50 transition-colors border border-gray-600/50">
                      Más Información
                    </button>
                    <button className="px-8 py-3 bg-gray-700/50 text-white rounded-lg hover:bg-gray-600/50 transition-colors border border-gray-600/50">
                      Compartir Evento
                    </button>
                  </div>
                </div>
              </div>

              {/* Upcoming Events */}
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-white">Próximos Eventos</h3>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-primary-500/20 text-primary-400 rounded-lg hover:bg-primary-500/30 transition-colors text-sm border border-primary-500/30">
                      Todos
                    </button>
                    <button className="px-4 py-2 bg-gray-700/50 text-gray-400 rounded-lg hover:bg-gray-600/50 transition-colors text-sm">
                      Conciertos
                    </button>
                    <button className="px-4 py-2 bg-gray-700/50 text-gray-400 rounded-lg hover:bg-gray-600/50 transition-colors text-sm">
                      Batallas
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.filter(e => !e.featured).map((event) => (
                    <div 
                      key={event.id} 
                      className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-primary-500/40 transition-all duration-300 group cursor-pointer"
                      onClick={() => setSelectedEvent(event.id)}
                    >
                      <div className="relative aspect-video bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center overflow-hidden">
                        <div className="text-4xl">🎵</div>
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-accent-500/10 group-hover:from-primary-500/20 group-hover:to-accent-500/20 transition-all duration-300"></div>
                        {event.sold / event.capacity > 0.8 && (
                          <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold">
                            CASI AGOTADO
                          </div>
                        )}
                      </div>
                      
                      <div className="p-6">
                        <div className="flex gap-2 mb-3">
                          <span className="px-2 py-1 bg-primary-500/20 text-primary-400 rounded text-xs border border-primary-500/30">
                            {event.category}
                          </span>
                          <span className="px-2 py-1 bg-accent-500/20 text-accent-400 rounded text-xs border border-accent-500/30">
                            {event.genre.split('/')[0]}
                          </span>
                        </div>
                        
                        <h4 className="text-lg font-bold text-white mb-1 group-hover:text-primary-400 transition-colors">
                          {event.title}
                        </h4>
                        <p className="text-sm text-primary-400 mb-3">{event.artist}</p>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center space-x-2 text-sm text-gray-400">
                            <FiCalendar className="w-4 h-4" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-400">
                            <FiMapPin className="w-4 h-4" />
                            <span>{event.venue}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-400">
                            <FiUsers className="w-4 h-4" />
                            <span>{event.sold}/{event.capacity} personas</span>
                          </div>
                        </div>
                        
                        {/* Mini availability bar */}
                        <div className="mb-4">
                          <div className="w-full bg-gray-700 rounded-full h-1">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-yellow-500 h-1 rounded-full"
                              style={{ width: `${(event.sold / event.capacity) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-primary-400 font-semibold text-lg">{event.price} Tokens</span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEvent(event.id);
                            }}
                            className="px-4 py-2 bg-primary-500/20 text-primary-400 rounded-lg hover:bg-primary-500/30 transition-colors text-sm border border-primary-500/30"
                          >
                            Comprar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Ticket Purchase Modal */}
              {selectedEvent && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 max-w-md w-full border border-primary-500/30 shadow-2xl">
                    {(() => {
                      const event = events.find(e => e.id === selectedEvent);
                      if (!event) return null;
                      
                      return (
                        <>
                          <h3 className="text-2xl font-bold text-white mb-4">{event.title}</h3>
                          <p className="text-primary-400 mb-6">{event.artist}</p>
                          
                          <div className="space-y-4 mb-6">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Fecha:</span>
                              <span className="text-white">{event.date}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Lugar:</span>
                              <span className="text-white">{event.venue}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Precio por boleto:</span>
                              <span className="text-primary-400 font-bold">{event.price} Tokens</span>
                            </div>
                          </div>
                          
                          <div className="mb-6">
                            <label className="block text-gray-400 mb-2">Cantidad de boletos:</label>
                            <div className="flex items-center gap-4">
                              <button 
                                onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                                className="w-10 h-10 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                              >
                                -
                              </button>
                              <span className="text-2xl font-bold text-white w-12 text-center">{ticketQuantity}</span>
                              <button 
                                onClick={() => setTicketQuantity(Math.min(5, ticketQuantity + 1))}
                                className="w-10 h-10 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          
                          <div className="border-t border-gray-700 pt-4 mb-6">
                            <div className="flex justify-between text-xl font-bold">
                              <span className="text-white">Total:</span>
                              <span className="text-primary-400">{event.price * ticketQuantity} Tokens</span>
                            </div>
                          </div>
                          
                          <div className="flex gap-4">
                            <button 
                              onClick={() => setSelectedEvent(null)}
                              className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                            >
                              Cancelar
                            </button>
                            <button className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:from-primary-600 hover:to-accent-600 transition-all duration-300 font-semibold">
                              Confirmar Compra
                            </button>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}
            </Suspense>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}