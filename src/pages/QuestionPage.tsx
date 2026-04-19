import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { QUESTIONS } from '../data/questions';
import { TEAMS } from '../data/players';
import Timer from '../components/Timer';
import TeamBadge from '../components/TeamBadge';
import { useTimer } from '../hooks/useTimer';
import { playUrgent, vibrate } from '../utils/sounds';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedPage } from '../components/AnimatedPage';
import { AnimatedButton } from '../components/AnimatedButton';

const OPTION_COLORS = ['#e74c3c', '#3498db', '#f1c40f', '#2ecc71'];
const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

const listVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function QuestionPage() {
  const { gameState, currentPlayerId, localAnswers, submitAnswer, players, answers } = useGameStore();
  const question = QUESTIONS[gameState.currentQuestionIndex];
  const { timeLeft, timeLimit } = useTimer(gameState.questionStartTime, gameState.currentQuestionIndex);
  const currentPlayer = currentPlayerId ? players[currentPlayerId] : null;
  const team = currentPlayer ? TEAMS[currentPlayer.teamId] : null;

  const alreadyAnswered = localAnswers[gameState.currentQuestionIndex] !== undefined;
  const myAnswer = localAnswers[gameState.currentQuestionIndex];

  const playerList = Object.values(players).filter((p) => p.isTaken);
  const connectedCount = playerList.length;
  const currentAnswers = answers[gameState.currentQuestionIndex] || {};
  const answeredCount = Object.keys(currentAnswers).length;

  // Tick sound
  useEffect(() => {
    if (timeLimit > 0 && timeLeft <= 5 && timeLeft > 0 && !alreadyAnswered) {
      playUrgent();
    }
  }, [timeLeft, alreadyAnswered]);

  if (!question) return null;

  const handleAnswer = async (index: number) => {
    if (alreadyAnswered || (timeLimit > 0 && timeLeft === 0)) return;
    // vibrate handles by AnimatedButton internally
    vibrate([30, 20, 30]); // keep custom vibrate pattern
    await submitAnswer(index);
  };

  return (
    <AnimatedPage className="page justify-start pt-6">

      {/* Top bar */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex items-center justify-between mb-8 px-2"
      >
        <div className="flex flex-col">
          <span className="text-white/40 font-poppins text-xs font-semibold uppercase tracking-wider">Pregunta</span>
          {question.label ? (
            <span className="text-white font-black font-poppins text-lg drop-shadow-md leading-tight">
              {question.label}
            </span>
          ) : (
            <span className="text-white font-black font-poppins text-2xl drop-shadow-md">
              {gameState.currentQuestionIndex + 1}
            </span>
          )}
          {question.noScore && (
            <span className="text-yellow-400 font-poppins text-[10px] font-bold uppercase tracking-wider mt-0.5">
              ⭐ sin puntos
            </span>
          )}
        </div>

        <motion.div
           animate={timeLimit > 0 && timeLeft <= 5 && timeLeft > 0 ? { scale: [1, 1.1, 1], filter: ["hue-rotate(0deg)", "hue-rotate(90deg)", "hue-rotate(0deg)"] } : {}}
           transition={{ duration: 0.5, repeat: Infinity }}
        >
          <Timer timeLeft={timeLeft} timeLimit={timeLimit} />
        </motion.div>

        {currentPlayer && team && (
          <div className="text-right">
            <span className="block text-white/40 font-poppins text-xs font-semibold uppercase tracking-wider mb-1">Equipo</span>
            <TeamBadge teamId={currentPlayer.teamId} size="sm" />
          </div>
        )}
      </motion.div>

      {/* Question - Glass panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={gameState.currentQuestionIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4, type: "spring" }}
          className="glass-panel w-full rounded-3xl p-6 md:p-8 mb-8"
        >
          <p className="font-poppins font-bold text-white text-xl md:text-2xl leading-snug text-center tracking-tight drop-shadow-md">
            {question.text}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Response Counter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full flex justify-center mb-6"
      >
        <div className="px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/90 font-poppins text-sm font-bold shadow-lg">
          {answeredCount} / {connectedCount} respondieron
        </div>
      </motion.div>

      {/* Answer buttons */}
      <motion.div 
        variants={listVariants as any}
        initial="hidden"
        animate="show"
        key={`answers-${gameState.currentQuestionIndex}`}
        className="w-full flex flex-col gap-4"
      >
        {question.options.map((option, i) => {
          const isMyAnswer = myAnswer === i;
          const isDisabled = alreadyAnswered || (timeLimit > 0 && timeLeft === 0);

          return (
            <AnimatedButton
              variants={itemVariants as any}
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={isDisabled}
              soundType={isDisabled ? "none" : "click"}
              vibrateOnClick={false} // since custom vibrate pattern is used
              whileHover={!isDisabled ? { scale: 1.02, x: 5 } : {}}
              whileTap={!isDisabled ? { scale: 0.97 } : {}}
              className={`btn-answer font-poppins relative overflow-hidden
                ${isDisabled && !isMyAnswer ? 'opacity-40 grayscale-[50%]' : 'shadow-lg'}
                ${isMyAnswer ? 'ring-2 ring-white scale-[1.02] shadow-[0_0_20px_rgba(255,255,255,0.3)]' : ''}
              `}
              style={{
                background: isMyAnswer
                  ? OPTION_COLORS[i]
                  : `linear-gradient(135deg, ${OPTION_COLORS[i]}, ${OPTION_COLORS[i]}cc)`,
              }}
            >
              {/* Highlight gloss */}
              <div className="absolute top-0 left-0 w-full h-[40%] bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
              
              <span className="answer-letter bg-white/20 text-white shadow-sm">{OPTION_LETTERS[i]}</span>
              <span className="flex-1 leading-tight text-[17px] drop-shadow-sm">{option}</span>
              
              <AnimatePresence>
                {isMyAnswer && (
                  <motion.span 
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 12 }}
                    className="text-white text-2xl font-black bg-black/20 w-8 h-8 rounded-full flex items-center justify-center ml-2"
                  >
                    ✓
                  </motion.span>
                )}
              </AnimatePresence>
            </AnimatedButton>
          );
        })}
      </motion.div>

      {/* Answered feedback */}
      <div className="mt-8 h-10 w-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          {alreadyAnswered && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="px-6 py-2 rounded-full glass-panel flex items-center gap-2"
            >
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white/80 font-poppins text-sm font-semibold tracking-wide">
                Respuesta registrada
              </span>
            </motion.div>
          )}

          {!alreadyAnswered && timeLimit > 0 && timeLeft === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-6 py-2 rounded-full bg-red-500/20 border border-red-500/50 flex items-center gap-2"
            >
              <span className="text-red-400 font-poppins font-bold">
                ⏰ ¡Tiempo agotado!
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatedPage>
  );
}

