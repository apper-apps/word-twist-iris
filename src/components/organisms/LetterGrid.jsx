import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LetterTile from '@/components/atoms/LetterTile';
import ScoreBurst from '@/components/atoms/ScoreBurst';
import gameService from '@/services/api/gameService';

const LetterGrid = ({ 
  grid, 
  selectedCells, 
  currentWord, 
  onCellSelect, 
  onWordFound, 
  disabled = false 
}) => {
  const [scoreBursts, setScoreBursts] = useState([]);
  const [isValidating, setIsValidating] = useState(false);

  // Check if current selection forms a valid word
  useEffect(() => {
    const validateCurrentWord = async () => {
      if (currentWord.length >= 3 && !isValidating) {
        setIsValidating(true);
        
        try {
          const isValidPath = gameService.isValidPath(selectedCells);
          if (isValidPath) {
            const validation = await gameService.validateWord(currentWord);
            if (validation.isValid) {
              // Word is valid - add score burst
              const gridCenter = document.getElementById('letter-grid');
              if (gridCenter) {
                const rect = gridCenter.getBoundingClientRect();
                const burst = {
                  id: Date.now(),
                  points: validation.points,
                  x: rect.left + rect.width / 2,
                  y: rect.top + rect.height / 2,
                };
                setScoreBursts(prev => [...prev, burst]);
              }
              
              // Trigger word found callback
              onWordFound(validation.word, validation.points);
              
              // Remove burst after animation
              setTimeout(() => {
                setScoreBursts(prev => prev.filter(b => b.id !== burst.id));
              }, 650);
            }
          }
        } catch (error) {
          console.error('Error validating word:', error);
        } finally {
          setIsValidating(false);
        }
      }
    };

    validateCurrentWord();
  }, [currentWord, selectedCells, onWordFound, isValidating]);

  const isCellSelected = (row, col) => {
    return selectedCells.some(([r, c]) => r === row && c === col);
  };

  const isCellConnected = (row, col) => {
    const selectedIndex = selectedCells.findIndex(([r, c]) => r === row && c === col);
    return selectedIndex !== -1 && selectedIndex < selectedCells.length - 1;
  };

  const gridSize = grid.length;
  const gridCols = gridSize === 5 ? 'grid-cols-5' : 'grid-cols-4';

  return (
    <div className="relative">
      <motion.div
        id="letter-grid"
        className={`grid ${gridCols} gap-2 sm:gap-3 p-4 sm:p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 
                   backdrop-blur-sm border border-slate-600/30 rounded-2xl shadow-2xl`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {grid.map((row, rowIndex) =>
          row.map((letter, colIndex) => (
            <LetterTile
              key={`${rowIndex}-${colIndex}`}
              letter={letter}
              row={rowIndex}
              col={colIndex}
              isSelected={isCellSelected(rowIndex, colIndex)}
              isConnected={isCellConnected(rowIndex, colIndex)}
              onClick={onCellSelect}
              disabled={disabled}
            />
          ))
        )}
      </motion.div>

      {/* Current word display */}
      <motion.div
        className="mt-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="inline-flex items-center justify-center min-h-[3rem] px-6 py-2 
                       bg-gradient-to-r from-slate-800/60 to-slate-700/60 backdrop-blur-sm 
                       border border-slate-600/30 rounded-xl">
          {currentWord ? (
            <motion.span
              className="text-2xl font-bold text-white tracking-wider uppercase"
              key={currentWord}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {currentWord}
            </motion.span>
          ) : (
            <span className="text-slate-400 text-lg">Select letters to form words</span>
          )}
        </div>
      </motion.div>

      {/* Score bursts */}
      <AnimatePresence>
        {scoreBursts.map((burst) => (
          <div
            key={burst.id}
            className="fixed pointer-events-none z-50"
            style={{
              left: burst.x,
              top: burst.y,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <ScoreBurst
              points={burst.points}
              onComplete={() => {
                setScoreBursts(prev => prev.filter(b => b.id !== burst.id));
              }}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default LetterGrid;