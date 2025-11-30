const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// Customer Management
router.post('/', customerController.createCustomerFromLead); // Create customer (often from a converted lead)
router.get('/', customerController.getCustomers); // Get all customers
router.get('/:id', customerController.getCustomerById); // Get a single customer
router.put('/:id', customerController.updateCustomer); // Update customer details
router.delete('/:id', customerController.deleteCustomer); // Delete a customer

// Communication Log, Documents, Project History
router.post('/:id/communication', customerController.addCommunicationLog); // Add communication
router.post('/:id/document', customerController.addAttachedDocument); // Add document (needs file upload handling)
router.post('/:id/project', customerController.addProjectHistory); // Add project history

module.exports = router;