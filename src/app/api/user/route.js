import { NextResponse } from 'next/server';
import ConnectedDB from '@/config/db';  // Import DB connection logic
import User from '@/models/user';       // Import User model
import authMiddleware from '@/middlewares/authMiddleware';
import Address from '@/models/address';

export const GET = async (request) => {
  try {
    // Step 1: Connect to the database
    await ConnectedDB();

    // Step 2: Handle authentication
    authMiddleware(request); // Validate and extract user data from token

    // Step 3: Fetch the user from the database
    const userId = request.user.id; // Extract user ID from request object, added by authMiddleware

    const user = await User.findById(userId)
      .populate('addressID')
      .select('-password');

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Step 4: Return user data as response, excluding the password
    const userData = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      addressID: user.addressID,  // Include populated address data
    };

    // Step 5: Return user data as response
    return NextResponse.json({ message: 'User retrieved successfully', user: userData }, { status: 200 });

  } catch (error) {
    console.error(error);

    // If unauthorized error (401), handle logout logic
    if (error.message.includes('Unauthorized')) {
      // Logic to clear the session or token (logout the user)
      // Example for clearing cookies (if using cookies for session)
      NextResponse.cookies.delete('authToken'); // Clear the authentication token cookie

      // Redirect the user to the login page after logging out
      return NextResponse.redirect('/login'); // Adjust the login URL based on your app's routing
    }

    // Handle other errors
    return NextResponse.json({ message: error.message }, { status: 500 });  // Use 500 for other types of errors
  }
};
