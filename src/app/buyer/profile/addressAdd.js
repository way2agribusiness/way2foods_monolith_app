'use client'; // Add this at the top of the file
import React, { useState, useContext, useEffect } from "react";
import { FaPlus, FaMinus } from "react-icons/fa"; // Importing icons
import AddressList from "./addressList";
import { toast } from 'react-toastify';  // Import Toastify
import 'react-toastify/dist/ReactToastify.css';  // Import Toastify styles
import { UserContext } from "@/context/userContext"; // Assuming UserContext is set up properly

const Address = () => {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        addressId: "",
        address_line1: "",
        address_line2: "",
        city: "",
        district: "",
        state: "",
        country: "India", // Default country
        Zip_Code: "",
        phone: "",
        alternative_phone: "",
        land_mark: "",
    });
    const [successMessage, setSuccessMessage] = useState(""); // To show success message after submission
    const { user, setUser, loading } = useContext(UserContext); // Using useContext hook correctly
    const [addID, setAddID] = useState('');

    useEffect(() => {
        if (addID) {
            const matchedAddress = user?.addressID.find(address => address._id === addID);
            if (matchedAddress) {

                setFormData({
                    addressId: matchedAddress._id,  // Ensure this is being set
                    address_line1: matchedAddress.address_line1,
                    address_line2: matchedAddress.address_line2 || "",
                    city: matchedAddress.city,
                    district: matchedAddress.district,
                    state: matchedAddress.state,
                    country: matchedAddress.country || "India",
                    Zip_Code: matchedAddress.Zip_Code,
                    phone: matchedAddress.phone,
                    alternative_phone: matchedAddress.alternative_phone || "",
                    land_mark: matchedAddress.land_mark || "",
                });
                setShowForm(true);  // Show the form in edit mode
            }
        }
    }, [addID, user]);



    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Restrict phone number input to digits only and length to 10
    const handlePhoneInput = (e) => {
        const { name, value } = e.target;
        const numericValue = value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
        if (numericValue.length <= 10) {
            setFormData({ ...formData, [name]: numericValue });
        }
    };

    // Restrict pin code to 6 digits
    const handleZip_CodeInput = (e) => {
        const { name, value } = e.target;
        const numericValue = value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
        if (numericValue.length <= 6) {
            setFormData({ ...formData, [name]: numericValue });
        }
    };

    const validateForm = () => {
        // Log form data before validation
        console.log("Validating form data:", formData);

        // Check for empty required fields
        if (
            !formData.address_line1 ||
            !formData.city ||
            !formData.district ||
            !formData.state ||
            !formData.Zip_Code ||
            !formData.phone
        ) {
            console.log("Missing required fields.");
            return false;
        }

        // Convert phone and alternative phone numbers to strings and trim whitespace
        const trimmedPhone = String(formData.phone).trim();  // Ensure it's a string
        const trimmedAltPhone = formData.alternative_phone ? String(formData.alternative_phone).trim() : null;

        // Trim Zip_Code before validating it
        const trimmedZipCode = String(formData.Zip_Code).trim();  // Ensure it's a string and trim spaces

        // Validate pin code (must be 6 digits)
        if (trimmedZipCode.length !== 6) {
            console.log("Invalid Zip Code length.");
            toast.error("Zip code must be exactly 6 digits.");
            return false;
        }

        // Validate phone numbers (must be 10 digits)
        if (trimmedPhone.length !== 10) {
            console.log("Invalid phone number length.");
            toast.error("Phone number must be exactly 10 digits.");
            return false;
        }

        // Validate alternative phone number if provided (must be 10 digits)
        if (trimmedAltPhone && trimmedAltPhone.length !== 10) {
            console.log("Invalid alternative phone number length.");
            toast.error("Alternative phone number must be exactly 10 digits.");
            return false;
        }

        return true;
    };



    // Toggle form visibility and reset addID & formData
    const toggleForm = () => {
        setShowForm(!showForm);
        if (showForm) {
            // Reset form and addID when canceling
            setAddID(''); // Reset the addID to null when canceling
            setFormData({ // Reset form data to initial empty state
                addressId: "",
                address_line1: "",
                address_line2: "",
                city: "",
                district: "",
                state: "",
                country: "India",
                Zip_Code: "",
                phone: "",
                alternative_phone: "",
                land_mark: "",
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission

        console.log("Form Data Before Validation:", formData); // Log the form data

        if (!validateForm()) {
            toast.error("Please fill all the required fields correctly.");
            return; // Stop further execution if validation fails
        }

        console.log("Validation passed, submitting...");

        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/address`, {
                method: addID ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to submit the address.");
            }

            setSuccessMessage("Address updated successfully!");
            setAddID('');
            setFormData({
                address_line1: "",
                address_line2: "",
                city: "",
                district: "",
                state: "",
                country: "India",
                Zip_Code: "",
                phone: "",
                alternative_phone: "",
                land_mark: "",
            });
            setUser(data.user);

            toast.success(data.message, { autoClose: 3000 });

            setTimeout(() => {
                setShowForm(!showForm);
            }, 3000);
        } catch (error) {
            console.error(error.message || "An error occurred. Please try again.");
            toast.error(error.message || "An error occurred");
        }
    };


    return (
        <div className="flex justify-center text-xs">
            <div className="max-w-md w-full">
                <div className="flex justify-end fixed right-10 top-20 md:top-20 lg:top-28">
                    <button
                        onClick={toggleForm}
                        className="px-4 py-2 bg-green-400 text-white hover:bg-green-600 mb-6 flex items-center"
                    >
                        {/* Conditionally render the icon */}
                        {showForm ? (
                            <>
                                <FaMinus className="mr-2" /> {/* Minus icon when form is visible */}
                                Cancel Address
                            </>
                        ) : (
                            <>
                                <FaPlus className="mr-2" /> {/* Plus icon when form is hidden */}
                                Add Address
                            </>
                        )}
                    </button>
                </div>

                {showForm ? (
                    <form className="space-y-4">
                        <h1 className="text-xl font-semibold">
                            {!addID ? 'Shipping Address' : 'Edit Shipping Address'}
                        </h1>
                        <div>
                            <input
                                type="text"
                                id="address_line1"
                                name="address_line1"
                                value={formData.address_line1}
                                onChange={handleChange}
                                placeholder="Address Line 1*"
                                className="w-full px-3 py-2 border-b-2 border-gray-300 focus:outline-none 
                                focus:border-b-2 focus:border-yellow-300 placeholder-gray-400 bg-transparent"
                                required
                            />
                        </div>

                        <div>
                            <input
                                type="text"
                                id="address_line2"
                                name="address_line2"
                                value={formData.address_line2}
                                onChange={handleChange}
                                placeholder="Address Line 2"
                                className="w-full px-3 py-2 border-b-2 border-gray-300 focus:outline-none 
                                focus:border-b-2 focus:border-yellow-300 placeholder-gray-400 bg-transparent"
                            />
                        </div>

                        <div className="flex space-x-6">
                            <div className="w-1/2">
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="City/Taluk*"
                                    className="w-full px-3 py-2 border-b-2 border-gray-300 focus:outline-none 
                                    focus:border-b-2 focus:border-yellow-300 placeholder-gray-400 bg-transparent"
                                    required
                                />
                            </div>

                            <div className="w-1/2">
                                <input
                                    type="text"
                                    id="district"
                                    name="district"
                                    value={formData.district}
                                    onChange={handleChange}
                                    placeholder="District*"
                                    className="w-full px-3 py-2 border-b-2 border-gray-300 focus:outline-none 
                                    focus:border-b-2 focus:border-yellow-300 placeholder-gray-400 bg-transparent"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex space-x-6">
                            <div className="w-1/2">
                                <input
                                    type="text"
                                    id="state"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    placeholder="State*"
                                    className="w-full px-3 py-2 border-b-2 border-gray-300 focus:outline-none 
                                    focus:border-b-2 focus:border-yellow-300 placeholder-gray-400 bg-transparent"
                                    required
                                />
                            </div>

                            <div className="w-1/2">
                                <select
                                    id="country"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border-b-2 border-gray-300 focus:outline-none 
                                    focus:border-b-2 focus:border-yellow-300 placeholder-gray-400 bg-transparent"
                                    required
                                >
                                    <option value="India">India</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex space-x-6">
                            <div className="w-1/2">
                                <input
                                    type="text"
                                    id="Zip_Code"
                                    name="Zip_Code"
                                    value={formData.Zip_Code}
                                    onChange={handleZip_CodeInput}
                                    placeholder="Pin Code*"
                                    className="w-full px-3 py-2 border-b-2 border-gray-300 focus:outline-none 
                                    focus:border-b-2 focus:border-yellow-300 placeholder-gray-400 bg-transparent"
                                    required
                                />
                            </div>

                            <div className="w-1/2">
                                <input
                                    type="text"
                                    id="land_mark"
                                    name="land_mark"
                                    value={formData.land_mark}
                                    onChange={handleChange}
                                    placeholder="land_mark (Optional)"
                                    className="w-full px-3 py-2 border-b-2 border-gray-300 focus:outline-none 
                                    focus:border-b-2 focus:border-yellow-300 placeholder-gray-400 bg-transparent"
                                />
                            </div>
                        </div>

                        <div className="flex space-x-6">
                            <div className="w-1/2">
                                <input
                                    type="text"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handlePhoneInput}
                                    placeholder="Primary Phone Number*"
                                    className="w-full px-3 py-2 border-b-2 border-gray-300 focus:outline-none 
                                    focus:border-b-2 focus:border-yellow-300 placeholder-gray-400 bg-transparent"
                                    required
                                />
                            </div>

                            <div className="w-1/2">
                                <input
                                    type="text"
                                    id="alternative_phone"
                                    name="alternative_phone"
                                    value={formData.alternative_phone}
                                    onChange={handlePhoneInput}
                                    placeholder="Alternative Phone Number"
                                    className="w-full px-3 py-2 border-b-2 border-gray-300 focus:outline-none 
                                    focus:border-b-2 focus:border-yellow-300 placeholder-gray-400 bg-transparent"
                                />
                            </div>
                        </div>

                        <button
                            className="w-full mt-6 px-4 py-2 bg-green-400 text-white hover:bg-green-500"
                            onClick={handleSubmit}
                        >
                            {!addID ? "Submit" : "Update"}
                        </button>

                    </form>
                )
                    :

                    (
                        <AddressList setAddID={setAddID} />
                    )
                }
            </div>
        </div>
    );
};

export default Address;
