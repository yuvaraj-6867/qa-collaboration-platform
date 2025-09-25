import React, { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CalendarEvent } from '@/types/calendar';
import { calendarApi } from '@/lib/calendarApi';


interface EventDetailsProps {
  event: CalendarEvent;
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const eventTypeColors = {
  test_cycle: 'bg-blue-100 text-blue-800',
  bug_triage: 'bg-red-100 text-red-800',
  release_review: 'bg-green-100 text-green-800',
  standup: 'bg-yellow-100 text-yellow-800',
  deadline: 'bg-purple-100 text-purple-800',
  retesting: 'bg-orange-100 text-orange-800',
  leave: 'bg-pink-100 text-pink-800',
  work_from_home: 'bg-indigo-100 text-indigo-800',
};

export const EventDetails: React.FC<EventDetailsProps> = ({ event, open, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [showTimeDialog, setShowTimeDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [newTime, setNewTime] = useState('');

  const showMessage = (message: string) => {
    setSnackbarMessage(message);
    setShowSnackbar(true);
    setTimeout(() => setShowSnackbar(false), 3000);
  };




  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await calendarApi.deleteEvent(event.id);
      onUpdate();
      onClose();
      setShowDeleteDialog(false);
      showMessage('Event deleted successfully');
    } catch (error) {
      showMessage('Failed to delete event');
    } finally {
      setLoading(false);
    }
  };

  const handleTimeEdit = () => {
    const currentTime = new Date(event.start_time);
    const currentTimeStr = currentTime.toLocaleTimeString('en-US', {hour: 'numeric', minute:'2-digit', hour12: true});
    setNewTime(currentTimeStr);
    setShowTimeDialog(true);
  };

  const handleTimeUpdate = async () => {
    if (newTime) {
      const newDate = new Date(event.start_time);
      const [time, period] = newTime.trim().split(' ');
      const [hours, minutes] = time.split(':');
      
      let hour24 = parseInt(hours);
      if (period?.toUpperCase() === 'PM' && hour24 !== 12) {
        hour24 += 12;
      } else if (period?.toUpperCase() === 'AM' && hour24 === 12) {
        hour24 = 0;
      }
      
      newDate.setHours(hour24, parseInt(minutes) || 0);
      
      try {
        setLoading(true);
        await calendarApi.updateEvent(event.id, { start_time: newDate.toISOString() });
        onUpdate();
        onClose();
        setShowTimeDialog(false);
        showMessage('Event time updated successfully');
      } catch (error) {
        showMessage('Failed to update event');
      } finally {
        setLoading(false);
      }
    }
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatEventType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <span>{event.title}</span>
            <span className={`px-2 py-1 text-xs rounded ${eventTypeColors[event.event_type]}`}>
              {formatEventType(event.event_type)}
            </span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-1">Time</h4>
            <p className="text-gray-900">{formatDateTime(event.start_time)}</p>
            {event.all_day && <span className="text-sm text-gray-500">All Day</span>}
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-1">Status</h4>
            <span className="text-gray-900 capitalize">
              {event.status.replace('_', ' ')}
            </span>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-1">Created By</h4>
            <p className="text-gray-900">{event.created_by.name}</p>
          </div>

          {event.location && (
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-1">Location</h4>
              <p className="text-gray-900">{event.location}</p>
            </div>
          )}

          {event.description && (
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-1">Description</h4>
              <p className="text-gray-900 whitespace-pre-wrap">{event.description}</p>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <Button 
              onClick={handleTimeEdit}
              variant="outline"
              size="sm"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Time
            </Button>
            <Button 
              onClick={handleDelete}
              size="sm"
              disabled={loading}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>

      {/* Time Edit Dialog */}
      <Dialog open={showTimeDialog} onOpenChange={setShowTimeDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Event Time</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">
                Enter new time (e.g., 2:30 PM):
              </label>
              <input
                type="text"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1:18 PM"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowTimeDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleTimeUpdate}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                OK
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to delete this event?
            </p>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDelete}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Custom Snackbar */}
      {showSnackbar && (
        <div className="fixed top-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 min-w-[300px]">
          <div className="flex items-center justify-between">
            <span className="text-gray-800">{snackbarMessage}</span>
            <button
              onClick={() => setShowSnackbar(false)}
              className="ml-4 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </Dialog>
  );
};