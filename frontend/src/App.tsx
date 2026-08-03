import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useResearchSocket } from './hooks/useResearchSocket';
import { ProgressTracker } from './components/ProgressTracker';
import { ActivityFeed } from './components/ActivityFeed';
import { ReportViewer } from './components/ReportViewer';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ResearchSession } from './types';
import { Search, ArrowRight, Zap, X } from 'lucide-react';

export function App(): React.JSX.Element {
  const [topic, setTopic] = useState<string>('');
  const [provider, setProvider] = useState<string>('google');
  const [model, setModel] = useState<string>('gemini-1.5-pro');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [selectedSessionReport, setSelectedSessionReport] = useState<string | null>(null);
  const [selectedSessionTopic, setSelectedSessionTopic] = useState<string | null>(null);

  const { logs, currentNode, report, sources, isCriticLoop, startResearch, cancelResearch } = useResearchSocket();

  const handleStart = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setSelectedSessionReport(null);
    setSelectedSessionTopic(null);
    startResearch(topic, provider, model);
  };

  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setProvider(selected);
    if (selected === 'google') setModel('gemini-1.5-pro');
    else if (selected === 'groq') setModel('llama-3.3-70b-versatile');
    else setModel('gpt-4o');
  };

  const handleSelectSession = (session: ResearchSession) => {
    if (session.report) {
      setSelectedSessionReport(session.report);
      setSelectedSessionTopic(session.topic);
    }
  };

  const displayReport = selectedSessionReport || report;
  const displayTopic = selectedSessionTopic || topic;

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 flex flex-col font-sans antialiased selection:bg-indigo-500/30">
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSelectSession={handleSelectSession}
        onNewResearch={() => {
          setSelectedSessionReport(null);
          setSelectedSessionTopic(null);
          setTopic('');
        }}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-12 flex flex-col items-center">
        {!currentNode && !displayReport && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="text-center my-8 space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" /> LangGraph Multi-Agent Architecture
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Autonomous Deep Research <br />
              <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Engineered for Precision.
              </span>
            </h1>
            <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
              Synthesizing 5–10 page executive briefings with inline Tavily source citations and iterative Critic feedback verification.
            </p>
          </motion.div>
        )}

        {/* Hero Interactive Prompt Bar */}
        <motion.div layout className="w-full max-w-2xl">
          <form
            onSubmit={handleStart}
            className="animated-gradient-border p-2 rounded-2xl flex items-center gap-3 shadow-2xl"
          >
            <div className="flex-1 flex items-center gap-3 px-3">
              <Search className="w-5 h-5 text-indigo-400 shrink-0" />
              <input
                type="text"
                placeholder="Enter any research topic (e.g., Quantum error correction)..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-transparent text-white focus:outline-none placeholder-gray-500 text-sm font-medium"
              />
            </div>

            <select
              value={provider}
              onChange={handleProviderChange}
              className="bg-[#111827] border border-white/10 text-gray-300 text-xs font-medium rounded-xl px-3 py-2.5 focus:outline-none cursor-pointer"
            >
              <option value="google">Gemini 1.5 Pro</option>
              <option value="groq">Groq (Llama 3.3)</option>
              <option value="openai">OpenAI (GPT-4o)</option>
            </select>

            {currentNode ? (
              <button
                type="button"
                onClick={cancelResearch}
                className="bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 font-semibold text-sm px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                <X className="w-4 h-4" /> Stop
              </button>
            ) : (
              <button
                type="submit"
                className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/30"
              >
                <span>Begin</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </form>
        </motion.div>

        {/* Dynamic Multi-Agent Workflow Tracker */}
        {currentNode && (
          <ProgressTracker currentNode={currentNode} isCriticLoop={isCriticLoop} sourceCount={sources.length} />
        )}

        {/* Telemetry Log Feed */}
        {logs.length > 0 && !displayReport && (
          <div className="w-full max-w-4xl my-6">
            <ActivityFeed logs={logs} />
          </div>
        )}

        {/* Rendered Markdown Report */}
        {displayReport && <ReportViewer report={displayReport} topic={displayTopic} />}
      </main>
    </div>
  );
}

export default App;