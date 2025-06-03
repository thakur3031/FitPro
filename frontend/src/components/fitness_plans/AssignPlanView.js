import React, { useState, useEffect } from 'react';
import clientService from '../../api/clientService'; // To fetch clients
import assignedFitnessPlanService from '../../api/assignedFitnessPlanService';
// Basic styling will be in AssignPlanView.css (created next)

const AssignPlanView = ({ activePlan, onPlanAssigned, onAssignmentError }) => {
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [loadingClients, setLoadingClients] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    setLoadingClients(true);
    clientService.getClients()
      .then(data => setClients(data || []))
      .catch(err => {
        console.error("Failed to fetch clients for assignment:", err);
        setError("Could not load client list. " + err.message);
      })
      .finally(() => setLoadingClients(false));
  }, []);

  // When activePlan changes, reset messages
  useEffect(() => {
    setError('');
    setSuccessMessage('');
  }, [activePlan]);

  const handleSubmitAssignment = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!activePlan || !activePlan.id) { // activePlan.id refers to source_plan_template_id if it's from a template
      setError("No active plan selected or the plan is not saved as a template yet. Please save the plan as a template first if you wish to assign it by template ID.");
      // OR: Allow assigning unsaved plans if service supports it (current service expects items directly)
      // For this iteration, let's assume we are assigning a "snapshot" of the activePlan.
      // If activePlan.id is null, it means it's a new plan not yet saved as a template.
      // The service's source_plan_template_id can be null.
    }
    if (!selectedClientId) {
      setError("Please select a client.");
      return;
    }
    if (!startDate || !endDate) {
      setError("Please select a start and end date.");
      return;
    }
    if (new Date(startDate) >= new Date(endDate)) {
      setError("End date must be after start date.");
      return;
    }

    setSubmitting(true);

    // Prepare items for assignment.
    // The `activePlan.items` should already have `exercise_template_id`, `custom_params`, `notes`, etc.
    // We also need `exercise_name` for denormalization into `fitness_plan_items`.
    const itemsToAssign = activePlan.items.map(item => ({
      exercise_template_id: item.exercise_template_id,
      // Ensure exercise_name is present, falling back if necessary
      exercise_name: item.exercise_details?.name || 'Exercise Name Missing',
      day_of_week: item.day_of_week,
      exercise_order: item.exercise_order,
      custom_params: item.custom_params || item.exercise_details?.default_params || {},
      notes: item.notes,
    }));

    const assignmentData = {
      client_user_id: selectedClientId,
      source_plan_template_id: activePlan.id, // This is the ID of the fitness_plan_templates if loaded from one
      plan_name: activePlan.name || 'Assigned Fitness Plan', // Use active plan's name
      plan_description: activePlan.description || '', // Use active plan's description
      start_date: startDate,
      end_date: endDate,
      items: itemsToAssign,
    };

    try {
      await assignedFitnessPlanService.assignPlanToClient(assignmentData);
      setSuccessMessage(`Plan "${activePlan.name || 'Unnamed Plan'}" successfully assigned to client!`);
      // Clear form fields after successful assignment
      setSelectedClientId('');
      setStartDate('');
      setEndDate('');
      if (onPlanAssigned) onPlanAssigned(); // Notify parent if needed
    } catch (err) {
      setError(err.message || "Failed to assign plan.");
      console.error("Assign plan error:", err);
      if (onAssignmentError) onAssignmentError(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!activePlan) {
      return (
          <div className="assign-plan-view-container">
              <p className="info-message">Select or build a plan in the left panel to assign.</p>
          </div>
      );
  }

  return (
    <div className="assign-plan-view-container">
      <h4>Assign Plan: "{activePlan.name || 'Unsaved Plan'}"</h4>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <form onSubmit={handleSubmitAssignment} className="assign-plan-form">
        <div className="form-group">
          <label htmlFor="client-select">Assign to Client:</label>
          {loadingClients ? <p>Loading clients...</p> : (
            <select
              id="client-select"
              value={selectedClientId}
              onChange={e => setSelectedClientId(e.target.value)}
              required
              disabled={clients.length === 0}
            >
              <option value="">{clients.length === 0 ? "No clients available" : "Select a client"}</option>
              {clients.map(client => (
                // client.id is client_user_id from get_trainer_clients RPC
                <option key={client.id} value={client.id}>
                  {client.full_name || client.email}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="start-date">Start Date:</label>
          <input
            type="date"
            id="start-date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="end-date">End Date:</label>
          <input
            type="date"
            id="end-date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={submitting || loadingClients || !activePlan } className="btn btn-primary">
          {submitting ? 'Assigning...' : 'Assign Plan to Client'}
        </button>
      </form>
    </div>
  );
};

export default AssignPlanView;
