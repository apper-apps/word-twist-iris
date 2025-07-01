import { motion } from 'framer-motion';
import WordItem from '@/components/molecules/WordItem';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';

const WordsList = ({ foundWords, maxHeight = '400px' }) => {
  // Group words by length for better organization
  const wordsByLength = foundWords.reduce((acc, wordObj) => {
    const length = wordObj.word.length;
    if (!acc[length]) acc[length] = [];
    acc[length].push(wordObj);
    return acc;
  }, {});

  const sortedLengths = Object.keys(wordsByLength).sort((a, b) => b - a);

  if (foundWords.length === 0) {
    return (
      <div className="glass-card p-6 rounded-2xl">
        <Empty
          title="No Words Found"
          message="Start selecting letters on the grid to form words!"
          icon="Search"
        />
      </div>
    );
  }

  return (
    <motion.div
      className="glass-card p-6 rounded-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <ApperIcon name="List" size={20} className="mr-2 text-primary-400" />
          Found Words
        </h3>
        <div className="bg-primary-500/20 text-primary-300 px-3 py-1 rounded-full text-sm font-medium">
          {foundWords.length} words
        </div>
      </div>

      <div
        className="space-y-4 overflow-y-auto pr-2"
        style={{ maxHeight }}
      >
        {sortedLengths.map((length) => (
          <motion.div
            key={length}
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-6 bg-gradient-to-r from-secondary-500 to-accent-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">{length}</span>
              </div>
              <span className="text-slate-400 text-sm">
                {wordsByLength[length].length} word{wordsByLength[length].length !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="space-y-2 ml-4">
              {wordsByLength[length].map((wordObj, index) => (
                <WordItem
                  key={`${wordObj.word}-${wordObj.timestamp}`}
                  word={wordObj.word}
                  points={wordObj.points}
                  index={index}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Scroll indicator */}
      {foundWords.length > 8 && (
        <div className="flex justify-center mt-4 pt-2 border-t border-slate-600/30">
          <ApperIcon name="ChevronDown" size={16} className="text-slate-400 animate-bounce" />
        </div>
      )}
    </motion.div>
  );
};

export default WordsList;