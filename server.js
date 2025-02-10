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
const SESSION_SECRET = process.env.JWT_SECRET || "fallback_secret_key";
const DATABASE_URL = process.env.DATABASE_URL

console.log("PORT:", PORT);
console.log("SESSION_SECRET:", SESSION_SECRET);
console.log("DATABASE_URL:", DATABASE_URL);

app.use(
    session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24,
            sameSite: 'lax',
        },
    })
);

app.get("/check-session", (req, res) => {
    res.json({ session: req.session });
});

//static files
app.use(express.static(path.join(__dirname, "public")));

//middleware
app.use(bodyParser.json());

const allowedOrigins = [
    "http://localhost:3000",
    "https://yourdomain.com"
];

app.use(cors({ origin: allowedOrigins, credentials: true}));
//load users(mock database)
const users = JSON.parse(fs.readFileSync("users.json", "utf8"));

//Login route
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    console.log(`Attempting login - Username: ${username}, Password: ${password}`);
    const user = users.find(user => user.username === username);

    if (!user){
        console.log("User not found");
        return res.json({ success: false, message: "User not found" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log(`Password match: ${passwordMatch}`);

    if(passwordMatch) {
        req.session.user = username;
        console.log(`Session created for user: ${username}`);
        return res.json({ success: true });
    }else{
        console.log("Incorrect password:");
        return res.json({ success: false, message: "Incorrect password"});
    }
});

//protected route
app.get("/main", (req, res) => {
    console.log("Session data:", req.session);
    if (req.session.user) {
        res.sendFile(path.join(__dirname, "public", "main.html"));
    }else {
        res.redirect("/");
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





