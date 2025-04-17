import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/v1/issues/getAll', {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch issues');
        const data = await res.json();
        setIssues(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">All Issues</h2>

      {loading && <p>Loading issues...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && issues.length === 0 && <p className="text-gray-600">No issues found.</p>}
      {!loading && !error && issues.length > 0 && (
        <div className="space-y-4">
          {issues.map((issue) => (
            <div
              key={issue._id}
              className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-col"
            >
              <h3 className="text-xl font-bold mb-2 text-blue-800">{issue.title}</h3>

              {issue.tags && issue.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {issue.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div
                className="text-gray-700 flex-1 mb-2"
                dangerouslySetInnerHTML={{
                  __html: issue.content
                    ? issue.content.length > 100
                      ? issue.content.substring(0, 100) + '...'
                      : issue.content
                    : 'No description',
                }}
              />

              <p className="text-sm text-gray-500 mb-4">
                <strong>Location:</strong> {issue.issueLocation}
              </p>

              <button
                onClick={() => navigate(`/issues/${issue._id}`)}
                className="mt-4 inline-block text-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
