import Product from "@/models/products";
import User from "@/models/user";
import authMiddleware from '@/middlewares/authMiddleware';
import ConnectedDB from "@/config/db";
import Cart from "@/models/cart";
import { NextResponse } from "next/server";

export const POST = async (request) => {
    try {
        // Step 1: Connect to the database
        await ConnectedDB();

        // Step 2: Handle authentication (get the user from token)
        const user = await authMiddleware(request); // Ensure authMiddleware returns the user
        if (!user) {
            return NextResponse.json({ message: 'Unauthorized access' }, { status: 401 });
        }

        const userId = user._id; // Extract user ID

        // Step 3: Parse the request body to get the cart products
        const body = await request.json();
        const { cartProducts } = body;

        // Step 4: Validate the cart products
        if (!cartProducts || cartProducts.length === 0) {
            return NextResponse.json({ message: 'No products found to add to cart' }, { status: 400 });
        }

        // Step 5: Process each product and validate existence
        const productsToAdd = [];
        for (const item of cartProducts) {
            const { product_length, productID } = item;

            // Fetch the product by its ID
            const product = await Product.findById(productID);
            if (!product) {
                return NextResponse.json({ message: `Product not found with ID: ${productID}` }, { status: 404 });
            }

            // Add the product to the array of products to be added to the cart
            productsToAdd.push({
                product_length,
                productID: product._id,
            });
        }

        // Step 6: Create or update the cart
        let cart = await Cart.findOne({ buyerID: userId });

        if (!cart) {
            // If no cart exists for the user, create a new one
            cart = new Cart({
                buyerID: userId,
                cartProducts: productsToAdd,
            });
        } else {
            // If the cart already exists, update it
            cart.cartProducts.push(...productsToAdd);
        }

        // Save the cart
        await cart.save();

        return NextResponse.json({ message: 'Products successfully added to the cart', cart }, { status: 200 });

    } catch (error) {
        console.error('Error in adding to cart:', error);
        return NextResponse.json({ message: 'Something went wrong', error: error.message }, { status: 500 });
    }
};