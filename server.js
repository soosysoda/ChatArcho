import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
});

app.post('/api/chat', async (req, res) => {
    try {
        console.log('Received request:', req.body);
        const { message, conversationHistory, model } = req.body;
        const apiKeyLastFour = process.env.OPENROUTER_API_KEY.slice(-4);
        console.log('API Key (last 4 digits):', apiKeyLastFour);
        let messages = [];
        if (conversationHistory && conversationHistory.length > 0) {
            messages = [...conversationHistory];
        }
        messages.push({
            role: 'user',
            content: message
        })

        console.log('Sending to OpenRouter:', messages);
        const completion = await openai.chat.completions.create({
            model: model || 'google/gemma-3n-e4b-it:free',
            messages: messages,
        });
        console.log('Recieved response from OpenAI:', completion.choices[0].message.content);
        
        res.json({
            reply: completion.choices[0].message.content,
            role: 'assistant',
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            error: 'An error occured while processing your request'
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;