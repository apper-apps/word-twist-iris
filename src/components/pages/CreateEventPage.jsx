import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

import EventForm from '@/components/organisms/EventForm';
import Loading from '@/components/ui/Loading';
import eventService from '@/services/api/eventService';

const CreateEventPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (eventData) => {
    setLoading(true);
    
    try {
      const newEvent = await eventService.create(eventData);
      toast.success('Event created successfully!');
      navigate(`/events/${newEvent.Id}`);
    } catch (error) {
      toast.error('Failed to create event. Please try again.');
      console.error('Error creating event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All changes will be lost.')) {
      navigate('/events');
    }
  };

  if (loading) {
    return <Loading message="Creating event..." />;
  }

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
          <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400 bg-clip-text text-transparent">
            Create New Event
          </h1>
          <p className="text-slate-400 text-lg mt-2">
            Plan your next celebration or gathering
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <EventForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitLabel="Create Event"
            loading={loading}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default CreateEventPage;