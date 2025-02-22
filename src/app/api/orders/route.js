import { NextResponse } from "next/server";
import Order from "@/models/order";
import Product from "@/models/products";
import connectDB from "@/utils/connectDB";
import { getToken } from "next-auth/jest";

export async function POST(req) {
    try {
        await connectDB();
        const token = await getToken({ req });

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

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

        // Validate products and sellers
        for (const item of body.products) {
            const product = await Product.findById(item.product).populate("sellerID", "_id");
            if (!product) {
                return NextResponse.json(
                    { error: `Product ${item.product} not found` },
                    { status: 404 }
                );
            }
            if (product.sellerID._id.toString() !== item.seller.toString()) {
                return NextResponse.json(
                    { error: `Seller mismatch for product ${item.product}` },
                    { status: 400 }
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
        const order = new Order({
            user: token.userId,
            ...body,
        });

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
        return NextResponse.json(
            { error: error.message || "Server error" },
            { status: 500 }
        );
    }
}