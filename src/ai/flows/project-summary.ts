'use server';

/**
 * @fileOverview Summarizes a software project.
 *
 * - projectSummary - A function that summarizes a project.
 * - ProjectSummaryInput - The input type for the projectSummary function.
 * - ProjectSummaryOutput - The return type for the projectSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProjectSummaryInputSchema = z.object({
  projectPath: z.string().describe('The path to the project directory.'),
  fileContents: z.string().describe('The contents of the project files.'),
});
export type ProjectSummaryInput = z.infer<typeof ProjectSummaryInputSchema>;

const ProjectSummaryOutputSchema = z.object({
  purpose: z.string().describe('The purpose of the project.'),
  completeness: z.string().describe('The completeness of the project.'),
  technologies: z.string().describe('The technologies used in the project.'),
  languages: z.string().describe('The languages used in the project.'),
});
export type ProjectSummaryOutput = z.infer<typeof ProjectSummaryOutputSchema>;

export async function projectSummary(input: ProjectSummaryInput): Promise<ProjectSummaryOutput> {
  return projectSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'projectSummaryPrompt',
  input: {schema: ProjectSummaryInputSchema},
  output: {schema: ProjectSummaryOutputSchema},
  prompt: `You are an AI assistant helping to summarize software projects.

  Analyze the following project and provide a summary including its purpose, completeness,
  technologies used, and languages involved. Return the result in JSON format.

  Project path: {{{projectPath}}}
  File contents: {{{fileContents}}}
  `,
});

const projectSummaryFlow = ai.defineFlow(
  {
    name: 'projectSummaryFlow',
    inputSchema: ProjectSummaryInputSchema,
    outputSchema: ProjectSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
