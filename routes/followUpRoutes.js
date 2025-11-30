// server/routes/followUpRoutes.js
const express = require('express');
const {
  getFollowUpTasks,
  getFollowUpTaskById,
  createFollowUpTask,
  updateFollowUpTask,
  deleteFollowUpTask,
  getFollowUpTasksForLead, // Added
  getFollowUpTasksForCustomer // Added
} = require('../controllers/followUpController');
const router = express.Router();

// General follow-up task routes
router.route('/')
  .get(getFollowUpTasks)
  .post(createFollowUpTask);

router.route('/:id')
  .get(getFollowUpTaskById)
  .put(updateFollowUpTask)
  .delete(deleteFollowUpTask);

// Specific routes for tasks associated with leads/customers
router.route('/lead/:leadId') // Changed from /api/leads/:leadId/followups for clarity in routing
  .get(getFollowUpTasksForLead);

router.route('/customer/:customerId') // Changed from /api/customers/:customerId/followups
  .get(getFollowUpTasksForCustomer);

module.exports = router;