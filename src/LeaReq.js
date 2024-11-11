import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './style/leareq.css'; 

export default function LeaReq() {
  const [allSalreq, setAllSalreq] = useState([]);
  const [allSalapp, setAllSalapp] = useState([]);
  const [allSalrej, setAllSalrej] = useState([]);

  const navigate = useNavigate();
  const logout = async () => {
    const confirmlogout = window.confirm(`Are you sure do you want to logout??`);
    if (!confirmlogout) {
      return;
    }
    navigate('/');
  }

  const refresh = async () => {
    try {
      const res1 = await axios.get(`https://col-projectback.vercel.app/allLeaveReq`);
      setAllSalreq(res1.data);
      const res2 = await axios.get(`https://col-projectback.vercel.app/allLeaveApp`);
      setAllSalapp(res2.data);
      const res3 = await axios.get(`https://col-projectback.vercel.app/allLeaveRej`);
        setAllSalrej(res3.data);
    } catch (error) {
      console.error('Error fetching salaries:', error);
    }
  };
  useEffect(() => {
    refresh();    
  }, []);

  const [activeTable, setActiveTable] = useState('Request');
  
  const handleApprove = async (id) => {
    try {
      await axios.put(`https://col-projectback.vercel.app/approveLeave/${id}`);
      refresh();
    } catch (error) {
      console.error('Error approving leave request:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(`https://col-projectback.vercel.app/rejectLeave/${id}`);
      refresh();
    } catch (error) {
      console.error('Error rejecting leave request:', error);
    }
  };

  return (
    <div className='leavereq' >
      <div className='nav'>
      <a href="/Home" title='Home Page'>Home</a>
      <a href="/Emp" title='Create Employee Page'>Add Employee</a>
      <a href="/AllEmp" title='Employees Page'>All Employees</a>
      <a href="/Admin" title='Create Admin Page'>Add Admin</a>
      <a href="/AllAdmin" title='Admins Page'>All Admins</a>
      <a href="/GenSal" title='Genrate Salary Page'>Genrate Salary</a>
      <a href="/LeaReq" title='Leave Page'  className='active'>Leaves Info</a>
      <a href="#" onClick={() => logout()} title='Sign Out'>Sign Out</a>
    </div>
    <div className="side">
      <div className="btnbar">
        <button onClick={() => {setActiveTable('Request'); refresh();}}  className={activeTable === 'Request' ? 'activeside' : ''}>Leave Requests </button>
        <button onClick={() => {setActiveTable('Approve'); refresh();}}  className={activeTable === 'Approve' ? 'activeside' : ''}>Approve Leave</button>
        <button onClick={() => {setActiveTable('Reject'); refresh();}}  className={activeTable === 'Reject' ? 'activeside' : ''}>Reject Leave</button>
      </div>
    {activeTable === 'Request' && (
      <>
        {!allSalreq || allSalreq.length === 0 ? (
          <div className="notfound" title='Not Found'>
            <div className="icon">!</div>
            <div className="msg">
              <h1>Not any request yet!<br/>Try Again After some movement</h1>
            </div>
          </div>
        ) : (
      <div className="tbl">
      <table>
        <tbody>
          <tr>
            <th>Leave Id</th>
            <th>Employee Id</th>
            <th>Leave Reason</th>
            <th>Leave Status</th>
            <th>Date Of Leave</th>
            <th colSpan={2}>Response</th>
          </tr>
          {Array.isArray(allSalreq) ? (
          allSalreq.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.eid}</td>
            <td>{user.reason}</td>
            <td>{user.leave_status}</td>
            <td>{user.dateofleave}</td>
            <td><button onClick={() => handleApprove(user.id)} className='appbtn'>Approve</button></td>
            <td><button onClick={() => handleReject(user.id)} className='rejbtn'>Reject</button></td>
          </tr>
          ))
          ) : (
            <tr>
              <td colSpan="7">Data is not an array.</td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
        )}
        </>
    )}
    {activeTable === 'Approve' && (
      <>
      {!allSalapp || allSalapp.length === 0 ? (
          <div className="notfound" title='Not Found'>
            <div className="icon">!</div>
            <div className="msg">
              <h1>Not any approved leave yet!<br/>Go and Check requests</h1>
            </div>
          </div>
        ) : (
      <div className="tbl">
      <table>
        <tbody>
          <tr>
            <th>Leave Id</th>
            <th>Employee Id</th>
            <th>Leave Reason</th>
            <th>Leave Status</th>
            <th>Date Of Leave</th>
          </tr>
          {Array.isArray(allSalapp) ? (
          allSalapp.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.eid}</td>
            <td>{user.reason}</td>
            <td className={user.leave_status === 'approved' ? 'app' : user.leave_status === 'rejected' ? 'rej' : ''}>Approved</td>
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
      </div>
        )}
      </>
    )}
    {activeTable === 'Reject' && (
      <>
      {!allSalrej || allSalrej.length === 0 ? (
          <div className="notfound" title='Not Found'>
            <div className="icon">!</div>
            <div className="msg">
              <h1>Not any rejected leave yet!<br/>Go and Check requests</h1>
            </div>
          </div>
        ) : (
      <div className="tbl">
      <table>
        <tbody>
          <tr>
            <th>Leave Id</th>
            <th>Employee Id</th>
            <th>Leave Reason</th>
            <th>Leave Status</th>
            <th>Date Of Leave</th>
          </tr>
          {Array.isArray(allSalrej) ? (
          allSalrej.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.eid}</td>
            <td>{user.reason}</td>
            <td className={user.leave_status === 'approved' ? 'app' : user.leave_status === 'rejected' ? 'rej' : ''}>Rejected</td>
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
      </div>
        )}
        </>
    )}
      </div>
    </div>
  );
}
