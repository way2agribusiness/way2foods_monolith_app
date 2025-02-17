'use client'; // Add this at the top of the file
import React, { useState, useEffect, useContext } from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';  // Import Toastify
import 'react-toastify/dist/ReactToastify.css';  // Import Toastify styles
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/userContext";

const EditProfile = () => {
    const { user, setUser, loading } = useContext(UserContext); // Using useContext hook correctly

    // State for form data
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: '',
    });

    // Handle form data initialization when user data is loaded
    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                phone: user.phone || '',
                role: user.role || '',
            });
        }
    }, [user]);

    // State for handling error messages
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [formErrors, setFormErrors] = useState({}); // To store form validation errors
    const [isSubmitting, setIsSubmitting] = useState(false); // To manage the submit button state

    // Initialize Next.js router
    const router = useRouter();

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
            setIsSubmitting(true); // Disable submit button

            const token = localStorage.getItem("token");

            // Send the data to the API endpoint
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/update`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`, // Send token in Authorization header
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                resetData();
                setUser(data.user);
                setRememberMe(false);

                // If registration is successful
                toast.success(data.message, {
                    autoClose: 3000,  // Toast stays for 3 seconds
                });

                // Wait for the toast to complete (matching the autoClose time) before redirecting
                setTimeout(() => {
                    router.push('/buyer/profile');
                }, 3000);
                setError('');
            } else {
                // If there's an error, show error message
                setMessage('');
                toast.error(data.message || 'An error occurred');
            }
        } catch (err) {
            setMessage('');
            toast.error('An error occurred while sending data');
            console.error(err);
        } finally {
            setIsSubmitting(false); // Enable submit button again
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
        if (!data.role) errors.role = "Role is required";

        return errors;
    };

    const resetData = () => {
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            role: '',
        });
    };

    // Handling loading and error states
    if (loading) {
        return <header>Loading...</header>;
    }

    if (error) {
        return <header>Error: {error}</header>;
    }

    return (
        <div className="flex flex-col lg:flex-row">
            {/* Left side image */}
            <div className="">
                <form onSubmit={handleSubmit} className="space-y-2 w-full max-w-sm mx-auto font-[sans-serif]">
                    {/* Sign Up Heading */}
                    <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

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
                            className="w-full px-2 py-2 border-b-2 border-gray-300 focus:outline-none 
                                    focus:border-b-2 focus:border-yellow-300 placeholder-gray-400 bg-transparent"
                        />
                        <FaPhoneAlt className="absolute right-2 top-2 text-gray-400" />
                        {formErrors.phone && <p className="text-red-500 text-sm">{formErrors.phone}</p>}
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
                            Do you really want to update your profile *
                        </span>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className={`px-6 py-2 w-full text-sm text-white mx-auto block ${rememberMe ? 'bg-green-400 hover:bg-green-500' : 'bg-green-300 opacity-100 cursor-not-allowed'}`}
                        disabled={!rememberMe} // Button is disabled unless checkbox is checked
                    >
                        {isSubmitting ? 'Updating...' : 'Update'}
                    </button>

                </form>
            </div>
            {/* Toast Container */}
            <ToastContainer />
        </div>
    );
};

export default EditProfile;
