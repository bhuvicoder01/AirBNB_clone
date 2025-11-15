import { createContext, useContext, useState } from "react";

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

  const processPayment = async (paymentDetails) => {
    setIsPaymentLoading(true);
    setPaymentError(null);
    try {
      // Mock payment processing - simulates API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResponse = {
        success: true,
        transactionId: `TXN-${Date.now()}`,
        amount: paymentDetails.amount,
        currency: 'USD',
        timestamp: new Date().toISOString(),
        status: 'completed'
      };
      
      setPaymentData(mockResponse);
      setPaymentStatus('completed');
      return mockResponse;
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



