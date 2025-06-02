import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import clientService from '../api/clientService';
import './ClientDetailPage.css'; // For styling

const ClientDetailPage = () => {
  const [clientProfile, setClientProfile] = useState(null); // Stores profile data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { clientId } = useParams(); // This is the client_user_id (UUID)
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientDetails = async () => {
      if (!clientId) {
        setError("No client ID provided.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await clientService.getClient(clientId); // Fetches from 'profiles'
        setClientProfile(data);
        setError('');
      } catch (err) {
        setError(err.message || 'Failed to fetch client details.');
        console.error(`Fetch client profile ${clientId} error:`, err);
        if (err.code === 'PGRST301' || err.message?.includes('JWT')) { // Example: JWT expired or RLS issue
            navigate('/login?message=Session expired or unauthorized. Please log in again.');
        } else if (err.code === 'PGRST116') { // Resource not found (e.g., client profile doesn't exist)
            setError('Client profile not found.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClientDetails();
  }, [clientId, navigate]);

  if (loading) {
    return <p className="loading-message">Loading client details...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!clientProfile) {
    return <p className="info-message">No client data available.</p>;
  }

  // Note: `clientProfile.email` might not be available if your RLS on `profiles` table restricts it
  // and `auth.users` table is not directly joined/queried here.
  // The `get_trainer_clients` RPC handles joining with `auth.users` for email.
  // If email is crucial here, `clientService.getClient` might need adjustment or join.
  // For now, displaying fields available directly from the `profiles` table.
  return (
    <div className="client-detail-container">
      <div className="client-detail-header">
        <h1>{clientProfile.full_name || 'Client Details'}</h1>
        <Link to={`/clients/${clientId}/edit`} className="btn btn-edit-client">Edit Profile</Link>
      </div>
      <div className="client-detail-content">
        <p><strong>Full Name:</strong> {clientProfile.full_name || 'N/A'}</p>
        <p><strong>Email:</strong> {clientProfile.email || 'N/A (Email might be restricted)'}</p>
        <p><strong>Phone:</strong> {clientProfile.phone_number || 'N/A'}</p>
        {/* Add other fields from 'profiles' table as needed */}
        {/* <p><strong>Date of Birth:</strong> {clientProfile.date_of_birth ? new Date(clientProfile.date_of_birth).toLocaleDateString() : 'N/A'}</p> */}
        {/* <p><strong>Address:</strong> {clientProfile.address || 'N/A'}</p> */}
        <p><strong>Health Notes:</strong> {clientProfile.health_notes || 'N/A'}</p>
        <p><strong>Profile Updated At:</strong> {clientProfile.updated_at ? new Date(clientProfile.updated_at).toLocaleString() : 'N/A'}</p>
        {clientProfile.avatar_url && (
          <div className="profile-picture-section">
            <strong>Avatar:</strong>
            <img src={clientProfile.avatar_url} alt={`${clientProfile.full_name || 'Client'}`} className="profile-picture" />
          </div>
        )}
      </div>
      <Link to="/clients" className="btn btn-back-to-list">Back to Clients List</Link>
    </div>
  );
};

export default ClientDetailPage;
