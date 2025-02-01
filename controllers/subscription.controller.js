import mongoose from "mongoose";

import Subscription from "../models/Subscription.js";

export const getSubscriptionById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: `Invalid subscription ID: ${id}` });
    }
    const subscription = await Subscription.findById(id);
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }
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
  const { name, price, frequency, renewalDate,  } = req.body;
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
    });
    const savedSubscription = await subscription.save();
    return res.status(201).json(savedSubscription);
  } catch (error) {
    console.error(`Error adding subscription: ${error.message}`);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateSubscription = async (req, res) => {
  const { id } = req.params;
  const { name, price, frequency, renewalDate, } = req.body;
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
