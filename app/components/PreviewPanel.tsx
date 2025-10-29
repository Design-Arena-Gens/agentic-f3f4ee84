'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Maximize2 } from 'lucide-react';
import { Scene, VoiceoverTrack } from '../types';

interface PreviewPanelProps {
  scenes: Scene[];
  voiceovers: VoiceoverTrack[];
}

export default function PreviewPanel({ scenes, voiceovers }: PreviewPanelProps) {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const currentScene = scenes[currentSceneIndex];
  const totalDuration = scenes.reduce((sum, scene) => sum + scene.duration, 0);

  useEffect(() => {
    if (isPlaying && currentScene) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + (100 / currentScene.duration);
          if (newProgress >= 100) {
            if (currentSceneIndex < scenes.length - 1) {
              setCurrentSceneIndex((prev) => prev + 1);
              return 0;
            } else {
              setIsPlaying(false);
              return 100;
            }
          }
          return newProgress;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isPlaying, currentScene, currentSceneIndex, scenes.length]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    if (currentSceneIndex > 0) {
      setCurrentSceneIndex(currentSceneIndex - 1);
      setProgress(0);
    }
  };

  const handleNext = () => {
    if (currentSceneIndex < scenes.length - 1) {
      setCurrentSceneIndex(currentSceneIndex + 1);
      setProgress(0);
    }
  };

  const handleSceneClick = (index: number) => {
    setCurrentSceneIndex(index);
    setProgress(0);
    setIsPlaying(false);
  };

  return (
    <div className="h-full flex flex-col bg-primary-900">
      {scenes.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary-800 rounded-full flex items-center justify-center">
              <Play className="w-8 h-8 text-primary-400" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No scenes to preview</h3>
            <p className="text-sm text-primary-400">
              Add scenes to your storyboard to see a preview of your video
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Video Preview Area */}
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-4xl aspect-video bg-black rounded-lg shadow-2xl overflow-hidden relative">
              {/* Preview Content */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-800 to-primary-900">
                <div className="text-center p-8">
                  <div className="text-6xl font-bold text-white mb-4">
                    {currentSceneIndex + 1}
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-2">
                    {currentScene?.title}
                  </h3>
                  <p className="text-primary-300 max-w-lg">
                    {currentScene?.description || 'No description'}
                  </p>
                  <div className="mt-6 flex items-center justify-center gap-2 text-sm text-primary-400">
                    <span>Transition: {currentScene?.transition}</span>
                    <span>•</span>
                    <span>{currentScene?.duration}s</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-800">
                <div
                  className="h-full bg-primary-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Playback progress"
                />
              </div>

              {/* Fullscreen Button */}
              <button
                className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Fullscreen"
                title="Fullscreen"
              >
                <Maximize2 className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-primary-800 border-t border-primary-700 p-6">
            <div className="max-w-4xl mx-auto">
              {/* Playback Controls */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <button
                  onClick={handlePrevious}
                  disabled={currentSceneIndex === 0}
                  className="p-3 text-white bg-primary-700 rounded-full hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                  aria-label="Previous scene"
                >
                  <SkipBack className="w-5 h-5" aria-hidden="true" />
                </button>

                <button
                  onClick={handlePlayPause}
                  className="p-4 text-white bg-primary-600 rounded-full hover:bg-primary-500 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" aria-hidden="true" />
                  ) : (
                    <Play className="w-6 h-6 ml-0.5" aria-hidden="true" />
                  )}
                </button>

                <button
                  onClick={handleNext}
                  disabled={currentSceneIndex === scenes.length - 1}
                  className="p-3 text-white bg-primary-700 rounded-full hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                  aria-label="Next scene"
                >
                  <SkipForward className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>

              {/* Timeline Info */}
              <div className="text-center text-sm text-primary-300 mb-4">
                Scene {currentSceneIndex + 1} of {scenes.length} • Total Duration: {totalDuration}s
              </div>

              {/* Scene Thumbnails */}
              <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-2">
                {scenes.map((scene, index) => (
                  <button
                    key={scene.id}
                    onClick={() => handleSceneClick(index)}
                    className={`flex-shrink-0 w-32 h-20 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      index === currentSceneIndex
                        ? 'border-primary-500 bg-primary-700'
                        : 'border-primary-700 bg-primary-800 hover:border-primary-600'
                    }`}
                    aria-label={`Go to ${scene.title}`}
                  >
                    <div className="flex flex-col items-center justify-center h-full p-2">
                      <div className="text-lg font-bold text-white mb-1">
                        {index + 1}
                      </div>
                      <div className="text-xs text-primary-300 truncate w-full text-center">
                        {scene.title}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
