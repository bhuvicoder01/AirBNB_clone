const express = require('express');
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');
const wishlistController = require('../controllers/wishListController');
// const upload = require('../middleware/upload');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configure multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            console.log('in upload fn')
            cb(null, true);
        } else {
            cb(new Error('Not an image! Please upload only images.'), false);
        }
    }
});
// Protect all routes below with auth middleware if required
// Example: router.use(auth);

// Get wishlist for a user (could validate if this is the logged-in user)
router.get('/:id/wishlist', wishlistController.getUsersWishList);

// Add an item to wishlist
router.post('/wishlist',  wishlistController.add);

// Remove an item from wishlist by wishlist item ID
router.delete('/:userId/wishlist/:propertyId',  wishlistController.remove);

// Update user profile
router.put('/:id/profile',upload.single('avatar'), userController.updateProfile);

module.exports = router;
