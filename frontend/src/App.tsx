import React, { useState } from 'react';
import { useResearchSocket } from './hooks/useResearchSocket';
import { ProgressTracker } from './components/ProgressTracker';
import { ActivityFeed } from './components/ActivityFeed';
import { ReportViewer } from './components/ReportViewer';
import { Sparkles, Search } from 'lucide-react';

export function App() {
  const [topic, setTopic] = useState('');
  const [provider, setProvider] = useState('openai');
  const [model, setModel] = useState('gpt-4o');
  const { logs, currentNode, report, isDone, startResearch } = useResearchSocket();

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    startResearch(topic, provider, model);
  };

  return (
    <div className="min-h-screen bg-background text-gray-100 p-6 flex flex-col items-center">
      <header className="text-center my-10">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-8 h-8 text-indigo-500" />
          <h1 className="text-4xl font-extrabold text-white tracking-tight">VESPER</h1>
        </div>
        <p className="text-gray-400 text-sm max-w-md">
          Autonomous Multi-Agent Deep Research Engine powered by LangGraph.
        </p>
      </header>

      <form onSubmit={handleStart} className="w-full max-w-2xl bg-surface border border-border p-3 rounded-2xl flex gap-3 shadow-2xl">
        <div className="flex-1 flex items-center gap-2 px-3">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Enter any complex research topic..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full bg-transparent text-white focus:outline-none placeholder-gray-500 text-sm"
          />
        </div>

        <select
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          className="bg-border text-gray-300 text-xs rounded-xl px-2 focus:outline-none"
        >
          <option value="openai">OpenAI</option>
          <option value="google">Gemini</option>
          <option value="groq">Groq</option>
        </select>

        <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm px-5 py-2.5 rounded-xl transition">
          Research
        </button>
      </form>

      {currentNode && <ProgressTracker currentNode={currentNode} />}
      {logs.length > 0 && <div className="w-full max-w-2xl my-4"><ActivityFeed logs={logs} /></div>}
      {report && <ReportViewer report={report} topic={topic} />}
    </div>
  );
}

export default App;