import React, { useState, useEffect } from 'react';
import clientService from '../../api/clientService'; // To fetch clients for dropdown
// Basic styling, can be expanded
const formStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
  padding: '20px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  backgroundColor: '#f9f9f9',
  maxWidth: '500px',
  margin: '20px auto',
};
const labelStyles = {
  fontWeight: 'bold',
  marginBottom: '5px',
};
const inputStyles = {
  padding: '10px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '1em',
};
const buttonStyles = {
  padding: '10px 15px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '1em',
};
const errorStyles = {
  color: 'red',
  marginBottom: '10px',
};

const AppointmentForm = ({ initialData = null, onSubmit, onCancel, isEditMode = false }) => {
  const [formData, setFormData] = useState({
    client_user_id: '', // Store as UUID
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    appointment_type: 'Consultation', // Default type
    status: 'Scheduled', // Default status
  });
  const [clients, setClients] = useState([]); // For client dropdown
  const [error, setError] = useState('');
  const [loadingClients, setLoadingClients] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoadingClients(true);
    clientService.getClients() // Fetches clients associated with the trainer
      .then(data => {
        setClients(data || []);
      })
      .catch(err => {
        console.error("Failed to fetch clients for form:", err);
        setError("Could not load client list. " + err.message);
      })
      .finally(() => setLoadingClients(false));
  }, []);

  useEffect(() => {
    if (isEditMode && initialData) {
      // Format dates for datetime-local input if they exist
      const formatDateTimeLocal = (isoString) => {
        if (!isoString) return '';
        try {
          // Supabase TIMESTAMPTZ might be '2023-10-27T10:00:00+00:00'
          // datetime-local input needs 'YYYY-MM-DDTHH:mm'
          const date = new Date(isoString);
          // Adjust for timezone if necessary, or assume UTC and let browser handle display
          // For simplicity, assuming the isoString is directly convertible or already in a good state.
          // A more robust solution might use a date library like date-fns or moment to handle timezones.
          const year = date.getFullYear();
          const month = (`0${date.getMonth() + 1}`).slice(-2);
          const day = (`0${date.getDate()}`).slice(-2);
          const hours = (`0${date.getHours()}`).slice(-2);
          const minutes = (`0${date.getMinutes()}`).slice(-2);
          return `${year}-${month}-${day}T${hours}:${minutes}`;
        } catch (e) {
          console.error("Error formatting date for input:", e);
          return ''; // Fallback
        }
      };

      setFormData({
        client_user_id: initialData.client_id || initialData.client_user_id || '', // client_id from RPC, client_user_id from direct model
        title: initialData.title || '',
        description: initialData.description || '',
        start_time: formatDateTimeLocal(initialData.start_time),
        end_time: formatDateTimeLocal(initialData.end_time),
        appointment_type: initialData.appointment_type || 'Consultation',
        status: initialData.status || 'Scheduled',
      });
    } else {
      // Reset for new form
      setFormData({
        client_user_id: '',
        title: '',
        description: '',
        start_time: '',
        end_time: '',
        appointment_type: 'Consultation',
        status: 'Scheduled',
      });
    }
  }, [initialData, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.client_user_id || !formData.title || !formData.start_time || !formData.end_time) {
      setError('Client, title, start time, and end time are required.');
      return;
    }
    if (new Date(formData.start_time) >= new Date(formData.end_time)) {
        setError('End time must be after start time.');
        return;
    }

    setSubmitting(true);
    try {
      // Convert local datetime strings back to ISO strings for Supabase (TIMESTAMPTZ)
      const submissionData = {
        ...formData,
        start_time: new Date(formData.start_time).toISOString(),
        end_time: new Date(formData.end_time).toISOString(),
      };
      await onSubmit(submissionData);
    } catch (err) {
      setError(err.message || `Failed to ${isEditMode ? 'update' : 'create'} appointment.`);
      console.error("Appointment form submission error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={formStyles}>
      <h3>{isEditMode ? 'Edit Appointment' : 'Add New Appointment'}</h3>
      {error && <p style={errorStyles}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <label style={labelStyles} htmlFor="client_user_id">Client:</label>
          {loadingClients ? <p>Loading clients...</p> : (
            <select
              name="client_user_id"
              id="client_user_id"
              value={formData.client_user_id}
              onChange={handleChange}
              required
              style={inputStyles}
              disabled={clients.length === 0}
            >
              <option value="">{clients.length === 0 ? "No clients available" : "Select a client"}</option>
              {clients.map(client => (
                // client.id here is client_user_id from getClients() which maps client_id from RPC
                <option key={client.id} value={client.id}>
                  {client.full_name || client.email} {/* Display full_name or email */}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label style={labelStyles} htmlFor="title">Title:</label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            required
            style={inputStyles}
          />
        </div>

        <div>
          <label style={labelStyles} htmlFor="description">Description:</label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            style={{...inputStyles, minHeight: '80px'}}
          />
        </div>

        <div>
          <label style={labelStyles} htmlFor="start_time">Start Time:</label>
          <input
            type="datetime-local"
            name="start_time"
            id="start_time"
            value={formData.start_time}
            onChange={handleChange}
            required
            style={inputStyles}
          />
        </div>

        <div>
          <label style={labelStyles} htmlFor="end_time">End Time:</label>
          <input
            type="datetime-local"
            name="end_time"
            id="end_time"
            value={formData.end_time}
            onChange={handleChange}
            required
            style={inputStyles}
          />
        </div>

        <div>
          <label style={labelStyles} htmlFor="appointment_type">Type:</label>
          <select
            name="appointment_type"
            id="appointment_type"
            value={formData.appointment_type}
            onChange={handleChange}
            style={inputStyles}
          >
            <option value="Consultation">Consultation</option>
            <option value="Training Session">Training Session</option>
            <option value="Check-in">Check-in</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label style={labelStyles} htmlFor="status">Status:</label>
          <select
            name="status"
            id="status"
            value={formData.status}
            onChange={handleChange}
            style={inputStyles}
          >
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Rescheduled">Rescheduled</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button type="submit" disabled={submitting || loadingClients} style={buttonStyles}>
            {submitting ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Appointment' : 'Create Appointment')}
          </button>
          <button type="button" onClick={onCancel} style={{...buttonStyles, backgroundColor: '#6c757d'}}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;
