'use client';
import { useState } from 'react';
import Sidebar from './sidebar';

const AdminDashboardLayout = ({ children }) => {
    const [activeComponent, setActiveComponent] = useState('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleNavClick = (component) => {
        setActiveComponent(component); // Set the active component based on sidebar click
    };

    return (
        <div className="flex">
            {/* Sidebar - Fixed to the left */}
            <div className="fixed h-screen z-20">
                <Sidebar
                    onNavClick={handleNavClick}
                    setIsSidebarOpen={setIsSidebarOpen}
                    isSidebarOpen={isSidebarOpen}
                />
            </div>

            {/* Main content - Adjusts its width dynamically */}
            <div
                className={`flex-1 ml-[250px] transition-all ease-in-out duration-[1000ms] ${isSidebarOpen ? "ml-[250px]" : "ml-[80px]"
                    }`}
            >
                <main className="p-5">{children}</main>
            </div>
        </div>
    );
};

export default AdminDashboardLayout;
