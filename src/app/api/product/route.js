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


// create product by Admin and Seller.......
export const POST = async (request) => {
    try {
        // Step 1: Connect to the database
        await ConnectedDB();

        // Step 2: Handle authentication (get the user from token)
        authMiddleware(request); // Validate and extract user data from token

        const userId = request.user.id;  // Extract user ID (this assumes authentication middleware has been applied)

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: 'Unauthorized access' }, { status: 404 });
        }

        const body = await request.json(); // Read the body once

        // Step 3: Extract product details from the request body
        const {
            title,
            price,
            cuttedPrice,
            quantity,
            brandName,
            categoryName,
            subcategoryName,
            specifications,
            images,
            rolename
        } = body;

        if (images.length < 1) {
            return NextResponse.json({ message: 'No images uploaded' }, { status: 400 });
        }

        const uploadedImages = await Promise.all(
            images.map(async (image) => {
                const result = await cloudinary.uploader.upload(image, {
                    folder: 'way2foods',
                });
                return result.secure_url;
            })
        );


        // Step 4: Validate required fields
        if (!title || !price || !quantity || !brandName || !categoryName || !subcategoryName || !rolename) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        // Validate specifications: Ensure it is an array and has objects with title and desc
        if (!Array.isArray(specifications) || specifications.some(spec => !spec.title || !spec.desc)) {
            return NextResponse.json({ message: 'Specifications must be an array of objects with title and description' }, { status: 400 });
        }

        // Step 5: Find or create a brand
        let brand = await Brand.findOne({ name: brandName });
        if (!brand) {
            brand = new Brand({ name: brandName });
            await brand.save();
        }

        // Step 6: Find or create a category
        let category = await Category.findOne({ name: categoryName });
        if (!category) {
            category = new Category({ name: categoryName });
            await category.save();
        }

        // Step 7: Find or create a subcategory
        let subcategory = await Subcategory.findOne({ name: subcategoryName });
        if (!subcategory) {
            subcategory = new Subcategory({ name: subcategoryName });
            await subcategory.save();
        }

        // Step 8: Prepare product data
        const productData = {
            title,
            image: uploadedImages,
            price,
            cuttedPrice,
            quantity,
            specifications,
            isActive: false,
            isApproved: false,
            brand: brand._id,
            categoryID: category._id,
            subCategoryID: subcategory._id,
            sellerID: user.id, // Use the authenticated user’s ID as the seller
            rolename
        };

        // Step 9: Create the new product
        const newProduct = new Product(productData);
        await newProduct.save();

        // Step 10: Return the newly created product
        return NextResponse.json({
            success: true,
            message: 'Product created successfully',
            product: newProduct
        }, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({
            message: 'Error creating product',
            error: error.message
        }, { status: 500 });
    }
};


// Get all products for admin.....
const GET_ALL_PRODUCTS = async (request) => {
    try {
        // Connect to the database
        await ConnectedDB();

        // Apply the authentication middleware to validate the user
        authMiddleware(request);

        // Extract the user ID from the authenticated request
        const userId = request.user.id;

        // Find the user from the database
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: 'Unauthorized access' }, { status: 404 });
        }

        // Check if the user is an admin
        if (user.role !== 'admin') {
            return NextResponse.json({ message: 'Forbidden: You are not an Admin' }, { status: 403 });
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
        const sellerRole = searchParams.get('sellerRole');  // Add sellerRole filter

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
        const searchQuery = {};

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

        // Apply filter for sellerRole if provided
        if (sellerRole) {
            const sellerUsers = await User.find({ role: sellerRole.trim() });  // Find users with the role
            const sellerIDs = sellerUsers.map(user => user._id);  // Extract their IDs
            searchQuery.sellerID = { $in: sellerIDs };  // Filter products where sellerID is in the list of sellerIDs
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


// Function to fetch product by ID (via request body)
const GET_PRODUCT_BY_ID = async (request) => {
    try {
        // Extract product ID from the query string
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');  // Get product ID from query string

        if (!id) {
            return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
        }

        // Connect to the database
        await ConnectedDB();

        // Find the product with the given ID and populate the related data
        const product = await Product.findById(id)
            .populate('brand categoryID subCategoryID sellerID')
            .populate({
                path: 'sellerID',
                select: '-password -token'  // Exclude sensitive fields
            });

        // Check if the product is found
        if (!product) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        // Return the found product
        return NextResponse.json({
            success: true,
            message: 'Product fetched successfully',
            product
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching product by ID:", error);
        return NextResponse.json({ message: 'Error fetching product', error: error.message }, { status: 500 });
    }
};


// Function to fetch product by slug
const GET_PRODUCT_BY_SLUG = async (request) => {
    try {
        // Extract the slug from the query string
        const { searchParams } = new URL(request.url);
        const slug = searchParams.get('slug');  // Get the slug from query string

        if (!slug) {
            return NextResponse.json({ message: 'Product slug is required' }, { status: 400 });
        }

        // Connect to the database
        await ConnectedDB();

        // Find the product by the slug
        const product = await Product.findOne({ slug }) // Assuming your product model has a 'slug' field
            .populate('brand categoryID subCategoryID sellerID')  // Populate referenced fields
            .populate({
                path: 'sellerID',
                select: '-password -token'  // Exclude sensitive fields
            });

        // Check if the product was found
        if (!product) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        // Return the found product
        return NextResponse.json({
            success: true,
            message: 'Product fetched successfully',
            product
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching product by slug:", error);
        return NextResponse.json({ message: 'Error fetching product', error: error.message }, { status: 500 });
    }
};


// Main GET handler to route based on the presence of the slug query
export async function GET(request) {
    const { searchParams } = new URL(request.url);

    // If the 'id' parameter is passed, we route to GET_PRODUCT_BY_ID
    const productId = searchParams.get('id');
    if (productId) {
        return GET_PRODUCT_BY_ID(request);
    }

    // If the 'slug' parameter is passed, route to GET_PRODUCT_BY_SLUG
    const productSlug = searchParams.get('slug');
    if (productSlug) {
        return GET_PRODUCT_BY_SLUG(request);
    }

    // If no 'id' is passed, we route to GET_ALL_PRODUCTS
    return GET_ALL_PRODUCTS(request);
};


// Update product by sellerID and Admin
export const PUT = async (request) => {
    try {
        const {
            productId,
            title,
            images,
            price,
            cuttedPrice,
            quantity,
            isActive,
            isApproved,
            brandName,
            categoryName,
            subcategoryName,
            specifications,
            rolename
        } = await request.json();

        // Check if productId and other required fields are provided
        if (!productId || !title || !images || !price || !quantity || !brandName || !categoryName || !subcategoryName || !rolename) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        // Validate specifications
        if (!Array.isArray(specifications) || specifications.some(spec => !spec.title || !spec.desc)) {
            return NextResponse.json({ message: 'Specifications must be an array of objects with title and description' }, { status: 400 });
        }

        // Connect to the database
        await ConnectedDB();

        // Ensure the user is authenticated
        authMiddleware(request);

        const userId = request.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: 'Unauthorized access' }, { status: 404 });
        }

        // Find the existing product
        const existingProduct = await Product.findById(productId);
        if (!existingProduct) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }


        // Delete old images from Cloudinary (if there are any)
        if (existingProduct.image.length > 0) {
            for (const oldImage of existingProduct.image) {
                try {
                    // Extract the last part of the URL (after the last slash)
                    const path = oldImage.split('/').pop();

                    // Remove the file extension (e.g., ".jpg", ".png", ".webp")
                    const publicId = path.split('.')[0];

                    console.log(`Deleting old image from Cloudinary: ${publicId}`);

                    // Delete the old image from Cloudinary
                    const response = await cloudinary.uploader.destroy(publicId);

                    // Log the response from Cloudinary
                    console.log('Cloudinary response:', response);

                    if (response.result !== 'ok') {
                        console.error(`Failed to delete image: ${publicId}`);
                    }
                } catch (error) {
                    console.error("Error deleting image from Cloudinary:", error);
                }
            }
        }

        // Upload new images to Cloudinary
        const uploadedImages = await Promise.all(
            images.map(async (image) => {
                const result = await cloudinary.uploader.upload(image, {
                    folder: 'way2foods',
                });
                return result.secure_url;  // Returning the secure URL of the uploaded image
            })
        );

        // Find or create brand, category, and subcategory
        let brand = await Brand.findOne({ name: brandName });
        if (!brand) {
            brand = new Brand({ name: brandName });
            await brand.save();
        }

        let category = await Category.findOne({ name: categoryName });
        if (!category) {
            category = new Category({ name: categoryName });
            await category.save();
        }

        let subcategory = await Subcategory.findOne({ name: subcategoryName });
        if (!subcategory) {
            subcategory = new Subcategory({ name: subcategoryName });
            await subcategory.save();
        }

        // Prepare the updated product data
        const updatedProductData = {
            title,
            image: uploadedImages,  // Updated images array with Cloudinary URLs
            price,
            cuttedPrice,
            quantity,
            specifications,
            isActive,
            isApproved,
            brand: brand._id,
            categoryID: category._id,
            subCategoryID: subcategory._id,
            sellerID: user.id,
            rolename
        };

        // Update the product in the database
        const updatedProduct = await Product.findByIdAndUpdate(productId, updatedProductData, { new: true });

        // Check if the product was found and updated
        if (!updatedProduct) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        // Return the response with the updated product data
        return NextResponse.json({
            success: true,
            message: 'Product updated successfully',
            product: updatedProduct
        }, { status: 200 });

    } catch (error) {
        console.error("Error updating product:", error);
        return NextResponse.json({ message: 'Error updating product', error: error.message }, { status: 500 });
    }
};


// DELETE: Delete product by ID
export const DELETE = async (request) => {
    try {
        // Parse the request body to get the productId
        const { productId } = await request.json();
        console.log('Received productId:', productId);  // Log the productId

        if (!productId) {
            return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
        }

        await ConnectedDB();

        // Ensure user is authenticated
        authMiddleware(request);

        const userId = request.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ message: 'Unauthorized access' }, { status: 404 });
        }

        const product = await Product.findByIdAndDelete(productId);

        if (!product) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Product deleted successfully'
        }, { status: 200 });

    } catch (error) {
        console.error("Error in DELETE request:", error);
        return NextResponse.json({ message: 'Error deleting product', error: error.message }, { status: 500 });
    }
};



