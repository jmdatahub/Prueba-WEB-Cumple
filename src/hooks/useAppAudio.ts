import {
  playHoverSound,
  playClickSound,
  playPopSound,
  playCorrect as playCorrectSynth,
  playWrong as playErrorSynth,
  playFanfare
} from '../utils/sounds';

export const useAppAudio = () => {
  // Play subtle hover tick
  const playHover = () => {
    playHoverSound();
  };

  // Play satisfying UI click
  const playClick = () => {
    playClickSound();
  };

  // Modern pop sound for page transition
  const playPop = () => {
    playPopSound();
  };

  // Correct answer sound
  const playCorrect = () => {
    playCorrectSynth();
  };

  // Incorrect answer / locking sound
  const playError = () => {
    playErrorSynth();
  };

  // Fanfare / win sound
  const playWin = () => {
    playFanfare();
  };

  return {
    playHover,
    playClick,
    playPop,
    playCorrect,
    playError,
    playWin,
  };
};
