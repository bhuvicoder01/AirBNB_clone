import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DateRangePicker from './DateRangePicker';
import GuestCounter from './GuestCounter';
import '../../styles/index.css';

const SearchBar = ({ compact = false }) => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [dates, setDates] = useState({ checkIn: null, checkOut: null });
  const [guests, setGuests] = useState({ adults: 1, children: 0, infants: 0 });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGuestPicker, setShowGuestPicker] = useState(false);

  const handleSearch = () => {
    const searchParams = new URLSearchParams({
      location: location || '',
      checkIn: dates.checkIn || '',
      checkOut: dates.checkOut || '',
      adults: guests.adults,
      children: guests.children,
      infants: guests.infants
    });
    navigate(`/search?${searchParams.toString()}`);
  };

  if (compact) {
    return (
      // <div className="search-bar-compact shadow-sm rounded-pill border p-2 bg-white">
      //   <div className="d-flex align-items-center">
      //     <input 
      //       type="text"
      //       className="form-control border-0 fw-semibold"
      //       placeholder="Enter your destination"
      //       value={location}
      //       onChange={(e) => setLocation(e.target.value)}
      //       onKeyPress={(e) => {
      //         if (e.key === 'Enter') {
      //           handleSearch();
      //         }
      //       }}
      //     />
      //     <button 
      //       className="btn btn-danger rounded-circle" 
      //       onClick={handleSearch}
      //     >
      //       <i className="bi bi-search text-white"></i>
      //     </button>
      //   </div>
      // </div>
      null
    );
  }

  return (
    <div className="search-bar shadow-lg border  p-2" style={{borderRadius:'50px'}}>
      <div className="row g-0">
        {/* Location */}
        <div className="col-md-4 position-relative">
          <div className="p-3 border-end">
            <label className="small fw-semibold">Where</label>
            <input 
              type="text"
              className="form-control border-0 p-0"
              placeholder="Search destinations"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        {/* Dates */}
        <div className="col-md-4 position-relative">
          <div className="p-3 border-end" onClick={() => setShowDatePicker(!showDatePicker)}>
            <label className="small fw-semibold">Check in / Check out</label>
            <div className="text-muted small">
              {dates.checkIn && dates.checkOut 
                ? `${dates.checkIn} - ${dates.checkOut}`
                : 'Add dates'}
            </div>
          </div>
          {showDatePicker && (
            <div className="date-range-picker position-absolute top-100 mt-2 bg-white shadow-lg rounded p-3 z-3"style={{left:'-100%'}}>
              <DateRangePicker value={dates} onChange={setDates} />
            </div>
          )}
        </div>

        {/* Guests */}
        <div className="col-md-3 position-relative">
          <div className="p-3" onClick={() => setShowGuestPicker(!showGuestPicker)}>
            <label className="small fw-semibold">Who</label>
            <div className="text-muted small">
              {guests.adults + guests.children} guests
            </div>
          </div>
          {showGuestPicker && (
            <div className="position-absolute top-100 mt-2 bg-white shadow-lg rounded p-3 z-3">
              <GuestCounter value={guests} onChange={setGuests} />
            </div>
          )}
        </div>

        {/* Search Button */}
        <div className="col-md-1 d-flex align-items-center justify-content-center">
          <button 
            className="btn btn-danger m-2 p-3 " style={{borderRadius:"100px"}}
            onClick={handleSearch}
          >
            <i className="bi bi-search text-white"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
