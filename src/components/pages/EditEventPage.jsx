import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

import EventForm from '@/components/organisms/EventForm';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import eventService from '@/services/api/eventService';

const EditEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  const handleSubmit = async (eventData) => {
    setSaving(true);
    
    try {
      const updatedEvent = await eventService.update(id, eventData);
      toast.success('Event updated successfully!');
      navigate(`/events/${updatedEvent.Id}`);
    } catch (error) {
      toast.error('Failed to update event. Please try again.');
      console.error('Error updating event:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All changes will be lost.')) {
      navigate(`/events/${id}`);
    }
  };

  if (loading) {
    return <Loading message="Loading event..." />;
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
            Edit Event
          </h1>
          <p className="text-slate-400 text-lg mt-2">
            Update "{event.title}"
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <EventForm
            initialData={event}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitLabel="Update Event"
            loading={saving}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default EditEventPage;