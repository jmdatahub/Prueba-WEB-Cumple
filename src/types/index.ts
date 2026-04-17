// Game types for Kahoot Birthday app
export const GAME_VERSION = 2; // Runtime export required to ensure module is not empty

export type GamePhase = "lobby" | "question" | "locked" | "reveal" | "ranking" | "final";

export interface Team {
  id: string;
  name: string;
  color: string;
  totalScore: number;
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  isTaken: boolean;
  score: number;
  correct: number;
  wrong: number;
  unanswered: number;
  lastAnswerTime: number;
}

export interface GameState {
  currentQuestionIndex: number;
  phase: GamePhase;
  questionStartTime: number;
  timeLeft: number;
  dynamicAnswerIndex?: number;
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
  timeLimit: number;
  imageAfter: string | string[] | null;
}

export interface Answer {
  answerIndex: number;
  answeredAt: number;
  isCorrect: boolean;
  points: number;
}
