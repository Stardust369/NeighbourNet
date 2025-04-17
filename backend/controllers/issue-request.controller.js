import IssueRequest from '../models/IssueRequest.js';
import Issue from '../models/Issue.js';

export const requestIssue = async (req, res) => {
  try {
    const { issueId, description, timeline } = req.body;
    const requesterId = req.user._id; 

    if (!issueId || !description || !timeline) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const request = await IssueRequest.create({
      issue: issueId,
      description,
      timeline,
      requestedBy: requesterId,
    });

    const updatedIssue = await Issue.findByIdAndUpdate(
      issueId,
      { assignedTo: requesterId, status: 'Assigned' },
      { new: true }
    ).populate('assignedTo', 'name email'); 
    return res.status(200).json({
      success: true,
      message: 'Issue has been requested and assigned.',
      issue: updatedIssue,
      request,
    });
  } catch (error) {
    console.error('Request Issue Error:', error);
    return res.status(500).json({ success: false, message: 'Something went wrong.' });
  }
};
