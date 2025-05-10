import { config } from 'dotenv';
config();

if (!process.env.GOOGLE_API_KEY) {
  console.warn(
    'GOOGLE_API_KEY not found. AI-reliant features will be disabled.\n' +
      'Please set the GOOGLE_API_KEY environment variable in a .env file in the project root.\n' +
      'You can get an API key from https://makersuite.google.com/.'
  );
} else {
import '@/ai/flows/project-summary.ts';
import '@/ai/flows/web-documentation.ts';
import '@/ai/flows/ai-tagging.ts';
}