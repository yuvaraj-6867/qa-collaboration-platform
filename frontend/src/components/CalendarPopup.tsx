import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, X, Plus } from 'lucide-react';
import { CalendarEvent } from '@/types/calendar';
import { calendarApi } from '@/lib/calendarApi';
import { EventForm } from './EventForm';
import { EventDetails } from './EventDetails';

interface CalendarPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

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

export const CalendarPopup: React.FC<CalendarPopupProps> = ({ isOpen, onClose }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [clickedDate, setClickedDate] = useState<Date | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadEvents();
    }
  }, [isOpen, selectedDate]);

  const loadEvents = async () => {
    try {
      const startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).toISOString();
      const endDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).toISOString();
      const data = await calendarApi.getEvents(startDate, endDate, '');
      setEvents(data);
    } catch (error) {
      console.error('Failed to load events');
    }
  };

  const handleCreateEvent = async (eventData: any) => {
    try {
      await calendarApi.createEvent(eventData);
      setShowEventForm(false);
      loadEvents();
    } catch (error) {
      console.error('Failed to create event');
    }
  };

  const handleEventUpdate = () => {
    loadEvents();
    setSelectedEvent(null);
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
    setClickedDate(clickedDate);
  };

  const getDaysInMonth = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    return days;
  };

  const getEventsForDay = (day: number) => {
    const dayDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
    return events.filter(event => {
      const eventDate = new Date(event.start_time);
      return eventDate.toDateString() === dayDate.toDateString();
    });
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-12 right-0 w-80 bg-white border rounded-lg shadow-lg z-50">
      <div className="p-3 border-b flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-4 w-4" />
          <span className="font-medium text-sm">Calendar</span>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="h-4 w-4" />
        </button>
      </div>
      
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium">
            {selectedDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
          </h3>
          <div className="flex space-x-1">
            <button
              onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}
              className="px-2 py-1 text-xs border rounded hover:bg-gray-50"
            >
              ←
            </button>
            <button
              onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}
              className="px-2 py-1 text-xs border rounded hover:bg-gray-50"
            >
              →
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
            <div key={day} className="p-1 text-center text-xs font-medium text-gray-400">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {getDaysInMonth().map((day, index) => (
            <div
              key={index}
              className={`h-6 flex items-center justify-center text-xs rounded cursor-pointer ${
                day ? 'hover:bg-emerald-50' : ''
              } ${
                day === new Date().getDate() && 
                selectedDate.getMonth() === new Date().getMonth() && 
                selectedDate.getFullYear() === new Date().getFullYear()
                  ? 'bg-emerald-500 text-white' : ''
              } ${
                clickedDate && day === clickedDate.getDate() && 
                selectedDate.getMonth() === clickedDate.getMonth() && 
                selectedDate.getFullYear() === clickedDate.getFullYear()
                  ? 'bg-blue-200' : ''
              }`}
              onClick={() => day && handleDateClick(day)}
            >
              {day && (
                <span className={getEventsForDay(day).length > 0 ? 'font-bold' : ''}>
                  {day}
                </span>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-3 pt-3 border-t">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-medium">
              {clickedDate ? `Events for ${clickedDate.getDate()}` : "Today's Events"}
            </h4>
            <button 
              onClick={() => setShowEventForm(true)}
              className="text-xs bg-emerald-500 text-white px-2 py-1 rounded hover:bg-emerald-600"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
          <div className="space-y-1 max-h-24 overflow-y-auto">
            {(clickedDate ? getEventsForDay(clickedDate.getDate()) : getEventsForDay(new Date().getDate())).length === 0 ? (
              <p className="text-xs text-gray-500">No events</p>
            ) : (
              (clickedDate ? getEventsForDay(clickedDate.getDate()) : getEventsForDay(new Date().getDate())).map(event => (
                <div 
                  key={event.id} 
                  className="text-xs p-1 rounded flex items-center space-x-1 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className={`w-2 h-2 rounded-full ${eventTypeColors[event.event_type]?.split(' ')[0]}`}></div>
                  <span className="truncate">{event.title}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      {showEventForm && (
        <div className="absolute top-0 left-0 w-full h-full bg-white rounded-lg z-10">
          <EventForm
            onSubmit={handleCreateEvent}
            onCancel={() => setShowEventForm(false)}
            initialDate={clickedDate || new Date()}
            compact={true}
          />
        </div>
      )}
      
      {selectedEvent && (
        <EventDetails
          event={selectedEvent}
          open={true}
          onClose={() => setSelectedEvent(null)}
          onUpdate={loadEvents}
        />
      )}
    </div>
  );
};