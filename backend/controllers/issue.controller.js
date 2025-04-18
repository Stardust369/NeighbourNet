import Issue from '../models/issue.model.js';
import { User } from '../models/user.model.js';
// import Job from '../models/job.model.js';
// import { Notification } from '../models/notification.model.js';
// import { notifyIssuePicked } from './notification.controller.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';


//Create a new issue
export const createIssue = async (req, res) => {
  try {
    const { title, tags, content, images, videos, issueLocation } = req.body;
    
    if (!title || !tags || !issueLocation) {
      return res.status(400).json({ message: "Missing required fields" });
    }
   
    const issue = await Issue.create({
      title,
      tags,
      content,
      images,
      videos,
      issueLocation,
      postedBy: req.user._id,
      upvoters: [req.user._id], // auto-upvote by reporter
    });
    console.log('====================================');
    console.log(req.user);
    console.log('====================================');
    return res.status(201).json(new ApiResponse(201, issue, "Issue created successfully"));
  } catch (error) {
    console.log('====================================');
    console.log(error.message);
    console.log('====================================');
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

//Assign NGO to issue and notify reporter/upvoters
export const assignNgoToIssue = async (req, res) => {
  try {
    const { issueId } = req.params;
    const ngoId = req.user._id; // NGO is authenticated

    const ngoUser = await User.findById(ngoId);
    if (!ngoUser || ngoUser.role !== "NGO") {
      return res.status(403).json({ message: "Only NGOs can assign themselves to issues" });
    }

    const issue = await Issue.findById(issueId);
    if (!issue) return res.status(404).json({ message: "Issue not found" });
    if (issue.status !== "Open") {
      return res.status(400).json({ message: "Issue is not open for assignment" });
    }

    issue.assignedTo = ngoId;
    issue.status = "Assigned";
    await issue.save();

    // Notify reporter and upvoters
    await notifyIssuePicked(issue._id, ngoId);

    return res.status(200).json(new ApiResponse(200, issue, "NGO assigned to issue successfully"));
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getIssueByUser = async (req, res) => {
  const userId = req.params.id;
  
  try {
    const issues = await Issue.find({ postedBy: userId });
    
    res.status(200).json({
      success: true,
      data: issues,
    });
  } catch (error) {
    console.error('Error fetching user issues:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

//Get all issues (with optional filters)
export const getAllIssues = async (req, res) => {
  try {
    // Optionally, you can paginate or sort
    const issues = await Issue
      .find()
      .sort({ createdAt: -1 })     // newest first
      .populate("postedBy", "name"); // include reporter name
    
    return res
      .status(200)
      .json(new ApiResponse(200,  issues , "Issues fetched successfully"));
  } catch (error) {
    console.error("Error in getAllIssues:", error.stack);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Server error", {
        error: process.env.NODE_ENV === "development" ? error.message : undefined
      }));
  }
};

//Get a single issue by ID or slug
export const getIssue = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const issue = await Issue.findOne({ $or: [{ _id: idOrSlug }, { slug: idOrSlug }] })
      .populate("postedBy assignedTo comments.user");
    if (!issue) return res.status(404).json({ message: "Issue not found" });
    return res.status(200).json(new ApiResponse(200, issue, "Issue fetched successfully"));
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    res.status(200).json({ success: true, issue });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

//Update issue (by admin)
export const updateIssue = async (req, res) => {
  try {
    const { issueId } = req.params;
    const updates = req.body;
    const issue = await Issue.findById(issueId);
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Not authorized to update this issue" });
    }

    Object.assign(issue, updates);
    await issue.save();
    return res.status(200).json(new ApiResponse(200, issue, "Issue updated successfully"));
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

//Delete issue (admin)
export const deleteIssue = async (req, res) => {
  try {
    const { issueId } = req.params;
    const issue = await Issue.findById(issueId);
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Not authorized to delete this issue" });
    }

    await issue.remove();
    return res.status(200).json({ message: "Issue deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

//Upvote the issue:
export const upvoteIssue = async (req, res, next) => {
    try {
        const { issueId } = req.params;
        const userId = req.user._id;
        const issue = await Issue.findById(issueId);
        
        if (!issue) {
            return next(new ApiError(404, "Issue not found"));
        }

        if (!issue.upvoters)
            issue.upvoters = [];
        if (!issue.upvoters.includes(userId)) {
            issue.upvoters.push(userId);
            let upvoteCount = issue.upvoters.length;
            await issue.save();
            return res.status(200).json(new ApiResponse(200, issue, "Issue upvoted"));
        }
        else {
            return res.status(400).json({ message: "Already upvoted" });
        }
    }
    catch (error) {
        next(error);
    }
}

//downvote the issue: 
export const downvoteIssue = async (req, res, next) => {
    try {
      const { issueId } = req.params;
      const userId = req.user._id;
  
      const issue = await Issue.findById(issueId);
      if (!issue) return res.status(404).json({ message: "Issue not found" });
  
      // Prevent duplicate downvotes
      if (issue.downvoters.includes(userId)) {
        issue.downvoters = issue.downvoters.filter(id => id.toString() !== userId.toString());
      } else {
        issue.downvoters.push(userId);
  
        issue.upvoters = issue.upvoters.filter(id => id.toString() !== userId.toString());
      }
  
      // Auto-flag if threshold reached
        const limit = 2;
      if (issue.downvoters.length >= limit) {
        issue.isFlagged = true;
      }
  
      await issue.save();
      return res.status(200).json({ success: true, downvotes: issue.downvoters.length, isFlagged: issue.isFlagged });
    } catch (error) {
      next(error);
    }
  };
  
  export const getClaimedIssuesByUser = async (req, res) => {
    const { userId } = req.params;
     const user= await User.findById(userId);
    try {
      const claimedIssues = await Issue.find({ assignedTo: user.name }).sort({ timeline: 1 });
  
      res.status(200).json({
        success: true, 
        claimedIssues,
      });
    } catch (error) {
      console.error('Error fetching claimed issues:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch claimed issues',
      });
    }
  };

  export const submitVolunteerRequest = async (req, res) => {
    const { issueId, volunteerPositions, ngoUsername, ngoUserid } = req.body;
  
    try {
      // Find the issue by ID
      const issue = await Issue.findById(issueId);
      if (!issue) {
        return res.status(404).json({ message: "Issue not found" });
      }
  
      // Validate volunteer positions
      const validationErrors = [];
      volunteerPositions.forEach((pos, index) => {
        if (!pos.position || pos.position.trim() === "") {
          validationErrors.push(`Position at index ${index} is required.`);
        }
        if (!pos.slots || isNaN(pos.slots) || pos.slots <= 0) {
          validationErrors.push(`Invalid slots at index ${index}. Slots should be a positive number.`);
        }
      });
  
      // If there are validation errors, send them back
      if (validationErrors.length > 0) {
        return res.status(400).json({ errors: validationErrors });
      }
  
      // Add the volunteer positions to the issue document
      issue.volunteerPositions = [...issue.volunteerPositions, ...volunteerPositions];
  
      // Save the updated issue
      await issue.save();
  
      // Send a success response
      res.status(200).json({ message: "Volunteer positions added successfully!" });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong while processing your request." });
    }
};

export const registerVolunteer = async (req, res) => {
  const { position } = req.body;
  const issueId = req.params.id;
  const userId = req.user._id;

  try {
    const issue = await Issue.findById(issueId);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    const selected = issue.volunteerPositions.find(p => p.position === position);
    if (!selected) return res.status(400).json({ message: 'Invalid position' });

    if (selected.registeredVolunteers.includes(userId)) {
      return res.status(409).json({ message: 'Already registered' });
    }

    if (selected.registeredVolunteers.length >= selected.slots) {
      return res.status(400).json({ message: 'No slots left' });
    }

    selected.registeredVolunteers.push(userId);
    await issue.save();

    res.status(200).json({ message: 'Registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const disclaimIssue = async (req, res) => {
  try {
    const { issueId } = req.body;

    if (!issueId) {
      return res.status(400).json({ success: false, message: 'Issue ID is required' });
    }

    const issue = await Issue.findById(issueId);
    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    issue.status = 'Open';
    issue.assignedTo = null;
    issue.volunteerPositions = [];

    await issue.save();

    return res.status(200).json({
      success: true,
      message: 'Issue disclaimed successfully',
      updatedIssue: issue,
    });
  } catch (error) {
    console.error('Error disclaiming issue:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
export const markIssueAsCompleted = async (req, res) => {
  try {
    const { issueId } = req.body;

    if (!issueId) {
      return res.status(400).json({ success: false, message: 'Issue ID is required' });
    }

    const issue = await Issue.findById(issueId);
    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    issue.status = 'Completed';
    issue.volunteerPositions = [];
    await issue.save();

    return res.status(200).json({
      success: true,
      message: 'Issue marked as completed',
      updatedIssue: issue,
    });
  } catch (error) {
    console.error('Error marking issue as completed:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const submitFeedback = async (req, res) => {
  try {
    const { issueId } = req.params;
    const userId = req.user._id; // assuming auth middleware sets req.user
    const { resolved, satisfaction, suggestions, issueProblem } = req.body;

    if (!["Yes", "No"].includes(resolved)) {
      return res.status(400).json({ message: "Resolved must be 'Yes' or 'No'." });
    }

    const issue = await Issue.findById(issueId);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found." });
    }

    if (issue.status !== "Completed") {
      return res.status(400).json({ message: "Feedback can only be submitted for completed issues." });
    }

    const alreadySubmitted = issue.feedback.some((fb) =>
      fb.user.toString() === userId.toString()
    );

    if (alreadySubmitted) {
      return res.status(400).json({ message: "You have already submitted feedback for this issue." });
    }

    const newFeedback = {
      user: userId,
      resolved,
      satisfaction,
      suggestions,
      issueProblem,
    };

    issue.feedback.push(newFeedback);
    await issue.save();

    res.status(200).json({ message: "Feedback submitted successfully." });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};