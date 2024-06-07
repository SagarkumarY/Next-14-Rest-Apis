// import mongoose from "mongoose";
// const { Schema, model } = mongoose;


// const UserSchema = new Schema({
//   email:{
//     type: String,
//     required: true,
//     unique: true,
//     // lowercase: true,
//     // trim: true,
//     // match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
//   },

//   username:{
//     type: String,
//     required: true,
//     unique: true,
//     // lowercase: true,
//     // trim: true,
//     // match: [/^[a-zA-Z0-9]+$/, 'Please fill a valid username']
//   },

//   password:{
//     type: String,
//     required: true,
//     // trim: true,
//     // minlength: 6,
//     // maxlength: 1024,
//     // select: false
//   },


// },{timestamps: true});




// const User = mongoose.models.User || model("User", UserSchema);

// export default User;




import mongoose from "mongoose";

const { Schema, model } = mongoose;


const UserSchema = new Schema(
    {
        email: { type: String, required: true, unique: true },
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true }
    },
    {
        timestamps: true,

    }
)




const User = mongoose.models.User || model("User", UserSchema);

export default User;