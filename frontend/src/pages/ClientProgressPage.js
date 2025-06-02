import React, { useEffect, useState } from 'react';
import clientDataService from '../api/clientDataService';
import MeasurementChart from '../components/charts/MeasurementChart'; // Reusable chart component
import GoalProgressItem from '../components/goals/GoalProgressItem';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './ClientProgressPage.css'; // For styling

const ClientProgressPage = () => {
  const [measurements, setMeasurements] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setError("User not authenticated. Please log in.");
      setLoading(false);
      // navigate('/login?message=Please log in to view your progress.'); // Optional redirect
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const [measurementsData, goalsData] = await Promise.all([
          clientDataService.getClientMeasurements(),
          clientDataService.getClientGoals(),
        ]);
        setMeasurements(measurementsData || []);
        setGoals(goalsData || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch progress data.');
        console.error("Fetch progress data error:", err);
        if (err.code === 'PGRST301' || err.message?.includes('JWT')) {
          navigate('/login?message=Session expired or unauthorized. Please log in again.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, navigate]);

  // Prepare data for charts
  const prepareChartData = (measurementKey, label, borderColor, backgroundColor) => {
    if (!measurements || measurements.length === 0) return null;

    const filteredMeasurements = measurements.filter(m => m[measurementKey] !== null && m[measurementKey] !== undefined);
    if (filteredMeasurements.length === 0) return null;

    return {
      labels: filteredMeasurements.map(m => new Date(m.measurement_date)),
      datasets: [{
        label: label,
        data: filteredMeasurements.map(m => m[measurementKey]),
        borderColor: borderColor || 'rgb(75, 192, 192)',
        backgroundColor: backgroundColor || 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
        fill: true,
      }],
    };
  };

  const weightChartData = prepareChartData('weight_kg', 'Weight (kg)', 'rgb(255, 99, 132)', 'rgba(255, 99, 132, 0.2)');
  const bodyFatChartData = prepareChartData('body_fat_percentage', 'Body Fat %', 'rgb(54, 162, 235)', 'rgba(54, 162, 235, 0.2)');
  // Add more charts as needed, e.g., waist_circumference_cm

  if (loading) {
    return <p className="loading-message">Loading your progress...</p>;
  }

  if (error) {
    return <p className="error-message page-error">{error}</p>;
  }

  return (
    <div className="client-progress-page-container">
      <div className="progress-header">
        <h1>My Progress & Goals</h1>
      </div>

      <section className="charts-section">
        <h2>Measurement History</h2>
        {weightChartData ? (
          <MeasurementChart title="Weight Over Time" chartData={weightChartData} yAxisLabel="Weight (kg)" />
        ) : (
          <p className="info-message">No weight measurement data recorded yet to display chart.</p>
        )}
        {bodyFatChartData ? (
          <MeasurementChart title="Body Fat Percentage Over Time" chartData={bodyFatChartData} yAxisLabel="Body Fat %" />
        ) : (
          <p className="info-message">No body fat percentage data recorded yet to display chart.</p>
        )}
        {/* Add more charts here if needed */}
      </section>

      <section className="goals-section">
        <h2>My Goals</h2>
        {goals.length > 0 ? (
          <ul className="goals-list">
            {goals.map(goal => (
              <GoalProgressItem key={goal.id} goal={goal} />
            ))}
          </ul>
        ) : (
          <p className="info-message">No goals set yet. Your trainer can help you set some!</p>
        )}
      </section>
    </div>
  );
};

export default ClientProgressPage;
