'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FiUsers, FiPlay, FiArrowRight } from 'react-icons/fi';

// Mock data - En producción esto vendría de Supabase
const featuredArtists = [
  {
    id: '1',
    stage_name: 'El Mafioso',
    bio: 'El rey del hip-hop underground, conocido por sus letras crudas y beats pesados.',
    avatar_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
    followers_count: 15000,
    monthly_listeners: 25000,
    genres: ['Hip-Hop', 'Rap'],
    is_verified: true,
  },
  {
    id: '2',
    stage_name: 'Flow Queen',
    bio: 'La voz femenina más poderosa del rap latino, rompiendo barreras.',
    avatar_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
    followers_count: 9800,
    monthly_listeners: 18000,
    genres: ['Hip-Hop', 'R&B'],
    is_verified: true,
  },
  {
    id: '3',
    stage_name: 'Beat Master',
    bio: 'Productor musical que ha creado hits para los mejores artistas.',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    followers_count: 7500,
    monthly_listeners: 32000,
    genres: ['Hip-Hop', 'Electronic'],
    is_verified: false,
  },
];

export function FeaturedArtists() {
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
            Artistas Destacados
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Descubre los talentos más prometedores de la escena musical urbana
          </p>
        </motion.div>

        {/* Artists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredArtists.map((artist, index) => (
            <motion.div
              key={artist.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Link href={`/artists/${artist.id}`}>
                <div className="card hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-500/10 transition-all duration-300">
                  {/* Artist Image */}
                  <div className="relative mb-6">
                    <div className="aspect-square rounded-xl overflow-hidden bg-gray-700">
                      <Image
                        src={artist.avatar_url}
                        alt={artist.stage_name}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    
                    {/* Verified Badge */}
                    {artist.is_verified && (
                      <div className="absolute top-3 right-3 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-xl">
                      <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                        <FiPlay className="w-6 h-6 text-white ml-1" />
                      </div>
                    </div>
                  </div>

                  {/* Artist Info */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">
                        {artist.stage_name}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {artist.bio}
                      </p>
                    </div>

                    {/* Genres */}
                    <div className="flex flex-wrap gap-2">
                      {artist.genres.map((genre) => (
                        <span
                          key={genre}
                          className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <FiUsers className="w-4 h-4" />
                        <span>{artist.followers_count.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FiPlay className="w-4 h-4" />
                        <span>{artist.monthly_listeners.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}/mes</span>
                      </div>
                    </div>
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
            href="/artists"
            className="inline-flex items-center space-x-2 btn-secondary"
          >
            <span>Ver Todos los Artistas</span>
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}