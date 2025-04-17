import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { logout } from '../redux/slices/authSlice';

export default function Home() {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) return;

        const fetchIssues = async () => {
            try {
                const res = await fetch('http://localhost:3000/api/v1/issues/getAll', { credentials: 'include' });
                if (!res.ok) throw new Error('Failed to fetch issues');
                const data = await res.json();
                console.log('====================================');
                console.log(data);
                console.log('====================================');
                setIssues(data.data || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchIssues();
    }, [isAuthenticated]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const vote = async (issueId, type) => {
        try {
            const res = await fetch(`/api/v1/issues/${issueId}/${type}`, {
                method: 'POST',
                credentials: 'include',
            });
            if (!res.ok) throw new Error('Vote failed');
            const { issue: updatedIssue } = await res.json();
            setIssues((prev) => prev.map((i) => (i._id === issueId ? updatedIssue : i)));
        } catch (err) {
            console.error(err);
            alert('Could not register vote');
        }
    };

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <nav className="bg-white shadow-md p-4 flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-800">Issue Tracker</h2>
                <div className="flex items-center space-x-4">
                    <Link
                        to="/create"
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Post Issue
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            {/* Main content */}
            <main className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading && <p>Loading issues...</p>}
                {error && <p className="text-red-600">{error}</p>}
                {!loading && !error && issues.length === 0 && (
                    <p className="text-gray-600">No issues found.</p>
                )}
                {!loading && !error && issues.map((issue) => (
                    <div key={issue._id} className="bg-white p-4 rounded-lg shadow-md flex flex-col">
                        {/* Title */}
                        <h3 className="text-xl font-bold mb-2 text-blue-800">{issue.title}</h3>
                        {/* Tags */}
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
                        {/* Description */}
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

                        {/* Location */}
                        <p className="text-sm text-gray-500 mb-4">
                            <strong>Location:</strong> {issue.issueLocation}
                        </p>
                        {/* Votes */}
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => vote(issue._id, 'upvote')}
                                className="flex items-center space-x-1 text-green-600 hover:text-green-800"
                            >
                                ▲ <span>{issue.upvoters.length}</span>
                            </button>
                            <button
                                onClick={() => vote(issue._id, 'downvote')}
                                className="flex items-center space-x-1 text-red-600 hover:text-red-800"
                            >
                                ▼ <span>{issue.downvoters ? issue.downvoters.length : 0}</span>
                            </button>
                        </div>
                        <Link
                            to={`/issues/${issue._id}`}
                            className="mt-4 inline-block text-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            View Details
                        </Link>
                    </div>
                ))}
            </main>
        </div>
    );
}
