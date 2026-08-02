import React from 'react';
import { Sparkles, Menu, History, Github } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  return (
    <header className="w-full glass-panel sticky top-0 z-40 px-6 py-3.5 flex items-center justify-between border-b border-border">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition cursor-pointer"
          title="Toggle History Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-600/20 rounded-lg border border-indigo-500/30">
            <Sparkles className="w-5 h-5 text-indigo-400" />
          </div>
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-200 to-indigo-400 bg-clip-text text-transparent">
            VESPER
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            v1.0 Agentic
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="hidden sm:flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-white px-3 py-1.5 bg-border/50 hover:bg-border rounded-lg transition"
        >
          <History className="w-3.5 h-3.5" />
          <span>Past Sessions</span>
        </button>
        <a
          href="https://github.com/Prakhar00001/Vesper"
          target="_blank"
          rel="noreferrer"
          className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition"
          title="View GitHub Repository"
        >
          <Github className="w-5 h-5" />
        </a>
      </div>
    </header>
  );
};