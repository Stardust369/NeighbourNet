import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  FaTasks, 
  FaUsers, 
  FaHandHoldingHeart, 
  FaChartLine, 
  FaCheckCircle, 
  FaClock,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaWhatsapp,
  FaTrophy,
  FaImage,
  FaFilter,
  FaStar,
  FaArrowRight,
  FaSearch,
  FaSort,
  FaEye
} from 'react-icons/fa';

const NGODashboard = () => {
  const [assignedIssues, setAssignedIssues] = useState([]);
  const [activeJobs, setActiveJobs] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [taskProofs, setTaskProofs] = useState([]);
  const [statistics, setStatistics] = useState({
    totalIssuesResolved: 0,
    activeVolunteers: 0,
    totalDonations: 0,
    completionRate: 0
  });
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [achievements, setAchievements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [volunteerSearch, setVolunteerSearch] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'name',
    direction: 'asc'
  });

  // Mock data - Replace with actual API calls
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      // Simulated data for assigned issues
      setAssignedIssues([
        {
          id: 1,
          title: "Community Garden Restoration",
          location: "Central Park",
          status: "in-progress",
          startDate: "2024-04-01",
          deadline: "2024-04-30",
          progress: 60,
          media: ["before1.jpg", "after1.jpg"],
          description: "Restoring the community garden to its former glory"
        },
        {
          id: 2,
          title: "Food Distribution Drive",
          location: "Downtown Area",
          status: "pending",
          startDate: "2024-05-01",
          deadline: "2024-05-15",
          progress: 0,
          media: [],
          description: "Weekly food distribution to needy families"
        }
      ]);

      // Simulated data for active jobs
      setActiveJobs([
        {
          id: 1,
          title: "Garden Maintenance Team",
          slots: {
            total: 10,
            filled: 7
          },
          whatsappLink: "https://wa.me/group/abc123",
          tasks: [
            {
              id: 1,
              title: "Planting Seeds",
              assignedTo: "John Doe",
              status: "completed",
              proofRequired: true,
              proofStatus: "pending"
            },
            {
              id: 2,
              title: "Watering Schedule",
              assignedTo: "Jane Smith",
              status: "in-progress",
              proofRequired: true,
              proofStatus: "not_submitted"
            }
          ]
        }
      ]);

      // Simulated data for volunteers
      setVolunteers([
        {
          id: 1,
          name: "John Doe",
          role: "Team Lead",
          tasksCompleted: 15,
          rating: 4.8,
          availability: "Weekends",
          pastIssues: [1, 2, 3],
          skills: ["Gardening", "Leadership"]
        },
        {
          id: 2,
          name: "Jane Smith",
          role: "Volunteer",
          tasksCompleted: 8,
          rating: 4.5,
          availability: "Weekdays",
          pastIssues: [1],
          skills: ["Teaching", "Event Management"]
        }
      ]);

      // Simulated task proofs
      setTaskProofs([
        {
          id: 1,
          taskId: 1,
          volunteerId: 1,
          proofType: "image",
          proofUrl: "proof1.jpg",
          status: "pending",
          submittedAt: "2024-04-15T10:30:00",
          comment: "Completed planting seeds in section A"
        }
      ]);

      // Simulated achievements
      setAchievements([
        {
          id: 1,
          title: "Best Community Initiative 2024",
          date: "2024-03-15",
          description: "Recognized for outstanding contribution to community development",
          media: ["award1.jpg", "ceremony1.jpg"]
        }
      ]);

      // Simulated statistics
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
    // Implement proof review logic
    console.log(`Reviewing proof ${proofId} with status ${status}`);
  };

  const handleLocationFilter = (location) => {
    setSelectedLocation(location);
    // Implement location filtering logic
  };

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredVolunteers = volunteers
    .filter(volunteer => 
      volunteer.name.toLowerCase().includes(volunteerSearch.toLowerCase()) ||
      volunteer.role.toLowerCase().includes(volunteerSearch.toLowerCase()) ||
      volunteer.skills.some(skill => skill.toLowerCase().includes(volunteerSearch.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortConfig.key === 'rating') {
        return sortConfig.direction === 'asc' 
          ? a.rating - b.rating 
          : b.rating - a.rating;
      }
      return sortConfig.direction === 'asc'
        ? a[sortConfig.key].localeCompare(b[sortConfig.key])
        : b[sortConfig.key].localeCompare(a[sortConfig.key]);
    });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">NGO Dashboard</h1>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Issues Resolved</p>
              <h3 className="text-2xl font-bold">{statistics.totalIssuesResolved}</h3>
            </div>
            <FaHandHoldingHeart className="text-blue-500 text-3xl" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Active Volunteers</p>
              <h3 className="text-2xl font-bold">{statistics.activeVolunteers}</h3>
            </div>
            <FaUsers className="text-green-500 text-3xl" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Donations</p>
              <h3 className="text-2xl font-bold">₹{statistics.totalDonations}</h3>
            </div>
            <FaChartLine className="text-purple-500 text-3xl" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Completion Rate</p>
              <h3 className="text-2xl font-bold">{statistics.completionRate}%</h3>
            </div>
            <FaCheckCircle className="text-yellow-500 text-3xl" />
          </div>
        </div>
      </div>

      {/* Location Filter */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center mb-4">
          <FaFilter className="text-gray-500 mr-2" />
          <h2 className="text-xl font-semibold">Filter by Location</h2>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => handleLocationFilter('all')}
            className={`px-4 py-2 rounded-full ${
              selectedLocation === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            All Locations
          </button>
          <button
            onClick={() => handleLocationFilter('Central Park')}
            className={`px-4 py-2 rounded-full ${
              selectedLocation === 'Central Park' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Central Park
          </button>
          <button
            onClick={() => handleLocationFilter('Downtown')}
            className={`px-4 py-2 rounded-full ${
              selectedLocation === 'Downtown' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Downtown
          </button>
        </div>
      </div>

      {/* Assigned Issues Section */}
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
          <Link 
            to="/assigned-issues" 
            className="group flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <span className="text-lg font-semibold">View All Assigned Issues</span>
            <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>

      {/* Task Proofs Section */}
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
                  <p className="text-sm text-gray-600 mt-1">{proof.comment}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Submitted: {new Date(proof.submittedAt).toLocaleString()}
                  </p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mt-2 ${
                    proof.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    proof.status === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
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

      {/* Achievements Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center mb-4">
          <FaTrophy className="text-yellow-500 mr-2" />
          <h2 className="text-xl font-semibold">Achievements</h2>
        </div>
        <div className="space-y-4">
          {achievements.map((achievement) => (
            <div key={achievement.id} className="border rounded-lg p-4">
              <h3 className="font-semibold">{achievement.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
              <p className="text-sm text-gray-500 mt-1">Date: {achievement.date}</p>
              {achievement.media.length > 0 && (
                <div className="flex space-x-2 mt-2">
                  {achievement.media.map((media, index) => (
                    <div key={index} className="relative w-20 h-20">
                      <img
                        src={media}
                        alt={`Achievement media ${index + 1}`}
                        className="rounded-lg object-cover w-full h-full"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Volunteers Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
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
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Name
                    <FaSort className="ml-1" />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('role')}
                >
                  <div className="flex items-center">
                    Role
                    <FaSort className="ml-1" />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('tasksCompleted')}
                >
                  <div className="flex items-center">
                    Tasks Completed
                    <FaSort className="ml-1" />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('rating')}
                >
                  <div className="flex items-center">
                    Rating
                    <FaSort className="ml-1" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Availability</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Skills</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredVolunteers.map((volunteer) => (
                <tr key={volunteer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{volunteer.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{volunteer.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{volunteer.tasksCompleted}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, index) => (
                        <FaStar
                          key={index}
                          className={`w-4 h-4 ${
                            index < Math.floor(volunteer.rating) ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-1 text-sm">{volunteer.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{volunteer.availability}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {volunteer.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                        >
                          {skill}
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
    </div>
  );
};

export default NGODashboard;
