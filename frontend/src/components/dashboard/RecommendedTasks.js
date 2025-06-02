import React from 'react';
import './RecommendedTasks.css'; // CSS for styling

// Hardcoded example tasks
const exampleTasks = [
  {
    id: 1,
    title: "Follow up with John Doe",
    description: "Regarding his nutrition plan adherence. Check progress and address any concerns.",
    priority: 'High', // Optional
    dueDate: 'This week', // Optional
  },
  {
    id: 2,
    title: "Prepare new fitness plan for Jane Smith",
    description: "Consultation scheduled for next week. Start outlining a plan based on her goals.",
    priority: 'Medium',
    dueDate: 'Next week',
  },
  {
    id: 3,
    title: "Check in on Alex Lee's progress",
    description: "Towards their weight loss goal. Send a motivational message or schedule a quick call.",
    priority: 'High',
    dueDate: 'Today',
  },
  {
    id: 4,
    title: "Review weekly check-ins",
    description: "Review all submitted weekly check-ins from clients and provide feedback.",
    priority: 'Medium',
    dueDate: 'End of week',
  },
  {
    id: 5,
    title: "Update training certifications",
    description: "Your CPR certification is expiring next month. Schedule a renewal.",
    priority: 'Low',
    dueDate: 'Next month',
  }
];

const RecommendedTasks = () => {
  return (
    <div className="recommended-tasks-container">
      <h2 className="tasks-title">Recommended Tasks & Action Items</h2>
      {exampleTasks.length === 0 ? (
        <p>No recommended tasks at the moment.</p>
      ) : (
        <ul className="tasks-list">
          {exampleTasks.map(task => (
            <li key={task.id} className={`task-item priority-${task.priority?.toLowerCase()}`}>
              <div className="task-content">
                <h3 className="task-item-title">{task.title}</h3>
                <p className="task-item-description">{task.description}</p>
              </div>
              <div className="task-meta">
                {task.dueDate && <span className="task-due-date">Due: {task.dueDate}</span>}
                {task.priority && <span className={`task-priority-label priority-${task.priority?.toLowerCase()}`}>{task.priority}</span>}
                {/* Non-functional checkbox for UI demonstration */}
                <input type="checkbox" className="task-checkbox" aria-label={`Mark task ${task.id} as complete`} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecommendedTasks;
