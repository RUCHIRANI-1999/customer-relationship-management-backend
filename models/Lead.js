// server/models/Lead.js
const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  company: { type: String },
  source: { type: String, enum: ['Website Form', 'Manual', 'Email Inquiry', 'Ad Campaign', 'Other'], default: 'Manual' },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Proposal Sent', 'Negotiation', 'Converted', 'Lost'],
    default: 'New'
  },
  priority: {
    type: String,
    enum: ['Hot', 'Warm', 'Cold'],
    default: 'Cold'
  },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true }); // Mongoose will add createdAt and updatedAt

module.exports = mongoose.model('Lead', LeadSchema);