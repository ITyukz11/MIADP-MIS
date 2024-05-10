import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useRouter } from 'next/navigation';

const CalendarPage: React.FC = () => {
  const router = useRouter();

  const events = [
    // Replace this with your actual list of events
    { id: '1', title: 'Event 1', start: '2024-05-01', end: '2024-05-03' },
    { id: '2', title: 'Event 2', start: '2024-05-05', end: '2024-05-07' },
    { id: '3', title: 'Event 3', start: '2024-05-10', end: '2024-05-12' },
  ];

  // Sort events by start date, with the nearest event first
  const sortedEvents = events.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  const handleEventClick = (info: any) => {
    // Redirect to event details page
    router.push(`/event/${info.event.id}`);
  };

  const handleCreateNewActivity = () => {
    // Redirect to create activity page
    router.push('/create-activity');
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex mb-4">
        <div className="w-3/4">
          <h1 className="text-3xl font-bold">Calendar of Events</h1>
        </div>
        <div className="w-1/4 text-right">
          <button
            onClick={handleCreateNewActivity}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Create a New Activity
          </button>
        </div>
      </div>
      <div className="flex">
        <div className="w-1/4">
          <h2 className="text-lg font-bold mb-4">Upcoming Events</h2>
          {/* Display the latest event first */}
          {sortedEvents.map((event) => (
            <div key={event.id} className="mb-2">
              <div className="font-bold">{event.title}</div>
              <div>{event.start}</div>
            </div>
          ))}
        </div>
        <div className="w-3/4">
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={events}
            eventClick={handleEventClick}
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
