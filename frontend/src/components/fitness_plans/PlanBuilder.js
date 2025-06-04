import React, { useState, useEffect, useCallback } from 'react';
import fitnessPlanTemplateService from '../../api/fitnessPlanTemplateService';
import './PlanBuilder.css'; // To be created

// Helper to create a structured plan from flat items (e.g., after loading a template)
const structurePlanItems = (items) => {
  const days = {};
  items.forEach(item => {
    const dayKey = item.day_of_week || 'Unassigned';
    if (!days[dayKey]) {
      days[dayKey] = [];
    }
    days[dayKey].push({
      ...item, // includes exercise_template_id, custom_params, notes, exercise_details
      // Ensure a unique ID for React keys within the builder, if item_id isn't always present or suitable
      temp_id: item.item_id || `temp-${Date.now()}-${Math.random()}`,
    });
    // Sort exercises within the day by exercise_order
    days[dayKey].sort((a, b) => (a.exercise_order || 0) - (b.exercise_order || 0));
  });
  return days;
};

// Helper to flatten structured plan back for saving
const flattenPlanItems = (structuredDays) => {
  const items = [];
  Object.keys(structuredDays).forEach(dayKey => {
    structuredDays[dayKey].forEach((exerciseItem, index) => {
      items.push({
        day_of_week: dayKey === 'Unassigned' ? null : dayKey,
        exercise_template_id: exerciseItem.exercise_template_id,
        exercise_order: index + 1, // Re-calculate order on save
        custom_params: typeof exerciseItem.custom_params === 'string'
                        ? JSON.parse(exerciseItem.custom_params || '{}')
                        : (exerciseItem.custom_params || {}),
        notes: exerciseItem.notes || '',
        // item_id is only relevant for existing items if we were doing granular updates,
        // but for now, we delete and re-insert items on update.
      });
    });
  });
  return items;
};


const PlanBuilder = ({ loadedPlan, onPlanSaved, onClearPlan, isEditingExistingTemplate, exerciseToAdd, onExerciseProcessed }) => {
  const [planName, setPlanName] = useState('');
  const [description, setDescription] = useState('');
  const [durationWeeks, setDurationWeeks] = useState(4);
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [structuredDays, setStructuredDays] = useState({}); // { "Day 1": [exerciseItem1, ...], "Day 2": [...] }

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [currentDayKey, setCurrentDayKey] = useState('Day 1'); // For adding new exercises

  useEffect(() => {
    if (loadedPlan) {
      setPlanName(loadedPlan.name || '');
      setDescription(loadedPlan.description || '');
      setDurationWeeks(loadedPlan.duration_weeks || 4);
      setDaysPerWeek(loadedPlan.days_per_week || 3);
      setStructuredDays(structurePlanItems(loadedPlan.items || []));
      // If it's an existing template, set an ID to indicate update, else null for create
    } else {
      // Reset for new plan
      setPlanName('');
      setDescription('');
      setDurationWeeks(4);
      setDaysPerWeek(3);
      setStructuredDays({});
    }
  }, [loadedPlan]);

  // This function will be called by TrainerFitnessPlanPage when an exercise is selected from library
  // For this to work, TrainerFitnessPlanPage needs a ref to PlanBuilder or another mechanism.
  // For now, this is a placeholder. The actual "addExercise" logic will be triggered by a prop.
  // Let's assume TrainerFitnessPlanPage updates loadedPlan.items, and useEffect handles it.
  // Or, more directly, parent passes a selectedExercise prop.
  // For this iteration, we'll assume parent updates `loadedPlan` which triggers useEffect.
  // A more interactive way: parent calls a method on PlanBuilder instance.

  const addExerciseToDay = (exerciseTemplate, dayKey) => {
    if (!dayKey) dayKey = currentDayKey || 'Day 1'; // Ensure a day is selected or default

    setStructuredDays(prevDays => {
      const newDays = { ...prevDays };
      if (!newDays[dayKey]) {
        newDays[dayKey] = [];
      }
      newDays[dayKey].push({
        exercise_template_id: exerciseTemplate.id,
        custom_params: exerciseTemplate.default_params || {},
        notes: '',
        exercise_details: exerciseTemplate, // Keep full details for display
        temp_id: `new-${Date.now()}-${Math.random()}`, // Temp ID for new items
        exercise_order: newDays[dayKey].length + 1,
      });
      return newDays;
    });
  };

  // Expose addExerciseToDay to parent, e.g. using useImperativeHandle with a ref
  // This is an advanced pattern. For now, parent will call this function via a prop.
  // This component will need a prop like `onExerciseSelectedFromLibrary`
  // which then calls `addExerciseToDay`.
  // Let's adjust `TrainerFitnessPlanPage` to pass `addExerciseToDay` as a prop later.


  const handleItemChange = (dayKey, itemTempId, field, value) => {
    setStructuredDays(prevDays => {
      const newDays = { ...prevDays };
      const itemIndex = newDays[dayKey].findIndex(item => item.temp_id === itemTempId);
      if (itemIndex > -1) {
        if (field === 'custom_params_json') { // Special handling for JSON textarea
          newDays[dayKey][itemIndex].custom_params_json_string = value; // Store raw string
          try {
            newDays[dayKey][itemIndex].custom_params = JSON.parse(value); // Attempt to parse
          } catch (e) { /* Ignore parse error, validation on save */ }
        } else {
          newDays[dayKey][itemIndex][field] = value;
        }
      }
      return newDays;
    });
  };

  const removeItemFromDay = (dayKey, itemTempId) => {
    setStructuredDays(prevDays => {
      const newDays = { ...prevDays };
      newDays[dayKey] = newDays[dayKey].filter(item => item.temp_id !== itemTempId);
      if (newDays[dayKey].length === 0) {
        delete newDays[dayKey]; // Remove day if empty
      }
      return newDays;
    });
  };

  // Simplified day management: add new day input
  const [newDayName, setNewDayName] = useState('');
  const handleAddDay = () => {
    if (newDayName && !structuredDays[newDayName]) {
      setStructuredDays(prev => ({...prev, [newDayName]: []}));
      setCurrentDayKey(newDayName); // Set current day to new day
      setNewDayName('');
    } else if (structuredDays[newDayName]) {
      alert("Day with this name already exists.");
    }
  };


  const handleSavePlan = async () => {
    setError('');
    if (!planName) {
      setError('Plan Name is required.');
      return;
    }

    const planItems = flattenPlanItems(structuredDays);
    // Validate custom_params JSON for all items
    for (const item of planItems) {
        if (typeof item.custom_params === 'string') { // Should have been parsed by flattenPlanItems
            try {
                item.custom_params = JSON.parse(item.custom_params);
            } catch (e) {
                setError(`Invalid JSON in custom parameters for an exercise in ${item.day_of_week || 'Unassigned'}. Please correct and save again.`);
                return;
            }
        }
    }

    const planData = {
      name: planName,
      description,
      duration_weeks: parseInt(durationWeeks, 10) || 0,
      days_per_week: parseInt(daysPerWeek, 10) || 0,
      items: planItems,
    };

    setSubmitting(true);
    try {
      if (isEditingExistingTemplate && loadedPlan?.id) {
        await fitnessPlanTemplateService.updatePlanTemplate(loadedPlan.id, planData);
      } else {
        await fitnessPlanTemplateService.createPlanTemplate(planData);
      }
      onPlanSaved(); // Notify parent (TrainerFitnessPlanPage) to refresh list or clear form
      // Optionally clear form here or let parent handle it via onClearPlan prop
      if (onClearPlan && !isEditingExistingTemplate) onClearPlan(); // Clear form if creating new
    } catch (err) {
      setError(err.message || 'Failed to save plan template.');
      console.error("Save plan error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // This effect will be used if TrainerFitnessPlanPage passes a selected exercise as a prop
  useEffect(() => {
    if (exerciseToAdd) {
      // Ensure a day is selected, or default to 'Day 1' if no days exist yet.
      let targetDay = currentDayKey;
      if (!targetDay && Object.keys(structuredDays).length === 0) {
        // If no day is selected and no days exist, create 'Day 1' and add to it.
        setStructuredDays(prev => ({ ...prev, "Day 1": [] })); // Create Day 1 if it doesn't exist
        setCurrentDayKey("Day 1"); // Set as current day
        targetDay = "Day 1";
      } else if (!targetDay && Object.keys(structuredDays).length > 0) {
        // If no day selected but days exist, pick the first one or prompt user.
        // For now, let's pick the first available day or require selection.
        targetDay = Object.keys(structuredDays)[0] || "Day 1"; // Fallback, ideally prompt or ensure currentDayKey is set
        if(!structuredDays[targetDay]) { // If the first day doesn't exist (e.g. currentDayKey was stale)
            setStructuredDays(prev => ({ ...prev, [targetDay]: [] }));
            setCurrentDayKey(targetDay);
        }
      }

      if (targetDay) { // Ensure a targetDay is determined
        addExerciseToDay(exerciseToAdd, targetDay);
        onExerciseProcessed(); // Notify parent that exercise has been processed
      } else {
        alert("Please select or add a day in the plan before adding exercises.");
        onExerciseProcessed(); // Still call to clear the trigger
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exerciseToAdd]); // Dependency: only exerciseToAdd. addExerciseToDay and onExerciseProcessed are stable.


  return (
    <div className="plan-builder-container">
      <h3>{isEditingExistingTemplate && loadedPlan?.id ? `Editing: ${planName}` : 'Build New Plan Template'}</h3>
      {error && <p className="error-message">{error}</p>}

      <div className="plan-metadata-form">
        <div className="form-group">
          <label htmlFor="planName">Plan Name:</label>
          <input type="text" id="planName" value={planName} onChange={e => setPlanName(e.target.value)} required />
        </div>
        {/* ... other metadata fields: description, durationWeeks, daysPerWeek ... */}
         <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <div className="form-group-inline">
            <label htmlFor="durationWeeks">Duration (Weeks):</label>
            <input type="number" id="durationWeeks" value={durationWeeks} onChange={e => setDurationWeeks(e.target.value)} min="1" />

            <label htmlFor="daysPerWeek">Days Per Week:</label>
            <input type="number" id="daysPerWeek" value={daysPerWeek} onChange={e => setDaysPerWeek(e.target.value)} min="1" />
        </div>
      </div>

      <div className="day-management">
        <input
            type="text"
            value={newDayName}
            onChange={e => setNewDayName(e.target.value)}
            placeholder="New Day Name (e.g., Day 1, Push)"
        />
        <button onClick={handleAddDay} className="btn btn-secondary btn-sm">Add Day</button>

        <select value={currentDayKey} onChange={e => setCurrentDayKey(e.target.value)} style={{marginLeft: '10px'}}>
            <option value="">Select Day to Add Exercises To</option>
            {Object.keys(structuredDays).length > 0 ? (
                Object.keys(structuredDays).map(day => <option key={day} value={day}>{day}</option>)
            ) : (
                <option value="Day 1" disabled>Add a day first</option>
            )}
        </select>
        <small style={{display: 'block', marginTop: '5px'}}>Select or add a day, then add exercises from the library.</small>
      </div>


      <div className="plan-days-container">
        {Object.keys(structuredDays).length === 0 && <p>No days defined yet. Add a day to start building the plan.</p>}
        {Object.entries(structuredDays).map(([dayKey, items]) => (
          <div key={dayKey} className="plan-day-column">
            <h4>{dayKey}</h4>
            {items.length === 0 && <p className="empty-day-message">Drop exercises here or add from library.</p>}
            <ul className="exercise-list-in-plan">
              {items.map((item) => (
                <li key={item.temp_id} className="exercise-item-in-plan">
                  <h5>{item.exercise_details?.name || 'Exercise Name Missing'}</h5>
                  <p><small>Type: {item.exercise_details?.type}</small></p>
                  <div className="form-group">
                    <label htmlFor={`custom_params-${item.temp_id}`}>Custom Params (JSON):</label>
                    <textarea
                      id={`custom_params-${item.temp_id}`}
                      value={item.custom_params_json_string !== undefined ? item.custom_params_json_string : JSON.stringify(item.custom_params || item.exercise_details?.default_params || {}, null, 2)}
                      onChange={e => handleItemChange(dayKey, item.temp_id, 'custom_params_json', e.target.value)}
                      rows="3"
                    />
                  </div>
                  <div className="form-group">
                     <label htmlFor={`notes-${item.temp_id}`}>Notes:</label>
                     <input
                        type="text"
                        id={`notes-${item.temp_id}`}
                        value={item.notes || ''}
                        onChange={e => handleItemChange(dayKey, item.temp_id, 'notes', e.target.value)}
                    />
                  </div>
                  <button onClick={() => removeItemFromDay(dayKey, item.temp_id)} className="btn btn-delete-xs">Remove</button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <button onClick={handleSavePlan} disabled={submitting} className="btn btn-primary btn-save-plan">
        {submitting ? 'Saving...' : (isEditingExistingTemplate && loadedPlan?.id ? 'Update Plan Template' : 'Save New Plan Template')}
      </button>
    </div>
  );
};

export default PlanBuilder;
