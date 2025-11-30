const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');

// Lead Capture
router.post('/', leadController.createLead); // Add lead manually or via form
router.get('/', leadController.getLeads); // Get all leads
router.get('/:id', leadController.getLeadById); // Get a single lead
router.put('/:id', leadController.updateLead); // Update lead details
router.delete('/:id', leadController.deleteLead); // Delete a lead

// Lead Scoring & Status Tracking
router.patch('/:id/status', leadController.updateLeadStatus); // Update lead status
router.patch('/:id/priority', leadController.updateLeadPriority); // Update lead priority

module.exports = router;