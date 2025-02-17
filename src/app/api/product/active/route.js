import Product from "@/models/products";
import User from "@/models/user";
import authMiddleware from '@/middlewares/authMiddleware';
import ConnectedDB from "@/config/db";
import { NextResponse } from "next/server"; // Adjust this if you're using Express or a different framework


export const PATCH = async (request) => {
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

        const { productId, isActive } = await request.json(); // New approval status

        // Fetch the product to check if it exists and get the sellerID
        const product = await Product.findById(productId);
        if (!product) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        // Ensure that the sellerId in the request matches the sellerID of the product
        if (product.sellerID.toString() !== userId) {
            return NextResponse.json({ message: 'Forbidden: You are not the seller of this product' }, { status: 403 });
        }

        // Update the product's isActive status and set isApproved to false
        const updatedProduct = await Product.findByIdAndUpdate(
            productId, 
            { 
                isActive, 
                isApproved: false  // Ensure isApproved is always false
            }, 
            { new: true }
        )
        .populate('brand categoryID subCategoryID sellerID')  // Populate referenced fields
        .populate({
            path: 'sellerID',
            select: '-password -token'  // Exclude sensitive fields
        });

        if (!updatedProduct) {
            return NextResponse.json({ message: 'Product not found or could not be updated' }, { status: 404 });
        }

        // Return updated product
        return NextResponse.json({
            success: true,
            message: 'Product isActive status updated successfully!',
            product: updatedProduct
        }, { status: 200 });
    } catch (error) {
        console.error('Error updating product status', error);
        return NextResponse.json({ message: 'Error updating product', error: error.message }, { status: 500 });
    }
};

