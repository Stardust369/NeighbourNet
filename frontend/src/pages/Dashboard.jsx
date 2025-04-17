import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../redux/slices/authSlice';

export default function Dashboard () {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const goToUserDashboard = () => {
        navigate('/user-dashboard');
    };

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold">Dashboard</h1>

            <button
                onClick={goToUserDashboard}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
                Go to User Dashboard
            </button>

            <button
                onClick={handleLogout}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
            >
                Logout
            </button>
        </div>
    )
}
