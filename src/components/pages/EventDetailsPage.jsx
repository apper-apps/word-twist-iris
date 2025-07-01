import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import ApperIcon from '@/components/ApperIcon';
import eventService from '@/services/api/eventService';

const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      setError('');
      const eventData = await eventService.getById(id);
      setEvent(eventData);
    } catch (err) {
      setError('Failed to load event. Please try again.');
      console.error('Error loading event:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    try {
      await eventService.delete(id);
      toast.success('Event deleted successfully');
      navigate('/events');
    } catch (error) {
      toast.error('Failed to delete event');
      console.error('Error deleting event:', error);
    }
  };

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
      return format(new Date(dateString), 'EEEE, MMMM dd, yyyy • h:mm a');
    } catch (error) {
      return 'Invalid date';
    }
  };

  if (loading) {
    return <Loading message="Loading event details..." />;
  }

  if (error) {
    return (
      <Error
        message={error}
        onRetry={loadEvent}
      />
    );
  }

  if (!event) {
    return (
      <Error
        message="Event not found"
        onRetry={() => navigate('/events')}
      />
    );
  }

  const isUpcoming = new Date(event.date) > new Date();
  const confirmedGuests = event.guests.filter(guest => guest.status === 'confirmed').length;
  const pendingGuests = event.guests.filter(guest => guest.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-900 via-slate-900 to-surface-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate('/events')}
                variant="ghost"
                icon="ArrowLeft"
                size="sm"
              >
                Back
              </Button>
              <div className={`p-3 rounded-xl ${getTypeColor(event.type)}`}>
                <ApperIcon name={getTypeIcon(event.type)} size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold text-white">
                  {event.title}
                </h1>
                <div className="flex items-center space-x-3 mt-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}>
                    {event.status}
                  </span>
                  {isUpcoming && (
                    <span className="text-sm text-success-400 bg-success-400/20 px-3 py-1 rounded-full">
                      Upcoming
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => navigate(`/events/edit/${event.Id}`)}
                variant="secondary"
                icon="Edit"
              >
                Edit
              </Button>
              <Button
                onClick={handleDelete}
                variant="error"
                icon="Trash2"
              >
                Delete
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Info */}
            <motion.div
              className="glass-card p-6 rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-xl font-semibold text-white mb-6">Event Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <ApperIcon name="Clock" size={20} className="text-slate-400" />
                  <div>
                    <p className="text-white font-medium">Date & Time</p>
                    <p className="text-slate-300">{formatDate(event.date)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <ApperIcon name="MapPin" size={20} className="text-slate-400" />
                  <div>
                    <p className="text-white font-medium">Location</p>
                    <p className="text-slate-300">{event.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <ApperIcon name="User" size={20} className="text-slate-400" />
                  <div>
                    <p className="text-white font-medium">Organizer</p>
                    <p className="text-slate-300">{event.organizer}</p>
                  </div>
                </div>
                
                {event.budget > 0 && (
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="DollarSign" size={20} className="text-slate-400" />
                    <div>
                      <p className="text-white font-medium">Budget</p>
                      <p className="text-slate-300">${event.budget.toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Description */}
            {event.description && (
              <motion.div
                className="glass-card p-6 rounded-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-xl font-semibold text-white mb-4">Description</h2>
                <p className="text-slate-300 leading-relaxed">{event.description}</p>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Guest Summary */}
            <motion.div
              className="glass-card p-6 rounded-2xl"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-xl font-semibold text-white mb-4">Guest Summary</h2>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Total Guests</span>
                  <span className="text-white font-medium">{event.guests.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Confirmed</span>
                  <span className="text-success-400 font-medium">{confirmedGuests}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Pending</span>
                  <span className="text-warning-400 font-medium">{pendingGuests}</span>
                </div>
              </div>
            </motion.div>

            {/* Guest List */}
            {event.guests.length > 0 && (
              <motion.div
                className="glass-card p-6 rounded-2xl"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h2 className="text-xl font-semibold text-white mb-4">Guest List</h2>
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {event.guests.map((guest, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{guest.name}</p>
                        <p className="text-slate-400 text-sm">{guest.email}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        guest.status === 'confirmed' 
                          ? 'text-success-400 bg-success-400/20'
                          : 'text-warning-400 bg-warning-400/20'
                      }`}>
                        {guest.status}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;