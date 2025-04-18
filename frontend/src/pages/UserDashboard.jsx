import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaHistory, FaTasks, FaCheckCircle, FaClock, FaStar } from 'react-icons/fa';
import axios from 'axios';

const UserDashboard = () => {
  const userId = useSelector(state => state.auth.user?._id); // Adjust if different path

  const [volunteeringHistory, setVolunteeringHistory] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);

  const [userRating, setUserRating] = useState({
    average: 4.5,
    totalRatings: 12,
    recentRatings: [
      {
        id: 1,
        ngoName: "Community Care NGO",
        rating: 5,
        date: "2024-04-10",
        comment: "Excellent work and dedication"
      },
      {
        id: 2,
        ngoName: "Food Bank Foundation",
        rating: 4,
        date: "2024-03-25",
        comment: "Very reliable and punctual"
      }
    ]
  });

  useEffect(() => {
    if (!userId) return;

    const fetchIssueRequests = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/v1/issues/requested/${userId}`);
        const issueDetails = res.data;
        const completed = issueDetails.filter(issue => issue.status === 'Completed');
        const pending = issueDetails.filter(issue => issue.status !== 'Completed');

        setVolunteeringHistory(completed);
        setPendingTasks(pending);

      } catch (error) {
        console.error("Error fetching issue requests or issues:", error);
      }
    };

    fetchIssueRequests();
  }, [userId]);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={`w-5 h-5 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>

      {/* Rating Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <FaStar className="text-yellow-400 mr-2" />
            <h2 className="text-xl font-semibold">My Rating</h2>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-yellow-400">{userRating.average}</div>
            <div className="text-sm text-gray-600">out of 5</div>
          </div>
        </div>
        <div className="flex items-center mb-4">
          {renderStars(Math.round(userRating.average))}
          <span className="ml-2 text-gray-600">({userRating.totalRatings} ratings)</span>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Recent Ratings</h3>
          <div className="space-y-4">
            {userRating.recentRatings.map((rating) => (
              <div key={rating.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{rating.ngoName}</h4>
                    <p className="text-sm text-gray-600">{rating.comment}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center">
                      {renderStars(rating.rating)}
                    </div>
                    <p className="text-sm text-gray-500">{rating.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Volunteering History Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center mb-4">
          <FaHistory className="text-blue-500 mr-2" />
          <h2 className="text-xl font-semibold">Volunteering History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timeline</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {volunteeringHistory.map((item, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4">{item.title}</td>
                  <td className="px-6 py-4">{new Date(item.deadline).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                ${item.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {item.status}
              </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending Tasks Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
  <div className="flex items-center mb-4">
    <FaClock className="text-red-500 mr-2" />
    <h2 className="text-xl font-semibold">Pending Tasks</h2>
  </div>
  <div className="space-y-4">
    {pendingTasks.map((task, idx) => (
      <div key={idx} className="border rounded-lg p-4">
        <h3 className="font-semibold">{task.title}</h3>
        <p className="text-sm text-gray-600">Due: {new Date(task.deadline).toLocaleDateString()}</p>

        {/* Status */}
        <p className="mt-2 text-sm text-gray-500">
          <strong>Status:</strong> 
          <span className={`font-semibold ${task.status === 'Open' ? 'text-blue-500' : 'text-yellow-500'}`}>
            {task.status}
          </span>
        </p>
      </div>
    ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
