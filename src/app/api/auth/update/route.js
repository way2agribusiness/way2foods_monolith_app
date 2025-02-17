import { NextResponse } from 'next/server';
import ConnectedDB from '@/config/db';  // Import DB connection logic
import User from '@/models/user';       // Import User model
import authMiddleware from '@/middlewares/authMiddleware';  // Import the authentication middleware
import bcrypt from 'bcryptjs';

export const PUT = async (request) => {
  try {
    // Step 1: Connect to the database
    await ConnectedDB();

    // Step 2: Handle authentication (get the user from token)
    authMiddleware(request); // Validate and extract user data from token

    // Step 3: Extract the user ID from the request (authentication middleware attaches it)
    const userId = request.user.id;

    // Step 4: Extract the updated data from the request body
    const { firstName, lastName, email, phone, role } = await request.json();

    // Step 5: Validate that at least one field is being updated
    if (!firstName && !lastName && !email && !phone && !role) {
      return NextResponse.json({ message: 'At least one field is required to update' }, { status: 400 });
    }

    // Step 6: Find the user in the database
    const user = await User.findById(userId).populate('addressID');
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Step 7: Update the user fields if they are provided
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (role) user.role = role;

    // Step 8: Save the updated user data to the database (password remains unchanged)
    await user.save();

    // Step 9: Return the updated user data as the response (excluding password)
    const userResponse = user.toObject(); // Convert mongoose document to plain JavaScript object
    delete userResponse.password; // Remove the password field
    delete userResponse.token;

    // Include the populated addressID data in the response
    userResponse.addressID = user.addressID;  // Include populated address data

    // Step 9: Return the updated user data as the response
    return NextResponse.json({ message: 'User updated successfully', user: userResponse }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error updating user', error: error.message }, { status: 500 });
  }
};
