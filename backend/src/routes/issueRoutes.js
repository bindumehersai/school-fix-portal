const express = require('express');
const { body } = require('express-validator');
const { createIssue, getIssues, getIssue, updateIssue, deleteIssue } = require('../controllers/issueController');
const { protect, admin } = require('../middleware/auth');
const validate = require('../middleware/validate');
const upload = require('../config/multer');

const router = express.Router();

router
  .route('/')
  .get(protect, getIssues)
  .post(
    protect,
    upload.single('image'),
    [
      body('title').trim().notEmpty().withMessage('Title is required'),
      body('description').trim().notEmpty().withMessage('Description is required'),
      body('category').isIn(['Furniture', 'Electrical', 'Plumbing', 'Building', 'Sanitation', 'Playground']),
      body('priority').isIn(['Low', 'Medium', 'High', 'Emergency']),
      body('location').trim().notEmpty().withMessage('Location is required'),
    ],
    validate,
    createIssue
  );

router
  .route('/:id')
  .get(protect, getIssue)
  .put(protect, updateIssue)
  .delete(protect, deleteIssue);

module.exports = router;
