import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from './logger.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: "You are a helpful chat assistant. Your task is to provide a concise, friendly summary of the provided chat messages to help a user catch up on what they missed. Focus on key topics and decisions. If no clear topics exist, just say there hasn't been much activity yet."
});

export const summarizeMessages = async (messages) => {
    try {
        if (!messages || messages.length === 0) {
            return "No messages to summarize yet. Be the first to start the conversation!";
        }

        if (!process.env.GEMINI_API_KEY) {
            logger.warn('GEMINI_API_KEY is not set. Falling back to mock summary.');
            return `[Service Unavailable] We have ${messages.length} messages here, mostly about "${messages[messages.length - 1].content.substring(0, 30)}...". Please configure the Gemini API key for full AI summaries.`;
        }

        // Format messages for the prompt
        const chatHistory = messages
            .map((m) => `${m.sender?.username || m.user?.username || 'User'}: ${m.content}`)
            .join('\n');

        logger.info(`Generating real Gemini summary for ${messages.length} messages`);

        const prompt = `Please summarize the following chat history:\n\n${chatHistory}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();

    } catch (error) {
        logger.error('Gemini Summarization Error:', error);
        // Fallback for safety during development
        return "I'm having a little trouble summarizing the chat right now, but I'll be back soon!";
    }
};
