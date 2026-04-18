import React from 'react';
import { useGameStore } from '../store/gameStore';
import { TEAMS } from '../data/players';
import TeamBadge from '../components/TeamBadge';
import { motion } from 'framer-motion';
import { AnimatedPage } from '../components/AnimatedPage';
import { AnimatedButton } from '../components/AnimatedButton';

const gridVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 20 } }
};

export default function LobbyPage() {
  const { players, currentPlayerId, unclaimPlayer } = useGameStore();
  const currentPlayer = currentPlayerId ? players[currentPlayerId] : null;
  const team = currentPlayer ? TEAMS[currentPlayer.teamId] : null;

  const connectedPlayers = Object.values(players).filter((p) => p.isTaken);
  const total = 18;

  return (
    <AnimatedPage className="page justify-center items-center text-center">
      {/* Player info - Glass Bento Card */}
      {currentPlayer && team && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="glass-panel w-full max-w-sm rounded-[2rem] p-8 mb-8 relative overflow-hidden"
          style={{
            borderTop: `2px solid ${team.color}`,
          }}
        >
          {/* Subtle background glow */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
            style={{ background: `radial-gradient(circle at top right, ${team.color}, transparent 70%)` }} />
            
          <motion.div 
            animate={{ y: [0, -5, 0] }} 
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="text-6xl mb-4 drop-shadow-md"
          >
            👤
          </motion.div>
          <h2 className="font-poppins font-black text-3xl text-white tracking-tight leading-none mb-3">
            {currentPlayer.name}
          </h2>
          <div className="flex justify-center mt-2">
            <TeamBadge teamId={currentPlayer.teamId} size="md" />
          </div>
          <AnimatedButton
            onClick={unclaimPlayer}
            soundType="click"
            className="mt-5 w-full py-2.5 px-4 rounded-xl text-sm font-poppins font-semibold
              text-white/60 border border-white/10 bg-white/5
              hover:bg-white/10 hover:text-white/80 transition-colors duration-200"
          >
            ✏️ No soy yo / Cambiar
          </AnimatedButton>
        </motion.div>
      )}

      {/* Waiting indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 justify-center text-white/60 font-poppins font-medium">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                className="w-2.5 h-2.5 rounded-full bg-purple-400/80 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
              />
            ))}
          </div>
          <span className="tracking-wide">Esperando al host...</span>
        </div>
      </motion.div>

      {/* Connection progress */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-sm mb-4 flex justify-between items-end px-2"
      >
        <span className="text-white/40 font-poppins text-xs uppercase tracking-widest font-semibold">
          Jugadores
        </span>
        <span className="text-white font-poppins font-bold bg-white/10 px-3 py-1 rounded-full text-sm backdrop-blur-md">
          {connectedPlayers.length} / {total}
        </span>
      </motion.div>

      {/* Connected players list - Bento Grid */}
      <motion.div 
        variants={gridVariants as any}
        initial="hidden"
        animate="show"
        className="w-full max-w-sm"
      >
        <div className="grid grid-cols-3 gap-2.5">
          {Object.values(players).map((p) => {
            const t = TEAMS[p.teamId];
            return (
              <motion.div
                key={p.id}
                variants={itemVariants as any}
                className={`rounded-[1rem] py-3 px-2 text-xs font-poppins font-semibold text-center
                  transition-all duration-300 relative overflow-hidden flex flex-col items-center justify-center
                  ${p.isTaken ? 'shadow-md scale-100 opacity-100 z-10' : 'scale-95 opacity-30 blur-[0.5px]'}`}
                style={{
                  background: p.isTaken ? `linear-gradient(135deg, ${t?.color}30, ${t?.color}10)` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${p.isTaken ? t?.color + '50' : 'rgba(255,255,255,0.05)'}`,
                  color: p.isTaken ? '#fff' : 'rgba(255,255,255,0.5)',
                }}
              >
                <span className="truncate w-full relative z-10 block">{p.name}</span>
                {p.isTaken && (
                  <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px]"
                    style={{ background: t?.color, color: '#fff' }}
                  >
                    ✓
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </AnimatedPage>
  );
}
