import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientForm from '../components/clients/ClientForm';
import clientService from '../api/clientService';
import './FormPage.css'; // Generic styling for form pages

const AddClientPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (clientData) => {
    try {
      setError('');
      // clientData from ClientForm now includes client_user_id and profile fields
      const createdClientLink = await clientService.createClient(clientData);
      // createClient returns the record from the 'clients' table, which has client_user_id
      if (createdClientLink && createdClientLink.client_user_id) {
        navigate(`/clients/${createdClientLink.client_user_id}`);
      } else {
        // Fallback if the response structure is not as expected, though createClient should throw on error
        navigate('/clients');
      }
    } catch (err) {
      setError(err.message || 'Failed to add client. Please ensure the Client User ID is correct and the user exists.');
      console.error("Create client error:", err);
    }
  };

  return (
    <div className="form-page-container">
      <h2>Add New Client</h2>
      {error && <p className="error-message page-error">{error}</p>}
      <ClientForm onSubmit={handleSubmit} isEditMode={false} />
    </div>
  );
};

export default AddClientPage;
