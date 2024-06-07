import mongoose from 'mongoose';



const MONGODB_URL = process.env.MONGODB_URL;

// const connect = async () => {
//     const connectionState = mongoose.connectionState.readyState;

//     if (connectionState === 1) {
//         console.log("Already connected")
//         return;
//     }

//     if (connectionState === 2) {
//         console.log("Database connecting...")
//         return;
//     }

//     try {
//         mongoose.connect(MONGODB_URL, {
//             dbName: "Nex14RestApi",
//             bufferComands: true
//         })
//         console.log("Database connected")
//     } catch (error) {
//         console.log("Database connection error", error)
//         throw new Error("Error:", error)

//     }
// };


// export default connect;


const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URL, {});
        console.log("MongoDB Connected");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

export default connectDB;