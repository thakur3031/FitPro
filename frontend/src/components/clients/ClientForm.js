import React, { useState, useEffect } from 'react';
import './ClientForm.css'; // For styling

const ClientForm = ({ initialData = {}, onSubmit, isEditMode = false }) => {
  const [formData, setFormData] = useState({
    client_user_id: '', // Only for add mode
    full_name: '',
    avatar_url: '',
    phone_number: '',
    health_notes: '',
    // Remove fields not directly part of 'profiles' or not editable by trainer:
    // email: '', (comes from auth.users, not directly editable in profile by trainer)
    // date_of_birth: '', (can be added to profiles if needed)
    // address: '', (can be added to profiles if needed)
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode && initialData) {
      // For edit mode, initialData is the client's profile
      setFormData({
        client_user_id: initialData.id || '', // Should be the profile ID (UUID)
        full_name: initialData.full_name || '',
        avatar_url: initialData.avatar_url || '',
        phone_number: initialData.phone_number || '',
        health_notes: initialData.health_notes || '',
      });
    } else if (!isEditMode) {
      // For add mode, ensure fields are clear or use passed initialData for client_user_id if any
      setFormData({
        client_user_id: initialData.client_user_id || '',
        full_name: initialData.full_name || '', // Trainers might pre-fill this if they know it
        avatar_url: initialData.avatar_url || '',
        phone_number: initialData.phone_number || '',
        health_notes: initialData.health_notes || '',
      });
    }
  }, [initialData, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    let dataToSubmit;
    if (!isEditMode) {
      // For adding a client, we need client_user_id and profile fields
      if (!formData.client_user_id) {
        setError('Client User ID is required to add a new client.');
        setSubmitting(false);
        return;
      }
      // full_name is also good to have for the profile update part of createClient
      if (!formData.full_name) {
        setError('Full name is required for the client profile.');
        setSubmitting(false);
        return;
      }
      dataToSubmit = {
        client_user_id: formData.client_user_id, // This is the ID of the user to be linked
        full_name: formData.full_name,
        avatar_url: formData.avatar_url,
        phone_number: formData.phone_number,
        health_notes: formData.health_notes,
      };
    } else {
      // For editing, we submit only profile fields. client_user_id is not part of the form data itself for update.
      // The ID for update is passed separately to clientService.updateClient.
      if (!formData.full_name) {
        setError('Full name is required.');
        setSubmitting(false);
        return;
      }
      dataToSubmit = {
        full_name: formData.full_name,
        avatar_url: formData.avatar_url,
        phone_number: formData.phone_number,
        health_notes: formData.health_notes,
      };
    }

    try {
      await onSubmit(dataToSubmit); // onSubmit will receive the correct data structure
    } catch (err) {
      setError(err.message || `Failed to ${isEditMode ? 'update client profile' : 'add client'}.`);
      console.error("Client form submission error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="client-form">
      {error && <p className="error-message form-error">{error}</p>}

      {!isEditMode && (
        <div className="form-group">
          <label htmlFor="client_user_id">Client User ID (UUID) <span className="required-asterisk">*</span></label>
          <input
            type="text"
            name="client_user_id"
            id="client_user_id"
            value={formData.client_user_id}
            onChange={handleChange}
            placeholder="Enter existing client's User ID (UUID)"
            required={!isEditMode}
            readOnly={isEditMode} // Should not be editable in edit mode
          />
        </div>
      )}

      <div className="form-group">
        <label htmlFor="full_name">Full Name <span className="required-asterisk">*</span></label>
        <input
          type="text"
          name="full_name"
          id="full_name"
          value={formData.full_name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="avatar_url">Avatar URL</label>
        <input
          type="url"
          name="avatar_url"
          id="avatar_url"
          value={formData.avatar_url}
          onChange={handleChange}
          placeholder="http://example.com/avatar.png"
        />
      </div>

      <div className="form-group">
        <label htmlFor="phone_number">Phone Number</label>
        <input
          type="tel"
          name="phone_number"
          id="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="health_notes">Health Notes</label>
        <textarea
          name="health_notes"
          id="health_notes"
          value={formData.health_notes}
          onChange={handleChange}
        />
      </div>

      <button type="submit" disabled={submitting} className="btn-submit">
        {submitting
          ? (isEditMode ? 'Updating Profile...' : 'Adding Client...')
          : (isEditMode ? 'Update Profile' : 'Add Client to Roster')}
      </button>
    </form>
  );
};

export default ClientForm;
