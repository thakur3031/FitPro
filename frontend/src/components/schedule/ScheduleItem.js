import React from 'react';
import './ScheduleItem.css'; // We'll create this CSS file

const ScheduleItem = ({ item }) => {
  const formatTime = (timeStr) => {
    if (!timeStr) return 'All Day';
    try {
      return new Date(timeStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch (e) {
      console.error("Error formatting time:", e, timeStr);
      return 'Invalid Time';
    }
  };

  const renderItemDetails = () => {
    switch (item.item_type) {
      case 'appointment':
        return (
          <>
            <p className="item-time">
              {formatTime(item.start_time)} - {formatTime(item.end_time)}
            </p>
            <p className="item-description">{item.description || 'No description.'}</p>
            {item.status && <p className="item-meta">Status: <span className={`status status-${item.status.toLowerCase()}`}>{item.status}</span></p>}
          </>
        );
      case 'nutrition':
        return (
          <>
            <p className="item-time">{item.meal_type || 'Anytime'}</p>
            <p className="item-description">{item.description || 'Part of your nutrition plan.'}</p>
            {item.plan_name && <p className="item-meta">Plan: {item.plan_name}</p>}
            {item.day_of_week && <p className="item-meta">Day: {item.day_of_week}</p>}
          </>
        );
      case 'fitness':
        return (
          <>
            <p className="item-time">{item.day_of_week ? `Scheduled for: ${item.day_of_week}` : 'Anytime'}</p>
            <p className="item-description">{item.description || 'Part of your fitness plan.'}</p>
            {item.exercise_name && item.exercise_name !== item.title && <p className="item-meta">Exercise: {item.exercise_name}</p>}
            {item.sets && item.reps && <p className="item-meta">Sets/Reps: {item.sets} x {item.reps}</p>}
            {item.plan_name && <p className="item-meta">Plan: {item.plan_name}</p>}
          </>
        );
      default:
        return <p className="item-description">{item.description || 'No details.'}</p>;
    }
  };

  return (
    <li className={`schedule-item item-type-${item.item_type}`}>
      <div className="item-header">
        <span className={`item-type-badge item-type-${item.item_type}`}>{item.item_type}</span>
        <h3 className="item-title">{item.title || 'Scheduled Item'}</h3>
      </div>
      <div className="item-body">
        {renderItemDetails()}
      </div>
    </li>
  );
};

export default ScheduleItem;
