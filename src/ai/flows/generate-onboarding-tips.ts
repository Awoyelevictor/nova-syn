'use server';
/**
 * @fileOverview A flow that generates personalized onboarding tips based on system activity logs.
 *
 * - generateOnboardingTips - A function that generates personalized onboarding tips.
 * - GenerateOnboardingTipsInput - The input type for the generateOnboardingTips function.
 * - GenerateOnboardingTipsOutput - The return type for the generateOnboardingTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateOnboardingTipsInputSchema = z.object({
  systemActivityLogs: z.string().describe('Recent system activity logs.'),
});
export type GenerateOnboardingTipsInput = z.infer<
  typeof GenerateOnboardingTipsInputSchema
>;

const GenerateOnboardingTipsOutputSchema = z.object({
  tips: z
    .string()
    .describe('Personalized onboarding tips based on system activity logs.'),
});
export type GenerateOnboardingTipsOutput = z.infer<
  typeof GenerateOnboardingTipsOutputSchema
>;

export async function generateOnboardingTips(
  input: GenerateOnboardingTipsInput
): Promise<GenerateOnboardingTipsOutput> {
  return generateOnboardingTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateOnboardingTipsPrompt',
  input: {schema: GenerateOnboardingTipsInputSchema},
  output: {schema: GenerateOnboardingTipsOutputSchema},
  prompt: `You are an AI assistant designed to provide personalized onboarding tips to users based on their system activity logs.

  Analyze the following system activity logs and provide helpful tips to help the user get the most out of the Nova Sync application:

  System Activity Logs: {{{systemActivityLogs}}}
  `,
});

const generateOnboardingTipsFlow = ai.defineFlow(
  {
    name: 'generateOnboardingTipsFlow',
    inputSchema: GenerateOnboardingTipsInputSchema,
    outputSchema: GenerateOnboardingTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
