
import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

async function listModels() {
    try {
        console.log('Testing gemini-pro...');
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent('Hello');
        console.log('Success with gemini-pro:', await result.response.text());
    } catch (error: any) {
        console.error('Error with gemini-pro:', error.message);
    }

    try {
        console.log('Testing gemini-1.5-flash...');
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent('Hello');
        console.log('Success with gemini-1.5-flash:', await result.response.text());
    } catch (error: any) {
        console.error('Error with gemini-1.5-flash:', error.message);
    }

    try {
        console.log('Testing gemini-1.5-flash-latest...');
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
        const result = await model.generateContent('Hello');
        console.log('Success with gemini-1.5-flash-latest:', await result.response.text());
    } catch (error: any) {
        console.error('Error with gemini-1.5-flash-latest:', error.message);
    }
}

listModels();
