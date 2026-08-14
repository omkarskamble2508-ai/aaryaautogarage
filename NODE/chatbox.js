const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAi = require("openai");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const client = new OpenAi({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "My Chatbot",
    },
});

app.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;

        // Use chat.completions.create (NOT responses.create — that doesn't work with OpenRouter)
        const response = await client.chat.completions.create({
            model: "openai/gpt-oss-20b:free",
            messages: [{ role: "user", content: message }],
        });

        res.json({
            reply: response.choices[0].message.content,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            reply: "Something went wrong.",
        });
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
