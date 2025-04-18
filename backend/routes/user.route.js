import express from "express"
import { 
    forgotPassword, 
    getUser, 
    login, 
    logout, 
    register, 
    resetPassword, 
    verifyOtp,
    getAllNGOs 
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Auth routes
router.post('/register', register);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.get("/profile", isAuthenticated, getUser);
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);

// NGO routes
router.get('/ngos', isAuthenticated, getAllNGOs);

export default router;