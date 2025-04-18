import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function NGOIssueDetailsPage({ issue: initialIssue }) {
  const [issue, setIssue] = useState(initialIssue);
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const [volunteerPositions, setVolunteerPositions] = useState([{ position: '', slots: '' }]);
  const { user } = useSelector((state) => state.auth);
  const [errors, setErrors] = useState({});

  // Handle adding a new volunteer position input field
  const handleAddPosition = () => {
    setVolunteerPositions([...volunteerPositions, { position: '', slots: '' }]);
  };

  // Handle change in position or slots
  const handlePositionChange = (index, field, value) => {
    const updatedPositions = [...volunteerPositions];
    updatedPositions[index][field] = value;
    setVolunteerPositions(updatedPositions);
  };

  // Handle removing a volunteer position
  const handleRemovePosition = (index) => {
    const updatedPositions = volunteerPositions.filter((_, i) => i !== index);
    setVolunteerPositions(updatedPositions);
  };

  // Handle submit of volunteer positions
  const handleSubmitVolunteerRequest = async () => {
    let currentErrors = {};
    volunteerPositions.forEach((pos, index) => {
      if (!pos.position.trim()) {
        currentErrors[`position_${index}`] = 'Position name is required';
      }
      if (!pos.slots || isNaN(pos.slots) || pos.slots <= 0) {
        currentErrors[`slots_${index}`] = 'Please enter a valid number of slots';
      }
    });

    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors);
      return;
    }

    setErrors({});

    try {
      const res = await axios.post('http://localhost:3000/api/v1/issues/submitVolunteerRequest', {
        issueId: issue._id,
        volunteerPositions,
        ngoUsername: user.name,
        ngoUserid: user._id,
      });

      toast.success('Volunteer request submitted successfully!');
      setShowVolunteerModal(false);
      setVolunteerPositions([{ position: '', slots: '' }]);
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong while submitting the volunteer request.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">{issue.title}</h1>
        <p className="text-gray-700 mb-4" dangerouslySetInnerHTML={{ __html: issue.content }}></p>

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

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Images</h2>
          <div className="relative">
            <img
              src={issue.images[0]?.url}
              alt={issue.images[0]?.caption}
              className="rounded-lg shadow w-full"
              style={{
                height: '300px',
                objectFit: 'contain',
                width: '100%',
              }}
            />
            <p className="text-sm text-gray-600 mt-1 text-center">{issue.images[0]?.caption}</p>
          </div>
        </div>

        {/* Display Volunteer Positions if any */}
        {issue.volunteerPositions && issue.volunteerPositions.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Volunteer Positions</h2>
            {issue.volunteerPositions.map((position, index) => (
              <div key={index} className="mb-4">
                <div className="text-sm font-medium text-gray-700">
                  <span className="font-semibold">Position:</span> {position.position}
                </div>
                <div className="text-sm font-medium text-gray-700">
                  <span className="font-semibold">Slots Available:</span> {position.slots}
                </div>
                <div className="text-sm font-medium text-gray-700">
                  <span className="font-semibold">Registered Volunteers:</span> {position.registeredVolunteers.length}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Request Volunteer Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowVolunteerModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow"
          >
            Request for Volunteers
          </button>
        </div>
      </div>

      {/* Volunteer Modal */}
      {showVolunteerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-xl px-6 py-8 w-full max-w-lg shadow-2xl relative animate-fade-in-up">
            <h3 className="text-2xl font-semibold mb-6 text-gray-800">Request Volunteers</h3>

            {volunteerPositions.map((position, index) => (
              <div key={index} className="mb-6 border border-gray-200 p-4 rounded-lg shadow-sm bg-gray-50">
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Position</label>
                  <input
                    type="text"
                    value={position.position}
                    onChange={(e) => handlePositionChange(index, 'position', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Coordinator"
                  />
                  {errors[`position_${index}`] && (
                    <p className="text-red-500 text-xs mt-1">{errors[`position_${index}`]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Number of Slots</label>
                  <input
                    type="number"
                    value={position.slots}
                    onChange={(e) => handlePositionChange(index, 'slots', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. 5"
                  />
                  {errors[`slots_${index}`] && (
                    <p className="text-red-500 text-xs mt-1">{errors[`slots_${index}`]}</p>
                  )}
                </div>

                {volunteerPositions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemovePosition(index)}
                    className="text-red-600 text-xs mt-4 hover:underline"
                  >
                    Remove this Position
                  </button>
                )}
              </div>
            ))}

            <div className="mt-4">
              <button
                onClick={handleAddPosition}
                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
              >
                ➕ Add Another Position
              </button>
            </div>
            <div className="flex justify-between items-center mt-6">
              <button
                className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200 transition"
                onClick={() => setShowVolunteerModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                onClick={handleSubmitVolunteerRequest}
              >
                Submit Request
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
