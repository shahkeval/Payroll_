import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './style/allemp.css'; 

function AllEmp() {
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPassword, setShowPassword] = useState(true);
  const [updateFormData, setUpdateFormData] = useState({
    id: '',
    name: '',
    gender: '',
    age: '',
    doj: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const logout = async () => {
    const confirmlogout = window.confirm('Are you sure do you want to logout??');
    if (!confirmlogout) {
      return;
    }
    navigate('/');
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('https://col-projectback.vercel.app/allEmps');
        setAllUsers(res.data);
      } catch (error) {
        console.error('Error fetching emps:', error);
      }
    };
    fetchData();
  }, []);

  const handleUpdateClick = (user) => {
    setSelectedUser(user);
    setUpdateFormData({
      id: user.id,
      name: user.name,
      gender: user.gender,
      age: user.age,
      doj: user.doj,
      email: user.email,
      password: user.password,
    });
  };

  const handleUpdateFormChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData({
      ...updateFormData,
      [name]: value,
    });
  };

  const  handleDeleteClick = async (user) => {
    const confirmDelete = window.confirm(`Delete ${user.name}?`);
    if (!confirmDelete) {
      return;
    }

    try {
      const res = await axios.delete(`https://col-projectback.vercel.app/deleteEmp/${user.id}`);
      console.log('Employee deleted successfully:', res.data);

      const updatedData = await axios.get('https://col-projectback.vercel.app/allEmps');
      setAllUsers(updatedData.data);
    } catch (error) {
    }
  };

  const handleUpdateFormCencle = async (e) => {
    const updatedData = await axios.get('https://col-projectback.vercel.app/allEmps');
    setAllUsers(updatedData.data);
    setSelectedUser(null);
    setUpdateFormData({
      id: '',
      name: '',
      gender: '',
      age: '',
      doj: '',
      email: '',
      password: ''
    });
  };
  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleUpdateFormSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.put(`https://col-projectback.vercel.app/updateEmp/${selectedUser.id}`, updateFormData);
    console.log('Employee updated successfully:', res.data);
    const updatedData = await axios.get('https://col-projectback.vercel.app/allEmps');
    setAllUsers(updatedData.data);
    setSelectedUser(null);
    setUpdateFormData({
      id: '',
      name: '',
      gender: '',
      age: '',
      doj: '',
      email: '',
      password: '',
    });
  } catch (error) {
    if (error.response) {
      console.error('Server error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error:', error.message);
    }
  }
};

  return (
    <div className='allemp'>
      <div className='nav'>
          <a href="/Home" title='Home Page'>Home</a>
          <a href="/Emp" title='Create Employee Page'>Add Employee</a>
          <a href="/AllEmp" title='Employees Page' className='active'>All Employees</a>
          <a href="/Admin" title='Create Admin Page'>Add Admin</a>
          <a href="/AllAdmin" title='Admins Page'>All Admins</a>
          <a href="/GenSal" title='Genrate Salary Page'>Genrate Salary</a>
          <a href="/LeaReq" title='Leave Page'>Leaves Info</a>
          <a href="#" onClick={() => logout()} title='Sign Out'>Sign Out</a>
        </div>
        <div className="side">
        {!selectedUser && (

        <div className="tblcontainer1">
      <table>
              <tr className='tblhead'>
                <th>Employee Id</th>
                <th>Employee Name</th>
                <th>Employee Gender</th>
                <th>Employee Age</th>
                <th>Employee Email</th>
                <th>Employee DOJ</th>
                <th>Employee Passowrd</th>
                <th colSpan={2}>Action</th>
            </tr>
        {allUsers.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.name}</td>
            <td>{user.gender}</td>
            <td>{user.age}</td>
            <td>{user.email}</td>
            <td>{user.doj}</td>
            <td>{user.password}</td>
            <td><button title='Update' className='udp' onClick={() => handleUpdateClick(user)}>🖊️</button></td>
            <td><button title='Delete' className='dlt' onClick={() => handleDeleteClick(user)}>🗑️</button></td>
          </tr>
        ))}
      </table>
        </div>
        )}

      {selectedUser && (
        <>
        <div className="tblcontainer2">
        <form method='post' action="" onSubmit={handleUpdateFormSubmit}>
              <h2 className='heading'>Update Employee Information</h2>
            <table>
            <tr><th colSpan={2}></th></tr>
                <tr><td align='right'>Emplyee ID :-</td><td><input onChange={handleUpdateFormChange} value={updateFormData.id} type="text" name='id' placeholder="Enter ID" disabled/></td></tr>
                <tr><td align='right'>Emplyee Name :-</td><td><input onChange={handleUpdateFormChange} value={updateFormData.name} type="text" name='name' placeholder="Enter Name" /></td></tr>
                <tr><td align='right'>Emplyee Gender :-</td><td><input onChange={handleUpdateFormChange} value={updateFormData.gender} type="text" name='gender' placeholder="Enter Gender" /></td></tr>
                <tr><td align='right'>Emplyee Age :-</td><td><input onChange={handleUpdateFormChange} value={updateFormData.age} type="text" name='age' placeholder="Enter Age" /></td></tr>
                <tr><td align='right'>Emplyee Email :-</td><td><input onChange={handleUpdateFormChange} value={updateFormData.email} type="text" name='email' placeholder="Enter Email" /></td></tr>
                <tr><td align='right'>Emplyee DOJ :-</td><td><input onChange={handleUpdateFormChange} value={updateFormData.doj} type="date" name='doj' placeholder="Enter DOJ" /></td></tr>
                <tr><td align='right'>Employee Password :</td><td><input onChange={handleUpdateFormChange} value={updateFormData.password} className='psw' type={showPassword ? 'text' : 'password'} name='password' placeholder='Enter Password' required/><button className='showhidebtn' type='button' onClick={handleTogglePassword}>{showPassword ? 'Hide' : 'Show'}</button></td></tr>
        </table>
        <div>
          <button className="rytsubmitbtn"  type="submit">Update</button>
          <button className="lefsubmitbtn" onClick={handleUpdateFormCencle} type="button">Cancle</button>
        </div>
        </form>
        </div>
        </>
      )}
      </div>
    </div>
  );
}

export default AllEmp;
