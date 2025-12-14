import { useNavigate } from 'react-router-dom';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, userAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user'))||null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate=useNavigate();

  const updatedUser=async()=>{
    const response=await userAPI.getProfile(user?._id);
    setUser(response.data);
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  }

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    
    setLoading(false);
    checkAuth();
    // updatedUser()
    
  }, []);

  const checkAuth=async () => {
    if(!user?._id||!user){
      setUser(null)
      localStorage.setItem('user', null)
      setIsAuthenticated(false);
      return
    }
    const id=await ((JSON.parse(localStorage.getItem('user')))?._id || user?._id)
    const response=await authAPI.checkAuth(id);
     setUser(response.data.user);
     localStorage.setItem('user', JSON.stringify(response.data.user))
      setIsAuthenticated(true);
  }
  const login = async (email, password) => {
    const credentials={
      email,
      password
    }
    const response=await authAPI.login(credentials)
    if(response.data){
    const user=response.data.user
    setUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(user));
    return user;
    }

    
    
  };

  const register = async (userData) => {
   try{ 
    const response=await authAPI.register(userData)
    if(response.data){
    const newUser=response.data
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(newUser)||'');
    return newUser;
    }
    else{
      console.log("no response from the server")

    }
  }
    catch(error){
      console.error(error)
      return null;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    navigate('/')
  };

  const updateProfile =async (userId,formData) => {
    // const updatedUser = { ...user, ...updates };
    try{
//       for (const pair of formData.entries()) {
//   console.log(`${pair[0]}: ${pair[1]}`);
// }
if(!formData){
  return 
}
      const response=await userAPI.updateProfile(userId,formData)
  

    if(response.status===200){
      setUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
      else if(response.status===500){
        alert(response?.data?.message)
      console.log("error updating profile response from the server")
    }
  }
    
    catch(error){
      alert(error)
      console.error(error)

    }
   
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateProfile,
    setUser,
    setIsAuthenticated
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};