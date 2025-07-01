import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

import LetterGrid from '@/components/organisms/LetterGrid';
import ScorePanel from '@/components/organisms/ScorePanel';
import WordsList from '@/components/organisms/WordsList';
import TimerDisplay from '@/components/molecules/TimerDisplay';
import GameControls from '@/components/molecules/GameControls';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';

import { useTimer } from '@/hooks/useTimer';
import { useGameState } from '@/hooks/useGameState';
import gameService from '@/services/api/gameService';

const GamePage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bestScore, setBestScore] = useState(0);
  const [gameStats, setGameStats] = useState(null);

  const {
    gameState,
    updateGameState,
    resetGameState,
    addFoundWord,
    selectCell,
    clearSelection
  } = useGameState();

  const {
    timeRemaining,
    isActive: timerActive,
    isPaused,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    stopTimer
  } = useTimer(120);

  // Load initial data
  useEffect(() => {
    loadGameData();
  }, []);

  // Handle timer end
  useEffect(() => {
    if (timerActive && timeRemaining === 0 && gameState.isActive) {
      endGame();
    }
  }, [timeRemaining, timerActive, gameState.isActive]);

  const loadGameData = async () => {
    try {
      const [scores, stats] = await Promise.all([
        gameService.getHighScores(),
        gameService.getGameStats()
      ]);
      
      setBestScore(scores.length > 0 ? scores[0].score : 0);
      setGameStats(stats);
    } catch (err) {
      console.error('Error loading game data:', err);
    }
  };

  const startNewGame = async () => {
    if (gameState.isActive) {
      const confirmed = window.confirm('Are you sure you want to start a new game? Your current progress will be lost.');
      if (!confirmed) return;
    }

    setLoading(true);
    setError('');

    try {
      const gridSize = gameState.difficulty === 'hard' ? 5 : 4;
      const grid = await gameService.generateGrid(gridSize);
      
      // Determine timer duration based on game mode
      let timerDuration = 120; // Classic: 2 minutes
      if (gameState.gameMode === 'extended') {
        timerDuration = 300; // Extended: 5 minutes
      } else if (gameState.gameMode === 'endless') {
        timerDuration = 0; // Endless: no timer
      }

      resetGameState();
      updateGameState({
        grid,
        isActive: true
      });

      if (gameState.gameMode !== 'endless') {
        resetTimer(timerDuration);
        startTimer();
      }

      toast.success('New game started! Good luck!', {
        position: "top-right",
        autoClose: 2000,
      });

    } catch (err) {
      setError('Failed to start new game. Please try again.');
      toast.error('Failed to start game');
    } finally {
      setLoading(false);
    }
  };

  const handleCellSelect = useCallback((row, col) => {
    if (!gameState.isActive || (timerActive && timeRemaining === 0)) return;

    selectCell(row, col);
  }, [gameState.isActive, timerActive, timeRemaining, selectCell]);

  const handleWordFound = useCallback(async (word, points) => {
    // Check if word was already found
    if (gameState.foundWords.some(w => w.word === word)) {
      toast.warning('Word already found!', {
        position: "top-right",
        autoClose: 1500,
      });
      clearSelection();
      return;
    }

    addFoundWord(word, points);
    
    toast.success(`Great! "${word}" found for ${points} points!`, {
      position: "top-right",
      autoClose: 2000,
    });
  }, [gameState.foundWords, addFoundWord, clearSelection]);

  const endGame = async () => {
    if (!gameState.isActive) return;

    updateGameState({ isActive: false });
    stopTimer();

    try {
      // Save high score if it's good enough
      await gameService.saveHighScore(
        gameState.score,
        gameState.foundWords.length,
        gameState.gameMode
      );

      // Update statistics
      await gameService.updateGameStats(
        gameState.score,
        gameState.foundWords.length
      );

      // Check if it's a new best score
      if (gameState.score > bestScore) {
        setBestScore(gameState.score);
        toast.success(`🎉 New best score: ${gameState.score}!`, {
          position: "top-right",
          autoClose: 4000,
        });
      } else {
        toast.success(`Game Over! Final score: ${gameState.score}`, {
          position: "top-right",
          autoClose: 3000,
        });
      }

      // Reload stats
      loadGameData();

    } catch (err) {
      console.error('Error ending game:', err);
      toast.error('Error saving game results');
    }
  };

  const handlePauseResume = () => {
    if (isPaused) {
      resumeTimer();
      toast.info('Game resumed');
    } else {
      pauseTimer();
      toast.info('Game paused');
    }
  };

  const handleDifficultyChange = (newDifficulty) => {
    updateGameState({ difficulty: newDifficulty });
  };

  const handleGameModeChange = (newMode) => {
    updateGameState({ gameMode: newMode });
  };

  if (loading) {
    return <Loading message="Generating new word grid..." />;
  }

  if (error) {
    return (
      <Error
        message={error}
        onRetry={() => {
          setError('');
          startNewGame();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-900 via-slate-900 to-surface-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.header
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-6xl font-display font-bold bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400 bg-clip-text text-transparent mb-2">
            Word Twist
          </h1>
          <p className="text-slate-400 text-lg">
            Find words in the letter grid to score points!
          </p>
        </motion.header>

        {/* Game Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Timer and Controls */}
          <motion.div
            className="lg:order-1 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {gameState.gameMode !== 'endless' && (
              <div className="glass-card p-6 rounded-2xl text-center">
                <TimerDisplay
                  timeRemaining={timeRemaining}
                  isActive={timerActive}
                  isPaused={isPaused}
                  onPause={handlePauseResume}
                  onResume={handlePauseResume}
                />
              </div>
            )}

            <ScorePanel
              score={gameState.score}
              foundWords={gameState.foundWords}
              bestScore={bestScore}
            />
          </motion.div>

          {/* Center Column - Letter Grid */}
          <motion.div
            className="lg:order-2 flex flex-col items-center space-y-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {gameState.grid.length > 0 ? (
              <LetterGrid
                grid={gameState.grid}
                selectedCells={gameState.selectedCells}
                currentWord={gameState.currentWord}
                onCellSelect={handleCellSelect}
                onWordFound={handleWordFound}
                disabled={!gameState.isActive || (timerActive && timeRemaining === 0)}
              />
            ) : (
              <div className="glass-card p-12 rounded-2xl text-center">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Ready to Play?
                </h3>
                <p className="text-slate-400 mb-6">
                  Click "New Game" to start finding words!
                </p>
              </div>
            )}
          </motion.div>

          {/* Right Column - Words List */}
          <motion.div
            className="lg:order-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <WordsList foundWords={gameState.foundWords} />
          </motion.div>
        </div>

        {/* Game Controls */}
        <motion.div
          className="glass-card p-6 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <GameControls
            onNewGame={startNewGame}
            onPause={pauseTimer}
            onResume={resumeTimer}
            isPaused={isPaused}
            isActive={gameState.isActive}
            difficulty={gameState.difficulty}
            onDifficultyChange={handleDifficultyChange}
            gameMode={gameState.gameMode}
            onGameModeChange={handleGameModeChange}
          />
        </motion.div>

        {/* Game Stats */}
        <AnimatePresence>
          {gameStats && (
            <motion.div
              className="glass-card p-6 rounded-2xl mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h3 className="text-lg font-semibold text-white mb-4 text-center">
                Your Statistics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-400">
                    {gameStats.gamesPlayed}
                  </div>
                  <div className="text-sm text-slate-400">Games Played</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary-400">
                    {gameStats.bestScore.toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-400">Best Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-400">
                    {gameStats.averageScore.toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-400">Average Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success-400">
                    {gameStats.totalWordsFound.toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-400">Total Words</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GamePage;