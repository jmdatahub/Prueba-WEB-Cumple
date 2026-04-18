import React, { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { TEAMS } from '../data/players';
import { getSortedPlayers, getTeamScore } from '../utils/scoring';
import { playFanfare, vibrate, playDrumRoll, playCountdownBeep, playPodiumReveal } from '../utils/sounds';
import confetti from 'canvas-confetti';
import { AnimatedPage } from '../components/AnimatedPage';
import { AnimatedNumber } from '../components/AnimatedNumber';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Stages ────────────────────────────────────────────────────────────────
// 'countdown'  → 5,4,3,2,1 with drum roll
// 'podium3'    → reveal #3 team
// 'podium2'    → reveal #2 team
// 'podium1'    → reveal winner (#1 team)
// 'players'    → full player ranking
type Stage = 'countdown' | 'podium3' | 'podium2' | 'podium1' | 'players';

const MEDAL = ['🥇', '🥈', '🥉'];

// ─── Countdown number animation ────────────────────────────────────────────
function CountdownNumber({ n }: { n: number | null }) {
  return (
    <AnimatePresence mode="wait">
      {n !== null && (
        <motion.div
          key={n}
          initial={{ scale: 4, opacity: 0, filter: 'blur(20px)' }}
          animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
          exit={{ scale: 0.2, opacity: 0, y: -60, filter: 'blur(10px)' }}
          transition={{ type: 'spring', stiffness: 280, damping: 18 }}
          className="font-black text-[10rem] leading-none select-none"
          style={{
            color: n === 1 ? '#f97316' : '#ffffff',
            textShadow: n === 1
              ? '0 0 80px rgba(249,115,22,0.8), 0 0 200px rgba(249,115,22,0.4)'
              : '0 0 60px rgba(255,255,255,0.4)',
          }}
        >
          {n}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Podium card ───────────────────────────────────────────────────────────
function PodiumCard({
  team,
  rank,
  delay = 0,
}: {
  team: { name: string; color: string; score: number };
  rank: number; // 0=winner,1=second,2=third (display order)
  delay?: number;
}) {
  const rankLabels = ['🥇 1º', '🥈 2º', '🥉 3º'];
  const sizes = ['text-5xl', 'text-4xl', 'text-3xl'];
  const paddings = ['py-10 px-8', 'py-8 px-6', 'py-6 px-6'];

  return (
    <motion.div
      initial={{ scale: 0, rotateY: 90, opacity: 0 }}
      animate={{ scale: 1, rotateY: 0, opacity: 1 }}
      transition={{ type: 'spring', bounce: 0.55, duration: 0.8, delay }}
      className={`w-full max-w-sm rounded-[2rem] ${paddings[rank]} relative overflow-hidden flex flex-col items-center text-center`}
      style={{
        background: `linear-gradient(135deg, ${team.color}40, ${team.color}10)`,
        border: `2px solid ${team.color}80`,
        boxShadow: `0 0 80px ${team.color}50`,
      }}
    >
      {/* Glow bg */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{ background: `radial-gradient(circle at 50% 0%, ${team.color}, transparent 70%)` }}
      />
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: delay + 0.3 }}
        className="text-lg font-black font-poppins uppercase tracking-widest mb-2"
        style={{ color: team.color }}
      >
        {rankLabels[rank]}
      </motion.div>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', bounce: 0.7, delay: delay + 0.4 }}
        className={`font-black font-poppins ${sizes[rank]} tracking-tight text-white drop-shadow mb-2 z-10 relative`}
      >
        {team.name}
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.6 }}
        className="font-black text-2xl z-10 relative"
        style={{ color: team.color }}
      >
        <AnimatedNumber value={team.score} /> pts
      </motion.div>
    </motion.div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────
export default function FinalPage() {
  const { players } = useGameStore();
  const [stage, setStage] = useState<Stage>('countdown');
  const [countdownNum, setCountdownNum] = useState<number | null>(5);
  const hasStarted = useRef(false);

  const playerList = Object.values(players).filter((p) => p.isTaken);
  const sorted = getSortedPlayers(playerList);

  const teamRankings = Object.values(TEAMS)
    .map((t) => ({ ...t, score: getTeamScore(t.id, players) }))
    .sort((a, b) => b.score - a.score);

  // teamRankings[0] = winner, [1] = 2nd, [2] = 3rd

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    // Start drum roll
    playDrumRoll(5);

    // Countdown: 5→4→3→2→1 each second
    const counts = [5, 4, 3, 2, 1];
    counts.forEach((n, i) => {
      setTimeout(() => {
        setCountdownNum(n);
        playCountdownBeep(n === 1);
        if (n === 1) vibrate([50, 30, 50, 30, 200]);
      }, i * 1000);
    });

    // After countdown ends → start podium reveals
    // 3rd place at t=5.5s
    setTimeout(() => {
      setStage('podium3');
      setCountdownNum(null);
      playPodiumReveal(0);
      vibrate([80]);
    }, 5500);

    // 2nd place at t=8s
    setTimeout(() => {
      setStage('podium2');
      playPodiumReveal(1);
      vibrate([80, 40, 80]);
    }, 8000);

    // 1st place (winner) at t=11s
    setTimeout(() => {
      setStage('podium1');
      playPodiumReveal(2);
      playFanfare();
      vibrate([100, 50, 100, 50, 200]);
      confetti({
        particleCount: 250,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#22c55e', '#3b82f6', '#f97316', '#a855f7', '#fbbf24', '#ec4899'],
        startVelocity: 45,
      });
    }, 11000);

    // Player ranking at t=14.5s
    setTimeout(() => {
      setStage('players');
    }, 14500);
  }, []);

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <AnimatedPage className="min-h-screen flex flex-col items-center px-4 py-8 relative w-full overflow-y-auto bg-transparent">

      {/* ── COUNTDOWN ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {stage === 'countdown' && (
          <motion.div
            key="countdown-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.2, filter: 'blur(20px)' }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 flex flex-col items-center justify-center z-50"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
          >
            {/* Drums label */}
            <motion.p
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="font-poppins font-bold text-white/60 text-xl uppercase tracking-[0.3em] mb-8"
            >
              🥁 Redoble de tambores...
            </motion.p>

            <CountdownNumber n={countdownNum} />

            {/* Pulsing ring */}
            {countdownNum !== null && (
              <motion.div
                key={`ring-${countdownNum}`}
                initial={{ scale: 0.5, opacity: 0.8 }}
                animate={{ scale: 3, opacity: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="absolute rounded-full border-4 border-white/30"
                style={{ width: 160, height: 160 }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── PODIUM REVEALS ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {(stage === 'podium3' || stage === 'podium2' || stage === 'podium1') && (
          <motion.div
            key="podium-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -40, filter: 'blur(10px)' }}
            transition={{ duration: 0.5 }}
            className="w-full flex flex-col items-center gap-6"
          >
            <motion.h1
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-poppins font-black text-white text-3xl uppercase tracking-widest text-center mb-2"
            >
              🏆 Podio Final
            </motion.h1>

            {/* 3rd place */}
            <AnimatePresence>
              {(stage === 'podium3' || stage === 'podium2' || stage === 'podium1') && (
                <motion.div key="p3" className="w-full flex justify-center">
                  <PodiumCard team={teamRankings[2]} rank={2} delay={0} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* 2nd place */}
            <AnimatePresence>
              {(stage === 'podium2' || stage === 'podium1') && (
                <motion.div key="p2" className="w-full flex justify-center">
                  <PodiumCard team={teamRankings[1]} rank={1} delay={0} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* 1st place */}
            <AnimatePresence>
              {stage === 'podium1' && (
                <motion.div key="p1" className="w-full flex justify-center">
                  <PodiumCard team={teamRankings[0]} rank={0} delay={0} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FULL RESULTS ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {stage === 'players' && (
          <motion.div
            key="full-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full flex flex-col items-center gap-8"
          >
            {/* Winner banner */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
              className="text-center w-full max-w-sm"
            >
              <p className="text-white/50 font-poppins text-xs mb-2 uppercase tracking-widest font-semibold">
                ¡Equipo ganador!
              </p>
              <div
                className="rounded-[2rem] px-8 py-7 relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${teamRankings[0].color}40, ${teamRankings[0].color}10)`,
                  border: `2px solid ${teamRankings[0].color}80`,
                  boxShadow: `0 0 60px ${teamRankings[0].color}40`,
                }}
              >
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 50% -20%, ${teamRankings[0].color}, transparent 80%)` }}
                />
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', bounce: 0.7, delay: 0.4 }}
                  className="text-5xl mb-2 drop-shadow-xl"
                >
                  🏆
                </motion.div>
                <h2
                  className="font-poppins font-black text-4xl tracking-tight z-10 relative drop-shadow"
                  style={{ color: teamRankings[0].color }}
                >
                  {teamRankings[0].name}
                </h2>
                <p className="font-black text-white text-2xl mt-1 z-10 relative drop-shadow">
                  <AnimatedNumber value={teamRankings[0].score} /> pts
                </p>
              </div>
            </motion.div>

            {/* Teams podium grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full max-w-sm"
            >
              <h3 className="font-poppins font-bold text-white/50 text-xs uppercase tracking-wider mb-3 text-center">
                Clasificación Equipos
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {teamRankings.map((team, i) => (
                  <motion.div
                    key={team.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 + i * 0.1 }}
                    className="rounded-2xl p-4 text-center flex flex-col items-center min-w-0 glass-panel"
                    style={{
                      background: `linear-gradient(180deg, ${team.color}20, transparent)`,
                      borderTop: `2px solid ${team.color}60`,
                    }}
                  >
                    <span className="text-2xl drop-shadow mb-1">{MEDAL[i]}</span>
                    <div
                      className="font-bold font-poppins text-xs mt-1 w-full truncate uppercase tracking-wide"
                      style={{ color: team.color }}
                    >
                      {team.name}
                    </div>
                    <div className="font-black text-white text-lg mt-0.5">
                      <AnimatedNumber value={team.score} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Full player ranking */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="w-full max-w-sm"
            >
              <h3 className="font-poppins font-bold text-white/50 text-xs uppercase tracking-wider mb-4 text-center">
                Clasificación Individual Final
              </h3>
              <div className="flex flex-col gap-3">
                {sorted.map((player, i) => {
                  const team = TEAMS[player.teamId];
                  return (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.65 + i * 0.06, type: 'spring', bounce: 0.4 }}
                      className="flex items-center gap-3 rounded-[1rem] px-4 py-4 glass-panel"
                    >
                      <span className="font-black text-lg w-8 text-white/80 text-center drop-shadow">
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
                      </span>
                      <div
                        className="w-1.5 h-10 rounded-full"
                        style={{ background: team?.color, boxShadow: `0 0 10px ${team?.color}80` }}
                      />
                      <div className="flex-1 min-w-0 pr-2">
                        <span className="font-poppins font-bold text-white text-base block truncate shadow-black">
                          {player.name}
                        </span>
                        <span className="text-white/40 text-[11px] font-poppins font-semibold tracking-wide uppercase mt-0.5 block">
                          <span className="text-green-400/80">✓{player.correct}</span>&nbsp;
                          <span className="text-red-400/80">✗{player.wrong}</span>&nbsp;
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
