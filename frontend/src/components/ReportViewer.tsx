import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { motion } from 'framer-motion';
import { Download, Copy, BookOpen, Check } from 'lucide-react';

interface ReportViewerProps {
  report: string;
  topic: string;
}

export const ReportViewer: React.FC<ReportViewerProps> = ({ report, topic }) => {
  const [copied, setCopied] = useState(false);
  const [headings, setHeadings] = useState<{ id: string; text: string }[]>([]);

  useEffect(() => {
    // Extract TOC headings dynamically from report content
    const matches = report.match(/^##\s+(.+)$/gm);
    if (matches) {
      const parsed = matches.map((m) => {
        const text = m.replace(/^##\s+/, '');
        return { id: text.toLowerCase().replace(/[^\w]+/g, '-'), text };
      });
      setHeadings(parsed);
    }
  }, [report]);

  const handleCopy = () => {
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportPDF = () => {
    // @ts-ignore
    if (window.html2pdf) {
      const element = document.getElementById('report-content');
      // @ts-ignore
      window.html2pdf().from(element).save(`${topic.replace(/\s+/g, '_')}_Research.pdf`);
    } else {
      window.print();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="w-full max-w-6xl mx-auto my-8 grid grid-cols-1 lg:grid-cols-4 gap-8"
    >
      {/* Sticky Table of Contents */}
      <div className="hidden lg:block lg:col-span-1">
        <div className="sticky top-24 glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
            <BookOpen className="w-4 h-4" /> Table of Contents
          </div>
          <nav className="space-y-1">
            {headings.map((h) => (
              <a
                key={h.id}
                href={`#${h.id}`}
                className="block text-xs text-gray-400 hover:text-white hover:bg-white/5 px-2 py-1.5 rounded-lg transition truncate"
              >
                {h.text}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Markdown Reader View */}
      <div className="lg:col-span-3 glass-panel p-8 sm:p-12 rounded-3xl border border-white/10 relative">
        {/* Floating Action Bar */}
        <div className="flex justify-between items-center pb-6 border-b border-white/10 mb-8">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-semibold">
              Comprehensive Research Briefing
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">{topic}</h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-2.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl transition border border-white/10"
              title="Copy Markdown"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={handleExportPDF}
              className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-medium text-xs rounded-xl transition shadow-lg shadow-indigo-500/20 flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Export PDF
            </button>
          </div>
        </div>

        {/* Rendered Markdown Body */}
        <div id="report-content" className="prose prose-invert max-w-none text-gray-200 leading-relaxed">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              h2: ({ children }) => {
                const id = String(children).toLowerCase().replace(/[^\w]+/g, '-');
                return (
                  <h2 id={id} className="text-xl font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">
                    {children}
                  </h2>
                );
              },
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 decoration-cyan-500/40"
                >
                  {children}
                </a>
              ),
            }}
          >
            {report}
          </ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
};