import React from 'react';

const GuestCounter = ({isOpen=false, value, onChange }) => {
  const [isOpenState, setIsOpenState] = React.useState(isOpen);
  const increment = (type) => {
    onChange({ ...value, [type]: value[type] + 1 });
  };

  const decrement = (type) => {
    if (value[type] > 0) {
      onChange({ ...value, [type]: value[type] - 1 });
    }
  };

  return (<>
    {isOpenState && <div className="guest-counter" onMouseLeave={() => setIsOpenState(false)} style={{ minWidth: '300px' }}>
      <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
        <div>
          <div className="fw-semibold">Adults</div>
          <div className="small text-muted">Age 13+</div>
        </div>
        <div className="d-flex align-items-center gap-3">
          <button 
            className="btn btn-outline-secondary rounded-circle"
            onClick={() => decrement('adults')}
            disabled={value.adults <= 1}
          >
            <i className="bi bi-dash"></i>
          </button>
          <span className="fw-semibold">{value.adults}</span>
          <button 
            className="btn btn-outline-secondary rounded-circle"
            onClick={() => increment('adults')}
          >
            <i className="bi bi-plus"></i>
          </button>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
        <div>
          <div className="fw-semibold">Children</div>
          <div className="small text-muted">Age 2-12</div>
        </div>
        <div className="d-flex align-items-center gap-3">
          <button 
            className="btn btn-outline-secondary rounded-circle"
            onClick={() => decrement('children')}
            disabled={value.children <= 0}
          >
            <i className="bi bi-dash"></i>
          </button>
          <span className="fw-semibold">{value.children}</span>
          <button 
            className="btn btn-outline-secondary rounded-circle"
            onClick={() => increment('children')}
          >
            <i className="bi bi-plus"></i>
          </button>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center">
        <div>
          <div className="fw-semibold">Infants</div>
          <div className="small text-muted">Under 2</div>
        </div>
        <div className="d-flex align-items-center gap-3">
          <button 
            className="btn btn-outline-secondary rounded-circle"
            onClick={() => decrement('infants')}
            disabled={value.infants <= 0}
          >
            <i className="bi bi-dash"></i>
          </button>
          <span className="fw-semibold">{value.infants}</span>
          <button 
            className="btn btn-outline-secondary rounded-circle"
            onClick={() => increment('infants')}
          >
            <i className="bi bi-plus"></i>
          </button>
        </div>
      </div>
    </div>}
    </>
  );
};

export default GuestCounter;
