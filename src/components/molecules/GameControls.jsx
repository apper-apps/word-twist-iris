import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';

const GameControls = ({ 
  onNewGame, 
  onPause, 
  onResume, 
  isPaused, 
  isActive, 
  difficulty, 
  onDifficultyChange,
  gameMode,
  onGameModeChange 
}) => {
  const difficulties = [
    { value: 'easy', label: 'Easy', description: '4x4 Grid' },
    { value: 'medium', label: 'Medium', description: '4x4 Grid' },
    { value: 'hard', label: 'Hard', description: '5x5 Grid' }
  ];

  const gameModes = [
    { value: 'classic', label: 'Classic', description: '2 Minutes' },
    { value: 'extended', label: 'Extended', description: '5 Minutes' },
    { value: 'endless', label: 'Endless', description: 'No Timer' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 justify-center">
        <Button
          onClick={onNewGame}
          variant="accent"
          icon="RotateCcw"
          size="md"
        >
          New Game
        </Button>

        {isActive && (
          <Button
            onClick={isPaused ? onResume : onPause}
            variant="secondary"
            icon={isPaused ? "Play" : "Pause"}
            size="md"
          >
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-4 rounded-xl">
          <h3 className="text-white font-semibold mb-3 text-center">Difficulty</h3>
          <div className="space-y-2">
            {difficulties.map((diff) => (
              <motion.button
                key={diff.value}
                onClick={() => onDifficultyChange(diff.value)}
                className={`w-full p-3 rounded-lg border transition-all duration-200 text-left ${
                  difficulty === diff.value
                    ? 'bg-primary-500/20 border-primary-500/50 text-primary-300'
                    : 'bg-slate-800/30 border-slate-600/30 text-slate-300 hover:border-slate-500/50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="font-medium">{diff.label}</div>
                <div className="text-sm opacity-70">{diff.description}</div>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl">
          <h3 className="text-white font-semibold mb-3 text-center">Game Mode</h3>
          <div className="space-y-2">
            {gameModes.map((mode) => (
              <motion.button
                key={mode.value}
                onClick={() => onGameModeChange(mode.value)}
                className={`w-full p-3 rounded-lg border transition-all duration-200 text-left ${
                  gameMode === mode.value
                    ? 'bg-secondary-500/20 border-secondary-500/50 text-secondary-300'
                    : 'bg-slate-800/30 border-slate-600/30 text-slate-300 hover:border-slate-500/50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="font-medium">{mode.label}</div>
                <div className="text-sm opacity-70">{mode.description}</div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameControls;