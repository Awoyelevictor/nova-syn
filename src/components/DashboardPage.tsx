'use client';

import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { UserPresenceCard } from '@/components/features/dashboard/UserPresenceCard';
import { ActivityLogFeed } from '@/components/features/dashboard/ActivityLogFeed';
import { CommandQueue } from '@/components/features/dashboard/CommandQueue';
import { AdaptiveTipsSection } from '@/components/features/dashboard/AdaptiveTipsSection';

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <DashboardHeader />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Presence and System Status takes full width on small, 2/3 on large */}
          <div className="lg:col-span-3">
            <UserPresenceCard />
          </div>
          
          {/* Activity Log takes full width on small, 2/3 on large */}
          <div className="lg:col-span-2">
            <ActivityLogFeed />
          </div>

          {/* Command Queue and Adaptive Tips share the remaining 1/3 on large, stack on small */}
          <div className="lg:col-span-1 space-y-6">
            <CommandQueue />
            <AdaptiveTipsSection />
          </div>
        </div>
      </main>
      <footer className="text-center py-4 text-xs text-muted-foreground border-t border-border">
        Nova Sync &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
