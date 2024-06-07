import User from "@/lib/models/user";
import Category from "@/lib/models/category";
import { Types } from "mongoose";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";


export const GET = async (req) => {
    try {
        // Parse the userId from the request URL
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        // Validate that userId is provided and is a valid ObjectId
        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid or missing userId" }), { status: 400 });
        }

        // Connect to the database
        await connectDB();

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse(JSON.stringify({ message: "User not found" }), { status: 404 });
        }

        // Find all categories associated with the user
        const categories = await Category.find({ user: new Types.ObjectId(userId) });

        // Return the categories with a 200 status code
        return new NextResponse(JSON.stringify(categories), { status: 200 });
    } catch (error) {
        // Log the error for debugging purposes
        console.error('Error fetching categories:', error);

        // Return the error with a 500 status code
        return new NextResponse(JSON.stringify({ message: error.message || 'Internal Server Error' }), { status: 500 });
    }
};

// Handler to add a category to the database
export const POST = async (req) => {
    try {
        // Parse the userId from the request URL and the title from the request body
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");
        const { title } = await req.json();

        // Validate that userId is provided and is a valid ObjectId
        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid or missing userId" }), { status: 400 });
        }

        // Validate that title is provided
        if (!title) {
            return new NextResponse(JSON.stringify({ message: "Title is required" }), { status: 400 });
        }

        // Connect to the database
        await connectDB();

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse(JSON.stringify({ message: "User not found" }), { status: 404 });
        }

        // Create a new category with the provided title and user ID
        const newCategory = await Category.create({ title, user: new Types.ObjectId(userId) });

        // Save the new category
        await newCategory.save();

        // Return success message and the created category
        return new NextResponse(JSON.stringify({ message: "Category Successfully Created", category: newCategory }), { status: 201 });
    } catch (error) {
        // Log the error for debugging purposes
        console.error('Error creating category:', error);

        // Return the error with a 500 status code
        return new NextResponse(JSON.stringify({ message: error.message || 'Internal Server Error' }), { status: 500 });
    }
};