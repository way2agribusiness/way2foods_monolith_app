import React, { useState, useContext, useEffect } from "react";
import { MdEdit, MdDelete } from "react-icons/md"; // Importing edit and delete icons
import { UserContext } from "@/context/userContext"; // Assuming UserContext is set up properly
import { toast } from 'react-toastify';  // Import Toastify
import 'react-toastify/dist/ReactToastify.css';  // Import Toastify styles

const AddressList = ({ setAddID }) => {
    const { user, setUser, loading } = useContext(UserContext); // Using useContext hook correctly

    useEffect(() => {
        if (user) {
            // You can perform any action here after the user is available
        }
    }, [user]); // Re-run when `user` data changes

    const handleEdit = (addId) => {
        setAddID(addId);
    };

    const handleDelete = async (addressId) => {
        try {
            const token = localStorage.getItem("token"); // Get the token from localStorage

            if (!token) {
                console.error("No token found. Please log in.");
                return;
            }

            // Make DELETE request to delete the address
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/address`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json", // Set the Content-Type to JSON
                    Authorization: `Bearer ${token}`, // Send token in Authorization header
                },
                body: JSON.stringify({ addressId }), // Send the addressId in the body as JSON
            });

            const data = await response.json(); // Parse the JSON response

            if (response.ok) {
                setUser(data.user);
                toast.success(data.message, { autoClose: 3000 });

            } else {
                // Handle any errors that occurred during the deletion process
                toast.error(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error("An error occurred:", error);
            toast.error(error.message || "An error occurred");
        }
    };


    return (
        <div className="max-w-7xl mx-auto text-xs">
            {/* Check if user has addresses */}
            {user && user.addressID && user.addressID.length > 0 ? (
                user.addressID.map((address) => (
                    <div key={address._id} className="max-w-md mx-auto bg-white rounded-lg shadow-2xl shadow-green-100 p-6 my-4 border border-gray-100 text-sm relative">
                        {/* Address Content */}
                        <p className="text-gray-700 font-medium ">{address.address_line1}</p>
                        {address.address_line2 && <p className="text-gray-700">{address.address_line2}</p>}
                        <p className="text-gray-700">
                            {address.city}, {address.district}
                        </p>
                        <p className="text-gray-700">
                            {address.state}, {address.country}
                            <span className="text-gray-700"> ({address.Zip_Code})</span>
                        </p>

                        <p className="text-gray-700">
                            <span className="font-bold text-blue-600">
                                {address.phone},
                                {address.alternative_phone && ` ${address.alternative_phone}`}
                            </span>
                        </p>

                        {/* Edit and Delete Buttons */}
                        <div className="absolute bottom-4 right-4 flex space-x-3">
                            {/* Edit Icon (Green) */}
                            <button className="text-green-500 hover:text-green-700"
                                onClick={handleEdit.bind(this, address._id)}
                            >
                                <MdEdit className="w-6 h-6" />
                            </button>
                            {/* Delete Icon (Red) */}
                            <button className="text-red-500 hover:text-red-700"
                                onClick={handleDelete.bind(this, address._id)}
                            >
                                <MdDelete className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-gray-700">No addresses available</p> // If no addresses, display this
            )}
        </div>
    );
}

export default AddressList;
