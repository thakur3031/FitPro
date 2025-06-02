import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../api/authService';
import RecommendedTasks from '../components/dashboard/RecommendedTasks'; // Import RecommendedTasks
import { useAuth } from '../contexts/AuthContext'; // Import useAuth to get user role
import './DashboardPage.css';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user from AuthContext

  // Determine user role (example assumes role is stored in user_metadata)
  // This might need adjustment if role is in a 'profiles' table and AuthContext fetches it.
  const userRole = user?.user_metadata?.user_role || 'unknown';
  // Fallback for testing if user_metadata.user_role isn't populated:
  // const userRole = 'client'; // or 'trainer' for testing purposes

  const handleLogout = async () => { // Make async to await signOut if needed
    try {
      await authService.signOut(); // Changed from logout() to signOut()
      navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error);
      // Optionally, show an error message to the user
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Trainer Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </header>
      <main className="dashboard-main-content">
        <h2>Welcome to your Dashboard!</h2>
        <p>This is your central hub for managing your clients and activities.</p>

        <section className="dashboard-actions">
          {userRole === 'trainer' && (
            <>
              <div className="action-card">
                <h3>Manage Your Clients</h3>
                <p>View, add, edit, or delete client profiles and their plans.</p>
                <Link to="/clients" className="btn btn-primary">Go to Clients</Link>
              </div>
              <div className="action-card">
                <h3>My Schedule (Trainer)</h3>
                <p>View and manage your appointments and client sessions.</p>
                <Link to="/trainer-schedule" className="btn btn-primary">View Trainer Schedule</Link>
              </div>
            </>
          )}

          {userRole === 'client' && (
            <div className="action-card">
              <h3>My Schedule & Plan</h3>
              <p>View your appointments, nutrition, and fitness plans.</p>
              <Link to="/my-schedule" className="btn btn-primary">View My Schedule</Link>
            </div>
          )}

          {userRole === 'client' && (
            <div className="action-card">
              <h3>My Progress</h3>
              <p>Track your measurements and goal progress.</p>
              <Link to="/my-progress" className="btn btn-primary">View My Progress</Link>
            </div>
          )}

          {/*
            Future sections can be added here, e.g.:
            <div className="action-card">
              <h3>Track Progress</h3>
              <p>Monitor client progress and adjust their plans.</p>
              <Link to="/progress" className="btn btn-primary">Track Progress</Link>
            </div>
          */}
        </section>

        {/* Recommended Tasks Section (Potentially conditional based on role too) */}
        {userRole === 'trainer' && <RecommendedTasks />}

      </main>
      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} FitApp Trainer Dashboard</p>
      </footer>
    </div>
  );
};

export default DashboardPage;
