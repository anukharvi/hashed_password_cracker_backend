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
    console.log("🔍 Brute-force cracking:", hash, "using", algorithm);
    
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
    console.log("📖 Dictionary attack started for:", hash, "using", algorithm);

    // Check if the dictionary file exists
    if (!fs.existsSync(dictionaryFile)) {
        console.error("⚠️ Dictionary file not found:", dictionaryFile);
        return null;
    }

    try {
        const words = fs.readFileSync(dictionaryFile, "utf8").split("\n");

        for (let password of words) {
            password = password.trim(); // Remove extra spaces

            // Handle bcrypt separately
            if (algorithm === "bcrypt") {
                if (bcrypt.compareSync(password, hash)) {
                    console.log("✅ Password found:", password);
                    return password;
                }
            } else {
                let hashedPassword = crypto.createHash(algorithm).update(password).digest("hex");
                if (hashedPassword === hash) {
                    console.log("✅ Password found:", password);
                    return password;
                }
            }
        }

        console.log("❌ Password not found in dictionary");
        return null;
    } catch (error) {
        console.error("⚠️ Error reading dictionary file:", error.message);
        return null;
    }
}

// Export the functions
module.exports = { hashPassword, compareHash, bruteForceCrack, dictionaryAttack };
