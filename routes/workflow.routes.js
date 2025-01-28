import express from 'express';

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { serve } = require('@upstash/workflow/express');

import { 
  getSubscriptionById, 
  sendReminder 
} from '../controllers/subscription.controller.js';

const router = express.Router();

// Define the POST route for the QStash workflow
router.post('/', serve(async (context) => {
    const { subscriptionId } = context.requestPayload;

    // Fetch subscription details
    const subscription = await context.run('fetch-subscription', async () => {
      return await getSubscriptionById(subscriptionId);
    });

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    // Send a reminder email
    await context.run('send-reminder-email', async () => {
      await sendReminder(subscription);
    });

    return { success: true, message: `Reminder sent for subscription: ${subscription.name}` };
  })
);

export default router;