const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['Furniture', 'Electrical', 'Plumbing', 'Building', 'Sanitation', 'Playground'],
      required: true,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Emergency'],
      required: true,
    },
    location: { type: String, required: [true, 'Location is required'], trim: true },
    image: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Pending', 'Assigned', 'In Progress', 'Resolved'],
      default: 'Pending',
    },
    assignedTo: { type: String, default: '' },
    timeline: [
      {
        status: { type: String },
        changedAt: { type: Date, default: Date.now },
        note: { type: String, default: '' },
      },
    ],
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

issueSchema.pre('save', function (next) {
  if (this.isNew) {
    this.timeline = [{ status: 'Pending', changedAt: new Date(), note: 'Issue reported' }];
  }
  next();
});

module.exports = mongoose.model('Issue', issueSchema);
