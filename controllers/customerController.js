const Customer = require('../models/Customer');
const Lead = require('../models/Lead');

// @desc    Create a new customer (often converted from a lead)
// @route   POST /api/customers
// @access  Private
exports.createCustomerFromLead = async (req, res) => {
  try {
    const { leadId, ...customerData } = req.body;
    if (leadId) {
      const lead = await Lead.findById(leadId);
      if (!lead) return res.status(404).json({ message: 'Associated lead not found' });
      const existingCustomer = await Customer.findOne({ lead: leadId });
      if (existingCustomer) return res.status(400).json({ message: 'This lead has already been converted to a customer.' });

      const newCustomer = new Customer({
        lead: leadId,
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        ...customerData // Allow overriding or adding more customer-specific data
      });
      const savedCustomer = await newCustomer.save();

      // Optionally update lead status to 'Converted' if not already
      if (lead.status !== 'Converted') {
        lead.status = 'Converted';
        await lead.save();
      }
      res.status(201).json(savedCustomer);
    } else {
      // Allow creating a customer without a linked lead (e.g., existing client)
      const newCustomer = new Customer(customerData);
      const savedCustomer = await newCustomer.save();
      res.status(201).json(savedCustomer);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private
exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().populate('lead', 'firstName lastName email status'); // Populate lead data
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get customer by ID
// @route   GET /api/customers/:id
// @access  Private
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).populate('lead');
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update customer details
// @route   PUT /api/customers/:id
// @access  Private
exports.updateCustomer = async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCustomer) return res.status(404).json({ message: 'Customer not found' });
    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a customer
// @route   DELETE /api/customers/:id
// @access  Private
exports.deleteCustomer = async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
    if (!deletedCustomer) return res.status(404).json({ message: 'Customer not found' });
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a communication log entry to a customer
// @route   POST /api/customers/:id/communication
// @access  Private
exports.addCommunicationLog = async (req, res) => {
  try {
    const { type, notes, staff } = req.body;
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    customer.communicationLog.push({ type, notes, staff });
    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Add an attached document to a customer
// @route   POST /api/customers/:id/document
// @access  Private (Needs file upload middleware like Multer)
exports.addAttachedDocument = async (req, res) => {
  // This is a placeholder. Real implementation requires file upload handling (e.g., Multer, Cloudinary, S3)
  try {
    const { fileName, fileURL } = req.body; // In a real app, fileURL would come from the upload service
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    customer.attachedDocuments.push({ fileName, fileURL });
    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Add a project history entry to a customer
// @route   POST /api/customers/:id/project
// @access  Private
exports.addProjectHistory = async (req, res) => {
  try {
    const { projectName, startDate, endDate, status, details } = req.body;
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    customer.projectHistory.push({ projectName, startDate, endDate, status, details });
    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};