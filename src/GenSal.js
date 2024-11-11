import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './style/gensal.css'; 

function GenSal() {
  const [allUsers, setAllUsers] = useState([]);
  const [allsal, setAllSal] = useState([]);
  const [formValues, setFormValues] = useState({
    id: '',
    s_eid: '',
    g_sal: '',
    t_sal: '',
    sal_amt: '',
    month: '' // New field for month
  });

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
        const res = await axios.get('http://localhost:8001/allEmps');
        setAllUsers(res.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:8001/allSalary');
        setAllSal(res.data);
      } catch (error) {
        console.error('Error fetching salary records:', error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevFormValues) => {
      const updatedValues = {
        ...prevFormValues,
        [name]: value,
      };

      // Calculate tax and total salary if gross salary is changed
      if (name === 'g_sal') {
        const grossSalary = parseFloat(value) || 0;
        const tax = grossSalary * 0.28; // Calculate tax as 28% of gross salary
        const totalSalary = grossSalary - tax; // Total salary after tax deduction
        updatedValues.t_sal = tax.toFixed(2); // Set tax value
        updatedValues.sal_amt = totalSalary.toFixed(2); // Set total salary value
      }

      return updatedValues;
    });
  };

  const handleDeleteClick = async (user) => {
    const confirmDelete = window.confirm(`Delete Salary ID ${user.id}?`);
    if (!confirmDelete) {
      return;
    }

    try {
      const res = await axios.delete(`http://localhost:8001/deleteSalary/${user.id}`);
      console.log('Salary deleted successfully:', res.data);
      const updatedData = await axios.get('http://localhost:8001/allSalary');
      setAllSal(updatedData.data);
    } catch (error) {
      console.error('Error deleting salary record:', error);
    }
  };

  const [activeTable, setActiveTable] = useState('Form');

  useEffect(() => {
    // Generate a random Salary ID when the component loads
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      id: generateRandomString(8),
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

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:8001/Salary', formValues)
      .then(async (result) => {
        console.log(result);
        setFormValues({
          id: generateRandomString(8),
          g_sal: "",
          t_sal: "",
          sal_amt: "",
          s_eid: "",
          month: "" // Reset month on submit
        });
        setActiveTable('Table');
        const res = await axios.get('http://localhost:8001/allSalary');
        setAllSal(res.data);
      })
      .catch((err) => {
        if (err.response && err.response.status === 400) {
          if (err.response.data.error === "EmpID") {
            alert('Employee ID already exists');
          } else {
            alert('Salary ID already exists');
          }
        } else {
          console.error(err);
        }
      });
  };

  return (
    <div className='gensal'>
      <div className='nav'>
        <a href="/Home" title='Home Page'>Home</a>
        <a href="/Emp" title='Create Employee Page'>Add Employee</a>
        <a href="/AllEmp" title='Employees Page'>All Employees</a>
        <a href="/Admin" title='Create Admin Page'>Add Admin</a>
        <a href="/AllAdmin" title='Admins Page'>All Admins</a>
        <a href="/GenSal" title='Generate Salary Page' className='active'>Generate Salary</a>
        <a href="/LeaReq" title='Leave Page'>Leaves Info</a>
        <a href="#" onClick={() => logout()} title='Sign Out'>Sign Out</a>
      </div>
      <div className="side">
        <div className="salbar">
          <button onClick={() => setActiveTable('Form')} className={activeTable === 'Form' ? 'activeside' : ''}>Generate Salary</button>
          <button onClick={() => setActiveTable('Table')} className={activeTable === 'Table' ? 'activeside' : ''}>Salary Records</button>
        </div>
        {activeTable === 'Form' && (
          <div className="formside">
            <div title='Coin' className="coin">₹</div>
            <form method='post' action='' onSubmit={handleSubmit}>
              <table>
                <tr>
                  <td align='right'>Salary ID :</td>
                  <td>
                    <input 
                      onChange={handleInputChange}
                      value={formValues.id}
                      required
                      type='text'
                      name='id'
                      placeholder='Enter ID'
                    />
                  </td>
                </tr>
                <tr>
                  <td align='right'>Employee Name :</td>
                  <td>
                    <select
                      name='s_eid'
                      required
                      onChange={handleInputChange}
                      value={formValues.s_eid}
                    >
                      <option value=''>Choose Employee</option>
                      {allUsers.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
                <tr>
                  <td align='right'>Gross Salary :</td>
                  <td>
                    <input
                      onChange={handleInputChange}
                      value={formValues.g_sal}
                      required
                      type='number'
                      name='g_sal'
                      placeholder='Gross Salary'
                    />
                  </td>
                </tr>
                <tr>
                  <td align='right'>Salary Tax :</td>
                  <td>
                    <input
                      disabled
                      value={formValues.t_sal}
                      required
                      type='number'
                      name='t_sal'
                      placeholder='Salary Tax'
                    />
                  </td>
                </tr>
                <tr>
                  <td align='right'>Total Salary :</td>
                  <td>
                    <input
                      disabled
                      value={formValues.sal_amt}
                      required
                      type='number'
                      name='sal_amt'
                      placeholder='Total Salary'
                    />
                  </td>
                </tr>
                <tr>
                  <td align='right'>Month :</td>
                  <td>
                    <select
                      name='month'
                      required
                      onChange={handleInputChange}
                      value={formValues.month}
                    >
                      <option value=''>Select Month</option>
                      <option value='January'>January</option>
                      <option value='February'>February</option>
                      <option value='March'>March</option>
                      <option value='April'>April</option>
                      <option value='May'>May</option>
                      <option value='June'>June</option>
                      <option value='July'>July</option>
                      <option value='August'>August</option>
                      <option value='September'>September</option>
                      <option value='October'>October</option>
                      <option value='November'>November</option>
                      <option value='December'>December</option>
                    </select>
                  </td>
                </tr>
              </table>
              <div className="btnsub">
                <button>Generate</button>
              </div>
            </form>
          </div>
        )}

        <br/>
        {activeTable === 'Table' && (
          <div className="tableside">
            <table>
              <tr>
                <th>Salary ID</th>
                <th>Employee ID</th>
                <th>Gross Salary</th>
                <th>Salary Tax</th>
                <th>Total Salary</th>
                <th>Month</th> {/* Add Month column */}
                <th>Action</th>
              </tr>
              {allsal.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.s_eid}</td>
                  <td>{user.g_sal}</td>
                  <td>{user.t_sal}</td>
                  <td>{user.sal_amt}</td>
                  <td>{user.month}</td> {/* Display Month */}
                  <td><button onClick={() => handleDeleteClick(user)}>🗑️</button></td>
                </tr>
              ))}
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default GenSal; 
