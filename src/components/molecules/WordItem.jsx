import { motion } from 'framer-motion';

const WordItem = ({ word, points, index }) => {
  return (
    <motion.div
      className="word-item flex justify-between items-center"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <span className="text-white font-medium capitalize">{word}</span>
      <span className="text-accent-400 font-bold text-sm bg-accent-500/20 px-2 py-1 rounded-full">
        {points}
      </span>
    </motion.div>
  );
};

export default WordItem;