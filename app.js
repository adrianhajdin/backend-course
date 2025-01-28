require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const createError = require("http-errors");
const dotenv = require("dotenv");

// Import routes
const userRoutes = require("./routes/user.routes");
const workflowRoutes = require('./routes/workflow.routes');
const subscriptionRoutes = require("./routes/subscription.routes");

// Import database connection
const connectDB = require("./config/db");
const Category = require("./models/Category");

// Initialize Express app
const app = express();

// Connect to the database
connectDB();

// Set up middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Define routes
app.use("/api/users", userRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use('/api', workflowRoutes);

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

module.exports = app;
