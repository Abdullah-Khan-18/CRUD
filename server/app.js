const dotenv = require("dotenv");
const express = require("express");
const app = express();

// ---------    databasesConnection   --------- //
dotenv.config({ path: "./config.env" });
require("./db/conn");
const User = require("./model/userSchema");
app.use(express.json());

// ---------   setPort   --------- //
const PORT = process.env.PORT;

const user = require("./model/userSchema");
const router = require("./routes/router");

app.use(express.json());
app.use(router);

// ---------    middleware   --------- //
const middleware = (req, res, next) => {
  console.log("welcome to middleware");
  next();
};

app.listen(PORT, () => {
  console.log(`connection port ${PORT}`);
});
