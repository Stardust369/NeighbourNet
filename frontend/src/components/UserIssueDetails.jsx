import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function UserIssueDetailsPage({ issue: initialIssue }) {
  const [issue, setIssue] = useState(initialIssue);
  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState('');
  const [timeline, setTimeline] = useState('');
  const [errors, setErrors] = useState({});
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState('');
  const { user } = useSelector((state) => state.auth);
  const [currentIndex, setCurrentIndex] = useState(0);

 

  const handleVolunteerRegister = async () => {
    try {
      await axios.post('http://localhost:3000/api/v1/issues/register-volunteer', {
        issueId: issue._id,
        volunteerId: user._id,
        position: selectedPosition,
      });

      toast.success('Registered as a volunteer!');
      setShowVolunteerModal(false);

      // Update UI if needed
    } catch (err) {
      console.error(err);
      toast.error('Failed to register as a volunteer.');
    }
  };

  const handleNext = () => {
    if (currentIndex < issue.images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-8">
        {/* Title, Content, Location, Status, Tags, Images... */}
        <h1 className="text-3xl font-bold text-blue-700 mb-4">{issue.title}</h1>
        <p className="text-gray-700 mb-4" dangerouslySetInnerHTML={{ __html: issue.content }}></p>

        {/* Location, Status, Tags, and Image Section (same as before)... */}
        <div className="mb-4">
          <span className="font-semibold text-gray-800">Location:</span> {issue.issueLocation}
        </div>

        <div className="mb-4">
          <span className="font-semibold text-gray-800">Status:</span>{' '}
          <span
            className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${issue.status === 'Open'
                ? 'bg-yellow-100 text-yellow-700'
                : issue.status === 'Assigned'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-green-100 text-green-700'
              }`}
          >
            {issue.status}
          </span>
        </div>

        <div className="mb-4">
          <span className="font-semibold text-gray-800">Tags:</span>
          <div className="flex space-x-2 mt-2">
            {issue.tags.map((tag, i) => (
              <span
                key={i}
                className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        {/* Assigned To Section */}
        <div className="mb-6">
          <span className="font-semibold text-gray-800">Assigned To:</span>{' '}
          {issue.assignedTo !== null ? (
            <div>
              <p>{issue.assignedTo}</p>
              {issue.deadline && (
                <p className="text-sm text-gray-600 mt-1">
                  Deadline: {dayjs(issue.deadline).format('MMMM D, YYYY')}
                </p>
              )}
            </div>
          ) : (
            <span className="italic">None</span>
          )}
        </div>

        {/* Request Button */}
        {issue.assignedTo === null && (
          <div className="mb-6">
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow"
            >
              Request This Issue
            </button>
          </div>
        )}

        {/* Volunteering Section for Users */}
        {user.role === 'User' && issue.volunteerPositions?.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Volunteer Positions</h2>
            <ul className="space-y-2">
              {issue.volunteerPositions.map((pos) => (
                <li key={pos._id} className="border p-3 rounded-lg flex justify-between">
                  <div>
                    <p className="font-medium">{pos.position}</p>
                    <p className="text-sm text-gray-600">Available Slots: {pos.slots - pos.registeredVolunteers.length}</p>
                  </div>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setShowVolunteerModal(true)}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Register as a Volunteer
            </button>
          </div>
        )}

        {/* Comments */}
        {/* (Same as your existing code) */}

      </div>

      {/* Request Modal (same as before) */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative shadow-lg">
            <h3 className="text-xl font-bold mb-4">Request This Issue</h3>
            {/* Description and timeline input with validation */}
            {/* Cancel and Submit buttons */}
          </div>
        </div>
      )}

      {/* Volunteer Registration Modal */}
      {showVolunteerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative shadow-lg">
            <h3 className="text-xl font-bold mb-4">Choose a Volunteering Position</h3>
            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 mb-4"
            >
              <option value="">Select Position</option>
              {issue.volunteerPositions.map((pos) => (
                <option key={pos._id} value={pos.position}>
                  {pos.position}
                </option>
              ))}
            </select>
            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2"
                onClick={() => setShowVolunteerModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={handleVolunteerRegister}
                disabled={!selectedPosition}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
