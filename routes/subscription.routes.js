import express from "express";

import authMiddleware from "../middlewares/auth.middleware.js";
import {
  getSubscriptions,
  addSubscription,
  updateSubscription,
  deleteSubscription,
  getSubscriptionById,
} from "../controllers/subscription.controller.js";

const router = express.Router();

// Protect all subscription routes
router.use(authMiddleware);

router.post("/", addSubscription);
router.get("/", getSubscriptions);
router.get("/:id", getSubscriptionById);
router.put("/:id", updateSubscription);
router.delete("/:id", deleteSubscription);

export default router;
