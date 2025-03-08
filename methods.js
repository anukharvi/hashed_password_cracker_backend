const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

// ✅ Function to hash a password
function hashPassword(password, algorithm = "sha256") {
    if (algorithm === "bcrypt") {
        return bcrypt.hashSync(password, 10); // Use bcrypt for secure hashing
    } else {
        return crypto.createHash(algorithm).update(password).digest("hex"); // Use crypto for other algorithms
    }
}

// ✅ Function to compare a password with a hash
function compareHash(password, hashedPassword, algorithm = "sha256") {
    if (algorithm === "bcrypt") {
        return bcrypt.compareSync(password, hashedPassword); // Use bcrypt for comparison
    } else {
        return hashPassword(password, algorithm) === hashedPassword; // Compare hashes directly
    }
}

// ✅ Brute-force attack (Checks short passwords)
function bruteForceCrack(hash, algorithm = "sha256") {
    console.log("🔍 Brute-force cracking started for:", hash, "using", algorithm);

    const charset = "abcdefghijklmnopqrstuvwxyz0123456789"; // Characters to use for brute force
    const maxLength = 4; // Limits brute force length to avoid long execution times

    function generatePermutations(current) {
        if (current.length > maxLength) return null; // Stop if the length exceeds maxLength
        const generatedHash = hashPassword(current, algorithm);
        if (generatedHash === hash) {
            console.log(`✅ Brute-force cracked: ${current}`);
            return current; // Return the cracked password
        }
        for (let char of charset) {
            const result = generatePermutations(current + char); // Recursively generate permutations
            if (result) return result;
        }
        return null;
    }

    return generatePermutations("") || "Password not found"; // Start with an empty string
}

// ✅ Dictionary attack (Checks words in dictionary file)
function dictionaryAttack(hash, algorithm = "sha256", dictionaryFile = "dictionary.txt") {
    const filePath = path.join(__dirname, dictionaryFile); // Get full path to dictionary file
    console.log("📖 Looking for dictionary file at:", filePath);

    // Ensure dictionary file exists
    if (!fs.existsSync(filePath)) {
        console.error("⚠️ Dictionary file NOT found at:", filePath);
        return "Error: Dictionary file missing";
    }

    try {
        // Read dictionary file with UTF-8 encoding
        const words = fs.readFileSync(filePath, { encoding: "utf8", flag: "r" }).split("\n");

        for (let password of words) {
            password = password.trim(); // Remove extra spaces and line breaks
            if (!password) continue; // Skip empty lines

            const hashedPassword = hashPassword(password, algorithm); // Hash the current password

            console.log(`🔍 Checking: ${password} → Hash: ${hashedPassword}`);

            if (hashedPassword === hash) {
                console.log("✅ Password found in dictionary:", password);
                return password; // Return the cracked password
            }
        }

        console.log("❌ Password not found in dictionary");
        return "Password not found";
    } catch (error) {
        console.error("⚠️ Error reading dictionary file:", error.message);
        return "Error: Unable to read dictionary file";
    }
}

// ✅ Rainbow table attack (Fully implemented)
function rainbowTableAttack(hash, algorithm = "sha256", rainbowTableFile = "rainbow-table.txt") {
    const filePath = path.join(__dirname, rainbowTableFile); // Get full path to rainbow table file
    console.log("🌈 Looking for rainbow table file at:", filePath);

    // Ensure rainbow table file exists
    if (!fs.existsSync(filePath)) {
        console.error("⚠️ Rainbow table file NOT found at:", filePath);
        return "Error: Rainbow table file missing";
    }

    try {
        // Read rainbow table file with UTF-8 encoding
        const table = fs.readFileSync(filePath, { encoding: "utf8", flag: "r" }).split("\n");

        // Search for the hash in the table
        for (let entry of table) {
            entry = entry.trim(); // Remove extra spaces and line breaks
            if (!entry) continue; // Skip empty lines

            const [hashedPassword, password] = entry.split(":"); // Split hash and password
            if (hashedPassword === hash) {
                console.log("✅ Password found in rainbow table:", password);
                return password; // Return the cracked password
            }
        }

        console.log("❌ Password not found in rainbow table");
        return "Password not found";
    } catch (error) {
        console.error("⚠️ Error reading rainbow table file:", error.message);
        return "Error: Unable to read rainbow table file";
    }
}

// ✅ Export functions
module.exports = { hashPassword, compareHash, bruteForceCrack, dictionaryAttack, rainbowTableAttack };