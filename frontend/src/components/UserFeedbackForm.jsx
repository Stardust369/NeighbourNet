import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const UserFeedbackForm = ({ issueId, onClose }) => {
  const [formData, setFormData] = useState({
    resolved: 'No',
    satisfaction: '',
    suggestions: '',
    issueProblem: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'satisfaction') {
      if (value === '' || /^[0-9]{0,2}$/.test(value)) {
        setFormData(prev => ({ ...prev, satisfaction: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { resolved, satisfaction, suggestions, issueProblem } = formData;
    const satisfactionNum = Number(satisfaction);

    if (!['Yes', 'No'].includes(resolved)) {
      toast.error('Please select if the issue was resolved (Yes/No)');
      return;
    }

    if (!satisfaction || satisfactionNum < 1 || satisfactionNum > 10) {
      toast.error('Satisfaction rating must be between 1 and 10');
      return;
    }

    if (!suggestions.trim()) {
      toast.error('Please provide suggestions for improvement');
      return;
    }

    if (!issueProblem.trim()) {
      toast.error('Please describe any remaining issues');
      return;
    }

    try {
      await axios.post(
        `http://localhost:3000/api/v1/issues/${issueId}/feedback`,
        {
          ...formData,
          satisfaction: satisfactionNum,
          issueId,
        },
        { withCredentials: true }
      );

      toast.success('Feedback submitted successfully!');
      onClose();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error(error.response?.data?.message || 'Failed to submit feedback');
    }
  };

  return (
    <div className="p-4">
      {/* Back Button */}
      <div className="mb-4">
        <button
          onClick={onClose}
          className="text-blue-600 hover:underline text-sm"
        >
          ← Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Was the issue resolved?
          </label>
          <select
            name="resolved"
            value={formData.resolved}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Satisfaction (1–10)
          </label>
          <input
            type="text"
            name="satisfaction"
            value={formData.satisfaction}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={2}
            placeholder="Enter a number from 1 to 10"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Suggestions for Improvement
          </label>
          <textarea
            name="suggestions"
            value={formData.suggestions}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Remaining Issues
          </label>
          <textarea
            name="issueProblem"
            value={formData.issueProblem}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="3"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Submit Feedback
        </button>
      </form>
    </div>
  );
};

export default UserFeedbackForm;
