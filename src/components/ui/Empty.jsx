import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Empty = ({ 
  title = "No Words Found Yet",
  message = "Start selecting letters to form words and build your score!",
  action = null,
  actionText = "Start Playing",
  icon = "Search"
}) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[300px] space-y-6 p-8 text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="w-24 h-24 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center border border-slate-600/50"
        animate={{
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <ApperIcon name={icon} size={36} className="text-slate-400" />
      </motion.div>
      
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-slate-400 max-w-sm leading-relaxed">{message}</p>
      </div>
      
      {action && (
        <motion.button
          onClick={action}
          className="px-6 py-3 bg-gradient-to-r from-accent-500 to-accent-600 text-white font-semibold rounded-xl
                     shadow-lg shadow-accent-500/25 hover:shadow-accent-500/40 transition-all duration-200
                     hover:scale-105 active:scale-95 flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ApperIcon name="Play" size={18} />
          <span>{actionText}</span>
        </motion.button>
      )}
    </motion.div>
  );
};

export default Empty;