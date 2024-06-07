import mongoose from "mongoose";

const { Schema, model } = mongoose;

// Define the Category schema
const CategorySchema = new Schema(
    {
        title: { type: String, required: true }, // Correctly specify the type as String
        user: { type: Schema.Types.ObjectId, ref: "User", index: true } // Add index for the user field
    },
    {
        timestamps: true, // Automatically include createdAt and updatedAt fields
    }
);

// Create the Category model if it doesn't already exist
const Category = mongoose.models.Category || model("Category", CategorySchema);

export default Category;
