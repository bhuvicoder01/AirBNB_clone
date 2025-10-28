import { format, differenceInDays, parseISO } from 'date-fns';

export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  return format(parseISO(date), formatStr);
};

export const calculateNights = (checkIn, checkOut) => {
  return differenceInDays(parseISO(checkOut), parseISO(checkIn));
};

export const isDateAvailable = (date, bookedDates) => {
  // Check if date is not in the booked dates array
  return !bookedDates.includes(format(date, 'yyyy-MM-dd'));
};
