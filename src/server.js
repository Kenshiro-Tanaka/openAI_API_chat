require('dotenv').config({ path: '../config/.env' }); // .env ファイルのパスを指定
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors()); // フロントエンドと通信できるようにする

const PORT = 3000;

app.post("/chat", async (req, res) => {
    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4o-mini",
                messages: req.body.messages,
            },
            {
                headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
            }
        );
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "API request failed" });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
