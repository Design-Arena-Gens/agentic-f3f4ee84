'use client';

import { useState } from 'react';
import { Sparkles, Type, Copy } from 'lucide-react';

interface ScriptEditorProps {
  script: string;
  onChange: (script: string) => void;
}

export default function ScriptEditor({ script, onChange }: ScriptEditorProps) {
  const [isAIAssisting, setIsAIAssisting] = useState(false);

  const handleAIAssist = () => {
    setIsAIAssisting(true);
    setTimeout(() => {
      const suggestions = [
        '\n\n[SCENE 1]\nOpening shot of a sunrise over a modern city skyline.\n\n',
        '[SCENE 2]\nClose-up of hands typing on a laptop keyboard.\n\n',
        '[SCENE 3]\nWide shot of a collaborative workspace with team members discussing ideas.'
      ];
      onChange(script + suggestions.join(''));
      setIsAIAssisting(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-1/2 border-b border-primary-200">
      <div className="px-4 py-3 bg-white border-b border-primary-200 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-primary-900 flex items-center gap-2">
          <Type className="w-4 h-4" aria-hidden="true" />
          Script Editor
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleAIAssist}
            disabled={isAIAssisting}
            className="p-1.5 text-primary-600 hover:bg-primary-100 rounded disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="AI scriptwriting assistance"
            title="AI Assist"
          >
            <Sparkles className={`w-4 h-4 ${isAIAssisting ? 'animate-pulse' : ''}`} aria-hidden="true" />
          </button>
          <button
            className="p-1.5 text-primary-600 hover:bg-primary-100 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Copy script to clipboard"
            title="Copy Script"
          >
            <Copy className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-hidden">
        <textarea
          value={script}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Start writing your script here... Use [SCENE X] to mark different scenes.

Example:
[SCENE 1]
Opening shot of product showcase
Duration: 5 seconds

[SCENE 2]
Close-up of key features
Duration: 8 seconds"
          className="w-full h-full p-3 text-sm text-primary-900 bg-white border border-primary-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent scrollbar-thin"
          aria-label="Script content"
        />
      </div>

      {isAIAssisting && (
        <div className="px-4 py-2 bg-primary-100 border-t border-primary-200">
          <div className="flex items-center gap-2 text-xs text-primary-700">
            <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse" />
            AI is generating suggestions...
          </div>
        </div>
      )}
    </div>
  );
}
