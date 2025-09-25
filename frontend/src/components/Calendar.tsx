import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CalendarEvent } from '@/types/calendar';
import { calendarApi } from '@/lib/calendarApi';
import { EventForm } from './EventForm';
import { EventDetails } from './EventDetails';


const eventTypeColors = {
  test_cycle: 'bg-emerald-100 text-emerald-800',
  bug_triage: 'bg-rose-100 text-rose-800',
  release_review: 'bg-teal-100 text-teal-800',
  standup: 'bg-amber-100 text-amber-800',
  deadline: 'bg-violet-100 text-violet-800',
  retesting: 'bg-orange-100 text-orange-800',
  leave: 'bg-fuchsia-100 text-fuchsia-800',
  work_from_home: 'bg-cyan-100 text-cyan-800',
};

export const Calendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [filterType, setFilterType] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const showMessage = (message: string) => {
    setSnackbarMessage(message);
    setShowSnackbar(true);
    setTimeout(() => setShowSnackbar(false), 3000);
  };

  useEffect(() => {
    loadEvents();
  }, [selectedDate, filterType]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).toISOString();
      const endDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).toISOString();
      
      const data = await calendarApi.getEvents(startDate, endDate, filterType);
      setEvents(data);
    } catch (error) {
      showMessage('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (eventData: any) => {
    try {
      await calendarApi.createEvent(eventData);
      setShowEventForm(false);
      loadEvents();
      showMessage('Event created successfully');
    } catch (error) {
      showMessage('Failed to create event');
    }
  };



  const getDaysInMonth = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getEventsForDay = (day: number) => {
    const dayDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
    return events.filter(event => {
      if (event.all_day) {
        const eventDate = new Date(event.start_time);
        return eventDate.getDate() === day && 
               eventDate.getMonth() === selectedDate.getMonth() && 
               eventDate.getFullYear() === selectedDate.getFullYear();
      }
      const eventDate = new Date(event.start_time);
      return eventDate.toDateString() === dayDate.toDateString();
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <CalendarIcon className="h-6 w-6" />
          <h1 className="text-2xl font-bold">QA Calendar</h1>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="">All Events</option>
            <option value="test_cycle">Test Cycles</option>
            <option value="bug_triage">Bug Triage</option>
            <option value="release_review">Release Reviews</option>
            <option value="standup">Standups</option>
            <option value="deadline">Deadlines</option>
            <option value="retesting">Retesting</option>
            <option value="leave">Leave</option>
            <option value="work_from_home">Work From Home</option>
          </select>

          <Button onClick={() => setShowEventForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            {selectedDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex space-x-1">
            <button
              onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}
              className="px-2 py-1 text-sm border rounded hover:bg-gray-50"
            >
              ←
            </button>
            <button
              onClick={() => setSelectedDate(new Date())}
              className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
            >
              Today
            </button>
            <button
              onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}
              className="px-2 py-1 text-sm border rounded hover:bg-gray-50"
            >
              →
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
            <div key={day} className="p-2 text-center text-xs font-medium text-gray-400">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {getDaysInMonth().map((day, index) => (
            <div
              key={index}
              className={`h-8 flex items-center justify-center text-sm rounded ${
                day ? 'hover:bg-emerald-50 cursor-pointer' : ''
              } ${
                day === selectedDate.getDate() && 
                selectedDate.getMonth() === selectedDate.getMonth() && 
                selectedDate.getFullYear() === selectedDate.getFullYear()
                  ? 'bg-emerald-500 text-white' : ''
              }`}
              onClick={() => {
                if (day) {
                  setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day));
                }
              }}
            >
              {day && (
                <span className={getEventsForDay(day).length > 0 ? 'font-bold' : ''}>
                  {day}
                </span>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">
            Events for {selectedDate.getDate().toString().padStart(2, '0')} {selectedDate.toLocaleDateString('en-IN', { month: 'short' })}
          </h3>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {getEventsForDay(selectedDate.getDate()).length === 0 ? (
              <p className="text-xs text-gray-500">No events</p>
            ) : (
              getEventsForDay(selectedDate.getDate()).map(event => (
                <div
                  key={event.id}
                  className="flex items-center space-x-2 p-2 rounded hover:bg-emerald-50 cursor-pointer"
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className={`w-2 h-2 rounded-full ${eventTypeColors[event.event_type]?.split(' ')[0]}`}></div>
                  <span className="text-xs truncate">{event.title}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {showEventForm && (
        <EventForm
          onSubmit={handleCreateEvent}
          onCancel={() => setShowEventForm(false)}
        />
      )}

      {selectedEvent && (
        <EventDetails
          event={selectedEvent}
          open={true}
          onClose={() => setSelectedEvent(null)}
          onUpdate={loadEvents}
        />
      )}
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
    </div>
  );
};