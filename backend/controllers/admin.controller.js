import Donation from '../models/donation.model.js';
import { User } from '../models/user.model.js';

// Get total donations (all NGOs)
export const getTotalDonations = async (req, res) => {
  try {
    console.log('Fetching total donations');
    const result = await Donation.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalDonations = result.length > 0 ? result[0].total : 0;
    console.log('Total donations:', totalDonations);
    res.json({ success: true, totalDonations });
  } catch (error) {
    console.error('Error fetching total donations:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch total donations', error: error.message });
  }
};

// Get all users (with optional city filter)
export const getAllUsers = async (req, res) => {
  try {
    console.log('Fetching all users');
    const { city } = req.query;
    const filter = { role: 'User' };
    if (city) filter.location = city;
    const users = await User.find(filter).select('-password');
    console.log(`Found ${users.length} users`);
    res.json({ success: true, users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch users', error: error.message });
  }
};

// Get all NGOs (with optional city filter)
export const getAllNGOs = async (req, res) => {
  try {
    console.log('Fetching all NGOs');
    const { city } = req.query;
    const filter = { role: 'NGO' };
    if (city) filter.location = city;
    const ngos = await User.find(filter).select('-password');
    console.log(`Found ${ngos.length} NGOs`);
    res.json({ success: true, ngos });
  } catch (error) {
    console.error('Error fetching NGOs:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch NGOs', error: error.message });
  }
}; 