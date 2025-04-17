import express from "express";
import {
    requestIssue,
} from "../controllers/issue-request.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();


router.post("/requesting",requestIssue);

export default router;
