'use client';

import { useState, useRef } from 'react';
import { Mic, Upload, Play, Pause, Trash2, Volume2 } from 'lucide-react';
import { VoiceoverTrack, Scene } from '../types';

interface VoiceoverPanelProps {
  voiceovers: VoiceoverTrack[];
  onVoiceoversChange: (voiceovers: VoiceoverTrack[]) => void;
  scenes: Scene[];
}

export default function VoiceoverPanel({ voiceovers, onVoiceoversChange, scenes }: VoiceoverPanelProps) {
  const [recording, setRecording] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRecord = () => {
    if (!recording) {
      setRecording(true);
      // Simulate recording
      setTimeout(() => {
        const newVoiceover: VoiceoverTrack = {
          id: Math.random().toString(36).substr(2, 9),
          name: `Recording ${voiceovers.length + 1}`,
          url: '#',
          duration: 10,
        };
        onVoiceoversChange([...voiceovers, newVoiceover]);
        setRecording(false);
      }, 3000);
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newVoiceovers: VoiceoverTrack[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      url: URL.createObjectURL(file),
      duration: 0,
    }));

    onVoiceoversChange([...voiceovers, ...newVoiceovers]);
  };

  const handleDelete = (id: string) => {
    onVoiceoversChange(voiceovers.filter(v => v.id !== id));
  };

  const assignToScene = (voiceoverId: string, sceneId: string) => {
    onVoiceoversChange(
      voiceovers.map(v =>
        v.id === voiceoverId ? { ...v, sceneId } : v
      )
    );
  };

  const togglePlay = (id: string) => {
    setPlayingId(playingId === id ? null : id);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 bg-white border-b border-primary-200">
        <h2 className="text-sm font-semibold text-primary-900 flex items-center gap-2">
          <Volume2 className="w-4 h-4" aria-hidden="true" />
          Voiceover & Audio
        </h2>
      </div>

      <div className="p-4">
        {/* Recording Controls */}
        <div className="space-y-2 mb-4">
          <button
            onClick={handleRecord}
            disabled={recording}
            className={`w-full px-4 py-2.5 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              recording
                ? 'bg-red-100 text-red-700'
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
            aria-label={recording ? 'Recording...' : 'Start recording'}
          >
            <Mic className={`w-4 h-4 ${recording ? 'animate-pulse' : ''}`} aria-hidden="true" />
            {recording ? 'Recording...' : 'Record Voiceover'}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            multiple
            onChange={handleUpload}
            className="hidden"
            aria-label="Upload audio files"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full px-4 py-2.5 text-sm font-medium text-primary-700 bg-white border border-primary-300 rounded-lg hover:bg-primary-50 flex items-center justify-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Upload audio files"
          >
            <Upload className="w-4 h-4" aria-hidden="true" />
            Upload Audio
          </button>
        </div>

        {/* Voiceover List */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-primary-700 uppercase tracking-wide">
            Audio Tracks ({voiceovers.length})
          </h3>

          {voiceovers.length === 0 ? (
            <p className="text-xs text-primary-500 text-center py-8">
              No audio tracks yet. Record or upload audio files.
            </p>
          ) : (
            voiceovers.map((voiceover) => (
              <div
                key={voiceover.id}
                className="bg-white border border-primary-200 rounded-lg p-3 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePlay(voiceover.id)}
                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-primary-100 text-primary-600 rounded-full hover:bg-primary-200 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                    aria-label={playingId === voiceover.id ? 'Pause' : 'Play'}
                  >
                    {playingId === voiceover.id ? (
                      <Pause className="w-4 h-4" aria-hidden="true" />
                    ) : (
                      <Play className="w-4 h-4 ml-0.5" aria-hidden="true" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-primary-900 truncate">
                      {voiceover.name}
                    </p>
                    {voiceover.duration > 0 && (
                      <p className="text-xs text-primary-500">
                        {voiceover.duration}s
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(voiceover.id)}
                    className="flex-shrink-0 p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                    aria-label={`Delete ${voiceover.name}`}
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>

                {/* Assign to Scene */}
                <div>
                  <label className="block text-xs font-medium text-primary-700 mb-1">
                    Assign to Scene
                  </label>
                  <select
                    value={voiceover.sceneId || ''}
                    onChange={(e) => assignToScene(voiceover.id, e.target.value)}
                    className="w-full px-2 py-1.5 text-xs border border-primary-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                    aria-label={`Assign ${voiceover.name} to scene`}
                  >
                    <option value="">None</option>
                    {scenes.map((scene) => (
                      <option key={scene.id} value={scene.id}>
                        {scene.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Waveform Placeholder */}
                {playingId === voiceover.id && (
                  <div className="h-12 bg-primary-50 rounded flex items-center justify-center gap-1 px-2">
                    {Array.from({ length: 40 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-primary-400 rounded-full animate-pulse"
                        style={{
                          height: `${Math.random() * 80 + 20}%`,
                          animationDelay: `${i * 50}ms`,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Timeline Preview */}
        {scenes.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xs font-semibold text-primary-700 uppercase tracking-wide mb-2">
              Timeline
            </h3>
            <div className="bg-white border border-primary-200 rounded-lg p-3 space-y-1">
              {scenes.map((scene, index) => {
                const voiceover = voiceovers.find(v => v.sceneId === scene.id);
                return (
                  <div
                    key={scene.id}
                    className="flex items-center gap-2 py-2 text-xs"
                  >
                    <div className="w-6 h-6 flex items-center justify-center bg-primary-100 text-primary-700 rounded font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="truncate text-primary-900 font-medium">
                        {scene.title}
                      </div>
                      {voiceover && (
                        <div className="truncate text-primary-600 text-xs">
                          <Volume2 className="w-3 h-3 inline mr-1" aria-hidden="true" />
                          {voiceover.name}
                        </div>
                      )}
                    </div>
                    <div className="text-primary-500">
                      {scene.duration}s
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
