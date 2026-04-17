import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { QUESTIONS } from '../data/questions';
import { playCorrect, playWrong, playReveal, vibrate } from '../utils/sounds';
import FullscreenImage from '../components/FullscreenImage';
import { AnimatedPage } from '../components/AnimatedPage';
import { motion } from 'framer-motion';

const OPTION_COLORS = ['#e74c3c', '#3498db', '#f1c40f', '#2ecc71'];
const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function RevealPage() {
  const { gameState, currentPlayerId, localAnswers, players } = useGameStore();
  const question = QUESTIONS[gameState.currentQuestionIndex];
  const myAnswer = localAnswers[gameState.currentQuestionIndex];
  const answered = myAnswer !== undefined;
  const actualCorrectIndex = gameState.dynamicAnswerIndex ?? question?.correctIndex;
  const isCorrect = answered && myAnswer === actualCorrectIndex;
  const hasPlayed = useRef(false);

  const currentPlayer = currentPlayerId ? players[currentPlayerId] : null;

  useEffect(() => {
    if (hasPlayed.current) return;
    hasPlayed.current = true;
    playReveal();
    setTimeout(() => {
      if (isCorrect) {
        playCorrect();
        vibrate([50, 30, 50, 30, 50]);
      } else if (answered) {
        playWrong();
        vibrate([200]);
      }
    }, 800);
  }, []);

  if (!question) return null;

  return (
    <AnimatedPage className="min-h-screen flex flex-col items-center px-4 py-8 relative w-full overflow-y-auto bg-transparent">
      
      {/* Result header */}
      <motion.div 
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.6, duration: 0.8 }}
        className="text-center mb-6"
      >
        {!answered ? (
          <><div className="text-6xl mb-2">😶</div>
            <h2 className="font-poppins font-black text-2xl text-white">No respondiste</h2></>
        ) : isCorrect ? (
          <><div className="text-6xl mb-2">🎉</div>
            <h2 className="font-poppins font-black text-2xl text-green-400">¡Correcto!</h2>
            <p className="text-white/50 font-poppins text-sm mt-1">+{(currentPlayer?.score ?? 0)} pts totales</p></>
        ) : (
          <><div className="text-6xl mb-2">💀</div>
            <h2 className="font-poppins font-black text-2xl text-red-400">Incorrecto</h2>
            <p className="text-white/50 font-poppins text-sm mt-1">-100 pts</p></>
        )}
      </motion.div>

      {/* Options reveal */}
      <motion.div 
        variants={containerVariants as any}
        initial="hidden"
        animate="show"
        className="w-full max-w-md flex flex-col gap-3 mb-6"
      >
        {question.options.map((option, i) => {
          const isCorrectOption = i === actualCorrectIndex;
          const isMyOption = myAnswer === i;

          return (
            <motion.div
              variants={itemVariants as any}
              key={i}
              className={`flex items-center gap-3 rounded-2xl py-4 px-5 font-poppins font-bold text-base shadow-lg`}
              style={{
                background: isCorrectOption
                  ? `linear-gradient(135deg, #22c55e, #16a34a)`
                  : isMyOption
                  ? `linear-gradient(135deg, ${OPTION_COLORS[i]}80, ${OPTION_COLORS[i]}60)`
                  : 'rgba(255,255,255,0.05)',
                border: isCorrectOption
                  ? '2px solid #22c55e'
                  : isMyOption
                  ? `2px solid ${OPTION_COLORS[i]}`
                  : '1px solid rgba(255,255,255,0.08)',
                opacity: !isCorrectOption && !isMyOption ? 0.5 : 1,
              }}
            >
              <span className="answer-letter">{OPTION_LETTERS[i]}</span>
              <span className="flex-1 text-white">{option}</span>
              {isCorrectOption && <span className="text-2xl">✓</span>}
              {isMyOption && !isCorrectOption && <span className="text-2xl">✗</span>}
            </motion.div>
          );
        })}
      </motion.div>

      {/* After image */}
      {question.imageAfter && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="w-full max-w-md w-full mb-6 flex flex-col gap-4"
        >
          {(Array.isArray(question.imageAfter) ? question.imageAfter : [question.imageAfter]).map((imgSrc, idx) => (
            <FullscreenImage key={idx} src={imgSrc} />
          ))}
        </motion.div>
      )}

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="mt-6 text-white/30 font-poppins text-sm"
      >
        Esperando siguiente pregunta…
      </motion.div>
    </AnimatedPage>
  );
}
