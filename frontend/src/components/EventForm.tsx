import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CreateCalendarEventRequest } from '@/types/calendar';
import { useGlobalSnackbar } from '@/components/SnackbarProvider';

interface EventFormProps {
  onSubmit: (event: CreateCalendarEventRequest) => void;
  onCancel: () => void;
  initialData?: Partial<CreateCalendarEventRequest>;
  initialDate?: Date;
  compact?: boolean;
}

export const EventForm: React.FC<EventFormProps> = ({ onSubmit, onCancel, initialData, initialDate, compact = false }) => {
  const today = new Date().toISOString().slice(0, 16);
  const defaultDate = initialDate ? initialDate.toISOString().slice(0, 16) : '';
  const [formData, setFormData] = useState<CreateCalendarEventRequest>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    start_time: initialData?.start_time || defaultDate,
    event_type: initialData?.event_type || 'test_cycle',
    all_day: initialData?.all_day || false,
    location: initialData?.location || '',
    attendees: initialData?.attendees || '',
  });
  const [leaveDays, setLeaveDays] = useState(1);
  const { showError } = useGlobalSnackbar();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.start_time && !formData.all_day) {
      showError('Please select start time');
      return;
    }
    const submitData = {
      ...formData,
      start_time: formData.all_day ? 
        new Date().toISOString().split('T')[0] + 'T00:00:00.000Z' :
        new Date(formData.start_time).toISOString(),
      title: formData.event_type === 'leave' ? `${formData.title} (${leaveDays} day${leaveDays > 1 ? 's' : ''})` : formData.title,
    };
    onSubmit(submitData);
  };

  const handleChange = (field: keyof CreateCalendarEventRequest, value: any) => {
    const updates: any = { [field]: value };
    
    if (field === 'event_type' && (value === 'leave' || value === 'work_from_home')) {
      updates.all_day = true;
      updates.start_time = new Date().toISOString().split('T')[0] + 'T00:00';
      if (value === 'leave') {
        setLeaveDays(1);
      }
    }
    
    setFormData(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Create Event</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Event Type</label>
              <select
                value={formData.event_type}
                onChange={(e) => handleChange('event_type', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="test_cycle">Test Cycle</option>                <option value="release_review">Release Review</option>
                <option value="standup">Standup</option>
                <option value="deadline">Deadline</option>
                <option value="retesting">Retesting</option>
                <option value="leave">Leave</option>
                <option value="work_from_home">Work From Home</option>
              </select>
            </div>

            {!formData.all_day && (
              <div>
                <label className="block text-sm font-medium mb-1">Start Time</label>
                <input
                  type="datetime-local"
                  value={formData.start_time}
                  min={today}
                  onChange={(e) => handleChange('start_time', e.target.value)}
                  onKeyDown={(e) => e.preventDefault()}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
            )}

            {formData.event_type === 'leave' && (
              <div>
                <label className="block text-sm font-medium mb-1">Leave Duration</label>
                <select
                  value={leaveDays}
                  onChange={(e) => setLeaveDays(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value={1}>1 Day</option>
                  <option value={2}>2 Days</option>
                  <option value={3}>3 Days</option>
                  <option value={4}>4 Days</option>
                  <option value={5}>5 Days</option>
                </select>
              </div>
            )}

            {formData.event_type !== 'leave' && formData.event_type !== 'work_from_home' && (
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.all_day}
                    onChange={(e) => handleChange('all_day', e.target.checked)}
                  />
                  <span className="text-sm font-medium">All Day Event</span>
                </label>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <Input
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="Meeting room, Zoom link, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button 
                type="button" 
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                Create Event
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};