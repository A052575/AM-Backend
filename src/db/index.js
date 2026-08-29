import mongoose from "mongoose";
import dns from "dns";
import { DB_NAME } from "../constants.js";

// Set Node.js DNS servers to Google/Cloudflare public DNS to fix Windows c-ares SRV lookup ECONNREFUSED error
try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (error) {
    console.warn("Could not set custom DNS servers:", error.message);
}

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