'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiPlay, FiMusic, FiUsers, FiCalendar } from 'react-icons/fi';
import { useState, useEffect } from 'react';

export function HeroSection() {
  const [particles, setParticles] = useState<Array<{left: number, top: number, duration: number, delay: number}>>([]);

  useEffect(() => {
    // Generar partículas solo en el cliente
    const newParticles = [...Array(20)].map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 2,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Multi-layer Oriental Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/20 via-transparent to-accent-900/20"></div>
      <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-primary-800/10 to-transparent"></div>
      
      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(239, 68, 68, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(239, 68, 68, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Glowing Orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-radial from-primary-500/30 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-radial from-accent-500/20 to-transparent rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary-600/10 to-transparent rounded-full blur-3xl"></div>
      
      {/* Floating Particles with Neon Effect */}
      <div className="absolute inset-0">
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              width: i % 3 === 0 ? '4px' : '2px',
              height: i % 3 === 0 ? '4px' : '2px',
              background: i % 4 === 0 
                ? 'linear-gradient(45deg, #ef4444, #f97316)' 
                : i % 4 === 1 
                ? 'linear-gradient(45deg, #f97316, #eab308)'
                : i % 4 === 2
                ? 'linear-gradient(45deg, #ef4444, #ec4899)'
                : 'linear-gradient(45deg, #8b5cf6, #ef4444)',
              boxShadow: i % 3 === 0 
                ? '0 0 20px rgba(239, 68, 68, 0.8), 0 0 40px rgba(239, 68, 68, 0.4)' 
                : '0 0 10px rgba(249, 115, 22, 0.6)'
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.sin(i) * 20, 0],
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Animated Lines - Centered with Logo */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent"
          animate={{ scaleX: [0, 1, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 0 }}
        />
        <motion.div
          className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent-500/50 to-transparent"
          animate={{ scaleX: [0, 1, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 2 }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center -mt-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Main Logo with Neon Effect */}
          <motion.div
            className="-mt-16 mb-4 relative flex justify-center"
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, type: "spring", stiffness: 100 }}
          >
            <div className="relative">
              <img
                src="/redmafialogo.png"
                alt="LA RED MAFIA"
                className="h-32 md:h-40 lg:h-52 w-auto object-contain"
                style={{
                  filter: 'drop-shadow(0 0 60px rgba(239, 68, 68, 0.4)) drop-shadow(0 0 120px rgba(239, 68, 68, 0.2)) drop-shadow(0 0 180px rgba(239, 68, 68, 0.1))'
                }}
              />
              {/* Glowing border effect - más grande y difuminado */}
              <div
                className="absolute inset-0 rounded-lg"
                style={{
                  background: 'linear-gradient(45deg, rgba(239, 68, 68, 0.2), rgba(249, 115, 22, 0.2))',
                  filter: 'blur(40px)',
                  transform: 'scale(1.5)',
                  zIndex: -1
                }}
              />
            </div>
          </motion.div>


          {/* CTA Buttons with Neon Effects */}
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/musica"
                className="relative group text-lg px-10 py-5 flex items-center space-x-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-full font-semibold overflow-hidden transition-all duration-300"
                style={{
                  boxShadow: '0 0 30px rgba(239, 68, 68, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <FiPlay className="w-6 h-6 relative z-10" />
                <span className="relative z-10">Explorar Música</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/registro"
                className="relative group text-lg px-10 py-5 bg-transparent border-2 border-primary-500 text-primary-400 rounded-full font-semibold hover:bg-primary-500/10 transition-all duration-300"
                style={{
                  boxShadow: '0 0 20px rgba(239, 68, 68, 0.3)'
                }}
              >
                <span className="relative z-10">Únete Ahora</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-accent-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats with Cyberpunk Cards */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {[
              { icon: FiUsers, number: "50+", label: "Artistas", color: "primary" },
              { icon: FiMusic, number: "200+", label: "Tracks", color: "accent" },
              { icon: FiCalendar, number: "25+", label: "Eventos", color: "primary" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="relative group text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div 
                  className="relative p-8 bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 backdrop-blur-sm rounded-2xl border border-primary-500/30 overflow-hidden"
                  style={{
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(239, 68, 68, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}
                >
                  {/* Animated border */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 via-accent-500/20 to-primary-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Icon with glow */}
                  <div className="relative flex items-center justify-center w-16 h-16 mx-auto mb-4">
                    <div 
                      className={`absolute inset-0 bg-gradient-to-br ${stat.color === 'primary' ? 'from-primary-500/30 to-primary-600/30' : 'from-accent-500/30 to-accent-600/30'} rounded-xl blur-lg`}
                    ></div>
                    <div 
                      className={`relative flex items-center justify-center w-16 h-16 bg-gradient-to-br ${stat.color === 'primary' ? 'from-primary-500/20 to-primary-600/20' : 'from-accent-500/20 to-accent-600/20'} rounded-xl border ${stat.color === 'primary' ? 'border-primary-500/40' : 'border-accent-500/40'}`}
                      style={{
                        boxShadow: `0 0 20px ${stat.color === 'primary' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(249, 115, 22, 0.3)'}`
                      }}
                    >
                      <stat.icon className={`w-8 h-8 ${stat.color === 'primary' ? 'text-primary-400' : 'text-accent-400'}`} />
                    </div>
                  </div>
                  
                  {/* Number with glow */}
                  <div 
                    className={`text-4xl font-bold mb-2 bg-gradient-to-r ${stat.color === 'primary' ? 'from-primary-300 to-primary-500' : 'from-accent-300 to-accent-500'} bg-clip-text text-transparent`}
                    style={{
                      textShadow: `0 0 20px ${stat.color === 'primary' ? 'rgba(239, 68, 68, 0.5)' : 'rgba(249, 115, 22, 0.5)'}`
                    }}
                  >
                    {stat.number}
                  </div>
                  
                  {/* Label */}
                  <div className="text-gray-300 font-medium tracking-wide">{stat.label}</div>
                  
                  {/* Hover effect line */}
                  <motion.div 
                    className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${stat.color === 'primary' ? 'from-primary-500 to-primary-400' : 'from-accent-500 to-accent-400'}`}
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Cyberpunk Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="text-xs text-gray-400 mb-2 tracking-widest">SCROLL</div>
        <div 
          className="w-6 h-12 border-2 border-primary-500/60 rounded-full flex justify-center relative overflow-hidden"
          style={{
            boxShadow: '0 0 20px rgba(239, 68, 68, 0.3), inset 0 0 20px rgba(239, 68, 68, 0.1)'
          }}
        >
          <motion.div 
            className="w-1 h-4 bg-gradient-to-b from-primary-400 to-primary-600 rounded-full mt-2"
            animate={{ 
              y: [0, 8, 0],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              boxShadow: '0 0 10px rgba(239, 68, 68, 0.8)'
            }}
          />
        </div>
      </motion.div>
    </section>
  );
}