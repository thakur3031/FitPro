import React from 'react';
import './GoalProgressItem.css'; // We'll create this CSS file

const GoalProgressItem = ({ goal }) => {
  // Calculate progress percentage, ensuring target_value is not zero
  // Assuming 'current_value' and 'target_value' are fields in your 'client_goals' table
  // and that the RPC/service provides them.
  // If not, this part needs to be adapted or data needs to be fetched/calculated.
  const currentValue = parseFloat(goal.current_value || 0);
  const targetValue = parseFloat(goal.target_value || 0);
  let progressPercentage = 0;
  if (targetValue > 0) { // Avoid division by zero
    progressPercentage = Math.min(Math.max((currentValue / targetValue) * 100, 0), 100);
  } else if (currentValue > 0 && targetValue === 0) {
    // If target is 0 (e.g. "reduce X to 0") and current is still above 0, it's 0% progress to the target of 0.
    // Or if target is to maintain 0, and current is 0, then 100%. This logic can be complex.
    // For simplicity, if target is 0, and current is not 0, progress is 0. If both are 0, 100%.
    progressPercentage = (currentValue === 0 && targetValue === 0) ? 100 : 0;
  }


  const getStatusClass = (status) => {
    return status ? status.toLowerCase().replace(/\s+/g, '-') : 'pending';
  };

  return (
    <li className={`goal-item status-${getStatusClass(goal.status)}`}>
      <div className="goal-header">
        <h3 className="goal-description">{goal.goal_description || 'Goal Description Missing'}</h3>
        {goal.status && <span className={`goal-status-badge status-${getStatusClass(goal.status)}`}>{goal.status}</span>}
      </div>
      <div className="goal-details">
        {goal.target_value !== null && goal.unit && (
          <p className="goal-target">
            Target: {targetValue} {goal.unit}
          </p>
        )}
        {goal.current_value !== null && goal.unit && (
          <p className="goal-current">
            Current: {currentValue} {goal.unit}
          </p>
        )}
        {goal.target_date && (
          <p className="goal-target-date">
            Target Date: {new Date(goal.target_date).toLocaleDateString()}
          </p>
        )}
      </div>
      {/* Progress Bar - only if target_value is meaningful for progress */}
      {targetValue > 0 && (
         <div className="goal-progress-bar-container">
            <div
              className="goal-progress-bar"
              style={{ width: `${progressPercentage}%` }}
              role="progressbar"
              aria-valuenow={progressPercentage}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {progressPercentage.toFixed(0)}%
            </div>
          </div>
      )}
       {/* If target is 0, and current is 0, show "Achieved" or 100% */}
       {targetValue === 0 && currentValue === 0 && (
         <div className="goal-progress-bar-container">
            <div
              className="goal-progress-bar achieved"
              style={{ width: `100%` }}
              role="progressbar"
              aria-valuenow={100}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              Achieved
            </div>
          </div>
       )}
    </li>
  );
};

export default GoalProgressItem;
