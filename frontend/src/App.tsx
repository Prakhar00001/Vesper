import React, { useState } from 'react';
import { useResearchSocket } from './hooks/useResearchSocket';
import { ProgressTracker } from './components/ProgressTracker';
import { ActivityFeed } from './components/ActivityFeed';
import { ReportViewer } from './components/ReportViewer';
import { Sparkles, Search } from 'lucide-react';

export function App(): React.JSX.Element {
  const [topic, setTopic] = useState<string>('');
  const [provider, setProvider] = useState<string>('openai');
  const [model, setModel] = useState<string>('gpt-4o');
  const { logs, currentNode, report, startResearch } = useResearchSocket();

  const handleStart = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!topic.trim()) return;
    startResearch(topic, provider, model);
  };

  const handleTopicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTopic(e.target.value);
  };

  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProvider = e.target.value;
    setProvider(selectedProvider);
    if (selectedProvider === 'google') setModel('gemini-1.5-pro');
    else if (selectedProvider === 'groq') setModel('llama-3.3-70b-versatile');
    else setModel('gpt-4o');
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

      <form
        onSubmit={handleStart}
        className="w-full max-w-2xl bg-surface border border-border p-3 rounded-2xl flex gap-3 shadow-2xl"
      >
        <div className="flex-1 flex items-center gap-2 px-3">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Enter any complex research topic..."
            value={topic}
            onChange={handleTopicChange}
            className="w-full bg-transparent text-white focus:outline-none placeholder-gray-500 text-sm"
          />
        </div>

        <select
          value={provider}
          onChange={handleProviderChange}
          className="bg-border text-gray-300 text-xs rounded-xl px-2 focus:outline-none cursor-pointer"
        >
          <option value="openai">OpenAI (GPT-4o)</option>
          <option value="google">Gemini 1.5 Pro</option>
          <option value="groq">Groq (Llama 3.3)</option>
        </select>

        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm px-5 py-2.5 rounded-xl transition cursor-pointer"
        >
          Research
        </button>
      </form>

      {currentNode && <ProgressTracker currentNode={currentNode} />}
      {logs.length > 0 && (
        <div className="w-full max-w-2xl my-4">
          <ActivityFeed logs={logs} />
        </div>
      )}
      {report && <ReportViewer report={report} topic={topic} />}
    </div>
  );
}

export default App;