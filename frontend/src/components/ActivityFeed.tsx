import React from 'react';
import { LogItem } from '../types';
import { Terminal } from 'lucide-react';

export const ActivityFeed: React.FC<{ logs: LogItem[] }> = ({ logs }) => {
  return (
    <div className="w-full bg-surface border border-border rounded-xl p-4 font-mono text-sm max-h-60 overflow-y-auto">
      <div className="flex items-center gap-2 mb-3 text-indigo-400 border-b border-border pb-2">
        <Terminal className="w-4 h-4" />
        <span className="font-semibold text-xs tracking-wider uppercase">Agent Execution Telemetry</span>
      </div>
      <div className="space-y-2">
        {logs.map((log, idx) => (
          <div key={idx} className="flex items-start gap-2 text-gray-300">
            <span className="text-indigo-400">[{log.agent}]</span>
            <span>{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};