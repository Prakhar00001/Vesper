export interface LogItem {
  agent: string;
  status: string;
  message: string;
  timestamp?: number;
}

export interface ResearchSession {
  id: string;
  topic: string;
  created_at?: string;
  report?: string;
}