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
import Dash from './pages/Dash'
import NGODashh from './pages/NGODashh'
import UDashBoard from './pages/UDashBoard'
import UserDashboard from './pages/UserDashboard'
import ClaimedIssuesPage from './components/ClaimedIssuesPage'
import IssueDetailsWrapper from './components/IssueDetailsWrapper'
import CreatedIssues from './pages/CreatedIssues'
import UserIssueDetailsPage from './components/UserIssueDetails'
import { getUser } from './redux/slices/authSlice'
import PostIssue from './pages/PostIssue'
import Dashboard from './components/Dashboard'
import AssignedIssues from './pages/AssignedIssues'

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
        <Route path="/ngo-dashboard" element={<NGODashh />}>
          <Route path="requests" element={<Dashboard />} />
          <Route path="claimed-issues" element={<ClaimedIssuesPage />} />
          {/* Add other routes here */}
        </Route>
        <Route path="/dashboard" element={<Dash />}>
          <Route path="issues" element={<Dashboard />} />
          <Route path="claimed-issues" element={<ClaimedIssuesPage />} />
          {/* Add other routes here */}
        </Route>
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/otp-verification/:email" element={<OTP />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        <Route path="/create" element={<PostIssue />} />
        <Route path="/issues/:id" element={<IssueDetailsWrapper />} />
        
        <Route path="/dashboard" element={<UDashBoard />}>
          <Route path="created-issues" element={<CreatedIssues />} />
          <Route path="volunteering-oppurtunities" element={<Dashboard />} />
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
