// models/Subscription.js
import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    frequency: { type: String, enum: ['monthly', 'yearly'], required: true },
    renewalDate: { type: Date, required: true },
    // Reference to the user owning this subscription
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userEmail: { type: String },
  },
  { timestamps: true }
);

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;
