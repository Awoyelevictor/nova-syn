import { Bot } from 'lucide-react';

export function DashboardHeader() {
  return (
    <header className="py-4 px-6 border-b border-border">
      <div className="container mx-auto flex items-center">
        <Bot className="h-8 w-8 mr-3 text-accent" />
        <h1 className="text-2xl font-headline font-semibold text-foreground">
          Nova Sync
        </h1>
      </div>
    </header>
  );
}
