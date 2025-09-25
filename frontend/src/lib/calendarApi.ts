import { CalendarEvent, CreateCalendarEventRequest } from '@/types/calendar';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

export const calendarApi = {
  getEvents: async (startDate?: string, endDate?: string, eventType?: string): Promise<CalendarEvent[]> => {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    if (eventType) params.append('event_type', eventType);
    
    const response = await fetch(`${API_BASE}/calendar_events?${params}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) throw new Error('Failed to fetch events');
    return response.json();
  },

  createEvent: async (event: CreateCalendarEventRequest): Promise<CalendarEvent> => {
    const response = await fetch(`${API_BASE}/calendar_events`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ calendar_event: event }),
    });
    
    if (!response.ok) throw new Error('Failed to create event');
    return response.json();
  },

  updateEvent: async (id: number, event: Partial<CreateCalendarEventRequest>): Promise<CalendarEvent> => {
    const response = await fetch(`${API_BASE}/calendar_events/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ calendar_event: event }),
    });
    
    if (!response.ok) throw new Error('Failed to update event');
    return response.json();
  },

  deleteEvent: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE}/calendar_events/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    
    if (!response.ok) throw new Error('Failed to delete event');
  },


};