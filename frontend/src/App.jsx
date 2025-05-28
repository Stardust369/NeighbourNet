import { useEffect } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import ProtectedAdminRoute from './components/ProtectedAdminRoute'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import OTP from './pages/OTP'
import ResetPassword from './pages/ResetPassword'
import NGODashboard from './pages/NGODashboard'
import Dash from './pages/Dash'
import NGODashh from './pages/NGODashh'
import CollaborationChat from './pages/CollaborationChat'
import Notifications from './pages/Notifications'
import NGOs from './pages/NGOs'
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
import Donations from './pages/Donations'
import NGODonations from './components/NGODonations'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentCancel from './pages/PaymentCancel'
import AdminDashboard from './pages/AdminDashboard'
import CollaborationRequestsPage from './pages/CollaborationRequests'
import CollaboratedIssuesPage from './components/CollaboratedIssuesPage'
import NGODetails from './pages/NGODetails'
import NGOClaimedIssues from './pages/NGOClaimedIssues'

import Events from './pages/Events'
import CreateEvent from './pages/CreateEvent'
import EventDetailsWrapper from './components/EventDetailsWrapper'
import CreatedEvents from './pages/CreatedEvents'
import RegisteredEvents from './pages/RegisteredEvents'

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
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/otp-verification/:email" element={<OTP />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        <Route path="/create" element={<PostIssue />} />
        <Route path="/dashboard/post-issue" element={<PostIssue />} />
        <Route path="/issues/:id" element={<IssueDetailsWrapper />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancel" element={<PaymentCancel />} />
        
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetailsWrapper />} />
        
        <Route path="/dashboard" element={<UDashBoard />}>
          <Route path="created-issues" element={<CreatedIssues />} />
          <Route path="volunteering-oppurtunities" element={<Dashboard />} />
          <Route path="user-dashboard" element={<UserDashboard />} />
          <Route path="donations" element={<Donations />} />
          <Route path="postissue" element={<PostIssue />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="ngo" element={<NGOs />} />
          <Route path="ngo-details/:ngoId" element={<NGODetails />} />
          {/* User Event Routes */}
          <Route path="my-events" element={<RegisteredEvents />} />
        </Route>

        <Route path="/ngo-dashboard" element={<NGODashboard />}>
          <Route index element={<NGODashh />} />
          <Route path="requests" element={<Dashboard />} />
          <Route path="collaboration-requests" element={<CollaborationRequestsPage />} />
          <Route path="claimed-issues" element={<ClaimedIssuesPage />} />
          <Route path="donations" element={<NGODonations />} />
          <Route path="create-event" element={<CreateEvent />} />
          <Route path="created-events" element={<CreatedEvents />} />
          <Route path="events/:id/edit" element={<CreateEvent />} />
        </Route>

        <Route path="/admin/dashboard" element={
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
        } />

        <Route path="/collaborated-issues" element={<CollaboratedIssuesPage />} />
        <Route path="/collaboration-chat/:issueId" element={<CollaborationChat />} />

        {/* NGO Routes */}
        <Route path="/ngo/:ngoId" element={<NGODetails />} />
        <Route path="/ngo/:ngoId/claimed-issues" element={<NGOClaimedIssues />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;