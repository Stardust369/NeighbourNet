import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaHistory, FaClock, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/logo.png';

const UserDashboard = () => {
  const user = useSelector(state => state.auth.user);
  const userId = user?._id;
  const navigate = useNavigate();

  const [completedTasks, setCompletedTasks] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const fetchUserTasks = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/v1/tasks/user/${userId}`);
        const tasks = res.data;
        // Split tasks by status
        const completed = tasks.filter(task => task.status === 'completed');
        const pending = tasks.filter(task => task.status !== 'completed');
        setCompletedTasks(completed);
        setPendingTasks(pending);
      } catch (error) {
        console.error('Error fetching user tasks:', error);
      }
    };

    fetchUserTasks();
  }, [userId]);

  const totalTasks = completedTasks.length + pendingTasks.length;
  const completionPercentage = totalTasks > 0
    ? Math.round((completedTasks.length / totalTasks) * 100)
    : 0;
  const shouldUseAsymmetricLayout = completedTasks.length === 0 && pendingTasks.length > 2;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Top Welcome Section */}
        <div className="flex flex-col items-center mb-10">
          <img src={logo} alt="App Logo" className="h-70" />
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
            Welcome{user?.name ? `, ${user.name.split(" ")[0]}` : ''} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Here's an overview of your volunteering journey
          </p>
        </div>

        {/* Task Completion */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-10 transition hover:shadow-2xl">
          <div className="flex items-center mb-6">
            <FaCheckCircle className="text-green-500 mr-3 text-2xl" />
            <h2 className="text-2xl font-semibold text-gray-700">Task Completion</h2>
          </div>
          <div className="text-gray-700 mb-2 text-base">
            <span className="font-bold text-green-600">{completedTasks.length}</span> out of <span className="font-bold">{totalTasks}</span> tasks completed
          </div>
          <div className="w-full bg-gray-200 rounded-full h-5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-400 to-green-600 h-5 rounded-full transition-all duration-700"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <div className="mt-3 text-sm text-gray-600 font-medium">
            {completionPercentage}% completed
          </div>
        </div>

        {/* Content Sections */}
        <div className={`grid md:grid-cols-${shouldUseAsymmetricLayout ? '3' : '2'} gap-8`}>
          {/* Volunteering History (Completed Tasks) */}
          <div className="bg-white rounded-2xl shadow-lg p-8 transition hover:shadow-2xl">
            <div className="flex items-center mb-6">
              <FaHistory className="text-blue-500 mr-3 text-2xl" />
              <h2 className="text-2xl font-semibold text-gray-700">Volunteering History</h2>
            </div>

            {completedTasks.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-gray-400">No completed tasks yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Task</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Issue</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedTasks.map((task, idx) => (
                      <tr key={task._id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-6 py-4 font-medium text-gray-700">{task.description}</td>
                        <td className="px-6 py-4 text-gray-500">{task.issue?.title || 'N/A'}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                            {task.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pending Tasks */}
          <div className={`bg-white rounded-2xl shadow-lg p-8 transition hover:shadow-2xl ${shouldUseAsymmetricLayout ? 'md:col-span-2' : 'md:col-span-1'}`}>
            <div className="flex items-center mb-6">
              <FaClock className="text-red-500 mr-3 text-2xl" />
              <h2 className="text-2xl font-semibold text-gray-700">Pending Tasks</h2>
            </div>

            {pendingTasks.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                No pending tasks. Great job!
              </div>
            ) : (
              <div className={`space-y-4 ${pendingTasks.length > 4 ? 'max-h-[500px] overflow-y-auto pr-2' : ''}`}>
                {pendingTasks.map((task, idx) => (
                  <div
                    key={task._id}
                    className="border border-gray-200 rounded-xl p-5 cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition group shadow-sm"
                    onClick={() => navigate(`/issues/${task.issue?._id || ''}`)}
                  >
                    <h3 className="font-semibold text-lg text-blue-700 group-hover:underline">
                      {task.description}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Issue: <span className="font-medium">{task.issue?.title || 'N/A'}</span>
                    </p>
                    <p className="mt-2 text-sm">
                      <strong>Status:</strong>{' '}
                      <span className={`font-semibold ${task.status?.toLowerCase() === 'pending' ? 'text-blue-500' : 'text-yellow-500'}`}>
                        {task.status}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
