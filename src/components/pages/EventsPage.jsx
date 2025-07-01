import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

import EventCard from '@/components/molecules/EventCard';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';

import eventService from '@/services/api/eventService';

const EventsPage = ({ eventType = null }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const navigate = useNavigate();

  useEffect(() => {
    loadEvents();
  }, [eventType]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError('');
      
      let data;
      if (eventType) {
        data = await eventService.getByType(eventType);
      } else {
        data = await eventService.getAll();
      }
      
      setEvents(data);
    } catch (err) {
      setError('Failed to load events. Please try again.');
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      await eventService.delete(eventId);
      setEvents(prev => prev.filter(event => event.Id !== eventId));
      toast.success('Event deleted successfully');
    } catch (err) {
      toast.error('Failed to delete event');
      console.error('Error deleting event:', err);
    }
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(a.date) - new Date(b.date);
      case 'title':
        return a.title.localeCompare(b.title);
      case 'type':
        return a.type.localeCompare(b.type);
      default:
        return 0;
    }
  });

  const getPageTitle = () => {
    switch (eventType) {
      case 'party':
        return 'Parties';
      case 'birthday':
        return 'Birthdays';
      default:
        return 'All Events';
    }
  };

  const getEmptyMessage = () => {
    switch (eventType) {
      case 'party':
        return 'No parties found. Create your first party!';
      case 'birthday':
        return 'No birthdays found. Add a birthday celebration!';
      default:
        return 'No events found. Create your first event!';
    }
  };

  if (loading) {
    return <Loading message="Loading events..." />;
  }

  if (error) {
    return (
      <Error
        message={error}
        onRetry={loadEvents}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-900 via-slate-900 to-surface-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400 bg-clip-text text-transparent">
                {getPageTitle()}
              </h1>
              <p className="text-slate-400 text-lg mt-2">
                {events.length} {events.length === 1 ? 'event' : 'events'} total
              </p>
            </div>
            
            <Button
              onClick={() => navigate('/events/create')}
              icon="Plus"
              className="w-full sm:w-auto"
            >
              Create Event
            </Button>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          className="glass-card p-6 rounded-2xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <ApperIcon 
                name="Search" 
                size={20} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" 
              />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-slate-800/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-10"
              >
                <option value="date">Sort by Date</option>
                <option value="title">Sort by Title</option>
                <option value="type">Sort by Type</option>
              </select>
              <ApperIcon 
                name="ChevronDown" 
                size={16} 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" 
              />
            </div>
          </div>
        </motion.div>

        {/* Events Grid */}
        {sortedEvents.length === 0 ? (
          <Empty 
            title="No Events Found"
            message={getEmptyMessage()}
            actionLabel="Create Event"
            onAction={() => navigate('/events/create')}
          />
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {sortedEvents.map((event, index) => (
              <motion.div
                key={event.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <EventCard
                  event={event}
                  onEdit={() => navigate(`/events/edit/${event.Id}`)}
                  onDelete={() => handleDelete(event.Id)}
                  onView={() => navigate(`/events/${event.Id}`)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;