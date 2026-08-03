export interface LogItem {
  agent: string;
  status: 'thinking' | 'completed' | 'error' | 're-research';
  message: string;
  timestamp?: number;
}

export interface SourceItem {
  title: string;
  url: string;
  snippet: string;
  sub_question: string;
}

export interface ResearchSession {
  id: string;
  topic: string;
  created_at?: string;
  report?: string;
  sources?: SourceItem[];
}