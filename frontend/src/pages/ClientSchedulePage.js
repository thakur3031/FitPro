import React, { useEffect, useState, useMemo } from 'react';
import clientScheduleService from '../api/clientScheduleService';
import ScheduleItem from '../components/schedule/ScheduleItem'; // Assuming path is correct
import { useAuth } from '../contexts/AuthContext'; // To check if user is logged in
import { useNavigate } from 'react-router-dom';
import './ClientSchedulePage.css'; // For styling

const ClientSchedulePage = () => {
  const [scheduleItems, setScheduleItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setError("User not authenticated. Please log in to view your schedule.");
      setLoading(false);
      // Optional: redirect to login if not already handled by PrivateRoute
      // navigate('/login?message=Please log in to view your schedule.');
      return;
    }

    const fetchSchedule = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await clientScheduleService.getClientScheduleData();
        setScheduleItems(data || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch schedule data.');
        console.error("Fetch schedule error:", err);
        if (err.code === 'PGRST301' || err.message?.includes('JWT')) {
          navigate('/login?message=Session expired or unauthorized. Please log in again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [user, navigate]);

  // Process and group items by date
  const groupedSchedule = useMemo(() => {
    if (!scheduleItems || scheduleItems.length === 0) return {};

    const grouped = scheduleItems.reduce((acc, item) => {
      let itemDateStr;
      if (item.item_type === 'appointment' && item.start_time) {
        itemDateStr = new Date(item.start_time).toDateString(); // Group by date of start_time
      } else if (item.day_of_week) {
        // For plan items, we need to map day_of_week to actual dates for the current/upcoming week.
        // This is complex for a simple list. For now, group them under a generic "Weekly Plan Items"
        // or try to display for the current week based on day_of_week.
        // Simplified: Group by day_of_week if no specific date.
        // A more robust solution would involve a calendar view or generating occurrences.
        itemDateStr = item.day_of_week || 'Unscheduled Plan Items';
      } else {
        itemDateStr = 'Unscheduled or General Plan Items';
      }

      if (!acc[itemDateStr]) {
        acc[itemDateStr] = [];
      }
      acc[itemDateStr].push(item);
      return acc;
    }, {});

    // Sort items within each group (appointments by time, others as they come)
    for (const dateKey in grouped) {
      grouped[dateKey].sort((a, b) => {
        if (a.item_type === 'appointment' && b.item_type === 'appointment' && a.start_time && b.start_time) {
          return new Date(a.start_time) - new Date(b.start_time);
        }
        // Add other sorting logic if needed for plan items, e.g., by meal_type
        return 0; // Default: no specific sub-sorting for plan items yet
      });
    }

    // Sort the date groups themselves. Dates first, then day_of_week strings, then generic.
    // This is a basic sort; a calendar library would handle this better.
    const sortedGroupKeys = Object.keys(grouped).sort((a, b) => {
        const aIsDate = !isNaN(new Date(a).getTime());
        const bIsDate = !isNaN(new Date(b).getTime());
        if (aIsDate && bIsDate) return new Date(a) - new Date(b);
        if (aIsDate) return -1; // Dates first
        if (bIsDate) return 1;  // Dates first
        // Basic string sort for non-date keys (like 'Monday', 'Unscheduled...')
        return a.localeCompare(b);
    });

    const sortedGroupedSchedule = {};
    sortedGroupKeys.forEach(key => {
        sortedGroupedSchedule[key] = grouped[key];
    });

    return sortedGroupedSchedule;
  }, [scheduleItems]);

  if (loading) {
    return <p className="loading-message">Loading your schedule...</p>;
  }

  if (error) {
    return <p className="error-message page-error">{error}</p>;
  }

  return (
    <div className="client-schedule-page-container">
      <div className="schedule-header">
        <h1>My Schedule & Plan</h1>
      </div>

      {Object.keys(groupedSchedule).length === 0 && !loading && (
        <p className="info-message">Your schedule is currently empty. Your trainer will assign plans and appointments soon.</p>
      )}

      {Object.entries(groupedSchedule).map(([dateOrDay, items]) => (
        <section key={dateOrDay} className="schedule-group">
          <h2 className="group-title">
            {/* Attempt to format if it's a valid date string, otherwise display as is */}
            {!isNaN(new Date(dateOrDay).getTime()) ? new Date(dateOrDay).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : dateOrDay}
          </h2>
          <ul className="schedule-items-list">
            {items.map(item => (
              <ScheduleItem key={item.item_id} item={item} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
};

export default ClientSchedulePage;
