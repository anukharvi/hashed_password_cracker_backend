const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path"); // ✅ Import path module

// ✅ Function to hash a password
function hashPassword(password, algorithm = "sha256") {
    if (algorithm === "bcrypt") {
        return bcrypt.hashSync(password, 10);
    } else {
        return crypto.createHash(algorithm).update(password).digest("hex");
    }
}

// ✅ Function to compare a password with a hash
function compareHash(password, hashedPassword, algorithm = "sha256") {
    if (algorithm === "bcrypt") {
        return bcrypt.compareSync(password, hashedPassword);
    } else {
        return hashPassword(password, algorithm) === hashedPassword;
    }
}

// ✅ Brute-force attack (Checks short passwords)
function bruteForceCrack(hash, algorithm = "sha256") {
    console.log("🔍 Brute-force cracking started for:", hash, "using", algorithm);
    
    const charset = "abcdefghijklmnopqrstuvwxyz0123456789";
    const maxLength = 4; // Limits brute force length to avoid long execution times

    function generatePermutations(current) {
        if (current.length > maxLength) return null;
        const generatedHash = hashPassword(current, algorithm);
        if (generatedHash === hash) {
            console.log(`✅ Brute-force cracked: ${current}`);
            return current;
        }
        for (let char of charset) {
            const result = generatePermutations(current + char);
            if (result) return result;
        }
        return null;
    }

    return generatePermutations("") || "Password not found";
}

// ✅ Dictionary attack (Checks words in dictionary file)
function dictionaryAttack(hash, algorithm = "sha256", dictionaryFile = "dictionary.txt") {
    const filePath = path.join(__dirname, dictionaryFile); // ✅ Get full path
    console.log("📖 Looking for dictionary file at:", filePath);

    // ✅ Ensure dictionary file exists
    if (!fs.existsSync(filePath)) {
        console.error("⚠️ Dictionary file NOT found at:", filePath);
        return "Error: Dictionary file missing";
    }

    try {
        // ✅ Read dictionary file with UTF-8 encoding
        const words = fs.readFileSync(filePath, { encoding: "utf8", flag: "r" }).split("\n");

        for (let password of words) {
            password = password.trim(); // ✅ Remove extra spaces & line breaks
            if (!password) continue; // ✅ Skip empty lines

            let hashedPassword = crypto.createHash(algorithm).update(password).digest("hex");

            console.log(`🔍 Checking: ${password} → Hash: ${hashedPassword}`);

            if (hashedPassword === hash) {
                console.log("✅ Password found in dictionary:", password);
                return password;
            }
        }

        console.log("❌ Password not found in dictionary");
        return "Password not found";
    } catch (error) {
        console.error("⚠️ Error reading dictionary file:", error.message);
        return "Error: Unable to read dictionary file";
    }
}

// ✅ Export functions
module.exports = { hashPassword, compareHash, bruteForceCrack, dictionaryAttack };
