import { NextResponse } from 'next/server';
import ConnectedDB from '@/config/db';  // Assuming your DB connection logic is here
import User from '@/models/user';        // User model
import Address from '@/models/address';  // Address model
import authMiddleware from '@/middlewares/authMiddleware';

// create address by user
export const POST = async (request) => {
    try {
        // Step 1: Connect to the database
        await ConnectedDB();

        // Step 2: Handle authentication (get the user from token)
        authMiddleware(request); // Validate and extract user data from token

        // Step 3: Extract the address details from the request body
        const {
            address_line1,
            address_line2,
            city,
            district,
            state,
            country,
            Zip_Code,
            land_mark,
            phone,
            alternative_phone
        } = await request.json();

        // Step 4: Validate required fields
        if (!address_line1 || !city || !district || !state || !country || !Zip_Code || !phone) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        // Step 5: Create a new address document
        const newAddress = new Address({
            address_line1,
            address_line2,
            city,
            district,
            state,
            country,
            Zip_Code,
            land_mark,
            phone,
            alternative_phone
        });

        // Step 6: Save the new address to the database
        await newAddress.save();

        // Step 7: Add the new address ID to the user's addressID field
        // Assuming the user is authenticated and their ID is available in the request object (e.g., from a token)
        const userId = request.user.id;  // Extract user ID (this assumes authentication middleware has been applied)

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Add the new address ID to the user's addressID array
        user.addressID.push(newAddress._id);
        await user.save();

        // Step 8: Populate the addressID array with the Address data and exclude password and token
        const populatedUser = await User.findById(userId)
            .populate('addressID')  // Populate the addressID field with address data
            .select('-password -token');  // Exclude password and token fields

        // Step 9: Return the updated user
        return NextResponse.json({ message: 'Address created and added to user', user: populatedUser }, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error creating address', error: error.message }, { status: 500 });
    }
};


// update address by user
export const PUT = async (request) => {
    try {
        // Step 1: Connect to the database
        await ConnectedDB();

        // Step 2: Handle authentication (get the user from token)
        authMiddleware(request); // Validate and extract user data from token

        const requestBody = await request.json();

        // Destructure the needed fields from the parsed body
        const { addressId, address_line1, address_line2, city, district, state, country, Zip_Code, land_mark, phone, alternative_phone } = requestBody;

        // Log the entire parsed body for debugging
        console.log('data:', requestBody);

        // Step 4: Validate required fields and addressId
        if (!addressId || !address_line1 || !city || !district || !state || !country || !Zip_Code || !phone) {
            return NextResponse.json({ message: 'Missing required fields or addressId' }, { status: 400 });
        }

        // Step 5: Find the address by its ID and update it
        const address = await Address.findById(addressId);
        if (!address) {
            return NextResponse.json({ message: 'Address not found' }, { status: 404 });
        }

        // Update address fields
        address.address_line1 = address_line1;
        address.address_line2 = address_line2 || address.address_line2;
        address.city = city;
        address.district = district;
        address.state = state;
        address.country = country;
        address.Zip_Code = Zip_Code;
        address.land_mark = land_mark || address.land_mark;
        address.phone = phone;
        address.alternative_phone = alternative_phone || address.alternative_phone;

        // Step 6: Save the updated address
        await address.save();

        // Step 7: Find the user and update the address in the user's addressID array if needed
        const userId = request.user.id;  // Extract user ID (this assumes authentication middleware has been applied)

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Ensure the address is part of the user's addressID array (optional step)
        if (!user.addressID.includes(addressId)) {
            return NextResponse.json({ message: 'Address not linked to this user' }, { status: 400 });
        }

        // Step 8: Populate the addressID array with the Address data and exclude password and token
        const populatedUser = await User.findById(userId)
            .populate('addressID')  // Populate the addressID field with address data
            .select('-password -token');  // Exclude password and token fields

        // Step 9: Return the updated user with the updated address
        return NextResponse.json({ message: 'Address updated successfully', user: populatedUser }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error updating address', error: error.message }, { status: 500 });
    }
};


// delete address by user
export const DELETE = async (request) => {
    try {
        // Step 1: Connect to the database
        await ConnectedDB();

        // Step 2: Handle authentication (get the user from token)
        authMiddleware(request); // Validate and extract user data from token

        // Step 3: Extract the addressId from the request body
        const { addressId } = await request.json();

        // Step 4: Validate required fields
        if (!addressId) {
            return NextResponse.json({ message: 'Address ID is required' }, { status: 400 });
        }

        // Step 5: Find the address by its ID
        const address = await Address.findById(addressId);
        if (!address) {
            return NextResponse.json({ message: 'Address not found' }, { status: 404 });
        }

        // Step 6: Find the user and check if the address is linked to them
        const userId = request.user.id;  // Extract user ID (this assumes authentication middleware has been applied)
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Step 7: Check if the address is in the user's addressID array
        if (!user.addressID.includes(addressId)) {
            return NextResponse.json({ message: 'Address not linked to this user' }, { status: 400 });
        }

        // Step 8: Remove the address from the user's addressID array
        user.addressID = user.addressID.filter(id => id.toString() !== addressId.toString());
        await user.save();

        // Step 9: Delete the address from the database
        await Address.findByIdAndDelete(addressId);

        // Step 10: Populate the addressID array with the updated data and exclude password and token
        const populatedUser = await User.findById(userId)
            .populate('addressID')  // Populate the addressID field with address data
            .select('-password -token');  // Exclude password and token fields

        // Step 11: Return the updated user
        return NextResponse.json({ message: 'Address deleted successfully', user: populatedUser }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error deleting address', error: error.message }, { status: 500 });
    }
};
