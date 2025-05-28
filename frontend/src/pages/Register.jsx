import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { register, resetAuthSlice } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import LocationPicker from "../components/LocationPicker";
import { Eye, EyeOff } from 'lucide-react';
import logo from '../assets/logo.png'; // ✅ import logo

const issueTags = ["Road", "Water", "Electricity", "Education", "Health", "Sanitation"];

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [location, setLocation] = useState('');
    const [role, setRole] = useState('');
    const [interests, setInterests] = useState([]);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, message, isAuthenticated } = useSelector(state => state.auth);

    const handleRegister = (e) => {
        e.preventDefault();
        if (!location) return toast.error("Please select your location");
        if (role === 'NGO' && interests.length === 0) {
            return toast.error("Please select at least one interest");
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('location', location);
        formData.append('role', role);
        if (role === 'NGO') {
            interests.forEach(interest => {
                formData.append('interests[]', interest);
            });
        }

        dispatch(register(formData));
    };

    const handleInterestChange = (tag) => {
        setInterests(prev => {
            if (prev.includes(tag)) {
                return prev.filter(t => t !== tag);
            } else {
                return [...prev, tag];
            }
        });
    };

    useEffect(() => {
        if (message) navigate(`/otp-verification/${email}`);
        if (error) {
            toast.error(error);
            dispatch(resetAuthSlice());
        }
    }, [dispatch, message, error, email, navigate]);

    if (isAuthenticated) return <Navigate to="/" />;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4">
            {/* Logo */}
            <img src={logo} alt="App Logo" className="h-70 object-contain mb-6" />

            {/* Registration Form */}
            <form
                onSubmit={handleRegister}
                className="w-full max-w-md bg-white p-6 rounded shadow-2xl space-y-4"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Register to Neighbour Net</h2>

                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                    required
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                    required
                />

                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                        {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                </div>

                <div className="mb-2">
                    <LocationPicker eventLocation={location} setEventLocation={setLocation} />
                </div>

                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                    required
                >
                    <option value="">Select Role</option>
                    <option value="NGO">NGO</option>
                    <option value="User">User</option>
                </select>

                {role === 'NGO' && (
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Interests</label>
                        <div className="flex flex-wrap gap-2">
                            {issueTags.map((tag) => (
                                <label key={tag} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={interests.includes(tag)}
                                        onChange={() => handleInterestChange(tag)}
                                        className="rounded border-gray-300"
                                    />
                                    <span>{tag}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
                    disabled={loading}
                >
                    {loading ? "Registering..." : "Register"}
                </button>

                <p className="text-sm text-center">
                    Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
                </p>
            </form>
        </div>
    );
}

export default Register;
