import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/slices/authSlice';
import { Menu } from 'lucide-react';

export default function DashBoard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const sections = ['Created Issues', 'Settings', 'Support'];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleSectionClick = (section) => {
    const slug = section.toLowerCase().replace(/\s+/g, '-');
    navigate(`/dashboard/${slug}`);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar Toggle Button */}
      <button
        className="fixed top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded-full shadow hover:bg-blue-700 transition"
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
        <h2 className="text-2xl font-bold mb-8">Neighbour Net</h2>
        <nav className="flex-1">
          <ul>
            {sections.map((sec) => (
              <li key={sec} className="mb-4">
                <button
                  onClick={() => handleSectionClick(sec)}
                  className="w-full text-left px-4 py-2 rounded hover:bg-blue-500 transition"
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

      <main className="flex-1 bg-gray-100 p-6 ml-0 md:ml-64 overflow-y-auto">
  {/* Top Right Post Issue Button */}
  <div className="flex justify-end mb-6">
    <button
      onClick={() => navigate('/create')}
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
    >
      + Post Issue
    </button>
  </div>

  {/* Main content placeholder */}
  <h1 className="text-3xl font-semibold text-gray-700">Welcome, {user?.name || 'User'}!</h1>
</main>

    </div>
  );
}
