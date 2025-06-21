import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserFeedbackForm from '../components/UserFeedbackForm';
import { toast } from 'react-toastify';

const IssueFeedbackPage = () => {
  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [expandedIssueId, setExpandedIssueId] = useState(null); // NEW: for toggling
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompletedIssues();
  }, []);

  const fetchCompletedIssues = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:3000/api/v1/issues/completed-issues', {
        withCredentials: true,
      });
      setIssues(res.data.issues || []);
    } catch (err) {
      console.error('Error fetching completed issues:', err);
      toast.error('Failed to fetch completed issues');
    } finally {
      setLoading(false);
    }
  };

  const fetchIssueFeedback = async (issueId) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/v1/issues/${issueId}/feedback`, {
        withCredentials: true,
      });
      setFeedback(res.data.feedback || []);
    } catch (err) {
      console.error('Error fetching feedback:', err);
      setFeedback([]);
    }
  };

  const handleToggleDetails = (issue) => {
    if (expandedIssueId === issue._id) {
      setExpandedIssueId(null); // Collapse
      setSelectedIssue(null);
      setFeedback([]);
    } else {
      setExpandedIssueId(issue._id); // Expand
      setSelectedIssue(issue);
      fetchIssueFeedback(issue._id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Issue Feedback</h1>

      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <h2 className="text-xl font-semibold mb-2">Completed Issues</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {issues.map((issue) => (
            <div key={issue._id} className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">{issue.title}</h3>
              <p className="text-sm text-gray-600 mb-2">Location: {issue.issueLocation}</p>
              <p className="text-sm text-gray-600 mb-2">Status: {issue.status}</p>

              <button
                onClick={() => handleToggleDetails(issue)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
              >
                {expandedIssueId === issue._id ? 'Hide Details' : 'View Details'}
              </button>

              <button
                onClick={() => {
                  setSelectedIssue(issue);
                  setShowFeedbackModal(true);
                }}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Give Feedback
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedIssue && expandedIssueId === selectedIssue._id && (
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <h2 className="text-xl font-semibold mb-2">Issue Details</h2>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="font-medium mb-2">Title: {selectedIssue.title}</p>
            <p className="text-gray-600 mb-2">Location: {selectedIssue.issueLocation}</p>
            <p className="text-gray-600 mb-2">Status: {selectedIssue.status}</p>
            <p className="text-gray-600 mb-2">Created by: {selectedIssue.postedBy?.name || 'Unknown'}</p>
            <p className="text-gray-600 mb-2">Created at: {new Date(selectedIssue.createdAt).toLocaleDateString()}</p>
          </div>

          {feedback.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Feedback</h3>
              <div className="space-y-4">
                {feedback.map((fb, index) => (
                  <div key={index} className="p-4 bg-gray-100 rounded-lg">
                    <p className="font-medium mb-2">User: {fb.user?.name || 'Anonymous'}</p>
                    <p className="text-gray-600 mb-2">Satisfaction: {fb.satisfaction}/10</p>
                    <p className="text-gray-600 mb-2">Resolved: {fb.resolved}</p>
                    <p className="text-gray-600 mb-2">Suggestions: {fb.suggestions || 'No suggestions provided'}</p>
                    <p className="text-gray-600 mb-2">Remaining Issues: {fb.issueProblem || 'None reported'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {showFeedbackModal && selectedIssue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <UserFeedbackForm
              issueId={selectedIssue._id}
              issueDetails={selectedIssue}
              onClose={() => {
                setShowFeedbackModal(false);
                setSelectedIssue(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueFeedbackPage;
