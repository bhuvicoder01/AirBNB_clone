import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import RegisterForm from '../components/user/RegisterForm';

const Register = () => {
  const navigate = useNavigate();
  const { register,user,logout } = useAuth();
  const { t } = useLanguage();

   useEffect(()=>{
    if(localStorage.getItem('user')===''){
      console.log('logging out')
      logout()
    }
    if(localStorage.getItem('user')||user!==null){
      // console.log(user)
      navigate('/')
    }
  },[user])

  const handleRegister = async (userData) => {
    try {
      await register(userData);
      navigate('/');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body p-5">
              <h3 className="text-center mb-4">Finish signing up</h3>
              <RegisterForm onSubmit={handleRegister} />
              
              <div className="text-center mt-4">
                <p className="text-muted">
                  Already have an account?{' '}
                  <Link to="/login" className="text-decoration-none fw-semibold">
                    Log in
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

export default Register;
