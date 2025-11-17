import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../styles/PaymentInterface.css';
import Toast from '../components/common/Toast';
import { useBooking } from '../contexts/BookingContext';

const PaymentPage= () => {
    const [bookingId,setBookingId]=useState(null)
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('');
    const navigate=useNavigate()
    const{bookings}=useBooking()

    const handleChange=(e)=>{
        e.preventDefault();
        setBookingId(e.target.value)
        // console.log(bookingId)

    }
    const handleSubmit=async(e)=>{
        e.preventDefault();
        if(bookingId===''||bookingId===null){
            //  console.log(bookingId)
            setToastMessage('Please enter booking id');
            setToastType('error');
            setShowToast(true);
            return
        }
        try{
            if(bookings.find(booking=>booking._id===bookingId)){
                if(bookings.find(booking=>booking._id===bookingId).status==='confirmed'&&bookings.find(booking=>booking._id===bookingId)?.payment.status==='paid'){
                    setToastMessage('Booking already paid and confirmed');
                    setToastType('success');
                    setShowToast(true);
                    return
                }
                navigate(`/payment/booking/${bookingId}`)
            }
            else{
                setToastMessage('Booking not found');
                setToastType('error');
                setShowToast(true);
            }
        }
        catch(error){
            console.log(error)
        }
    }
  return (<>
    <div className="payment-container">
        <div className='payment-wrapper'>
            <span className=' payment-summary'style={{paddingTop:'20px',fontFamily:'fantasy',fontSize:'2rem',color:'ActiveCaption',backgroundImage:'url(/payment-img.jpg)',backgroundPosition:'center',backgroundRepeat:'no-repeat',backgroundSize:'cover',height:'50vh',width:'100%',textAlign:'center',fontWeight:'bold',letterSpacing:'2px'}}>Check your payment status Or Complete your payment</span>
           {/* <img className=''style={{width:'50%'}} src='/payment-img.jpg'/> */}

            <div className='payment-form-section'>    
                 <h2>Payment Page</h2>   
                
        <form  className='payment-form'>
            <div className='form-group'>
                <label htmlFor="bookingId">Enter Booking ID</label>
            <input
                type="text"
                placeholder="Booking Id"
                className="form-control"
                id="bookingId"
                onChange={handleChange}
            />
            
            </div>
            <button onClick={handleSubmit} className="btn btn-primary">Search</button>
            </form>
 </div>
            

      {/* Add your payment interface content here */}

        </div>
      
    </div>
    {showToast && 
    <Toast show={showToast} message={toastMessage} type={toastType} onClose={() => setShowToast(false)} />
    }
    
    </>
  );
};
export default PaymentPage;