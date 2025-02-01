import 'dotenv/config'; // Load environment variables from .env
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import createError from 'http-errors';
import { fileURLToPath } from 'url';

// Database connection
import connectDB from './config/db.js';

// Import Arcjet global middleware from config
import { arcjetMiddleware } from './config/arcjet.js';

// Import routes
import userRoutes from './routes/user.routes.js';
import subscriptionRoutes from './routes/subscription.routes.js';
import workflowRoutes from './routes/workflow.routes.js';

const app = express();

// Connect to MongoDB
connectDB();

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());

// Global security middleware (Arcjet)
app.use(arcjetMiddleware);

// Define routes
app.use('/api/users', userRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/workflow', workflowRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Welcome to the Subscriptions API');
});

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404, 'Not Found'));
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
      status: err.status || 500,
    },
  });
});

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`___ Server running on http://localhost:${PORT} ___`);
});

export default app;
