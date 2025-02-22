import { NextResponse } from "next/server";
import Order from "@/models/Order";
import Product from "@/models/products";
import ConnectedDB from "@/config/db";

export async function POST(req) {
    try {
        // Connect to MongoDB
        await ConnectedDB();

        // Parse the request body
        const body = await req.json();
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

        // Validate products
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

        // Create order
        const order = new Order(body);
        await order.save();

        // Update product quantities
        for (const item of body.products) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { quantity: -item.quantity },
            });
        }

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
}