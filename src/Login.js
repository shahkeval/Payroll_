import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './style/login.css'; 
export default function Login() {
  const navigate = useNavigate();

  const redirectToHomeAd = () => {
    navigate('/Home');
  };

  const redirectToHomeEmp = (id) => {
    navigate(`/HomeEmp/${id}`);
  };
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleLogin = async (role) => {
    try {
      const response = await axios.post(`http://localhost:8001/login/${role}`, formData);
      console.log(response.data);
      if (response.data.message === "Employee authentication successful") {
        redirectToHomeEmp(response.data.user.id);
      } else {
        redirectToHomeAd();
      }
    } catch (error) {
      console.error('Login error:', error);
      alert("Login Id Or Password Wrong! Try Again!")
    }
  };

  return (
   <center> <div className='login'>
    <div>
      <h1>Login</h1>
    </div>
      <table>
        <tr>
          <td>
            <input
              type='text'
              name='email'
              value={formData.email}
              maxLength={30}
              onChange={handleChange}
              required
              placeholder='Email ID'
            />
          </td>
        </tr>
        <tr>
          <td>
            <input
              type={showPassword ? 'text' : 'password'}
              name='password'
              maxLength={20}
              value={formData.password}
              onChange={handleChange}
              required
              placeholder='Password'
            />
            <div  onClick={handleTogglePassword}>
              {showPassword ? '👁️‍🗨️' : '👁️'}

              <a href='./forgot-password'>ForgotPassword</a>
            </div>
          </td>
        </tr>
      </table>
      <div  onClick={() => handleLogin('employee')}>

        
        <div >
          <div >
          <h1><button>Emloyeee</button></h1>
          </div>
        </div>
      </div>
      <div  onClick={() => handleLogin('admin')}>
        <div ></div>
        <div >
          <div >
          <h1><button>Admin</button></h1>

            
          </div>
        </div>
      </div>
    </div>
    </center>
  );
}
