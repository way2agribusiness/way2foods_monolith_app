import { NextResponse } from 'next/server';
import ConnectedDB from '@/config/db';  // Import DB connection logic
import User from '@/models/user';       // Import User model
import Address from '@/models/address';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';         // For JWT token generation

export const POST = async (request) => {
    // Extract data from the request body
    const { phone, password } = await request.json();

    // Validate the required fields
    if (!phone || !password) {
        return NextResponse.json({ message: 'Mobile number and password are required' }, { status: 400 });
    }

    // Validate if phone is a valid string number (e.g., using regex or another package)
    if (!phone || !/^\d{10}$/.test(phone)) {
        return NextResponse.json({ message: 'Invalid phone number' }, { status: 400 });
    }

    try {
        // Connect to DB
        await ConnectedDB();

        // Find the user by phone number
        const user = await User.findOne({ phone });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Compare the hashed password with the provided password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
        }

        // Create a JWT token (you can adjust the expiration time)
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: '10h' });

        // Save the token in the user's document
        user.token = token;
        await user.save(); // Save the token in the database

        // Populate the addressID field with address data
        const populatedUser = await User.findById(user._id).populate('addressID');

        // Send response with the token and user details
        return NextResponse.json({
            message: 'Login successful',
            token,
            user: {
                _id: populatedUser._id,
                firstName: populatedUser.firstName,
                lastName: populatedUser.lastName,
                email: populatedUser.email,
                phone: populatedUser.phone,
                role: populatedUser.role,
                addressID: populatedUser.addressID // Include populated addresses
            }
        }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error logging in', error: error.message }, { status: 500 });
    }
}
