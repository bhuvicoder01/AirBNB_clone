import React, { useState } from 'react';
import { 
  format, 
  addMonths, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay,
  isBefore,
  startOfDay
} from 'date-fns';

const Calendar = ({ checkIn, checkOut, onDateSelect, blockedDates = [] }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tempCheckIn, setTempCheckIn] = useState(checkIn ? new Date(checkIn) : null);
  const [tempCheckOut, setTempCheckOut] = useState(checkOut ? new Date(checkOut) : null);

  const handleDateClick = (date) => {
    const today = startOfDay(new Date());
    
    // Don't allow past dates
    if (isBefore(date, today)) return;
    
    // Don't allow blocked dates
    if (blockedDates.includes(format(date, 'yyyy-MM-dd'))) return;

    if (!tempCheckIn || (tempCheckIn && tempCheckOut)) {
      // Start new selection
      setTempCheckIn(date);
      setTempCheckOut(null);
      onDateSelect({ 
        checkIn: format(date, 'yyyy-MM-dd'), 
        checkOut: null 
      });
    } else if (tempCheckIn && !tempCheckOut) {
      // Complete selection
      if (date > tempCheckIn) {
        setTempCheckOut(date);
        onDateSelect({
          checkIn: format(tempCheckIn, 'yyyy-MM-dd'),
          checkOut: format(date, 'yyyy-MM-dd')
        });
      }
    }
  };

  const isDateInRange = (date) => {
    if (!tempCheckIn || !tempCheckOut) return false;
    return date > tempCheckIn && date < tempCheckOut;
  };

  const isDateBlocked = (date) => {
    return blockedDates.includes(format(date, 'yyyy-MM-dd'));
  };

  const isPastDate = (date) => {
    return isBefore(date, startOfDay(new Date()));
  };

  const renderMonth = (month) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Add empty cells for days before month starts
    const startDay = monthStart.getDay();
    const emptyDays = Array(startDay).fill(null);

    return (
      <div className="calendar-month">
        <h6 className="text-center fw-semibold mb-3">
          {format(month, 'MMMM yyyy')}
        </h6>
        
        <div className="calendar-grid mb-3">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="text-center small fw-semibold text-muted mb-2">
              {day}
            </div>
          ))}
          
          {emptyDays.map((_, index) => (
            <div key={`empty-${index}`} className="calendar-day-empty"></div>
          ))}
          
          {days.map(day => {
            const isCheckInDate = tempCheckIn && isSameDay(day, tempCheckIn);
            const isCheckOutDate = tempCheckOut && isSameDay(day, tempCheckOut);
            const inRange = isDateInRange(day);
            const blocked = isDateBlocked(day);
            const past = isPastDate(day);

            return (
              <button
                key={day.toString()}
                type="button"
                className={`calendar-day btn btn-sm ${
                  isCheckInDate || isCheckOutDate 
                    ? 'btn-dark text-white' 
                    : inRange 
                    ? 'btn-light' 
                    : blocked || past
                    ? 'btn-outline-light text-muted'
                    : 'btn-outline-light text-dark'
                }`}
                onClick={() => handleDateClick(day)}
                disabled={blocked || past}
                style={{
                  opacity: blocked || past ? 0.4 : 1,
                  cursor: blocked || past ? 'not-allowed' : 'pointer'
                }}
              >
                {format(day, 'd')}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="calendar-container">
      <div className="row">
        <div className="col-md-6">
          {renderMonth(currentMonth)}
        </div>
        <div className="col-md-6">
          {renderMonth(addMonths(currentMonth, 1))}
        </div>
      </div>
      
      <div className="d-flex justify-content-between align-items-center mt-3">
        <button
          type="button"
          className="btn btn-outline-dark btn-sm"
          onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
        >
          <i className="bi bi-chevron-left"></i> Previous
        </button>
        
        <button
          type="button"
          className="btn btn-link text-decoration-underline"
          onClick={() => {
            setTempCheckIn(null);
            setTempCheckOut(null);
            onDateSelect({ checkIn: null, checkOut: null });
          }}
        >
          Clear dates
        </button>
        
        <button
          type="button"
          className="btn btn-outline-dark btn-sm"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        >
          Next <i className="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>
  );
};

export default Calendar;
