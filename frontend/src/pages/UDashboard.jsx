import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { logout } from '../redux/slices/authSlice';
import { Menu, X, Home, ClipboardList, MessageSquare, Heart, PlusCircle, LogOut } from 'lucide-react';

export default function UDashBoard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useSelector((state) => state.auth);

  const sections = [
    { name: 'Created Issues', icon: <ClipboardList size={18} />, path: 'created-issues' },
    { name: 'Volunteering Oppurtunities', icon: <MessageSquare size={18} />, path: 'volunteering-oppurtunities' },
    { name: 'User Dashboard', icon: <Home size={18} />, path: 'user-dashboard' },
    { name: 'Donations', icon: <Heart size={18} />, path: 'donations' },
    { name: 'PostIssue', icon: <PlusCircle size={18} />, path: 'postissue' }
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  
  const handleSectionClick = (section) => {
    navigate(`/dashboard/${section.path}`);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar Toggle Button - Always visible */}
      <button
        className="fixed top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-700 transition"
        onClick={() => setSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-blue-700 to-blue-900 text-white p-6 flex flex-col transform transition-transform duration-300 ease-in-out z-40 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center mb-8 pl-10">
          <h2 className="text-2xl font-bold">NeighBour Net</h2>
        </div>

        <nav className="flex-1">
          <ul className="space-y-2">
            {sections.map((section) => {
              const isActive = location.pathname === `/dashboard/${section.path}`;
              
              return (
                <li key={section.name}>
                  <button
                    onClick={() => handleSectionClick(section)}
                    className={`w-full text-left flex items-center px-4 py-3 rounded-lg transition ${
                      isActive 
                        ? 'bg-blue-500 text-white shadow-md' 
                        : 'text-blue-100 hover:bg-blue-800 hover:bg-opacity-50'
                    }`}
                  >
                    <span className="mr-3">{section.icon}</span>
                    <span>{section.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="mt-auto pt-4 border-t border-blue-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition"
          >
            <LogOut size={18} className="mr-2" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content area for nested pages */}
      <main className={`flex-1 bg-gray-100 p-6 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="mt-12">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Welcome to Neighbour Net!</h1>
            <p className="text-gray-600 mt-2">Your one-stop platform to raise issues, volunteer for causes, and make a difference in your neighborhood.</p>
          </div>

          <Outlet />
        </div>
      </main>
    </div>
  );
}
