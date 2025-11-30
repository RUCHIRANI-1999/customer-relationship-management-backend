const Lead = require('../models/Lead');
const Customer = require('../models/Customer'); // Potentially needed for lead conversion

// @desc    Create a new lead
// @route   POST /api/leads
// @access  Private (add authentication later)
exports.createLead = async (req, res) => {
  try {
    const newLead = new Lead(req.body);
    const savedLead = await newLead.save();
    res.status(201).json(savedLead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private
exports.getLeads = async (req, res) => {
  try {
    const leads = await Lead.find();
    res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get lead by ID
// @route   GET /api/leads/:id
// @access  Private
exports.getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.status(200).json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update lead details
// @route   PUT /api/leads/:id
// @access  Private
exports.updateLead = async (req, res) => {
  try {
    const updatedLead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedLead) return res.status(404).json({ message: 'Lead not found' });
    res.status(200).json(updatedLead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a lead
// @route   DELETE /api/leads/:id
// @access  Private
exports.deleteLead = async (req, res) => {
  try {
    const deletedLead = await Lead.findByIdAndDelete(req.params.id);
    if (!deletedLead) return res.status(404).json({ message: 'Lead not found' });
    res.status(200).json({ message: 'Lead deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update lead status
// @route   PATCH /api/leads/:id/status
// @access  Private
exports.updateLeadStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    if (!['New', 'Contacted', 'Proposal Sent', 'Negotiation', 'Converted', 'Lost'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status provided' });
    }

    lead.status = status;
    await lead.save();

    // If status is 'Converted', potentially create a new customer
    if (status === 'Converted') {
      const existingCustomer = await Customer.findOne({ lead: lead._id });
      if (!existingCustomer) {
        const newCustomer = new Customer({
          lead: lead._id,
          firstName: lead.firstName,
          lastName: lead.lastName,
          email: lead.email,
          phone: lead.phone,
          company: lead.company,
          // You might want to copy other relevant lead fields to customer
        });
        await newCustomer.save();
        res.status(200).json({ message: 'Lead converted and customer created successfully', lead, customer: newCustomer });
      } else {
        res.status(200).json({ message: 'Lead status updated to Converted, customer already exists', lead });
      }
    } else {
      res.status(200).json({ message: 'Lead status updated successfully', lead });
    }

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update lead priority
// @route   PATCH /api/leads/:id/priority
// @access  Private
exports.updateLeadPriority = async (req, res) => {
  try {
    const { priority } = req.body;
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    if (!['Hot', 'Warm', 'Cold'].includes(priority)) {
      return res.status(400).json({ message: 'Invalid priority provided' });
    }

    lead.priority = priority;
    await lead.save();
    res.status(200).json({ message: 'Lead priority updated successfully', lead });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};