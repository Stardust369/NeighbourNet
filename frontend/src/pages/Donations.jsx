import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';

const Donations = () => {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNgo, setSelectedNgo] = useState(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [donationMessage, setDonationMessage] = useState('');
  const [showDonationModal, setShowDonationModal] = useState(false);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchNgos();
  }, []);

  const fetchNgos = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/v1/user/ngos', {
        withCredentials: true
      });
      setNgos(response.data.data || []);
    } catch (err) {
      setError('Failed to fetch NGOs');
      toast.error('Failed to fetch NGOs');
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = (ngo) => {
    setSelectedNgo(ngo);
    setShowDonationModal(true);
  };

  const handleDonation = async () => {
    if (!selectedNgo) return;
    
    if (!donationAmount || donationAmount <= 0) {
      toast.error('Please enter a valid donation amount');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3000/api/v1/donations',
        {
          ngoId: selectedNgo._id,
          amount: parseFloat(donationAmount),
          message: donationMessage,
        },
        {
          withCredentials: true
        }
      );
      
      toast.success(`Successfully donated ₹${donationAmount} to ${selectedNgo.name}`);
      setShowDonationModal(false);
      setDonationAmount('');
      setDonationMessage('');
      setSelectedNgo(null);
      
      // Refresh NGO list to update donation amounts
      fetchNgos();
    } catch (err) {
      toast.error('Failed to process donation');
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Support NGOs</h1>
      
      {loading && <p className="text-gray-600">Loading NGOs...</p>}
      {error && <p className="text-red-600">{error}</p>}
      
      {!loading && !error && ngos.length === 0 && (
        <p className="text-gray-600">No NGOs found.</p>
      )}
      
      {!loading && !error && ngos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ngos.map((ngo) => (
            <div key={ngo._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold text-blue-800 mb-2">{ngo.name}</h2>
                <p className="text-gray-600 mb-2">{ngo.description || 'No description available'}</p>
                <p className="text-gray-500 text-sm mb-4">Location: {ngo.location}</p>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Total Donations: ₹{ngo.totalDonations || 0}</p>
                  <p className="text-sm text-gray-500">Issues Resolved: {ngo.issuesResolved || 0}</p>
                </div>
                
                <button
                  onClick={() => handleDonate(ngo)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                >
                  Donate
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Donation Modal */}
      {showDonationModal && selectedNgo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Donate to {selectedNgo.name}</h2>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Donation Amount (₹)</label>
              <input
                type="number"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter amount"
                min="1"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Message (Optional)</label>
              <textarea
                value={donationMessage}
                onChange={(e) => setDonationMessage(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add a message with your donation"
                rows="3"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDonationModal(false);
                  setDonationAmount('');
                  setDonationMessage('');
                  setSelectedNgo(null);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDonation}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Donate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Donations; 