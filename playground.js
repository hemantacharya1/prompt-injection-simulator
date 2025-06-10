import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';

const app = express();
app.use(cors());
const openaiKey = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
const client = new OpenAI({ apiKey: openaiKey }); 

app.get('/api/results', async (req, res) => {
  const prompt = "Write a product description for tesla cars";
  const systemPrompt = "You are a product copywriter.";

  const configs = [
    { temperature: 0.0, max_tokens: 50, frequency_penalty: 0, presence_penalty: 0 },
    { temperature: 0.7, max_tokens: 150, frequency_penalty: 0, presence_penalty: 0 },
    { temperature: 1.2, max_tokens: 300, frequency_penalty: 1.5, presence_penalty: 1.5 }
  ];

  const results = [];

  for (const config of configs) {
    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: systemPrompt }, { role: "user", content: prompt }],
      ...config
    });

    results.push({
      Model: "gpt-3.5-turbo",
      Temperature: config.temperature,
      MaxTokens: config.max_tokens,
      FrequencyPenalty: config.frequency_penalty,
      PresencePenalty: config.presence_penalty,
      Response: response.choices[0].message.content.trim()
    });
  }

  res.json(results);
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
