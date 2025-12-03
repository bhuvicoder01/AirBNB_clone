import { createContext, useContext, useEffect, useState } from "react";
import { reviewAPI } from "../services/api";


const ReviewContext = createContext();    

export const useReview = () => {
  const context = useContext(ReviewContext);
    if (!context) {
    throw new Error('useReview must be used within ReviewProvider');
  }
  return context;
};  


export const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  


    const getReviewsByPropertyId = async (propertyId) => {
        try {
            // Fetch reviews from API
            const response = await reviewAPI.getByProperty(propertyId);
            setReviews(response.data.reviews);
            setLoading(false);
            return response.data;
        } catch (error) {
          console.error('Error fetching reviews:', error);
        }
    };

    const addReview = async (reviewData) => {
        try {
            const response = await reviewAPI.create(reviewData);
            setReviews(prevReviews => [...prevReviews, response.data.review]);
            return response.data||[];
        } catch (error) {
            console.error('Error adding review:', error);
        }
    };
    const deleteReview = async (reviewId) => {
        try {
            await reviewAPI.delete(reviewId);
            setReviews(prevReviews => prevReviews.filter(review => review.id !== reviewId));
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    const addHostResponse = async (reviewId,hostId, responseData) => {
        try {
            const response = await reviewAPI.update(reviewId, hostId, responseData);
            return response.data;
        } catch (error) {
            console.error('Error adding host response:', error);
        }
    };

    const deleteHostResponse = async (reviewId,hostId) => {
        try {
           const response = await reviewAPI.deleteHostResponse(reviewId, hostId);
            
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    



    const value = {
        reviews,
        loading,
        getReviewsByPropertyId,
        addReview,
        deleteReview,
        addHostResponse,
        deleteHostResponse
    };

    return (
      <ReviewContext.Provider value={value}>
        {children}
      </ReviewContext.Provider>
    );
}