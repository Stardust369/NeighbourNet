import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import IssueDetailsPage from './IssueDetail';
import axios from 'axios';
import NGOIssueDetailsPage from './NGOIssueDetails';
export default function IssueDetailsWrapper() {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/v1/issues/${id}`);
        setIssue(res.data.issue);  // Use res.data to access the response data
      } catch (err) {
        setError('Failed to fetch issue');
      } finally {
        setLoading(false);
      }
    };
  
    fetchIssue();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!issue) return <p>Issue not found</p>;

  return <NGOIssueDetailsPage issue={issue} />;
}
