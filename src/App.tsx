import React, { useEffect, useState } from 'react';
import { useFirebase } from './hooks/useFirebase';
import { useGameStore } from './store/gameStore';
import { AnimatePresence } from 'framer-motion';
import IntroPage from './pages/IntroPage';
import SelectPlayerPage from './pages/SelectPlayerPage';
import LobbyPage from './pages/LobbyPage';
import QuestionPage from './pages/QuestionPage';
import LockedPage from './pages/LockedPage';
import RevealPage from './pages/RevealPage';
import RankingPage from './pages/RankingPage';
import FinalPage from './pages/FinalPage';
import HostPage from './pages/HostPage';
import { AnimatedBackground } from './components/AnimatedBackground';
import { unlockAudio } from './utils/sounds';

export default function App() {
  // Set up Firebase real-time listeners
  useFirebase();

  const { gameState, currentPlayerId, isHost, localAnswers, setCurrentPlayerId, setIsHost, players } = useGameStore();
  const [showIntro, setShowIntro] = useState(true);

  // ── Audio unlock for mobile ──────────────────────────────────────────────
  // iOS and Android require a user gesture before AudioContext can play sound.
  // We listen for the first touchstart/click globally and call unlockAudio()
  // once, then remove the listeners so they don't run on every interaction.
  useEffect(() => {
    const unlock = () => {
      unlockAudio();
      window.removeEventListener('touchstart', unlock, true);
      window.removeEventListener('click', unlock, true);
    };
    window.addEventListener('touchstart', unlock, true);
    window.addEventListener('click', unlock, true);
    return () => {
      window.removeEventListener('touchstart', unlock, true);
      window.removeEventListener('click', unlock, true);
    };
  }, []);

  // Restore session from localStorage on mount
  useEffect(() => {
    const savedPlayerId = localStorage.getItem('playerId');
    const savedHost = localStorage.getItem('isHost');

    if (savedHost === 'true') {
      setIsHost(true);
    } else if (savedPlayerId) {
      setCurrentPlayerId(savedPlayerId);
      setShowIntro(false);
    }
  }, []);

  // Sync player claim state (re-verify player is still taken in Firebase)
  useEffect(() => {
    if (currentPlayerId && players[currentPlayerId] && !players[currentPlayerId].isTaken) {
      // Player was reset — clear local session
      setCurrentPlayerId(null);
      localStorage.removeItem('playerId');
      setShowIntro(true);
    }
  }, [players, currentPlayerId]);

  // When game resets to lobby and player has no ID, go back to intro screen
  useEffect(() => {
    if (gameState.phase === 'lobby' && !currentPlayerId && !isHost) {
      setShowIntro(true);
    }
  }, [gameState.phase, isHost]);

  // Determine which page to render based on state
  const renderCurrentPage = () => {
    // ─── HOST ───────────────────────────────────────────
    if (isHost) {
      if (gameState.phase === 'final') {
        return <FinalPage key="final-host" />;
      }
      return <HostPage key="host" />;
    }

    // ─── PLAYER ─────────────────────────────────────────
    if (!currentPlayerId) {
      if (showIntro) {
        return <IntroPage key="intro" onStart={() => setShowIntro(false)} />;
      }
      return <SelectPlayerPage key="selectPlayer" />;
    }

    // Player has selected — route by phase
    switch (gameState.phase) {
      case 'lobby':
        return <LobbyPage key="lobby" />;
      case 'question':
        // If player already answered this question, show locked screen
        if (localAnswers[gameState.currentQuestionIndex] !== undefined) {
          return <LockedPage key="locked" />;
        }
        return <QuestionPage key="question" />;
      case 'locked':
        return <LockedPage key="lockedPhase" />;
      case 'reveal':
        return <RevealPage key="reveal" />;
      case 'ranking':
        return <RankingPage key="ranking" />;
      case 'final':
        return <FinalPage key="final" />;
      default:
        return <LobbyPage key="lobbyDefault" />;
    }
  };

  return (
    <>
      <AnimatedBackground />
      <AnimatePresence mode="wait">
        {renderCurrentPage()}
      </AnimatePresence>
    </>
  );
}
