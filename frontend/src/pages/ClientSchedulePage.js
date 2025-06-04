import React, { useState, useEffect, useCallback, useRef } from 'react'; // Added useRef
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';

import clientScheduleService from '../api/clientScheduleService';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import EventDetailModal from '../components/schedule/EventDetailModal'; // Import Modal
import './ClientSchedulePage.css';

// Import FullCalendar's core styles (ensure these are correctly linked or handled by your bundler)
import '@fullcalendar/core/main.css'; // This might not be needed with modern FullCalendar versions if using SCSS
// It's often better to import specific CSS for plugins if available or use the global one provided by @fullcalendar/core
// For simplicity, let's assume CSS is handled via direct import or a global setup.
// The standard way is:
// import '@fullcalendar/common/main.css'; // (or core if common is not found)
// import '@fullcalendar/daygrid/main.css';
// import '@fullcalendar/timegrid/main.css';
// import '@fullcalendar/list/main.css';
// However, sometimes a single import from @fullcalendar/core/main.css or @fullcalendar/react/dist/vdom works,
// or a global CSS link in index.html might be used.
// For this subtask, I will rely on the component to render its styles or assume global setup.
// If styles are missing, this is the first place to check.

const ClientSchedulePage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const calendarRef = useRef(null);

  // State for Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEventInfo, setSelectedEventInfo] = useState(null);

  const fetchEvents = useCallback(async (fetchInfo, successCallback, failureCallback) => {
    if (!user) {
      setError("User not authenticated. Please log in.");
      failureCallback(new Error("User not authenticated")); // Notify FullCalendar
      return;
    }

    setLoading(true);
    setError('');
    try {
      // FullCalendar's startStr and endStr are ISO strings (or YYYY-MM-DD for all-day views)
      // The RPC expects DATE format 'YYYY-MM-DD'
      const startDate = fetchInfo.startStr.substring(0, 10);
      const endDate = fetchInfo.endStr.substring(0, 10); // endStr is exclusive, adjust if RPC is inclusive

      const rawEvents = await clientScheduleService.getClientCalendarEvents(startDate, endDate);

      const formattedEvents = rawEvents.map(event => ({
        id: event.id, // Keep original ID (e.g., 'appt-1', 'fit-item-3')
        title: event.title,
        start: event.start_time, // Ensure this is ISO8601 or a Date object
        end: event.end_time,     // Ensure this is ISO8601 or a Date object
        allDay: event.all_day,
        extendedProps: {
          item_type: event.item_type,
          description: event.description,
          plan_name: event.plan_name,
          meal_type: event.meal_type,
          exercise_name: event.exercise_name,
          sets: event.sets,
          reps: event.reps,
          status: event.status,
        },
        // Optional: Add custom class names or colors based on item_type
        className: `fc-event-${event.item_type?.toLowerCase() || 'default'}`,
        // color: event.item_type === 'appointment' ? '#3788d8' : (event.item_type === 'fitness' ? '#28a745' : '#ffc107'),
      }));
      successCallback(formattedEvents);
    } catch (err) {
      setError(err.message || 'Failed to fetch schedule data.');
      console.error("Fetch calendar events error:", err);
      if (err.code === 'PGRST301' || err.message?.includes('JWT')) {
        navigate('/login?message=Session expired or unauthorized. Please log in again.');
      }
      failureCallback(err); // Notify FullCalendar of the error
    } finally {
      setLoading(false);
    }
  }, [user, navigate]);

  // Event rendering function (optional, for custom content within event)
  const renderEventContent = (eventInfo) => {
    return (
      <>
        <b>{eventInfo.timeText}</b>
        <i> {eventInfo.event.title}</i>
        {eventInfo.event.extendedProps.item_type === 'nutrition' && eventInfo.event.extendedProps.meal_type &&
         <span className="fc-event-mealtype"> ({eventInfo.event.extendedProps.meal_type})</span>}
      </>
    );
  };

  const handleEventClick = (clickInfo) => {
    clickInfo.jsEvent.preventDefault(); // Prevent browser navigation for <a> tags
    setSelectedEventInfo(clickInfo.event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEventInfo(null);
  };

  if (!user && !loading) {
      return <p className="error-message page-error">Please log in to view your schedule.</p>;
  }

  return (
    <div className="client-schedule-page-container fullcalendar-container">
      <div className="schedule-header">
        <h1>My Schedule & Plan</h1>
      </div>
      {error && <p className="error-message page-error">{error}</p>}

      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView="dayGridMonth" // dayGridMonth, timeGridWeek, timeGridDay, listWeek
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
        }}
        events={fetchEvents} // Function to fetch events
        eventContent={renderEventContent}
        editable={false}
        selectable={false}
        eventClick={handleEventClick} // Add eventClick handler
        height="auto"
        contentHeight="auto"
        // loading={(isLoading) => setLoading(isLoading)}
      />

      {selectedEventInfo && (
        <EventDetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          eventInfo={selectedEventInfo}
        />
      )}
    </div>
  );
};

export default ClientSchedulePage;
