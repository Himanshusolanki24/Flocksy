import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Logo from './Logo';

const Preloader = ({ onComplete }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onComplete, 800);
    }, 2800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #FAFDF7 0%, #F0F5ED 50%, #E8F0E5 100%)' }}
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      {/* Ambient orbs */}
      <motion.div
        className="absolute -top-24 -left-24 h-[400px] w-[400px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(168,213,181,0.25) 0%, transparent 70%)' }}
        animate={{
          scale: [1, 1.15, 1],
          x: [0, 30, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute -bottom-24 -right-24 h-[450px] w-[450px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(27,58,45,0.08) 0%, transparent 70%)' }}
        animate={{
          scale: [1, 1.1, 1],
          x: [0, -25, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
      />

      {/* Minimal dot pattern */}
      <div className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #1B3A2D 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Main content */}
      <div className="relative flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          className="flex flex-col items-center text-center"
        >
          {/* Logo */}
          <div className="relative mb-6">
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(168,213,181,0.3) 0%, transparent 70%)' }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <img
              src="/logo-icon.png"
              alt="Flocksy"
              className="relative z-10 h-32 w-32 object-contain drop-shadow-lg"
            />
          </div>

          {/* Brand name */}
          <motion.h1
            className="font-display text-5xl font-bold tracking-tight"
            style={{ color: '#1B3A2D' }}
            initial={{ letterSpacing: '0.15em', opacity: 0 }}
            animate={{ letterSpacing: '-0.02em', opacity: 1 }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.8 }}
          >
            FLOCKSY
          </motion.h1>

          {/* Divider */}
          <motion.div
            className="mt-4 h-px bg-gradient-to-r from-transparent via-[#1B3A2D]/15 to-transparent"
            initial={{ width: 0 }}
            animate={{ width: '180px' }}
            transition={{ duration: 1.2, delay: 1.4, ease: 'easeInOut' }}
          />

          {/* Tagline */}
          <motion.p
            className="mt-4 text-[10px] font-bold uppercase tracking-[0.5em]"
            style={{ color: '#7B8F80' }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2 }}
          >
            Farm Intelligence
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Preloader;
