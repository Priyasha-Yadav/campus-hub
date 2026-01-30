const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        mongoose.set("strictQuery", false);

        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected successfully!")
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1);
    }

}

module.exports = connectDB;