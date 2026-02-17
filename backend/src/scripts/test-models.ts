
import dotenv from 'dotenv';
dotenv.config();

import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

async function testModels() {
    try {
        console.log('Testing llama-3.3-70b-versatile...');
        const result = await groq.chat.completions.create({
            messages: [{ role: 'user', content: 'Hello' }],
            model: 'llama-3.3-70b-versatile',
        });
        console.log('Success with llama-3.3-70b-versatile:', result.choices[0]?.message?.content);
    } catch (error: any) {
        console.error('Error with llama-3.3-70b-versatile:', error.message);
    }

    try {
        console.log('Testing llama-3.1-8b-instant...');
        const result = await groq.chat.completions.create({
            messages: [{ role: 'user', content: 'Hello' }],
            model: 'llama-3.1-8b-instant',
        });
        console.log('Success with llama-3.1-8b-instant:', result.choices[0]?.message?.content);
    } catch (error: any) {
        console.error('Error with llama-3.1-8b-instant:', error.message);
    }

    try {
        console.log('Testing mixtral-8x7b-32768...');
        const result = await groq.chat.completions.create({
            messages: [{ role: 'user', content: 'Hello' }],
            model: 'mixtral-8x7b-32768',
        });
        console.log('Success with mixtral-8x7b-32768:', result.choices[0]?.message?.content);
    } catch (error: any) {
        console.error('Error with mixtral-8x7b-32768:', error.message);
    }
}

testModels();
