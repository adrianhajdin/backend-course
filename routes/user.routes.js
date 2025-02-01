// routes/user.routes.js
import express from "express";
import { registerUser, loginUser, getUserProfile } from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { validateEmail } from "../config/arcjet.js";

const router = express.Router();

// Protect the registration route with email validation.
router.post("/register", validateEmail, registerUser);
router.post("/login", loginUser);
router.get("/profile", authMiddleware, getUserProfile);

export default router;
