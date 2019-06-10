const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config");

const User = require("../../models/User");

//---------------------
// @desc    Register User/ Returning JWT Token
// @route   Post api/users/Register
// @access  Public
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
                  console.log("User Successfully Registered!")
                  res.json({
                    token: "Bearer " + token,
                    user: {
                      id: user.id,
                      name: user.name,
                      email: user.email
                    }});
                  })})
              //End of token/post----
            });
        });
      });
    });

//---------------------
// @ desc     login/Auth user
// @ route    GET api/user/login
// @ access   Public
router.post("/login", (req, res) => {
	const { email, password } = req.body;// Destructuring, Pulling the values out from request.body

	// Simple validation: Will be replaced!
	if (!email || !password) {
		return res.status(400).json({ msg: "Please enter all fields" });
	}

	// Check for existing user:
	User.findOne({ email: email })
		.then(user => {
			if (!user) {
				return res.status(400).json({ msg: "User does not exist!" });
			}
			// Compare password with hash:   user.password = hash
			bcrypt.compare(password, user.password)
			.then(isMatch => {
				if(!isMatch) return res.status(400).json({ msg: "Invalid credentials..." });
				// If match successful then send token:
				jwt.sign(
					{ id: user.id},
					config.get("jwtSecret"),
					{expiresIn: 3600}, // one hour
					(err, token) => {
            if(err) throw err;
            console.log("User Successfully Logged In")
						res.json({
							token: "Bearer" + token,
							user: {
								id: user.id,
								name: user.name,
								email: user.email
              }
            });
          });
        });
			//End of token/post----
		});
  });

// @ desc     Profile/Auth user
// @ route    GET api/user/profile
// @ access   Private - Passport Auth For JWT

// Creating Local Var For Passport Auth:
auth = passport.authenticate("jwt", {session:false});
router.get("/profile", auth, (req, res) => {
  res.json({ user: req.user })
});

module.exports = router;