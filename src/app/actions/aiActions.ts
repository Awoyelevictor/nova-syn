// src/app/actions/aiActions.ts
'use server';

import { generateOnboardingTips, type GenerateOnboardingTipsInput } from '@/ai/flows/generate-onboarding-tips';
import { summarizeSystemActivity, type SummarizeSystemActivityInput } from '@/ai/flows/summarize-system-activity';
import type { SystemLog } from '@/types/nova'; // Assuming SystemLog type is defined

// Helper to format logs for AI prompts
function formatLogsForAI(logs: SystemLog[]): string {
  return logs
    .slice(0, 20) // Take recent 20 logs
    .map(log => `[${new Date(log.timestamp).toLocaleTimeString()}] ${log.eventType}: ${log.details || JSON.stringify(log.eventData)}`)
    .join('\n');
}


export async function getOnboardingTipsAction(logs: SystemLog[]) {
  const formattedLogs = formatLogsForAI(logs);
  const input: GenerateOnboardingTipsInput = { systemActivityLogs: formattedLogs };
  try {
    const result = await generateOnboardingTips(input);
    return { success: true, tips: result.tips };
  } catch (error) {
    console.error("Error generating onboarding tips:", error);
    // Check if error is an instance of Error to safely access message
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: `Failed to generate tips: ${errorMessage}` };
  }
}

export async function getSystemActivitySummaryAction(logs: SystemLog[]) {
  const formattedLogs = formatLogsForAI(logs);
  const input: SummarizeSystemActivityInput = { logs: formattedLogs };
  try {
    const result = await summarizeSystemActivity(input);
    return { success: true, summary: result.summary };
  } catch (error) {
    console.error("Error summarizing system activity:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: `Failed to summarize activity: ${errorMessage}` };
  }
}
