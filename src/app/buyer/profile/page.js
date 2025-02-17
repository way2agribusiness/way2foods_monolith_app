'use client'; // Add this at the top of the file
import React from "react";
import EditProfile from "./editProfile";
import Address from "./addressAdd";

const ProfilePage = () => {
    return (
        <div className="md:mx-24 lg:mx-24 flex flex-col md:flex-row">
            {/* EditProfile Section */}
            <div className="my-10 flex-1">
                <EditProfile />
            </div>
            
            {/* Address Section */}
            <div className="my-10 flex-1">
                <Address />
            </div>
        </div>
    );
};

export default ProfilePage;


