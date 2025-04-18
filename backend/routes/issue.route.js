import express from "express";
import {
  createIssue,
  getAllIssues,
  getClaimedIssuesByUser,
  getIssueById,
  getIssueByUser,
  submitVolunteerRequest,
} from "../controllers/issue.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create",isAuthenticated, createIssue);
router.get("/getAll", getAllIssues);
router.get("/users/:id",getIssueByUser);
router.get('/:id', getIssueById);
router.post('/submitVolunteerRequest',submitVolunteerRequest)

export default router;