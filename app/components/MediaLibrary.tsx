'use client';

import { useState } from 'react';
import { Upload, Image, Video, Music, Trash2, FolderOpen } from 'lucide-react';
import { MediaAsset } from '../types';

interface MediaLibraryProps {
  assets: MediaAsset[];
  onAssetsChange: (assets: MediaAsset[]) => void;
}

export default function MediaLibrary({ assets, onAssetsChange }: MediaLibraryProps) {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const newAssets: MediaAsset[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' :
            file.type.startsWith('video/') ? 'video' : 'audio',
      url: URL.createObjectURL(file),
      size: file.size,
    }));

    onAssetsChange([...assets, ...newAssets]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const newAssets: MediaAsset[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' :
            file.type.startsWith('video/') ? 'video' : 'audio',
      url: URL.createObjectURL(file),
      size: file.size,
    }));

    onAssetsChange([...assets, ...newAssets]);
  };

  const handleDelete = (id: string) => {
    onAssetsChange(assets.filter(a => a.id !== id));
  };

  const getIcon = (type: MediaAsset['type']) => {
    switch (type) {
      case 'image': return <Image className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'audio': return <Music className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex flex-col h-1/2">
      <div className="px-4 py-3 bg-white border-b border-primary-200">
        <h2 className="text-sm font-semibold text-primary-900 flex items-center gap-2">
          <FolderOpen className="w-4 h-4" aria-hidden="true" />
          Media Library
        </h2>
      </div>

      <div className="flex-1 p-4 overflow-y-auto scrollbar-thin">
        {/* Drop Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`mb-4 border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragOver
              ? 'border-primary-500 bg-primary-50'
              : 'border-primary-300 bg-white hover:border-primary-400'
          }`}
        >
          <Upload className="w-8 h-8 mx-auto mb-2 text-primary-400" aria-hidden="true" />
          <p className="text-xs text-primary-600 mb-2">
            Drag & drop files here or
          </p>
          <label className="inline-block">
            <input
              type="file"
              multiple
              accept="image/*,video/*,audio/*"
              onChange={handleFileInput}
              className="hidden"
              aria-label="Upload media files"
            />
            <span className="px-3 py-1.5 text-xs font-medium text-primary-700 bg-white border border-primary-300 rounded cursor-pointer hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 inline-block">
              Browse Files
            </span>
          </label>
        </div>

        {/* Assets List */}
        <div className="space-y-2">
          {assets.length === 0 ? (
            <p className="text-xs text-primary-500 text-center py-8">
              No media assets yet. Upload images, videos, or audio files to get started.
            </p>
          ) : (
            assets.map((asset) => (
              <div
                key={asset.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('asset-id', asset.id);
                  e.dataTransfer.effectAllowed = 'copy';
                }}
                className="flex items-center gap-3 p-2 bg-white border border-primary-200 rounded-lg hover:border-primary-400 cursor-move group transition-colors"
                role="listitem"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded flex items-center justify-center text-primary-600">
                  {getIcon(asset.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-primary-900 truncate">
                    {asset.name}
                  </p>
                  <p className="text-xs text-primary-500">
                    {asset.type} • {asset.size ? `${(asset.size / 1024).toFixed(1)} KB` : 'N/A'}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(asset.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-red-600 hover:bg-red-50 rounded transition-opacity focus:outline-none focus:ring-2 focus:ring-red-500"
                  aria-label={`Delete ${asset.name}`}
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
