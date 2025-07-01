import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const ScoreBurst = ({ points, onComplete }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onComplete?.();
    }, 600);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!show) return null;

  return (
    <motion.div
      className="score-burst font-display text-2xl font-bold"
      initial={{ opacity: 1, scale: 1, y: 0 }}
      animate={{ 
        opacity: 0, 
        scale: 0.8, 
        y: -40 
      }}
      transition={{ 
        duration: 0.6,
        ease: "easeOut"
      }}
    >
      +{points}
    </motion.div>
  );
};

export default ScoreBurst;