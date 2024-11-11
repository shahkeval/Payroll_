import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './style/alladmin.css'; 

function AllAdmin() {
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updateFormData, setUpdateFormData] = useState({
    id: '',
    name: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();
  const logout = async () => {
    const confirmlogout = window.confirm(`Are you sure do you want to logout??`);
    if (!confirmlogout) {
      return;
    }
    navigate('/');
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('https://col-projectback.vercel.app/allAdmin');
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

  const handleDeleteClick = async (user) => {
    const confirmDelete = window.confirm(`Delete ${user.name}?`);
    if (!confirmDelete) {
      return;
    }

    try {
      const res = await axios.delete(`https://col-projectback.vercel.app/deleteAdmin/${user.id}`);
      console.log('Employee deleted successfully:', res.data);

      const updatedData = await axios.get('https://col-projectback.vercel.app/allAdmin');
      setAllUsers(updatedData.data);
    } catch (error) {
    }
  };

  const handleUpdateFormCencle = async (e) => {
    const updatedData = await axios.get('https://col-projectback.vercel.app/allAdmin');
    setAllUsers(updatedData.data);
    setSelectedUser(null);
    setUpdateFormData({
      id: '',
      name: '',
      email: '',
      password: '',
    });
  };

  const handleUpdateFormSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.put(`https://col-projectback.vercel.app/updateAdmin/${selectedUser.id}`, updateFormData);
    console.log('Employee updated successfully:', res.data);
    const updatedData = await axios.get('https://col-projectback.vercel.app/allAdmin');
    setAllUsers(updatedData.data);
    setSelectedUser(null);
    setUpdateFormData({
      id: '',
      name: '',
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
    <div className="alladmin">
    <div className='nav'>
      <a href="/Home" title='Home Page'>Home</a>
      <a href="/Emp" title='Create Employee Page'>Add Employee</a>
      <a href="/AllEmp" title='Employees Page'>All Employees</a>
      <a href="/Admin" title='Create Admin Page'>Add Admin</a>
      <a href="/AllAdmin" title='Admins Page'  className='active'>All Admins</a>
      <a href="/GenSal" title='Genrate Salary Page'>Genrate Salary</a>
      <a href="/LeaReq" title='Leave Page'>Leaves Info</a>
      <a href="#" onClick={() => logout()} title='Sign Out'>Sign Out</a>
    </div>
    <div className="side">
    {!selectedUser && (
      <div className="tblcontainer1">
      <table>
      <tr className='tblhead'>
                <th>Admin Id</th>
                <th>Admin Name</th>
                <th>Admin Email</th>
                <th>Admin Passowrd</th>
                <th colSpan={2}>Action</th>
            </tr>
        {allUsers.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.password}</td>
            <td><button title='Update' className='udp' onClick={() => handleUpdateClick(user)}>🖊️</button></td>
            <td><button title='Delete' className='dlt' onClick={() => handleDeleteClick(user)}>🗑️</button></td>
          </tr>
        ))}
      </table>
      </div>
    )}
      {selectedUser && (
      <div className="tblcontainer2">
        <h2>Update Admin Information</h2>
          <form method='get' onSubmit={handleUpdateFormSubmit}>
            <table>
                <tr><td align='right'>Admin ID :-</td><td><input onChange={handleUpdateFormChange} value={updateFormData.id} type="text" name='id' placeholder="Enter ID" disabled/></td></tr>
                <tr><td align='right'>Admin Name :-</td><td><input onChange={handleUpdateFormChange} value={updateFormData.name} type="text" name='name' placeholder="Enter Name" /></td></tr>
                <tr><td align='right'>Admin Email :-</td><td><input onChange={handleUpdateFormChange} value={updateFormData.email} type="text" name='email' placeholder="Enter Email" /></td></tr>
                <tr><td align='right'>Admin Password :-</td><td><input onChange={handleUpdateFormChange} value={updateFormData.password} type="text" name='password' placeholder="Enter Password" /></td></tr>
            </table>
            <div className="btns">
            <button type="submit">Update</button>
            <button onClick={handleUpdateFormCencle} type="button">Cancle</button>
            </div>
          </form>
        </div>
      )}
    </div>
    </div>
  );
}

export default AllAdmin;
