const express = require('express');
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');
const wishlistController = require('../controllers/wishListController');
// const upload = require('../middleware/upload');
const router = express.Router();
const {upload,getUploadUrl} =require('../services/s3')


// Protect all routes below with auth middleware if required
// Example: router.use(auth);

//admin api endpoints
router.get('/admin/get-users', userController.getAllUsers);
router.delete('/admin/delete-user/:id', userController.deleteUser);


//get User profile
router.get('/"id/profile',userController.getUser)

// Get wishlist for a user (could validate if this is the logged-in user)
router.get('/:id/wishlist', wishlistController.getUsersWishList);

// Add an item to wishlist
router.post('/wishlist',  wishlistController.add);

// Remove an item from wishlist by wishlist item ID
router.delete('/:userId/wishlist/:propertyId',  wishlistController.remove);

// Update user profile
router.put('/:id/profile',upload.single('avatar'), userController.updateProfile);

//apply for host
router.post('/:id/apply-host', userController.applyHost);

module.exports = router;
