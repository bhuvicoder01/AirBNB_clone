const bookingModel = require('../models/Booking');
const propertyModel = require('../models/Property');
const reviewModel = require('../models/Review');
const userModel = require('../models/User');

class ReviewController {

    static getReviewsByProperty=async(req, res)=> {
        try {
            const { propertyId } = req.params;
            const reviews = await reviewModel.find({ propertyId });
            if (!reviews || reviews.length === 0) {
                return res.status(404).json({ message: 'No reviews found for this property' });
            }
            

            const reviewData = reviews.map(review => ({
                _id: review._id,
                userAvatar: review.userAvatar,
                userName: review.userName,
                rating: review.rating,
                comment: review.comment,
                hostResponse: review.hostResponse,
                createdAt: review.createdAt
            }));
            res.status(200).json(reviewData);
        } catch (error) {
            res.status(500).json({ message: 'Server Error', error });
        }
    }

    static addReview=async(req, res)=> {
        try {
            const { propertyId, userId, rating, comment } = req.body;

            const booking=await bookingModel.findOne({propertyId,userId,status:'confirmed'});
            if(!booking){
                return  res.status(400).json({ message: 'User has not completed a booking for this property' });
            }
            
            const newReview = new reviewModel({ propertyId, userId, rating, comment });
            const user=await userModel.findById(userId);
            newReview.userName=user.firstName+' '+user.lastName;
            newReview.userAvatar=user.avatar.url;
            await newReview.save();
            res.status(201).json(newReview);
            const aggregatedReviews = await reviewModel.aggregate([
                { $match: { propertyId: newReview.propertyId } },
                { $group: {
                    _id: '$propertyId',
                    averageRating: { $avg: '$rating' },
                    totalReviews: { $sum: 1 }
                }}
            ]);
            await propertyModel.findByIdAndUpdate(propertyId, {
                "rating.overall": aggregatedReviews[0]?.averageRating.toFixed(2) || 0,
                "reviews_count": aggregatedReviews[0]?.totalReviews || 0
            });
            console.log(aggregatedReviews);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error', error });
        }
    }

    static respondToReview=async(req, res)=> {
        try {
            const { reviewId } = req.params;
            const { hostResponse } = req.body;
            if (!hostResponse) {
                return res.status(400).json({ message: 'Host response is required' });
            }
            if (!reviewId) {
                return res.status(400).json({ message: 'Review ID is required' });
            }
            const { hostId } = req.params;
            if (!hostId) {
                return res.status(400).json({ message: 'Host ID is required' });
            }
           const review = await reviewModel.findByIdAndUpdate(reviewId, { hostResponse,hostResponseDate: new Date() });
            res.status(200).json(review);
        } catch (error) {
            res.status(500).json({ message: 'Server Error', error });
        }
    }
    static deleteHostResponse=async(req, res)=> {
        try {
            const { reviewId } = req.params;
            if (!reviewId) {
                return res.status(400).json({ message: 'Review ID is required' });
            }
            const { hostId } = req.params;
            if (!hostId) {
                return res.status(400).json({ message: 'Host ID is required' });
            }
            const review = await reviewModel.findByIdAndUpdate(reviewId, { hostResponse: null, hostResponseDate: null });
            res.status(200).json(review);
        } catch (error) {
            res.status(500).json({ message: 'Server Error', error });
        }
    }
}

module.exports = ReviewController;