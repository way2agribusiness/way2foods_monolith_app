import Product from "@/models/products";
import ConnectedDB from "@/config/db";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

// For storing previously fetched products (this will reset when the server restarts)
let previouslyFetchedIds = new Set();

export const GET = async (request) => {
    try {
        // Connect to the database
        await ConnectedDB();

        // Extract 'rolename' from the URL params
        const { searchParams } = new URL(request.url);
        const roleName = searchParams.get('rolename'); // Get the 'rolename' query parameter

        console.log("roleName from URL:", roleName); // Debugging log

        if (!roleName) {
            return NextResponse.json({
                success: false,
                message: "Role Name is required."
            }, { status: 400 });
        }

        // Validate if roleName is a valid string (you can add more validation as needed)
        if (typeof roleName !== 'string') {
            return NextResponse.json({
                success: false,
                message: "Invalid role name format."
            }, { status: 400 });
        }

        let products;
        let attempt = 0;

        while (attempt < 5) {
            // Get the count of distinct sellers with active and approved products matching the specified roleName
            const sellers = await Product.distinct('sellerID', {
                isApproved: true,
                isActive: true,
                rolename: roleName // Now filtering by rolename
            });

            if (sellers.length >= 10) {
                // If there are more than or equal to 10 sellers, sample 10 random sellers and get one product per seller
                products = await Product.aggregate([
                    { $match: { isApproved: true, isActive: true, rolename: roleName } },
                    { $sample: { size: 10 } }, // Random 10 products
                    {
                        $group: {
                            _id: "$sellerID",
                            products: { $push: "$$ROOT" }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            sellerID: "$_id",
                            products: { $slice: ["$products", 0, 1] } // Take one random product per seller
                        }
                    },
                    { $unwind: "$products" },
                    { $replaceRoot: { newRoot: "$products" } }
                ]);
            } else {
                // If there are fewer than 10 sellers, fetch all their products and repeat them until we get 10 products
                const allProducts = await Product.aggregate([
                    { $match: { isApproved: true, isActive: true, rolename: roleName } },
                    { $sample: { size: 100 } } // Fetch a large pool of products to pick from
                ]);

                // Randomly select 10 products from the available pool, which could include duplicates
                products = [];
                while (products.length < 10) {
                    const randomProduct = allProducts[Math.floor(Math.random() * allProducts.length)];
                    products.push(randomProduct);
                }
            }

            // If all 10 products are new (not previously fetched), break out of the loop
            if (products.every(product => !previouslyFetchedIds.has(product._id.toString()))) {
                // Mark these products as previously fetched
                products.forEach(product => previouslyFetchedIds.add(product._id.toString()));
                break;
            }

            attempt++;
        }

        // Populate the sellerID with additional seller details (excluding password and token)
        const populatedProducts = await Product.populate(products, {
            path: 'sellerID',
            select: 'role',  // Exclude sensitive fields like password and token
        });

        // Check if we have the products
        if (populatedProducts.length === 0) {
            return NextResponse.json({
                success: false,
                message: "No products found that are approved, active, and belong to the specified role."
            }, { status: 404 });
        }

        // Return the found products with a success message
        return NextResponse.json({
            success: true,
            message: "Role-based Products fetched successfully",
            product: populatedProducts
        }, { status: 200 });

    } catch (error) {
        console.error(error);
        // Handle any error that occurs during the process
        return NextResponse.json({
            success: false,
            message: "Server Error",
            error: error.message
        }, { status: 500 });
    }
};
