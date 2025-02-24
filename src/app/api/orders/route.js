import Product from "@/models/products";
import User from "@/models/user";
import authMiddleware from '@/middlewares/authMiddleware';
import ConnectedDB from "@/config/db";
import Cart from "@/models/cart"; // Ensure the Cart model is correctly imported
import Order from "@/models/Order"; // Ensure the Order model is correctly imported
import { NextResponse } from "next/server"; // For Next.js API response handling

export const POST = async (request) => {
    try {
        // Step 1: Connect to the database
        await ConnectedDB();

        // Step 2: Handle authentication (get the user from token)
        authMiddleware(request); // Validate and extract user data from token

        const userId = request.user.id; // Extract user ID (this assumes authentication middleware has been applied)

        // Step 3: Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: 'Unauthorized access' }, { status: 404 });
        }

        // Step 4: Parse the request body to get the order details
        const body = await request.json(); // Parse the body to JSON
        console.log("Request Body:", body);

        // Validate required fields
        const requiredFields = [
            "products",
            "shippingAddress",
            "paymentMethod",
            "totalAmount",
            "contactNumber",
        ];
        const missingFields = requiredFields.filter((field) => !body[field]);
        if (missingFields.length > 0) {
            return NextResponse.json(
                { error: `Missing required fields: ${missingFields.join(", ")}` },
                { status: 400 }
            );
        }

        // Step 5: Validate products
        for (const item of body.products) {
            const product = await Product.findById(item.product);
            if (!product) {
                return NextResponse.json(
                    { error: `Product ${item.product} not found` },
                    { status: 404 }
                );
            }
            if (product.quantity < item.quantity) {
                return NextResponse.json(
                    { error: `Insufficient stock for ${product.title}` },
                    { status: 400 }
                );
            }
        }

        // Step 6: Create order with user ID
        const orderData = {
            ...body,
            user: userId, // Add the authenticated user's ID to the order
        };

        const order = new Order(orderData);
        await order.save();

        // Step 7: Update product quantities
        for (const item of body.products) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { quantity: -item.quantity },
            });
        }

        // Step 8: Clear the user's cart after placing the order
        await Cart.findOneAndUpdate(
            { buyerID: userId },
            { $set: { cartProducts: [] } }, // Clear the cart
            { new: true }
        );

        return NextResponse.json({
            success: true,
            orderId: order._id,
            orderNumber: order.orderNumber,
            message: "Order placed successfully",
        });
    } catch (error) {
        console.error("Order submission error:", error);
        return NextResponse.json(
            { error: error.message || "Server error" },
            { status: 500 }
        );
    }
};