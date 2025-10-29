'use client';

import { Film, Save, Download, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onExport: () => void;
}

export default function Header({ onExport }: HeaderProps) {
  return (
    <header className="bg-white border-b border-primary-200 px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <Film className="w-8 h-8 text-primary-600" aria-hidden="true" />
        <h1 className="text-2xl font-bold text-primary-900">Script Video Generator</h1>
      </div>

      <nav className="flex items-center gap-3">
        <button
          className="px-4 py-2 text-sm font-medium text-primary-700 bg-white border border-primary-300 rounded-lg hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
          aria-label="Save project"
          title="Save project"
        >
          <Save className="w-4 h-4 inline mr-2" aria-hidden="true" />
          Save
        </button>

        <button
          onClick={onExport}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
          aria-label="Export video"
        >
          <Download className="w-4 h-4 inline mr-2" aria-hidden="true" />
          Export Video
        </button>

        <button
          className="p-2 text-primary-600 hover:bg-primary-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
          aria-label="Help"
          title="Help"
        >
          <HelpCircle className="w-5 h-5" aria-hidden="true" />
        </button>
      </nav>
    </header>
  );
}
