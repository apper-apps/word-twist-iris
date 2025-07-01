import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  icon = null,
  disabled = false,
  loading = false,
  className = '',
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface-900 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 focus:ring-primary-500",
    secondary: "bg-gradient-to-r from-slate-700 to-slate-800 text-white border border-slate-600/50 hover:border-slate-500/50 shadow-lg hover:shadow-slate-500/25 focus:ring-slate-500",
    accent: "bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-lg shadow-accent-500/25 hover:shadow-accent-500/40 focus:ring-accent-500",
    success: "bg-gradient-to-r from-success-500 to-success-600 text-white shadow-lg shadow-success-500/25 hover:shadow-success-500/40 focus:ring-success-500",
    warning: "bg-gradient-to-r from-warning-500 to-warning-600 text-white shadow-lg shadow-warning-500/25 hover:shadow-warning-500/40 focus:ring-warning-500",
    error: "bg-gradient-to-r from-error-500 to-error-600 text-white shadow-lg shadow-error-500/25 hover:shadow-error-500/40 focus:ring-error-500",
    ghost: "text-slate-300 hover:text-white hover:bg-slate-800/50 focus:ring-slate-500",
  };
  
  const sizes = {
    sm: "px-3 py-2 text-sm space-x-1.5",
    md: "px-4 py-2.5 text-base space-x-2",
    lg: "px-6 py-3 text-lg space-x-2.5",
    xl: "px-8 py-4 text-xl space-x-3",
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      {...props}
    >
      {loading ? (
        <ApperIcon name="Loader2" size={size === 'sm' ? 16 : size === 'lg' ? 20 : 18} className="animate-spin" />
      ) : icon ? (
        <ApperIcon name={icon} size={size === 'sm' ? 16 : size === 'lg' ? 20 : 18} />
      ) : null}
      
      {!loading && children && <span>{children}</span>}
    </motion.button>
  );
};

export default Button;