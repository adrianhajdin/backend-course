// routes/user.routes.js
import express from 'express';
import { registerUser, loginUser, getUserProfile } from '../controllers/user.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { validateEmail } from '../config/arcjet.js';

const router = express.Router();

// Registration route with email validation middleware
router.post('/register', validateEmail, registerUser);

// Login route (no email validation needed)
router.post('/login', loginUser);

// Protected route for user profile
router.get('/profile', authMiddleware, getUserProfile);

export default router;
