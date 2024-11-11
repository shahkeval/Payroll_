import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './style/homeemp.css'; 

function HomeEmp() {
  const { id } = useParams();
  const [allUsers, setAllUsers] = useState([]);
  const [instate, setinstate] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
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
    const confirmlogout = window.confirm(`Are you sure do you want to logout??`);
    if (!confirmlogout) {
      return;
    }
    navigate('/');
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`https://col-projectback.vercel.app/oneEmp/${id}`);
        setAllUsers(res.data);
      } catch (error) {
        console.error('Error fetching emps:', error);
      }
    };

    fetchData();
  }, [id]);

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
    setinstate(true);
    const { name, value } = e.target;
    setUpdateFormData({
      ...updateFormData,
      [name]: value,
    });
  };

  const handleUpdateFormCencle = async (e) => {
    const updatedData = await axios.get(`https://col-projectback.vercel.app/oneEmp/${id}`);
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

  const handleUpdateFormSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.put(`https://col-projectback.vercel.app/updateEmp/${selectedUser.id}`, updateFormData);
    console.log('Employee updated successfully:', res.data);
    const updatedData = await axios.get(`https://col-projectback.vercel.app/oneEmp/${id}`);
    setAllUsers(updatedData.data);
    setSelectedUser(null);
    setinstate(false);
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
    <div className='homeemp'>
      <div className='nav'>
      <Link to={`/HomeEmp/${id}`} className='active'>Home</Link>
      <Link to={`/SalRep/${id}`}>Salary Report</Link>
      <Link to={`/LeaReqEmp/${id}`}>Leave Request</Link>
      <a href="#" onClick={() => logout()} title='Sign Out'>Sign Out</a>
      </div>
        <div className="side">
          <div className="tblcontainer">
          <table>
            <tr>
              <th>Employee Id</th>
              <td>{allUsers.id}</td>
            </tr>
            <tr>
              <th>Employee Name</th>
              <td>{allUsers.name}</td>
            </tr>
            <tr>
              <th>Employee Gender</th>
              <td>{allUsers.gender}</td>
            </tr>
            <tr>
              <th>Employee Age</th>
              <td>{allUsers.age}</td>
              </tr>
            <tr>
              <th>Employee Email</th>
              <td>{allUsers.email}</td>
              </tr>
            <tr>
              <th>Employee DOJ</th>
              <td>{allUsers.doj}</td>
              </tr>
            <tr>
              <th>Employee Passowrd</th>
              {!selectedUser && (
                <>
                  <td>{allUsers.password}</td>
                  <button type='button' onClick={() => handleUpdateClick(allUsers)}>Change</button>
                </>
              )}
              {selectedUser && (
                <>
                <td><input maxLength={13} autoComplete='off' onChange={handleUpdateFormChange} value={updateFormData.password} type="text" name='password' placeholder="Enter Password" /></td>
                    <button type={instate ? "Submit" : "Button"} onClick={instate ? handleUpdateFormSubmit : handleUpdateFormCencle}>
                      {instate? "Change" : "Cencle"}
                    </button>
                </>
              )}
            </tr>
      </table>
      </div>
      </div>
    </div>
  );
}

export default HomeEmp;
