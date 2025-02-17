// src/app/api/auth/register/route.js
import { NextResponse } from 'next/server';
import ConnectedDB from '@/config/db'; // Import DB connection logic
import User from '@/models/user';       // Import User model
import bcrypt from 'bcryptjs';

export const POST = async (request) => {
  // Extract data from the request body
  const { firstName, lastName, email, phone, password, role } = await request.json();

  // Validate the required fields
  if (!firstName || !lastName || !email || !phone || !password || !role) {
    return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
  }

  try {
    // Connect to DB
    await ConnectedDB();

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      role
    });

    // Save user to DB
    await newUser.save();

    return NextResponse.json({ message: 'User registered successfully', user: newUser }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error registering user', error: error.message }, { status: 500 });
  }
};
