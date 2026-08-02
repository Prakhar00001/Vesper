import React from 'react';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

const STEPS = [
  { id: 'planner', name: 'Planning' },
  { id: 'researcher', name: 'Deep Search' },
  { id: 'critic', name: 'Fact Audit' },
  { id: 'writer', name: 'Synthesizing' },
];

export const ProgressTracker: React.FC<{ currentNode: string }> = ({ currentNode }) => {
  const activeIdx = STEPS.findIndex((s) => s.id === currentNode);

  return (
    <div className="flex items-center justify-between w-full max-w-2xl mx-auto my-8 p-4 bg-surface border border-border rounded-xl">
      {STEPS.map((step, idx) => {
        const isCompleted = activeIdx > idx;
        const isCurrent = activeIdx === idx;

        return (
          <div key={step.id} className="flex items-center gap-2">
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : isCurrent ? (
              <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
            ) : (
              <Circle className="w-5 h-5 text-gray-600" />
            )}
            <span className={`text-sm ${isCurrent ? 'text-white font-semibold' : 'text-gray-400'}`}>
              {step.name}
            </span>
          </div>
        );
      })}
    </div>
  );
};