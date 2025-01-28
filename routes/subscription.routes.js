import express from "express"

import {
  getSubscriptions,
  addSubscription,
  updateSubscription,
  deleteSubscription,
} from "../controllers/subscription.controller.js"
const router = express.Router();

router.post("/", addSubscription);
router.delete("/:id", deleteSubscription);
router.put("/:id", updateSubscription);
router.get("/", getSubscriptions);

// const authMiddleware = require("../middlewares/auth.middleware");
// router.post("/", authMiddleware, addSubscription);
// router.get("/", authMiddleware, getSubscriptions);
// router.put("/:id", authMiddleware, updateSubscription);
// router.delete("/:id", authMiddleware, deleteSubscription);

export default router;