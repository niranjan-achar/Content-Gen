import OpenAI from 'openai';

// Prefer XAI/Grok API key; fallback to GROK_API_KEY for flexibility
const apiKey = process.env.XAI_API_KEY || process.env.GROK_API_KEY;

if (!apiKey) {
  throw new Error('Missing xAI Grok API key. Set XAI_API_KEY or GROK_API_KEY');
}

// Configure OpenAI SDK to point to xAI's Grok API
const openai = new OpenAI({
  apiKey,
  baseURL: process.env.XAI_BASE_URL || 'https://api.x.ai/v1',
});

// Default Grok model (can be overridden via env)
export const GROK_MODEL = process.env.GROK_MODEL || 'grok-3-mini';

export default openai;