'use client'; // Add this at the top of the file
import React, { useState } from "react";
import Link from "next/link";
import { FaEye, FaEyeSlash, FaPhoneAlt } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';  // Import Toastify
import 'react-toastify/dist/ReactToastify.css';  // Import Toastify styles
import { useRouter } from "next/navigation";

const Register = () => {
    // State for form data
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: '',
    });

    // State for handling error messages
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [formErrors, setFormErrors] = useState({}); // To store form validation errors

    // Initialize Next.js router
    const router = useRouter();

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission

        // Reset form errors
        setFormErrors({});
        setError('');
        setMessage('');

        // Form validation
        const errors = validateForm(formData);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            // Send the data to the API endpoint
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.text(); // Read response as text first
            let parsedData = {};

            if (data) {
                parsedData = JSON.parse(data); // Parse it to JSON if it's not empty
            }

            if (response.ok) {
                resetData();
                // If registration is successful
                toast.success(parsedData.message || 'Registration successful!', {
                    autoClose: 3000,  // Toast stays for 3 seconds
                });

                // Wait for the toast to complete (matching the autoClose time) before redirecting
                setTimeout(() => {
                    router.push('/common/login');
                }, 3000);
                setError('');
            } else {
                // If there's an error, show error message
                toast.error(parsedData.message || 'An error occurred');
            }
        } catch (err) {
            setMessage('');
            toast.error('An error occurred while sending data');
            console.error(err);
        }
    };

    // Form validation function
    const validateForm = (data) => {
        const errors = {};

        // Required fields validation
        if (!data.firstName) errors.firstName = "First name is required";
        if (!data.lastName) errors.lastName = "Last name is required";
        if (!data.email) errors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(data.email)) errors.email = "Email is invalid";
        if (!data.phone) errors.phone = "Phone is required";
        else if (!/^\d{10}$/.test(data.phone)) errors.phone = "Phone number must be 10 digits";
        if (!data.password) errors.password = "Password is required";
        if (!data.confirmPassword) errors.confirmPassword = "Confirm password is required";
        else if (data.password !== data.confirmPassword) errors.confirmPassword = "Passwords do not match";
        if (!data.role) errors.role = "Role is required";

        return errors;
    };

    const resetData = () => {
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
            role: '',
        })
    };

    return (
        <div className="flex flex-col lg:flex-row h-[450px]">
            {/* Left side image */}
            <div className="lg:w-1/2 w-full flex justify-center items-center bg-yellow-200">
                <div>
                    <img
                        src="https://res.cloudinary.com/dm71xhdxd/image/upload/v1736420880/Wall_post-amico_lwthdr.png"
                        className="w-96 h-94"
                    />
                </div>
            </div>

            {/* Right side form */}
            <div className="lg:w-1/2 w-full flex justify-center items-center bg-white p-8">
                <form onSubmit={handleSubmit} className="space-y-2 w-full max-w-sm mx-auto font-[sans-serif]">
                    {/* Sign Up Heading */}
                    <h2 className="text-xl font-semibold text-center mb-4">Sign Up</h2>

                    {/* First Name and Last Name */}
                    <div className="flex space-x-4">
                        <div className="w-full">
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className="w-full px-2 py-2 border-b-2 border-gray-300 focus:outline-none 
                                    focus:border-b-2 focus:border-yellow-300 placeholder-gray-400 bg-transparent"
                            />
                            {formErrors.firstName && <p className="text-red-500 text-sm">{formErrors.firstName}</p>}
                        </div>
                        <div className="w-full">
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className="w-full px-2 py-2 border-b-2 border-gray-300 focus:outline-none 
                                    focus:border-b-2 focus:border-yellow-300 placeholder-gray-400 bg-transparent"
                            />
                            {formErrors.lastName && <p className="text-red-500 text-sm">{formErrors.lastName}</p>}
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-2 py-2 border-b-2 border-gray-300 focus:outline-none 
                                    focus:border-b-2 focus:border-yellow-300 placeholder-gray-400 bg-transparent"
                        />
                        {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
                    </div>

                    {/* Phone */}
                    <div className="relative">
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border-b-2 border-gray-300 focus:outline-none 
                                    focus:border-b-2 focus:border-yellow-300 placeholder-gray-400 bg-transparent"
                        />
                        <FaPhoneAlt className="absolute right-2 top-2 text-gray-400" />
                        {formErrors.phone && <p className="text-red-500 text-sm">{formErrors.phone}</p>}
                    </div>

                    {/* Password and Confirm Password */}
                    <div className="flex space-x-4">
                        <div className="relative w-full">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border-b-2 border-gray-300 focus:outline-none 
                                    focus:border-b-2 focus:border-yellow-300 placeholder-gray-400 bg-transparent"
                            />
                            {formErrors.password && <p className="text-red-500 text-sm">{formErrors.password}</p>}
                            <div
                                onClick={togglePasswordVisibility}
                                className="absolute right-2 top-2 cursor-pointer"
                            >
                                {showPassword ? (
                                    <FaEyeSlash className="text-gray-400" />
                                ) : (
                                    <FaEye className="text-gray-400" />
                                )}
                            </div>
                        </div>

                        <div className="relative w-full">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border-b-2 border-gray-300 focus:outline-none 
                                    focus:border-b-2 focus:border-yellow-300 placeholder-gray-400 bg-transparent"
                            />
                            {formErrors.confirmPassword && <p className="text-red-500 text-sm">{formErrors.confirmPassword}</p>}
                            <div
                                onClick={togglePasswordVisibility}
                                className="absolute right-2 top-2 cursor-pointer"
                            >
                                {showPassword ? (
                                    <FaEyeSlash className="text-gray-400" />
                                ) : (
                                    <FaEye className="text-gray-400" />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Select Option */}
                    <div>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            className="w-full px-2 py-2 border-b-2 border-gray-300 focus:outline-none 
                                    focus:border-b-2 focus:border-yellow-300 placeholder-gray-400 bg-transparent"
                        >
                            <option value="">Select Role</option>
                            <option value="buyer">Buyer</option>
                            <option value="apmcConnect">APMC Connect</option>
                            <option value="fpoConnect">FPO Connect</option>
                        </select>
                        {formErrors.role && <p className="text-red-500 text-sm">{formErrors.role}</p>}
                    </div>

                    {/* Terms and Conditions */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={() => setRememberMe(!rememberMe)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                        />
                        <span className="text-gray-400 text-sm ml-2">
                            I Agree with terms & conditions *
                        </span>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="px-6 py-2 w-full bg-green-400 hover:bg-green-500 text-sm text-white mx-auto block"
                    >
                        Submit
                    </button>

                    {/* Already have an account? Login link */}
                    <div className="text-sm text-center mt-4">
                        <span>Already have an account? </span>
                        <Link
                            href="/common/login"
                            className="text-blue-500 hover:text-blue-600 hover:underline"
                        >
                            Sign In
                        </Link>
                    </div>
                </form>
            </div>

            {/* Toast Container */}
            <ToastContainer />
        </div>
    );
};

export default Register;
