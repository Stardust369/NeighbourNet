// controllers/task.controller.js
import { Task } from '../models/task.model.js';
import { User } from '../models/user.model.js';

export const getUserTasks = async (req, res) => {
  try {
    const { userId } = req.params;
    const tasks = await Task.find({ assignedTo: userId })
      .populate('issue', 'title')
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: tasks
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTasksByIssue = async (req, res) => {
  try {
    const { issueId } = req.params;
    const tasks = await Task.find({ issue: issueId })
      .populate('assignedTo', 'name')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};