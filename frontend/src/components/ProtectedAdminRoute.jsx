import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { getUser } from '../redux/slices/authSlice';

const ProtectedAdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // If Redux state is empty but we have user data in localStorage, try to fetch user data
    if (!user && !isAuthenticated && !loading) {
      const storedUser = localStorage.getItem('user');
      const userRole = localStorage.getItem('userRole');
      
      console.log('ProtectedAdminRoute - Stored user:', storedUser);
      console.log('ProtectedAdminRoute - Stored role:', userRole);
      
      if (storedUser && userRole === 'admin') {
        console.log('Found admin user in localStorage, fetching user data');
        dispatch(getUser());
      } else {
        setIsChecking(false);
      }
    } else {
      setIsChecking(false);
    }
  }, [user, isAuthenticated, loading, dispatch]);

  if (loading || isChecking) return null; // Optionally, render a spinner here

  console.log('ProtectedAdminRoute - User:', user);
  console.log('ProtectedAdminRoute - Is Authenticated:', isAuthenticated);
  console.log('ProtectedAdminRoute - User Role:', user?.role);

  if (!isAuthenticated || !user || user.role !== 'admin') {
    console.log('Access denied - Redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('Access granted to admin dashboard');
  return children;
};

export default ProtectedAdminRoute; 