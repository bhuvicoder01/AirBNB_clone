import React, { useState } from 'react';
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isBefore, startOfDay, addDays, getDay } from 'date-fns';
import '../../styles/index.css';

const DateRangePicker = ({ value, onChange, isOpen = false, onClose, mode = 'range' }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [checkIn, setCheckIn] = useState(value.checkIn ? new Date(value.checkIn) : null);
  const [checkOut, setCheckOut] = useState(value.checkOut ? new Date(value.checkOut) : null);
  const today = startOfDay(new Date());

  const handleDateClick = (date) => {
    if (mode === 'checkIn') {
      setCheckIn(date);
      onChange({ checkIn: format(date, 'yyyy-MM-dd'), checkOut: value.checkOut });
      handleClose();
    } else if (mode === 'checkOut') {
      setCheckOut(date);
      onChange({ checkIn: value.checkIn, checkOut: format(date, 'yyyy-MM-dd') });
      handleClose();
    } else {
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
    }
  };

  const handleClose = () => {
    onClose && onClose();
  };

  const handleApply = () => {
    handleClose();
  };

  const isDateDisabled = (date) => {
    const dateStart = startOfDay(date);
    if (isBefore(dateStart, today)) return true;
    if (mode === 'checkOut' && checkIn) {
      const checkInDate = startOfDay(new Date(checkIn).getDate());
      // Disable dates on or before check-in date
      return dateStart.getTime <= checkInDate.getTime;
    }
    return false;
  };

  const renderCalendar = (month) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const startDayOfWeek = getDay(monthStart);

    return (
      <div className="calendar-month">
        <h6 className="text-center mb-3">{format(month, 'MMMM yyyy')}</h6>
        <div className="calendar-grid">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="calendar-day-header text-center small fw-semibold">
              {day}
            </div>
          ))}
          {Array.from({ length: startDayOfWeek }).map((_, index) => (
            <div key={`empty-${index}`} className="calendar-day-empty"></div>
          ))}
          {days.map(day => {
            const disabled = isDateDisabled(day);
            const dayOfWeek = getDay(day);
            const dayName = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][dayOfWeek];
            
            // Validation: Check if day aligns correctly
            if (process.env.NODE_ENV === 'development') {
              const expectedDayName = format(day, 'EEEEEE');
              if (dayName !== expectedDayName) {
                console.warn(`Date alignment mismatch: ${format(day, 'yyyy-MM-dd')} should be ${expectedDayName} but rendered as ${dayName}`);
              }
            }
            
            return (
              <button
                key={day.toString()}
                disabled={disabled}
                className={`calendar-day btn btn-sm ${
                  disabled ? 'btn-outline-light text-muted disabled-date' :
                  checkIn && isSameDay(day, checkIn) ? 'btn-danger text-white' : 
                  checkOut && isSameDay(day, checkOut) ? 'btn-danger text-white' : 
                  checkIn && checkOut && day > checkIn && day < checkOut ? 'btn-light' :
                  'btn-outline-light text-dark'
                }`}
                onClick={() => !disabled && handleDateClick(day)}
                title={`${format(day, 'EEEE, MMMM d, yyyy')}`}
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
    <>
      {/* Modal Backdrop */}
      {isOpen && (
        <div 
          className="modal d-block"
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1050
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              {/* Modal Header */}
              <div className="modal-header">
                <h5 className="modal-title">
                  {mode === 'checkIn' ? 'Select Check-in Date' : 
                   mode === 'checkOut' ? 'Select Check-out Date' : 
                   'Select Dates'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={handleClose}
                ></button>
              </div>

              {/* Modal Body */}
              <div className="modal-body">
                <div className="date-range-picker">
                  <div className="d-flex gap-4 justify-content-center">
                    {renderCalendar(currentMonth)}
                  </div>
                  <div className="d-flex justify-content-between mt-4 px-3">
                    <button 
                      className="btn btn-outline-secondary"
                      onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
                      disabled={isSameMonth(currentMonth, today)}
                    >
                      <i className="bi bi-chevron-left"></i> Previous
                    </button>
                    <button 
                      className="btn btn-outline-secondary"
                      onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                    >
                      Next <i className="bi bi-chevron-right"></i>
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={handleClose}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={handleApply}
                  disabled={mode === 'range' && (!checkIn || !checkOut)}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DateRangePicker;
