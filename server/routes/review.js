const ReviewController = require('../controllers/reviewController');

const router = require('express').Router();


//get reviews for a property
router.get('/property/:propertyId', ReviewController.getReviewsByProperty);

//add a new review
router.post('/', ReviewController.addReview);

//respond to a review
router.put('/:reviewId/host/:hostId/respond', ReviewController.respondToReview);
router.put('/:reviewId/host/:hostId/response/delete', ReviewController.deleteHostResponse);

module.exports = router;