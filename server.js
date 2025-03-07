const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");

const { bruteForceCrack, dictionaryAttack, rainbowTableAttack } = require("./methods"); // Import cracking methods

const app = express();
app.use(cors());
app.use(bodyParser.json());

const users = []; // Temporary in-memory storage (Use MongoDB for production)

// ✅ Root Route (Fixes "Cannot GET /" error)
app.get("/", (req, res) => {
    res.send("Backend is running! 🚀");
});

// ✅ User Signup API
app.post("/signup", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        // Check if user already exists
        if (users.find(user => user.username === username)) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Hash password before storing
        const hashedPassword = await bcrypt.hash(password, 10);
        users.push({ username, password: hashedPassword });

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Signup Error:", error.message);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

// ✅ Crack Password API (With Loading Simulation)
app.post("/crack", async (req, res) => {
    try {
        const { hash, algorithm, method, dictionaryFile } = req.body;

        if (!hash || !algorithm || !method) {
            return res.status(400).json({ error: "Missing required parameters" });
        }

        // ✅ Remove SHA-512 Support
        const supportedAlgorithms = ["md5", "sha1", "sha256"];
        if (!supportedAlgorithms.includes(algorithm)) {
            return res.status(400).json({ error: "Invalid algorithm. Only MD5, SHA-1, and SHA-256 are supported." });
        }

        let result = null;

        if (method === "brute-force") {
            result = bruteForceCrack(hash, algorithm);
        } else if (method === "dictionary") {
            result = dictionaryAttack(hash, algorithm, dictionaryFile);
        } else if (method === "rainbow-table") {
            result = rainbowTableAttack(hash, algorithm);
        } else {
            return res.status(400).json({ error: "Invalid method" });
        }

        // ✅ Simulate Loading (1.5s delay)
        setTimeout(() => {
            res.json({
                success: result !== "Password not found",
                password: result
            });
        }, 1500);

    } catch (error) {
        console.error("Server Error:", error.message);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

// ✅ Start the server
const PORT = process.env.PORT || 5000; // Dynamic port for deployment
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
