// Seed script: creates demo admin + sample issues for local development
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Issue = require('../models/Issue');

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected. Seeding...');

  await User.deleteMany({});
  await Issue.deleteMany({});

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@school.edu',
    password: 'password123',
    role: 'admin',
    schoolId: 'SCH-001',
  });

  const teacher = await User.create({
    name: 'Jane Teacher',
    email: 'teacher@school.edu',
    password: 'password123',
    role: 'teacher',
    schoolId: 'SCH-001',
  });

  const parent = await User.create({
    name: 'John Parent',
    email: 'parent@school.edu',
    password: 'password123',
    role: 'parent',
    schoolId: 'SCH-001',
  });

  const categories = ['Furniture', 'Electrical', 'Plumbing', 'Building', 'Sanitation', 'Playground'];
  const priorities = ['Low', 'Medium', 'High', 'Emergency'];
  const statuses = ['Pending', 'Assigned', 'In Progress', 'Resolved'];

  const issues = [];
  for (let i = 0; i < 12; i++) {
    issues.push({
      title: `Issue #${i + 1}: ${categories[i % categories.length]} problem in room ${100 + i}`,
      description: `Detailed description of issue number ${i + 1}. This needs attention from the facilities team.`,
      category: categories[i % categories.length],
      priority: priorities[i % priorities.length],
      location: `Room ${100 + i}, Building A`,
      status: statuses[i % statuses.length],
      reportedBy: i % 2 === 0 ? teacher._id : parent._id,
    });
  }
  await Issue.insertMany(issues);

  console.log('Seeded admin: admin@school.edu / password123');
  console.log('Seeded teacher: teacher@school.edu / password123');
  console.log('Seeded parent: parent@school.edu / password123');
  process.exit(0);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
