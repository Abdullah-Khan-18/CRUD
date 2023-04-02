const express = require("express");
const {User,register} = require("../model/userSchema");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
router.get("/", (req, res) => {
  res.send("welcome to server side router");
});

// ---------    Register    --------- //
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password, cpassword } = req.body;
    if (!name || !email || !phone || !password || !cpassword) {
      return res.json({ error: "plz filled properly" });
    }

    const userExist = await register.findOne({ email: email });
    if (userExist) {
      return res.json({ error: "user already exists" });
    } else if (password !== cpassword) {
      return res.json({ error: "password are not correct" });
    } else {
      const register1 = new register({ name, email, phone, password, cpassword });
      await register1.save();

      res.json({ message: "user register sucessfully" });
    }
  } catch (error) {
    console.log("register error => " + error);
  }
});

// ---------    Login    --------- //
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.json({ error: "plz filled the data" });
    }

    const userLogin = await register.findOne({ email: email });

    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);

      // ---------    generateToken    --------- //
      const token = await userLogin.generateAuthToken();

      // ---------    setCookie    --------- //
      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 2592000000),
        httpOnly: true,
      });

      if (!isMatch) {
        return res.json({ error: "Invalid login" });
      } else {
        return res.json({ message: "user login sucessfully" });
      }
    } else {
      return res.json({ error: "Invalid login" });
    }
  } catch (error) {
    console.log("login error => " + error);
  }
});

// ---------    addData Section    --------- //
router.post("/addData", async (req, res) => {
  try {
    const { firstName, lastName, Class, division, address, mobileNo } =
      req.body;
    if (
      !firstName ||
      !lastName ||
      !Class ||
      !division ||
      !address ||
      !mobileNo
    ) {
      return res.json({ error: "plz fill the data" });
    } else {
      const user = new User({
        firstName,
        lastName,
        Class,
        division,
        address,
        mobileNo,
      });
      await user.save();

      res.json({ message: "Sucessfully DataAdd" });
    }
  } catch (error) {
    console.log("addData error => " + error);
  }
});

// ---------    getData Section    --------- //
router.get("/getData", async (req, res) => {
  try {
    const allStudents = await User.find();
    res.status(200).json(allStudents);
  } catch (err) {
    console.log(`getStudents Section => ${err}`);
    res.status(404).json({ message: err.message });
  }
});

// ---------    getDataByID Section    --------- //
router.get("/view/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const Students = await User.findById({ _id: id });
    res.status(200).json(Students);
    console.log(Students);
  } catch (err) {
    console.log(`getDataByID Section => ${err}`);
    res.status(404).json({ message: err.message });
  }
});

// ---------    update Section    --------- //
router.patch("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateStudents = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updateStudents);
    console.log(updateStudents);
  } catch (err) {
    console.log(`updateStudents Section => ${err}`);
    res.status(404).json({ message: err.message });
  }
});

// ---------    update Section    --------- //
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteStudents = await User.findByIdAndDelete({_id:id});
    res.status(200).json(deleteStudents);
    console.log(deleteStudents);
  } catch (err) {
    console.log(`deleteStudents Section => ${err}`);
    res.status(404).json({ message: err.message });
  }
});

module.exports = router;
