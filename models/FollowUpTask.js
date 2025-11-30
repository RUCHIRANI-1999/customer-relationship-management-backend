// server/models/FollowUpTask.js
const mongoose = require('mongoose');

const FollowUpTaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: false,
  },
  assignedTo: {
    type: String, // Could be a User ID later if authentication is implemented
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Canceled'],
    default: 'Pending',
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium',
  },
  // Link to either a Lead or a Customer
  lead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',
    required: false, // Not required if linked to a customer
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: false, // Not required if linked to a lead
  },
  // Ensure that at least one of lead or customer is provided
  // Custom validator for this
  // This can be done in pre-save hook or in controller
  createdAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
  },
});

// Custom validation to ensure a task is linked to either a lead or a customer
FollowUpTaskSchema.pre('validate', function(next) {
  if (!this.lead && !this.customer) {
    this.invalidate('lead', 'Follow-up task must be associated with either a Lead or a Customer.', this.lead);
    this.invalidate('customer', 'Follow-up task must be associated with either a Lead or a Customer.', this.customer);
  }
  next();
});


module.exports = mongoose.model('FollowUpTask', FollowUpTaskSchema);