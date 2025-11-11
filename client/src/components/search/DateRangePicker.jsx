import React, { useState } from 'react';
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import '../../styles/index.css';

const DateRangePicker = ({ value, onChange }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [checkIn, setCheckIn] = useState(value.checkIn ? new Date(value.checkIn) : null);
  const [checkOut, setCheckOut] = useState(value.checkOut ? new Date(value.checkOut) : null);

  const handleDateClick = (date) => {
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(date);
      setCheckOut(null);
      onChange({ checkIn: format(date, 'yyyy-MM-dd'), checkOut: null });
    } else if (checkIn && !checkOut) {
      if (date > checkIn) {
        setCheckOut(date);
        onChange({ 
          checkIn: format(checkIn, 'yyyy-MM-dd'), 
          checkOut: format(date, 'yyyy-MM-dd') 
        });
      }
    }
  };

  const renderCalendar = (month) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    return (
      <div className="calendar-month">
        <h6 className="text-center mb-3">{format(month, 'MMMM yyyy')}</h6>
        <div className="calendar-grid">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="calendar-day-header text-center small fw-semibold">
              {day}
            </div>
          ))}
          {days.map(day => (
            <button
              key={day.toString()}
              className={`calendar-day btn btn-sm ${
                checkIn && isSameDay(day, checkIn) ? 'btn-danger text-white' : 
                checkOut && isSameDay(day, checkOut) ? 'btn-danger text-white' : 
                checkIn && checkOut && day > checkIn && day < checkOut ? 'btn-light' :
                'btn-outline-light text-dark'
              }`}
              onClick={() => handleDateClick(day)}
            >
              {format(day, 'd')}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="date-range-picker" >
      <div className="d-flex gap-4">
        {renderCalendar(currentMonth)}
        {renderCalendar(addMonths(currentMonth, 1))}
      </div>
      <div className="d-flex justify-content-between mt-3">
        <button 
          className="btn btn-link"
          onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
        >
          Previous
        </button>
        <button 
          className="btn btn-link"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DateRangePicker;
