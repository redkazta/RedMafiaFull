'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FiCalendar, FiMapPin, FiClock, FiUsers, FiArrowRight } from 'react-icons/fi';

// Mock data
const upcomingEvents = [
  {
    id: '1',
    title: 'Hip-Hop Underground Night',
    description: 'Noche de hip-hop underground con los mejores artistas del género.',
    banner_image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600',
    start_date: '2024-12-15T21:00:00Z',
    venue_name: 'Club Underground',
    city: 'CDMX',
    ticket_price_tokens: 3000, // 15 MXN
    available_tickets: 150,
    max_capacity: 200,
    event_type: 'concert',
    is_featured: true,
  },
  {
    id: '2',
    title: 'Flow Queen en Vivo',
    description: 'La Reina del Flow presenta su nuevo álbum en un show espectacular.',
    banner_image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600',
    start_date: '2024-12-20T20:30:00Z',
    venue_name: 'Auditorio Nacional',
    city: 'CDMX',
    ticket_price_tokens: 6000, // 30 MXN
    available_tickets: 200,
    max_capacity: 1000,
    event_type: 'concert',
    is_featured: true,
  },
  {
    id: '3',
    title: 'Batalla de Freestyle',
    description: 'Competencia de freestyle con premios en efectivo.',
    banner_image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600',
    start_date: '2024-12-25T19:00:00Z',
    venue_name: 'Plaza del Barrio',
    city: 'Guadalajara',
    ticket_price_tokens: 1000, // 5 MXN
    available_tickets: 50,
    max_capacity: 150,
    event_type: 'competition',
    is_featured: false,
  },
];

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-MX', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatPrice(tokens: number): string {
  const mxn = tokens / 200; // 200 tokens = 1 MXN
  return `${tokens.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} tokens (${mxn.toFixed(0)} MXN)`;
}

export function UpcomingEvents() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Próximos Eventos
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            No te pierdas los eventos más esperados de la escena musical
          </p>
        </motion.div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
          {upcomingEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Link href={`/events/${event.id}`}>
                <div className="card hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-500/10 transition-all duration-300">
                  {/* Event Banner */}
                  <div className="relative mb-6">
                    <div className="aspect-video rounded-xl overflow-hidden bg-gray-700">
                      <Image
                        src={event.banner_image_url}
                        alt={event.title}
                        width={600}
                        height={400}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    
                    {/* Featured Badge */}
                    {event.is_featured && (
                      <div className="absolute top-3 left-3 px-3 py-1 bg-primary-500 text-white text-xs font-bold rounded-full">
                        Destacado
                      </div>
                    )}

                    {/* Event Type */}
                    <div className="absolute top-3 right-3 px-3 py-1 bg-gray-900/80 text-white text-xs font-medium rounded-full capitalize">
                      {event.event_type === 'concert' ? 'Concierto' : 
                       event.event_type === 'competition' ? 'Competencia' : event.event_type}
                    </div>
                  </div>

                  {/* Event Info */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {event.description}
                      </p>
                    </div>

                    {/* Date & Time */}
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <FiCalendar className="w-4 h-4" />
                        <span>{formatDate(event.start_date)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FiClock className="w-4 h-4" />
                        <span>{formatTime(event.start_date)}</span>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center space-x-1 text-sm text-gray-400">
                      <FiMapPin className="w-4 h-4" />
                      <span>{event.venue_name}, {event.city}</span>
                    </div>

                    {/* Availability */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1 text-gray-400">
                        <FiUsers className="w-4 h-4" />
                        <span>{event.available_tickets} disponibles</span>
                      </div>
                      <div className="text-primary-400 font-medium">
                        {formatPrice(event.ticket_price_tokens)}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${((event.max_capacity - event.available_tickets) / event.max_capacity) * 100}%`
                        }}
                      ></div>
                    </div>

                    {/* CTA Button */}
                    <button className="w-full btn-primary text-sm py-3">
                      Comprar Tickets
                    </button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            href="/events"
            className="inline-flex items-center space-x-2 btn-secondary"
          >
            <span>Ver Todos los Eventos</span>
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}