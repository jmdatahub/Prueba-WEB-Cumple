import { create } from 'zustand';
import { ref, update, onValue } from 'firebase/database';
import { db } from '../config/firebase';
import type { Player, GameState, GamePhase, Answer } from '../types/game';
import { PLAYERS } from '../data/players';
import { QUESTIONS } from '../data/questions';
import { calculateScore } from '../utils/scoring';

interface GameStore {
  // Local state
  currentPlayerId: string | null;
  isHost: boolean;
  localAnswers: Record<number, number>; // questionIndex -> answerIndex

  // Firebase-synced state
  gameState: GameState;
  players: Record<string, Player>;
  answers: Record<string, Record<string, Answer>>;

  // Firebase setters (called by listeners)
  setGameState: (gs: GameState) => void;
  setPlayers: (players: Record<string, Player>) => void;
  setAnswers: (answers: Record<string, Record<string, Answer>>) => void;

  // Local actions
  setCurrentPlayerId: (id: string | null) => void;
  setIsHost: (isHost: boolean) => void;
  recordLocalAnswer: (questionIndex: number, answerIndex: number) => void;

  // Firebase actions — player
  claimPlayer: (playerId: string) => Promise<void>;
  unclaimPlayer: () => Promise<void>;
  submitAnswer: (answerIndex: number) => Promise<void>;

  // Firebase actions — host
  startGame: () => Promise<void>;
  lockQuestion: () => Promise<void>;
  revealAnswer: (overrideIndex?: number) => Promise<void>;
  showRanking: () => Promise<void>;
  nextQuestion: () => Promise<void>;
  previousQuestion: () => Promise<void>;
  showFinal: () => Promise<void>;
  resetGame: () => Promise<void>;
}

const defaultGameState: GameState = {
  phase: 'lobby',
  currentQuestionIndex: 0,
  questionStartTime: 0,
  timeLeft: 0,
};

export const useGameStore = create<GameStore>((set, get) => ({
  currentPlayerId: null,
  isHost: false,
  localAnswers: {},
  gameState: defaultGameState,
  players: { ...PLAYERS },
  answers: {},

  setGameState: (gameState) => set({ gameState }),
  setPlayers: (players) => set({ players }),
  setAnswers: (answers) => set({ answers }),

  setCurrentPlayerId: (id) => {
    set({ currentPlayerId: id });
    if (id) localStorage.setItem('playerId', id);
    else localStorage.removeItem('playerId');
  },

  setIsHost: (isHost) => {
    set({ isHost });
    if (isHost) localStorage.setItem('isHost', 'true');
    else localStorage.removeItem('isHost');
  },

  recordLocalAnswer: (questionIndex, answerIndex) =>
    set((s) => ({ localAnswers: { ...s.localAnswers, [questionIndex]: answerIndex } })),

  claimPlayer: async (playerId) => {
    const player = get().players[playerId];
    if (!player || player.isTaken) return;
    await update(ref(db, `players/${playerId}`), { isTaken: true });
    get().setCurrentPlayerId(playerId);
  },

  unclaimPlayer: async () => {
    const { currentPlayerId } = get();
    if (!currentPlayerId) return;
    await update(ref(db, `players/${currentPlayerId}`), { isTaken: false });
    get().setCurrentPlayerId(null);
  },

  submitAnswer: async (answerIndex) => {
    const { currentPlayerId, gameState, players, localAnswers } = get();
    if (!currentPlayerId) return;
    if (localAnswers[gameState.currentQuestionIndex] !== undefined) return; // already answered

    const question = QUESTIONS[gameState.currentQuestionIndex];
    const isDynamic = question.correctIndex === -1;
    const noScore = !!question.noScore;
    const timeLeft = question.timeLimit === 0 ? -1 : Math.max(
      0,
      question.timeLimit - Math.floor((Date.now() - gameState.questionStartTime) / 1000)
    );
    const isCorrect = isDynamic ? false : answerIndex === question.correctIndex;
    const points = (isDynamic || noScore) ? 0 : calculateScore(isCorrect, timeLeft, question.timeLimit);

    const answer: Answer = {
      answerIndex,
      answeredAt: Date.now(),
      isCorrect,
      points,
    };

    const fbUpdates: Record<string, unknown> = {
      [`answers/${gameState.currentQuestionIndex}/${currentPlayerId}`]: answer,
    };

    // Only update player stats when the question actually scores
    if (!noScore) {
      const currentPlayer = players[currentPlayerId];
      const newScore = (currentPlayer?.score || 0) + points;
      const newCorrect = (currentPlayer?.correct || 0) + (isCorrect ? 1 : 0);
      const newWrong = (currentPlayer?.wrong || 0) + (!isCorrect && !isDynamic ? 1 : 0);
      fbUpdates[`players/${currentPlayerId}/score`] = newScore;
      fbUpdates[`players/${currentPlayerId}/correct`] = newCorrect;
      fbUpdates[`players/${currentPlayerId}/wrong`] = newWrong;
      fbUpdates[`players/${currentPlayerId}/lastAnswerTime`] = Date.now();
    }

    await update(ref(db), fbUpdates);
    get().recordLocalAnswer(gameState.currentQuestionIndex, answerIndex);
  },

  startGame: async () => {
    const { players } = get();
    const playersReset: Record<string, Partial<Player>> = {};
    Object.keys(players).forEach((id) => {
      playersReset[id] = { score: 0, correct: 0, wrong: 0, unanswered: 0, lastAnswerTime: 0 };
    });

    const updates: Record<string, unknown> = {
      'gameState/phase': 'question' as GamePhase,
      'gameState/currentQuestionIndex': 0,
      'gameState/questionStartTime': Date.now(),
      'gameState/timeLeft': QUESTIONS[0].timeLimit,
      'answers': null,
    };

    Object.keys(playersReset).forEach((id) => {
      Object.entries(playersReset[id]).forEach(([field, value]) => {
        updates[`players/${id}/${field}`] = value;
      });
    });

    await update(ref(db), updates);
  },

  lockQuestion: async () => {
    await update(ref(db, 'gameState'), { phase: 'locked' as GamePhase });
  },

  revealAnswer: async (overrideIndex?: number) => {
    // Mark unanswered players
    const { players, gameState, answers } = get();
    const answerMap = answers[gameState.currentQuestionIndex] || {};
    const question = QUESTIONS[gameState.currentQuestionIndex];
    
    const updates: Record<string, unknown> = { 'gameState/phase': 'reveal' as GamePhase };

    if (overrideIndex !== undefined && question.correctIndex === -1) {
      updates['gameState/dynamicAnswerIndex'] = overrideIndex;
      
      for (const [playerId, ans] of Object.entries(answerMap)) {
        const p = players[playerId];
        if (!p) continue;
        
        const isCorrect = ans.answerIndex === overrideIndex;
        const answerTimeLeft = question.timeLimit === 0 ? -1 : Math.max(0, question.timeLimit - Math.floor((ans.answeredAt - gameState.questionStartTime) / 1000));
        const finalPoints = calculateScore(isCorrect, answerTimeLeft, question.timeLimit);
        
        updates[`answers/${gameState.currentQuestionIndex}/${playerId}/isCorrect`] = isCorrect;
        updates[`answers/${gameState.currentQuestionIndex}/${playerId}/points`] = finalPoints;
        
        updates[`players/${playerId}/score`] = (p.score || 0) + finalPoints;
        updates[`players/${playerId}/correct`] = (p.correct || 0) + (isCorrect ? 1 : 0);
        updates[`players/${playerId}/wrong`] = (p.wrong || 0) + (!isCorrect ? 1 : 0);
      }
    }

    Object.keys(players).forEach((id) => {
      if (!question.noScore && players[id].isTaken && !answerMap[id]) {
        updates[`players/${id}/unanswered`] = (players[id].unanswered || 0) + 1;
      }
    });

    await update(ref(db), updates);
  },

  showRanking: async () => {
    await update(ref(db, 'gameState'), { phase: 'ranking' as GamePhase });
  },

  nextQuestion: async () => {
    const { gameState } = get();
    const nextIndex = gameState.currentQuestionIndex + 1;
    if (nextIndex >= QUESTIONS.length) {
      await get().showFinal();
      return;
    }
    await update(ref(db, 'gameState'), {
      phase: 'question' as GamePhase,
      currentQuestionIndex: nextIndex,
      questionStartTime: Date.now(),
      timeLeft: QUESTIONS[nextIndex].timeLimit,
      dynamicAnswerIndex: null,
    });
  },

  previousQuestion: async () => {
    const { gameState } = get();
    const prevIndex = gameState.currentQuestionIndex - 1;
    if (prevIndex < 0) return;
    await update(ref(db, 'gameState'), {
      phase: 'question' as GamePhase,
      currentQuestionIndex: prevIndex,
      questionStartTime: Date.now(),
      timeLeft: QUESTIONS[prevIndex].timeLimit,
      dynamicAnswerIndex: null,
    });
  },

  showFinal: async () => {
    await update(ref(db, 'gameState'), { phase: 'final' as GamePhase });
  },

  resetGame: async () => {
    const playersReset: Record<string, unknown> = {};
    Object.values(PLAYERS).forEach((p) => {
      playersReset[`players/${p.id}`] = { ...p };
    });
    await update(ref(db), {
      gameState: defaultGameState,
      answers: null,
      ...playersReset,
    });
  },
}));
