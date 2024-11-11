import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './style/leareqemp.css'; 

export default function LeaReqEmp() {
  const { id } = useParams();
  const [allSal, setAllSal] = useState([]);
  const [formValues, setFormValues] = useState({
    id: '',
    eid: id,
    leave_status: 'pending',
    reason: '',
    dateofleave: '',
  });
  const [activeTable, setActiveTable] = useState('Leave');

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
        const res = await axios.get(`https://col-projectback.vercel.app/oneLeave/${id}`);
        setAllSal(res.data);
      } catch (error) {
        console.error('Error fetching salaries:', error);
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const generateRandomString = (length) => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      result += charset[randomIndex];
    }
    return result;
  };

  useEffect(() => {
    // Generate a random Employee ID when the component loads
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      id: generateRandomString(8), // Change the length as needed
    }));
  }, []);


  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post('https://col-projectback.vercel.app/leave', formValues)
      .then(async (result) => {
        console.log(result);
        setFormValues({
          id: generateRandomString(8),
          eid: id,
          leave_status: 'pending',
          reason: '',
          dateofleave: '',
        });
        const res = await axios.get(`https://col-projectback.vercel.app/oneLeave/${id}`);
        setAllSal(res.data);
      })
      .catch((err) => {
        if (err.response && err.response.status === 400) {
          alert(err.response.data.error);
        } else {
          console.error(err);
        }
      });
  };

  return (
    <div className='levreqemp'>
      <div className='nav'>
        <Link to={`/HomeEmp/${id}`} >Home</Link>
        <Link to={`/SalRep/${id}`} >Salary Report</Link>
        <Link to={`/LeaReqEmp/${id}`} className='active'>Leave Request</Link>
        <a href="#" onClick={() => logout()} title='Sign Out'>Sign Out</a>
      </div>
      <div className="side">
        <div className="btnbar">
          <button onClick={() => setActiveTable('Leave')}  className={activeTable === 'Leave' ? 'activetbl' : ''}>My Leaves</button>
          <button onClick={() => setActiveTable('Apply')}  className={activeTable === 'Apply' ? 'activetbl' : ''}>Apply Leave</button>
        </div>
      {activeTable === 'Apply' && (
        <div className="applyside">
        <form method="post" onSubmit={handleSubmit}>
          <table>
            <tbody>
              <tr>
                <td align="right">Leave ID :</td>
                <td>
                  <input
                    onChange={handleInputChange}
                    value={formValues.id}
                    required
                    type="text"
                    name="id"
                    placeholder="Enter Leave ID"
                    disabled
                  />
                  <input
                    value={id}
                    required
                    type="hidden"
                    name="eid"
                    placeholder="Enter ID"
                  />
                  <input
                    value={formValues.leave_status}
                    required
                    type="hidden"
                    name="leave_status"
                    placeholder="Gross Salary"
                    disabled
                  />
                </td>
              </tr>
              <tr>
                <td align="right">Leave Reason:</td>
                <td>
                  <input
                    onChange={handleInputChange}
                    value={formValues.reason}
                    required
                    type="text"
                    name="reason"
                    placeholder="Enter Leave Reason"
                  />
                </td>
              </tr>
              <tr>
                <td align="right">Date Of Leave :</td>
                <td>
                  <input
                    onChange={handleInputChange}
                    value={formValues.dateofleave}
                    required
                    type="Date"
                    name="dateofleave"
                    placeholder="Total Salary"
                  />
                </td>
              </tr>
              <tr>
                <td align="right" colSpan={2} height={40}>
                  <button>Apply</button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
        </div>
      )}
            {activeTable === 'Leave' && (
              <div className="leaveside">
        <table width='100%'>
          <tbody>
            <tr>
              <th>Leave Id</th>
              <th>Employee Id</th>
              <th>Leave Reason</th>
              <th>Leave Status</th>
              <th>Date Of Leave</th>
            </tr>
            {Array.isArray(allSal) ?
              allSal.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.eid}</td>
                  <td>{item.reason}</td>
                  <td className={ item.leave_status === "rejected" ? "rej" : item.leave_status === "approved" ? "app" : "pan" }>{item.leave_status === "rejected" ? "Rejected" : item.leave_status === "approved" ? "Approved" : "Pending" }</td>
                  <td>{item.dateofleave}</td>
                </tr>
              )) :
              <tr key={allSal.id}>
                  <td>{allSal.id}</td>
                  <td>{allSal.eid}</td>
                  <td>{allSal.reason}</td>
                  <td className={ allSal.leave_status === "rejected" ? "rej" : allSal.leave_status === "approved" ? "app" : "pan" }>{allSal.leave_status === "rejected" ? "rej" : allSal.leave_status === "approved" ? "app" : "pan"}</td>
                  <td>{allSal.dateofleave}</td>
                </tr>
              }
          </tbody>
        </table>
        </div>
            )}
      </div>
    </div>
  );
}
