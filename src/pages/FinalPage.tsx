import React, { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { TEAMS } from '../data/players';
import { getSortedPlayers, getTeamScore } from '../utils/scoring';
import { playFanfare, vibrate } from '../utils/sounds';
import confetti from 'canvas-confetti';
import { AnimatedPage } from '../components/AnimatedPage';
import { AnimatedNumber } from '../components/AnimatedNumber';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", bounce: 0.6 } }
};

export default function FinalPage() {
  const { players } = useGameStore();
  const [revealed, setRevealed] = useState(false);
  const hasPlayed = useRef(false);

  const playerList = Object.values(players).filter((p) => p.isTaken);
  const sorted = getSortedPlayers(playerList);

  const teamRankings = Object.values(TEAMS)
    .map((t) => ({ ...t, score: getTeamScore(t.id, players) }))
    .sort((a, b) => b.score - a.score);

  const winnerTeam = teamRankings[0];

  useEffect(() => {
    if (hasPlayed.current) return;
    hasPlayed.current = true;
    setTimeout(() => {
      setRevealed(true);
      playFanfare();
      vibrate([100, 50, 100, 50, 200]);
      confetti({
        particleCount: 200,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#3b82f6', '#f97316', '#a855f7', '#fbbf24'],
      });
    }, 1500);
  }, []);

  return (
    <AnimatedPage className="min-h-screen flex flex-col items-center px-4 py-8 relative w-full overflow-y-auto bg-transparent">
      <AnimatePresence mode="wait">
        {!revealed ? (
          <motion.div
            key="revealing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.6 }}
            className="flex-1 flex flex-col items-center justify-center"
          >
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }} 
              transition={{ repeat: Infinity, duration: 1 }}
              className="text-8xl mb-4"
            >
              🏆
            </motion.div>
            <h1 className="font-poppins font-black text-4xl text-white text-center">
              Revelando...
            </h1>
            <div className="flex gap-2 mt-6">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                  className="w-3 h-3 rounded-full bg-purple-400"
                />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            className="w-full flex flex-col items-center w-full max-w-md"
            variants={containerVariants as any}
            initial="hidden"
            animate="show"
          >
            {/* Winner team banner */}
            <motion.div variants={itemVariants as any} className="text-center mb-8 w-full">
              <p className="text-white/50 font-poppins text-sm mb-2 uppercase tracking-widest font-semibold">
                ¡Equipo ganador!
              </p>
              <div
                className="rounded-[2rem] px-8 py-8 relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${winnerTeam.color}40, ${winnerTeam.color}10)`,
                  border: `2px solid ${winnerTeam.color}80`,
                  boxShadow: `0 0 50px ${winnerTeam.color}40`,
                }}
              >
                <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-screen"
                     style={{ background: `radial-gradient(circle at 50% -20%, ${winnerTeam.color}, transparent 80%)` }} />
                
                <motion.div 
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", bounce: 0.7, delay: 0.5 }}
                  className="text-6xl mb-3 drop-shadow-xl"
                >
                  🏆
                </motion.div>
                <h2 className="font-poppins font-black text-5xl tracking-tight z-10 relative drop-shadow" style={{ color: winnerTeam.color }}>
                  {winnerTeam.name}
                </h2>
                <p className="font-black text-white text-3xl mt-2 z-10 relative drop-shadow">
                  <AnimatedNumber value={winnerTeam.score} /> pts
                </p>
              </div>
            </motion.div>

            {/* Teams ranking */}
            <motion.div variants={itemVariants as any} className="w-full mb-8">
              <div className="grid grid-cols-3 gap-3">
                {teamRankings.map((team, i) => (
                  <motion.div
                    key={team.id}
                    variants={itemVariants as any}
                    className="rounded-2xl p-4 text-center flex flex-col items-center min-w-0 glass-panel"
                    style={{ 
                      background: `linear-gradient(180deg, ${team.color}20, transparent)`,
                      borderTop: `2px solid ${team.color}60`
                    }}
                  >
                    <span className="text-2xl drop-shadow mb-1">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>
                    <div className="font-bold font-poppins text-xs mt-1 w-full truncate uppercase tracking-wide" style={{ color: team.color }}>
                      {team.name}
                    </div>
                    <div className="font-black text-white text-lg mt-0.5"><AnimatedNumber value={team.score} /></div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Player stats */}
            <motion.div variants={itemVariants as any} className="w-full">
              <h3 className="font-poppins font-bold text-white/50 text-xs uppercase tracking-wider mb-4 text-center">
                Clasificación Individual Final
              </h3>
              <div className="flex flex-col gap-3">
                {sorted.map((player, i) => {
                  const team = TEAMS[player.teamId];
                  return (
                    <motion.div
                      key={player.id}
                      variants={itemVariants as any}
                      className="flex items-center gap-3 rounded-[1rem] px-4 py-4 glass-panel"
                    >
                      <span className="font-black text-lg w-8 text-white/80 text-center drop-shadow">
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
                      </span>
                      <div className="w-1.5 h-10 rounded-full" style={{ background: team?.color, boxShadow: `0 0 10px ${team?.color}80` }} />
                      <div className="flex-1 min-w-0 pr-2">
                        <span className="font-poppins font-bold text-white text-base block truncate shadow-black">
                          {player.name}
                        </span>
                        <span className="text-white/40 text-[11px] font-poppins font-semibold tracking-wide uppercase mt-0.5 block">
                          <span className="text-green-400/80">✓{player.correct}</span> &nbsp;
                          <span className="text-red-400/80">✗{player.wrong}</span> &nbsp;
                          <span className="text-gray-400/80">–{player.unanswered}</span>
                        </span>
                      </div>
                      <AnimatedNumber value={player.score} className="font-black text-white text-xl drop-shadow" />
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatedPage>
  );
}
