import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { register, resetAuthSlice } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import { motion } from "framer-motion";
import LocationPicker from "../components/LocationPicker"

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [location, setLocation] = useState(''); 
    const [role, setRole] = useState(''); // Changed to role

    const dispatch = useDispatch();
    const {
        loading, error, message, isAuthenticated
    } = useSelector(state => state.auth);

    const navigateTo = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();
        // Ensure location is provided before proceeding
        if (!location) {
            toast.error("Please enter your location");
            return;
        }
        const data = new FormData();
        data.append('name', name);
        data.append('email', email);
        data.append('password', password);
        data.append('location', location); 
        data.append('role', role); 
        dispatch(register(data));
    }

    if (isAuthenticated) {
        return <Navigate to={"/"} />
    }

    useEffect(() => {
        if (message) {
            navigateTo(`/otp-verification/${email}`)
        }
        if (error) {
            toast.error(error);
            dispatch(resetAuthSlice());
        }
    }, [dispatch, isAuthenticated, error, loading, message, email, navigateTo])

    const leftVariants = {
        initial: { opacity: 0, x: "-50%" },
        animate: { opacity: 1, x: "0%", transition: { duration: 0.5, ease: "easeInOut" } },
        exit: { opacity: 0, x: "50%", transition: { duration: 0.5, ease: "easeInOut" } }
    };
    
    const rightVariants = {
        initial: { opacity: 0, x: "50%" },
        animate: { opacity: 1, x: "0%", transition: { duration: 0.5, ease: "easeInOut" } },
        exit: { opacity: 0, x: "-50%", transition: { duration: 0.5, ease: "easeInOut" } }
    };

    const Roles = [
        "NGO",
        "User"
    ];

    return (
        <>
            <div className="flex flex-col justify-center md:flex-row h-screen">
                {/* LEFT SIDE */}
                <motion.div
                    className="hidden w-full md:w-1/2 bg-black text-white md:flex flex-col items-center justify-center p-8 rounded-tr-[80px] rounded-br-[80px] bg-cover bg-center"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={rightVariants}
                    style={{ backgroundImage: "url('data:image/jpeg;base64,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')" }} 
                >
                    <div className="text-center h-[376px]">
                        <div className="flex justify-center mb-12">
                            <h1 className="text-white text-4xl font-bold">NeighBour Net</h1>
                        </div>
                        <p className="text-gray-300 mb-12">Already have an Account? Sign in now.</p>
                    </div>
                    <Link
                        to={"/login"}
                        className="border-2 rounded-lg font-semibold border-white py-2 px-8 hover:bg-white hover:text-black transition"
                    >
                        SIGN IN
                    </Link>
                </motion.div>
                {/* RIGHT SIDE */}
                <motion.div
                    className="w-full md:w-1/2 flex items-center justify-center bg-white p-8"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={leftVariants}
                >
                    <div className="w-full max-w-sm">
                        <div className="flex justify-center mb-5">
                            <div className="sm:flex-row items-center justify-center gap-5">
                                <h3 className="font-medium text-4xl overflow-hidden">Sign Up</h3>
                            </div>
                        </div>
                        <p className="text-gray-800 text-center mb-12">
                            Please provide your information to sign up.
                        </p>
                        <form onSubmit={handleRegister}>
                            <div className="mb-2">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Full Name"
                                    className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"
                                />
                            </div>
                            <div className="mb-2">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email"
                                    className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"
                                />
                            </div>
                            <div className="mb-2">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"
                                />
                            </div>

                            {/* Role Dropdown */}
                            <div className="mb-2">
                                <select
                                    id="role"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"
                                    required
                                >
                                    <option value="" disabled>
                                        Select a role
                                    </option>
                                    {Roles.map((role, index) => (
                                        <option key={index} value={role}>
                                            {role}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Location Picker Field */}
                            <div className="mb-2">
                                <LocationPicker eventLocation={location} setEventLocation={setLocation} />
                            </div>

                            <div className="block md:hidden font-semibold mt-5">
                                <p>Already have an account?</p>
                                <Link to="/login" className="text-sm text-gray-500 hover:underline">
                                    Sign In
                                </Link>
                            </div>

                            <button
                                type="submit"
                                className="border-2 mt-5 border-black w-full font-semibold bg-black text-white py-2 rounded-lg hover:bg-white hover:text-black transition"
                            >
                                SIGN UP
                            </button>
                        </form>
                    </div>
                </motion.div>

            </div>
        </>
    )
}

export default Register;
