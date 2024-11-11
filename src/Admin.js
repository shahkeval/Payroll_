import { useNavigate } from 'react-router-dom';
import React, { useState , useEffect } from 'react';
import axios from 'axios';
import './style/admin.css'; 

function Admin() {
    const navigate = useNavigate();
  const redirectToAllEmp = () => {
    navigate('/AllAdmin');
  };
  const logout = async () => {
    const confirmlogout = window.confirm(`Are you sure do you want to logout??`);
    if (!confirmlogout) {
      return;
    }
    navigate('/');
  }
    const initialValues = {  id: '',
                            name: '',
                            gender: '',
                            age: '',
                            doj: '',
                            email: '',
                            password: ''
                        };
    const [formValues, setFormValues] = useState(initialValues);
    const [showPassword, setShowPassword] = useState(true);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormValues({ ...formValues, [name]: value });
    };

    useEffect(() => {
      // Generate a random Employee ID when the component loads
      setFormValues((prevFormValues) => ({
        ...prevFormValues,
        id: generateRandomString(8), // Change the length as needed
      }));
    }, []);

    const generateRandomString = (length) => {
      const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        result += charset[randomIndex];
      }
      return result;
    };
  
    const handleTogglePassword = () => {
      setShowPassword((prevShowPassword) => !prevShowPassword);
    };
    
    const handleSubmit = (e) => {    
        e.preventDefault();
        axios.post("https://col-projectback.vercel.app/Admin",
        {  id: formValues.id,
        name: formValues.name,
        gender: formValues.gender,
        age: formValues.age,
        doj: formValues.doj,
        email: formValues.email,
        password: formValues.password
        })
        .then((result) => {
            console.log(result);
            redirectToAllEmp(); 
          })
          .catch((err) => {
            if (err.response && err.response.status === 400) {
              alert('Admin Id already exist');
            }
            else{
              console.log(err);
            }
          });
    };
    return (
        <div className="admin">
        <div className='nav'>
          <a href="/Home" title='Home Page'>Home</a>
          <a href="/Emp" title='Create Employee Page'>Add Employee</a>
          <a href="/AllEmp" title='Employees Page'>All Employees</a>
          <a href="/Admin" title='Create Admin Page' className='active'>Add Admin</a>
          <a href="/AllAdmin" title='Admins Page'>All Admins</a>
          <a href="/GenSal" title='Genrate Salary Page'>Genrate Salary</a>
          <a href="/LeaReq" title='Leave Page'>Leaves Info</a>
          <a href="#" onClick={() => logout()} title='Sign Out'>Sign Out</a>
        </div>
        <div className="side">
          <div className="admincontainer">
            <h2>Create new Admin</h2>
            <form method='post' action="" onSubmit={handleSubmit}>
              <table>
                  <tr><td align='right'>Admin ID :-</td><td><input onChange={handleChange} value={formValues.id} type="text" name='id' placeholder="Enter ID" required/></td></tr>
                  <tr><td align='right'>Admin Name :-</td><td><input onChange={handleChange} value={formValues.name} type="text" name='name' placeholder="Enter Name" required/></td></tr>
                  <tr><td align='right'>Admin Email :-</td><td><input onChange={handleChange} value={formValues.email} type="email" name='email' placeholder="Enter Email" required/></td></tr>
                  <tr><td align='right'>Admin Password :-</td><td><input onChange={handleChange} value={formValues.password} type={showPassword ? 'text' : 'password'} name='password' placeholder="Enter Password" required/>
                  <button className='showhidebtn' type='button' onClick={handleTogglePassword}>{showPassword ? 'Hide' : 'Show'}</button></td></tr>
              </table>
              <button className='subbtn'>Create</button>
            </form>
          </div>
          
        
        </div>
        </div>
    );
}

export default Admin;
