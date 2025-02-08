require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const fs = require("fs");
const path = require("path");
const app = express();

const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET;
const DATABASE_URL = process.env.DATABASE_URLl

console.log("PORT:", PORT);
console.log("JWT_SECRET:", JWT_SECRET);
console.log("DATABASE_URL:", DATABASE_URL);

//static files
app.use(express.static(path.join(__dirname, "public")));

//middleware
app.use(bodyParser.json());
app.use(cors({origin: "http://localhost:3000", credentials: true}));
app.use(session({ secret: "secret-key", resave: false, saveUninitialized: true }));

//load users(mock database)
const users = JSON.parse(fs.readFileSync("users.json", "utf8"));

//Login route
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username);

    if (user && await bcrypt.compare(password, user.password)){
        req.session.user = username;
        res.json({ success: true});
    }else {
        res.json({ success: false});
    }
});

//protected route
app.get("/main", (req, res) => {
    if (req.session.user) {
        res.json({ success: true, user: req.session.user });
    }else {
        res.status(401).json({success: false});
    }
});

//logout route
app.post("/logout", (req, res) => {
    req.session.destroy();
    res.json({ success: true});
});

//serve index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

//start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});





