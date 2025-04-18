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
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [resolved, setResolved] = useState(null);
  const [satisfaction, setSatisfaction] = useState(5);
  const [suggestions, setSuggestions] = useState('');
  const [issueProblem, setIssueProblem] = useState('');
  const { user } = useSelector((state) => state.auth);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRegistered, setIsRegistered] = useState(false);

  const handleVolunteerRegister = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/v1/issues/${issue._id}/registerVolunteer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ position: selectedPosition }),
      });

      const data = await res.json();

      if (res.status === 409) {
        toast.info(data.message);
      } else if (!res.ok) {
        throw new Error(data.message || `Error ${res.status}`);
      } else {
        setIsRegistered(true);
        toast.success("Successfully registered!");
        setShowVolunteerModal(false);
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
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

  const handleFeedbackSubmit = async () => {
    try {
      const payload = {
        resolved,
        satisfaction: resolved === 'Yes' ? satisfaction : null,
        suggestions: resolved === 'Yes' ? suggestions : null,
        issueProblem: resolved === 'No' ? issueProblem : null,
      };

      const res = await axios.post(`http://localhost:3000/api/v1/issues/${issue._id}/feedback`, payload, {
        withCredentials: true,
      });

      toast.success("Feedback submitted successfully!");
      setShowFeedbackModal(false);
      // Optionally reset form state
    } catch (err) {
      toast.error("Failed to submit feedback");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-4">{issue.title}</h1>
        <p className="text-gray-700 mb-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: issue.content }}></p>

        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-3">
            <span className="font-semibold text-gray-800">Location:</span>
            <p className="text-gray-600">{issue.issueLocation}</p>
          </div>

          <div className="flex items-center space-x-3 mb-3">
            <span className="font-semibold text-gray-800">Status:</span>
            <span
              className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                issue.status === 'Open'
                  ? 'bg-yellow-100 text-yellow-700'
                  : issue.status === 'Assigned'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-green-100 text-green-700'
              }`}
            >
              {issue.status}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="font-semibold text-gray-800">Tags:</span>
            <div className="flex flex-wrap gap-2">
              {issue.tags.map((tag, i) => (
                <span key={i} className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {issue.images?.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Images</h2>
            <div className="relative">
              <img
                src={issue.images[currentIndex].url}
                alt={issue.images[currentIndex].caption}
                className="rounded-lg shadow w-full"
                style={{
                  height: '300px',
                  objectFit: 'contain',
                  width: '100%',
                }}
              />
              <div
                className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-500 bg-opacity-50 p-2 cursor-pointer"
                onClick={handlePrevious}
              >
                <span className="text-white text-lg">←</span>
              </div>
              <div
                className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-500 bg-opacity-50 p-2 cursor-pointer"
                onClick={handleNext}
              >
                <span className="text-white text-lg">→</span>
              </div>
              <p className="text-sm text-gray-600 mt-1 text-center">
                {issue.images[currentIndex].caption}
              </p>
            </div>
          </div>
        )}

        <div className="mb-4">
          <span className="font-semibold text-gray-800">Assigned To:</span>
          {issue.assignedTo !== null ? (
            <div className="bg-blue-50 p-2 rounded-lg shadow-sm">
              <p className="font-medium text-gray-800">{issue.assignedTo}</p>
              {issue.deadline && (
                <p className="text-sm text-gray-600 mt-0">
                  <span className="font-medium">Deadline:</span>{' '}
                  {dayjs(issue.deadline).format('MMMM D, YYYY')}
                </p>
              )}
            </div>
          ) : (
            <span className="italic text-gray-600">None</span>
          )}
        </div>

        {/* Volunteer section */}
        {user.role === 'User' && issue.volunteerPositions?.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Volunteer Positions</h2>
            <ul className="space-y-4">
              {issue.volunteerPositions.map((pos) => (
                <li key={pos._id} className="border p-4 rounded-lg shadow-sm flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800">{pos.position}</p>
                    <p className="text-sm text-gray-600">
                      Available Slots: {pos.slots - pos.registeredVolunteers.length}
                    </p>
                  </div>
                  {pos.registeredVolunteers.includes(user._id) && (
                    <span className="text-sm text-green-500 font-medium">You are registered</span>
                  )}
                </li>
              ))}
            </ul>

            {!issue.volunteerPositions.some(pos => pos.registeredVolunteers.includes(user._id)) && (
              <button
                onClick={() => setShowVolunteerModal(true)}
                className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
              >
                Register as a Volunteer
              </button>
            )}
          </div>
        )}

        {/* Feedback Button */}
        {user.role === 'User' && issue.status === 'Completed' && (
          <button
            onClick={() => setShowFeedbackModal(true)}
            className="mt-4 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
          >
            Give Feedback
          </button>
        )}
      </div>

      {/* Volunteer Modal */}
      {showVolunteerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Choose a Volunteering Position</h3>
            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 mb-4"
            >
              <option value="">Select Position</option>
              {issue.volunteerPositions.map((pos) => (
                <option key={pos._id} value={pos.position}>
                  {pos.position}
                </option>
              ))}
            </select>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg"
                onClick={() => setShowVolunteerModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                onClick={handleVolunteerRegister}
                disabled={!selectedPosition}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4">Submit Feedback</h3>
            <p className="mb-2">Was the issue resolved?</p>
            <div className="flex gap-4 mb-4">
              <button
                className={`px-4 py-2 rounded-lg ${resolved === 'Yes' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setResolved('Yes')}
              >
                Yes
              </button>
              <button
                className={`px-4 py-2 rounded-lg ${resolved === 'No' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setResolved('No')}
              >
                No
              </button>
            </div>

            {resolved === 'Yes' && (
              <>
                <label className="block font-medium mb-1">How satisfied are you with the work of the NGO?</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={satisfaction}
                  onChange={(e) => setSatisfaction(e.target.value)}
                  className="w-full mb-2"
                />
                <p className="mb-4">Rating: {satisfaction}/10</p>
                <textarea
                  placeholder="Any suggestions?"
                  value={suggestions}
                  onChange={(e) => setSuggestions(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                />
              </>
            )}

            {resolved === 'No' && (
              <textarea
                placeholder="What went wrong?"
                value={issueProblem}
                onChange={(e) => setIssueProblem(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              />
            )}

            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-300 px-6 py-2 rounded-lg"
                onClick={() => setShowFeedbackModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
                onClick={handleFeedbackSubmit}
                disabled={resolved === null}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
