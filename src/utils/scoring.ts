export const BASE_POINTS = 1000;
export const WRONG_PENALTY = -100;
export const MIN_CORRECT_POINTS = 100;

/**
 * Calculate score for a question answer.
 * Correct: 100-1000 points based on speed
 * Wrong: -100 penalty
 * No answer: 0
 */
export function calculateScore(isCorrect: boolean, timeLeft: number, timeLimit: number): number {
  if (!isCorrect) return WRONG_PENALTY;
  if (timeLimit === 0) return BASE_POINTS;
  const ratio = timeLeft / timeLimit;
  return Math.max(MIN_CORRECT_POINTS, Math.round(BASE_POINTS * ratio));
}

/** Get team total score from player list */
export function getTeamScore(
  teamId: string,
  players: Record<string, { teamId: string; score: number }>
): number {
  return Object.values(players)
    .filter((p) => p.teamId === teamId)
    .reduce((sum, p) => sum + (p.score || 0), 0);
}

/** Sort players by score descending */
export function getSortedPlayers<T extends { score: number }>(players: T[]): T[] {
  return [...players].sort((a, b) => b.score - a.score);
}
