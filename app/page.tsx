'use client';

import { useState } from 'react';
import Header from './components/Header';
import ScriptEditor from './components/ScriptEditor';
import MediaLibrary from './components/MediaLibrary';
import Storyboard from './components/Storyboard';
import VoiceoverPanel from './components/VoiceoverPanel';
import PreviewPanel from './components/PreviewPanel';
import ExportModal from './components/ExportModal';
import { Scene, MediaAsset, VoiceoverTrack } from './types';

export default function Home() {
  const [script, setScript] = useState('');
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [voiceovers, setVoiceovers] = useState<VoiceoverTrack[]>([]);
  const [activeTab, setActiveTab] = useState<'storyboard' | 'preview'>('storyboard');
  const [showExportModal, setShowExportModal] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header onExport={() => setShowExportModal(true)} />

      <main className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Script Editor & Media */}
        <aside className="w-80 border-r border-primary-200 bg-primary-50 flex flex-col">
          <ScriptEditor script={script} onChange={setScript} />
          <MediaLibrary assets={mediaAssets} onAssetsChange={setMediaAssets} />
        </aside>

        {/* Main Content - Storyboard or Preview */}
        <section className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-primary-200 bg-white">
            <nav className="flex px-6" role="tablist" aria-label="Video editing sections">
              <button
                role="tab"
                aria-selected={activeTab === 'storyboard'}
                aria-controls="storyboard-panel"
                className={`px-6 py-4 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset ${
                  activeTab === 'storyboard'
                    ? 'text-primary-900 border-b-2 border-primary-600'
                    : 'text-primary-500 hover:text-primary-700'
                }`}
                onClick={() => setActiveTab('storyboard')}
              >
                Storyboard
              </button>
              <button
                role="tab"
                aria-selected={activeTab === 'preview'}
                aria-controls="preview-panel"
                className={`px-6 py-4 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset ${
                  activeTab === 'preview'
                    ? 'text-primary-900 border-b-2 border-primary-600'
                    : 'text-primary-500 hover:text-primary-700'
                }`}
                onClick={() => setActiveTab('preview')}
              >
                Preview & Export
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'storyboard' && (
              <div id="storyboard-panel" role="tabpanel" className="h-full">
                <Storyboard
                  scenes={scenes}
                  onScenesChange={setScenes}
                  mediaAssets={mediaAssets}
                />
              </div>
            )}
            {activeTab === 'preview' && (
              <div id="preview-panel" role="tabpanel" className="h-full">
                <PreviewPanel scenes={scenes} voiceovers={voiceovers} />
              </div>
            )}
          </div>
        </section>

        {/* Right Sidebar - Voiceover & Timeline */}
        <aside className="w-80 border-l border-primary-200 bg-primary-50 overflow-y-auto scrollbar-thin">
          <VoiceoverPanel
            voiceovers={voiceovers}
            onVoiceoversChange={setVoiceovers}
            scenes={scenes}
          />
        </aside>
      </main>

      {showExportModal && (
        <ExportModal
          scenes={scenes}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
}
