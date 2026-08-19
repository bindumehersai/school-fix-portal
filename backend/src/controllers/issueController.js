const Issue = require('../models/Issue');
const Notification = require('../models/Notification');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// ============================================================
// POST /api/issues
// Create a new issue
// ============================================================
const createIssue = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    category,
    priority,
    location,
  } = req.body;

  const image = req.file ? req.file.path : '';

  const issue = await Issue.create({
    title,
    description,
    category,
    priority,
    location,
    image,
    reportedBy: req.user._id,
  });

  // Populate reporter details
  await issue.populate(
    'reportedBy',
    'name email role'
  );

  // ----------------------------------------------------------
  // Notify all admins about the new issue
  // ----------------------------------------------------------
  const admins = await User.find({
    role: 'admin',
  });

  if (admins.length > 0) {
    await Notification.insertMany(
      admins.map((admin) => ({
        user: admin._id,
        message: `New ${priority} priority issue reported: ${title}`,
        type: 'issue',
        relatedIssue: issue._id,
      }))
    );
  }

  res.status(201).json(issue);
});


// ============================================================
// GET /api/issues
// Get ALL issues
//
// IMPORTANT:
// Every authenticated user can see all reported issues.
// This is used by the "All Issues" page and Dashboard.
// ============================================================
const getIssues = asyncHandler(async (req, res) => {
  const {
    status,
    priority,
    category,
    search,
  } = req.query;

  const query = {};

  // ----------------------------------------------------------
  // Filter by status
  // ----------------------------------------------------------
  if (status) {
    query.status = status;
  }

  // ----------------------------------------------------------
  // Filter by priority
  // ----------------------------------------------------------
  if (priority) {
    query.priority = priority;
  }

  // ----------------------------------------------------------
  // Filter by category
  // ----------------------------------------------------------
  if (category) {
    query.category = category;
  }

  // ----------------------------------------------------------
  // Search by title, description, or location
  // ----------------------------------------------------------
  if (search) {
    query.$or = [
      {
        title: {
          $regex: search,
          $options: 'i',
        },
      },
      {
        description: {
          $regex: search,
          $options: 'i',
        },
      },
      {
        location: {
          $regex: search,
          $options: 'i',
        },
      },
    ];
  }

  // ----------------------------------------------------------
  // IMPORTANT:
  //
  // Do NOT add:
  //
  // query.reportedBy = req.user._id;
  //
  // because this endpoint is for ALL issues.
  // ----------------------------------------------------------
  const issues = await Issue.find(query)
    .populate(
      'reportedBy',
      'name email role'
    )
    .sort({
      createdAt: -1,
    });

  res.status(200).json(issues);
});


// ============================================================
// GET /api/issues/:id
// Get a single issue
//
// Any authenticated user can view any issue.
// ============================================================
const getIssue = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(
    req.params.id
  ).populate(
    'reportedBy',
    'name email role'
  );

  if (!issue) {
    res.status(404);
    throw new Error('Issue not found');
  }

  // All authenticated users are allowed
  // to view issue details.

  res.status(200).json(issue);
});


// ============================================================
// PUT /api/issues/:id
// Update an issue
//
// ADMIN:
//   - Can update any issue
//   - Can change status
//   - Can assign issue
//   - Can change priority
//   - Can edit title/description
//
// TEACHER / PARENT:
//   - Can edit only their own issue
//   - Can edit title/description
//   - Cannot change status/assignment/priority
// ============================================================
const updateIssue = asyncHandler(async (req, res) => {
  const {
    status,
    assignedTo,
    priority,
    title,
    description,
  } = req.body;

  const issue = await Issue.findById(
    req.params.id
  );

  if (!issue) {
    res.status(404);
    throw new Error('Issue not found');
  }

  const oldStatus = issue.status;

  // ==========================================================
  // ADMIN UPDATE
  // ==========================================================
  if (req.user.role === 'admin') {

    // --------------------------------------------------------
    // Change status
    // --------------------------------------------------------
    if (
      status &&
      status !== issue.status
    ) {
      issue.status = status;

      // Add status change to timeline
      issue.timeline.push({
        status: status,
        changedAt: new Date(),
        note: `Status changed to ${status}`,
      });
    }

    // --------------------------------------------------------
    // Assign issue
    // --------------------------------------------------------
    if (assignedTo !== undefined) {
      issue.assignedTo = assignedTo;
    }

    // --------------------------------------------------------
    // Change priority
    // --------------------------------------------------------
    if (priority) {
      issue.priority = priority;
    }

    // --------------------------------------------------------
    // Change title
    // --------------------------------------------------------
    if (title) {
      issue.title = title;
    }

    // --------------------------------------------------------
    // Change description
    // --------------------------------------------------------
    if (description) {
      issue.description = description;
    }
  }

  // ==========================================================
  // TEACHER / PARENT UPDATE
  // ==========================================================
  else {

    // Only the person who reported the issue
    // can edit it.
    if (
      issue.reportedBy.toString() !==
      req.user._id.toString()
    ) {
      res.status(403);
      throw new Error(
        'Not authorized to update this issue'
      );
    }

    // Teachers and parents can edit
    // only title and description.
    if (title) {
      issue.title = title;
    }

    if (description) {
      issue.description = description;
    }
  }

  // Save changes
  const updatedIssue = await issue.save();

  // Populate reporter details
  await updatedIssue.populate(
    'reportedBy',
    'name email role'
  );

  // ==========================================================
  // STATUS CHANGE NOTIFICATION
  // ==========================================================
  if (
    req.user.role === 'admin' &&
    status &&
    status !== oldStatus
  ) {
    // Get reporter ID safely
    const reporterId =
      updatedIssue.reportedBy._id ||
      updatedIssue.reportedBy;

    await Notification.create({
      user: reporterId,
      message: `Your issue "${updatedIssue.title}" status updated to ${status}`,
      type: 'status',
      relatedIssue: updatedIssue._id,
    });
  }

  res.status(200).json(updatedIssue);
});


// ============================================================
// DELETE /api/issues/:id
// Delete an issue
//
// ADMIN:
//   Can delete any issue.
//
// TEACHER / PARENT:
//   Can delete only their own issue.
// ============================================================
const deleteIssue = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(
    req.params.id
  );

  if (!issue) {
    res.status(404);
    throw new Error('Issue not found');
  }

  // ----------------------------------------------------------
  // Non-admin users can delete only their own issue
  // ----------------------------------------------------------
  if (
    req.user.role !== 'admin' &&
    issue.reportedBy.toString() !==
      req.user._id.toString()
  ) {
    res.status(403);
    throw new Error(
      'Not authorized to delete this issue'
    );
  }

  await issue.deleteOne();

  res.status(200).json({
    message: 'Issue removed',
  });
});


// ============================================================
// EXPORT CONTROLLERS
// ============================================================
module.exports = {
  createIssue,
  getIssues,
  getIssue,
  updateIssue,
  deleteIssue,
};