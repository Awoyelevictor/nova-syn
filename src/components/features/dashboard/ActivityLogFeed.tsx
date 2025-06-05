'use client';

import { useState, useEffect, useRef } from 'react';
import type { SystemLog } from '@/types/nova';
import { mockSystemLogs, subscribeToMockData } from '@/lib/mockData';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SectionCard } from '@/components/layout/SectionCard';
import { ListChecks, MousePointerSquareDashed, Keyboard, Download, Terminal, UserCog } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const iconMap: { [key: string]: React.ElementType } = {
  cursorMove: MousePointerSquareDashed,
  keypress: Keyboard,
  downloadStart: Download,
  downloadComplete: Download,
  appLaunch: Terminal,
  userLogin: UserCog,
  default: ListChecks,
};


export function ActivityLogFeed() {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = subscribeToMockData<SystemLog[]>('logs', (data) => {
      setLogs(data as SystemLog[]);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom if not manually scrolled up
    if (scrollAreaRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]') || { scrollTop: 0, scrollHeight: 0, clientHeight: 0};
        // A threshold to detect if user has scrolled up significantly
        if (scrollHeight - scrollTop < clientHeight + 100) { 
             const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
             if (viewport) viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [logs]);


  return (
    <SectionCard title="System Activity Log" icon={ListChecks} className="col-span-1 md:col-span-2">
      <ScrollArea className="h-96" ref={scrollAreaRef}>
        <div className="space-y-3 pr-4">
          {logs.length === 0 && <p className="text-muted-foreground text-sm">No activity logs yet.</p>}
          {logs.map((log) => {
            const LogIcon = iconMap[log.eventType] || iconMap.default;
            return (
              <div key={log.id} className="flex items-start space-x-3 p-3 bg-card-foreground/5 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200">
                <LogIcon className="h-5 w-5 mt-0.5 text-accent flex-shrink-0" />
                <div className="flex-grow">
                  <p className="text-sm font-medium text-foreground font-code">
                    {log.details || `${log.eventType}: ${typeof log.eventData === 'string' ? log.eventData : JSON.stringify(log.eventData)}`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                    {log.userId && ` by ${log.userId}`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </SectionCard>
  );
}
