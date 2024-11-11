import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './style/home.css'; 

function Home() {
  const [allUsers, setAllUsers] = useState([]);
  const [allAdmin, setAllAdmin] = useState([]);
  const [allSalary, setAllSalary] = useState([]);
  const [allLea, setAllLea] = useState([]);

  const [activeTable, setActiveTable] = useState('Employee');

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
        if (activeTable === 'Employee') {
          const res1 = await axios.get('https://col-projectback.vercel.app/allEmps');
          setAllUsers(res1.data);
        } else if (activeTable === 'Admin') {
          const res2 = await axios.get('https://col-projectback.vercel.app/allAdmin');
          setAllAdmin(res2.data);
        } else if (activeTable === 'Salary') {
          const res3 = await axios.get('https://col-projectback.vercel.app/allSalary');
          setAllSalary(res3.data);
        } else if (activeTable === 'Leave') {
          const res4 = await axios.get('https://col-projectback.vercel.app/allLeave');
          setAllLea(res4.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [activeTable]);
  

  
  return (
    <div className='home'>
      <div className='nav'>
          <a href="/Home" title='Home Page' className='active'>Home</a>
          <a href="/Emp" title='Create Employee Page'>Add Employee</a>
          <a href="/AllEmp" title='Employees Page'>All Employees</a>
          <a href="/Admin" title='Create Admin Page'>Add Admin</a>
          <a href="/AllAdmin" title='Admins Page'>All Admins</a>
          <a href="/GenSal" title='Genrate Salary Page'>Genrate Salary</a>
          <a href="/LeaReq" title='Leave Page'>Leaves Info</a>
          <a href="#" onClick={() => logout()} title='Sign Out'>Sign Out</a>
        </div>
        <div className="side">
          <div className="allbtns">
            <button onClick={() => setActiveTable('Employee')}  className={activeTable === 'Employee' ? 'activetbl' : ''}>Employee Table</button>
            <button onClick={() => setActiveTable('Admin')}  className={activeTable === 'Admin' ? 'activetbl' : ''}>Admin Table</button>
            <button onClick={() => setActiveTable('Salary')}  className={activeTable === 'Salary' ? 'activetbl' : ''}>Salary Table</button>
            <button onClick={() => setActiveTable('Leave')}  className={activeTable === 'Leave' ? 'activetbl' : ''}>Leave Table</button>
          </div>
          <div className="tblcontainer">
            {activeTable === 'Employee' && (
              <table>
              <tr className='heading'>
                  <th colSpan={10} height={40}>Employee Table</th>
              </tr>
              <tr className='tblhead'>
                <th>Employee Id</th>
                <th>Employee Name</th>
                <th>Employee Gender</th>
                <th>Employee Age</th>
                <th>Employee Email</th>
                <th>Employee DOJ</th>
                <th>Employee Passowrd</th>
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
                </tr>
              ))}
            </table>
            )}
      
        
      
      {activeTable === 'Admin' && (
      <table>
      <tr className='heading'>
            <th  colSpan={10} height={40}>Admin Table</th>
      </tr>
              <tr className='tblhead'>
                <th>Admin Id</th>
                <th>Admin Name</th>
                <th>Admin Email</th>
                <th>Admin Passowrd</th>
            </tr>
        {allAdmin.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.password}</td>
          </tr>
        ))}
      </table>
      )}
      {activeTable === 'Salary' && (
      <table>
      <tr className='heading'>
            <th colSpan={10} height={40}>Salary Table</th>
        </tr>
        <tr className='tblhead'>
          <th>Salary Id</th>
          <th>Employee Id</th>
          <th>Gross Salary</th>
          <th>Salary Tax</th>
          <th>Total Salary</th>
        </tr>
        {allSalary.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.s_eid}</td>
            <td>{user.g_sal}</td>
            <td>{user.t_sal}</td>
            <td>{user.sal_amt}</td>
          </tr>
        ))}
      </table>
      )}
      {activeTable === 'Leave' && (
      <table>
        <tbody>
          <tr className='heading'>
            <th colSpan={10} height={40}>Leave Table</th>
          </tr>
          <tr className='tblhead'>
            <th>Leave Id</th>
            <th>Employee Id</th>
            <th>Leave Reason</th>
            <th>Leave Status</th>
            <th>Date Of Leave</th>
          </tr>
          {Array.isArray(allLea) ? (
          allLea.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.eid}</td>
            <td>{user.reason}</td>
            <td className={user.leave_status === 'approved' ? 'appstate' : user.leave_status === 'rejected' ? 'rejstate': 'panstate'}>{user.leave_status}</td>
            <td>{user.dateofleave}</td>
          </tr>
          ))
          ) : (
            <tr>
              <td colSpan="7">Data is not an array.</td>
            </tr>
          )}
        </tbody>
      </table>
      )}
          </div>
      </div>        
    </div>
  );
}

export default Home;
