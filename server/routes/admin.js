const express = require('express');
const {
  getDashboardStats,
  getUsers,
  updateUser,
  deleteUser,
  getAnimals,
  moveDogToShelter,
  createAdmin
} = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// All admin routes require admin authentication
router.use(adminAuth);

// Dashboard stats
router.get('/dashboard', getDashboardStats);

// User management
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.post('/create-admin', createAdmin);

// Animal management
router.get('/animals', getAnimals);
router.post('/dogs/:id/shelter', moveDogToShelter);

module.exports = router;
