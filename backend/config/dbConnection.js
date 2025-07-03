import mongoose from "mongoose";

const dbConnection = async (url) => {
  try {
    await mongoose.connect(url);
    console.log("DB connection successful");
  } catch (error) {
    console.log(error);
  }
};
export default dbConnection;
