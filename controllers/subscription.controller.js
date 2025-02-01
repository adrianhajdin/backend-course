import mongoose from "mongoose";
import Subscription from "../models/Subscription.js";

import { schedulePaymentReminder} from '../utils/sendEmail.js'

// Helper for internal use (workflow, etc.) – does not perform auth check.
export const findSubscriptionById = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error(`Invalid subscription ID: ${id}`);
    }
    const subscription = await Subscription.findById(id);
    if (!subscription) {
      throw new Error("Subscription not found");
    }
    return subscription;
  } catch (error) {
    console.error(`Error fetching subscription by ID: ${error.message}`);
    throw error;
  }
};

// Express route version that includes authorization.
export const getSubscriptionById = async (req, res) => {
  const { id } = req.params;
  try {
    const subscription = await findSubscriptionById(id);
    if (subscription.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    return res.status(200).json(subscription);
  } catch (error) {
    console.error(`Error fetching subscription: ${error.message}`);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ user: req.user.id });
    return res.status(200).json(subscriptions);
  } catch (error) {
    console.error(`Error fetching subscriptions: ${error.message}`);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const addSubscription = async (req, res) => {
  const { name, price, frequency, renewalDate } = req.body;
  if (!name || !price || !frequency || !renewalDate) {
    return res.status(400).json({ message: "Please fill all required fields" });
  }
  try {
    const subscription = new Subscription({
      name,
      price,
      frequency,
      renewalDate,
      user: req.user.id,
      // NOTE: Consider populating or storing the user's email here if needed for reminders.
      // e.g., userEmail: req.user.email,
    });
    const savedSubscription = await subscription.save();

    await schedulePaymentReminder(subscription);

    return res.status(201).json(savedSubscription);
  } catch (error) {
    console.error(`Error adding subscription: ${error.message}`);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateSubscription = async (req, res) => {
  const { id } = req.params;
  const { name, price, frequency, renewalDate } = req.body;
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
    const updatedSubscription = await subscription.save();
    return res.status(200).json(updatedSubscription);
  } catch (error) {
    console.error(`Error updating subscription: ${error.message}`);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteSubscription = async (req, res) => {
  const { id } = req.params;
  try {
    const subscription = await Subscription.findById(id);
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }
    if (subscription.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    await subscription.deleteOne();
    return res.status(200).json({ message: "Subscription deleted" });
  } catch (error) {
    console.error(`Error deleting subscription: ${error.message}`);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
