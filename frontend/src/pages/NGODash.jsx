import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react'; 

export default function DashboardPage() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const sections = ['Requests', 'Issues', 'Query Section'];

  const handleSectionClick = (section) => {
    const slug = section.toLowerCase().replace(/\s+/g, '-');
    if (slug === 'issues') {
      navigate('/issues');
    } else {
      navigate(`/dashboard/${slug}`);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar Toggle Button */}
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
        <h2 className="text-2xl font-bold mb-8">NeighBour Net</h2>
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
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-12 ml-0 md:ml-64">
        <h1 className="text-3xl font-semibold mb-6">Help NGOs</h1>
        <p className="text-gray-700 leading-relaxed">
          Here you can find resources and support to help NGOs with various needs,
          such as coordination, resource allocation, and community engagement.
        </p>
      </main>
    </div>
  );
}
