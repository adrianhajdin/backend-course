// config/arcjet.js
import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";

// Configure Arcjet with all rules
const aj = arcjet({
  key: process.env.ARCJET_KEY, // Ensure a valid ARCJET_KEY is set in your env.
  characteristics: ["ip.src"],
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({ mode: "LIVE", allow: ["CATEGORY:SEARCH_ENGINE"] }),
    tokenBucket({ mode: "LIVE", refillRate: 5, interval: 10, capacity: 10 }),
  ],
});

/**
 * Global middleware to protect all incoming requests.
 */
const arcjetMiddleware = async (req, res, next) => {
  try {
    const decision = await aj.protect(req, { requested: 1 });
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({ error: "Too Many Requests" });
      }
      if (decision.reason.isBot()) {
        return res.status(403).json({ error: "Forbidden: Bot detected" });
      }
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  } catch (error) {
    console.error("Arcjet middleware error:", error);
    next();
  }
};

/**
 * Email validation middleware for protecting signup forms.
 */
const validateEmail = async (req, res, next) => {
  try {
    const email = req.body.email;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    // Basic regex check for email validity.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }
    // Optionally, you can call Arcjet's email validation API if available:
    // const validationResult = await aj.emailValidation(email);
    // if (!validationResult.valid) {
    //   return res.status(400).json({ error: "Invalid email address" });
    // }
    next();
  } catch (error) {
    console.error("Email validation error:", error);
    next();
  }
};

export { arcjetMiddleware, validateEmail };
