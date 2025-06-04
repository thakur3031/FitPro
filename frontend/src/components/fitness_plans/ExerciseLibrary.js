import React, { useEffect, useState, useCallback } from 'react';
import exerciseTemplateService from '../../api/exerciseTemplateService';
// Basic styling will be in ExerciseLibrary.css (created next)

// Simple Form component (can be extracted to its own file later if it grows)
const ExerciseTemplateForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Strength', // Default value
    muscle_group: '',
    equipment: '',
    default_params: '{}', // Expecting JSON string
    notes: '',
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        type: initialData.type || 'Strength',
        muscle_group: initialData.muscle_group || '',
        equipment: initialData.equipment || '',
        default_params: initialData.default_params ? JSON.stringify(initialData.default_params, null, 2) : '{}',
        notes: initialData.notes || '',
      });
    } else {
      // Reset for new form
      setFormData({
        name: '', type: 'Strength', muscle_group: '', equipment: '', default_params: '{}', notes: '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!formData.name || !formData.type) {
      setFormError('Name and Type are required.');
      return;
    }
    try {
      // The service will handle parsing default_params if it's a string
      await onSubmit(formData);
    } catch (err) {
      setFormError(err.message || 'Submission failed.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="exercise-template-form">
      {formError && <p className="error-message">{formError}</p>}
      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="type">Type:</label>
        <select name="type" id="type" value={formData.type} onChange={handleChange}>
          <option value="Strength">Strength</option>
          <option value="Cardio">Cardio</option>
          <option value="Flexibility">Flexibility</option>
          <option value="Balance">Balance</option>
          <option value="Plyometrics">Plyometrics</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="muscle_group">Muscle Group:</label>
        <input type="text" name="muscle_group" id="muscle_group" value={formData.muscle_group} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="equipment">Equipment:</label>
        <input type="text" name="equipment" id="equipment" value={formData.equipment} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="default_params">Default Parameters (JSON):</label>
        <textarea name="default_params" id="default_params" value={formData.default_params} onChange={handleChange} rows="3"></textarea>
        <small>Example: {JSON.stringify({ reps: "10-12", sets: 3, rest_seconds: 60 })}</small>
      </div>
      <div className="form-group">
        <label htmlFor="notes">Notes:</label>
        <textarea name="notes" id="notes" value={formData.notes} onChange={handleChange} rows="2"></textarea>
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">Save Template</button>
        <button type="button" onClick={onCancel} className="btn btn-secondary">Cancel</button>
      </div>
    </form>
  );
};


const ExerciseLibrary = ({ onAddExerciseToPlan }) => { // Accept onAddExerciseToPlan prop
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null); // null or template object

  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await exerciseTemplateService.getExerciseTemplates();
      setTemplates(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch exercise templates.');
      console.error("Fetch templates error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleFormSubmit = async (templateData) => {
    try {
      setError('');
      let parsedParams;
      try {
        parsedParams = templateData.default_params.trim() ? JSON.parse(templateData.default_params) : null;
      } catch (e) {
        throw new Error("Default Parameters is not valid JSON.");
      }

      const dataToSubmit = { ...templateData, default_params: parsedParams };

      if (editingTemplate) {
        await exerciseTemplateService.updateExerciseTemplate(editingTemplate.id, dataToSubmit);
      } else {
        await exerciseTemplateService.createExerciseTemplate(dataToSubmit);
      }
      setShowForm(false);
      setEditingTemplate(null);
      fetchTemplates(); // Refresh
    } catch (err) {
      setError(err.message || `Failed to ${editingTemplate ? 'update' : 'create'} template.`);
      console.error("Template submission error:", err);
      // Keep form open by not setting setShowForm(false) on error
      throw err; // Re-throw to be caught by form's handleSubmit if needed
    }
  };

  const handleEdit = (template) => {
    setEditingTemplate(template);
    setShowForm(true);
    setError('');
  };

  const handleDelete = async (templateId) => {
    if (window.confirm('Are you sure you want to delete this exercise template?')) {
      try {
        setError('');
        await exerciseTemplateService.deleteExerciseTemplate(templateId);
        fetchTemplates(); // Refresh
      } catch (err) {
        setError(err.message || 'Failed to delete template.');
        console.error("Delete template error:", err);
      }
    }
  };

  const openAddForm = () => {
    setEditingTemplate(null);
    setShowForm(true);
    setError('');
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingTemplate(null);
    setError('');
  };

  if (loading) return <p>Loading exercise library...</p>;
  // Error display is handled below the button and within the form

  return (
    <div className="exercise-library-container">
      <div className="library-header">
        <h3>Exercise Templates</h3>
        <button onClick={openAddForm} className="btn btn-add-template">Add New Template</button>
      </div>

      {error && <p className="error-message page-error">{error}</p>}

      {showForm && (
        <div className="form-modal-backdrop-el"> {/* Basic modal simulation */}
          <div className="form-modal-content-el">
            <ExerciseTemplateForm
              initialData={editingTemplate}
              onSubmit={handleFormSubmit}
              onCancel={closeForm}
            />
          </div>
        </div>
      )}

      {!showForm && templates.length === 0 && !loading && (
        <p>No exercise templates found. Add some to get started!</p>
      )}

      {!showForm && templates.length > 0 && (
        <ul className="templates-list">
          {templates.map(template => (
            <li key={template.id} className="template-item">
              <div className="template-info">
                <strong>{template.name}</strong>
                <span>Type: {template.type}</span>
                <span>Muscle: {template.muscle_group || 'N/A'}</span>
                <span>Equipment: {template.equipment || 'N/A'}</span>
                {template.default_params && (
                  <details className="template-params-details">
                    <summary>Params</summary>
                    <pre>{JSON.stringify(template.default_params, null, 2)}</pre>
                  </details>
                )}
              </div>
              <div className="template-actions">
                <button onClick={() => onAddExerciseToPlan(template)} className="btn btn-add-to-plan-xs">Add to Plan</button>
                <button onClick={() => handleEdit(template)} className="btn btn-edit-xs">Edit</button>
                <button onClick={() => handleDelete(template.id)} className="btn btn-delete-xs">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExerciseLibrary;
