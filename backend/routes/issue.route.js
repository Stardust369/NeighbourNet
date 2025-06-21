import express from "express";
import {
  createIssue,
  getAllIssues,
  getClaimedIssuesByUser,
  getIssueById,
  getIssueByUser,
  submitVolunteerRequest,
  registerVolunteer,
  upvoteIssue,
  downvoteIssue,
  disclaimIssue,
  markIssueAsCompleted,
  submitFeedback,
  getIssueThroughId,
  getIssuesVolunteered,
  assignTask,
  getMyTasks,
  sendTaskUpdate,
  submitTaskProof,
  approveTaskProof,
  rejectTaskProof,
  getCollaboratedIssues,
  getCompletedIssues,
  getIssueFeedback,
} from "../controllers/issue.controller.js";

import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* === ROUTES === */

// Feedback
router.post("/:issueId/feedback", isAuthenticated, submitFeedback); 
router.get("/:id/feedback", isAuthenticated, getIssueFeedback);

// Create / Update / Status Change
router.post("/create", isAuthenticated, createIssue);
router.post("/assignTask", assignTask);
router.post("/submitVolunteerRequest", submitVolunteerRequest);
router.post("/complete", markIssueAsCompleted);
router.post("/disclaim", disclaimIssue);

// Volunteer
router.post("/:id/registerVolunteer", isAuthenticated, registerVolunteer);
router.get("/requested/:id", getIssuesVolunteered);
router.get("/claimed/:userId", getClaimedIssuesByUser);

// Voting
router.post("/upvote/:issueId", isAuthenticated, upvoteIssue);
router.post("/downvote/:issueId", isAuthenticated, downvoteIssue);

// Fetching issues
router.get("/getAll", getAllIssues);
router.get("/completed-issues", isAuthenticated, getCompletedIssues);
router.get("/collaborated/:ngoId", getCollaboratedIssues);
router.get("/users/:id", getIssueByUser);
router.get("/getIssue/:id", getIssueThroughId);

// Tasks
router.get("/:issueId/my-tasks", isAuthenticated, getMyTasks);
router.post("/tasks/:taskId/updates", isAuthenticated, sendTaskUpdate);
router.post("/tasks/:taskId/proof", isAuthenticated, submitTaskProof);
router.post("/acceptTaskProof", approveTaskProof);
router.post("/rejectTaskProof", rejectTaskProof);

// LAST — generic get issue by id (ensure no conflict)
router.get("/:id", getIssueById);

export default router;
