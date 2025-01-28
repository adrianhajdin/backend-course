const axios = require("axios");

const sendEmail = async ({ to, subject, message }) => {
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

module.exports = { sendEmail };
