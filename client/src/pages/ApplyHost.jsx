import { useEffect, useState } from 'react';
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { useAuth } from "../contexts/AuthContext";
import { set } from 'date-fns';
import Loading from '../components/common/Loading';
import { userAPI } from '../services/api';

const ApplyHost = () => {
    const {user}=useAuth();
    const [loading,setIsLoading]=useState(false)
    const [applicationSubmitted, setApplicationSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        email: user?.email||"",
        password: "",
        agreedToTerms: false,
    });

    useEffect(()=>{
        if(user){
            if(user.role==='host'){
                setApplicationSubmitted(true);
            }
        }
    },[user])

    const handleSubmit = async(e) => {
        setIsLoading(true)

        e.preventDefault();
        // Handle form submission logic here
        console.log("Form submitted with data:",formData);
        // setApplicationSubmitted(true);

        try {

            const response=await userAPI.applyHost(user._id);
            console.log(response);
            if(response.status===200){
                setApplicationSubmitted(true);
            }
        
        } catch (error) {
            
        }
        
        setInterval(() => {
            setIsLoading(false)
        }, 3000)
    }

    if(loading){
        return <Loading/>
    }
  return (
  
    <>
      {!applicationSubmitted ?
      <div className="container mt-5 mb-5 mx-auto px-5 py-5 border rounded shadow-sm">
        <div className="flex justify-center my-2 py-2 h-screen">
          <h1 className="d-flex justify-content-center text-4xl font-bold items-center">Apply to become a Host</h1>
        </div>
        <p className="text-center text-gray-500 mb-5">
        Only for guest accounts
        </p>
        <hr/>
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto my-5" title="s">
          
         {!user && <><Input
            label="Email"
            type="email"
            name="email"
            id="email"
            value={formData?.email}
            onChange={(e)=>setFormData({...formData,email:e.target.value})}
            // value={formData.email}
            // onChange={handleChange}
            // error={errors.email}
            icon="envelope"
            required
          />

           <Input
            label="Password"
            type="password"
            name="password"
            id="password"
            value={formData?.password}
            onChange={(e)=>setFormData({...formData, password:e.target.value})}
            // onChange={handleChange}
            // error={errors.password}
            // helpText="Must be at least 8 characters"
            icon="lock"
            required
          />
          </>}
          {user && 
          <div className='text-center mb-3'>
            <i className='d-flex justify-content-center bi bi-check-circle-fill  text-success' style={{ fontSize: '2rem' }} />
            You are already logged in as {user.email}
            </div>

          }



          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="agreedToTerms"
              name="agreedToTerms"
              value={formData?.agreedToTerms}
              onChange={(e)=>setFormData({...formData, agreedToTerms:e.target.checked})}
              defaultChecked={false}
              required
              //   checked={formData.agreedToTerms}
              //   onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="agreedToTerms">
              I agree to the{" "}
              <a href="#" className="text-decoration-none">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-decoration-none">
                Privacy Policy
              </a>
            {" "} to become the host
            </label>
            {/* {errors?.agreedToTerms && (
          <div className="text-danger small mt-1">{errors?.agreedToTerms}</div>
        )} */}
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            // loading={loading}
          >
            Apply
          </Button>
        </form>
      </div>
      :
      <div className='container mt-5 mb-5'>
        <i className='d-flex justify-content-center my-3 bi bi-check-circle-fill text-success' style={{ fontSize: '7rem' }} />
        <div className='flex justify-center h-screen'>
        <h1 className='text-center'>Thank you for applying to become a host!</h1>
        <p className='text-center'>We will review your application and get back to you soon.</p>
</div>
      </div>
}    </>
    
  );
};

export default ApplyHost;
