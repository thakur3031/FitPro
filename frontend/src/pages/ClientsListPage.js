import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import clientService from '../api/clientService';
import './ClientsListPage.css'; // For styling

const ClientsListPage = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const data = await clientService.getClients(); // This now calls the RPC
        // The RPC returns client_id, full_name, email, avatar_url, join_date
        // clientService.getClients maps client_id to id.
        setClients(data || []); // Ensure data is an array
        setError('');
      } catch (err) {
        setError(err.message || 'Failed to fetch clients. Please ensure you are logged in and the RPC function `get_trainer_clients` is set up correctly in Supabase.');
        console.error("Fetch clients error:", err);
        // Check for specific Supabase error codes if needed, or rely on PrivateRoute for session issues
        if (err.code === 'PGRST301' || err.message?.includes('JWT')) { // Example: JWT expired or RLS issue
            navigate('/login?message=Session expired or unauthorized. Please log in again.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, [navigate]);

  const handleDelete = async (clientUserId) => { // clientUserId is the UUID from profiles/auth.users
    if (window.confirm('Are you sure you want to remove this client association? This does not delete their account.')) {
      try {
        await clientService.deleteClient(clientUserId);
        setClients(clients.filter(client => client.id !== clientUserId)); // client.id should be client_user_id
        setError(''); // Clear previous errors
      } catch (err) {
        setError(err.message || 'Failed to delete client association.');
        console.error("Delete client error:", err);
      }
    }
  };

  if (loading) {
    return <p className="loading-message">Loading clients...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="clients-list-container">
      <div className="clients-list-header">
        <h1>Your Clients</h1>
        <Link to="/clients/new" className="btn btn-add-new">Add New Client</Link>
      </div>
      {clients.length === 0 ? (
        <p>No clients found. Get started by adding a new client!</p>
      ) : (
        <table className="clients-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th> {/* This field comes from the RPC via profiles table */}
              <th>Join Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* client.id is mapped from client_id (which is profiles.id / auth.users.id) by clientService */}
            {clients.map(client => (
              <tr key={client.id}>
                <td>{client.full_name || 'N/A'}</td>
                <td>{client.email || 'N/A'}</td>
                <td>{client.phone_number || 'N/A'}</td> {/* Ensure RPC provides this from profiles */}
                <td>{client.join_date ? new Date(client.join_date).toLocaleDateString() : 'N/A'}</td>
                <td className="client-actions">
                  {/* Pass client.id (which is the client_user_id UUID) to routes */}
                  <Link to={`/clients/${client.id}`} className="btn btn-view">View</Link>
                  <Link to={`/clients/${client.id}/edit`} className="btn btn-edit">Edit</Link>
                  <button onClick={() => handleDelete(client.id)} className="btn btn-delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ClientsListPage;
