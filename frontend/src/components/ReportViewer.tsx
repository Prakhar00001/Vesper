import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Download, Copy, Share2 } from 'lucide-react';

export const ReportViewer: React.FC<{ report: string; topic: string }> = ({ report, topic }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(report);
    alert('Report markdown copied to clipboard!');
  };

  const handleDownloadPDF = () => {
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
    <div className="w-full max-w-4xl mx-auto bg-surface border border-border rounded-xl p-8 my-8 text-gray-100">
      <div className="flex justify-between items-center pb-6 border-b border-border mb-6">
        <h1 className="text-2xl font-bold text-white">{topic}</h1>
        <div className="flex gap-3">
          <button onClick={handleCopy} className="p-2 bg-border hover:bg-gray-700 rounded-lg text-gray-300 transition">
            <Copy className="w-4 h-4" />
          </button>
          <button onClick={handleDownloadPDF} className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition flex items-center gap-2 text-sm font-medium">
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      <div id="report-content" className="prose prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{report}</ReactMarkdown>
      </div>
    </div>
  );
};