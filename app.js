import express from 'express';
import connectDB from './config/db.js';
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import createError from "http-errors";

// Import routes
import userRoutes from "./routes/user.routes.js";
import workflowRoutes from './routes/workflow.routes.js';
import subscriptionRoutes from "./routes/subscription.routes.js";

import { fileURLToPath } from "url";

// Initialize Express app
const app = express();

// Connect to the database
connectDB();

// Set up middleware
// Define __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use the new __dirname
app.use(express.static(path.join(__dirname, "public")));
app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));

app.use('/api/workflow', workflowRoutes);
app.use(express.json());

// Define routes
app.use("/api/users", userRoutes);
app.use("/api/subscriptions", subscriptionRoutes);


app.get("/", (req, res) => {
  res.send("Welcome to the Subscriptions API");
})

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Send error response
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
      status: err.status || 500,
    },
  });
});

// Set port and export app
const PORT = process.env.PORT || 5500;
app.set("port", PORT);

  // const categories = [
  //   { name: "Entertainment" },
  //   { name: "Fitness" },
  //   { name: "Software" },
  // ];

  // Category.insertMany(categories);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;