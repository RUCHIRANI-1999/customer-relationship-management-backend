// server/controllers/followUpController.js
const FollowUpTask = require('../models/FollowUpTask');
const Lead = require('../models/Lead');
const Customer = require('../models/Customer');

// @desc    Get all follow-up tasks
// @route   GET /api/followups
// @access  Private
exports.getFollowUpTasks = async (req, res) => {
  try {
    // Filter by assignedTo if authentication is implemented
    const tasks = await FollowUpTask.find({})
      .populate('lead', 'firstName lastName email')
      .populate('customer', 'firstName lastName email');
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single follow-up task by ID
// @route   GET /api/followups/:id
// @access  Private
exports.getFollowUpTaskById = async (req, res) => {
  try {
    const task = await FollowUpTask.findById(req.params.id)
      .populate('lead', 'firstName lastName email')
      .populate('customer', 'firstName lastName email');
    if (!task) {
      return res.status(404).json({ message: 'Follow-up task not found' });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new follow-up task
// @route   POST /api/followups
// @access  Private
exports.createFollowUpTask = async (req, res) => {
  const { title, description, assignedTo, dueDate, status, priority, lead, customer } = req.body;

  if (!title || !assignedTo || !dueDate) {
    return res.status(400).json({ message: 'Title, assignedTo, and dueDate are required.' });
  }
  if (!lead && !customer) {
    return res.status(400).json({ message: 'Follow-up task must be associated with either a Lead or a Customer.' });
  }

  try {
    // Optional: Validate lead/customer existence if provided
    if (lead) {
      const existingLead = await Lead.findById(lead);
      if (!existingLead) return res.status(404).json({ message: 'Associated lead not found.' });
    }
    if (customer) {
      const existingCustomer = await Customer.findById(customer);
      if (!existingCustomer) return res.status(404).json({ message: 'Associated customer not found.' });
    }


    const newTask = new FollowUpTask({
      title,
      description,
      assignedTo,
      dueDate,
      status,
      priority,
      lead,
      customer,
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a follow-up task
// @route   PUT /api/followups/:id
// @access  Private
exports.updateFollowUpTask = async (req, res) => {
  try {
    const { status, ...updateData } = req.body;
    const task = await FollowUpTask.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Follow-up task not found' });
    }

    // If status is changed to 'Completed', set completedAt
    if (status && status === 'Completed' && !task.completedAt) {
      updateData.completedAt = Date.now();
    } else if (status && status !== 'Completed' && task.completedAt) {
      // If status is changed from 'Completed', clear completedAt
      updateData.completedAt = null;
    }

    const updatedTask = await FollowUpTask.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a follow-up task
// @route   DELETE /api/followups/:id
// @access  Private
exports.deleteFollowUpTask = async (req, res) => {
  try {
    const deletedTask = await FollowUpTask.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ message: 'Follow-up task not found' });
    }
    res.status(200).json({ message: 'Follow-up task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get follow-up tasks for a specific lead
// @route   GET /api/leads/:leadId/followups
// @access  Private
exports.getFollowUpTasksForLead = async (req, res) => {
  try {
    const tasks = await FollowUpTask.find({ lead: req.params.leadId })
      .populate('lead', 'firstName lastName email')
      .populate('customer', 'firstName lastName email');
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get follow-up tasks for a specific customer
// @route   GET /api/customers/:customerId/followups
// @access  Private
exports.getFollowUpTasksForCustomer = async (req, res) => {
  try {
    const tasks = await FollowUpTask.find({ customer: req.params.customerId })
      .populate('lead', 'firstName lastName email')
      .populate('customer', 'firstName lastName email');
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};