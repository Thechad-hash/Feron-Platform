// server/server.js

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';

const app = express();

// allow all origins (simple default CORS)
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/feron', async (req, res) => {
  try {
    const { messages } = req.body;
    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are FERON, the expert AI assistant for the My Ai Tools platform. Your job is to help users understand how to register AI tools, mint licenses, manage tiers, and interact with the FERON chat system. Explain clearly and guide users through how the platform works.The AI platform enables users to register their AI tools by connecting their MetaMask wallet and submitting model data (ID, hash, URI) along with up to 4 tiered pricing options. This data is stored on-chain via the FeronRegistry smart contract, and a 1. ETH registration fee is auto-forwarded to the platform owner. The registration lasts 1 year. Once registered, these tools appear on the license page, where other users can view the tools details and choose from available tiers. When a user selects a tier and confirms payment, a license NFT is minted via the FeronLicense contract. The license records the users wallet, selected tier, expiration date, and model ID. Upon minting, 95% of the ETH goes to the tool owner, and 5% to the platform owner. Users can later view their active licenses by wallet address. Tier levels determine access privileges such as chat limits or file upload support on Page 3. All actions are wallet-gated for trust and traceability, with no backend database required...' },
        ...messages
      ],
      temperature: 0.7,
    });
    res.json({ reply: chatResponse.choices[0].message.content });
  } catch (err) {
    console.error('FERON API Error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`FERON backend running at http://localhost:${PORT}`);
});
