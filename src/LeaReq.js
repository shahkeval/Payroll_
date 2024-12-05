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
    const confirmlogout = window.confirm(`Are you sure do you want to logout?`);
    if (!confirmlogout) {
      return;
    }
    navigate('/');
  };

  const refresh = async () => {
    try {
      const res1 = await axios.get(`http://localhost:8001/allLeaveReq`);
      setAllSalreq(res1.data);
      const res2 = await axios.get(`http://localhost:8001/allLeaveApp`);
      setAllSalapp(res2.data);
      const res3 = await axios.get(`http://localhost:8001/allLeaveRej`);
      setAllSalrej(res3.data);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const [activeTable, setActiveTable] = useState('Request');

  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:8001/approveLeave/${id}`);
      refresh();
    } catch (error) {
      console.error('Error approving leave request:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(`http://localhost:8001/rejectLeave/${id}`);
      refresh();
    } catch (error) {
      console.error('Error rejecting leave request:', error);
    }
  };

  return (
    <div className='leavereq'>
      <div className='nav'>
        <a href="/Home" title='Home Page'>Home</a>
        <a href="/Emp" title='Create Employee Page'>Add Employee</a>
        <a href="/AllEmp" title='Employees Page'>All Employees</a>
        <a href="/Admin" title='Create Admin Page'>Add Admin</a>
        <a href="/AllAdmin" title='Admins Page'>All Admins</a>
        <a href="/GenSal" title='Generate Salary Page'>Generate Salary</a>
        <a href="/LeaReq" title='Leave Page' className='active'>Leaves Info</a>
        <a href="#" onClick={() => logout()} title='Sign Out'>Sign Out</a>
      </div>
      <div className="side">
        <div className="btnbar">
          <button onClick={() => { setActiveTable('Request'); refresh(); }} className={activeTable === 'Request' ? 'activeside' : ''}>Leave Requests</button>
          <button onClick={() => { setActiveTable('Approve'); refresh(); }} className={activeTable === 'Approve' ? 'activeside' : ''}>Approved Leave</button>
          <button onClick={() => { setActiveTable('Reject'); refresh(); }} className={activeTable === 'Reject' ? 'activeside' : ''}>Rejected Leave</button>
        </div>
        {activeTable === 'Request' && (
          <>
            {!allSalreq || allSalreq.length === 0 ? (
              <div className="notfound" title='Not Found'>
                <div className="icon">!</div>
                <div className="msg">
                  <h1>No leave requests found!<br/>Try again later.</h1>
                </div>
              </div>
            ) : (
              <div className="tbl">
                <table>
                  <tbody>
                    <tr>
                      <th>Leave Id</th>
                      <th>Employee Id</th>
                      <th>Leave Type</th> {/* New column for leave type */}
                      <th>Leave Reason</th>
                      <th>Leave Status</th>
                      <th>Start Date</th>
                      <th>Enad Date</th>
                      <th colSpan={2}>Response</th>
                    </tr>
                    {Array.isArray(allSalreq) ? (
                      allSalreq.map((user) => (
                        <tr key={user.id}>
                          <td>{user.id}</td>
                          <td>{user.eid}</td>
                          <td>{user.leave_type}</td> {/* Display leave type */}
                          <td>{user.reason}</td>
                          <td>{user.leave_status}</td>
                          <td>{user.dateofleave}</td>
                          <td>{user.endDate}</td>
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
                  <h1>No approved leave requests found!<br/>Check the requests section.</h1>
                </div>
              </div>
            ) : (
              <div className="tbl">
                <table>
                  <tbody>
                    <tr>
                      <th>Leave Id</th>
                      <th>Employee Id</th>
                      <th>Leave Type</th> 
                      <th>Leave Reason</th>
                      <th>Leave Status</th>
                      <th>Start Date</th>
                      <th>end date</th>
                    </tr>
                    {Array.isArray(allSalapp) ? (
                      allSalapp.map((user) => (
                        <tr key={user.id}>
                          <td>{user.id}</td>
                          <td>{user.eid}</td>
                          <td>{user.leave_type}</td>
                          <td>{user.reason}</td>
                          <td className='app'>Approved</td>
                          <td>{user.dateofleave}</td>
                          <td>{user.endDate}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6">Data is not an array.</td>
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
                  <h1>No rejected leave requests found!<br/>Check the requests section.</h1>
                </div>
              </div>
            ) : (
              <div className="tbl">
                <table>
                  <tbody>
                    <tr>
                    <th>Leave Id</th>
                      <th>Employee Id</th>
                      <th>Leave Type</th> 
                      <th>Leave Reason</th>
                      <th>Leave Status</th>
                      <th>Start Date</th>
                      <th>end date</th>
                    </tr>
                    {Array.isArray(allSalrej) ? (
                      allSalrej.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                          <td>{user.eid}</td>
                          <td>{user.leave_type}</td>
                          <td>{user.reason}</td>
                          <td className='app'>Rejected</td>
                          <td>{user.dateofleave}</td>
                          <td>{user.endDate}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6">Data is not an array.</td>
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