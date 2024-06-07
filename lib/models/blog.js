import mongoose from "mongoose";

const { Schema, model } = mongoose;


const BlogSchema = new Schema(
    {
        title: { type: "String", required: true },
        description: { type: "String" },
        user: { type: Schema.Types.ObjectId, ref: "User", index: true },
        category: { type: Schema.Types.ObjectId, ref: "Category", index: true },

    },
    {
        timestamps: true,

    }
)


const Blog = mongoose.models.Blog || model("Blog", BlogSchema);

export default Blog;