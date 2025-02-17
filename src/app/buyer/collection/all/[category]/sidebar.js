'use client';
import React, { useState } from 'react';
import { TbFilterPause } from 'react-icons/tb';
import { RxCross2 } from 'react-icons/rx';

// Example JSON data for categories and subcategories
const categoryData = {
    1: {
        name: 'Vegetables',
        subcategories: [
            { id: 1, name: 'Essential and Regular Vegetables' },
            { id: 2, name: 'Exotic Vegetables' },
            { id: 3, name: 'Leafy Vegetables' },
            { id: 4, name: 'Major Vegetables' },
            { id: 5, name: 'Other Vegetables' },
        ],
    },
    2: {
        name: 'Fruits',
        subcategories: [
            { id: 1, name: 'Exotic and Imported Fruits' },
            { id: 2, name: 'Major Seasonal Fruits' },
            { id: 3, name: 'Other Fruits' },
        ],
    },
    3: {
        name: 'Groceries',
        subcategories: [
            { id: 1, name: 'Grains, Pulses, and Millets' },
            { id: 2, name: 'Oil, Seeds, and Other' },
            { id: 3, name: 'Plantation and Nuts' },
            { id: 4, name: 'Spices' },
            { id: 5, name: 'Special Packages' },
            { id: 6, name: 'Special Products' },
        ],
    },
};

const AllProductByCategory = () => {
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [selectedCategoryName, setSelectedCategoryName] = useState('');
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState('');
    const [selectedSubcategoryName, setSelectedSubcategoryName] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to toggle sidebar

    const handleCategoryChange = (e) => {
        const categoryId = e.target.value;
        if (categoryId === '') {
            setSelectedCategoryId('');
            setSelectedCategoryName('');
            setSelectedSubcategoryId('');
            setSelectedSubcategoryName('');
        } else {
            const category = categoryData[categoryId];
            setSelectedCategoryId(categoryId);
            setSelectedCategoryName(category.name);
            setSelectedSubcategoryId('');
            setSelectedSubcategoryName('');
        }
    };

    const handleSubcategoryChange = (e) => {
        const subcategoryId = e.target.value;
        if (subcategoryId === '') {
            setSelectedSubcategoryId('');
            setSelectedSubcategoryName('');
        } else {
            const subcategory = categoryData[selectedCategoryId].subcategories.find(
                (sub) => sub.id === parseInt(subcategoryId)
            );
            setSelectedSubcategoryId(subcategory.id);
            setSelectedSubcategoryName(subcategory.name);
        }
    };

    const subcategories =
        selectedCategoryId && categoryData[selectedCategoryId]
            ? categoryData[selectedCategoryId].subcategories
            : [];

    // Toggle the sidebar visibility
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex text-xs">
            {/* Sidebar */}
            <div
                className={`md:w-1/4 w-full ${isSidebarOpen ? 'block' : 'hidden'}`}
            >
                <h3 className="font-semibold ms-2 text-sm md:text-xl mb-4">Filters</h3>

                {/* Category Filter */}
                <div className="mb-4">
                    <h4 className="font-semibold mb-2">Category</h4>
                    <select
                        className="w-full p-2 border rounded outline-yellow-400"
                        value={selectedCategoryId}
                        onChange={handleCategoryChange}
                    >
                        <option value="">---Select Category---</option>
                        {Object.entries(categoryData).map(([key, value]) => (
                            <option key={key} value={key}>
                                {value.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Subcategory Filter */}
                <div className="mb-4">
                    <h4 className="font-semibold mb-2">Subcategory</h4>
                    <select
                        className="w-full p-2 border rounded outline-yellow-400"
                        value={selectedSubcategoryId}
                        onChange={handleSubcategoryChange}
                        disabled={!selectedCategoryId}
                    >
                        <option value="">---Select Subcategory---</option>
                        {subcategories.map((subcategory) => (
                            <option key={subcategory.id} value={subcategory.id}>
                                {subcategory.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Mobile Sidebar Toggle */}
            <button
                className="bg-green-600 hover:bg-green-700 h-7 p-2 text-white m-2 rounded-full md:hidden z-50 transition-all ease-in-out duration-300"
                onClick={toggleSidebar}
            >
                {/* Icon */}
                <span>{isSidebarOpen ? <RxCross2 /> : <TbFilterPause />}</span>

                {/* Label */}
                <span className="font-semibold ms-2">Filters</span>
            </button>
        </div>
    );
};

export default AllProductByCategory;
