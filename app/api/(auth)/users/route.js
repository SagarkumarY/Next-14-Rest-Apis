import connect from "@/lib/db";
import User from "@/lib/models/user";
import { ObjectId } from "mongodb";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

// Handler to get user data from the database
export const GET = async () => {
    try {
        // Connect to the database
        await connect();
        // Fetch all users from the database
        const users = await User.find();
        // Return the users with a 200 status code
        return new NextResponse(JSON.stringify(users), { status: 200 });
    } catch (error) {
        // Return the error with a 500 status code
        return new NextResponse(JSON.stringify({ message: error.message }), { status: 500 });
    }
};

// Handler to add a new user to the database
export const POST = async (req) => {
    try {
        // Connect to the database
        await connect();
        // Parse the request body
        const body = await req.json();
        console.log(body)
        // Create a new user with the parsed body
        const newUser = new User(body);
        newUser.save();
        // Return the created user with a 201 status code
        return new NextResponse(JSON.stringify({
            message: "User is created successfully", user: newUser
        }), { status: 201 });
    } catch (error) {
        // Return the error with a 500 status code
        return new NextResponse(JSON.stringify({ message: error.message }), { status: 500 });
    }
};

export const PUT = async (req) => {
    try {
        // Parse the request body
        const body = await req.json();

        const { userId, newUsername } = body;

        // Validate request body
        if (!userId || !newUsername) {
            return new NextResponse(JSON.stringify({ message: 'Invalid user ID or username' }), { status: 400 });
        }

        // Validate userId
        if (!Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: 'Invalid user ID' }), { status: 400 });
        }

        // Connect to the database
        await connect();

        // Find the user by ID and update with new data
        const updatedUser = await User.findByIdAndUpdate(
            { _id: new Types.ObjectId(userId) },
            { username: newUsername },
            { new: true }
        );

        // If user not found, return a 404 status code
        if (!updatedUser) {
            return new NextResponse(JSON.stringify({ message: 'User not found' }), { status: 404 });
        }

        // Return the updated user with a 200 status code
        return new NextResponse(JSON.stringify({ message: "User is updated", user: updatedUser }), { status: 200 });
    } catch (error) {
        // Log the error (optional, depending on your logging setup)
        console.error('Error updating user:', error);

        // Return the error with a 500 status code
        return new NextResponse(JSON.stringify({ message: error.message || 'Internal Server Error' }), { status: 500 });
    }
};

// Handler to delete a user from the database
export const DELETE = async (req) => {
    try {
        // Parse the userId from the request URL
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        // Validate that userId is provided
        if (!userId) {
            return new NextResponse(JSON.stringify({ message: 'ID not found' }), { status: 400 });
        }

        // Validate that userId is a valid ObjectId
        if (!Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: 'Invalid user ID' }), { status: 400 });
        }

        // Connect to the database
        await connect();

        // Find the user by ID and delete
        const deletedUser = await User.findByIdAndDelete(new Types.ObjectId(userId));

        // If user not found, return a 404 status code
        if (!deletedUser) {
            return new NextResponse(JSON.stringify({ message: 'User not found' }), { status: 404 });
        }

        // Return success message and deleted user data with a 200 status code
        return new NextResponse(JSON.stringify({ message: "User is deleted", user: deletedUser }), { status: 200 });
    } catch (error) {
        // Log the error for debugging purposes
        console.error('Error deleting user:', error);

        // Return the error with a 500 status code
        return new NextResponse(JSON.stringify({ message: error.message || 'Internal Server Error' }), { status: 500 });
    }
};
