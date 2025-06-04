import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../api/authService';
import RecommendedTasks from '../components/dashboard/RecommendedTasks';
import UpcomingAppointmentsPreview from '../components/dashboard/UpcomingAppointmentsPreview'; // Import UpcomingAppointmentsPreview
import { useAuth } from '../contexts/AuthContext';
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
        {userRole === 'trainer' ? (
          <h1>Trainer Dashboard</h1>
        ) : (
          <h1>Client Dashboard</h1>
        )}
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </header>
      <main className="dashboard-main-content">
        {/* Welcome message can be here if desired, or integrated elsewhere */}
        {/* <h2>Welcome {user?.email || 'User'}!</h2> */}

        {userRole === 'trainer' && (
          <div className="trainer-dashboard-layout">
            <section className="trainer-main-focus">
              <UpcomingAppointmentsPreview />
              <RecommendedTasks />
            </section>
            <aside className="trainer-quick-actions">
              <h3>Quick Actions</h3>
              <div className="action-card">
                <h4>Manage Clients</h4>
                <p>View, add, edit client profiles.</p>
                <Link to="/clients" className="btn btn-primary btn-block">Go to Clients</Link>
              </div>
              <div className="action-card">
                <h4>Full Schedule</h4>
                <p>Manage all appointments.</p>
                <Link to="/trainer-schedule" className="btn btn-primary btn-block">View Trainer Schedule</Link>
              </div>
              <div className="action-card">
                <h4>Fitness Plans</h4>
                <p>Create & manage fitness plans.</p>
                <Link to="/trainer/fitness-plans" className="btn btn-primary btn-block">Go to Fitness Plans</Link>
              </div>
            </aside>
          </div>
        )}

        {userRole === 'client' && (
          <section className="dashboard-actions client-actions">
            {/* Client specific layout can be different */}
            <div className="action-card">
              <h3>My Schedule & Plan</h3>
              <p>View your appointments, nutrition, and fitness plans.</p>
              <Link to="/my-schedule" className="btn btn-primary">View My Schedule</Link>
            </div>
            <div className="action-card">
              <h3>My Progress</h3>
              <p>Track your measurements and goal progress.</p>
              <Link to="/my-progress" className="btn btn-primary">View My Progress</Link>
            </div>
          </section>
        )}

        {/* General welcome message or other content can go here if not specific to a role */}
        {userRole === 'unknown' && (
            <p>Loading dashboard based on your role...</p>
        )}

      </main>
      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} FitApp Trainer Dashboard</p>
      </footer>
    </div>
  );
};

export default DashboardPage;
