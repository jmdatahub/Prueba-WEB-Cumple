import React, { useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useGameStore } from '../store/gameStore';
import { TEAMS } from '../data/players';
import { QUESTIONS } from '../data/questions';
import Timer from '../components/Timer';
import { useTimer } from '../hooks/useTimer';
import { getSortedPlayers, getTeamScore } from '../utils/scoring';
import FullscreenImage from '../components/FullscreenImage';
import FullscreenVideo from '../components/FullscreenVideo';
import { AnimatedPage } from '../components/AnimatedPage';
import { AnimatedButton } from '../components/AnimatedButton';
import { AnimatedNumber } from '../components/AnimatedNumber';

const OPTION_COLORS = ['#e74c3c', '#3498db', '#f1c40f', '#2ecc71'];
const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

const HIDE_TEAMS_AFTER = 4;

export default function HostPage() {
  const {
    gameState, players, answers,
    startGame, lockQuestion, revealAnswer,
    showRanking, nextQuestion, previousQuestion, showFinal, resetGame, setIsHost,
  } = useGameStore();

  const handleReset = async () => {
    await resetGame();
    setIsHost(false);
  };

  const question = QUESTIONS[gameState.currentQuestionIndex];
  const { timeLeft, timeLimit } = useTimer(gameState.questionStartTime, gameState.currentQuestionIndex);

  // Auto-lock when timer reaches 0
  useEffect(() => {
    if (gameState.phase === 'question' && timeLimit > 0 && timeLeft === 0) {
      lockQuestion();
    }
  }, [timeLeft, timeLimit, gameState.phase]);

  const playerList = Object.values(players).filter((p) => p.isTaken);
  const sorted = getSortedPlayers(playerList);
  const teamRankings = Object.values(TEAMS)
    .map((t) => ({ ...t, score: getTeamScore(t.id, players) }))
    .sort((a, b) => b.score - a.score);

  const winnerTeam = teamRankings[0];

  const connectedCount = playerList.length;
  const currentAnswers = answers[gameState.currentQuestionIndex] || {};
  const answeredCount = Object.keys(currentAnswers).length;

  const isLast = gameState.currentQuestionIndex >= QUESTIONS.length - 1;
  const showTeamScores = gameState.currentQuestionIndex < HIDE_TEAMS_AFTER;

  return (
    <AnimatedPage className="min-h-screen bg-dark-900 text-white font-poppins overflow-y-auto w-full relative">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-dark-800 border-b border-white/10 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Back button — visible in all in-game phases except first question */}
          {gameState.currentQuestionIndex > 0 && gameState.phase !== 'lobby' && gameState.phase !== 'final' && (
            <AnimatedButton
              onClick={previousQuestion}
              soundType="click"
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-white/60 hover:text-white text-xs font-bold transition-colors"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              ← P{gameState.currentQuestionIndex}
            </AnimatedButton>
          )}
          {!isLast && gameState.phase !== 'lobby' && gameState.phase !== 'final' && (
            <AnimatedButton
              onClick={nextQuestion}
              soundType="click"
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-white/60 hover:text-white text-xs font-bold transition-colors"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              P{gameState.currentQuestionIndex + 2} →
            </AnimatedButton>
          )}
          <span className="text-2xl">👑</span>
          <div className="flex items-center">
            <span className="font-black text-lg mt-0.5">Host Control</span>
            {(gameState.phase === 'question' || gameState.phase === 'locked') ? (
              <span className="ml-3 px-2.5 py-1 rounded-md bg-green-500/20 text-green-400 font-bold text-xs mt-1 border border-green-500/30">
                {answeredCount}/{connectedCount} Votos
              </span>
            ) : (
              <span className="ml-3 text-xs text-white/40 font-normal mt-1">
                {connectedCount}/18 jugadores
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Phase badge */}
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
            style={{
              background: gameState.phase === 'lobby' ? '#6366f1' :
                gameState.phase === 'question' ? '#22c55e' :
                gameState.phase === 'reveal' ? '#f97316' :
                gameState.phase === 'ranking' ? '#3b82f6' :
                gameState.phase === 'final' ? '#a855f7' : '#475569',
            }}>
            {gameState.phase}
          </span>
          <AnimatedButton
            onClick={handleReset}
            soundType="click"
            className="text-white/20 hover:text-red-400 text-xs px-2 py-1 transition-colors"
          >
            Reset
          </AnimatedButton>
        </div>
      </div>

      <div className="p-6 max-w-5xl mx-auto">
        {/* ═══ LOBBY ═══ */}
        {gameState.phase === 'lobby' && (
          <div className="flex flex-col lg:flex-row gap-6">

            {/* ── LEFT: QR + Counter ── */}
            <div className="flex flex-col items-center justify-center lg:w-72 shrink-0">
              <p className="font-black text-2xl text-white mb-1 tracking-tight text-center">¡Únete a la partida!</p>
              <p className="text-white/40 font-poppins text-sm mb-5 text-center">Escanea con tu móvil 📱</p>

              {/* QR Card */}
              <div
                className="rounded-3xl p-5 mb-6 flex items-center justify-center relative"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '2px solid rgba(255,255,255,0.15)',
                  boxShadow: '0 0 40px rgba(168,85,247,0.25), inset 0 1px 0 rgba(255,255,255,0.1)',
                }}
              >
                {/* Glow ring */}
                <div className="absolute inset-0 rounded-3xl opacity-20 animate-pulse"
                  style={{ background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)' }} />
                <div className="relative z-10 rounded-2xl overflow-hidden p-2" style={{ background: '#fff' }}>
                  <QRCodeSVG
                    value="https://testeo-claude-cumpleanos.vercel.app/"
                    size={200}
                    bgColor="#ffffff"
                    fgColor="#1a0533"
                    level="M"
                  />
                </div>
              </div>

              {/* Player Counter */}
              <div
                className="w-full rounded-2xl px-6 py-5 text-center relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.2))',
                  border: '1px solid rgba(168,85,247,0.4)',
                }}
              >
                <div className="absolute inset-0 opacity-5"
                  style={{ background: 'radial-gradient(circle at bottom right, #a855f7, transparent 70%)' }} />
                <div className="font-black text-white relative z-10" style={{ fontSize: '3.5rem', lineHeight: 1 }}>
                  {connectedCount}
                  <span className="text-white/30 font-bold" style={{ fontSize: '1.5rem' }}> / 18</span>
                </div>
                <div className="text-white/50 font-poppins font-semibold text-xs uppercase tracking-widest mt-1 relative z-10">
                  Jugadores conectados
                </div>
                {/* Progress bar */}
                <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden relative z-10">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${(connectedCount / 18) * 100}%`,
                      background: 'linear-gradient(90deg, #6366f1, #a855f7)',
                      boxShadow: '0 0 8px rgba(168,85,247,0.6)',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* ── RIGHT: Player Grid + Start ── */}
            <div className="flex-1 flex flex-col">
              <h2 className="font-black text-xl mb-4 text-white/70 tracking-tight">Jugadores</h2>
              <div className="grid grid-cols-3 gap-2.5 mb-6 flex-1">
                {Object.values(players).map((p) => {
                  const t = TEAMS[p.teamId];
                  return (
                    <div key={p.id}
                      className={`rounded-xl py-3 px-3 text-sm font-semibold flex items-center gap-2 transition-all duration-300
                        ${p.isTaken ? 'opacity-100 scale-100' : 'opacity-20 scale-95'}`}
                      style={{
                        background: p.isTaken ? `${t?.color}25` : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${p.isTaken ? t?.color + '50' : 'rgba(255,255,255,0.06)'}`,
                      }}
                    >
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: t?.color }} />
                      <span className="truncate text-white">{p.name}</span>
                      {p.isTaken && <span className="ml-auto text-green-400 text-xs shrink-0">✓</span>}
                    </div>
                  );
                })}
              </div>

              <AnimatedButton
                onClick={startGame}
                soundType="correct"
                className="w-full py-5 rounded-2xl font-black text-xl text-white mt-auto"
                style={{
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  boxShadow: '0 0 30px rgba(34, 197, 94, 0.4)',
                }}
              >
                🚀 ¡Empezar Partida! ({connectedCount} jugadores)
              </AnimatedButton>
            </div>
          </div>
        )}

        {/* ═══ QUESTION ═══ */}
        {(gameState.phase === 'question' || gameState.phase === 'locked') && question && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-white/50 text-sm block">
                  {question.label ?? `Pregunta ${gameState.currentQuestionIndex + 1}`}
                </span>
                {question.noScore && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(253,224,71,0.15)', color: '#fde047', border: '1px solid rgba(253,224,71,0.3)' }}>
                    ⭐ Sin puntuación
                  </span>
                )}
              </div>
              {gameState.phase === 'question' && (
                <div className="flex items-center gap-3">
                  <Timer timeLeft={timeLeft} timeLimit={timeLimit} />
                </div>
              )}
              {gameState.phase === 'locked' && (
                <div className="flex items-center gap-3">
                  <span className="text-yellow-400 font-bold">⏸ Bloqueado</span>
                </div>
              )}
            </div>

            {/* Question text */}
            <div className="rounded-3xl p-6 mb-4 text-center"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <p className="font-black text-2xl md:text-3xl text-white leading-snug">{question.text}</p>
            </div>

            <div className="flex justify-center mb-5">
              <div className="px-5 py-2 rounded-full bg-white/10 border border-white/20 font-poppins font-bold text-white text-lg tracking-wide shadow-lg">
                {answeredCount} / {connectedCount} respondieron
              </div>
            </div>

            {/* Story cards — only shown when the question has storyCards defined */}
            {question.storyCards && (
              <div className="grid grid-cols-3 gap-4 mb-5">
                {question.storyCards.map((card, i) => (
                  <div
                    key={i}
                    className="rounded-2xl p-4"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
                  >
                    <div className="text-3xl mb-2">{card.emoji}</div>
                    <div className="font-black text-white text-sm mb-2 tracking-tight">{card.title}</div>
                    <p className="text-white/60 text-xs leading-relaxed">{card.text}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Options grid */}
            <div className="flex flex-col gap-3 mb-6">
              {question.options.map((opt, i) => {
                const answerCount = Object.values(currentAnswers).filter((a) => a.answerIndex === i).length;
                const pct = connectedCount > 0 ? Math.round((answerCount / connectedCount) * 100) : 0;
                return (
                  <div key={i}
                    className="rounded-2xl px-5 py-4"
                    style={{ background: `${OPTION_COLORS[i]}cc` }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-black text-lg">{OPTION_LETTERS[i]}</span>
                      <span className="font-bold flex-1">{opt}</span>
                      {gameState.phase === 'locked' && (
                        <span className="font-black">{answerCount}</span>
                      )}
                    </div>
                    {gameState.phase === 'locked' && (
                      <div className="h-2 rounded-full bg-black/30 overflow-hidden">
                        <div className="h-full rounded-full bg-white/60 transition-all duration-500"
                          style={{ width: `${pct}%` }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Controls */}
            <div className="flex gap-3">
              {gameState.phase === 'question' && (
                <AnimatedButton onClick={lockQuestion}
                  soundType="click"
                  className="flex-1 py-4 rounded-2xl font-bold text-white"
                  style={{ background: '#f59e0b' }}>
                  ⏸ Bloquear
                </AnimatedButton>
              )}
              {gameState.phase === 'locked' && question.correctIndex !== -1 && (
                <AnimatedButton onClick={() => revealAnswer()}
                  soundType="correct"
                  className="flex-1 py-4 rounded-2xl font-bold text-white text-lg"
                  style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)',
                    boxShadow: '0 0 20px rgba(249, 115, 22, 0.4)' }}>
                  🎯 Revelar Respuesta
                </AnimatedButton>
              )}
              {gameState.phase === 'locked' && question.correctIndex === -1 && (
                <div className="flex-1 flex flex-col gap-2">
                  <p className="text-center font-bold text-yellow-400 mb-1 text-sm animate-pulse">¿Cuál fue la buena?</p>
                  <div className="grid grid-cols-2 gap-2">
                    {question.options.map((opt, i) => (
                      <AnimatedButton key={i} onClick={() => revealAnswer(i)}
                        className="py-3 rounded-xl font-bold text-white text-sm hover:brightness-110"
                        soundType="correct"
                        style={{ background: OPTION_COLORS[i % OPTION_COLORS.length] }}>
                        Es la {OPTION_LETTERS[i]}
                      </AnimatedButton>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══ REVEAL ═══ */}
        {gameState.phase === 'reveal' && question && (
          <div>
            <h2 className="font-black text-2xl mb-4 text-center">Respuesta Correcta</h2>
            {(() => {
              const actualCorrectIndex = gameState.dynamicAnswerIndex ?? question.correctIndex;
              return (
                <>
                  <div className="rounded-3xl px-5 py-4 mb-5 flex items-center gap-3"
                    style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
                    <span className="answer-letter">{OPTION_LETTERS[actualCorrectIndex]}</span>
                    <span className="font-black text-xl text-white">{question.options[actualCorrectIndex]}</span>
                    <span className="ml-auto text-3xl">✓</span>
                  </div>

                  {/* Answer breakdown */}
                  <div className="flex flex-col gap-3 mb-5">
                    {question.options.map((opt, i) => {
                      const cnt = Object.values(currentAnswers).filter((a) => a.answerIndex === i).length;
                      return (
                        <div key={i} className="rounded-2xl px-4 py-3"
                          style={{ background: i === actualCorrectIndex ? '#22c55e30' : 'rgba(255,255,255,0.05)',
                            border: i === actualCorrectIndex ? '1px solid #22c55e' : '1px solid rgba(255,255,255,0.08)' }}>
                          <span className="font-bold text-sm text-white">{OPTION_LETTERS[i]}. {opt}</span>
                          <span className="float-right font-black text-white">{cnt}</span>
                        </div>
                      );
                    })}
                  </div>
                </>
              );
            })()}

            {question.imageAfter && (
              <div className="flex flex-col gap-4 w-full mb-5">
                {(Array.isArray(question.imageAfter) ? question.imageAfter : [question.imageAfter]).map((imgSrc, idx) => (
                  <FullscreenImage key={idx} src={imgSrc} />
                ))}
              </div>
            )}

            {question.videoAfter && (
              <div className="w-full mb-5">
                <FullscreenVideo src={question.videoAfter} />
              </div>
            )}

            <AnimatedButton onClick={showRanking}
              soundType="click"
              className="w-full py-4 rounded-2xl font-bold text-lg text-white"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
              📊 Ver Ranking
            </AnimatedButton>
          </div>
        )}

        {/* ═══ RANKING ═══ */}
        {gameState.phase === 'ranking' && (
          <div>
            <h2 className="font-black text-2xl mb-5 text-center">🏆 Ranking</h2>
            <div className="flex gap-4 mb-6">
              {/* Player ranking */}
              <div className="flex-1">
                {sorted.slice(0, 10).map((p, i) => {
                  const t = TEAMS[p.teamId];
                  return (
                    <div key={p.id} className="flex items-center gap-2 py-2 border-b border-white/5">
                      <span className="w-6 font-black text-white/40 text-sm">
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                      </span>
                      <div className="w-2 h-2 rounded-full" style={{ background: t?.color }} />
                      <span className="flex-1 font-semibold text-sm text-white truncate">{p.name}</span>
                      <AnimatedNumber value={p.score} className="font-black text-sm text-white" />
                    </div>
                  );
                })}
              </div>
              {/* Teams */}
              <div className="w-36 md:w-40 flex flex-col gap-3">
                {teamRankings.map((t, i) => (
                  <div key={t.id} className="glass-panel text-right rounded-[1rem] px-4 py-3 relative overflow-hidden"
                    style={{
                      borderRight: `3px solid ${t.color}`,
                    }}>
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: `linear-gradient(270deg, ${t.color}, transparent)` }} />
                    <div className="font-poppins font-bold text-xs mb-1 uppercase tracking-wider z-10 relative" style={{ color: t.color }}>{t.name}</div>
                    <div className="font-black text-white text-xl z-10 relative">
                      {showTeamScores ? <AnimatedNumber value={t.score} /> : '?'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
               <AnimatedButton onClick={nextQuestion}
                soundType="click"
                className="flex-1 py-4 rounded-2xl font-bold text-lg text-white"
                style={{ background: isLast ? 'linear-gradient(135deg, #a855f7, #7c3aed)' : 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
                {isLast ? '🎉 Ver Final' : '➡️ Siguiente Pregunta'}
              </AnimatedButton>
            </div>
          </div>
        )}

      </div>
    </AnimatedPage>
  );
}

