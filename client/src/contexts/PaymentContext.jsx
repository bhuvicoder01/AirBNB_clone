import { createContext, useContext, useState } from "react";
import { paymentAPI } from "../services/api";

const PaymentContext = createContext();

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within PaymentProvider');
  }
  return context;
};

export const PaymentProvider = ({ children }) => {
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentError, setPaymentError] = useState(null);

  const processPayment = async (bookingId,paymentDetails) => {
    setIsPaymentLoading(true);
    setPaymentError(null);
    try {

      const response=await paymentAPI.createIntent(bookingId,paymentDetails);
      
      
      setPaymentData(response.data.transaction||[]);
      setPaymentStatus('completed');
      return response.data;
    } catch (error) {
      setPaymentError(error.message);
      setPaymentStatus('failed');
      throw error;
    } finally {
      setIsPaymentLoading(false);
    }
  };

  const resetPayment = () => {
    setPaymentData(null);
    setPaymentStatus(null);
    setPaymentError(null);
  };

  const value = {
    isPaymentLoading,
    setIsPaymentLoading,
    paymentData,
    setPaymentData,
    paymentStatus,
    setPaymentStatus,
    paymentError,
    setPaymentError,
    processPayment,
    resetPayment
  };

  return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
};



