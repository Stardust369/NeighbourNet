import express from "express";
import { getUserTasks } from "../controllers/task.controller.js";

const router = express.Router();

router.get("/user/:userId", getUserTasks);

export default router;