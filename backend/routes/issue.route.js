import express from "express";
import {
  createIssue,
  getAllIssues,
  getIssueById,
  getIssueByUser,
} from "../controllers/issue.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create",isAuthenticated, createIssue);
router.get("/getAll", getAllIssues);
router.get("/users/:id",getIssueByUser);
router.get('/:id', getIssueById);
router


export default router;