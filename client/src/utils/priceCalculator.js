export const calculateTotalPrice = (pricePerNight, nights, cleaningFee = 50, serviceFee = 0) => {
  const subtotal = pricePerNight * nights;
  const calculatedServiceFee = serviceFee || subtotal * 0.14; // 14% service fee
  const total = subtotal + cleaningFee + calculatedServiceFee;
  
  return {
    subtotal,
    cleaningFee,
    serviceFee: calculatedServiceFee,
    total
  };
};
