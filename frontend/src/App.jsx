import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword';
import IssueDetailsWrapper from './components/IssueDetailsWrapper';
import OTP from './pages/OTP'
import Dashboard from './pages/Dashboard'
import NGODashh from './pages/NGODashh'
import NGODash from './pages/NGODashboard'
import UserDashboard from './pages/UserDashboard'
import ResetPassword from './pages/ResetPassword'
import { useDispatch, useSelector } from 'react-redux'
import { getUser } from './redux/slices/authSlice'
import PostIssue from './pages/PostIssue'
import AssignedIssues from './pages/AssignedIssues'
const App = () => {

  const {user,isAuthenticated}= useSelector((state)=>state.auth)
  const dispatch =useDispatch();

  useEffect(()=>{
    dispatch(getUser());
  },[])
  return (
      <Router>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/assigned-issues" element={<AssignedIssues />} />
              <Route path="/ngo-dashboard" element={<NGODash />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/user-dashboard" element={<UserDashboard />} />
              <Route path="/issues/:id" element={<IssueDetailsWrapper />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/password/forgot" element={<ForgotPassword />} />
              <Route path="/otp-verification/:email" element={<OTP />} />
              <Route path="/password/reset/:token" element={<ResetPassword />} />
              <Route path="/create" element={<PostIssue />} />
          </Routes>
          <ToastContainer theme='dark'/>
      </Router>
  );
};

export default App;