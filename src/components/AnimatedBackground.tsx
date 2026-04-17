import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Dark base layer */}
      <div className="absolute inset-0 bg-[#06060f]" />
      
      {/* Gradient Ambient Overlay */}
      <div className="absolute inset-0 opacity-40 mix-blend-screen"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(26,26,74,0.6) 0%, rgba(13,13,46,0) 80%)'
        }}
      />

      {/* Floating Orb 1 */}
      <motion.div
        animate={{
          x: [0, 100, 0, -100, 0],
          y: [0, -100, 100, -50, 0],
          scale: [1, 1.2, 0.8, 1.1, 1],
        }}
        transition={{
          duration: 25,
          ease: "easeInOut",
          repeat: Infinity,
        }}
        className="absolute top-[10%] left-[20%] w-[35vw] h-[35vw] rounded-full blur-[100px] opacity-30"
        style={{ background: '#3b82f6' }}
      />

      {/* Floating Orb 2 */}
      <motion.div
        animate={{
          x: [0, -150, 50, 100, 0],
          y: [0, 100, -150, 50, 0],
          scale: [1, 0.9, 1.3, 0.9, 1],
        }}
        transition={{
          duration: 30,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 2,
        }}
        className="absolute bottom-[20%] right-[10%] w-[45vw] h-[45vw] rounded-full blur-[120px] opacity-20"
        style={{ background: '#a855f7' }}
      />

      {/* Floating Orb 3 (Accent) */}
      <motion.div
        animate={{
          x: [0, 80, -80, 0],
          y: [0, 80, -80, 0],
        }}
        transition={{
          duration: 20,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 5,
        }}
        className="absolute top-[40%] right-[30%] w-[25vw] h-[25vw] rounded-full blur-[90px] opacity-20"
        style={{ background: '#ec4899' }}
      />

      {/* Glassmorphism texture layer */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
    </div>
  );
};
