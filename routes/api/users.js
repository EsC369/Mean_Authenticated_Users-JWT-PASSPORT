const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config");

const User = require("../../models/User");

// REGISTER NEW USER:
router.post("/register", (req, res) => {

  // Create New User:
  const { name, email, password } = req.body;  // Destructuring, Pulling the values out from request.body

  // Simple validation: WILL BE RAPLACED LATER
	if (!name || !email || !password) {
		return res.status(400).json({ msg: "Please enter all fields" });
	}

  // Check for existing user:
  User.findOne({ email: email })
    .then(user => {
      if (user) {
        return res.status(400).json({ msg: "User already exists..." });
      }
      const newUser = new User({
        name,
        email,
        password
      })
      // Create salt and hashed password:
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err
          newUser.password = hash;
          console.log("HASHED Password", hash);
          newUser.save()
            .then(user => {
              //Json Web Token Assign:
              jwt.sign(
                { id: user.id },
                config.get("jwtSecret"),
                { expiresIn: 3600 }, // one hour
                (err, token) => {
                  if (err) throw err;
                  res.json({
                    token: token,
                    user: {
                      id: user.id,
                      name: user.name,
                      email: user.email
                    }
                  });
                })
            });
        })
      })
    })
});

// Authenticate:
router.get("/auth", (req, res) => {
  res.json({ msg: 'Auth APi Works!' })
});

// Profile:
router.get("/profile", (req, res) => {
  res.json({ msg: 'Profile APi Works!' })
});

module.exports = router;