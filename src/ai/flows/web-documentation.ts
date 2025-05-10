'use server';

/**
 * @fileOverview An AI agent to search the web for documentation related to project technologies.
 *
 * - fetchWebDocumentation - A function that handles the web documentation fetching process.
 * - FetchWebDocumentationInput - The input type for the fetchWebDocumentation function.
 * - FetchWebDocumentationOutput - The return type for the fetchWebDocumentation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FetchWebDocumentationInputSchema = z.object({
  projectName: z.string().describe('The name of the project.'),
  technologies: z
    .string()
    .describe(
      'A comma-separated list of technologies used in the project (e.g., React, Node.js, TypeScript).'
    ),
});
export type FetchWebDocumentationInput = z.infer<typeof FetchWebDocumentationInputSchema>;

const FetchWebDocumentationOutputSchema = z.object({
  documentationUrls: z
    .array(z.string().url())
    .describe('An array of URLs pointing to the official documentation for each technology.'),
});
export type FetchWebDocumentationOutput = z.infer<typeof FetchWebDocumentationOutputSchema>;

export async function fetchWebDocumentation(input: FetchWebDocumentationInput): Promise<FetchWebDocumentationOutput> {
  return fetchWebDocumentationFlow(input);
}

const webSearchTool = ai.defineTool({
  name: 'webSearch',
  description: 'Search the web for documentation URLs related to specific technologies.',
  inputSchema: z.object({
    query: z.string().describe('The search query to use.'),
  }),
  outputSchema: z.array(z.string().url()).describe('A list of URLs found from the web search.'),
},
async (input) => {
    // Placeholder for web search implementation. Replace with actual web search logic.
    // This example returns a hardcoded list of URLs for demonstration purposes.
    // A more robust implementation would use a search API.
    const tech = input.query.split(' ')[0].toLowerCase();
    // Simulate some variability in finding URLs
    if (tech === 'react') {
        return ['https://react.dev/'];
    } else if (tech === 'next.js' || tech === 'nextjs') {
        return ['https://nextjs.org/docs'];
    } else if (tech === 'vue.js' || tech === 'vue') {
        return ['https://vuejs.org/guide/introduction.html'];
    } else if (tech === 'angular') {
        return ['https://angular.io/docs'];
    } else if (tech === 'node.js' || tech === 'nodejs') {
        return ['https://nodejs.org/en/docs'];
    } else if (tech === 'typescript') {
        return ['https://www.typescriptlang.org/docs/'];
    }
    return [`https://example.com/docs/${tech}`];
  }
);


const prompt = ai.definePrompt({
  name: 'fetchWebDocumentationPrompt',
  input: {schema: FetchWebDocumentationInputSchema},
  output: {schema: FetchWebDocumentationOutputSchema},
  tools: [webSearchTool],
  prompt: `You are an AI assistant helping users find documentation URLs for their projects.\n  The project is named "{{{projectName}}}" and uses the following technologies: {{{technologies}}}.\n  Your goal is to find the official documentation URLs for each technology used in the project.\n  Use the webSearch tool to find the documentation URLs for each technology.\n  Return a JSON array of documentation URLs.\n  If you can't find a documentation url for a technology, omit it from the output array.`,
});

const fetchWebDocumentationFlow = ai.defineFlow(
  {
    name: 'fetchWebDocumentationFlow',
    inputSchema: FetchWebDocumentationInputSchema,
    outputSchema: FetchWebDocumentationOutputSchema,
  },
  async input => {
    // The flow calls the prompt, and the prompt will (potentially multiple times) call the tool.
    const llmResponse = await prompt(input);

    if (llmResponse.output && llmResponse.output.documentationUrls) {
        return llmResponse.output;
    }
    
    // Fallback or error handling if LLM doesn't provide expected output
    return { documentationUrls: [] };
  }
);
