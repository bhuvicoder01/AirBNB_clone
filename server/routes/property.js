const express = require('express');
const multer = require('multer');
const path = require('path');
const propertyController = require('../controllers/propertyController');
const auth = require('../middleware/auth');
const cloudinary = require('../services/cloudinary');

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

const router = express.Router();

// Public routes
router.get('/', propertyController.getAll);
router.get('/search', propertyController.searchProperties);
router.get('/:id', propertyController.getById);

// Host routes (protected)
// router.use(auth); // Apply auth middleware to all routes below
router.post('/create', upload.array('images', 10), propertyController.create);
router.get('/host/properties', propertyController.getHostProperties);
router.get('/host/:hostId/properties', propertyController.getHostProperties);
router.put('/:id', upload.array('images',10),propertyController.updateProperty);
router.patch('/:id/toggle-status', propertyController.togglePropertyStatus);
router.delete('/:id', propertyController.deleteProperty);

module.exports = router;