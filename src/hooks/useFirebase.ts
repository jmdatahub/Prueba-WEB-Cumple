import { useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../config/firebase';
import { useGameStore } from '../store/gameStore';
import type { GameState, Player, Answer } from '../types/game';
import { PLAYERS } from '../data/players';

export function useFirebase() {
  const { setGameState, setPlayers, setAnswers } = useGameStore();

  useEffect(() => {
    // Listen to game state
    const gameStateRef = ref(db, 'gameState');
    const unsubGameState = onValue(gameStateRef, (snap) => {
      if (snap.exists()) {
        setGameState(snap.val() as GameState);
      }
    });

    // Listen to players
    const playersRef = ref(db, 'players');
    const unsubPlayers = onValue(playersRef, (snap) => {
      if (snap.exists()) {
        setPlayers(snap.val() as Record<string, Player>);
      } else {
        setPlayers({ ...PLAYERS });
      }
    });

    // Listen to answers
    const answersRef = ref(db, 'answers');
    const unsubAnswers = onValue(answersRef, (snap) => {
      if (snap.exists()) {
        setAnswers(snap.val() as Record<string, Record<string, Answer>>);
      } else {
        setAnswers({});
      }
    });

    return () => {
      unsubGameState();
      unsubPlayers();
      unsubAnswers();
    };
  }, [setGameState, setPlayers, setAnswers]);
}
