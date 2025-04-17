import IssueRequest from '../models/request-issue.model.js'
import Issue from '../models/issue.model.js'

export const requestIssue = async (req, res) => {
  const { issueId, description,ngoUsername, ngoUserid,timeline } = req.body;
  if (!issueId || !description || !timeline) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const issue = await Issue.findById(issueId); 
    if (!issue) {
      return res.status(404).json({ error: 'Issue not found.' });
    }
    const issueRequest = new IssueRequest({
      issue:issueId,
      description,
      timeline,
      requestedBy:ngoUserid,
    });

    // Save the request to the database
    await issueRequest.save();
    issue.assignedTo = ngoUsername;
    await issue.save(); 

    return res.status(200).json({ success: true, message: 'Request submitted successfully.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong.' });
  }
};

