const express = require('express');
const { validateCreateComplaint } = require('../validators/complaint.validator');
const { createComplaint, getComplaint, updateComplaint, removeComplaint, listComplaints } = require('../controllers/complaint.controllers');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, validateCreateComplaint, createComplaint);
router.get('/', protect, listComplaints);
router.get('/:id', protect, getComplaint);
router.put('/:id', protect, updateComplaint);
router.delete('/:id', protect, removeComplaint);

module.exports = router;
