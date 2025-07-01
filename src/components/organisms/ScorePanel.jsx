import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const ScorePanel = ({ score, foundWords, bestScore = 0 }) => {
  const totalWords = foundWords.length;
  const averageWordLength = totalWords > 0 
    ? Math.round(foundWords.reduce((sum, word) => sum + word.word.length, 0) / totalWords)
    : 0;

  return (
    <div className="space-y-4">
      <motion.div
        className="glass-card p-6 rounded-2xl text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-300">Current Score</h2>
          <motion.div
            className="text-5xl font-display font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent"
            key={score}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.3 }}
          >
            {score.toLocaleString()}
          </motion.div>
          {bestScore > 0 && (
            <p className="text-sm text-slate-400">
              Best: {bestScore.toLocaleString()}
            </p>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        <motion.div
          className="glass-card p-4 rounded-xl text-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center justify-center mb-2">
            <ApperIcon name="Hash" size={20} className="text-accent-400" />
          </div>
          <div className="text-2xl font-bold text-white">{totalWords}</div>
          <div className="text-sm text-slate-400">Words Found</div>
        </motion.div>

        <motion.div
          className="glass-card p-4 rounded-xl text-center"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center justify-center mb-2">
            <ApperIcon name="BarChart3" size={20} className="text-success-400" />
          </div>
          <div className="text-2xl font-bold text-white">{averageWordLength}</div>
          <div className="text-sm text-slate-400">Avg Length</div>
        </motion.div>
      </div>

      {/* Score breakdown */}
      {foundWords.length > 0 && (
        <motion.div
          className="glass-card p-4 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center">
            <ApperIcon name="TrendingUp" size={16} className="mr-2" />
            Score Breakdown
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">3-letter words:</span>
              <span className="text-white">
                {foundWords.filter(w => w.word.length === 3).length} × 3 = {foundWords.filter(w => w.word.length === 3).length * 3}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">4-letter words:</span>
              <span className="text-white">
                {foundWords.filter(w => w.word.length === 4).length} × 4 = {foundWords.filter(w => w.word.length === 4).length * 4}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">5+ letter words:</span>
              <span className="text-white">
                {foundWords.filter(w => w.word.length >= 5).reduce((sum, w) => sum + w.points, 0)}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ScorePanel;