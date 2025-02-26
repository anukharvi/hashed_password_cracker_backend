const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const fs = require("fs");

// Function to hash a password
function hashPassword(password, algorithm = "sha256") {
    if (algorithm === "bcrypt") {
        return bcrypt.hashSync(password, 10);
    } else {
        return crypto.createHash(algorithm).update(password).digest("hex");
    }
}

// Function to compare a password with a hash
function compareHash(password, hashedPassword, algorithm = "sha256") {
    if (algorithm === "bcrypt") {
        return bcrypt.compareSync(password, hashedPassword);
    } else {
        return hashPassword(password, algorithm) === hashedPassword;
    }
}

// Brute-force attack: Tries all possible combinations (limited for simplicity)
function bruteForceCrack(hash, algorithm = "sha256") {
    const charset = "abcdefghijklmnopqrstuvwxyz0123456789";
    const maxLength = 4; // Adjust as needed

    function generatePermutations(current) {
        if (current.length > maxLength) return null;
        const generatedHash = hashPassword(current, algorithm);
        if (generatedHash === hash) return current;
        for (let char of charset) {
            const result = generatePermutations(current + char);
            if (result) return result;
        }
        return null;
    }

    return generatePermutations("");
}

// Dictionary attack: Checks a list of common passwords
function dictionaryAttack(hash, algorithm = "sha256", dictionaryFile = "dictionary.txt") {
    if (!fs.existsSync(dictionaryFile)) return null;

    const words = fs.readFileSync(dictionaryFile, "utf8").split("\n");
    for (let word of words) {
        word = word.trim();
        if (hashPassword(word, algorithm) === hash) {
            return word;
        }
    }
    return null;
}

// Export the functions
module.exports = { hashPassword, compareHash, bruteForceCrack, dictionaryAttack };
