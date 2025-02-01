// routes/workflow.routes.js
import express from 'express';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { serve } = require('@upstash/workflow/express');
import { handleWorkflow } from '../controllers/workflow.controller.js';

const router = express.Router();

// The route for QStash to trigger workflow actions.
router.post('/', serve(handleWorkflow));

export default router;
