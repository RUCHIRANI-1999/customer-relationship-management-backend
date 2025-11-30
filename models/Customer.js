// server/models/Customer.js
const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  lead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',
    unique: true // A lead can only become one customer
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  company: { type: String },
  address: { type: String },
  industry: { type: String },
  projectHistory: [{
    projectName: String,
    startDate: Date,
    endDate: Date,
    status: String,
    details: String,
  }],
  communicationLog: [{
    date: { type: Date, default: Date.now },
    type: { type: String, enum: ['Call', 'Email', 'Meeting', 'Other'] },
    notes: String,
    staff: String, // Who made the contact
  }],
  attachedDocuments: [{
    fileName: String,
    fileURL: String, // e.g., link to S3 or local storage path
    uploadedAt: { type: Date, default: Date.now },
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Customer', CustomerSchema);