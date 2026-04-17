import React from 'react';
import { useGameStore } from '../store/gameStore';
import { PLAYERS, TEAMS } from '../data/players';
import TeamBadge from '../components/TeamBadge';
import { motion } from 'framer-motion';
import { AnimatedPage } from '../components/AnimatedPage';
import { AnimatedButton } from '../components/AnimatedButton';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function SelectPlayerPage() {
  const { players, claimPlayer } = useGameStore();

  // Group by team
  const teamOrder = ['templarios', 'racistas', 'machistas'];
  const playersByTeam = teamOrder.map((teamId) => ({
    team: TEAMS[teamId],
    players: Object.values(PLAYERS).filter((p) => p.teamId === teamId),
  }));

  const handleSelect = async (playerId: string) => {
    const p = players[playerId];
    if (p?.isTaken) return;
    await claimPlayer(playerId);
  };

  return (
    <AnimatedPage className="page justify-start pt-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 text-center"
      >
        <div className="text-5xl mb-3 drop-shadow-md">👤</div>
        <h1 className="font-poppins font-black text-4xl text-white tracking-tight">¿Quién eres?</h1>
        <p className="text-white/60 font-poppins text-lg mt-2 font-medium">Elige tu jugador</p>
      </motion.div>

      <motion.div 
        className="flex flex-col gap-6 max-w-xl mx-auto w-full"
        variants={containerVariants as any}
        initial="hidden"
        animate="show"
      >
        {playersByTeam.map(({ team, players: teamPlayers }) => (
          <motion.div
            key={team.id}
            variants={itemVariants as any}
            className="glass-panel p-5 rounded-[2rem] border-t-2"
            style={{ borderTopColor: team.color }}
          >
            {/* Team header */}
            <div className="flex items-center gap-3 mb-5 px-2">
              <TeamBadge teamId={team.id} size="md" />
              <div className="h-[2px] flex-1 rounded-full" style={{ background: `linear-gradient(90deg, ${team.color}80, transparent)` }} />
            </div>

            {/* Players grid - Bento Style */}
            <div className="grid grid-cols-2 gap-3">
              {teamPlayers.map((templatePlayer) => {
                const livePlayer = players[templatePlayer.id];
                const isTaken = livePlayer?.isTaken ?? false;

                return (
                  <AnimatedButton
                    key={templatePlayer.id}
                    onClick={() => handleSelect(templatePlayer.id)}
                    disabled={isTaken}
                    soundType={isTaken ? 'error' : 'click'}
                    whileHover={!isTaken ? { scale: 1.03, y: -2 } : {}}
                    whileTap={!isTaken ? { scale: 0.97 } : {}}
                    className={`relative py-4 px-5 rounded-2xl font-bold font-poppins text-left
                      transition-colors duration-300 shadow-sm
                      ${isTaken
                        ? 'opacity-50 cursor-not-allowed bg-black/20 text-white/50 border border-white/5'
                        : 'hover:shadow-md border border-white/10'
                      }`}
                    style={!isTaken ? {
                      background: `linear-gradient(135deg, ${team.color}30, ${team.color}15)`,
                    } : {}}
                  >
                    <span className="block text-lg truncate leading-tight mb-1">{templatePlayer.name}</span>
                    <span className="text-[11px] font-medium tracking-wider uppercase" style={{ color: isTaken ? '#ffffff50' : team.color }}>
                      {isTaken ? 'Jugando ✓' : 'Disponible ➔'}
                    </span>
                  </AnimatedButton>
                );
              })}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </AnimatedPage>
  );
}

