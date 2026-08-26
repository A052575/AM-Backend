import mongoose from "mongoose";
// import dns from "dns";
import { DB_NAME } from "../constants.js";

// Configure DNS resolvers to fix SRV record lookup failures (ECONNREFUSED) on Windows/ISPs
// dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n MongoDB connected!! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection FAILED:", error);
        process.exit(1);
    }
}

export default connectDB;