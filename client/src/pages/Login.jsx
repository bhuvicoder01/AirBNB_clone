import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import LoginForm from '../components/user/LoginForm';
import { useEffect } from 'react';
import { useState } from 'react';
import Loading from '../components/common/Loading';

const Login = () => {
  const navigate = useNavigate();
  const {login,user,logout,isAuthenticated} = useAuth();
  const { t } = useLanguage();
  const [isLoading,setIsLoading]=useState(true)


  useEffect(()=>{
    if(localStorage.getItem('user')===''){
      console.log('logging out')
      logout()
    }
    if((localStorage.getItem('user')||user!==null) && isAuthenticated){
      // console.log(user)
      window.location.href='/'
    }
    setIsLoading(false)
  },[user])

  const handleLogin = async (credentials) => {
    try {
      setIsLoading(true)
      const user=await login(credentials.email, credentials.password);
      if(user){
        if(user?.role==='host'){
          navigate('/host/dashboard');
          setIsLoading(false)
          return;
        }
        if(user?.role==='admin'){
          navigate('/admin/dashboard');
          setIsLoading(false)
          return;
        }
        window.location.href=('/');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };


  return (<>
  {isLoading? <Loading fullPage='true'/>:
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-5">
          <div className="card shadow-sm border-0">
            <div className="card-body p-5">
              <h3 className="text-center mb-4">{t('login')}</h3>
              <LoginForm onSubmit={handleLogin} />
              
              
            </div>
          </div>
        </div>
      </div>
    </div>}
    </>
  );
};

export default Login;
