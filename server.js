const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const { bruteForceCrack, dictionaryAttack } = require("./methods"); // Import cracking methods

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Root Route (Fixes "Cannot GET /" error)
app.get("/", (req, res) => {
    res.send("Backend is running! 🚀");
});

// ✅ Crack Password API
app.post("/crack", async (req, res) => {
    try {
        const { hash, algorithm, method, dictionaryFile } = req.body;

        if (!hash || !algorithm || !method) {
            return res.status(400).json({ error: "Missing required parameters" });
        }

        let result = null;
        if (method === "brute-force") {
            result = bruteForceCrack(hash, algorithm);
        } else if (method === "dictionary") {
            result = dictionaryAttack(hash, algorithm, dictionaryFile);
        } else {
            return res.status(400).json({ error: "Invalid method" });
        }

        if (result) {
            res.json({ success: true, password: result });
        } else {
            res.json({ success: false, message: "Password not found" });
        }
    } catch (error) {
        console.error("Server Error:", error.message);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

// ✅ Start the server
const PORT = process.env.PORT || 5000; // Dynamic port for deployment
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
