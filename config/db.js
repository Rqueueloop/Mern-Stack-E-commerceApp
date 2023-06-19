import mongoose from "mongoose";

const ConnectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected TO MongoDB Database");
  } catch (error) {
    console.log(`Error in MongoDB${error}`);
  }
};

export default ConnectDB;
