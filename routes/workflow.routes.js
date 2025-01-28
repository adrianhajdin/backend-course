const express = require('express');
const { serve } = require('@upstash/workflow/express');
const { getSubscriptionById, sendReminder } = require('../controllers/subscription.controller');

const router = express.Router();

router.post(
  '/workflow',
  serve(async (context) => {
    const { subscriptionId } = context.requestPayload;

    // Fetch subscription details
    const subscription = await context.run("fetch-subscription", async () => {
      return await getSubscriptionById(subscriptionId);
    });

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    // Send reminder email
    await context.run("send-reminder-email", async () => {
      await sendReminder(subscription);
    });

    return { success: true, message: `Reminder sent for subscription: ${subscription.name}` };
  })
);

module.exports = router;
