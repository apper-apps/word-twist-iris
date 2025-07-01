import { motion } from 'framer-motion';

const LetterTile = ({ 
  letter, 
  row, 
  col, 
  isSelected = false, 
  isConnected = false,
  onClick,
  disabled = false 
}) => {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick(row, col);
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={disabled}
      className={`
        letter-tile w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-xl
        ${isSelected ? 'selected' : isConnected ? 'connected' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      animate={isSelected ? {
        boxShadow: [
          '0 0 20px rgba(99, 102, 241, 0.5)',
          '0 0 30px rgba(139, 92, 246, 0.7)',
          '0 0 20px rgba(99, 102, 241, 0.5)',
        ]
      } : {}}
      transition={{
        boxShadow: {
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
    >
      <span className="text-xl sm:text-2xl font-bold">{letter}</span>
    </motion.button>
  );
};

export default LetterTile;