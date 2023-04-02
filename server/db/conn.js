const mongoose = require("mongoose")
mongoose.set("strictQuery", true);

const DB =  process.env.DATABASE;
mongoose
  .connect(DB)
  .then(() => {
    console.log("connection is sucessfully");
  })
  .catch((e) => {
    console.log("connection is failed => " + e);
  });