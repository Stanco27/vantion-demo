import express from 'express';
import cors from 'cors';
import { Groq } from 'groq-sdk';
import 'dotenv/config';
import { programs } from './programs';

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.get('/test', (req, res) => {
  res.send("Server is alive!");
});

app.post('/api/followup', async (req, res) => {
  const { programName, interests } = req.body;
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a Vantion admissions expert. The student wants to get into ${programName} 
          and is interested in ${interests.join(", ")}. 
          Provide 2 specific, high-level tips to help them stand out for THIS program. 
          Keep it under 50 words and sound professional.`
        }
      ],
      model: "llama-3.3-70b-versatile",
    });

    res.json({ answer: completion.choices[0]?.message?.content });
  } catch (error) {
    console.error("Follow-up error:", error);
    res.status(500).json({ error: "Could not generate strategy." });
  }
});

app.post('/api/match', async (req, res) => {
  try {
    const { userProfile } = req.body;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert Vantion college counselor. 
          Match the student to the 3 best programs from this list: ${JSON.stringify(programs)}. 
          Return ONLY JSON: { "matches": [{ "id": number, "reason": "why this fits" }] }`
        },
        { role: "user", content: userProfile }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" }
    });

    const aiData = JSON.parse(chatCompletion.choices[0]?.message?.content || '{"matches":[]}');
    
    const enrichedResults = aiData.matches.map((match: any) => {
      const details = programs.find(p => p.id === match.id);
      return details ? { ...details, aiReasoning: match.reason } : null;
    }).filter(Boolean);

    res.json(enrichedResults);
  } catch (error) {
    console.error("Groq Error:", error);
    res.status(500).json({ error: "High-speed matcher failed" });
  }
});

app.listen(3001, () => console.log('Groq Backend at 3001'));