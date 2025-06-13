import mongoose from "mongoose";

export const connectDB = () => {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
      console.log("connected to mongodb");
    })
    .catch((err) => {
      console.log(err);
    });
};
