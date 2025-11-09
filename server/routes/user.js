const express = require('express');
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');
const wishlistController = require('../controllers/wishListController');

const router = express.Router();

// Protect all routes below with auth middleware if required
// Example: router.use(auth);

// Get wishlist for a user (could validate if this is the logged-in user)
router.get('/:id/wishlist', wishlistController.getUsersWishList);

// Add an item to wishlist
router.post('/wishlist',  wishlistController.add);

// Remove an item from wishlist by wishlist item ID
router.delete('/:userId/wishlist/:propertyId',  wishlistController.remove);

// Update user profile
router.put('/profile',  userController.updateProfile);

module.exports = router;
