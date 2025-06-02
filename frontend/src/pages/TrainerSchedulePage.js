import React, { useEffect, useState, useCallback } from 'react';
import appointmentService from '../api/appointmentService';
import AppointmentForm from '../components/appointments/AppointmentForm'; // Assuming path is correct
import { useAuth } from '../contexts/AuthContext'; // To check if user is logged in
import { useNavigate } from 'react-router-dom';
import './TrainerSchedulePage.css'; // For styling

const TrainerSchedulePage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null); // null or appointment object

  const { user } = useAuth(); // Get user from AuthContext
  const navigate = useNavigate();

  const fetchAppointments = useCallback(async () => {
    if (!user) {
      setError("User not authenticated. Cannot fetch appointments.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError('');
      const data = await appointmentService.getTrainerAppointments();
      setAppointments(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch appointments.');
      console.error("Fetch appointments error:", err);
      if (err.code === 'PGRST301' || err.message?.includes('JWT')) {
        navigate('/login?message=Session expired or unauthorized. Please log in again.');
      }
    } finally {
      setLoading(false);
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleFormSubmit = async (appointmentData) => {
    try {
      setError(''); // Clear previous errors
      if (editingAppointment) {
        await appointmentService.updateAppointment(editingAppointment.id, appointmentData);
      } else {
        await appointmentService.createAppointment(appointmentData);
      }
      setShowForm(false);
      setEditingAppointment(null);
      fetchAppointments(); // Refresh the list
    } catch (err) {
      setError(err.message || `Failed to ${editingAppointment ? 'update' : 'create'} appointment.`);
      console.error("Appointment submission error:", err);
      // Do not close form on error, user might want to retry
    }
  };

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    setShowForm(true);
    setError(''); // Clear errors when opening form
  };

  const handleDelete = async (appointmentId) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        setError(''); // Clear previous errors
        await appointmentService.deleteAppointment(appointmentId);
        fetchAppointments(); // Refresh the list
      } catch (err) {
        setError(err.message || 'Failed to delete appointment.');
        console.error("Delete appointment error:", err);
      }
    }
  };

  const openAddForm = () => {
    setEditingAppointment(null);
    setShowForm(true);
    setError(''); // Clear errors when opening form
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingAppointment(null);
    setError(''); // Clear errors when closing form
  };

  if (loading) {
    return <p className="loading-message">Loading appointments...</p>;
  }

  return (
    <div className="schedule-page-container">
      <div className="schedule-header">
        <h1>My Schedule</h1>
        <button onClick={openAddForm} className="btn btn-add-appointment">
          Add New Appointment
        </button>
      </div>

      {error && <p className="error-message page-error">{error}</p>}

      {showForm && (
        <div className="form-modal-backdrop"> {/* Basic modal simulation */}
          <div className="form-modal-content">
            <AppointmentForm
              initialData={editingAppointment}
              onSubmit={handleFormSubmit}
              onCancel={closeForm}
              isEditMode={!!editingAppointment}
            />
          </div>
        </div>
      )}

      {appointments.length === 0 && !loading && !showForm && (
        <p className="info-message">No appointments scheduled. Click "Add New Appointment" to get started.</p>
      )}

      {!showForm && appointments.length > 0 && (
        <ul className="appointments-list">
          {appointments.map(app => (
            <li key={app.id} className="appointment-item">
              <div className="appointment-details">
                <h3>{app.title}</h3>
                <p><strong>Client:</strong> {app.client_full_name || 'N/A'}</p>
                <p>
                  <strong>Time:</strong>
                  {app.start_time ? new Date(app.start_time).toLocaleString() : 'N/A'} -
                  {app.end_time ? new Date(app.end_time).toLocaleString() : 'N/A'}
                </p>
                <p><strong>Type:</strong> {app.appointment_type || 'N/A'}</p>
                <p><strong>Status:</strong> {app.status || 'N/A'}</p>
                {app.description && <p><strong>Description:</strong> {app.description}</p>}
              </div>
              <div className="appointment-actions">
                <button onClick={() => handleEdit(app)} className="btn btn-edit">Edit</button>
                <button onClick={() => handleDelete(app.id)} className="btn btn-delete">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TrainerSchedulePage;
