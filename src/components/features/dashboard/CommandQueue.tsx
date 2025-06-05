'use client';

import { useState, useEffect } from 'react';
import type { Command } from '@/types/nova';
import { mockCommands, subscribeToMockData } from '@/lib/mockData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SectionCard } from '@/components/layout/SectionCard';
import { TerminalSquare, PlayCircle, CheckCircle2, XCircle, Loader2, AlertTriangle, Hourglass } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function CommandQueue() {
  const [commands, setCommands] = useState<Command[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToMockData<Command[]>('commands', (data) => {
       setCommands(data as Command[]);
    });
    return () => unsubscribe();
  }, []);

  const getStatusBadgeVariant = (status: Command['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'completed': return 'default'; // Will use primary color
      case 'in_progress':
      case 'pending':
      case 'queued':
        return 'secondary';
      case 'failed': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: Command['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-primary" />;
      case 'in_progress': return <Loader2 className="h-4 w-4 animate-spin text-blue-400" />;
      case 'pending': return <PlayCircle className="h-4 w-4 text-yellow-400" />;
      case 'queued': return <Hourglass className="h-4 w-4 text-gray-400" />;
      case 'failed': return <XCircle className="h-4 w-4 text-destructive" />;
      default: return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <SectionCard title="Command Queue" icon={TerminalSquare}>
      <ScrollArea className="h-72">
        {commands.length === 0 && <p className="text-muted-foreground text-sm p-4">Command queue is empty.</p>}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Command</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Requested By</TableHead>
              <TableHead className="hidden sm:table-cell">Created</TableHead>
              <TableHead className="text-right hidden lg:table-cell">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {commands.map((command) => (
              <TableRow key={command.id}>
                <TableCell className="font-medium font-code">{command.commandName}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(command.status)} className="flex items-center gap-1.5 capitalize">
                    {getStatusIcon(command.status)}
                    {command.status.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">{command.requestedBy || 'N/A'}</TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground">
                  {formatDistanceToNow(new Date(command.createdAt), { addSuffix: true })}
                </TableCell>
                <TableCell className="text-right hidden lg:table-cell text-xs text-muted-foreground font-code">
                  {command.payload ? (typeof command.payload === 'string' ? command.payload : JSON.stringify(command.payload)) : (command.error || 'No details')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </SectionCard>
  );
}
