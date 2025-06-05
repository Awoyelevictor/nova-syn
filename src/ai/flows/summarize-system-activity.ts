// Summarizes recent system activity based on logs.

'use server';

/**
 * @fileOverview A flow to summarize recent system activity for a user.
 *
 * - summarizeSystemActivity - A function that summarizes recent system activity.
 * - SummarizeSystemActivityInput - The input type for the summarizeSystemActivity function.
 * - SummarizeSystemActivityOutput - The return type for the summarizeSystemActivity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeSystemActivityInputSchema = z.object({
  logs: z.string().describe('Recent system activity logs.'),
});
export type SummarizeSystemActivityInput = z.infer<
  typeof SummarizeSystemActivityInputSchema
>;

const SummarizeSystemActivityOutputSchema = z.object({
  summary: z.string().describe('A summary of recent system activity.'),
});
export type SummarizeSystemActivityOutput = z.infer<
  typeof SummarizeSystemActivityOutputSchema
>;

export async function summarizeSystemActivity(
  input: SummarizeSystemActivityInput
): Promise<SummarizeSystemActivityOutput> {
  return summarizeSystemActivityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeSystemActivityPrompt',
  input: {schema: SummarizeSystemActivityInputSchema},
  output: {schema: SummarizeSystemActivityOutputSchema},
  prompt: `You are an AI assistant that summarizes system activity logs.

  Summarize the following system activity logs:

  {{logs}}`,
});

const summarizeSystemActivityFlow = ai.defineFlow(
  {
    name: 'summarizeSystemActivityFlow',
    inputSchema: SummarizeSystemActivityInputSchema,
    outputSchema: SummarizeSystemActivityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
