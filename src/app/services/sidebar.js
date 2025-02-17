import React, { useState, useContext } from "react";
import { UserContext } from "@/context/userContext";
import { RxDashboard } from "react-icons/rx";
import { RiProductHuntLine } from "react-icons/ri";
import { BsCart4 } from "react-icons/bs";
// import { HiOutlineUsers } from "react-icons/hi2";
// import { IoIosGlobe } from "react-icons/io";
import { IoStorefrontOutline } from "react-icons/io5";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import Link from "next/link";

const navItems = [
    { id: 1, title: "Dashboard", icon: <RxDashboard />, path: "/services/dashboard" },
    { id: 2, title: "Products", icon: <RiProductHuntLine />, path: "/services/collections" },
    { id: 3, title: "Orders", icon: <BsCart4 />, path: "#" },
    //   { id: 4, title: "Users", icon: <HiOutlineUsers />, path: "#" },
    { id: 5, title: "APMC Connect", icon: <IoStorefrontOutline />, path: "#" },
    //   { id: 6, title: "FPO Connect", icon: <IoIosGlobe />, path: "#" },
];

export default function App({ setIsSidebarOpen, isSidebarOpen }) {
    const { user, loading, error } = useContext(UserContext); // Using useContext hook correctly
    const [activeItem, setActiveItem] = useState(navItems[0]); // Default to first item

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

      // Handling loading and error states
      if (loading) {
        return <header>Loading...</header>;
    }

    if (error) {
        return <header>Error: {error}</header>;
    }

    return (
        <div>
            {/* Sidebar */}
            <nav
                className={`${isSidebarOpen ? "w-[250px]" : "w-[80px]"
                    } bg-white shadow-lg h-screen py-6 px-4 font-[sans-serif] transition-all ease-in-out duration-[1000ms]`}
            >
                {/* Logo Section */}
                <div className="relative text-xs">
                    <div className="flex flex-col items-center">
                        {/* Logo Image */}
                        <img
                            src="https://res.cloudinary.com/dm71xhdxd/image/upload/v1696576692/Static%20Images/W2F_gnw3ch_jvntof.webp"
                            alt="Company Logo"
                            className={`transition-all ease-in-out duration-[1000ms] mb-2 ${isSidebarOpen ? "h-12 w-auto" : "h-8 w-auto"
                                }`}
                        />
                        {/* Logo Text */}
                        <a
                            href="#"
                            className={`text-gray-800 font-semibold text-lg transition-all ease-in-out duration-[1000ms] ${isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                                }`}
                        >
                           {user && user.firstName + ' ' +  user.lastName}
                        </a>
                    </div>

                    {/* Toggle Button */}
                    <button
                        onClick={toggleSidebar}
                        className="absolute -right-6 top-2 h-6 w-6 flex items-center justify-center bg-white text-black p-1 rounded-full focus:outline-none shadow-xl border-2 border-green-600"
                        aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                    >
                        {isSidebarOpen ? (
                            <FiArrowLeft size={20} className="hover:text-yellow-300" />
                        ) : (
                            <FiArrowRight size={20} className="hover:text-yellow-300" />
                        )}
                    </button>
                </div>

                {/* Navigation Items */}
                <div className="mt-5 text-xs">
                    <ul className="space-y-4">
                        {navItems.map((item) => (
                            <li
                                key={item.id}
                                className={`p-2 hover:bg-green-100 rounded-lg cursor-pointer transition-all ease-in-out duration-[1000ms] ${activeItem.id === item.id ? "bg-green-100 text-green-700" : ""
                                    }`}
                                onClick={() => setActiveItem(item)} // Set active item on click
                            >
                                <Link href={item.path}
                                    className="flex items-center gap-3">
                                    <span className="">{item.icon}</span>
                                    <span
                                        className={`text-gray-700 ${isSidebarOpen ? "opacity-100" : "opacity-0"}`}
                                    >
                                        {item.title}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        </div>
    );
}
