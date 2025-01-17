'use client';

import { useGame } from '../context/GameContext';
import { useState, useEffect } from 'react';
import SearchSongs from '@/app/games/music-head/components/SearchSongs';
import AudioPlayer from '@/app/games/music-head/components/AudioPlayer';
import SuccessScreen from '@/app/games/music-head/components/SuccessScreen';
import { Song } from '@/app/games/music-head/context/gameLogic';

export default function MusicHead() {
  const { state, dispatch } = useGame();
  const [guess, setGuess] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const [showTryAgain, setShowTryAgain] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle guess submission
  const handleGuess = () => {
    if (!guess) return;
    console.log('guess', guess);
    const normalizedGuess = guess.toLowerCase();
    const normalizedTitle = (state.currentSong?.title || '').toLowerCase();
    const isCorrect =
      normalizedGuess.includes(normalizedTitle) ||
      normalizedTitle.includes(normalizedGuess);

    if (!isCorrect) {
      setShowTryAgain(true);
      setTimeout(() => {
        setShowTryAgain(false);
      }, 2000);
    }

    dispatch({
      type: 'MAKE_GUESS',
      payload: {
        guess,
        isCorrect,
      },
    });

    setGuess('');
  };

  // Handle adding a second to the playback duration
  const handleAddSecond = () => {
    if (state.skipsUsed < 2) {
      dispatch({ type: 'SKIP' });
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
    }
  };

  if (state.gameEnded) {
    return (
      <SuccessScreen
        selectedSong={selectedSong}
        setSelectedSong={setSelectedSong}
      />
    );
  }

  // Ensure the component is mounted before rendering attempts left
  if (!mounted) {
    return null; // or a loading spinner if desired
  }

  return (
    <section className="py-10 text-center h-full font-larken overflow-hidden">
      <div className="mt-5 w-full h-full max-w-3xl mx-auto flex flex-col items-center justify-around">
        <div className="w-full max-w-xs md:max-w-lg mb-4 p-6 rounded-md dark:bg-[#141818] bg-[#F3F3F3] flex flex-col justify-center">
          <AudioPlayer audioSrc={state.currentSong?.previewUrl || ''} />
          <SearchSongs
            guess={guess}
            setGuess={setGuess}
            setSelectedSong={setSelectedSong}
            selectedSong={selectedSong}
          />
          <h3 className="md:text-xl font-semibold mt-4 font-plus-jakarta">
            {showTryAgain ? (
              <span className="text-[#DA4946] px-2 py-1 rounded-sm bg-[#DA4946]/20">
                Try Again!
              </span>
            ) : (
              <span
                className={`${
                  3 - state.incorrectGuesses === 1
                    ? 'text-[#DA4946] bg-[#DA4946]/20'
                    : 'text-[#FF9D12] bg-[#FF9D12]/20'
                } px-2 py-1 rounded-sm`}
              >
                Attempts Left: {3 - state.incorrectGuesses}/3
              </span>
            )}
          </h3>
        </div>

        <div className="flex items-center w-full max-w-xs md:max-w-lg relative z-0 space-x-4">
          <button
            onClick={handleAddSecond}
            className={`relative font-bold px-3 py-6 flex-shrink-0 rounded-md transition-transform duration-300 ${
              state.skipsUsed === 2
                ? 'dark:bg-white/10 dark:text-white bg-black/30 text-white hover:scale-100'
                : 'bg-loudr-yellow2 text-black hover:scale-105'
            }`}
            style={{ flexBasis: '30%' }}
            disabled={state.skipsUsed === 2}
          >
            +1 SEC
            {showTooltip && (
              <div className="absolute left-1/2 -translate-x-1/2 bottom-0 mt-2 bg-[#FF9D12] text-gray-900 px-4 py-2 rounded-lg shadow-lg z-[5000] whitespace-nowrap">
                {2 - state.skipsUsed} skip{state.skipsUsed !== 1 ? 's' : ''}{' '}
                left
              </div>
            )}
          </button>

          <button
            onClick={handleGuess}
            className={`w-full px-3 py-6 font-bold rounded-md transition-all duration-300 hover:scale-105 ${
              guess
                ? 'dark:bg-white dark:text-black bg-black text-white'
                : 'dark:bg-white/10 dark:text-white bg-black/30 text-white'
            }`}
            disabled={!guess || showTryAgain}
          >
            SUBMIT GUESS
          </button>
        </div>
      </div>
    </section>
  );
}
