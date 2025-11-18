import { useNavigate, useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { usePayment } from '../contexts/PaymentContext';
import { useBooking } from '../contexts/BookingContext';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import Toast from '../components/common/Toast';
import '../styles/PaymentInterface.css';

const PaymentInterface = ({}) => {
  const { isPaymentLoading, processPayment, paymentStatus,setPaymentStatus, paymentError, paymentData, resetPayment } = usePayment();
  const {setCurrentBooking, currentBooking,getBookingById } = useBooking();
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    email: '',
    address: ''
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [booking, setBooking] = useState(null);
  const {id} = useParams();
  const [isLoading,setIsLoading]=useState(true)

  useEffect(() => {
    const fetchBooking = async () => {
      if (id) {
        try {
          // console.log(id)
          const bookingData = await getBookingById(id);
          setBooking(bookingData);
          // console.log(bookingData)
          
          if(booking?.status==='confirmed'&&booking?.payment?.status==='paid'){
                      setIsLoading(false)

            setToastMessage('Booking already paid');
            setToastType('error');
            setShowToast(true);
            setPaymentStatus('completed')
            // setTimeout(() => navigate('/'), 3000);
          }

          else if(bookingData===null){
                      setIsLoading(false)

            setToastMessage('Booking not found');
            setToastType('error');
            setShowToast(true)
            return ()=>{
              setTimeout(() => navigate('/'), 3000);
          }
        }
        } catch (error) {
                    setIsLoading(false)

          setToastMessage('Booking not found');
          setToastType('error');
          setShowToast(true);
          setTimeout(() => navigate('/'), 2000);
        }
      }
    };
    fetchBooking();
  }, [id, getBookingById, navigate]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        cardName: (user.firstName + ' ' + user.lastName)
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    } else if (name === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d{0,2})/, '$1/$2');
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const validateForm = () => {
    if (!formData.cardName.trim()) {
      setToastMessage('Cardholder name is required');
      setToastType('error');
      setShowToast(true);
      return false;
    }
    if (!formData.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
      setToastMessage('Card number must be 16 digits');
      setToastType('error');
      setShowToast(true);
      return false;
    }
    if (!formData.expiryDate.match(/^\d{2}\/\d{2}$/)) {
      setToastMessage('Expiry date must be MM/YY format');
      setToastType('error');
      setShowToast(true);
      return false;
    }
    if (!formData.cvv.match(/^\d{3,4}$/)) {
      setToastMessage('CVV must be 3-4 digits');
      setToastType('error');
      setShowToast(true);
      return false;
    }
    if (!formData.email.trim()) {
      setToastMessage('Email is required');
      setToastType('error');
      setShowToast(true);
      return false;
    }
    if (!formData.address.trim()) {
      setToastMessage('Address is required');
      setToastType('error');
      setShowToast(true);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
console.log('im here')
    if (!validateForm()) {
      return;
    }

    try {
        console.log('im here')

      const paymentDetails = {
        amount: booking?.totalPrice || 0,
        currency: 'INR',
        cardName: formData.cardName,
        cardLast4: formData.cardNumber.slice(-4),
        cardNumber:formData.cardNumber,
        email: formData.email,
        address: formData.address,
        expiryDate: formData.expiryDate,
        cvv: formData.cvv
      };

      console.log(paymentDetails)
      const result = await processPayment(booking._id,paymentDetails);
      // console.log(result)
      
      if(result?.success==='true'){
        if(result?.transaction?.status==='paid')
          {setToastMessage(`Payment successful! Transaction ID: ${result?.transaction?.transactionId}`);
      setToastType('success');
      setShowToast(true);
    }
    
      // navigate('/');
      // setCurrentBooking(null);
    }
    else if(result?.success==='false' && result?.message==='Booking already confirmed and paid'){
      setToastMessage(`${result?.message} with Transaction ID: ${result?.transaction?.transactionId}`);
      setToastType('success');
      setShowToast(true);
    }
    else if(result?.transaction?.status==='failed'){
      setToastMessage(`Payment failed! Transaction ID: ${result?.transaction?.transactionId}`);
      setToastType('error');
      setShowToast(true);
    }

      // Clear form
      setTimeout(() => {
        setFormData({
          cardName: '',
          cardNumber: '',
          expiryDate: '',
          cvv: '',
          email: user?.email || '',
          address: ''
        });
      }, 2000);
    } catch (error) {
      setToastMessage('Payment processing failed. Please try again.');
      setToastType('error');
      setShowToast(true);
    }
  };

  const handleReset = () => {
    resetPayment();
    setFormData({
      cardName: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      email: user?.email || '',
      address: ''
    });
  };

  return (<>
    {!booking&&isLoading?<Loading text='Loading payment page...' fullPage='true' />:<div className="payment-container">
      <div className="payment-wrapper">
        {/* Order Summary */}
        <div className="payment-summary">
          <h2>{t('orderSummary')}</h2>
          {booking ? (
            <div className="summary-details">
              <div className="summary-item">
                <span>{t('checkIn')}:</span>
                <span>{new Date(booking.checkIn).toLocaleDateString()}</span>
              </div>
              <div className="summary-item">
                <span>{t('checkOut')}:</span>
                <span>{new Date(booking.checkOut).toLocaleDateString()}</span>
              </div>
              <div className="summary-item">
                <span>{t('nights')}:</span>
                <span>{Math.ceil(((new Date(booking.checkOut).getTime())-(new Date(booking.checkIn).getTime()))/(1000*60*60*24)) || 0}</span>
              </div>
              <div className="summary-item">
                <span>{t('pricePerNight')}:</span>
                <span>${booking.pricePerNight || 0}</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-item total">
                <span>{t('totalAmount')}:</span>
                <span>${booking.totalPrice || 0}</span>
              </div>
            </div>
          ) : (
            <p className="no-booking">No booking information available</p>
          )}
        </div>

        {/* Payment Form */}
        <div className="payment-form-section">
          <h2>{t('paymentDetails')}</h2>
          
          {paymentStatus === 'completed' && paymentData && (
            <div className="payment-success">
              <div className="success-icon">✓</div>
              <h3>Payment Successful!</h3>
              <p>Transaction ID: <strong>{paymentData.transactionId}</strong></p>
              <p>Amount: <strong>${paymentData.amount}</strong></p>
              <p>Date: <strong>{new Date(paymentData.createdAt).toLocaleString()}</strong></p>
              <Button 
                label="Make Another Payment" 
                onClick={()=>navigate('/payment')}
                className="btn-primary"
              />
            </div>
          )}
          {paymentStatus==='completed'&& booking?.status==='confirmed'&&booking?.payment?.status==='paid'&&
          <div className="payment-success">
              <div className="success-icon">✓</div>
              <h3>Booking already paid!</h3>
              <p>Transaction ID: <strong>{booking?.payment?.transactionId}</strong></p>
              <p>Amount: <strong>${booking?.totalPrice}</strong></p>
              <p>Date: <strong>{new Date(booking?.payment?.createdAt).toLocaleString()}</strong></p>
              <Button
                label="Make another payment"
                onClick={()=>navigate('/payment')}
                className="btn-primary"
              />
            </div>
          }

          {paymentStatus !== 'completed' && (
            <form onSubmit={handleSubmit} className="payment-form">
              {/* Cardholder Name */}
              <div className="form-group">
                <label htmlFor="cardName">{t('cardholderName')} *</label>
                <input
                  type="text"
                  id="cardName"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  disabled={isPaymentLoading}
                  required
                />
              </div>

              {/* Card Number */}
              <div className="form-group">
                <label htmlFor="cardNumber">{t('cardNumber')} *</label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  disabled={isPaymentLoading}
                  required
                />
              </div>

              {/* Expiry and CVV */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="expiryDate">{t('expiryDate')} *</label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    placeholder="MM/YY"
                    maxLength="5"
                    disabled={isPaymentLoading}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cvv">CVV *</label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleChange}
                    placeholder="123"
                    maxLength="4"
                    disabled={isPaymentLoading}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="email">{t('email')} *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  disabled={isPaymentLoading}
                  required
                />
              </div>

              {/* Address */}
              <div className="form-group">
                <label htmlFor="address">{t('address')} *</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Main St, City, State 12345"
                  rows="3"
                  disabled={isPaymentLoading}
                  required
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="form-actions">
                {isPaymentLoading ? (
                  <Loading />
                ) : (
                  <>
                    <Button
                      label={`Pay $${booking?.totalPrice || 0}`}
                      type="submit"
                      onClick={handleSubmit}
                      disabled={!booking}
                      className="btn-primary btn-pay"
                      
                    />
                    <Button
                      label={t('cancel')}
                      type="button"
                      onClick={handleReset}
                      className="btn-secondary"
                    />
                  </>
                )}
              </div>

              <p className="payment-notice">
                This is a mock payment interface. No real charges will be made.
              </p>
            </form>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      <Toast
        show={showToast}
        message={toastMessage}
        type={toastType}
        position='top-center'
        onClose={() => setShowToast(false)}
      />
    </div>}
  </>);
};

export default PaymentInterface;