import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { logout } from '../redux/slices/authSlice';
export default function NGODash() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sections = ['Requests', 'Query Section'];

  useEffect(() => {
    if (!isAuthenticated) return;

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
  }, [isAuthenticated]);

  const handleSectionClick = (section) => {
    const slug = section.toLowerCase().replace(/\s+/g, '-');
    navigate(`/dashboard/${slug}`);
  };

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

  return (
    <div className="flex h-screen">
      {/* Sidebar Toggle */}
      <button
        className="fixed top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-700 transition"
        onClick={() => setSidebarOpen(!isSidebarOpen)}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-blue-600 text-white p-6 flex flex-col transform transition-transform duration-300 ease-in-out z-40 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <h2 className="text-2xl font-bold mb-8">NeighBour Net (NGO)</h2>
        <nav className="flex-1">
          <ul>
            {sections.map((sec) => (
              <li key={sec} className="mb-4">
                <button
                  onClick={() => handleSectionClick(sec)}
                  className="w-full text-left block px-4 py-2 rounded hover:bg-blue-500 transition"
                >
                  {sec}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <button
          onClick={handleLogout}
          className="mt-auto bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6 ml-0 md:ml-64 overflow-y-auto">
        <h1 className="text-3xl font-semibold mb-6">Welcome, NGO!</h1>

        {loading && <p>Loading issues...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && issues.length === 0 && (
          <p className="text-gray-600">No issues found.</p>
        )}
        {!loading &&
          !error &&
          issues.map((issue) => (
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
