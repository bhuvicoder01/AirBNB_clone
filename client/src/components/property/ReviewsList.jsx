import React, { useState } from 'react';
import Modal from '../common/Modal';
import { reviewAPI } from '../../services/api';
import Button from '../common/Button';
import { useAuth } from '../../contexts/AuthContext';
import Toast from '../common/Toast';
import { useReview } from '../../contexts/ReviewContext';
import Loading from '../common/Loading';

// Mock reviews data
const mockReviews = [
  {
    id: 1,
    userName: 'Emily Chen',
    userAvatar: 'https://i.pravatar.cc/150?img=10',
    date: '2025-10-15',
    rating: 5,
    comment: 'Amazing place! The views were breathtaking and the host was very responsive. Would definitely stay here again.',
    hostResponse: 'Thank you for your kind words! We loved hosting you.'
  },
  {
    id: 2,
    userName: 'Michael Rodriguez',
    userAvatar: 'https://i.pravatar.cc/150?img=13',
    date: '2025-10-10',
    rating: 5,
    comment: 'Perfect location, spotlessly clean, and exactly as described. Highly recommend!',
    hostResponse: null
  },
  {
    id: 3,
    userName: 'Sarah Johnson',
    userAvatar: 'https://i.pravatar.cc/150?img=45',
    date: '2025-10-05',
    rating: 4,
    comment: 'Great stay overall. The property was beautiful but a bit far from downtown. Still worth it for the peace and quiet.',
    hostResponse: 'Thanks for your feedback! We appreciate your stay.'
  }
];

const ReviewsList = ({ propertyId, limit = 2 }) => {
  const [isLoading, setIsLoading] = useState(false);
  const {user,isAuthenticated} = useAuth();
  const [showAll, setShowAll] = useState(false);
  const [reviews,setReviews] = useState([]); 
  const displayReviews = showAll ? reviews : reviews?.slice(0, limit);
  const [reviewAnalytics,setReviewAnalytics] = useState(null); // TODO: Calculate actual analytics
  const [showReviewModal,setShowReviewModal]=useState(false);
  const [showToast,setShowToast]=useState(false);
  const [toastMessage,setToastMessage]=useState('');
  const [toastType,setToastType]=useState('primary');
  const [review,setReview]=useState({});
  const {getReviewsByPropertyId,addReview,deleteReview,addHostResponse,deleteHostResponse}=useReview();
  const [showDeleteAlertModal,setShowDeleteAlertModal]=useState(false);


  const getReviews=async()=>{
    try {
      setIsLoading(true);
      const response =await getReviewsByPropertyId(propertyId);
      setReviews(response);
      // console.log(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching review analytics:', error);
    }
  }

  const postReview=async(e)=>{
    setIsLoading(true);
    e.preventDefault();
    setShowReviewModal(false);
    try {
      if(!isAuthenticated){
        setShowToast(true);
        setToastMessage('Please login to submit a review.');
        return;
      }
      const reviewData={
      propertyId:propertyId,
      userId: user._id,
      rating:rating?.value,
      comment:comment?.value,
      // hostResponse:review.hostResponse.value
    }
      setShowToast(true);
    setToastMessage('Submitting your review...');
      const response = await reviewAPI.create(reviewData);
      setReviews(response.data.reviews);
      getReviews();
      setShowToast(true);
      setToastType('success');
      setIsLoading(false);
      setToastMessage('Review submitted successfully!');
    } catch (error) {
      setShowToast(true);
      setToastType('error');
      setToastMessage(error.response.data.message || 'Error submitting your review.');
      console.error('Error adding review:', error.response.data.message);
    }
  }

  const postResponse=async(e)=>{
    setIsLoading(true);
    e.preventDefault();
    setShowReviewModal(false);
    try {
      const responseData={
      hostResponse:hostResponse?.value
    }
      setShowToast(true);
    setToastMessage('Submitting your response...');
      const response = await addHostResponse(review._id,user._id,responseData);
      // setReviews(response);
      getReviews();
      setShowToast(true);
      setToastType('success');
      
      if(reviews){setIsLoading(false);}
      setToastMessage('Response submitted successfully!');
    } catch (error) {
      setShowToast(true);
      setToastType('error');
      setToastMessage(error.response.data.message || 'Error submitting your response.');
      console.error('Error adding review:', error);
    }
  }

  const deleteResponse=async(reviewId)=>{
    if (!reviewId) return;
    setIsLoading(true);
    try {
      setShowToast(true); 
    setToastMessage('Deleting your response...');
      await deleteHostResponse(reviewId,user._id);
      getReviews();
      setShowToast(true);
      setToastType('success');
      setToastMessage('Response deleted successfully!');
    } catch (error) {
      setShowToast(true);
      setToastType('error');
      setToastMessage(error.response.data.message || 'Error deleting your response.');
      console.error('Error deleting review response:', error);
      setIsLoading(false);
    }
  }

  React.useEffect(() => {
    getReviews();
  }, [propertyId]);

  const RatingBar = ({ label, value }) => (
    <div className="mb-2">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <small className="text-muted">{label}</small>
        <small className="fw-semibold">{value}</small>
      </div>
      <div className="progress" style={{ height: '4px' }}>
        <div 
          className="progress-bar bg-dark" 
          style={{ width: `${(value / 5) * 100}%` }}
        ></div>
      </div>
    </div>
  );

if(isLoading){
  return (
    <Loading/>

  )
}
  return (
    <>
   {user?.role !== 'host' &&  <Button variant="secondary" onClick={()=>setShowReviewModal(true)}>Write a Review</Button>}
    {reviews?.length===0?null:
      <div className="reviews-list mt-4">
        {/* Rating Breakdown */}
        {reviewAnalytics && <div className="row mb-5">
          <div className="col-md-6">
            <RatingBar label="Cleanliness" value={4.9} />
            <RatingBar label="Accuracy" value={4.8} />
            <RatingBar label="Check-in" value={5.0} />
          </div>
          <div className="col-md-6">
            <RatingBar label="Communication" value={4.9} />
            <RatingBar label="Location" value={4.7} />
            <RatingBar label="Value" value={4.8} />
          </div>
        </div>}

        {/* Reviews */}
        <div className="row g-4">
          {displayReviews!=='undefined' && displayReviews.map((review) => (
            <div key={review._id} className="col-md-6">
              <div className="review-item">
                {/* User Info */}
                <div className="d-flex align-items-center mb-3">
                  <img
                    src={review?.userAvatar}
                    alt={review?.userName}
                    className="rounded-circle me-3"
                    style={{ width: '48px', height: '48px' }}
                  />
                  <div>
                    <h6 className="mb-0">{review?.userName}</h6>
                    <small className="text-muted">{new Date(review?.createdAt).toLocaleDateString()}</small>
                  </div>
                </div>

                {/* Rating */}
                <div className="mb-2">
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={`bi bi-star${i < review?.rating ? '-fill' : ''} ${
                        i < review?.rating ? 'text-warning' : 'text-muted'
                      }`}
                    ></i>
                  ))}
                </div>

                {/* Comment */}
                <p className="text-muted mb-2">{review?.comment}</p>

                {/*Button for host to respond to review */}
                {user?.role==='host' && !review?.hostResponse && (
                  <Button 
                  className='btn-secondary  btn-outline-secondary text-decoration-none'
                    variant="link"
                    onClick={() => {
                      setReview(review);
                      setShowReviewModal(true);
                    }}
                    
                  >
                    Respond to review
                  </Button>
                )}

                {/* Host Response */}
                {review?.hostResponse && (
                  <div className="ms-4 mt-3 p-3 bg-light rounded">
                    <p className="small fw-semibold mb-1">Response from host:</p>
                    <p className="small text-muted mb-0">{review?.hostResponse}</p>
                   {user?.role === 'host' && review.hostId === user._id && <i className="bi bi-dash-circle-fill text-muted" onClick={()=>{
                      setShowDeleteAlertModal(true)}}></i>}
                  </div>
                  
                )}
                 <Modal show={showDeleteAlertModal} onClose={()=>setShowDeleteAlertModal(false)} title="Confirm Delete">
        <p>Are you sure you want to delete this response?</p>
        <div className="d-flex justify-content-end gap-2">
          <Button onClick={()=>setShowDeleteAlertModal(false)} >Cancel</Button>
          <Button variant="danger" onClick={() => {
            deleteResponse(review._id);
            setShowDeleteAlertModal(false);
          }}>Delete</Button>
        </div>
      </Modal>
              </div>
            </div>
          ))}
        </div>

        {/* Show More Button */}
        {reviews?.length > limit && !showAll && (
          <button
            className="btn btn-outline-dark mt-4"
            onClick={() => setShowAll(true)}
          >
            Show all {reviews.length} reviews
          </button>
        )}
      </div>
      }{/*
      Write a Review Modal */}
      <Modal
        title={user?.role === 'host' ? "Write response" : "Write a Review"}
        show={showReviewModal}
        onClose={()=>setShowReviewModal(false)}
      >
        {/* Review Form */} 

       
          {user?.role==='host'?
          <form onSubmit={postResponse}>
            
        <div className="mb-3">
          <label htmlFor="hostResponse" className="form-label">Message</label>
          <textarea className="form-control" id="hostResponse" rows="4"></textarea>
        </div>
        <Button onClick={postResponse} type='submit' variant="success">Submit Response</Button>
      </form>
      :
      <form onSubmit={postReview}>
             <div className="mb-3">
          <label htmlFor="rating" className="form-label">Rating</label>
          <select className="form-select" id="rating">
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Very Good</option>
            <option value="3">3 - Good</option>
            <option value="2">2 - Fair</option>
            <option value="1">1 - Poor</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="comment" className="form-label">Comment</label>
          <textarea className="form-control" id="comment" rows="4"></textarea>
        </div>
        <Button onClick={postReview} type='submit' variant="success">Submit Review</Button>
      </form>}
      </Modal>
      <Toast show={showToast} message={toastMessage} type={toastType} position='bottom-center' onClose={()=>setShowToast(false)}  />
       
  </>
  );
};

export default ReviewsList;
