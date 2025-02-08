require('dotenv').config();
const express = require("express");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const { RedisStore } = require("connect-redis");
const Redis = require("ioredis");
const fs = require("fs");
const path = require("path");

const app = express();
const redisClient = new Redis();

redisClient.on('connect', () => {
    console.log('COnnected to Redis');
});

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

app.use(
    session({
        store: new RedisStore({ 
            client: redisClient,
            prefix: "sess", 
        }),
        secret: "your_secret_key",
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

const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET;
const DATABASE_URL = process.env.DATABASE_URL

console.log("PORT:", PORT);
console.log("JWT_SECRET:", JWT_SECRET);
console.log("DATABASE_URL:", DATABASE_URL);

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
    const user = users.find(user => user.username === username);

    if (user && await bcrypt.compare(password, user.password)){
        req.session.user = username;
        console.log('Session created for user:', username);
        res.json({ success: true});
    }else {
        console.log('Login failed for user:', username);
        res.json({ success: false});
    }
});

//protected route
app.get("/main", (req, res) => {
    console.log('Session data:', req.session);
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





