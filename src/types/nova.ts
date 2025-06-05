import type { LucideIcon } from 'lucide-react';

export interface UserProfile {
  id: string;
  name: string;
  faceRecognitionStatus: 'active' | 'inactive' | 'unknown' | 'error' | 'pending';
  onlineStatus: 'online' | 'offline';
  lastSeen: string; // ISO string date
  avatarUrl?: string; // URL to user's avatar image
}

export interface SystemLog {
  id: string;
  timestamp: string; // ISO string date
  userId?: string;
  eventType: string; // e.g., "cursorMove", "keypress", "downloadStart", "appLaunch"
  eventData: Record<string, any> | string;
  icon?: LucideIcon;
  details?: string; // A more human-readable detail string
}

export interface Command {
  id: string;
  commandName: string;
  payload?: Record<string, any> | string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'queued';
  createdAt: string; // ISO string date
  executedAt?: string; // ISO string date
  requestedBy?: string; 
  error?: string; // Error message if failed
}

export interface NovaSystemStatus {
  aiStatus: 'online' | 'offline' | 'initializing' | 'error';
  lastSync: string; // ISO string date
  cpuUsage?: number; // Percentage
  memoryUsage?: number; // Percentage
  activeUser?: string; // Name of the currently detected user
}
