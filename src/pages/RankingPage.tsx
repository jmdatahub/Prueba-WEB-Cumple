import React from 'react';
import { useGameStore } from '../store/gameStore';
import { TEAMS } from '../data/players';
import { getSortedPlayers, getTeamScore } from '../utils/scoring';
import { motion } from 'framer-motion';
import { AnimatedPage } from '../components/AnimatedPage';
import { AnimatedNumber } from '../components/AnimatedNumber';

// Hide team scores after this question index (0-based) to build suspense
const HIDE_TEAMS_AFTER = 4;

const listVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const teamItemVariants = {
  hidden: { opacity: 0, x: 20 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function RankingPage() {
  const { players, gameState, currentPlayerId } = useGameStore();
  const playerList = Object.values(players).filter((p) => p.isTaken);
  const sorted = getSortedPlayers(playerList);
  const myPosition = sorted.findIndex((p) => p.id === currentPlayerId) + 1;
  const myPlayer = currentPlayerId ? players[currentPlayerId] : null;

  const showTeamScores = gameState.currentQuestionIndex < HIDE_TEAMS_AFTER;

  const teamRankings = Object.values(TEAMS)
    .map((t) => ({ ...t, score: getTeamScore(t.id, players) }))
    .sort((a, b) => b.score - a.score);

  return (
    <AnimatedPage className="page justify-start pt-6">

      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full text-center mb-6"
      >
        <span className="text-4xl drop-shadow-lg block mb-2">🏆</span>
        <h1 className="font-poppins font-black text-3xl text-white tracking-tight drop-shadow-md">
          Ranking
        </h1>
      </motion.div>

      {/* My position banner */}
      {myPlayer && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2, type: "spring" }}
          className="glass-panel w-full rounded-2xl px-5 py-4 mb-8 flex items-center gap-4 relative overflow-hidden"
          style={{ border: `1px solid ${TEAMS[myPlayer.teamId]?.color}50` }}
        >
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: `linear-gradient(90deg, ${TEAMS[myPlayer.teamId]?.color}, transparent)` }} />
          <span className="font-black text-3xl text-white drop-shadow-md z-10">#{myPosition}</span>
          <div className="flex-1 z-10">
            <span className="font-poppins font-bold text-white text-lg drop-shadow-sm">{myPlayer.name}</span>
          </div>
          <AnimatedNumber value={myPlayer.score} className="font-black text-2xl text-white z-10 drop-shadow-md" />
        </motion.div>
      )}

      <div className="w-full flex gap-4 md:gap-6">
        {/* Players ranking */}
        <div className="flex-1">
          <h2 className="font-poppins font-bold text-white/50 text-xs uppercase tracking-wider mb-3">
            Jugadores
          </h2>
          <motion.div 
            variants={listVariants as any}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-2.5"
          >
            {sorted.slice(0, 8).map((player, i) => {
              const team = TEAMS[player.teamId];
              const isMe = player.id === currentPlayerId;
              return (
                <motion.div
                  variants={itemVariants as any}
                  key={player.id}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 relative overflow-hidden shadow-sm
                    ${isMe ? 'ring-2 ring-white scale-[1.02]' : ''}`}
                  style={{
                    background: isMe ? `${team?.color}30` : 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}
                >
                  {isMe && <div className="absolute inset-0 bg-white/5 pointer-events-none" />}
                  <span className="font-black text-base w-6 text-center text-white/60">
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
                  </span>
                  <div
                    className="w-1.5 h-6 rounded-full flex-shrink-0"
                    style={{ background: team?.color }}
                  />
                  <span className={`font-poppins font-semibold text-sm flex-1 truncate ${isMe ? 'text-white' : 'text-white/80'}`}>
                    {player.name}
                  </span>
                  <AnimatedNumber value={player.score} className={`font-black text-sm tracking-wide ${isMe ? 'text-white' : 'text-white/90'}`} />
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Teams ranking - Bento style */}
        <div className="w-32 md:w-40">
          <h2 className="font-poppins font-bold text-white/50 text-xs uppercase tracking-wider mb-3 text-right pr-1">
            Equipos
          </h2>
          <motion.div 
            variants={listVariants as any}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-3"
          >
            {teamRankings.map((team, i) => (
              <motion.div
                layout
                variants={teamItemVariants as any}
                key={team.id}
                className="glass-panel text-right rounded-[1rem] px-4 py-3 relative overflow-hidden"
                style={{
                  borderRight: `3px solid ${team.color}`,
                }}
              >
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: `linear-gradient(270deg, ${team.color}, transparent)` }} />
                
                <div className="flex items-center justify-between font-poppins font-bold text-xs mb-1 uppercase tracking-wider z-10 relative" style={{ color: team.color }}>
                  <span className="text-[10px] opacity-80 mix-blend-screen text-white text-left whitespace-nowrap">
                    {i === 0 ? '🥇 #1' : i === 1 ? '🥈 #2' : i === 2 ? '🥉 #3' : ''}
                  </span>
                  <span>{team.name}</span>
                </div>
                <div className="font-black text-white text-xl z-10 relative flex justify-end">
                  {showTeamScores ? <AnimatedNumber value={team.score} /> : (
                    <motion.div
                      animate={{ 
                        rotate: [0, -10, 10, -12, 12, 0],
                        scale: [1, 1.2, 1.2, 1.2, 1]
                      }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity, 
                        repeatType: "loop",
                        ease: "easeInOut",
                        repeatDelay: 0.8
                      }}
                      className="inline-block text-white/90 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                    >
                      ?
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
          {!showTeamScores && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-white/40 text-[10px] uppercase tracking-widest font-bold mt-4 text-center"
            >
              Revelación final<span className="block text-lg mt-1">👀</span>
            </motion.p>
          )}
        </div>
      </div>
    </AnimatedPage>
  );
}

