// utils/sendEmail.js
import axios from 'axios';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { Client } = require('@upstash/workflow');

// Initialize Upstash client with QStash token
const client = new Client({ token: process.env.QSTASH_TOKEN });

// Sends an email via EmailJS REST API.
export const sendEmail = async ({ to, subject, message }) => {
  try {
    const response = await axios.post(
      'https://api.emailjs.com/api/v1.0/email/send',
      {
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_USER_ID,
        template_params: {
          to_email: to,
          subject,
          message,
        },
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    console.log('Email sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending email:', error.response?.data || error.message);
    throw error;
  }
};

// Schedules a payment reminder using Upstash QStash.
// For testing, you can override reminderTime to a near-future time.
export const schedulePaymentReminder = async (subscription) => {
  const reminderTime = new Date(subscription.renewalDate);
  reminderTime.setDate(reminderTime.getDate() - 3); // 3 days before renewal
  // For immediate testing, you might override as:
  // const reminderTime = new Date(Date.now() + 60000); // 1 minute later

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

// Sends a reminder email for a subscription.
export const sendReminder = async (subscription) => {
  try {
    const message = `
      Hi there,
      
      We hope you're doing well! This is a friendly reminder that your subscription to ${subscription.name} is coming up for renewal on ${new Date(
        subscription.renewalDate
      ).toDateString()}.
      
      Subscription Details:
      - Price: $${subscription.price.toFixed(2)}
      - Frequency: ${subscription.frequency}
    
      To ensure uninterrupted service, please make sure that your payment information is up to date and sufficient funds are available.

      Thank you for being a valued member, and we're here if you need any assistance.

      Best regards,
      JSM Team
    `;

    await sendEmail({
      to: subscription.userEmail,
      subject: `Renewal Reminder: Your Subscription is Due Soon`,
      message,
    });
    console.log(`Reminder email sent for subscription: ${subscription.name}`);
  } catch (error) {
    console.error(`Error sending reminder email: ${error.message}`);
    throw error;
  }
};
