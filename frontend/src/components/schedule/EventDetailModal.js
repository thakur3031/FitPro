import React, { useState, useEffect, useCallback } from 'react';
import clientActivityLogService from '../../api/clientActivityLogService';
import './EventDetailModal.css';

const EventDetailModal = ({ isOpen, onClose, eventInfo, onLogSaved }) => {
  const [activityStatus, setActivityStatus] = useState('pending'); // Default to 'pending'
  const [clientNotes, setClientNotes] = useState('');
  const [completionDetails, setCompletionDetails] = useState('{}'); // Store as JSON string
  const [existingLogId, setExistingLogId] = useState(null); // To store ID of existing log for updates

  const [loadingLog, setLoadingLog] = useState(false);
  const [savingLog, setSavingLog] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const resetFormState = useCallback(() => {
    setActivityStatus(eventInfo?.extendedProps?.status || 'pending'); // Default from event or pending
    setClientNotes('');
    setCompletionDetails('{}');
    setExistingLogId(null);
    setError('');
    setSuccessMessage('');
  }, [eventInfo]);

  useEffect(() => {
    if (isOpen && eventInfo && eventInfo.id) {
      resetFormState(); // Reset form when modal opens or eventInfo changes
      setLoadingLog(true);
      // eventInfo.id from FullCalendar is the unique original_item_id for this instance
      // eventInfo.start is a Date object, convert to YYYY-MM-DD for scheduled_date
      const scheduledDate = eventInfo.start ? new Date(eventInfo.start.getTime() - (eventInfo.start.getTimezoneOffset() * 60000)).toISOString().split('T')[0] : null;

      clientActivityLogService.getActivityLogEntry(eventInfo.id, scheduledDate, eventInfo.extendedProps?.item_type)
        .then(logEntry => {
          if (logEntry) {
            setActivityStatus(logEntry.status || 'pending');
            setClientNotes(logEntry.client_notes || '');
            setCompletionDetails(JSON.stringify(logEntry.completion_details || {}, null, 2));
            setExistingLogId(logEntry.id);
          }
        })
        .catch(err => {
          console.warn("No existing log entry found or error fetching:", err.message);
          // Not necessarily an error to show user, could just mean no log yet
        })
        .finally(() => setLoadingLog(false));
    }
  }, [isOpen, eventInfo, resetFormState]);

  if (!isOpen || !eventInfo) {
    return null;
  }

  const { title, start, end, allDay, extendedProps } = eventInfo;
  const { item_type, description, plan_name, meal_type, exercise_name, sets, reps } = extendedProps || {};
  const displayTitle = title || (item_type === 'fitness' && exercise_name) || 'Event Details';

  const formatDisplayDate = (date, isAllDayEvent) => {
    if (!date) return 'N/A';
    const options = {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      ...(!isAllDayEvent && date ? { hour: '2-digit', minute: '2-digit', hour12: true } : {})
    };
    return new Date(date).toLocaleString(undefined, options);
  };

  const handleSaveLog = async () => {
    setError('');
    setSuccessMessage('');
    setSavingLog(true);

    let parsedCompletionDetails;
    try {
      parsedCompletionDetails = JSON.parse(completionDetails);
    } catch (e) {
      setError("Completion Details is not valid JSON. Please correct it or use {}.");
      setSavingLog(false);
      return;
    }

    // `eventInfo.start` is a Date object from FullCalendar
    // We need YYYY-MM-DD string. Adjust for timezone to get the "local" date of the event.
    const scheduledDate = start ? new Date(start.getTime() - (start.getTimezoneOffset() * 60000)).toISOString().split('T')[0] : null;

    const logData = {
      id: existingLogId, // Pass existing log ID for upsert logic
      original_item_id: eventInfo.id, // Unique ID from FullCalendar event object
      source_item_table: null, // Service will derive this from item_type
      item_type: item_type,
      title: displayTitle, // Use the title shown in the modal
      scheduled_date: scheduledDate,
      // performed_date: new Date().toISOString(), // Service will default this if not set
      status: activityStatus,
      client_notes: clientNotes,
      completion_details: parsedCompletionDetails,
      // Copy these from the original event for context in the log
      start_time: start ? start.toISOString() : null,
      end_time: end ? end.toISOString() : null,
      all_day: !!allDay,
    };

    try {
      const savedLog = await clientActivityLogService.upsertActivityLogEntry(logData);
      setSuccessMessage("Log saved successfully!");
      setExistingLogId(savedLog.id); // Update existingLogId with the ID from the saved log
      if (onLogSaved) {
        onLogSaved(savedLog); // Notify parent to refresh calendar events if needed
      }
      // Optionally close modal after a short delay
      // setTimeout(onClose, 1500);
    } catch (err) {
      setError(err.message || "Failed to save log.");
      console.error("Save log error:", err);
    } finally {
      setSavingLog(false);
    }
  };


  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <header className="modal-header">
          <h2>{displayTitle}</h2>
          <button onClick={onClose} className="modal-close-button">&times;</button>
        </header>

        <section className="modal-body">
          <p><strong>Date:</strong> {formatDisplayDate(start, allDay)}</p>
          {!allDay && end && <p><strong>End Time:</strong> {formatDisplayDate(end, allDay)}</p>}
          <p><strong>Type:</strong> <span className={`event-type-label type-${item_type}`}>{item_type || 'General'}</span></p>

          {extendedProps.status && !existingLogId && <p><strong>Planned Status:</strong> {extendedProps.status}</p>}
          {plan_name && <p><strong>Plan:</strong> {plan_name}</p>}

          {/* Display item-specific details from extendedProps */}
          {item_type === 'appointment' && description && <p><strong>Details:</strong> {description}</p>}
          {item_type === 'nutrition' && meal_type && <p><strong>Meal Type:</strong> {meal_type}</p>}
          {item_type === 'nutrition' && description && <p><strong>Notes:</strong> {description}</p>}
          {item_type === 'fitness' && exercise_name && exercise_name !== title && <p><strong>Exercise:</strong> {exercise_name}</p>}
          {item_type === 'fitness' && sets && <p><strong>Sets:</strong> {sets}</p>}
          {item_type === 'fitness' && reps && <p><strong>Reps:</strong> {reps}</p>}
          {item_type === 'fitness' && description && <p><strong>Notes/Details:</strong> {description}</p>}
          {!description && item_type !== 'appointment' && item_type !== 'nutrition' && item_type !== 'fitness' && extendedProps.description && (
            <p><strong>Details:</strong> {extendedProps.description}</p>
          )}

          <hr className="divider" />

          <h4>Log Your Activity</h4>
          {loadingLog && <p>Loading existing log...</p>}
          {error && <p className="error-message">{error}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}

          <div className="form-group">
            <label htmlFor="activityStatus">Activity Status:</label>
            <select id="activityStatus" value={activityStatus} onChange={e => setActivityStatus(e.target.value)}>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="partially_completed">Partially Completed</option>
              <option value="skipped">Skipped</option>
              <option value="rescheduled">Rescheduled (Note new time)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="clientNotes">Your Notes:</label>
            <textarea id="clientNotes" value={clientNotes} onChange={e => setClientNotes(e.target.value)} rows="3" placeholder="How did it go? Any challenges?" />
          </div>

          <div className="form-group">
            <label htmlFor="completionDetails">Completion Details (JSON):</label>
            <textarea id="completionDetails" value={completionDetails} onChange={e => setCompletionDetails(e.target.value)} rows="3" placeholder='e.g., {"reps_done": "10,10,8", "weight_used_kg": 20}' />
            <small>Enter specific details as JSON, e.g., {JSON.stringify({ actual_duration_minutes: 30, feeling_score: 5 })}</small>
          </div>
        </section>

        <footer className="modal-footer">
          <button onClick={handleSaveLog} className="btn btn-primary" disabled={savingLog || loadingLog}>
            {savingLog ? 'Saving...' : (existingLogId ? 'Update Log' : 'Save Log')}
          </button>
          <button onClick={onClose} className="btn btn-outline">Close</button>
        </footer>
      </div>
    </div>
  );
};

export default EventDetailModal;
