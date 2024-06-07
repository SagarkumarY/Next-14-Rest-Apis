import User from "@/lib/models/user";
import Category from "@/lib/models/category";
import Blog from "@/lib/models/blog";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Types } from "mongoose";


export const GET = async (req) => {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");
        const categoryId = searchParams.get("categoryId");
        const searchKeywords = searchParams.get("keywords");
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 10;

        // Validate that userId is provided and is a valid ObjectId
        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid or missing userId" }), { status: 400 });
        }

        // Validate that categoryId is provided and is a valid ObjectId
        if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid or missing categoryId" }), { status: 400 });
        }

        // Validate the date formats if provided
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (startDate && !dateRegex.test(startDate)) {
            return new NextResponse(JSON.stringify({ message: "Invalid startDate format. Use YYYY-MM-DD" }), { status: 400 });
        }
        if (endDate && !dateRegex.test(endDate)) {
            return new NextResponse(JSON.stringify({ message: "Invalid endDate format. Use YYYY-MM-DD" }), { status: 400 });
        }

        // Connect to the database
        await connectDB();

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse(JSON.stringify({ message: "User not found" }), { status: 404 });
        }

        // Find the category by ID and user ID
        const category = await Category.findById(categoryId);
        if (!category) {
            return new NextResponse(JSON.stringify({ message: "Category not found" }), { status: 404 });
        }

        const filter = {
            user: new Types.ObjectId(userId),
            category: new Types.ObjectId(categoryId)
        }

        // If search keywords are provided, add a text search to the filter
        if (searchKeywords) {
            filter.$or = [
                { title: { $regex: searchKeywords, $options: "i" } },
                { description: { $regex: searchKeywords, $options: "i" } }
            ];
        };

        // // If date range is provided, add it to the filter
        // if (startDate || endDate) {
        //     filter.createdAt = {
        //         $gte: startDate ? new Date(startDate) : undefined,
        //         $lte: endDate ? new Date(endDate) : undefined
        //     };
        // } else if (startDate) {
        //     filter.createdAt = {
        //         $gte: new Date(startDate)
        //     };
        // } else if (endDate) {
        //     filter.createdAt = {
        //         $lte: new Date(endDate)
        //     };
        // }

        // If date range is provided, add it to the filter
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) {
                filter.createdAt.$gte = new Date(`${startDate}T00:00:00.000Z`);
            }
            if (endDate) {
                filter.createdAt.$lte = new Date(`${endDate}T23:59:59.999Z`);
            }
        };

        // Implement pagination
        const skip = (page - 1) * limit;
        const blogs = await Blog.find(filter)
            .sort({ createdAt: "asc" })
            .skip(skip)
            .limit(limit);

        return new NextResponse(JSON.stringify({ blogs }), { status: 200 });

    } catch (error) {
        console.error('Error fetching blogs:', error);
        return new NextResponse("ERROR fetching blogs" + error.message, { status: 500 })
    }
}




export const POST = async (req) => {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");
        const categoryId = searchParams.get("categoryId");
        const body = await req.json();
        const { title, description } = body;

        // Validate that userId is provided and is a valid ObjectId
        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid or missing userId" }), { status: 400 });
        }

        // Validate that categoryId is provided and is a valid ObjectId
        if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid or missing categoryId" }), { status: 400 });
        }

        // Connect to the database
        await connectDB();

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse(JSON.stringify({ message: "User not found" }), { status: 404 });
        }

        // Find the category by ID and user ID
        const category = await Category.findById(categoryId);
        if (!category) {
            return new NextResponse(JSON.stringify({ message: "Category not found" }), { status: 404 });
        }

        const newBlog = await new Blog({
            title,
            description,
            user: new Types.ObjectId(userId),
            category: new Types.ObjectId(categoryId)
        })

        await newBlog.save();

        return new NextResponse(JSON.stringify({ message: "Blog Successfully Created", blog: newBlog }), { status: 201 });

    } catch (error) {
        console.error('Error Posting blogs:', error);
        return new NextResponse("ERROR Posting blog" + error.message, { status: 500 })
    }
}

