import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import appointmentService from '../../api/appointmentService'; // Assuming this path is correct
import { useAuth } from '../../contexts/AuthContext'; // To ensure user is logged in
import './UpcomingAppointmentsPreview.css'; // To be created

const UpcomingAppointmentsPreview = ({ maxAppointments = 5 }) => {
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchAppointmentsPreview = useCallback(async () => {
    if (!user) {
      // This component might be rendered before user context is fully resolved,
      // or if there's an issue. Silently fail or show minimal message for a preview.
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError('');
      // Get all appointments and then filter/slice for preview
      // The RPC get_trainer_appointments_with_client_names sorts by start_time ASC
      const allAppointments = await appointmentService.getTrainerAppointments();

      const now = new Date();
      const futureAppointments = (allAppointments || [])
        .filter(app => new Date(app.start_time) >= now) // Filter for appointments starting from now
        .slice(0, maxAppointments); // Take the first few

      setUpcomingAppointments(futureAppointments);
    } catch (err) {
      console.error("Fetch upcoming appointments error:", err);
      // Don't necessarily show a big error message on the dashboard preview,
      // but log it or show a subtle indicator.
      setError('Could not load upcoming appointments.');
      if (err.code === 'PGRST301' || err.message?.includes('JWT')) {
        // If auth error, it might be handled globally or by PrivateRoute,
        // but good to be aware. For a preview, might just show empty.
        // navigate('/login?message=Session expired.'); // Avoid navigate in a small preview component if possible
      }
    } finally {
      setLoading(false);
    }
  }, [user, maxAppointments /*, navigate - removed navigate to avoid re-fetch on navigation events if not intended */]);

  useEffect(() => {
    fetchAppointmentsPreview();
  }, [fetchAppointmentsPreview]);

  return (
    <div className="upcoming-appointments-preview">
      <h3 className="preview-title">Upcoming Appointments</h3>
      {loading && <p>Loading appointments...</p>}
      {error && <p className="preview-error">{error}</p>}
      {!loading && !error && upcomingAppointments.length === 0 && (
        <p>No upcoming appointments found for today or tomorrow.</p>
      )}
      {!loading && !error && upcomingAppointments.length > 0 && (
        <ul className="appointments-preview-list">
          {upcomingAppointments.map(app => (
            <li key={app.id} className="appointment-preview-item">
              <div className="appointment-time">
                {app.start_time ? new Date(app.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : 'N/A'}
                {app.start_time && <span className="appointment-date-preview">{new Date(app.start_time).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>}
              </div>
              <div className="appointment-info">
                <span className="appointment-title-preview">{app.title}</span>
                <span className="client-name-preview">Client: {app.client_full_name || 'N/A'}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="preview-actions">
        <Link to="/trainer-schedule" className="btn btn-secondary btn-sm">View Full Schedule</Link>
      </div>
    </div>
  );
};

export default UpcomingAppointmentsPreview;
