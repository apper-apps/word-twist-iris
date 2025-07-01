import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const EventForm = ({ 
  initialData = null, 
  onSubmit, 
  onCancel, 
  submitLabel = "Save Event",
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    type: initialData?.type || 'event',
    date: initialData?.date ? new Date(initialData.date).toISOString().slice(0, 16) : '',
    location: initialData?.location || '',
    description: initialData?.description || '',
    organizer: initialData?.organizer || '',
    budget: initialData?.budget || '',
    status: initialData?.status || 'planned',
    guests: initialData?.guests || []
  });

  const [newGuest, setNewGuest] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.organizer.trim()) {
      newErrors.organizer = 'Organizer is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const eventData = {
      ...formData,
      date: new Date(formData.date).toISOString(),
      budget: formData.budget ? parseFloat(formData.budget) : 0
    };

    onSubmit(eventData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const addGuest = () => {
    if (newGuest.name.trim() && newGuest.email.trim()) {
      setFormData(prev => ({
        ...prev,
        guests: [...prev.guests, { ...newGuest, status: 'pending' }]
      }));
      setNewGuest({ name: '', email: '' });
    }
  };

  const removeGuest = (index) => {
    setFormData(prev => ({
      ...prev,
      guests: prev.guests.filter((_, i) => i !== index)
    }));
  };

  const eventTypes = [
    { value: 'event', label: 'General Event', icon: 'Calendar' },
    { value: 'party', label: 'Party', icon: 'PartyPopper' },
    { value: 'birthday', label: 'Birthday', icon: 'Cake' }
  ];

  const statusOptions = [
    { value: 'planned', label: 'Planned' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="glass-card p-6 rounded-2xl">
        <h2 className="text-xl font-semibold text-white mb-6">Event Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Event Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.title ? 'border-error-500' : 'border-slate-600/50'
              }`}
              placeholder="Enter event title"
            />
            {errors.title && <p className="text-error-400 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Event Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {eventTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleInputChange('type', type.value)}
                  className={`flex flex-col items-center p-3 rounded-lg border transition-all duration-200 ${
                    formData.type === type.value
                      ? 'bg-primary-500/20 border-primary-500/50 text-primary-400'
                      : 'bg-slate-800/50 border-slate-600/50 text-slate-400 hover:border-slate-500/50'
                  }`}
                >
                  <ApperIcon name={type.icon} size={20} className="mb-1" />
                  <span className="text-xs">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Date & Time *
            </label>
            <input
              type="datetime-local"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.date ? 'border-error-500' : 'border-slate-600/50'
              }`}
            />
            {errors.date && <p className="text-error-400 text-sm mt-1">{errors.date}</p>}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Location *
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.location ? 'border-error-500' : 'border-slate-600/50'
              }`}
              placeholder="Enter location"
            />
            {errors.location && <p className="text-error-400 text-sm mt-1">{errors.location}</p>}
          </div>

          {/* Organizer */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Organizer *
            </label>
            <input
              type="text"
              value={formData.organizer}
              onChange={(e) => handleInputChange('organizer', e.target.value)}
              className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.organizer ? 'border-error-500' : 'border-slate-600/50'
              }`}
              placeholder="Enter organizer name"
            />
            {errors.organizer && <p className="text-error-400 text-sm mt-1">{errors.organizer}</p>}
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Budget
            </label>
            <input
              type="number"
              value={formData.budget}
              onChange={(e) => handleInputChange('budget', e.target.value)}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter budget amount"
              min="0"
              step="0.01"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              placeholder="Enter event description"
            />
          </div>
        </div>
      </div>

      {/* Guests Section */}
      <div className="glass-card p-6 rounded-2xl">
        <h2 className="text-xl font-semibold text-white mb-6">Guest List</h2>
        
        {/* Add Guest */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            value={newGuest.name}
            onChange={(e) => setNewGuest(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Guest name"
            className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <input
            type="email"
            value={newGuest.email}
            onChange={(e) => setNewGuest(prev => ({ ...prev, email: e.target.value }))}
            placeholder="Guest email"
            className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <Button
            type="button"
            onClick={addGuest}
            icon="Plus"
            variant="secondary"
          >
            Add
          </Button>
        </div>

        {/* Guests List */}
        {formData.guests.length > 0 && (
          <div className="space-y-2">
            {formData.guests.map((guest, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg"
              >
                <div>
                  <p className="text-white font-medium">{guest.name}</p>
                  <p className="text-slate-400 text-sm">{guest.email}</p>
                </div>
                <Button
                  type="button"
                  onClick={() => removeGuest(index)}
                  variant="ghost"
                  size="sm"
                  icon="X"
                >
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-end">
        <Button
          type="button"
          onClick={onCancel}
          variant="ghost"
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={loading}
          className="w-full sm:w-auto"
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default EventForm;