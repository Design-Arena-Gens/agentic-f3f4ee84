'use client';

import { useState } from 'react';
import { X, Download, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Scene, ExportSettings } from '../types';

interface ExportModalProps {
  scenes: Scene[];
  onClose: () => void;
}

export default function ExportModal({ scenes, onClose }: ExportModalProps) {
  const [settings, setSettings] = useState<ExportSettings>({
    resolution: '1080p',
    format: 'mp4',
    quality: 'high',
    includeBranding: false,
  });

  const [showWatermark, setShowWatermark] = useState(false);
  const [watermarkText, setWatermarkText] = useState('');
  const [watermarkPosition, setWatermarkPosition] = useState<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'>('bottom-right');

  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportComplete, setExportComplete] = useState(false);
  const [exportError, setExportError] = useState(false);

  const totalDuration = scenes.reduce((sum, scene) => sum + scene.duration, 0);

  const handleExport = () => {
    if (scenes.length === 0) {
      setExportError(true);
      return;
    }

    setExporting(true);
    setExportProgress(0);

    const interval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setExporting(false);
          setExportComplete(true);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const updateSettings = (updates: Partial<ExportSettings>) => {
    setSettings({ ...settings, ...updates });
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-labelledby="export-modal-title"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-thin">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-primary-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 id="export-modal-title" className="text-xl font-bold text-primary-900">
            Export Video
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Close export modal"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Video Info */}
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-primary-900 mb-2">Video Information</h3>
            <div className="text-sm text-primary-700 space-y-1">
              <p>Total Scenes: <span className="font-medium">{scenes.length}</span></p>
              <p>Total Duration: <span className="font-medium">{totalDuration} seconds</span></p>
            </div>
          </div>

          {/* Resolution */}
          <div>
            <label className="block text-sm font-semibold text-primary-900 mb-2">
              Resolution
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['720p', '1080p', '4k'] as const).map((res) => (
                <button
                  key={res}
                  onClick={() => updateSettings({ resolution: res })}
                  className={`px-4 py-3 text-sm font-medium rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    settings.resolution === res
                      ? 'border-primary-600 bg-primary-50 text-primary-900'
                      : 'border-primary-200 bg-white text-primary-700 hover:border-primary-400'
                  }`}
                  aria-pressed={settings.resolution === res}
                >
                  {res.toUpperCase()}
                  <div className="text-xs text-primary-500 mt-1">
                    {res === '720p' && '1280×720'}
                    {res === '1080p' && '1920×1080'}
                    {res === '4k' && '3840×2160'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Format */}
          <div>
            <label className="block text-sm font-semibold text-primary-900 mb-2">
              Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['mp4', 'mov'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => updateSettings({ format: fmt })}
                  className={`px-4 py-3 text-sm font-medium rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    settings.format === fmt
                      ? 'border-primary-600 bg-primary-50 text-primary-900'
                      : 'border-primary-200 bg-white text-primary-700 hover:border-primary-400'
                  }`}
                  aria-pressed={settings.format === fmt}
                >
                  {fmt.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Quality */}
          <div>
            <label className="block text-sm font-semibold text-primary-900 mb-2">
              Quality
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['low', 'medium', 'high'] as const).map((qual) => (
                <button
                  key={qual}
                  onClick={() => updateSettings({ quality: qual })}
                  className={`px-4 py-3 text-sm font-medium rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    settings.quality === qual
                      ? 'border-primary-600 bg-primary-50 text-primary-900'
                      : 'border-primary-200 bg-white text-primary-700 hover:border-primary-400'
                  }`}
                  aria-pressed={settings.quality === qual}
                >
                  {qual.charAt(0).toUpperCase() + qual.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Branding */}
          <div className="flex items-center gap-3 p-4 bg-primary-50 border border-primary-200 rounded-lg">
            <input
              type="checkbox"
              id="include-branding"
              checked={settings.includeBranding}
              onChange={(e) => updateSettings({ includeBranding: e.target.checked })}
              className="w-4 h-4 text-primary-600 border-primary-300 rounded focus:ring-2 focus:ring-primary-500"
            />
            <label htmlFor="include-branding" className="text-sm font-medium text-primary-900 cursor-pointer">
              Include branding/logo in video
            </label>
          </div>

          {/* Watermark */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <input
                type="checkbox"
                id="include-watermark"
                checked={showWatermark}
                onChange={(e) => setShowWatermark(e.target.checked)}
                className="w-4 h-4 text-primary-600 border-primary-300 rounded focus:ring-2 focus:ring-primary-500"
              />
              <label htmlFor="include-watermark" className="text-sm font-semibold text-primary-900 cursor-pointer">
                Add watermark
              </label>
            </div>

            {showWatermark && (
              <div className="space-y-3 pl-7">
                <div>
                  <label htmlFor="watermark-text" className="block text-sm font-medium text-primary-700 mb-1">
                    Watermark Text
                  </label>
                  <input
                    id="watermark-text"
                    type="text"
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    placeholder="© Your Company Name"
                    className="w-full px-3 py-2 text-sm border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="watermark-position" className="block text-sm font-medium text-primary-700 mb-1">
                    Position
                  </label>
                  <select
                    id="watermark-position"
                    value={watermarkPosition}
                    onChange={(e) => setWatermarkPosition(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="top-left">Top Left</option>
                    <option value="top-right">Top Right</option>
                    <option value="bottom-left">Bottom Left</option>
                    <option value="bottom-right">Bottom Right</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Export Progress */}
          {exporting && (
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Loader2 className="w-5 h-5 text-primary-600 animate-spin" aria-hidden="true" />
                <span className="text-sm font-medium text-primary-900">
                  Exporting video... {exportProgress}%
                </span>
              </div>
              <div className="w-full bg-primary-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary-600 h-full transition-all duration-300"
                  style={{ width: `${exportProgress}%` }}
                  role="progressbar"
                  aria-valuenow={exportProgress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Export progress"
                />
              </div>
            </div>
          )}

          {/* Export Complete */}
          {exportComplete && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium text-green-900 mb-1">
                  Export Complete!
                </p>
                <p className="text-sm text-green-700">
                  Your video has been successfully exported and is ready for download.
                </p>
              </div>
            </div>
          )}

          {/* Export Error */}
          {exportError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium text-red-900 mb-1">
                  Export Failed
                </p>
                <p className="text-sm text-red-700">
                  Please add at least one scene to export your video.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-primary-200 px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-primary-700 bg-white border border-primary-300 rounded-lg hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
          >
            {exportComplete ? 'Done' : 'Cancel'}
          </button>
          {!exportComplete && (
            <button
              onClick={handleExport}
              disabled={exporting || scenes.length === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors flex items-center gap-2"
            >
              {exporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" aria-hidden="true" />
                  Export Video
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
