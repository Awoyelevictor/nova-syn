
'use client';

import { useState, useEffect, useRef } from 'react';
import type { UserProfile, NovaSystemStatus } from '@/types/nova';
import { mockUserProfiles, mockNovaSystemStatus, subscribeToMockData } from '@/lib/mockData';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SectionCard } from '@/components/layout/SectionCard';
import { Zap, Cpu, MemoryStick, CheckCircle, XCircle, AlertTriangle as SystemAlertTriangle, Clock, Camera, Info } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function UserPresenceCard() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [systemStatus, setSystemStatus] = useState<NovaSystemStatus>(mockNovaSystemStatus);
  const [formattedLastSeen, setFormattedLastSeen] = useState<string | null>(null);
  const [formattedLastSync, setFormattedLastSync] = useState<string | null>(null);
  
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const [systemActionMessage, setSystemActionMessage] = useState<string | null>(null);

  useEffect(() => {
    const activeUser = mockUserProfiles.find(u => u.onlineStatus === 'online' && u.faceRecognitionStatus === 'active');
    setCurrentUser(activeUser || mockUserProfiles[0]);

    const unsubscribeStatus = subscribeToMockData<NovaSystemStatus>('status', (data) => {
      setSystemStatus(data as NovaSystemStatus);
    });
    
    return () => {
      unsubscribeStatus();
    };
  }, []);

  useEffect(() => {
    if (currentUser?.lastSeen) {
      setFormattedLastSeen(new Date(currentUser.lastSeen).toLocaleString());
    } else {
      setFormattedLastSeen('Loading...');
    }
  }, [currentUser?.lastSeen]);

  useEffect(() => {
    if (systemStatus.lastSync) {
      setFormattedLastSync(new Date(systemStatus.lastSync).toLocaleString());
    } else {
      setFormattedLastSync('Loading...');
    }
  }, [systemStatus.lastSync]);

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('getUserMedia is not supported in this browser.');
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Not Supported',
          description: 'Your browser does not support camera access or it is disabled.',
        });
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this app.',
        });
      }
    };

    getCameraPermission();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast]);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.faceRecognitionStatus === 'inactive') {
        setSystemActionMessage("User not detected. Nova system would prepare to enter sleep mode.");
      } else if (currentUser.faceRecognitionStatus === 'active') {
        setSystemActionMessage("User active. System monitoring.");
      } else {
        setSystemActionMessage(null); // Clear message for other statuses or if no user
      }
    } else {
      setSystemActionMessage(null);
    }
  }, [currentUser, currentUser?.faceRecognitionStatus]);


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
  
  const getAISystemStatusIcon = (status: NovaSystemStatus['aiStatus']) => {
    switch (status) {
      case 'online': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'offline': return <XCircle className="h-4 w-4 text-gray-400" />;
      case 'error': return <SystemAlertTriangle className="h-4 w-4 text-red-400" />;
      case 'initializing': return <Clock className="h-4 w-4 text-yellow-400" />;
      default: return <SystemAlertTriangle className="h-4 w-4 text-muted-foreground" />;
    }
  }

  return (
    <SectionCard title="System & User Status" icon={Zap} className="col-span-1 md:col-span-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentUser && (
          <div className="space-y-4 p-4 rounded-lg border border-border">
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
            
            <div className="mt-2">
              <h4 className="text-sm font-medium mb-2 text-foreground flex items-center">
                <Camera className="h-4 w-4 mr-2 text-accent" /> Live Feed
              </h4>
              <video ref={videoRef} className="w-full aspect-[4/3] rounded-md border border-input bg-muted shadow-inner object-cover" autoPlay muted playsInline />
              {hasCameraPermission === false && (
                <Alert variant="destructive" className="mt-2">
                  <SystemAlertTriangle className="h-4 w-4" />
                  <AlertTitle>Camera Access Denied</AlertTitle>
                  <AlertDescription>
                    Please enable camera permissions in your browser settings to display the live video feed.
                  </AlertDescription>
                </Alert>
              )}
            </div>
             {systemActionMessage && (
              <div className="mt-2">
                <Alert variant="default" className="bg-card-foreground/10 border-border">
                  <Info className="h-4 w-4 text-accent" />
                  <AlertTitle className="font-semibold text-sm">System Response</AlertTitle>
                  <AlertDescription className="text-xs">
                    {systemActionMessage}
                  </AlertDescription>
                </Alert>
              </div>
            )}
            <p className="text-xs text-muted-foreground">Last Seen: {formattedLastSeen}</p>
          </div>
        )}

        <div className="space-y-3 p-4 rounded-lg border border-border">
          <div className="flex items-center space-x-2">
            {getAISystemStatusIcon(systemStatus.aiStatus)}
            <h4 className="font-semibold text-md">Nova AI: {systemStatus.aiStatus}</h4>
          </div>
          <div className="space-y-1 text-sm">
            <p className="flex items-center"><Cpu className="h-4 w-4 mr-2 text-accent" /> CPU Usage: {systemStatus.cpuUsage?.toFixed(1) ?? 'N/A'}%</p>
            <p className="flex items-center"><MemoryStick className="h-4 w-4 mr-2 text-accent" /> Memory Usage: {systemStatus.memoryUsage?.toFixed(1) ?? 'N/A'}%</p>
          </div>
          <p className="text-xs text-muted-foreground">Last Sync: {formattedLastSync}</p>
        </div>
      </div>
    </SectionCard>
  );
}
