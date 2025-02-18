'use client';
import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const AdminCardData = () => {
    // Dummy data for the charts
    const barChartData = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
            {
                label: "Sales",
                data: [65, 59, 80, 81, 56, 55, 40],
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
        ],
    };

    const pieChartData = {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [
            {
                label: "Colors",
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    "rgba(255, 99, 132, 0.6)",
                    "rgba(54, 162, 235, 0.6)",
                    "rgba(255, 206, 86, 0.6)",
                    "rgba(75, 192, 192, 0.6)",
                    "rgba(153, 102, 255, 0.6)",
                    "rgba(255, 159, 64, 0.6)",
                ],
                borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)",
                    "rgba(255, 159, 64, 1)",
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
                Admin Card Data Page
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Sales Overview Card */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        Sales Overview
                    </h2>
                    <Bar data={barChartData} options={{ responsive: true }} />
                </div>

                {/* Product Distribution Card */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        Product Distribution
                    </h2>
                    <Pie data={pieChartData} options={{ responsive: true }} />
                </div>

                {/* Key Metrics Card */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Key Metrics</h2>
                    <div className="flex justify-around">
                        <div className="text-center">
                            <h3 className="text-lg font-medium text-gray-600">Total Users</h3>
                            <p className="text-2xl font-bold text-gray-800">1,234</p>
                        </div>
                        <div className="text-center">
                            <h3 className="text-lg font-medium text-gray-600">Active Sessions</h3>
                            <p className="text-2xl font-bold text-gray-800">567</p>
                        </div>
                        <div className="text-center">
                            <h3 className="text-lg font-medium text-gray-600">Conversion Rate</h3>
                            <p className="text-2xl font-bold text-gray-800">12.5%</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCardData;