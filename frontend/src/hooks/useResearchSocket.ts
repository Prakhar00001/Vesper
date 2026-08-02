import { useState, useCallback } from 'react';
import { LogItem } from '../types';

export const useResearchSocket = () => {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [currentNode, setCurrentNode] = useState<string>('');
  const [report, setReport] = useState<string>('');
  const [isDone, setIsDone] = useState<boolean>(false);

  const startResearch = useCallback((topic: string, provider: string, model: string) => {
    setLogs([]);
    setReport('');
    setIsDone(false);

    const ws = new WebSocket(`ws://localhost:8000/ws/live-${Date.now()}`);

    ws.onopen = () => {
      ws.send(JSON.stringify({ topic, provider, model_name: model }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'progress') {
        setCurrentNode(data.node);
        if (data.logs) setLogs(data.logs);
      } else if (data.type === 'complete') {
        setReport(data.final_report);
        setIsDone(true);
        ws.close();
      }
    };

    ws.onerror = (err) => console.error('WebSocket Error:', err);
  }, []);

  return { logs, currentNode, report, isDone, startResearch };
};