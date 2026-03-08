import { BACKEND_URL, OPENAI_API_KEY, GEMINI_API_KEY } from '@env';

export default {
  BACKEND_URL: BACKEND_URL || 'http://172.20.10.2:5000', // Fallback if .env fails
  OPENAI_API_KEY,
  GEMINI_API_KEY
};