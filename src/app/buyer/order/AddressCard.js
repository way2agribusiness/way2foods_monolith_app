import React from "react";
import { MdEdit, MdDelete } from "react-icons/md";

const AddressCard = () => {
    return (
        <div className="bg-white rounded-lg p-4 border border-gray-200 text-xs relative">
            {/* Radio Button for Selection */}
            <div className="">
                <input type="radio" name="address" className="w-5 h-5 cursor-pointer" />
            </div>

            {/* Address Content */}
            <p className="text-gray-700 font-medium ">Address Line 1</p>
            <p className="text-gray-700">Address Line 2</p>
            <p className="text-gray-700">City, District</p>
            <p className="text-gray-700">State, Country (Zip Code)</p>
            <p className="text-gray-700">
                <span className="font-bold text-blue-600">Phone Number</span>
            </p>

            {/* Edit and Delete Buttons */}
            <div className="absolute bottom-4 right-4 flex space-x-3">
                {/* Edit Icon (Green) */}
                <button className="text-green-500 hover:text-green-700">
                    <MdEdit className="w-6 h-6" />
                </button>
                {/* Delete Icon (Red) */}
                <button className="text-red-500 hover:text-red-700">
                    <MdDelete className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

const AddressGrid = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <AddressCard />
            <AddressCard />
            {/* <AddressCard /> */}
        </div>
    );
};

export default AddressGrid;