const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const port = 5000;
const app = express();
const config = require("config");
const Users = require("./routes/api/users");

// Set static Folder:
app.use(express.static(path.join(__dirname, "static")));

// Cors:
app.use(cors());

// Body Parser:
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// DB Config:
const db = config.get("mongoURI");

// Routes:
// Test route:
app.get('/test', (req, res) => res.json({ success: 'APi Works!' }));
// User Routes:
app.use("/api/users", Users);

// Connect to Mongo:
mongoose.connect(db, { useNewUrlParser: true, useCreateIndex: true})
    .then(() => console.log("Mongo DB Connected..."))
    .catch(err => console.log(err));

// Run Server/Backend:
app.listen(port, () => console.log(`Server Running On Port: ${port}`));