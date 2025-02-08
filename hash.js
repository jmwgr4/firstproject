const bcrypt = require("bcryptjs");

const passsword = "admin";
bcrypt.hash(passsword, 10, (err, hash) => {
    if (err){
        console.error("Error hashing password: ", err);
    }else {
        console.log("Hashed password:", hash);
    }
});