import User from "@/lib/models/user";
import Category from "@/lib/models/category";
import Blog from "@/lib/models/blog";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Types } from "mongoose";



export const GET = async (req, context) => {
    const blogId = context.params.blog;
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");
        const categoryId = searchParams.get("categoryId");
      

        // Validate that userId is provided and is a valid ObjectId
        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid or missing userId" }), { status: 400 });
        }

        // Validate that categoryId is provided and is a valid ObjectId
        if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid or missing categoryId" }), { status: 400 });
        }
        // Validate that blogId is provided and is a valid ObjectId
        if (!blogId || !Types.ObjectId.isValid(blogId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid or missing blogId" }), { status: 400 });
        }

        // Connect to the database
        await connectDB();
        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse(JSON.stringify({ message: 'User not found' }), { status: 404 });
        }
        // Find the category by ID and user ID
        const category = await Category.findById(categoryId);
        if (!category) {
            return new NextResponse(JSON.stringify({ message: 'Category not found' }), { status: 404 });
        }
        // Find the blog by ID and category ID
        const blog = await Blog.findOne({
            _id: blogId,
            category: categoryId,
            user: userId,
        });
        if (!blog) {
            return new NextResponse(JSON.stringify({ message: 'Blog not found' }), { status: 404 });
        }
        // Return the blog
        return new NextResponse(JSON.stringify({ blog: blog }), { status: 200 });

    } catch (error) {
        console.error('Error fetching blog:', error);
        return new NextResponse("ERROR fetching blog" + error.message, { status: 500 })
    }
}




export const PATCH = async (req, context) => {
    const blogId = context.params.blog;
    try {
        const body = await req.json();
        const { title, description } = body;
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid or missing userId" }), { status: 400 });
        };
        // Validate that blogId is provided and is a valid ObjectId
        if (!blogId || !Types.ObjectId.isValid(blogId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid or missing blogId" }), { status: 400 });
        }
        // Connect to the database
        await connectDB();
        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse(JSON.stringify({ message: 'User not found' }), { status: 404 });
        }
        // Find the blog by ID and user ID
        const blog = await Blog.findOne({
            _id: blogId,
            user: userId,
        });
        if (!blog) {
            return new NextResponse(JSON.stringify({ message: 'Blog not found' }), { status: 404 });
        }
        // Update the blog
         const updateBlog = await Blog.findByIdAndUpdate(
            blogId,
            { title, description },
            { new: true }
         )

           // Return the updated blog with a 200 status code
        return new NextResponse(JSON.stringify({ message: "Blog updated successfully", updateBlog }), { status: 200 });
    } catch (error) {
        console.error('Error Updating blog:', error);
        return new NextResponse("ERROR Updating blog" + error.message, { status: 500 })
    }


}



export const DELETE = async (req, context) => {
    const blogId = context.params.blog; // Ensure the param name matches your dynamic route file name [blog].js
    try {
        // Parse the URL search parameters
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        // Validate the userId
        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid or missing userId" }), { status: 400 });
        }

        // Validate the blogId
        if (!blogId || !Types.ObjectId.isValid(blogId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid or missing blogId" }), { status: 400 });
        }

        // Connect to the database
        await connectDB();

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse(JSON.stringify({ message: 'User not found' }), { status: 404 });
        }

        // Find the blog by ID and user ID
        const blog = await Blog.findOne({
            _id: blogId,
            user: userId,
        });
        if (!blog) {
            return new NextResponse(JSON.stringify({ message: 'Blog not found' }), { status: 404 });
        }

        // Delete the blog
        await Blog.findByIdAndDelete(blogId);

        // Return a success message with a 200 status code
        return new NextResponse(JSON.stringify({ message: "Blog deleted successfully" }), { status: 200 });

    } catch (error) {
        console.error('Error deleting blog:', error);
        return new NextResponse(JSON.stringify({ message: "Error deleting blog", error: error.message }), { status: 500 });
    }
};