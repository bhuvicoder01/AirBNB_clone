import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import api from '../../services/api';
import Toast from '../common/Toast';
import { useAuth } from '../../contexts/AuthContext';

const LoginForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const {setUser,setIsAuthenticated}=useAuth()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const googleLogin=useGoogleLogin({
    flow:'auth-code',
    onSuccess:async({code})=>{
      try {
        // console.log(code)
        const res=await api.post('/auth/google',{code},
          {
            headers:{
              'Content-Type':'application/json'
            }
          }
        )
        // console.log(res.data)
        if(res.data.success){
         setUser(res.data.user)
         localStorage.setItem('user',JSON.stringify(res.data.user))
         setIsAuthenticated(true)
        }
        // if(res.data.isNewUser){
         
        // }
        
      } catch (error) {
        console.log(error)
        
      }
    }
  })

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="your@email.com"
        icon="envelope"
        required
      />

      <Input
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Enter your password"
        icon="lock"
        required
      />

      <div className="mb-3 form-check">
        <input
          type="checkbox"
          className="form-check-input"
          id="rememberMe"
        />
        <label className="form-check-label" htmlFor="rememberMe">
          Remember me
        </label>
      </div>

      <Button
        type="submit"
        variant="primary"
        fullWidth
        loading={loading}
      >
        Log in
      </Button>

      <div className="text-center mt-3">
        <a href="#" className="text-decoration-none small">
          Forgot password?
        </a>
      </div>

      <div className="position-relative my-4">
        <hr />
        <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted small">
          or
        </span>
      </div>

      {/* Social Login Buttons */}
      <button type="button" onClick={googleLogin} className="btn btn-outline-dark w-100 mb-2">
        <i className="bi bi-google me-2"></i>
        Continue with Google
      </button>
      <button type="button" className="btn btn-outline-dark w-100 mb-2">
        <i className="bi bi-facebook me-2"></i>
        Continue with Facebook
      </button>
      <button type="button" className="btn btn-outline-dark w-100">
        <i className="bi bi-apple me-2"></i>
        Continue with Apple
      </button>
    </form>
  );
};

export default LoginForm;
