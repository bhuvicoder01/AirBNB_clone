const express = require('express');
const propertyController = require('../controllers/propertyController');
const {upload,getUploadUrl} =require('../services/s3')


const router = express.Router();

// Public routes
router.get('/', propertyController.getAll);
router.get('/search', propertyController.searchProperties);
router.get('/:id', propertyController.getById);
router.post('/:id/review', propertyController.addReview);

// Host routes (protected)
// router.use(auth); // Apply auth middleware to all routes below
router.post('/create', upload.array('images', 10), propertyController.create);
router.get('/host/properties', propertyController.getHostProperties);
router.put('/:id', upload.array('images',10),propertyController.updateProperty);
router.patch('/:id/toggle-status', propertyController.togglePropertyStatus);
router.delete('/:id', propertyController.deleteProperty);

router.get("/api/s3/upload-url", getUploadUrl);

module.exports = router;