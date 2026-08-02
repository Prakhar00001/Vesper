import React, { useEffect, useState } from 'react';
import { ResearchSession } from '../types';
import { X, Clock, FileText, Plus } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSession: (session: ResearchSession) => void;
  onNewResearch: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  onSelectSession,
  onNewResearch,
}) => {
  const [history, setHistory] = useState<ResearchSession[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetch('http://localhost:8000/api/history')
        .then((res) => res.json())
        .then((data) => setHistory(data))
        .catch((err) => console.error('Failed to load history:', err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Sidebar Drawer */}
      <div className="relative w-80 max-w-full bg-[#0D1322] border-r border-border h-full p-4 flex flex-col z-10 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
          <div className="flex items-center gap-2 text-white font-semibold">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>Research History</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={() => {
            onNewResearch();
            onClose();
          }}
          className="w-full mb-4 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Research Topic</span>
        </button>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {history.length === 0 ? (
            <p className="text-xs text-gray-500 text-center py-8">No prior research sessions found.</p>
          ) : (
            history.map((session) => (
              <button
                key={session.id}
                onClick={() => {
                  onSelectSession(session);
                  onClose();
                }}
                className="w-full text-left p-3 rounded-xl bg-surface/50 hover:bg-surface border border-border/50 hover:border-indigo-500/30 transition group flex items-start gap-2.5"
              >
                <FileText className="w-4 h-4 text-gray-400 group-hover:text-indigo-400 shrink-0 mt-0.5" />
                <div className="overflow-hidden">
                  <p className="text-xs text-gray-200 font-medium truncate group-hover:text-white">
                    {session.topic}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-1">
                    {session.created_at ? new Date(session.created_at).toLocaleDateString() : 'Recent'}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};