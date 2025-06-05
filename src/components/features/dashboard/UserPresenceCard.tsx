'use client';

import { useState, useEffect } from 'react';
import type { UserProfile, NovaSystemStatus } from '@/types/nova';
import { mockUserProfiles, mockNovaSystemStatus, subscribeToMockData } from '@/lib/mockData';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { SectionCard } from '@/components/layout/SectionCard';
import { Users, Zap, Cpu, MemoryStick, CheckCircle, XCircle, AlertTriangle, Clock } from 'lucide-react';
import Image from 'next/image';

export function UserPresenceCard() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [systemStatus, setSystemStatus] = useState<NovaSystemStatus>(mockNovaSystemStatus);

  useEffect(() => {
    // In a real app, fetch this from Firebase
    const activeUser = mockUserProfiles.find(u => u.onlineStatus === 'online' && u.faceRecognitionStatus === 'active');
    setCurrentUser(activeUser || mockUserProfiles[0]);

    const unsubscribeStatus = subscribeToMockData<NovaSystemStatus>('status', (data) => {
      setSystemStatus(data as NovaSystemStatus);
    }, 3000);
    
    return () => {
      unsubscribeStatus();
    };
  }, []);

  const getStatusColor = (status: UserProfile['onlineStatus'] | UserProfile['faceRecognitionStatus'] | NovaSystemStatus['aiStatus']) => {
    switch (status) {
      case 'online':
      case 'active':
        return 'bg-green-500';
      case 'offline':
      case 'inactive':
        return 'bg-gray-500';
      case 'error':
        return 'bg-red-500';
      case 'pending':
      case 'initializing':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-400';
    }
  };
  
  const getStatusIcon = (status: NovaSystemStatus['aiStatus']) => {
    switch (status) {
      case 'online': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'offline': return <XCircle className="h-4 w-4 text-gray-400" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'initializing': return <Clock className="h-4 w-4 text-yellow-400" />;
      default: return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
    }
  }

  return (
    <SectionCard title="System & User Status" icon={Zap} className="col-span-1 md:col-span-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentUser && (
          <div className="space-y-3 p-4 rounded-lg border border-border">
            <div className="flex items-center space-x-3">
              <Avatar className="h-16 w-16">
                <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} data-ai-hint="profile portrait" />
                <AvatarFallback>{currentUser.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold font-headline">{currentUser.name}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`h-3 w-3 rounded-full ${getStatusColor(currentUser.onlineStatus)}`} />
                  <p className="text-xs text-muted-foreground">Online: {currentUser.onlineStatus}</p>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`h-3 w-3 rounded-full ${getStatusColor(currentUser.faceRecognitionStatus)}`} />
                  <p className="text-xs text-muted-foreground">Face ID: {currentUser.faceRecognitionStatus}</p>
                </div>
              </div>
            </div>
             <p className="text-xs text-muted-foreground">Last Seen: {new Date(currentUser.lastSeen).toLocaleString()}</p>
          </div>
        )}

        <div className="space-y-3 p-4 rounded-lg border border-border">
          <div className="flex items-center space-x-2">
            {getStatusIcon(systemStatus.aiStatus)}
            <h4 className="font-semibold text-md">Nova AI: {systemStatus.aiStatus}</h4>
          </div>
          <div className="space-y-1 text-sm">
            <p className="flex items-center"><Cpu className="h-4 w-4 mr-2 text-accent" /> CPU Usage: {systemStatus.cpuUsage?.toFixed(1) ?? 'N/A'}%</p>
            <p className="flex items-center"><MemoryStick className="h-4 w-4 mr-2 text-accent" /> Memory Usage: {systemStatus.memoryUsage?.toFixed(1) ?? 'N/A'}%</p>
          </div>
          <p className="text-xs text-muted-foreground">Last Sync: {new Date(systemStatus.lastSync).toLocaleString()}</p>
        </div>
      </div>
    </SectionCard>
  );
}
