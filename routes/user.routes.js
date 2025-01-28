import express from "express";

import { 
  registerUser, 
  loginUser, 
  getUserProfile 
} from "../controllers/user.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authMiddleware, getUserProfile);

export default router;