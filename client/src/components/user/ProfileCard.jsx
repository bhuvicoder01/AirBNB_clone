import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Modal from '../common/Modal';

const ProfileCard = ({}) => {
  // showEdit controls whether the Edit button is visible
  const [showEdit] = useState(true);
  const { user, updateProfile } = useAuth();
  

  // modal visibility and form state
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ firstName: '',lastName:'', email: '', avatar: '' });

  useEffect(() => {
    if (user) {
      setForm({ firstName: user.firstName||'', lastName: user.lastName || '', email: user.email || '', avatar: user.avatar || '' });
    }
  }, [user]);

  const onEdit = () => {
    setShowModal(true);
  };

  const onClose = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Basic validation: require name and email
    if (!form.firstName.trim() || !form.lastName.trim()|| !form.email.trim()) {
      // keep it simple: use alert for now
      alert('Name and email are required');
      return;
    }

    // update auth context (this also persists to localStorage in AuthContext)
    updateProfile({ firstName: form.firstName.trim() ,lastName: form.lastName.trim(), email: form.email.trim(), avatar: form.avatar.url.trim() });
    setShowModal(false);
  };

  return (
    <>
      <div className="card mt-2"style={{minWidth:'80%',paddingInline:'10%',marginInline:'5%'}}>
        <div className="card-body text-center"style={{justifyContent:'center'}}>
          <img
            src={user?.avatar?.url}
            alt={user?.firstName}
            className="rounded-circle mb-3"
            style={{ width: '120px', height: '120px', objectFit: 'cover' }}
          />

          <h4 className="mb-1">{user?.firstName} {user?.lastName}</h4>
          <p className="text-muted mb-3">{user?.email}</p>

          <div className="d-flex justify-content-center gap-4 mb-3">
            <div className="text-center">
              <div className="fw-bold">
                <i className="bi bi-star-fill text-warning me-1"></i>
                {user?.rating || '5.0'}
              </div>
              <small className="text-muted">Rating</small>
            </div>
            <div className="text-center">
              <div className="fw-bold">{user?.reviewsCount || 0}</div>
              <small className="text-muted">Reviews</small>
            </div>
            <div className="text-center">
              <div className="fw-bold">{user?.tripsCount || 0}</div>
              <small className="text-muted">Trips</small>
            </div>
          </div>

          {user?.role === 'host' && (
            <span className="badge bg-danger mb-3">
              <i className="bi bi-award me-1"></i>
              Superhost
            </span>
          )}

          {showEdit && (
            <button className="btn btn-outline-dark "style={{minWidth:'50%'}} onClick={onEdit}>
              <i className="bi bi-pencil me-2"></i>
              Edit Profile
            </button>
          )}

          <div className="mt-4 pt-4 border-top">
            <div className="d-flex justify-content-between mb-2">
              <span>😎 <span className="text-muted">Member since</span></span>
              <span className="fw-semibold">{new Date((user?.createdAt)).toLocaleDateString()}</span>
            </div>
            {user?.role==="host" && <div className="d-flex justify-content-between">
              <span className="text-muted">Verified</span>
              <span>
                <i className="bi bi-patch-check-fill text-success"></i>
              </span>
            </div>}
          </div>
        </div>
      </div>

      <Modal
        show={showModal}
        onClose={onClose}
        title="Edit Profile"
        size="md"
        centered
        footer={
          <>
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              Save
            </button>
          </>
        }
      >
        <div className="mb-3">
          <label className="form-label">First name</label>
          <input
            type="text"
            className="form-control"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Last name</label>
          <input
            type="text"
            className="form-control"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Avatar URL</label>
          <input
            type="text"
            className="form-control"
            name="avatar"
            value={form.avatar.url}
            onChange={handleChange}
          />
        </div>
      </Modal>
    </>
  );
};

export default ProfileCard;
