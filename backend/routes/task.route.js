import express from "express";
import { getUserTasks, getTasksByIssue } from "../controllers/task.controller.js";

const router = express.Router();

router.get("/user/:userId", getUserTasks);
router.get("/:issueId", getTasksByIssue);

export default router;