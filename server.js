const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const cryptoJS = require("crypto-js");
const { bruteForceCrack, dictionaryAttack } = require("./methods"); // Import your methods

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/crack", async (req, res) => {
    const { hash, algorithm, method, dictionaryFile } = req.body;

    if (!hash || !algorithm || !method) {
        return res.status(400).json({ error: "Missing required parameters" });
    }

    let result;
    if (method === "brute-force") {
        result = bruteForceCrack(hash, algorithm);
    } else if (method === "dictionary") {
        result = dictionaryAttack(hash, algorithm, dictionaryFile);
    }

    if (result) {
        res.json({ success: true, password: result });
    } else {
        res.json({ success: false, message: "Password not found" });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
