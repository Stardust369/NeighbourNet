import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Opportunities = () => {
  const [openIssues, setOpenIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOpenIssues = async () => {
      try {
        const response = await axios.get('/issues/getOpen');
        setOpenIssues(response.data.issues || []);
      } catch (err) {
        setError('Failed to load issues.');
      } finally {
        setLoading(false);
      }
    };

    fetchOpenIssues();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-6">Volunteering Opportunities</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && openIssues.length === 0 && <p>No open issues found.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {openIssues.map((issue) => (
          <div
            key={issue._id}
            className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
          >
            <h3 className="text-lg font-bold mb-2">{issue.title}</h3>
            <p className="text-gray-600 mb-2">{issue.description}</p>
            <p className="text-sm text-blue-700 mb-1">
              Location: {issue.location || 'N/A'}
            </p>
            <p className="text-sm text-green-600">
              Status: {issue.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Opportunities;
