const Subscription = require("../models/Subscription");
const { Client } = require("@upstash/workflow");
const {sendEmail} = require("../utils/sendEmail");
const mongoose = require("mongoose");

const client = new Client({ token: process.env.QSTASH_TOKEN });

const schedulePaymentReminder = async (subscription) => {
  const reminderTime = new Date(subscription.renewalDate);
  reminderTime.setDate(reminderTime.getDate() - 3); // 3 days before renewal

  try {
    await client.trigger({
      url: 'https://your-api-domain.com/api/workflow',
      body: { subscriptionId: subscription._id },
      notBefore: reminderTime.toISOString(),
    });
    console.log('Workflow triggered successfully via QStash');
  } catch (error) {
    console.error('Failed to trigger workflow:', error.message);
  }
};


const getSubscriptionById = async (id) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error(`Invalid subscription ID: ${id}`);
    }

    const subscription = await Subscription.findById(id).exec();
    if (!subscription) {
      throw new Error("Subscription not found");
    }

    return subscription;
  } catch (error) {
    console.error(`Error fetching subscription by ID: ${error.message}`);
    throw error;
  }
};
const sendReminder = async (subscription) => {
  try {
    const message = `
      Hi there,
      
      This is a reminder that your subscription to ${subscription.name} is due for renewal on ${subscription.renewalDate.toDateString()}.
      
      Category: ${subscription.category}
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

const getSubscriptions = async (req, res) => {
  try {
    const mockUserId = "64d64c29fa23ec2f4a2b54d1"; // Replace with a valid ObjectId from your database

    const subscriptions = await Subscription.find({ user: mockUserId}).populate("category");
    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const addSubscription = async (req, res) => {
  const { name, price, frequency, renewalDate, category } = req.body;

  if (!name || !price || !frequency || !renewalDate) {
    return res.status(400).json({ message: "Please fill all required fields" });
  }

  try {
    const subscription = new Subscription({
      name,
      price,
      frequency,
      renewalDate,
      category: "64d64c29fa23ec2f4a2b54d2", // Replace with a valid ObjectId for category
      user: "64d64c29fa23ec2f4a2b54d1", // Replace with a valid ObjectId for user // Assuming JWT middleware adds `req.user`
    });

    const savedSubscription = await subscription.save();
    res.status(201).json(savedSubscription);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateSubscription = async (req, res) => {
  const { id } = req.params;
  const { name, price, frequency, renewalDate, category } = req.body;

  try {
    const subscription = await Subscription.findById(id);

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    if (subscription.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    subscription.name = name || subscription.name;
    subscription.price = price || subscription.price;
    subscription.frequency = frequency || subscription.frequency;
    subscription.renewalDate = renewalDate || subscription.renewalDate;
    subscription.category = category || subscription.category;

    const updatedSubscription = await subscription.save();
    res.status(200).json(updatedSubscription);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteSubscription = async (req, res) => {
  const { id } = req.params;

  try {
    const subscription = await Subscription.findById(id);

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    if (subscription.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await subscription.remove();
    res.status(200).json({ message: "Subscription deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getSubscriptionById,
  sendReminder,
  schedulePaymentReminder,
  getSubscriptions,
  addSubscription,
  updateSubscription,
  deleteSubscription,
};
