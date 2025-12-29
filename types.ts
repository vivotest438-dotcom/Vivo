
export enum AppTool {
  Visionary = 'VISIONARY',
  Architect = 'ARCHITECT',
  Oracle = 'ORACLE',
  Scribe = 'SCRIBE'
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  imageUrl?: string;
}

export interface Generation {
  id: string;
  type: AppTool;
  title: string;
  preview?: string;
  content: string;
  timestamp: number;
}
