import mongoose from "mongoose";
import cloudinary from "@/config/cloudinary";
import Product from "@/models/products";
import Brand from "@/models/brand";
import Category from "@/models/category";
import Subcategory from "@/models/subCategory";
import User from "@/models/user";
import authMiddleware from '@/middlewares/authMiddleware';
import ConnectedDB from "@/config/db";
import { NextResponse } from "next/server"; // Adjust this if you're using Express or a different framework





// Get all products for admin.....
const GET_ALL_PRODUCTS = async (request) => {
    try {
        // Connect to the database
        await ConnectedDB();

        // Apply the authentication middleware to validate the user
        authMiddleware(request);

        // Extract the seller ID from the authenticated request
        const sellerId = request.user.id;

        // Find the seller from the database
        const seller = await User.findById(sellerId);
        if (!seller) {
            return NextResponse.json({ message: 'Unauthorized access: Seller not found' }, { status: 404 });
        }

        // Check if the user is a seller (role: apmcConnect or fpoConnect)
        if (seller.role !== 'apmcConnect' && seller.role !== 'fpoConnect') {
            return NextResponse.json({ message: 'Forbidden: You are not authorized to access these products' }, { status: 403 });
        }

        // Manually parse query parameters from request.url using URLSearchParams
        const { searchParams } = new URL(request.url);
        const size = searchParams.get('size');
        const page = searchParams.get('page');
        const searchString = searchParams.get('searchString') || "";
        const categoryID = searchParams.get('categoryID');
        const subCategoryID = searchParams.get('subCategoryID');
        const isActive = searchParams.get('isActive');
        const isApproved = searchParams.get('isApproved');

        // Sanitize the searchString by trimming whitespace and newlines
        const sanitizedSearchString = searchString.trim().replace(/\s+/g, " "); // Removes excessive whitespaces and newlines

        // Initialize default values if not provided
        let pageSize = size ? parseInt(size, 10) : 10;  // Default to 10 if size is not provided
        let pageNumber = page ? parseInt(page, 10) : 1;  // Default to page 1 if page is not provided

        // Validate pagination parameters if provided
        if (pageSize && (isNaN(pageSize) || pageSize <= 0)) {
            return NextResponse.json({ message: 'Invalid page size' }, { status: 400 });
        }
        if (pageNumber && (isNaN(pageNumber) || pageNumber <= 0)) {
            return NextResponse.json({ message: 'Invalid page number' }, { status: 400 });
        }

        // Construct the search query with filters
        const searchQuery = { sellerID: sellerId };  // Filter products by sellerID (the authenticated seller)

        // Search by title if searchString is provided
        if (sanitizedSearchString) {
            searchQuery.title = { $regex: sanitizedSearchString, $options: "i" };  // Case-insensitive search for title
        }

        // Apply categoryID filter
        if (categoryID) {
            const category = await Category.findOne({ name: categoryID.trim() }); // Match by name
            if (category) {
                searchQuery.categoryID = category._id;  // Use the ObjectId of the category
            } else {
                return NextResponse.json({ message: `Category '${categoryID}' not found` }, { status: 404 });
            }
        }

        // Apply subCategoryID filter (match by name)
        if (subCategoryID) {
            const subCategory = await Subcategory.findOne({ name: subCategoryID.trim() });  // Match by name
            if (subCategory) {
                searchQuery.subCategoryID = subCategory._id;  // Use the ObjectId of the subCategory
            } else {
                return NextResponse.json({ message: `SubCategory '${subCategoryID}' not found` }, { status: 404 });
            }
        }

        // Apply filter for isActive
        if (isActive !== undefined) {
            if (isActive === null || isActive === '') {
                delete searchQuery.isActive;  // Don't filter on isActive, so it will return both true and false
            } else {
                searchQuery.isActive = isActive === 'true';  // Convert string 'true'/'false' to boolean
            }
        }

        // Apply filter for isApproved
        if (isApproved !== undefined) {
            if (isApproved === null || isApproved === '') {
                delete searchQuery.isApproved; // Don't filter on isApproved, so it will return both true and false
            } else {
                searchQuery.isApproved = isApproved === 'true';  // Convert string 'true'/'false' to boolean
            }
        }

        // Fetch the products from the database
        let productsQuery = Product.find(searchQuery)
            .populate('brand categoryID subCategoryID sellerID')  // Populate referenced fields
            .populate({
                path: 'sellerID',
                select: '-password -token',  // Exclude sensitive fields
            })
            .sort({ createdAt: -1 });  // Sorting by creation date in descending order

        // Apply pagination if both size and page are provided
        if (pageSize && pageNumber) {
            productsQuery = productsQuery
                .skip((pageNumber - 1) * pageSize) // Pagination skip
                .limit(pageSize);                 // Pagination limit
        }

        // Fetch the products
        const products = await productsQuery;

        // If pagination is applied, get the total number of products for metadata
        let totalProducts = 0;
        if (pageSize && pageNumber) {
            totalProducts = await Product.countDocuments(searchQuery).exec();
        }

        // Return the paginated list of products along with metadata
        return NextResponse.json({
            success: true,
            message: 'Products fetched successfully',
            products,
            totalProducts,
            totalPages: pageSize && pageNumber ? Math.ceil(totalProducts / pageSize) : null,
            currentPage: pageNumber || null,
            pageSize: pageSize || null,
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching all products:", error);
        return NextResponse.json({ message: 'Error fetching products', error: error.message }, { status: 500 });
    }
};


// Main GET handler to route based on the presence of the slug query
export async function GET(request) {
    // If no 'id' is passed, we route to GET_ALL_PRODUCTS
    return GET_ALL_PRODUCTS(request);
};