
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { SectionCard } from '@/components/layout/SectionCard';
import { Lightbulb, Sparkles, Loader2, AlertTriangle } from 'lucide-react';
import { getOnboardingTipsAction } from '@/app/actions/aiActions';
import type { SystemLog } from '@/types/nova';
import { mockSystemLogs, subscribeToMockData } from '@/lib/mockData'; // Using mock logs for now
import { useToast } from "@/hooks/use-toast";

export function AdaptiveTipsSection() {
  const [tips, setTips] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentLogs, setCurrentLogs] = useState<SystemLog[]>(mockSystemLogs);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = subscribeToMockData<SystemLog[]>('logs', (data) => {
      setCurrentLogs(data as SystemLog[]);
    });
    return () => unsubscribe();
  }, []);


  const handleGenerateTips = async () => {
    setIsLoading(true);
    setError(null);
    setTips(null);

    // In a real app, fetch recent logs from Firebase or use currentLogs
    const result = await getOnboardingTipsAction(currentLogs); 
    
    if (result.success) {
      setTips(result.tips);
      toast({
        title: "New Tips Generated!",
        description: "Check out the adaptive assistant section.",
      });
    } else {
      setError(result.error || "An unknown error occurred.");
      toast({
        title: "Error Generating Tips",
        description: result.error || "Could not generate new tips.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <SectionCard title="Adaptive Assistant" icon={Lightbulb} actionButton={
      <Button onClick={handleGenerateTips} disabled={isLoading} size="sm">
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
        Get Tips
      </Button>
    }>
      <div className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {tips ? (
          <Alert variant="default" className="bg-accent/10 border-accent/30">
            <Sparkles className="h-5 w-5 text-accent" />
            <AlertTitle className="text-accent font-semibold">Nova's Insights</AlertTitle>
            <AlertDescription className="text-foreground whitespace-pre-wrap font-code text-sm">
              {tips}
            </AlertDescription>
          </Alert>
        ) : (
          <p className="text-sm text-muted-foreground">
            {isLoading ? 'Generating personalized tips based on your activity...' : 'Click "Get Tips" to see what Nova suggests based on your recent system activity.'}
          </p>
        )}
      </div>
    </SectionCard>
  );
}
