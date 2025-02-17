import Product from "@/models/products";
import User from "@/models/user";
import authMiddleware from '@/middlewares/authMiddleware';
import ConnectedDB from "@/config/db";
import Cart from "@/models/cart"; // Make sure you have the correct Cart model
import { NextResponse } from "next/server"; // For Next.js API response handling


export const POST = async (request) => {
    try {
        // Step 1: Connect to the database
        await ConnectedDB();

        // Step 2: Handle authentication (get the user from token)
        authMiddleware(request); // Validate and extract user data from token

        const userId = request.user.id;  // Extract user ID (this assumes authentication middleware has been applied)

        // Step 3: Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: 'Unauthorized access' }, { status: 404 });
        }

        // Step 4: Parse the request body to get the cart products
        const body = await request.json(); // Parse the body to JSON
        const { cartProducts } = body;

        // Step 5: Validate the cart products
        if (!cartProducts || cartProducts.length === 0) {
            return NextResponse.json({ message: 'No products found to add to cart' }, { status: 400 });
        }

        // Step 6: Process each product and validate existence
        const productsToAdd = [];
        for (let i = 0; i < cartProducts.length; i++) {
            const { product_length, productID } = cartProducts[i];

            // Fetch the product by its ID
            const product = await Product.findById(productID);
            if (!product) {
                return NextResponse.json({ message: `Product not found with ID: ${productID}` }, { status: 404 });
            }

            // Add the product to the array of products to be added to the cart
            productsToAdd.push({
                product_length,         // The length/quantity for the product
                productID: product._id, // Referencing the product by its ID
            });
        }

        // Step 7: Create or update the cart
        let cart = await Cart.findOne({ buyerID: userId });

        if (!cart) {
            // If no cart exists for the user, create a new one
            cart = new Cart({
                buyerID: userId,  // Link the cart to the user
                cartProducts: productsToAdd, // Add the products to the cart
            });
        } else {
            // If the cart already exists, ensure buyerID is still set correctly
            cart.buyerID = userId;  // Ensure this line is present
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


export const GET = async (request) => {
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

        // Step 3: Find the user by userId
        const foundUser = await User.findById(userId);
        if (!foundUser) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Step 4: Fetch the cart data for the authenticated user by buyerID
        const cart = await Cart.findOne({ buyerID: userId }).populate('cartProducts.productID'); // Populate product details

        if (!cart) {
            return NextResponse.json({ message: 'No cart found for this user' }, { status: 404 });
        }

        // Step 5: Return the cart data
        return NextResponse.json({ cart }, { status: 200 });

    } catch (error) {
        console.log('Error in fetching cart data:', error);
        return NextResponse.json({ message: 'Something went wrong', error: error.message }, { status: 500 });
    }
};


export const DELETE = async (request) => {
    try {
        // Step 1: Connect to the database
        await ConnectedDB();

        // Step 2: Handle authentication (get the user from token)
        authMiddleware(request); // Validate and extract user data from token

        const userId = request.user.id;  // Extract user ID (this assumes authentication middleware has been applied)

        // Step 3: Get the product ID from the request body (assuming the productID is passed in the body)
        const { productID } = await request.json();

        // Step 4: Find the cart for the current user
        const cart = await Cart.findOne({ buyerID: userId });

        if (!cart) {
            return NextResponse.json({ message: 'No cart found for this user' }, { status: 404 });
        }

        // Step 5: Check if the product is in the cart and remove it
        const productIndex = cart.cartProducts.findIndex(item => item.productID.toString() === productID);

        if (productIndex === -1) {
            return NextResponse.json({ message: 'Product not found in the cart' }, { status: 404 });
        }

        // Remove the product from the cart's cartProducts array
        cart.cartProducts.splice(productIndex, 1);

        // Step 6: Save the updated cart
        await cart.save();

        return NextResponse.json({ message: 'Product successfully removed from the cart', cart }, { status: 200 });

    } catch (error) {
        console.error('Error in deleting product from cart:', error);
        return NextResponse.json({ message: 'Something went wrong', error: error.message }, { status: 500 });
    }
};