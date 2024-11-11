import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import './style/selrep.css'; 
import 'jspdf-autotable';

export default function SalRep() {
  const [allsal, setAllSal] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  const logout = async () => {
    const confirmlogout = window.confirm(`Are you sure do you want to logout??`);
    if (!confirmlogout) {
      return;
    }
    navigate('/');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:8001/oneSalary/${id}`);
        setAllSal(res.data);
      } catch (error) {
        console.error('Error fetching salary details:', error);
      }
    };
    fetchData();
  }, [id]);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Salary Report', 20, 20);
    doc.setFontSize(12);
    doc.text(`Salary Id: ${allsal.id}`, 20, 30);
    doc.text(`Employee Id: ${allsal.s_eid}`, 20, 40);
    doc.text(`Month: ${allsal.month}`, 20, 50); // Added month here

    doc.autoTable({
      startY: 60,
      head: [['Sr no.', 'Particular', 'Price']],
      body: [
        ['1', 'Gross Salary', `+${allsal.g_sal}`],
        ['2', 'Salary Tax', `-${allsal.t_sal}`],
        ['', 'Total Amount', `₹${allsal.sal_amt}`],
      ],
      columnStyles: {
        0: { halign: 'center', cellWidth: 30 },
        2: { halign: 'center', cellWidth: 50 },
      },
    });

    doc.text('Paid', 20, doc.lastAutoTable.finalY + 20);
    doc.save(`Salary_Report_${allsal.id}.pdf`);
  };

  return (
    <div className='salrep'>
      <div className='nav'>
        <Link to={`/HomeEmp/${id}`} >Home</Link>
        <Link to={`/SalRep/${id}`} className='active'>Salary Report</Link>
        <Link to={`/LeaReqEmp/${id}`}>Leave Request</Link>
        <a href="#" onClick={() => logout()} title='Sign Out'>Sign Out</a>
      </div>
      <div className="side">
        <div className="page" title='Salary Slip'>
          <div className="head">Salary Report</div>
          <div>
            <div className="id">
              <div className="sid">Salary Id : {allsal.id}</div>
              <div className="eid">Employee Id : {allsal.s_eid}</div>
              <div className="month">Month : {allsal.month}</div> {/* Display month here */}
            </div>
            <div className="tbl">
              <table border={1}>
                <tr>
                  <th style={{width:'15%'}}>Sr no.</th>
                  <th>Particular</th>
                  <th style={{width:'25%'}}>Price</th>
                </tr>
                <tr>
                  <td align='center'>1</td>
                  <td>Gross Salary <span style={{float:'right',padding:'0 10px'}}><b>+</b></span></td>
                  <td align='center'>₹{allsal.g_sal}</td>
                </tr>
                <tr>
                  <td align='center'>2</td>
                  <td>Salary Tax <span style={{float:'right',padding:'0 10px'}}><b>-</b></span></td>
                  <td align='center'>₹{allsal.t_sal}</td>
                </tr>
                <tr height='175px'>
                </tr>
                <tr>
                  <td style={{padding:'5px 0'}} colSpan={2} align='center'><b>Total Amount</b></td>
                  <td align='center'><b>₹{allsal.sal_amt}</b></td>
                </tr>
              </table>
            </div>
            <div className="paid">Paid</div><br></br>
            <center><button onClick={downloadPDF} className="download-btn">Download PDF</button></center> 
          </div>
        </div>
      </div>
    </div>
  );
}
