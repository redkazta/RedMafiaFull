'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FiPlay, FiHeart, FiShare2, FiArrowRight } from 'react-icons/fi';

// Mock data
const featuredTracks = [
  {
    id: '1',
    title: 'Calles del Barrio',
    artist_name: 'El Mafioso',
    cover_art_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
    duration_seconds: 225,
    genre: 'Hip-Hop',
    play_count: 125000,
    like_count: 8900,
    is_explicit: true,
  },
  {
    id: '2',
    title: 'Flow de Reina',
    artist_name: 'Flow Queen',
    cover_art_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
    duration_seconds: 200,
    genre: 'Hip-Hop',
    play_count: 98000,
    like_count: 7200,
    is_explicit: false,
  },
  {
    id: '3',
    title: 'Beat del Maestro',
    artist_name: 'Beat Master',
    cover_art_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    duration_seconds: 255,
    genre: 'Hip-Hop',
    play_count: 156000,
    like_count: 11200,
    is_explicit: false,
  },
];

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function FeaturedMusic() {
  return (
    <section className="py-16 bg-gray-800/30">
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
            Música Destacada
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Los tracks más populares y recientes de nuestros artistas
          </p>
        </motion.div>

        {/* Tracks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredTracks.map((track, index) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="card hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-500/10 transition-all duration-300">
                {/* Track Cover */}
                <div className="relative mb-6">
                  <div className="aspect-square rounded-xl overflow-hidden bg-gray-700">
                    <Image
                      src={track.cover_art_url}
                      alt={track.title}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  {/* Explicit Badge */}
                  {track.is_explicit && (
                    <div className="absolute top-3 left-3 px-2 py-1 bg-gray-900/80 text-white text-xs font-bold rounded">
                      E
                    </div>
                  )}

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-xl">
                    <button className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
                      <FiPlay className="w-8 h-8 text-white ml-1" />
                    </button>
                  </div>

                  {/* Duration */}
                  <div className="absolute bottom-3 right-3 px-2 py-1 bg-gray-900/80 text-white text-xs rounded">
                    {formatDuration(track.duration_seconds)}
                  </div>
                </div>

                {/* Track Info */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary-400 transition-colors">
                      {track.title}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {track.artist_name}
                    </p>
                  </div>

                  {/* Genre */}
                  <div>
                    <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
                      {track.genre}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <FiPlay className="w-4 h-4" />
                      <span>{track.play_count.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FiHeart className="w-4 h-4" />
                      <span>{track.like_count.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button className="flex-1 btn-primary text-sm py-2">
                      <FiPlay className="w-4 h-4 mr-2" />
                      Reproducir
                    </button>
                    <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                      <FiHeart className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                      <FiShare2 className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
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
            href="/music"
            className="inline-flex items-center space-x-2 btn-secondary"
          >
            <span>Explorar Toda la Música</span>
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}