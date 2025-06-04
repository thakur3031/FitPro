import React, { useState, useCallback, useEffect } from 'react';
import './TrainerFitnessPlanPage.css';
import ExerciseLibrary from '../components/fitness_plans/ExerciseLibrary';
import PlanBuilder from '../components/fitness_plans/PlanBuilder';
import PlanTemplateList from '../components/fitness_plans/PlanTemplateList';
import AssignPlanView from '../components/fitness_plans/AssignPlanView'; // Import AssignPlanView
import fitnessPlanTemplateService from '../api/fitnessPlanTemplateService';

const TrainerFitnessPlanPage = () => {
  const initialPlanState = {
    id: null, name: '', description: '', duration_weeks: 4, days_per_week: 3, items: [],
  };
  const [activePlan, setActivePlan] = useState(initialPlanState);
  const [editingPlanTemplateId, setEditingPlanTemplateId] = useState(null);
  const [exerciseToAddToPlan, setExerciseToAddToPlan] = useState(null); // For passing to PlanBuilder
  const [planTemplateListRefreshKey, setPlanTemplateListRefreshKey] = useState(0); // To trigger PlanTemplateList refresh

  const handleAddExerciseToPlan = useCallback((exerciseTemplate) => {
    console.log("TrainerFitnessPlanPage: Adding exercise to PlanBuilder:", exerciseTemplate.name);
    setExerciseToAddToPlan(exerciseTemplate); // PlanBuilder will react to this prop change
  }, []);

  const loadPlanTemplateForEditing = useCallback(async (templateId) => {
    if (!templateId) { //This case might be used if onSelectTemplate(null) is called from PlanTemplateList
      setActivePlan(initialPlanState);
      setEditingPlanTemplateId(null);
      return;
    }
    try {
      // Fetch full details using the service method that calls the RPC
      const planDetails = await fitnessPlanTemplateService.getPlanTemplateDetails(templateId);
      if (planDetails && planDetails.plan) {
        setActivePlan({
          id: planDetails.plan.id,
          name: planDetails.plan.name || '',
          description: planDetails.plan.description || '',
          duration_weeks: planDetails.plan.duration_weeks || 4,
          days_per_week: planDetails.plan.days_per_week || 3,
          items: planDetails.items ? planDetails.items.map(item => ({
              item_id: item.item_id,
              exercise_template_id: item.exercise.id,
              day_of_week: item.day_of_week,
              exercise_order: item.exercise_order,
              custom_params: item.custom_params || item.exercise.default_params || {},
              notes: item.notes || '',
              exercise_details: item.exercise,
          })) : [],
        });
        setEditingPlanTemplateId(planDetails.plan.id);
      } else {
        throw new Error("Plan details not found or RPC returned unexpected structure.");
      }
    } catch (error) {
      console.error("Error loading plan template for editing:", error);
      alert(`Error loading plan: ${error.message}`); // User feedback
      setActivePlan(initialPlanState); // Reset on error
      setEditingPlanTemplateId(null);
    }
  }, []);

  const handleCreateNewPlan = () => {
    setActivePlan(initialPlanState);
    setEditingPlanTemplateId(null);
  };

  const handlePlanSaved = () => {
    // After saving (create or update), refresh the list of templates
    setPlanTemplateListRefreshKey(prevKey => prevKey + 1);
    // Optionally, if it was a new plan, load it for editing, or clear the form
    // For now, we just refresh the list. User can then select it.
    // If creating new, we might want to clear activePlan or load the newly created one.
    // For simplicity, we can just reset to a new blank plan state.
    handleCreateNewPlan();
    alert("Plan template saved successfully!");
  };

  // Callback for PlanBuilder to signal that exercise has been processed
  const handleExerciseAddedToPlan = useCallback(() => {
    setExerciseToAddToPlan(null); // Reset the trigger
  }, []);

  const handlePlanAssigned = () => {
    // Maybe show a global success message or refresh some part of the UI
    alert("Plan assigned successfully!");
    // Potentially clear selected client in AssignPlanView or other actions
  };

  const handleAssignmentError = (error) => {
    // Show a global error message or handle as needed
    alert(`Failed to assign plan: ${error.message}`);
  };


  return (
    <div className="fitness-plan-page-container">
      <header className="fitness-plan-header">
        <h1>Fitness Plan Builder</h1>
        <button onClick={handleCreateNewPlan} className="btn btn-new-plan">New Blank Plan</button>
      </header>
      <div className="fitness-plan-main-content">
        <aside className="left-panel">
          <div className="panel-section">
             <h2 className="panel-section-title">Saved Plan Templates</h2>
             <PlanTemplateList
                onSelectTemplate={loadPlanTemplateForEditing}
                currentlyEditingId={editingPlanTemplateId}
                refreshKey={planTemplateListRefreshKey} // Pass key to trigger refresh
             />
          </div>
          <hr style={{margin: '20px 0'}}/>
          <ExerciseLibrary onAddExerciseToPlan={handleAddExerciseToPlan} />
        </aside>
        <section className="right-panel">
           <h2 className="panel-section-title">Plan Construction Area</h2>
          <PlanBuilder
              loadedPlan={activePlan} // Pass the whole plan object
              onPlanSaved={handlePlanSaved} // Callback when plan is saved
              onClearPlan={handleCreateNewPlan} // Callback to clear the builder (e.g. after new save)
              isEditingExistingTemplate={!!editingPlanTemplateId}
              exerciseToAdd={exerciseToAddToPlan}
              onExerciseProcessed={handleExerciseAddedToPlan}
          />
          <hr style={{margin: '30px 0'}} /> {/* Separator */}
          <div className="assign-plan-section">
            <h2 className="panel-section-title">Assign Current Plan to Client</h2>
            {activePlan && (activePlan.id || activePlan.items.length > 0) ? ( // Only show if a plan is loaded/built
              <AssignPlanView
                activePlan={activePlan}
                onPlanAssigned={handlePlanAssigned}
                onAssignmentError={handleAssignmentError}
              />
            ) : (
              <p>Build or load a plan above to assign it to a client.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default TrainerFitnessPlanPage;
