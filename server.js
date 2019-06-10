const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const port = 5000;
const app = express();
// const Users = require("./routes/api/users");

// Cors:
app.use(cors());

// Body Parser:
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// DB Config:
// const db = require("./config/keys").mongoURI;
db = 'mongodb://localhost/mean_todo_list';

// Routes:
app.get('/test', (req, res) => res.json({ success: 'APi Works!' }));
// app.use("/api/items", items);

// // Connect to Mongo:
mongoose.connect(db, { useNewUrlParser: true})
    .then(() => console.log("Mongo DB Connected..."))
    .catch(err => console.log(err));

app.listen(port, () => console.log(`Server Running On Port: ${port}`));