'use server';

/**
 * @fileOverview AI-powered project tag suggestion flow.
 *
 * This file exports:
 * - `suggestProjectTags`: Function to suggest project tags based on project contents and attributes.
 * - `SuggestProjectTagsInput`: Input type for the `suggestProjectTags` function.
 * - `SuggestProjectTagsOutput`: Output type for the `suggestProjectTags` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestProjectTagsInputSchema = z.object({
  projectDescription: z
    .string()
    .describe('A detailed description of the project, including its purpose, technologies used, and languages involved.'),
  fileList: z.string().describe('A list of files in the project.'),
  language: z.string().describe('The primary programming language of the project.'),
});
export type SuggestProjectTagsInput = z.infer<typeof SuggestProjectTagsInputSchema>;

const SuggestProjectTagsOutputSchema = z.object({
  tags: z.array(z.string()).describe('An array of suggested tags for the project.'),
});
export type SuggestProjectTagsOutput = z.infer<typeof SuggestProjectTagsOutputSchema>;

export async function suggestProjectTags(input: SuggestProjectTagsInput): Promise<SuggestProjectTagsOutput> {
  return suggestProjectTagsFlow(input);
}

const suggestProjectTagsPrompt = ai.definePrompt({
  name: 'suggestProjectTagsPrompt',
  input: {schema: SuggestProjectTagsInputSchema},
  output: {schema: SuggestProjectTagsOutputSchema},
  prompt: `You are an AI assistant that suggests relevant tags for software projects.

  Based on the following project information, suggest 5-10 tags that would be helpful for categorizing and searching for the project later.

  Project Description: {{{projectDescription}}}
  File List: {{{fileList}}}
  Language: {{{language}}}

  Tags:`, // Ensure the prompt ends with "Tags:" so the LLM knows what is being asked
});

const suggestProjectTagsFlow = ai.defineFlow(
  {
    name: 'suggestProjectTagsFlow',
    inputSchema: SuggestProjectTagsInputSchema,
    outputSchema: SuggestProjectTagsOutputSchema,
  },
  async input => {
    const {output} = await suggestProjectTagsPrompt(input);
    return output!;
  }
);
