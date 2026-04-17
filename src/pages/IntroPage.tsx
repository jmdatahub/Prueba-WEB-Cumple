import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedPage } from '../components/AnimatedPage';
import { AnimatedButton } from '../components/AnimatedButton';

// Change this to any PIN you want for the host
const HOST_PIN = '1234';

interface IntroPageProps {
  onStart: () => void;
}

// Quick floating stars background
function Stars() {
  const stars = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 3,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white animate-pulse-fast"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            opacity: 0.3,
          }}
        />
      ))}
    </div>
  );
}

export default function IntroPage({ onStart }: IntroPageProps) {
  const setIsHost = useGameStore((s) => s.setIsHost);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);

  const handleHostSubmit = () => {
    if (pin === HOST_PIN) {
      setIsHost(true);
      setShowPinModal(false);
    } else {
      setPinError(true);
      setPin('');
      setTimeout(() => setPinError(false), 1500);
    }
  };

  return (
    <AnimatedPage className="page justify-center text-center relative">
      <Stars />

      <motion.div 
        className="relative z-10 flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      >
        {/* Emoji - Playful float */}
        <motion.div 
          className="text-[120px] mb-2 drop-shadow-2xl"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          🎂
        </motion.div>

        {/* Title */}
        <h1 className="font-poppins font-black text-5xl md:text-7xl text-white mb-2 leading-none drop-shadow-lg">
          Cumpleaños
          <span className="block mt-2 text-transparent bg-clip-text drop-shadow-md"
            style={{ backgroundImage: 'linear-gradient(135deg, #f97316 0%, #ef4444 50%, #a855f7 100%)' }}>
            Jorge
          </span>
        </h1>

        <p className="text-white/60 font-poppins text-xl mt-4 mb-12 tracking-wide font-medium">
          Quiz Night 🎉
        </p>

        {/* Start button - Playful Bouncy */}
        <AnimatedButton
          onClick={onStart}
          soundType="correct"
          className="btn-primary text-2xl px-14 py-5 rounded-[2rem] font-black"
          style={{
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
          }}
        >
          ¡Empezar! 🚀
        </AnimatedButton>

        <p className="text-white/40 font-poppins text-sm mt-6">
          Selecciona tu equipo para unirte
        </p>
      </motion.div>

      {/* Host toggle at bottom */}
      <AnimatedButton
        soundType="click"
        onClick={() => setShowPinModal(true)}
        className="absolute bottom-8 right-8 text-white/30 text-sm font-poppins hover:text-white/80 transition-colors"
      >
        Soy el Host 👑
      </AnimatedButton>

      {/* PIN Modal - Glassmorphism & Framer */}
      <AnimatePresence>
        {showPinModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={pinError ? { scale: 1, y: 0, opacity: 1, x: [-10, 10, -10, 10, 0] } : { scale: 1, y: 0, opacity: 1, x: 0 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="glass-panel rounded-[2rem] p-8 w-full max-w-sm"
            >
              <div className="text-5xl text-center mb-4 drop-shadow-lg">👑</div>
              <h2 className="text-white font-black text-2xl text-center mb-8 font-poppins tracking-tight">
                Acceso Host
              </h2>
              
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value.slice(0, 4))}
                onKeyDown={(e) => e.key === 'Enter' && handleHostSubmit()}
                placeholder="****"
                className={`w-full bg-black/20 text-white text-center text-4xl font-black rounded-2xl py-4 px-4 outline-none border-2 font-poppins backdrop-blur-md transition-colors
                  ${pinError ? 'border-red-500/80 text-red-100' : 'border-white/10 focus:border-purple-500/80 focus:bg-black/40'}`}
                autoFocus
              />
              
              <div className="h-6 mt-2 mb-4 text-center">
                <AnimatePresence>
                  {pinError && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-red-400 font-medium text-sm font-poppins"
                    >
                      PIN incorrecto ❌
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex gap-3 mt-2">
                <AnimatedButton
                  soundType="click"
                  onClick={() => { setShowPinModal(false); setPin(''); }}
                  className="flex-1 py-4 rounded-xl font-bold text-white/70 font-poppins hover:bg-white/10 transition-colors"
                >
                  Cancelar
                </AnimatedButton>
                <AnimatedButton
                  onClick={handleHostSubmit}
                  soundType={pinError ? "error" : "click"}
                  className="flex-1 py-4 rounded-xl font-bold text-white font-poppins shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
                >
                  Entrar
                </AnimatedButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatedPage>
  );
}

