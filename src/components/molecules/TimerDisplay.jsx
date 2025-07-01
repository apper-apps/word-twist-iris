import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const TimerDisplay = ({ timeRemaining, isActive, isPaused, onPause, onResume }) => {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const percentage = timeRemaining > 0 ? (timeRemaining / 120) * 100 : 0;

  const getTimeColor = () => {
    if (timeRemaining <= 10) return 'text-error-400';
    if (timeRemaining <= 30) return 'text-warning-400';
    return 'text-primary-400';
  };

  const getRingColor = () => {
    if (timeRemaining <= 10) return 'stroke-error-500';
    if (timeRemaining <= 30) return 'stroke-warning-500';
    return 'stroke-primary-500';
  };

  return (
    <div className="flex items-center justify-center space-x-4">
      <div className="relative w-20 h-20">
        <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
          <path
            className="stroke-slate-700"
            strokeWidth="3"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <motion.path
            className={getRingColor()}
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            initial={{ strokeDasharray: "100, 100" }}
            animate={{ strokeDasharray: `${percentage}, 100` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </svg>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className={`text-center ${getTimeColor()}`}
            animate={timeRemaining <= 10 ? {
              scale: [1, 1.1, 1],
            } : {}}
            transition={{
              duration: 1,
              repeat: timeRemaining <= 10 ? Infinity : 0,
            }}
          >
            <div className="text-lg font-bold font-display">
              {minutes}:{seconds.toString().padStart(2, '0')}
            </div>
          </motion.div>
        </div>
      </div>

      {isActive && (
        <motion.button
          onClick={isPaused ? onResume : onPause}
          className="p-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-colors duration-200 border border-slate-600/30"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ApperIcon 
            name={isPaused ? "Play" : "Pause"} 
            size={20} 
            className="text-slate-300" 
          />
        </motion.button>
      )}
    </div>
  );
};

export default TimerDisplay;