'use client'; // Add this at the top of the file
import React, { useState } from "react";
import Link from "next/link";
import { FaEye, FaEyeSlash, FaPhoneAlt } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';  // Import Toastify
import 'react-toastify/dist/ReactToastify.css';  // Import Toastify styles
import { useRouter } from "next/navigation";

// Helper to handle input changes
const handleInputChange = (e, setFormData) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
    }));
};

// Password toggle component
const PasswordField = ({ name, value, onChange, showPassword, togglePassword, placeholder, error }) => (
    <div className="relative w-full">
        <input
            type={showPassword ? "text" : "password"}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full px-3 py-2 border-b-2 border-gray-300 focus:outline-none focus:border-yellow-300 placeholder-gray-400 bg-transparent"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div onClick={togglePassword} className="absolute right-3 top-3 cursor-pointer">
            {showPassword ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
        </div>
    </div>
);

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const router = useRouter();

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormErrors({});

        const errors = validateForm(formData);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                toast.success(data.message || 'Registration successful!', { autoClose: 3000 });
                setTimeout(() => router.push('/common/login'), 3000);
            } else {
                toast.error(data.message || 'An error occurred');
            }
        } catch (err) {
            toast.error('An error occurred while sending data');
            console.error(err);
        }
    };

    const validateForm = (data) => {
        const errors = {};
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

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
            {/* Left side image */}
            <div className="lg:w-1/2 w-full flex justify-center items-center bg-yellow-200 py-8 lg:py-0">
                <img
                    src="https://res.cloudinary.com/dm71xhdxd/image/upload/v1736420880/Wall_post-amico_lwthdr.png"
                    className="w-72 h-auto"
                    alt="Illustration"
                />
            </div>

            {/* Right side form */}
            <div className="lg:w-1/2 w-full flex justify-center items-center bg-white p-6 lg:p-8">
                <form onSubmit={handleSubmit} className="space-y-2 w-full max-w-sm mx-auto font-[sans-serif]">
                    <h2 className="text-2xl font-semibold text-center text-gray-700 mb-2">Sign Up</h2>

                    {/* First Name and Last Name */}
                    <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-3">
                        <div className="w-full">
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={(e) => handleInputChange(e, setFormData)}
                                className="w-full px-3 py-2 border-b-2 border-gray-300 focus:outline-none focus:border-yellow-300 placeholder-gray-400 bg-transparent"
                            />
                            {formErrors.firstName && <p className="text-red-500 text-sm">{formErrors.firstName}</p>}
                        </div>
                        <div className="w-full">
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={(e) => handleInputChange(e, setFormData)}
                                className="w-full px-3 py-2 border-b-2 border-gray-300 focus:outline-none focus:border-yellow-300 placeholder-gray-400 bg-transparent"
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
                            onChange={(e) => handleInputChange(e, setFormData)}
                            className="w-full px-3 py-2 border-b-2 border-gray-300 focus:outline-none focus:border-yellow-300 placeholder-gray-400 bg-transparent"
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
                            onChange={(e) => handleInputChange(e, setFormData)}
                            className="w-full px-3 py-2 border-b-2 border-gray-300 focus:outline-none focus:border-yellow-300 placeholder-gray-400 bg-transparent"
                        />
                        <FaPhoneAlt className="absolute right-3 top-3 text-gray-400" />
                        {formErrors.phone && <p className="text-red-500 text-sm">{formErrors.phone}</p>}
                    </div>

                    {/* Password and Confirm Password */}
                    <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-3">
                        <PasswordField
                            name="password"
                            value={formData.password}
                            onChange={(e) => handleInputChange(e, setFormData)}
                            showPassword={showPassword}
                            togglePassword={togglePasswordVisibility}
                            placeholder="Password"
                            error={formErrors.password}
                        />
                        <PasswordField
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange(e, setFormData)}
                            showPassword={showPassword}
                            togglePassword={togglePasswordVisibility}
                            placeholder="Confirm Password"
                            error={formErrors.confirmPassword}
                        />
                    </div>

                    {/* Role selection */}
                    <div>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={(e) => handleInputChange(e, setFormData)}
                            className="w-full px-3 py-2 border-b-2 border-gray-300 focus:outline-none focus:border-yellow-300 placeholder-gray-400 bg-transparent"
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
                            checked={formData.rememberMe}
                            onChange={() => setFormData((prev) => ({ ...prev, rememberMe: !prev.rememberMe }))}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                        />
                        <span className="text-gray-400 text-sm ml-2">
                            I Agree with terms & conditions *
                        </span>
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="w-full px-6 py-2 bg-green-400 hover:bg-green-500 text-white rounded">
                        Submit
                    </button>

                    {/* Sign In link */}
                    <div className="text-sm text-center mt-3">
                        <span>Already have an account? </span>
                        <Link href="/common/login" className="text-blue-500 hover:text-blue-600 hover:underline">
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
