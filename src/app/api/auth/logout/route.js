import { NextResponse } from 'next/server';
import ConnectedDB from '@/config/db';  // Import DB connection logic
import User from '@/models/user';       // Import User model
import authMiddleware from '@/middlewares/authMiddleware'; // Import authMiddleware to validate token

export const POST = async (request) => {
    try {
        // Step 1: Connect to the database
        await ConnectedDB();

        // Step 2: Validate and decode the token using the authMiddleware
        authMiddleware(request); // This will set request.user if valid

        // Step 3: Get the user ID from the request object (set by authMiddleware)
        const userId = request.user.id;

        // Step 4: Find the user in the database
        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Step 5: Set the token to null in the database
        user.token = null;  // Nullify the token field in the database (to logout)
        await user.save();   // Save the changes in the database

        // Step 6: Send a successful response
        return NextResponse.json({ message: 'Logout successful' }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
};
