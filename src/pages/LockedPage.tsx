import React from 'react';
import { useGameStore } from '../store/gameStore';
import { QUESTIONS } from '../data/questions';
import { AnimatedPage } from '../components/AnimatedPage';

const OPTION_COLORS = ['#e74c3c', '#3498db', '#f1c40f', '#2ecc71'];
const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export default function LockedPage() {
  const { gameState, currentPlayerId, localAnswers, players, answers } = useGameStore();
  const question = QUESTIONS[gameState.currentQuestionIndex];
  const myAnswer = localAnswers[gameState.currentQuestionIndex];
  const answered = myAnswer !== undefined;

  const playerList = Object.values(players).filter((p) => p.isTaken);
  const connectedCount = playerList.length;
  const currentAnswers = answers[gameState.currentQuestionIndex] || {};
  const answeredCount = Object.keys(currentAnswers).length;

  if (!question) return null;

  return (
    <AnimatedPage 
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative w-full h-[100dvh]"
      style={{ background: 'linear-gradient(135deg, #080813 0%, #0d0d2e 50%, #080813 100%)' }}
    >

      <div className="animate-bounce-in">
        {answered ? (
          <>
            <div className="text-6xl mb-4">⏳</div>
            <h2 className="font-poppins font-black text-2xl text-white mb-2">
              ¡Respuesta enviada!
            </h2>
            <p className="text-white/40 font-poppins text-sm mb-6">
              Esperando al host…
            </p>

            <div className="mb-8 inline-block px-4 py-2 rounded-full bg-white/10 border border-white/20 font-bold font-poppins text-white/90 text-sm">
              {answeredCount} / {connectedCount} respondieron
            </div>

            {/* Show chosen answer */}
            <div
              className="rounded-2xl py-4 px-6 inline-flex items-center gap-3 font-bold font-poppins text-white text-base"
              style={{ background: OPTION_COLORS[myAnswer] + 'cc' }}
            >
              <span className="answer-letter">{OPTION_LETTERS[myAnswer]}</span>
              <span>{question.options[myAnswer]}</span>
            </div>
          </>
        ) : (
          <>
            <div className="text-6xl mb-4">⏰</div>
            <h2 className="font-poppins font-black text-2xl text-white mb-2">
              ¡Tiempo finalizado!
            </h2>
            <p className="text-white/40 font-poppins text-sm mb-6">
              Ya no puedes responder
            </p>

            <div className="inline-block px-4 py-2 rounded-full bg-white/10 border border-white/20 font-bold font-poppins text-white/90 text-sm">
              {answeredCount} / {connectedCount} respondieron
            </div>
          </>
        )}
      </div>

      {/* Waiting dots */}
      <div className="flex gap-2 mt-10">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </AnimatedPage>
  );
}

