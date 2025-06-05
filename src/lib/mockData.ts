import type { UserProfile, SystemLog, Command, NovaSystemStatus } from '@/types/nova';
import { UserCheck, UserX, Wifi, WifiOff, MousePointerSquare, Keyboard, Download, Terminal, PlayCircle, CheckCircle2, XCircle, Loader2, AlertTriangle, Activity, Power } from 'lucide-react';

export const mockUserProfiles: UserProfile[] = [
  {
    id: 'user1',
    name: 'Authorized User',
    faceRecognitionStatus: 'active',
    onlineStatus: 'online',
    lastSeen: new Date().toISOString(),
    avatarUrl: 'https://placehold.co/100x100.png',
  },
  {
    id: 'user2',
    name: 'Guest User',
    faceRecognitionStatus: 'inactive',
    onlineStatus: 'offline',
    lastSeen: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    avatarUrl: 'https://placehold.co/100x100.png',
  }
];

export const mockSystemLogs: SystemLog[] = [
  { 
    id: 'log1', 
    timestamp: new Date(Date.now() - 5000).toISOString(), 
    eventType: 'appLaunch', 
    eventData: { app: 'Nova Sync Dashboard' }, 
    details: "Application 'Nova Sync Dashboard' launched.",
    icon: Terminal 
  },
  { 
    id: 'log2', 
    timestamp: new Date(Date.now() - 10000).toISOString(), 
    eventType: 'cursorMove', 
    eventData: { x: 120, y: 340 },
    details: "Cursor moved to (120, 340).",
    icon: MousePointerSquare
  },
  { 
    id: 'log3', 
    timestamp: new Date(Date.now() - 15000).toISOString(), 
    eventType: 'keypress', 
    eventData: { key: 'Enter' },
    details: "Key 'Enter' pressed.",
    icon: Keyboard 
  },
  { 
    id: 'log4', 
    timestamp: new Date(Date.now() - 20000).toISOString(), 
    eventType: 'downloadStart', 
    eventData: { file: 'update_package.zip', url: 'https://example.com/update.zip' },
    details: "Download started: update_package.zip",
    icon: Download 
  },
   { 
    id: 'log5', 
    timestamp: new Date(Date.now() - 60000 * 5).toISOString(), 
    eventType: 'userLogin', 
    userId: 'user1', 
    eventData: { method: 'facial_recognition' },
    details: "User 'Authorized User' logged in via facial recognition.",
    icon: UserCheck 
  },
];

export const mockCommands: Command[] = [
  { 
    id: 'cmd1', 
    commandName: 'turnOnWifi', 
    status: 'completed', 
    createdAt: new Date(Date.now() - 60000 * 10).toISOString(), 
    executedAt: new Date(Date.now() - 60000 * 9).toISOString(),
    requestedBy: 'dashboard'
  },
  { 
    id: 'cmd2', 
    commandName: 'downloadFile', 
    payload: { url: 'https://example.com/important_document.pdf', destination: '/docs' }, 
    status: 'in_progress', 
    createdAt: new Date(Date.now() - 60000 * 5).toISOString(),
    requestedBy: 'nova-local'
  },
  { 
    id: 'cmd3', 
    commandName: 'moveMouse', 
    payload: { x: 800, y: 600 }, 
    status: 'pending', 
    createdAt: new Date(Date.now() - 60000 * 2).toISOString(),
    requestedBy: 'dashboard'
  },
  { 
    id: 'cmd4', 
    commandName: 'optimizeSystem', 
    status: 'failed', 
    error: 'Permission denied for resource cleanup.',
    createdAt: new Date(Date.now() - 60000 * 15).toISOString(),
    executedAt: new Date(Date.now() - 60000 * 14).toISOString(),
    requestedBy: 'nova-local'
  },
  {
    id: 'cmd5',
    commandName: 'shutdown',
    status: 'queued',
    createdAt: new Date().toISOString(),
    requestedBy: 'dashboard'
  }
];

export const mockNovaSystemStatus: NovaSystemStatus = {
  aiStatus: 'online',
  lastSync: new Date().toISOString(),
  cpuUsage: 35.5,
  memoryUsage: 60.2,
  activeUser: 'Authorized User',
};

// Helper to simulate real-time updates
export function subscribeToMockData<T>(
  key: 'users' | 'logs' | 'commands' | 'status',
  callback: (data: T | T[]) => void,
  interval: number = 5000
): () => void {
  let data: any;
  switch (key) {
    case 'users':
      data = [...mockUserProfiles];
      break;
    case 'logs':
      data = [...mockSystemLogs];
      break;
    case 'commands':
      data = [...mockCommands];
      break;
    case 'status':
      data = {...mockNovaSystemStatus};
      break;
    default:
      data = [];
  }
  
  callback(JSON.parse(JSON.stringify(data))); // initial call with deep copy

  const timer = setInterval(() => {
    // Simulate some changes for logs and commands for demo purposes
    if (key === 'logs') {
      const newLog: SystemLog = {
        id: `log${Date.now()}`,
        timestamp: new Date().toISOString(),
        eventType: Math.random() > 0.5 ? 'cursorMove' : 'keypress',
        eventData: Math.random() > 0.5 ? { x: Math.floor(Math.random()*1000), y: Math.floor(Math.random()*800)} : { key: String.fromCharCode(97 + Math.floor(Math.random() * 26)) },
        details: Math.random() > 0.5 ? `Cursor moved.` : `Key pressed.`,
        icon: Math.random() > 0.5 ? MousePointerSquare : Keyboard,
      };
      (data as SystemLog[]).unshift(newLog);
      if ((data as SystemLog[]).length > 20) (data as SystemLog[]).pop();
    } else if (key === 'commands' && (data as Command[]).find(c => c.status === 'pending')) {
        const pendingCommand = (data as Command[]).find(c => c.status === 'pending');
        if (pendingCommand) {
            pendingCommand.status = 'in_progress';
        }
    } else if (key === 'status') {
        (data as NovaSystemStatus).lastSync = new Date().toISOString();
        (data as NovaSystemStatus).cpuUsage = parseFloat((Math.random() * 60 + 20).toFixed(1)); // 20-80%
        (data as NovaSystemStatus).memoryUsage = parseFloat((Math.random() * 50 + 30).toFixed(1)); // 30-80%
    }


    callback(JSON.parse(JSON.stringify(data))); // deep copy
  }, interval);

  return () => clearInterval(timer);
}
