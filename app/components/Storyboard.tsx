'use client';

import { useState, useEffect } from 'react';
import { Plus, GripVertical, Trash2, Clock, Zap } from 'lucide-react';
import { Scene, MediaAsset, TransitionType } from '../types';

interface StoryboardProps {
  scenes: Scene[];
  onScenesChange: (scenes: Scene[]) => void;
  mediaAssets: MediaAsset[];
}

const transitions: { value: TransitionType; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'fade', label: 'Fade' },
  { value: 'slide', label: 'Slide' },
  { value: 'zoom', label: 'Zoom' },
  { value: 'dissolve', label: 'Dissolve' },
  { value: 'wipe', label: 'Wipe' },
];

export default function Storyboard({ scenes, onScenesChange, mediaAssets }: StoryboardProps) {
  const [draggedScene, setDraggedScene] = useState<string | null>(null);
  const [dragOverScene, setDragOverScene] = useState<string | null>(null);

  const addScene = () => {
    const newScene: Scene = {
      id: Math.random().toString(36).substr(2, 9),
      title: `Scene ${scenes.length + 1}`,
      description: '',
      duration: 5,
      mediaAssets: [],
      transition: 'fade',
      order: scenes.length,
    };
    onScenesChange([...scenes, newScene]);
  };

  const deleteScene = (id: string) => {
    onScenesChange(scenes.filter(s => s.id !== id).map((s, i) => ({ ...s, order: i })));
  };

  const updateScene = (id: string, updates: Partial<Scene>) => {
    onScenesChange(scenes.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const handleSceneDragStart = (e: React.DragEvent, sceneId: string) => {
    setDraggedScene(sceneId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleSceneDragOver = (e: React.DragEvent, sceneId: string) => {
    e.preventDefault();
    setDragOverScene(sceneId);
  };

  const handleSceneDrop = (e: React.DragEvent, targetSceneId: string) => {
    e.preventDefault();

    if (draggedScene && draggedScene !== targetSceneId) {
      const draggedIndex = scenes.findIndex(s => s.id === draggedScene);
      const targetIndex = scenes.findIndex(s => s.id === targetSceneId);

      const newScenes = [...scenes];
      const [removed] = newScenes.splice(draggedIndex, 1);
      newScenes.splice(targetIndex, 0, removed);

      onScenesChange(newScenes.map((s, i) => ({ ...s, order: i })));
    }

    setDraggedScene(null);
    setDragOverScene(null);
  };

  const handleAssetDrop = (e: React.DragEvent, sceneId: string) => {
    e.preventDefault();
    e.stopPropagation();

    const assetId = e.dataTransfer.getData('asset-id');
    if (assetId) {
      const scene = scenes.find(s => s.id === sceneId);
      if (scene && !scene.mediaAssets.includes(assetId)) {
        updateScene(sceneId, {
          mediaAssets: [...scene.mediaAssets, assetId]
        });
      }
    }
  };

  const removeAssetFromScene = (sceneId: string, assetId: string) => {
    const scene = scenes.find(s => s.id === sceneId);
    if (scene) {
      updateScene(sceneId, {
        mediaAssets: scene.mediaAssets.filter(id => id !== assetId)
      });
    }
  };

  return (
    <div className="h-full flex flex-col bg-primary-50">
      <div className="px-6 py-4 bg-white border-b border-primary-200 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-primary-900">Storyboard</h2>
          <p className="text-xs text-primary-600 mt-1">
            Drag and drop media assets onto scenes, reorder scenes by dragging
          </p>
        </div>
        <button
          onClick={addScene}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors flex items-center gap-2"
          aria-label="Add new scene"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          Add Scene
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
        {scenes.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary-200 rounded-full flex items-center justify-center">
                <Plus className="w-8 h-8 text-primary-600" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-medium text-primary-900 mb-2">No scenes yet</h3>
              <p className="text-sm text-primary-600 mb-4">
                Create your first scene to start building your video
              </p>
              <button
                onClick={addScene}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
              >
                Create First Scene
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4" role="list" aria-label="Video scenes">
            {scenes.map((scene) => (
              <div
                key={scene.id}
                draggable
                onDragStart={(e) => handleSceneDragStart(e, scene.id)}
                onDragOver={(e) => handleSceneDragOver(e, scene.id)}
                onDrop={(e) => handleSceneDrop(e, scene.id)}
                className={`bg-white border-2 rounded-lg transition-all ${
                  dragOverScene === scene.id
                    ? 'border-primary-500 shadow-lg'
                    : 'border-primary-200 shadow-sm'
                } ${draggedScene === scene.id ? 'opacity-50' : ''}`}
                role="listitem"
              >
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <button
                      className="mt-1 cursor-move p-1 text-primary-400 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
                      aria-label="Drag to reorder scene"
                    >
                      <GripVertical className="w-5 h-5" aria-hidden="true" />
                    </button>

                    <div className="flex-1">
                      <input
                        type="text"
                        value={scene.title}
                        onChange={(e) => updateScene(scene.id, { title: e.target.value })}
                        className="w-full text-base font-semibold text-primary-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-2 py-1 -ml-2"
                        aria-label="Scene title"
                      />
                      <textarea
                        value={scene.description}
                        onChange={(e) => updateScene(scene.id, { description: e.target.value })}
                        placeholder="Add scene description..."
                        className="w-full mt-2 text-sm text-primary-700 bg-primary-50 border border-primary-200 rounded p-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                        rows={2}
                        aria-label="Scene description"
                      />

                      {/* Media Assets */}
                      <div
                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        onDrop={(e) => handleAssetDrop(e, scene.id)}
                        className="mt-3 min-h-20 border-2 border-dashed border-primary-300 rounded-lg p-3 bg-primary-50/50"
                      >
                        {scene.mediaAssets.length === 0 ? (
                          <p className="text-xs text-primary-500 text-center py-2">
                            Drop media assets here
                          </p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {scene.mediaAssets.map(assetId => {
                              const asset = mediaAssets.find(a => a.id === assetId);
                              if (!asset) return null;
                              return (
                                <div
                                  key={assetId}
                                  className="relative group bg-white border border-primary-200 rounded px-3 py-1.5 text-xs font-medium text-primary-700 flex items-center gap-2"
                                >
                                  {asset.name}
                                  <button
                                    onClick={() => removeAssetFromScene(scene.id, assetId)}
                                    className="opacity-0 group-hover:opacity-100 ml-1 text-red-600 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded transition-opacity"
                                    aria-label={`Remove ${asset.name}`}
                                  >
                                    ×
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Duration and Transition */}
                      <div className="mt-3 flex gap-3">
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-primary-700 mb-1">
                            <Clock className="w-3 h-3 inline mr-1" aria-hidden="true" />
                            Duration (seconds)
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="60"
                            value={scene.duration}
                            onChange={(e) => updateScene(scene.id, { duration: parseInt(e.target.value) || 5 })}
                            className="w-full px-3 py-1.5 text-sm border border-primary-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                            aria-label="Scene duration in seconds"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-primary-700 mb-1">
                            <Zap className="w-3 h-3 inline mr-1" aria-hidden="true" />
                            Transition
                          </label>
                          <select
                            value={scene.transition}
                            onChange={(e) => updateScene(scene.id, { transition: e.target.value as TransitionType })}
                            className="w-full px-3 py-1.5 text-sm border border-primary-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                            aria-label="Scene transition effect"
                          >
                            {transitions.map(t => (
                              <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteScene(scene.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                      aria-label="Delete scene"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
