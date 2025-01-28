const express = require("express");
const {
  getSubscriptions,
  addSubscription,
  updateSubscription,
  deleteSubscription,
} = require("../controllers/subscription.controller");
// const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();

// router.post("/", authMiddleware, addSubscription);
// router.get("/", authMiddleware, getSubscriptions);
// router.put("/:id", authMiddleware, updateSubscription);
// router.delete("/:id", authMiddleware, deleteSubscription);

router.post("/", addSubscription);
router.delete("/:id", deleteSubscription);
router.put("/:id", updateSubscription);
router.get("/", getSubscriptions);

module.exports = router;
