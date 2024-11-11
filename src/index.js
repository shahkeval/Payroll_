import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';


import { BrowserRouter, Routes, Route } from "react-router-dom";
import Admin from "./Admin"
import Emp from "./Emp"
import Home from "./Home"
import AllEmp from "./AllEmp"
import AllAdmin from "./AllAdmin"
import GenSal from "./GenSal"
import LeaReq from "./LeaReq"
import Login from "./Login"
import HomeEmp from "./HomeEmp"
import SalRep from "./SalRep"
import LeaReqEmp from "./LeaReqEmp"
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route index element={<Login />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/Admin" element={<Admin />} />
      <Route path="/Emp" element={<Emp />} />
      <Route path="/AllEmp" element={<AllEmp />} />
      <Route path="/AllAdmin" element={<AllAdmin />} />
      <Route path="/GenSal" element={<GenSal />} />
      <Route path="/LeaReq" element={<LeaReq />} />
      <Route path="/HomeEmp/:id" element={<HomeEmp />} />
      <Route path="/SalRep/:id" element={<SalRep />} />
      <Route path="/LeaReqEmp/:id" element={<LeaReqEmp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();