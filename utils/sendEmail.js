import axios from "axios";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { Client } = require('@upstash/workflow');

const client = new Client({ token: process.env.QSTASH_TOKEN });

export const sendEmail = async ({ to, subject, message }) => {
  try {
    const response = await axios.post(
      "https://api.emailjs.com/api/v1.0/email/send",
      {
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_USER_ID,
        template_params: {
          to_email: to,
          subject: subject,
          message: message,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Email sent successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending email:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Schedules a payment reminder using Upstash QStash.
 * NOTE: For testing, adjust reminderTime as needed.
 */
export const schedulePaymentReminder = async (subscription) => {
  // For testing, you might want to trigger this immediately.
  const reminderTime = new Date(subscription.renewalDate);
  reminderTime.setDate(reminderTime.getDate() - 3); // 3 days before renewal
  // For immediate testing, you can override:
  // const reminderTime = new Date(Date.now() + 60 * 1000); // 1 minute from now

  try {
    await client.trigger({
      url: `${process.env.VPS_PUBLIC_IP}/api/workflow`,
      body: { subscriptionId: subscription._id },
      notBefore: reminderTime.toISOString(),
    });
    console.log('Workflow triggered successfully via QStash');
  } catch (error) {
    console.error('Failed to trigger workflow:', error.message);
  }
};

export const sendReminder = async (subscription) => {
  try {
    // IMPORTANT: Ensure that the subscription has a userEmail.
    // Either populate the user email when creating the subscription
    // or query the User model here to retrieve it.
    const message = `
      Hi there,
      
      This is a reminder that your subscription to ${subscription.name} is due for renewal on ${new Date(subscription.renewalDate).toDateString()}.
      
      Price: $${subscription.price.toFixed(2)}
      Frequency: ${subscription.frequency}
      
      Please ensure you have sufficient funds for the renewal.
      
      Thank you!
    `;

    await sendEmail({
      to: subscription.userEmail, // Ensure this field is present
      subject: `Reminder: ${subscription.name} Subscription Renewal`,
      message,
    });
    console.log(`Reminder email sent for subscription: ${subscription.name}`);
  } catch (error) {
    console.error(`Error sending reminder email: ${error.message}`);
    throw error;
  }
};
