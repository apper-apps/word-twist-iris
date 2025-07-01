import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const EventCard = ({ event, onEdit, onDelete, onView }) => {
  const getTypeIcon = (type) => {
    switch (type) {
      case 'birthday':
        return 'Cake';
      case 'party':
        return 'PartyPopper';
      default:
        return 'Calendar';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'birthday':
        return 'text-accent-400 bg-accent-400/20';
      case 'party':
        return 'text-secondary-400 bg-secondary-400/20';
      default:
        return 'text-primary-400 bg-primary-400/20';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-success-400 bg-success-400/20';
      case 'completed':
        return 'text-slate-400 bg-slate-400/20';
      default:
        return 'text-warning-400 bg-warning-400/20';
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy • h:mm a');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const isUpcoming = new Date(event.date) > new Date();

  return (
    <motion.div
      className="glass-card p-6 rounded-2xl hover:shadow-lg hover:shadow-primary-500/10 transition-all duration-300"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${getTypeColor(event.type)}`}>
            <ApperIcon name={getTypeIcon(event.type)} size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white line-clamp-1">
              {event.title}
            </h3>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
              {event.status}
            </span>
          </div>
        </div>
      </div>

      {/* Date and Location */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-slate-300">
          <ApperIcon name="Clock" size={16} className="text-slate-400" />
          <span className="text-sm">{formatDate(event.date)}</span>
          {isUpcoming && (
            <span className="text-xs text-success-400 bg-success-400/20 px-2 py-1 rounded-full">
              Upcoming
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2 text-slate-300">
          <ApperIcon name="MapPin" size={16} className="text-slate-400" />
          <span className="text-sm line-clamp-1">{event.location}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-slate-400 text-sm line-clamp-2 mb-4">
        {event.description}
      </p>

      {/* Guests Count */}
      <div className="flex items-center space-x-2 mb-6">
        <ApperIcon name="Users" size={16} className="text-slate-400" />
        <span className="text-sm text-slate-300">
          {event.guests.length} {event.guests.length === 1 ? 'guest' : 'guests'}
        </span>
        {event.budget && (
          <>
            <span className="text-slate-500">•</span>
            <span className="text-sm text-slate-300">
              ${event.budget.toLocaleString()}
            </span>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2">
        <Button
          onClick={onView}
          variant="ghost"
          size="sm"
          icon="Eye"
          className="flex-1"
        >
          View
        </Button>
        
        <Button
          onClick={onEdit}
          variant="secondary"
          size="sm"
          icon="Edit"
          className="flex-1"
        >
          Edit
        </Button>
        
        <Button
          onClick={onDelete}
          variant="error"
          size="sm"
          icon="Trash2"
        >
        </Button>
      </div>
    </motion.div>
  );
};

export default EventCard;