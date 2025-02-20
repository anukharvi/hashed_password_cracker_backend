const bcrypt = require("bcryptjs");
const crypto = require("crypto");

function hashPassword(password, algorithm = "sha256") {
    if (algorithm === "bcrypt") {
        return bcrypt.hashSync(password, 10);
    } else {
        return crypto.createHash(algorithm).update(password).digest("hex");
    }
}

function compareHash(password, hashedPassword, algorithm = "sha256") {
    if (algorithm === "bcrypt") {
        return bcrypt.compareSync(password, hashedPassword);
    } else {
        return hashPassword(password, algorithm) === hashedPassword;
    }
}

module.exports = { hashPassword, compareHash };
