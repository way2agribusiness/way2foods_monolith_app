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

    // Step 4: Return user data as response
    return NextResponse.json({ message: 'User retrieved successfully', user: userData }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 401 });
  }
};
