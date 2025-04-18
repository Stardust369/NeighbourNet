import { useEffect } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import OTP from './pages/OTP'
import ResetPassword from './pages/ResetPassword'
import Opportunities from './pages/Opportunities'
import NGODashh from './pages/NGODashh'
import DashBoard from './pages/DashBoard'
import UserDashboard from './pages/UserDashboard'
import CreatedIssues from './pages/CreatedIssues'
import PostIssue from './pages/PostIssue'
import IssueDetailsWrapper from './components/IssueDetailsWrapper'
import ClaimedIssuesPage from './components/ClaimedIssuesPage'
import Dashboard from './components/Dashboard'
import AssignedIssues from './pages/AssignedIssues'

import { getUser } from './redux/slices/authSlice'

const App = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser());
  }, [])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/volunteering-oppurtunities" element={<Opportunities />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/otp-verification/:email" element={<OTP />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        <Route path="/create" element={<PostIssue />} />
        <Route path="/issues/:id" element={<IssueDetailsWrapper />} />
        
        <Route path="/dashboard" element={<DashBoard />}>
          <Route path="created-issues" element={<CreatedIssues />} />
          <Route path="volunteering-oppurtunities" element={<Opportunities />} />
          <Route path="user-dashboard" element={<UserDashboard />} />
        </Route>


        <Route path="/ngo-dashboard" element={<NGODashh />}>
          <Route path="requests" element={<Dashboard />} />
          <Route path="claimed-issues" element={<ClaimedIssuesPage />} />
          <Route path="assigned-issues" element={<AssignedIssues />} />
        </Route>
      </Routes>
      <ToastContainer theme='dark' />
    </Router>
  );
};

export default App;
