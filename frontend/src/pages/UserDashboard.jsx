import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaHistory, FaTasks, FaCheckCircle, FaClock, FaStar } from 'react-icons/fa';

const UserDashboard = () => {
  const [volunteeringHistory, setVolunteeringHistory] = useState([]);
  const [taskStatus, setTaskStatus] = useState({
    pending: [],
    completed: []
  });
  const [userRating, setUserRating] = useState({
    average: 0,
    totalRatings: 0,
    recentRatings: []
  });

  // Mock data - Replace with actual API calls
  useEffect(() => {
    // Simulated data
    setVolunteeringHistory([
      {
        id: 1,
        title: 'Community Garden Maintenance',
        date: '2024-03-15',
        hours: 4,
        status: 'completed'
      },
      {
        id: 2,
        title: 'Food Bank Distribution',
        date: '2024-02-20',
        hours: 6,
        status: 'completed'
      }
    ]);


    setTaskStatus({
      pending: [
        {
          id: 1,
          title: 'Weekly Grocery Delivery',
          dueDate: '2024-04-20',
          priority: 'high'
        }
      ],
      completed: [
        {
          id: 2,
          title: 'Medicine Pickup',
          completedDate: '2024-04-15',
          priority: 'medium'
        }
      ]
    });

    // Mock rating data
    setUserRating({
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
  }, []);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={`w-5 h-5 ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
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
        
        {/* Recent Ratings */}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hours</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {volunteeringHistory.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{item.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.hours}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Task Status Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pending Tasks */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <FaClock className="text-red-500 mr-2" />
            <h2 className="text-xl font-semibold">Pending Tasks</h2>
          </div>
          <div className="space-y-4">
            {taskStatus.pending.map((task) => (
              <div key={task.id} className="border rounded-lg p-4">
                <h3 className="font-semibold">{task.title}</h3>
                <p className="text-sm text-gray-600">Due: {task.dueDate}</p>
                <span className="mt-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                  {task.priority} priority
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <FaCheckCircle className="text-green-500 mr-2" />
            <h2 className="text-xl font-semibold">Completed Tasks</h2>
          </div>
          <div className="space-y-4">
            {taskStatus.completed.map((task) => (
              <div key={task.id} className="border rounded-lg p-4">
                <h3 className="font-semibold">{task.title}</h3>
                <p className="text-sm text-gray-600">Completed: {task.completedDate}</p>
                <span className="mt-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  {task.priority} priority
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;