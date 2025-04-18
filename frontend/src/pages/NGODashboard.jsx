import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Outlet } from 'react-router-dom';
import { logout } from '../redux/slices/authSlice';
import { Menu } from 'lucide-react';
import { FaTrophy /* you can remove unused icons */ } from 'react-icons/fa';
import NGODashh from './NGODashh';
const NGODashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const sections = ['Dashboard', 'Requests', 'Query Section', 'Claimed Issues'];
  const handleSectionClick = (section) => {
    const slug = section === 'Dashboard'
      ? '' 
      : section.toLowerCase().replace(/\s+/g, '-');
    navigate(`/ngo-dashboard/${slug}`);
  };
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
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

      {/* Main / children */}
      <main className="flex-1 bg-gray-100 p-6 ml-0 md:ml-64 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default NGODashboard;