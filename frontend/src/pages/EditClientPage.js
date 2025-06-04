import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ClientForm from '../components/clients/ClientForm';
import clientService from '../api/clientService';
import './FormPage.css'; // Generic styling for form pages

const EditClientPage = () => {
  const { clientId } = useParams(); // This is the client_user_id (UUID)
  const navigate = useNavigate();
  const [clientProfile, setClientProfile] = useState(null); // Stores profile data
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState(''); // For errors fetching data
  const [formError, setFormError] = useState(''); // For errors during form submission

  useEffect(() => {
    const fetchClientProfile = async () => {
      if (!clientId) {
        setPageError("No client ID provided for editing.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setPageError('');
        const data = await clientService.getClient(clientId); // Fetches from 'profiles'
        setClientProfile(data);
      } catch (err) {
        setPageError(err.message || 'Failed to fetch client profile data.');
        console.error("Fetch client profile for edit error:", err);
        if (err.code === 'PGRST301' || err.message?.includes('JWT')) {
            navigate('/login?message=Session expired or unauthorized. Please log in again.');
        } else if (err.code === 'PGRST116') {
            setPageError('Client profile not found.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchClientProfile();
  }, [clientId, navigate]);

  const handleSubmit = async (profileDataToUpdate) => {
    // profileDataToUpdate comes from ClientForm, contains fields like full_name, avatar_url etc.
    try {
      setFormError('');
      await clientService.updateClient(clientId, profileDataToUpdate);
      navigate(`/clients/${clientId}`); // Navigate to detail page after successful update
    } catch (err) {
      setFormError(err.message || 'Failed to update client profile. Please check the form and try again.');
      console.error("Update client profile error:", err);
    }
  };

  if (loading) {
    return <p className="loading-message">Loading client data for editing...</p>;
  }

  if (pageError) {
    return <p className="error-message page-error">{pageError}</p>;
  }

  if (!clientProfile) {
    return <p className="info-message">Client data not available for editing.</p>;
  }

  return (
    <div className="form-page-container">
      <h2>Edit Client Profile: {clientProfile.full_name || clientId}</h2>
      {formError && <p className="error-message page-error">{formError}</p>}
      {/* ClientForm expects initialData to be the profile object */}
      <ClientForm initialData={clientProfile} onSubmit={handleSubmit} isEditMode={true} />
    </div>
  );
};

export default EditClientPage;
