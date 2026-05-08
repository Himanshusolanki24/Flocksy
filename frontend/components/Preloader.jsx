import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

const Preloader = ({ onComplete }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onComplete, 1000); // Allow exit animation to finish
    }, 3500); // Slightly longer for the new branding
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#F2F4E9]"
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* Abstract Blobs */}
      <motion.div
        className="absolute -top-20 -left-20 h-[400px] w-[400px] rounded-full bg-[#8E9B44]/20 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute -bottom-20 -right-20 h-[500px] w-[500px] rounded-full bg-[#3D5438]/15 blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          x: [0, -40, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />

      {/* Fluid Shapes (SVG Blobs) */}
      <svg className="absolute inset-0 h-full w-full opacity-30" viewBox="0 0 1000 1000">
        <motion.path
          d="M0,1000 L0,800 C150,750 300,950 500,850 C700,750 850,900 1000,800 L1000,1000 Z"
          fill="#3D5438"
          initial={{ y: 200 }}
          animate={{ y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <motion.path
          d="M0,0 L0,200 C200,250 400,100 600,200 C800,300 900,150 1000,250 L1000,0 Z"
          fill="#8E9B44"
          initial={{ y: -200 }}
          animate={{ y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>

      {/* Dots Pattern */}
      <div className="absolute top-20 left-20 grid grid-cols-4 gap-2 opacity-20">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="h-2 w-2 rounded-full bg-[#3D5438]" />
        ))}
      </div>
      <div className="absolute bottom-20 right-20 grid grid-cols-4 gap-2 opacity-20">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="h-2 w-2 rounded-full bg-[#8E9B44]" />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="flex flex-col items-center text-center"
        >
          {/* Main Logo Icon Image */}
          <div className="relative mb-8">
            <motion.div
              className="absolute inset-0 rounded-full bg-[#8E9B44]/20 blur-3xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <img 
              src="/logo-icon.png" 
              alt="Logo Icon" 
              className="h-48 w-48 relative z-10 object-contain drop-shadow-[0_20px_50px_rgba(44,58,41,0.3)]" 
            />
          </div>

          <motion.h1
            className="text-7xl font-serif tracking-tighter text-[#3D5438]"
            initial={{ letterSpacing: "0.2em", opacity: 0 }}
            animate={{ letterSpacing: "-0.02em", opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 1.2 }}
          >
            FLOCKSY
          </motion.h1>

          <motion.div
            className="mt-6 h-[1px] w-0 bg-[#3D5438]/20"
            animate={{ width: "240px" }}
            transition={{ duration: 1.5, delay: 1.8, ease: "easeInOut" }}
          />

          <motion.p
            className="mt-6 text-[11px] font-bold uppercase tracking-[0.6em] text-[#3D5438]/40"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.5 }}
          >
            Growchick Agri & Poultry
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Preloader;
