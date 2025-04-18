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
} from "../controllers/issue.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create",isAuthenticated, createIssue);
router.get("/getAll", getAllIssues);
router.get("/users/:id",getIssueByUser);
router.post("/upvote/:issueId", isAuthenticated, upvoteIssue);
router.post("/downvote/:issueId", isAuthenticated, downvoteIssue);
router.get('/:id', getIssueById);
router.get('/claimed/:userId', getClaimedIssuesByUser); // Assuming you want to get issues by userId as well
router.post('/submitVolunteerRequest', submitVolunteerRequest)
router.post('/:id/registerVolunteer', isAuthenticated, registerVolunteer)

export default router;