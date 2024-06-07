// import User from "@/lib/models/user";
// import Category from "@/lib/models/category";
// import { NextResponse } from "next/server";
// import connectDB from "@/lib/db";
// import { Types } from "mongoose";

// // Patch request handler
// export const PATCH = async (req, context) => {
//     // Extract the category ID from the request context
//     const categoryId = context.params.category;

//     try {
//         // Parse the request body to get the update data
//         const body = await req.json();
//         const { title } = body;

//         // Parse the URL to get the search parameters
//         const { searchParams } = new URL(req.url);
//         const userId = searchParams.get('userId');

//         if (!userId || !Types.ObjectId.isValid(userId)) {
//             return new NextResponse(JSON.stringify({ message: 'UserId invalid or missing' }), { status: 400 });
//         }

//         // Check if categoryId and userId are present
//         if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
//             return new NextResponse(JSON.stringify({ message: 'CategoryId invalid or missing' }), { status: 400 });
//         }

//         // Connect to the database
//         await connectDB();


//         const user = await User.findById(userId);
//         if (!user) {
//             return new NextResponse(JSON.stringify({ message: 'User not found' }), { status: 404 });
//         }

//         const category = await Category.findOne({ _id: categoryId, user: userId });
//         if (!category) {
//             return new NextResponse(JSON.stringify({ message: 'Category not found' }), { status: 404 });
//         }

//         // Find the category by ID and update it
//         const updatedCategory = await Category.findByIdAndUpdate(
//             categoryId,
//             { title },
//             { new: true }
//         );

//         // If category not found, return a 404 status code
//         if (!updatedCategory) {
//             return new NextResponse(JSON.stringify({ message: 'Category not found' }), { status: 404 });
//         }

//         // Return the updated category with a 200 status code
//         return new NextResponse(JSON.stringify({ message: "Category id updated", updatedCategory }), { status: 200 });

//     } catch (error) {
//         // Return an error message with a 500 status code
//         return new NextResponse(JSON.stringify({ message: "Error updating category", error: error.message }), { status: 500 });
//     }
// };




import User from "@/lib/models/user";
import Category from "@/lib/models/category";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Types } from "mongoose";

// Patch request handler
export const PATCH = async (req, context) => {
    // Extract the category ID from the request context
    const categoryId = context.params.category;

    try {
        // Parse the request body to get the update data
        const { title } = await req.json();

        // Parse the URL to get the search parameters
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        // Validate the userId
        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: 'Invalid or missing userId' }), { status: 400 });
        }

        // Validate the categoryId
        if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
            return new NextResponse(JSON.stringify({ message: 'Invalid or missing categoryId' }), { status: 400 });
        }

        // Validate the title
        if (!title) {
            return new NextResponse(JSON.stringify({ message: 'Title is required' }), { status: 400 });
        }

        // Connect to the database
        await connectDB();

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse(JSON.stringify({ message: 'User not found' }), { status: 404 });
        }

        // Find the category by ID and user ID
        const category = await Category.findOne({ _id: categoryId, user: userId });
        if (!category) {
            return new NextResponse(JSON.stringify({ message: 'Category not found' }), { status: 404 });
        }

        // Update the category title
        category.title = title;
        await category.save();

        // Return the updated category with a 200 status code
        return new NextResponse(JSON.stringify({ message: "Category successfully updated", category }), { status: 200 });

    } catch (error) {
        // Log the error for debugging purposes
        console.error('Error updating category:', error);

        // Return an error message with a 500 status code
        return new NextResponse(JSON.stringify({ message: "Error updating category", error: error.message || 'Internal Server Error' }), { status: 500 });
    }
};




// Delete request handler
export const DELETE = async (req, context) => {
    // Extract the category ID from the request context
    const categoryId = context.params.category;

    try {
        // Parse the URL to get the search parameters
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        // Validate the userId
        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: 'Invalid or missing userId' }), { status: 400 });
        }

        // Validate the categoryId
        if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
            return new NextResponse(JSON.stringify({ message: 'Invalid or missing categoryId' }), { status: 400 });
        }

        // Connect to the database
        await connectDB();

        // Find the user by ID
        const user = await User.findById(userId);
        
        if (!user) {
            return new NextResponse(JSON.stringify({ message: 'User not found' }), { status: 404 });
        }

        // Find and delete the category by ID and user ID
        const category = await Category.findOneAndDelete({ _id: categoryId, user: userId });

        if (!category) {
            return new NextResponse(JSON.stringify({ message: 'Category not found' }), { status: 404 });
        }

        // Return a success message with a 200 status code
        return new NextResponse(JSON.stringify({ message: "Category successfully deleted" }), { status: 200 });

    } catch (error) {
        // Log the error for debugging purposes
        console.error('Error deleting category:', error);

        // Return an error message with a 500 status code
        return new NextResponse(JSON.stringify({ message: "Error deleting category", error: error.message || 'Internal Server Error' }), { status: 500 });
    }
};