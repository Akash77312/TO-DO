import mongoose from "mongoose";

export const connectDB= ()=>{
    mongoose
    .connect(process.env.MONDO_URI, {
      dbName: "backendapi",
    })
    .then(() => {
      console.log("db connected");
    })
    .catch((e) => {
      console.log("error");
    });
}