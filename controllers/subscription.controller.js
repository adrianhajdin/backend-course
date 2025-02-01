// controllers/subscription.controller.js
import mongoose from 'mongoose';
import Subscription from '../models/Subscription.js';

// Helper function to insure the user is the subscription owner
const isOwner = (subscription, userId) => subscription.user.toString() === userId;

// Helper function to fetch a subscription without auth check.
// Used by the workflow controller.
export const findSubscriptionById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(`Invalid subscription ID: ${id}`);
  }
  const subscription = await Subscription.findById(id);
  if (!subscription) {
    throw new Error('Subscription not found');
  }
  return subscription;
};

// GET subscription by ID (with auth check)
export const getSubscriptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await findSubscriptionById(id);
    // Ensure that the authenticated user owns the subscription
    if (!isOwner(subscription, req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.status(200).json(subscription);
  } catch (error) {
    console.error('Error fetching subscription:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET all subscriptions for the authenticated user
export const getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ user: req.user.id });
    res.status(200).json(subscriptions);
  } catch (error) {
    console.error('Error fetching subscriptions:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST create a new subscription
export const addSubscription = async (req, res) => {
  const { name, price, frequency, renewalDate } = req.body;
  if (!name || !price || !frequency || !renewalDate) {
    return res.status(400).json({ message: 'Please fill all required fields' });
  }
  try {
    const subscription = new Subscription({
      name,
      price,
      frequency,
      renewalDate,
      user: req.user.id,
      userEmail: req.user.email,
    });
    const savedSubscription = await subscription.save();
    res.status(201).json(savedSubscription);
  } catch (error) {
    console.error('Error adding subscription:', error.message);

    // Handle duplicate key errors (e.g., unique constraint violations)
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Subscription with this name already exists for the user.' });
    }

    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PUT update an existing subscription
export const updateSubscription = async (req, res) => {
  const { id } = req.params;
  const { name, price, frequency, renewalDate } = req.body;
  try {
    const subscription = await Subscription.findById(id);
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    if (!isOwner(subscription, req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (name) subscription.name = name;
    if (price) subscription.price = price;
    if (frequency) subscription.frequency = frequency;
    if (renewalDate) subscription.renewalDate = renewalDate;

    const updatedSubscription = await subscription.save();
    res.status(200).json(updatedSubscription);
  } catch (error) {
    console.error('Error updating subscription:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE a subscription
export const deleteSubscription = async (req, res) => {
  const { id } = req.params;
  try {
    const subscription = await Subscription.findById(id);
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    if (!isOwner(subscription, req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    await subscription.deleteOne();
    res.status(200).json({ message: 'Subscription deleted' });
  } catch (error) {
    console.error('Error deleting subscription:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
