export interface CalendarEvent {
  id: number;
  title: string;
  description?: string;
  start_time: string;

  event_type: 'test_cycle' | 'bug_triage' | 'release_review' | 'standup' | 'deadline' | 'retesting' | 'leave' | 'work_from_home';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  all_day: boolean;
  location?: string;
  attendees?: string;
  created_by: {
    id: number;
    name: string;
  };
  eventable?: {
    type: string;
    id: number;
    title: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateCalendarEventRequest {
  title: string;
  description?: string;
  start_time: string;

  event_type: string;
  all_day?: boolean;
  location?: string;
  attendees?: string;
  eventable_type?: string;
  eventable_id?: number;
}