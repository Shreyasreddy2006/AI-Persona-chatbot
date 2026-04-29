import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import { personaPrompts } from "./personas.js";

const app = express();
const port = Number(process.env.PORT || 8787);
const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, "../client/dist");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const client = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    hasApiKey: Boolean(process.env.OPENAI_API_KEY),
    model
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    if (!client) {
      return res.status(500).json({
        error:
          "The server is missing OPENAI_API_KEY. Add it to your environment before chatting."
      });
    }

    const { personaId, messages } = req.body ?? {};

    if (!personaId || !personaPrompts[personaId]) {
      return res.status(400).json({ error: "Invalid persona selected." });
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Conversation messages are required." });
    }

    const sanitizedMessages = messages
      .filter(
        (message) =>
          message &&
          (message.role === "user" || message.role === "assistant") &&
          typeof message.content === "string" &&
          message.content.trim()
      )
      .map((message) => ({
        role: message.role,
        content: message.content.trim()
      }));

    const completion = await client.chat.completions.create({
      model,
      temperature: 0.8,
      messages: [
        {
          role: "developer",
          content: personaPrompts[personaId]
        },
        ...sanitizedMessages
      ]
    });

    const reply = completion.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return res.status(502).json({
        error: "The model returned an empty response. Please try again."
      });
    }

    return res.json({ reply });
  } catch (error) {
    const statusCode = error?.status || 500;
    const apiMessage =
      error?.error?.message ||
      error?.message ||
      "The AI request failed unexpectedly.";

    return res.status(statusCode).json({
      error:
        statusCode >= 500
          ? "The chatbot could not respond right now. Please retry in a moment."
          : apiMessage
    });
  }
});

app.use(express.static(distPath));

app.get("*", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
