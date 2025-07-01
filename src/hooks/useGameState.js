import { useState, useCallback } from 'react';

export const useGameState = () => {
  const [gameState, setGameState] = useState({
    grid: [],
    selectedCells: [],
    currentWord: '',
    foundWords: [],
    score: 0,
    gameMode: 'classic',
    isActive: false,
    difficulty: 'medium'
  });

  const updateGameState = useCallback((updates) => {
    setGameState(prev => ({ ...prev, ...updates }));
  }, []);

  const resetGameState = useCallback(() => {
    setGameState({
      grid: [],
      selectedCells: [],
      currentWord: '',
      foundWords: [],
      score: 0,
      gameMode: 'classic',
      isActive: false,
      difficulty: 'medium'
    });
  }, []);

  const addFoundWord = useCallback((word, points) => {
    setGameState(prev => ({
      ...prev,
      foundWords: [...prev.foundWords, { word, points, timestamp: Date.now() }],
      score: prev.score + points,
      selectedCells: [],
      currentWord: ''
    }));
  }, []);

  const selectCell = useCallback((row, col) => {
    setGameState(prev => {
      const cellIndex = prev.selectedCells.findIndex(([r, c]) => r === row && c === col);
      
      if (cellIndex !== -1) {
        // Cell already selected - remove it and all cells after it
        const newSelectedCells = prev.selectedCells.slice(0, cellIndex);
        const newCurrentWord = newSelectedCells.map(([r, c]) => prev.grid[r][c]).join('');
        return {
          ...prev,
          selectedCells: newSelectedCells,
          currentWord: newCurrentWord
        };
      } else {
        // Add new cell
        const newSelectedCells = [...prev.selectedCells, [row, col]];
        const newCurrentWord = newSelectedCells.map(([r, c]) => prev.grid[r][c]).join('');
        return {
          ...prev,
          selectedCells: newSelectedCells,
          currentWord: newCurrentWord
        };
      }
    });
  }, []);

  const clearSelection = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      selectedCells: [],
      currentWord: ''
    }));
  }, []);

  return {
    gameState,
    updateGameState,
    resetGameState,
    addFoundWord,
    selectCell,
    clearSelection
  };
};