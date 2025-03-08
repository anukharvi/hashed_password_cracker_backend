const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
require("dotenv").config();

const { bruteForceCrack, dictionaryAttack, rainbowTableAttack } = require("./methods");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Debugging: Check if MONGO_URI is loaded
console.log("🔍 Debugging: MONGO_URI =", process.env.MONGO_URI);

if (!process.env.MONGO_URI) {
    console.error("❌ ERROR: MONGO_URI is not set in environment variables!");
}

// ✅ Connect to MongoDB with better error handling
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
})
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err.message));

// ✅ User Model
const User = mongoose.model("User", new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}));

// ✅ Cracked Password Model
const CrackedPassword = mongoose.model("CrackedPassword", new mongoose.Schema({
    hash: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    algorithm: { type: String, required: true },
    crackedAt: { type: Date, default: Date.now }
}));

// ✅ Root Route
app.get("/", (req, res) => {
    res.send("✅ Backend is running! 🚀");
});

// ✅ User Signup API (Saves to MongoDB)
app.post("/signup", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "✅ User registered successfully!" });
    } catch (error) {
        console.error("❌ Signup Error:", error.message);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

// ✅ Crack Password API (Saves Cracked Passwords in MongoDB)
app.post("/crack", async (req, res) => {
    try {
        const { hash, algorithm, method } = req.body;

        if (!hash || !algorithm || !method) {
            return res.status(400).json({ error: "Missing required parameters" });
        }

        const supportedAlgorithms = ["md5", "sha1", "sha256"];
        if (!supportedAlgorithms.includes(algorithm)) {
            return res.status(400).json({ error: "Invalid algorithm. Only MD5, SHA-1, and SHA-256 are supported." });
        }

        // ✅ Check if the hash was cracked before
        const existingCracked = await CrackedPassword.findOne({ hash });
        if (existingCracked) {
            console.log(`🔍 Retrieved from database: ${existingCracked.password}`);
            return res.json({ success: true, password: existingCracked.password });
        }

        console.log(`🔎 Cracking hash: ${hash} using method: ${method}`);

        let result;
        switch (method) {
            case "brute-force":
                result = bruteForceCrack(hash, algorithm);
                break;
            case "dictionary":
                result = dictionaryAttack(hash, algorithm);
                break;
            case "rainbow-table":
                result = rainbowTableAttack(hash, algorithm);
                break;
            default:
                return res.status(400).json({ error: "Invalid method" });
        }

        // ✅ Save cracked password in MongoDB if found
        if (result !== "Password not found") {
            await CrackedPassword.create({ hash, password: result, algorithm });
        }

        res.json({ success: result !== "Password not found", password: result });

    } catch (error) {
        console.error("❌ Server Error:", error.message);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

// ✅ Start the server with error handling
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
