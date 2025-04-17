import express from "express";
import {
  createIssue,
  getAllIssues,
  getClaimedIssuesByUser,
  getIssueById,
  submitVolunteerRequest,
} from "../controllers/issue.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create",isAuthenticated, createIssue);
router.get("/getAll", getAllIssues);
router.get('/:id', getIssueById);
router.get('/claimed/:userId', getClaimedIssuesByUser); // Assuming you want to get issues by userId as well
router.post('/submitVolunteerRequest',submitVolunteerRequest)

export default router;