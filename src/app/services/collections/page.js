'use client';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaEye, FaSearch, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';  // Import Toastify
import 'react-toastify/dist/ReactToastify.css';  // Import Toastify styles
import ConfirmationModal from './ConfirmationModal'; // Import the modal component
import { useRouter } from 'next/navigation';

// Example JSON data for categories and subcategories
const categoryData = {
    1: {
        name: "Vegetables",
        subcategories: [
            { id: 1, name: "Essential and Regular Vegetables" },
            { id: 2, name: "Exotic Vegetables" },
            { id: 3, name: "Leafy Vegetables" },
            { id: 4, name: "Major Vegetables" },
            { id: 5, name: "Other Vegetables" },
        ],
    },
    2: {
        name: "Fruits",
        subcategories: [
            { id: 1, name: "Exotic and Imported Fruits" },
            { id: 2, name: "Major Seasonal Fruits" },
            { id: 3, name: "Other Fruits" },
        ],
    },
    3: {
        name: "Groceries",
        subcategories: [
            { id: 1, name: "Grains, Pulses, and Millets" },
            { id: 2, name: "Oil, Seeds, and Other" },
            { id: 3, name: "Plantation and Nuts" },
            { id: 4, name: "Spices" },
            { id: 5, name: "Special Packages" },
            { id: 6, name: "Special Products" },
        ],
    },
};


const ServicesProductList = () => {
    let [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Number of products per page

    const [product, setProduct] = useState([]);

    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [selectedCategoryName, setSelectedCategoryName] = useState('');
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null);
    const [selectedSubcategoryName, setSelectedSubcategoryName] = useState('');

    const [isActive, setIsActive] = useState('');
    const [isApproved, setIsApproved] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productIdToDelete, setProductIdToDelete] = useState(null);
    const [productNameToDelete, setProductNameToDelete] = useState('');

    const router = useRouter();

    const handleCategoryChange = (e) => {
        const categoryId = e.target.value;
        if (categoryId === "") {
            setSelectedCategoryId('');
            setSelectedCategoryName('');
            setSelectedSubcategoryId('');
            setSelectedSubcategoryName('');
        } else {
            const category = categoryData[categoryId];
            setSelectedCategoryId(categoryId);
            setSelectedCategoryName(category.name);
            setCurrentPage(1);
            setSelectedSubcategoryId('');
            setSelectedSubcategoryName('');
        }
    };

    const handleSubcategoryChange = (e) => {
        const subcategoryId = e.target.value;
        if (subcategoryId === "") {
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


    const fetchProducts = async () => {
        try {
            // Construct query parameters
            const queryParams = new URLSearchParams({
                page: (isActive || isApproved) ? 1 : currentPage,        // Dynamically fetch based on the current page
                size: itemsPerPage,            // Number of items per page
                searchString: searchTerm,      // Optional : The search term for product title
                categoryID: selectedCategoryName,        // Optional: Include categoryID filter
                subCategoryID: selectedSubcategoryName,  // Optional: Include subCategoryID filter
                isActive: isActive,            // Optional: Include isActive filter
                isApproved: isApproved,        // Optional: Include isApproved filter
            }).toString();

            // Fetch the token from localStorage for authorization
            const token = localStorage.getItem("token");

            if (!token) {
                return;
            }

            // Make the fetch request to the API with the constructed query parameters
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/product?${queryParams}`, {
                headers: {
                    Authorization: `Bearer ${token}`,  // Send token in Authorization header
                },
            });

            // Check if the response is successful
            if (!response.ok) {
                throw new Error("Failed to fetch product data");
            }

            // Parse the JSON response
            const data = await response.json();

            // Handle the fetched product data (e.g., set state)
            setProduct(data);

        } catch (error) {
            // Log any errors during the API call
            console.log("Error-message:", error);
        }
    };

    // UseEffect hook to fetch products when searchTerm or currentPage changes
    useEffect(() => {
        fetchProducts();
    }, [searchTerm, currentPage, selectedCategoryName, selectedSubcategoryName, isActive, isApproved]);


    const { products, totalPages } = product;


    // Handle search term change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);  // Reset the page to 1 whenever search term changes
    };


    // Handle delete button click - open the modal
    const handleDeleteClick = (productId, productName) => {
        setProductIdToDelete(productId);
        setProductNameToDelete(productName);
        setIsModalOpen(true); // Open the modal
    };

    const handleConfirmDelete = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("Authorization token is missing");
            return;
        }

        try {
            // Ensure you are sending the correct DELETE request to the API
            const response = await fetch('/api/product', {
                method: "DELETE", // Set the method to DELETE
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Include token in headers
                },
                body: JSON.stringify({ productId: productIdToDelete }), // Send the productId in the request body as JSON
            });

            if (!response.ok) {
                throw new Error('Failed to delete product');
            }

            const data = await response.json();
            toast.success(data.message); // Show success notification

            // Close modal and reset states
            setIsModalOpen(false); // Close modal
            setProductIdToDelete(null); // Reset the product ID to delete
            setProductNameToDelete(''); // Reset the product name to delete

            fetchProducts();

            // Optionally, you can remove the deleted product from the local state (products list)
            setProduct((prev) => ({
                ...prev,
                products: prev.products.filter((item) => item._id !== productIdToDelete),
            }));
        } catch (error) {
            toast.error('Error deleting product: ' + error.message); // Show error notification
            console.error('Error deleting product:', error);
        }
    };


    // Handle the cancel action
    const handleCancelDelete = () => {
        setIsModalOpen(false); // Close the modal
        setProductIdToDelete(null); // Reset the product ID to delete
    };


    const handleEdit = (productId) => {
        console.log('productID :', productId);
        localStorage.setItem('productId', productId);
        router.push('/services/addcollections');
    };


    const toggleActive = async (Id, toggle) => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                console.log('token not found!');
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/active`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId: Id,
                    isActive: toggle, // Toggle the approval status before sending
                })
            });

            if (response.ok) {
                const data = await response.json();
                toast.success(data.message); // Show success notification
                fetchProducts();  // Call fetchProducts without changing the page number
            } else {
                const errorData = await response.json();
                console.error(errorData.message);
            }
        } catch (error) {
            toast.error('Error active product: ' + error.message); // Show error notification
            console.error("Error toggling approval status:", error);
        }
    };

    return (
        <div className="max-w-full">
            <h2 className="text-xs font-semibold text-center mb-3 text-gray-800">ALL Product List</h2>
            <div className='text-xs'>
                <ul className='flex justify-end space-x-4'>
                    <li className='flex items-center'>
                        <FaEdit className='mr-2 text-orange-500' /> Edit
                    </li>
                    <li className='flex items-center'>
                        < FaTrash className='mr-2 text-red-500' /> Delete
                    </li>
                    <li className='flex items-center'>
                        <FaEye className='mr-2 text-blue-700' /> View Details
                    </li>
                    <li className='flex items-center'>
                        <FaCheckCircle className='mr-2 text-green-500' /> Active
                    </li>
                    <li className='flex items-center'>
                        <FaTimesCircle className='mr-2 text-red-500' /> Deactive
                    </li>
                </ul>
            </div>
            <div className='bg-white shadow-lg rounded-lg hidden md:block'>

                <div className="flex p-4 bg-gray-50 border-b">
                    {/* Left side - Search Box (1/2 of the width) */}
                    <div className="w-1/2 flex items-center relative bg-white border border-gray-300 rounded-md">
                        <input
                            type="text"
                            placeholder="Search by product name..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="px-4 py-2 w-full text-sm border-r border-gray-300 rounded-md focus:outline-none pr-10"
                        />
                        <FaSearch className="absolute right-2 text-gray-500" />
                    </div>


                    {/* Right side - Total Products and Add New button (1/2 of the width) */}
                    <div className="w-1/2 flex justify-between items-center pl-4">
                        <div className="text-sm text-gray-700">
                            Total Product: <span className="font-bold">{product.products && product.totalProducts}</span>
                        </div>
                        <Link
                            href='/services/addcollections'
                            className="flex items-center text-xs px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition duration-200 ease-in-out">
                            <span className='text-xl mr-2'>+</span> Add New Product
                        </Link>

                    </div>
                </div>

                {/* Table for desktop */}
                <div className="p-2">
                    <table className="table-auto text-[10px] text-gray-700">
                        <thead className="bg-gray-50 text-left">
                            <tr className="border-b">
                                <th className="py-2 font-semibold">Sl.no</th>
                                <th className="px-4 py-2 font-semibold">Title</th>
                                <th className="px-4 py-2 font-semibold">Image</th>
                                <th className="px-4 py-2 font-semibold">
                                    <select
                                        className="border rounded px-2 py-1"
                                        value={selectedCategoryId || ""}
                                        onChange={handleCategoryChange}
                                    >
                                        <option value="">Categories</option>
                                        {Object.entries(categoryData).map(([key, value]) => (
                                            <option key={key} value={key}>
                                                {value.name}
                                            </option>
                                        ))}
                                    </select>
                                </th>
                                <th className="px-4 py-2 font-semibold">
                                    <select
                                        className="border rounded px-2 py-1"
                                        value={selectedSubcategoryId || ""}
                                        onChange={handleSubcategoryChange}
                                        disabled={!selectedCategoryId}
                                    >
                                        <option value="">Subcategories</option>
                                        {subcategories.map((subcategory) => (
                                            <option key={subcategory.id} value={subcategory.id}>
                                                {subcategory.name}
                                            </option>
                                        ))}
                                    </select>
                                </th>
                                <th className="px-4 py-2 font-semibold">Price</th>
                                <th className="px-4 py-2 font-semibold">CreatedAt</th>
                                <th className="px-4 py-2 font-semibold">UpdatedAt</th>
                                <th className="py-2 font-semibold">
                                    <select
                                        value={isActive}
                                        onChange={(e) => setIsActive(e.target.value)}
                                    >
                                        <option value="">Active</option>
                                        <option value={true}>Yes</option>
                                        <option value={false}>No</option>
                                    </select>
                                </th>
                                <th className="py-2 font-semibold">
                                    <select
                                        value={isApproved}
                                        onChange={(e) => setIsApproved(e.target.value)}
                                    >
                                        <option value="">Approved</option>
                                        <option value={true}>Yes</option>
                                        <option value={false}>No</option>
                                    </select>
                                </th>
                                <th className="px-4 py-2 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {product.products && product.products.map((product, index) => (
                                <tr key={product._id} className="border-t hover:bg-gray-50">
                                    <td className="py-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                    <td className="px-4 py-2">{product.title}</td>
                                    <td className="px-4 py-2">
                                        <img
                                            src={product.image[0]}
                                            alt={product.title}
                                            className="w-12 h-12 object-cover rounded"
                                        />
                                    </td>
                                    <td className="px-4 py-2">{product.categoryID.name}</td>
                                    <td className="px-4 py-2">{product.subCategoryID.name}</td>
                                    <td className="px-4 py-2">₹{product.price}</td>
                                    <td className="px-4 py-2">{new Date(product.createdAt).toLocaleDateString()}</td>
                                    <td className="px-4 py-2">{new Date(product.updatedAt).toLocaleDateString()}</td>
                                    <td className="py-2">
                                        <span className={`px-2 py-1 font-semibold rounded ${product.isActive ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                            {product.isActive ? 'Yes' : 'No'}
                                        </span>
                                    </td>
                                    <td className="py-2">
                                        <span className={`px-2 py-1 font-semibold rounded ${product.isApproved ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                            {product.isApproved ? 'Yes' : 'No'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2">
                                        <div className="flex justify-center gap-4">
                                            <button className="text-blue-500 hover:text-blue-700"
                                                onClick={() => handleEdit(product._id)}
                                            >
                                                <FaEdit />
                                            </button>
                                            <button className="text-red-500 hover:text-red-700"
                                                onClick={() => handleDeleteClick(product._id, product.title)}
                                            >
                                                <FaTrash />
                                            </button>
                                            <Link
                                                href={`/buyer/collection/${product.slug}`}
                                                className="text-blue-700 hover:text-blue-600">
                                                <FaEye />
                                            </Link>
                                            <button
                                                className={`${product.isActive ? 'text-red-500 hover:text-red-700' : 'text-green-500 hover:text-green-700'}`}
                                                onClick={toggleActive.bind(this, product._id, product.isActive ? false : true)}
                                            >
                                                {product.isActive ? <FaTimesCircle /> : <FaCheckCircle />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-end p-2">
                    <p className="text-xs mr-2">Page:</p>
                    <select
                        className="py-1 border-2 border-green-600 text-xs rounded outline-none"
                        value={currentPage} // Shows the selected value inside the dropdown
                        onChange={(e) => setCurrentPage(Number(e.target.value))} // Updates currentPage state
                    >
                        {Array.from({ length: totalPages }, (_, index) => (
                            <option key={index + 1} value={index + 1}>
                                {index + 1} / {totalPages}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={isModalOpen}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                productName={productNameToDelete}
            />

            {/* Toast Container */}
            <ToastContainer />
        </div>
    );
};

export default ServicesProductList;
