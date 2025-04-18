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
} from "../controllers/issue.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create",isAuthenticated, createIssue);
router.get("/getAll", getAllIssues);
router.get("/users/:id",getIssueByUser);
router.post("/upvote/:issueId", isAuthenticated, upvoteIssue);
router.post("/downvote/:issueId", isAuthenticated, downvoteIssue);
router.get('/:id', getIssueById);
router.post('/submitVolunteerRequest',submitVolunteerRequest)
router.get('/claimed/:userId', getClaimedIssuesByUser); 
router.post('/:id/registerVolunteer', isAuthenticated, registerVolunteer)

router.post('/disclaim', disclaimIssue);
router.post('/complete', markIssueAsCompleted);
router.post("/:issueId/feedback", isAuthenticated, submitFeedback);

export default router;