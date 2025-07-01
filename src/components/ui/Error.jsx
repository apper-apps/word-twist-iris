import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Error = ({ 
  message = "Something went wrong!", 
  onRetry = null,
  title = "Game Error"
}) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[400px] space-y-6 p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="w-20 h-20 bg-gradient-to-br from-error-500 to-error-600 rounded-full flex items-center justify-center"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      >
        <ApperIcon name="AlertTriangle" size={40} className="text-white" />
      </motion.div>
      
      <div className="text-center space-y-3">
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        <p className="text-slate-300 max-w-md leading-relaxed">{message}</p>
      </div>
      
      {onRetry && (
        <motion.button
          onClick={onRetry}
          className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl
                     shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all duration-200
                     hover:scale-105 active:scale-95 flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ApperIcon name="RotateCcw" size={18} />
          <span>Try Again</span>
        </motion.button>
      )}
    </motion.div>
  );
};

export default Error;