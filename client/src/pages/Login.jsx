import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from '../components/user/LoginForm';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (credentials) => {
    try {
      await login(credentials.email, credentials.password);
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-5">
          <div className="card shadow-sm border-0">
            <div className="card-body p-5">
              <h3 className="text-center mb-4">Welcome to Airbnb</h3>
              <LoginForm onSubmit={handleLogin} />
              
              <div className="text-center mt-4">
                <p className="text-muted">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-decoration-none fw-semibold">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
