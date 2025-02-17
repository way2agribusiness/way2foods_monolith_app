'use client';
import { useState } from 'react';
import Sidebar from './sidebar'; // Assuming Sidebar is a separate component
import { TbFilterPause } from 'react-icons/tb';
import { RxCross2 } from 'react-icons/rx';

const AllProductLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen); // Toggle the sidebar

    return (
        <div className="flex">
            {/* Sidebar - Fixed to the left */}
            <div className={`fixed h-screen z-20 ${isSidebarOpen ? 'block' : 'hidden md:block'}`}>
                <Sidebar />
            </div>

            {/* Main content - Adjusts its width dynamically */}
            <div className={`flex-1 transition-all ease-in-out duration-[1000ms] ${isSidebarOpen ? "ml-[250px]" : "ml-[80px]"}`}>
                <main className="p-5">{children}</main>
            </div>

            {/* Mobile Sidebar Toggle */}
            <button
                className="bg-green-600 hover:bg-green-700 h-7 p-2 text-white m-2 rounded-full md:hidden z-50 transition-all ease-in-out duration-300"
                onClick={toggleSidebar}
            >
                <span>{isSidebarOpen ? <RxCross2 /> : <TbFilterPause />}</span>
                <span className="font-semibold ms-2">Filters</span>
            </button>
        </div>
    );
};

export default AllProductLayout;
