'use client'; // Add this at the top of the file
import React, { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { FaEye, FaEyeSlash, FaPhoneAlt } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/userContext";  // Import UserContext

const Login = () => {
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({}); // To store form validation errors

  const { setUser } = useContext(UserContext); // Access setUser from context
  const router = useRouter();

  // State for redirectTo, initialized as '/'
  const [redirectTo, setRedirectTo] = useState('/');

  // Capture the redirectTo query parameter from the URL
  useEffect(() => {
    const queryRedirect = new URLSearchParams(window.location.search).get('redirectTo');
    if (queryRedirect) {
      setRedirectTo(queryRedirect); // Set the redirect URL
    }
  }, []);

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

  // Form validation function
  const validateForm = (data) => {
    const errors = {};
    if (!data.phone) errors.phone = "Phone is required";
    else if (!/^\d{10}$/.test(data.phone)) errors.phone = "Phone number must be 10 digits";
    if (!data.password) errors.password = "Password is required";
    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setError('');

    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      toast.dismiss();  // Ensure any existing toasts are dismissed before showing a new one

      if (response.ok) {
        localStorage.setItem('token', data.token);  // Save the token
        resetData();
        setUser(data.user); // Set user in context

        const toastId = toast.success(data.message, {
          autoClose: 3000,  // This will auto-close the toast after 3 seconds
        });

        setTimeout(() => {
          router.push(redirectTo); // Redirect to the saved destination or default (home)
        }, 3500);  // Wait 3.5 seconds to allow toast to close first

      } else {
        toast.error(data.message || 'An error occurred');
      }
    } catch (err) {
      toast.dismiss();
      toast.error('An error occurred while sending data');
      console.error(err);
    }
  };

  const resetData = () => {
    setFormData({
      phone: "",
      password: ""
    });
  };

  return (
    <div className="flex flex-col lg:flex-row h-auto lg:h-[450px] bg-gray-100">
      <div className="lg:w-1/2 w-full flex justify-center items-center bg-yellow-200 p-6 lg:p-12">
        <img
          src="https://res.cloudinary.com/dm71xhdxd/image/upload/v1736414196/Mobile_login-pana_dy2ag6.png"
          className="w-full max-w-xs lg:max-w-md"
          alt="Login Illustration"
        />
      </div>

      <div className="lg:w-1/2 w-full flex justify-center items-center p-6 lg:p-12">
        <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-sm mx-auto font-[sans-serif]">
          <h2 className="text-xl font-semibold text-center mb-6 text-gray-800">Sign In</h2>

          <div className="relative">
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-b-2 border-gray-300 focus:outline-none focus:border-yellow-400 placeholder-gray-400 bg-transparent text-gray-800"
            />
            <FaPhoneAlt className="absolute right-3 top-3 text-gray-400" />
            {formErrors.phone && <p className="text-red-500 text-sm">{formErrors.phone}</p>}
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-b-2 border-gray-300 focus:outline-none focus:border-yellow-400 placeholder-gray-400 bg-transparent text-gray-800"
            />
            {formErrors.password && <p className="text-red-500 text-sm">{formErrors.password}</p>}
            <div onClick={togglePasswordVisibility} className="absolute right-3 top-3 cursor-pointer">
              {showPassword ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded"
              />
              <span className="text-gray-600 text-sm ml-2">
                Remember me
              </span>
            </div>
            <div className="text-center text-sm">
              <Link href="/" className="text-blue-500 hover:text-blue-600 hover:underline">
                Forgot Password?
              </Link>
            </div>
          </div>

          <button type="submit" className="px-6 py-3 w-full bg-green-500 hover:bg-green-600 text-sm text-white rounded-lg transition duration-300">
            Sign In
          </button>

          <div className="text-sm text-center mt-4 text-gray-600">
            <span>Don't have an account? </span>
            <Link href="/common/register" className="text-blue-500 hover:text-blue-600 hover:underline">
              Sign Up
            </Link>
          </div>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Login;
