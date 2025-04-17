import express from "express";
import {
  createIssue,
  getIssues,
} from "../controllers/issue.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create",isAuthenticated, createIssue);

router.get("/getAll", getIssues);


export default router;