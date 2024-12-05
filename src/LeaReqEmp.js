import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './style/leareqemp.css';

export default function LeaReqEmp() {
  const { id } = useParams();
  const [allSal, setAllSal] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState(['Sick Leave', 'Casual Leave', 'Annual Leave']);
  const [formValues, setFormValues] = useState({
    id: '',
    eid: id,
    leave_type: '',
    leave_status: 'pending',
    reason: '',
    dateofleave: '',
    endDate: '',
  });
  const [activeTable, setActiveTable] = useState('Leave');
  const [exceededLeaves, setExceededLeaves] = useState({
    "Sick Leave": 0,
    "Casual Leave": 0,
    "Annual Leave": 0,
  });
  useEffect(() => {
    const calculateExceededLeaves = () => {
      const leaveCounts = {}; // Track leave usage per type
  
      // Loop through all leaves and only count approved ones
      allSal.forEach((leave) => {
        if (leave.leave_status === "approved") {
          const start = new Date(leave.dateofleave);
          const end = new Date(leave.endDate);
          const days = (end - start) / (1000 * 3600 * 24) + 1; // Calculate leave days
  
          if (!leaveCounts[leave.leave_type]) {
            leaveCounts[leave.leave_type] = 0; // Initialize if not present
          }
  
          leaveCounts[leave.leave_type] += days; // Add days for the specific leave type
        }
      });
  
      // Check for exceeded days only for leave types
      const exceeded = {
        "Sick Leave": 0,
        "Casual Leave": 0,
        "Annual Leave": 0,
      };
  
      Object.entries(leaveCounts).forEach(([type, count]) => {
        if (count > 5) {
          exceeded[type] = count - 5; // Only include exceeded days
        } else {
          exceeded[type] = 0; // If within the limit, no exceeded days
        }
      });
  
      setExceededLeaves(exceeded); // Update state with exceeded leaves
    };
  
    calculateExceededLeaves();
  }, [allSal]); // Trigger whenever leave data changes
  
  const maxLeavesPerType = 5;
  const navigate = useNavigate();

  const logout = async () => {
    const confirmlogout = window.confirm(`Are you sure do you want to logout?`);
    if (!confirmlogout) {
      return;
    }
    navigate('/');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:8001/oneLeave/${id}`);
        setAllSal(res.data);
      } catch (error) {
        console.error('Error fetching leaves:', error);
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
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      id: generateRandomString(8),
    }));
  }, []);

  const calculateLeaveDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end - start;
    const dayDiff = timeDiff / (1000 * 3600 * 24);
    return dayDiff + 1; // Include the start day
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const days = calculateLeaveDays(formValues.dateofleave, formValues.endDate);
  
    if (days <= 0) {
      alert("Invalid leave duration. Please check your dates.");
      return;
    }
  
    // Calculate approved leaves for the selected leave type
    const approvedLeaves = allSal.filter(
      (leave) =>
        leave.leave_type === formValues.leave_type &&
        leave.leave_status === 'approved' // Only consider approved leaves
    );
  
    const currentUsage = approvedLeaves.reduce((total, leave) => {
      const start = new Date(leave.dateofleave);
      const end = new Date(leave.endDate);
      const leaveDays = (end - start) / (1000 * 3600 * 24) + 1;
      return total + leaveDays;
    }, 0);
  
    const newUsage = currentUsage + days;
  
    // Check if leave type exceeds the limit
    if (newUsage > maxLeavesPerType) {
      const exceedDays = newUsage - maxLeavesPerType;
      const confirmExceed = window.confirm(
        `You have exceeded the limit for ${formValues.leave_type}. \n` +
        `If you proceed, ₹350 per day will be deducted from your salary. \n` +
        "Do you still want to apply for this leave?"
      );
  
      if (!confirmExceed) {
        return; // Cancel submission if user does not confirm
      }
    }
  
    // Calculate remaining leaves and notify the user
    const remainingLeaves = Math.max(0, maxLeavesPerType - newUsage);
    const confirmSubmission = window.confirm(
      `You are applying for ${formValues.leave_type}. \n` +
      `Leave Days Requested: ${days} \n` +
      `Remaining Approved Leaves After Submission: ${remainingLeaves}`
    );
  
    if (!confirmSubmission) {
      return; // User cancels submission
    }
  
    // Submit the leave
    axios
      .post('http://localhost:8001/leave', formValues)
      .then(async (result) => {
        console.log(result);
  
        // Update exceeded leave count only if the new usage exceeds the limit
        if (newUsage > maxLeavesPerType) {
          setExceededLeaves((prevExceededLeaves) => ({
            ...prevExceededLeaves,
            [formValues.leave_type]:
              prevExceededLeaves[formValues.leave_type] + (newUsage - maxLeavesPerType),
          }));
        }
  
        // Reset form values and fetch updated data
        setFormValues({
          id: generateRandomString(8),
          eid: id,
          leave_type: '',
          leave_status: 'pending',
          reason: '',
          dateofleave: '',
          endDate: '',
        });
  
        const res = await axios.get(`http://localhost:8001/oneLeave/${id}`);
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
        <Link to={`/HomeEmp/${id}`}>Home</Link>
        <Link to={`/SalRep/${id}`}>Salary Report</Link>
        <Link to={`/LeaReqEmp/${id}`} className='active'>Leave Request</Link>
        <a href="#" onClick={() => logout()} title='Sign Out'>Sign Out</a>
      </div>
      <div className="side">
        <div className="btnbar">
          <button onClick={() => setActiveTable('Leave')} className={activeTable === 'Leave' ? 'activetbl' : ''}>My Leaves</button>
          <button onClick={() => setActiveTable('Apply')} className={activeTable === 'Apply' ? 'activetbl' : ''}>Apply Leave</button>
        </div>
        {activeTable === 'Apply' && (
          <div className="applyside">
            <form method="post" onSubmit={handleSubmit}>
              <table>
                <tbody>
                  <tr>
                    <td align="right">Leave ID :</td>
                    <td>
                      <input value={formValues.id} disabled />
                      <input value={id} type="hidden" name="eid" />
                      <input value={formValues.leave_status} type="hidden" name="leave_status" disabled />
                    </td>
                  </tr>
                  <tr>
                    <td align="right">Leave Type:</td>
                    <td>
                      <select onChange={handleInputChange} value={formValues.leave_type} name="leave_type" required>
                        <option value="">Select Leave Type</option>
                        {leaveTypes.map((type, index) => (
                          <option key={index} value={type}>{type}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td align="right">Leave Reason:</td>
                    <td>
                      <input onChange={handleInputChange} value={formValues.reason} required type="text" name="reason" />
                    </td>
                  </tr>
                  <tr>
                    <td align="right">Start Date:</td>
                    <td>
                      <input onChange={handleInputChange} value={formValues.dateofleave} required type="date" name="dateofleave" />
                    </td>
                  </tr>
                  <tr>
                    <td align="right">End Date:</td>
                    <td>
                      <input onChange={handleInputChange} value={formValues.endDate} required type="date" name="endDate" />
                    </td>
                  </tr>
                  <tr>
                    <td align="center" colSpan={2}>
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
                  <th>Leave Type</th>
                  <th>Leave Reason</th>
                  <th>Leave Status</th>
                  <th>Leave Start</th>
                  <th>Leave End</th>
                </tr>
                {allSal.map((leave, index) => (
                  <tr key={index}>
                    <td>{leave.id}</td>
                    <td>{leave.eid}</td>
                    <td>{leave.leave_type}</td>
                    <td>{leave.reason}</td>
                    <td>{leave.leave_status}</td>
                    <td>{leave.dateofleave}</td>
                    <td>{leave.endDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
