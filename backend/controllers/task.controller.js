// controllers/task.controller.js
import { Task } from '../models/task.model.js';
import Issue from '../models/issue.model.js';

export const getUserTasks = async (req, res) => {
  const userId = req.params.userId;
  try {
    const tasks = await Task.find({ assignedTo: userId }).populate('issue');
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user tasks' });
  }
};