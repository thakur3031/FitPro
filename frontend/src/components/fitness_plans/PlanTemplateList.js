import React, { useEffect, useState, useCallback } from 'react';
import fitnessPlanTemplateService from '../../api/fitnessPlanTemplateService';
import './PlanTemplateList.css'; // To be created

const PlanTemplateList = ({ onSelectTemplate, currentlyEditingId, refreshKey }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPlanTemplates = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fitnessPlanTemplateService.getPlanTemplates();
      setTemplates(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch plan templates.');
      console.error("Fetch plan templates error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlanTemplates();
  }, [fetchPlanTemplates, refreshKey]); // Refetch when refreshKey changes

  const handleSelectTemplate = async (templateId) => {
    try {
      setError(''); // Clear previous errors specific to list
      // Loading state for individual template fetch can be managed locally if needed
      const planDetails = await fitnessPlanTemplateService.getPlanTemplateDetails(templateId);
      onSelectTemplate(planDetails); // Pass full details to parent
    } catch (err) {
      setError(`Failed to load template details: ${err.message}`);
      console.error("Load template details error:", err);
    }
  };

  const handleDeleteTemplate = async (templateId, event) => {
    event.stopPropagation(); // Prevent selection when clicking delete button
    if (window.confirm('Are you sure you want to delete this plan template? This action cannot be undone.')) {
      try {
        setError('');
        await fitnessPlanTemplateService.deletePlanTemplate(templateId);
        fetchPlanTemplates(); // Refresh list after delete
        if (currentlyEditingId === templateId) {
          onSelectTemplate(null); // Clear active plan in parent if deleted template was being edited
        }
      } catch (err) {
        setError(`Failed to delete plan template: ${err.message}`);
        console.error("Delete template error:", err);
      }
    }
  };

  if (loading) return <p>Loading plan templates...</p>;
  // Error is displayed below

  return (
    <div className="plan-template-list-container">
      {error && <p className="error-message list-error">{error}</p>}
      {templates.length === 0 && !loading && (
        <p>No plan templates found. Create one in the Plan Construction area!</p>
      )}
      {templates.length > 0 && (
        <ul className="plan-templates-ul">
          {templates.map(template => (
            <li
              key={template.id}
              className={`template-list-item ${currentlyEditingId === template.id ? 'selected' : ''}`}
              onClick={() => handleSelectTemplate(template.id)}
            >
              <span className="template-name">{template.name}</span>
              <div className="template-list-actions">
                <button
                  onClick={(e) => handleDeleteTemplate(template.id, e)}
                  className="btn-delete-template-xs"
                  aria-label={`Delete ${template.name}`}
                >
                  Del
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PlanTemplateList;
