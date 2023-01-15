/** @format */
import mongoose from "mongoose";

const connection = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://testuser:${process.env.MONGO_PASS}@cluster0.44gx5.mongodb.net/reactblog`
    );
    console.log("Database is connected");
  } catch (error) {
    console.log(error);
    console.log("server is busy");
    return error;
  }
};
export default connection;
