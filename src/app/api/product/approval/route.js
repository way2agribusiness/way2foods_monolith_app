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

        // Check if the user is an admin
        if (user.role !== 'admin') {
            return NextResponse.json({ message: 'Forbidden: You are not an Admin' }, { status: 403 });
        }

        // const { productId } = req.params; // Extract productId from query
        const { productId, isApproved } = await request.json(); // New approval status

        // Update the product's approval status
        const product = await Product.findByIdAndUpdate(productId, { isApproved }, { new: true })
            .populate('brand categoryID subCategoryID sellerID')  // Populate referenced fields
            .populate({
                path: 'sellerID',
                select: '-password -token'  // Exclude sensitive fields
            });

        if (!product) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }
        // Return updated product
        return NextResponse.json({
            success: true,
            message: 'Product isApproval successfully',
            product: product
        }, { status: 200 });
    } catch (error) {
        console.error('Error toggling approval status', error);
        return NextResponse.json({ message: 'Error fetching product', error: error.message }, { status: 500 });
    }
};
