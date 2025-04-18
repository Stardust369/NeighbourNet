import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/slices/authSlice';
import { Menu } from 'lucide-react';
import {
  FaTasks,
  FaUsers,
  FaHandHoldingHeart,
  FaChartLine,
  FaCheckCircle,
  FaClock,
  FaFilter,
  FaImage,
  FaArrowRight,
  FaTrophy,
  FaSearch,
  FaSort,
  FaStar
} from 'react-icons/fa';

const NGODashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Dashboard state
  const [assignedIssues, setAssignedIssues] = useState([]);
  const [activeJobs, setActiveJobs] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [taskProofs, setTaskProofs] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [statistics, setStatistics] = useState({
    totalIssuesResolved: 0,
    activeVolunteers: 0,
    totalDonations: 0,
    completionRate: 0
  });
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [volunteerSearch, setVolunteerSearch] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [isLoading, setIsLoading] = useState(true);

  // Sidebar sections
  const sections = ['Requests', 'Query Section', 'Claimed Issues'];
  const handleSectionClick = (section) => {
    const slug = section.toLowerCase().replace(/\s+/g, '-');
    navigate(/ngo-dashboard/${slug});
  };
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Simulate API calls / mock data
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setAssignedIssues([
        {
          id: 1,
          title: 'Community Garden Restoration',
          location: 'Central Park',
          status: 'in-progress',
          startDate: '2024-04-01',
          deadline: '2024-04-30',
          progress: 60,
          media: ['before1.jpg', 'after1.jpg'],
          description: 'Restoring the community garden to its former glory'
        },
        {
          id: 2,
          title: 'Food Distribution Drive',
          location: 'Downtown Area',
          status: 'pending',
          startDate: '2024-05-01',
          deadline: '2024-05-15',
          progress: 0,
          media: [],
          description: 'Weekly food distribution to needy families'
        }
      ]);

      setActiveJobs([
        {
          id: 1,
          title: 'Garden Maintenance Team',
          slots: { total: 10, filled: 7 },
          whatsappLink: 'https://wa.me/group/abc123',
          tasks: [
            {
              id: 1,
              title: 'Planting Seeds',
              assignedTo: 'John Doe',
              status: 'completed',
              proofRequired: true,
              proofStatus: 'pending'
            },
            {
              id: 2,
              title: 'Watering Schedule',
              assignedTo: 'Jane Smith',
              status: 'in-progress',
              proofRequired: true,
              proofStatus: 'not_submitted'
            }
          ]
        }
      ]);

      setVolunteers([
        {
          id: 1,
          name: 'John Doe',
          role: 'Team Lead',
          tasksCompleted: 15,
          rating: 4.8,
          availability: 'Weekends',
          skills: ['Gardening', 'Leadership']
        },
        {
          id: 2,
          name: 'Jane Smith',
          role: 'Volunteer',
          tasksCompleted: 8,
          rating: 4.5,
          availability: 'Weekdays',
          skills: ['Teaching', 'Event Management']
        }
      ]);

      setTaskProofs([
        {
          id: 1,
          taskId: 1,
          volunteerId: 1,
          proofType: 'image',
          proofUrl: 'proof1.jpg',
          status: 'pending',
          submittedAt: '2024-04-15T10:30:00',
          comment: 'Completed planting seeds in section A'
        }
      ]);

      setAchievements([
        {
          id: 1,
          title: 'Best Community Initiative 2024',
          date: '2024-03-15',
          description: 'Recognized for outstanding contribution to community development',
          media: ['award1.jpg', 'ceremony1.jpg']
        }
      ]);

      setStatistics({
        totalIssuesResolved: 25,
        activeVolunteers: 15,
        totalDonations: 5000,
        completionRate: 85
      });

      setIsLoading(false);
    }, 1000);
  }, []);

  const handleProofReview = (proofId, status) => {
    console.log(Reviewing proof ${proofId}: ${status});
    // Add your review logic here...
  };

  const handleLocationFilter = (loc) => {
    setSelectedLocation(loc);
    // Add your filtering logic here...
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredVolunteers = volunteers
    .filter((v) =>
      v.name.toLowerCase().includes(volunteerSearch.toLowerCase()) ||
      v.role.toLowerCase().includes(volunteerSearch.toLowerCase()) ||
      v.skills.some((s) =>
        s.toLowerCase().includes(volunteerSearch.toLowerCase())
      )
    )
    .sort((a, b) => {
      if (sortConfig.key === 'rating') {
        return sortConfig.direction === 'asc'
          ? a.rating - b.rating
          : b.rating - a.rating;
      }
      return sortConfig.direction === 'asc'
        ? String(a[sortConfig.key]).localeCompare(b[sortConfig.key])
        : String(b[sortConfig.key]).localeCompare(a[sortConfig.key]);
    });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center">
            <div>
              <p className="text-gray-500">Issues Resolved</p>
              <h3 className="text-2xl font-bold">
                {statistics.totalIssuesResolved}
              </h3>
            </div>
            <FaHandHoldingHeart className="text-blue-500 text-3xl" />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center">
            <div>
              <p className="text-gray-500">Active Volunteers</p>
              <h3 className="text-2xl font-bold">
                {statistics.activeVolunteers}
              </h3>
            </div>
            <FaUsers className="text-green-500 text-3xl" />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center">
            <div>
              <p className="text-gray-500">Total Donations</p>
              <h3 className="text-2xl font-bold">
                ₹{statistics.totalDonations}
              </h3>
            </div>
            <FaChartLine className="text-purple-500 text-3xl" />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center">
            <div>
              <p className="text-gray-500">Completion Rate</p>
              <h3 className="text-2xl font-bold">
                {statistics.completionRate}%
              </h3>
            </div>
            <FaCheckCircle className="text-yellow-500 text-3xl" />
          </div>
        </div>

        {/* Location Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center mb-4">
            <FaFilter className="text-gray-500 mr-2" />
            <h2 className="text-xl font-semibold">Filter by Location</h2>
          </div>
          <div className="flex space-x-4">
            {['all', 'Central Park', 'Downtown'].map((loc) => (
              <button
                key={loc}
                onClick={() => handleLocationFilter(loc)}
                className={`px-4 py-2 rounded-full ${
                  selectedLocation === loc
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200'
                }`}
              >
                {loc === 'all' ? 'All Locations' : loc}
              </button>
            ))}
          </div>
        </div>

        {/* Assigned Issues */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FaTasks className="text-blue-500 mr-2" />
              <h2 className="text-xl font-semibold">Assigned Issues</h2>
            </div>
          </div>
          <div className="flex justify-center items-center space-x-4 py-8">
            <div className="bg-gray-100 rounded-lg px-6 py-3 flex items-center space-x-2">
              <FaTasks className="text-blue-500" />
              <span className="text-lg font-semibold text-gray-700">
                {assignedIssues.length} Issues Assigned
              </span>
            </div>
            <button
              onClick={() => navigate('/assigned-issues')}
              className="group flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span className="text-lg font-semibold">
                View All Assigned Issues
              </span>
              <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Active Jobs */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center mb-4">
            <FaClock className="text-blue-500 mr-2" />
            <h2 className="text-xl font-semibold">Active Jobs</h2>
          </div>
          <div className="space-y-4">
            {activeJobs.map((job) => (
              <div key={job.id} className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg">{job.title}</h3>
                <p className="text-sm text-gray-600">
                  Slots: {job.slots.filled}/{job.slots.total}
                </p>
                <a
                  href={job.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline text-sm"
                >
                  Join on WhatsApp
                </a>
                <div className="mt-2 space-y-2">
                  {job.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-2 border rounded flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-gray-600">
                          Assigned to: {task.assignedTo}
                        </p>
                      </div>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                          task.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : task.status === 'in-progress'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Task Proofs */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center mb-4">
            <FaImage className="text-purple-500 mr-2" />
            <h2 className="text-xl font-semibold">Task Proofs</h2>
          </div>
          <div className="space-y-4">
            {taskProofs.map((proof) => (
              <div key={proof.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">Task #{proof.taskId}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {proof.comment}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Submitted:{' '}
                      {new Date(proof.submittedAt).toLocaleString()}
                    </p>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mt-2 ${
                        proof.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : proof.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {proof.status}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleProofReview(proof.id, 'approved')}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold hover:bg-green-200 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleProofReview(proof.id, 'rejected')}
                      className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold hover:bg-red-200 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center mb-4">
            <FaTrophy className="text-yellow-500 mr-2" />
            <h2 className="text-xl font-semibold">Achievements</h2>
          </div>
          <div className="space-y-4">
            {achievements.map((ach) => (
              <div key={ach.id} className="border rounded-lg p-4">
                <h3 className="font-semibold">{ach.title}</h3>
                <p className="text-sm text-gray-600">Date: {ach.date}</p>
                <p className="mt-1">{ach.description}</p>
                {ach.media.length > 0 && (
                  <div className="flex space-x-2 mt-2">
                    {ach.media.map((m, i) => (
                      <img
                        key={i}
                        src={m}
                        alt={Media ${i + 1}}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Volunteer Management */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FaUsers className="text-purple-500 mr-2" />
              <h2 className="text-xl font-semibold">Volunteer Management</h2>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search volunteers..."
                value={volunteerSearch}
                onChange={(e) => setVolunteerSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  {[
                    { key: 'name', label: 'Name' },
                    { key: 'role', label: 'Role' },
                    { key: 'tasksCompleted', label: 'Tasks Completed' },
                    { key: 'rating', label: 'Rating' }
                  ].map((col) => (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        {col.label}
                        <FaSort className="ml-1" />
                      </div>
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Availability
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Skills
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredVolunteers.map((vol) => (
                  <tr key={vol.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{vol.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{vol.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {vol.tasksCompleted}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, idx) => (
                          <FaStar
                            key={idx}
                            className={`w-4 h-4 ${
                              idx < Math.floor(vol.rating)
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-1 text-sm">{vol.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {vol.availability}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {vol.skills.map((s, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NGODashboard;