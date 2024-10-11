import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameState, GameAction } from '../utils/gameLogic';

interface AudioPlayerProps {
  audioSrc: string;
  gameState: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioSrc,
  gameState,
  dispatch,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const waveformBars = 30; // Number of bars in the waveform

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = audioSrc;
      audioRef.current.load();
      audioRef.current.onloadedmetadata = () => {
        setAudioLoaded(true);
      };
      audioRef.current.onerror = (e) => {
        console.error('Error loading audio:', e);
      };
    }
  }, [audioSrc]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      if (gameState.isPlaying) {
        audio
          .play()
          .catch((error) => console.error('Error playing audio:', error));
      } else {
        audio.pause();
      }
    }
  }, [gameState.isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const updatePlaybackTime = () => {
        dispatch({ type: 'UPDATE_PLAYBACK_TIME', payload: audio.currentTime });
        if (audio.currentTime >= gameState.playbackDuration) {
          audio.pause();
          audio.currentTime = 0; // Reset audio to beginning
          dispatch({ type: 'PAUSE' });
          dispatch({ type: 'UPDATE_PLAYBACK_TIME', payload: 0 }); // Reset playback time in game state
        }
      };
      audio.addEventListener('timeupdate', updatePlaybackTime);
      return () => audio.removeEventListener('timeupdate', updatePlaybackTime);
    }
  }, [dispatch, gameState.playbackDuration]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (audio) {
      if (audio.currentTime >= gameState.playbackDuration) {
        audio.currentTime = 0; // Reset audio to beginning if it has reached the end
      }
      dispatch({ type: gameState.isPlaying ? 'PAUSE' : 'PLAY' });
    }
  };

  // Generate random heights for the waveform bars
  const barHeights = Array.from(
    { length: waveformBars },
    () => Math.random() * 0.8 + 0.2
  );

  return (
    <div className="my-4 p-2 sm:p-4 rounded-lg flex flex-row items-center space-x-4">
      <audio ref={audioRef} />
      <button
        onClick={togglePlay}
        className="w-12 h-12 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0"
        disabled={!audioLoaded}
      >
        {gameState.isPlaying ? (
          <span className="text-gray-900 text-xl sm:text-base">■</span>
        ) : (
          <span className="text-gray-900 text-xl sm:text-base ml-1">▶</span>
        )}
      </button>
      <div className="flex-grow h-16 sm:h-20 flex items-center justify-center space-x-1">
        {barHeights.map((height, index) => (
          <div
            key={index}
            className="w-1 sm:w-2 rounded-full transition-all duration-200"
            style={{
              height: `${height * 100}%`,
              backgroundColor:
                gameState.currentPlaybackTime / gameState.playbackDuration >
                index / waveformBars
                  ? 'white'
                  : 'rgba(255, 255, 255, 0.3)',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AudioPlayer;
