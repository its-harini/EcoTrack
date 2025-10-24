import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";

const app = express();
const PORT = 3000;

// ✅ Required to handle ES modules (so __dirname works)
const __filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

// ✅ Allow JSON and CORS
app.use(express.json());
app.use(cors());

// ✅ Serve your frontend folder
const frontendPath = path.join(__dirname, "../EoTrack");
app.use(express.static(frontendPath));

// ✅ OpenAI setup
const openai = new OpenAI({
  apiKey: "YOUR_OPENAI_API_KEY" // replace with your real key
});

// ✅ Chatbot API route
app.post("/askEcoAI", async (req, res) => {
  const question = req.body.question;
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: question }]
    });
    const answer = completion.choices[0].message.content;
    res.json({ answer });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ answer: "EcoAI is having trouble right now. 🌿" });
  }
});

// ✅ Default route for homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "home.html"));
});
app.listen(PORT, () => console.log(`server running at http://localhost:${PORT}`));