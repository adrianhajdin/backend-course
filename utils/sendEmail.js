import axios from "axios";


import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { Client } = require('@upstash/workflow');

const client = new Client({ token: process.env.QSTASH_TOKEN });

export const sendEmail = async ({ to, subject, message }) => {
  try {
    const response = await axios.post(
      "https://api.emailjs.com/api/v1.0/email/send", // EmailJS REST API endpoint
      {
        service_id: process.env.EMAILJS_SERVICE_ID, // Your EmailJS service ID
        template_id: process.env.EMAILJS_TEMPLATE_ID, // Your EmailJS template ID
        user_id: process.env.EMAILJS_USER_ID, // Your public key from EmailJS
        template_params: {
          to_email: to, // Match variable in your EmailJS template
          subject: subject, // Match variable in your EmailJS template
          message: message, // Match variable in your EmailJS template
        },
      },
      {
        headers: {
          "Content-Type": "application/json", // Required header for the API
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

export const schedulePaymentReminder = async (subscription) => {
  const reminderTime = new Date(subscription.renewalDate);
  reminderTime.setDate(reminderTime.getDate() - 3); // 3 days before renewal

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
    const message = `
      Hi there,
      
      This is a reminder that your subscription to ${subscription.name} is due for renewal on ${subscription.renewalDate.toDateString()}.
      
      Price: $${subscription.price.toFixed(2)}
      Frequency: ${subscription.frequency}
      
      Please ensure you have sufficient funds for the renewal. 
      
      Thank you!
    `;

    await sendEmail({
      to: subscription.userEmail,
      subject: `Reminder: ${subscription.name} Subscription Renewal`,
      message,
    });
    console.log(`Reminder email sent for subscription: ${subscription.name}`);
  } catch (error) {
    console.error(`Error sending reminder email: ${error.message}`);
    throw error;
  }
};
