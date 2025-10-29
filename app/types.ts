export interface MediaAsset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio';
  url: string;
  thumbnail?: string;
  duration?: number;
  size?: number;
}

export interface Scene {
  id: string;
  title: string;
  description: string;
  duration: number;
  mediaAssets: string[];
  transition: TransitionType;
  voiceoverId?: string;
  order: number;
}

export type TransitionType = 'none' | 'fade' | 'slide' | 'zoom' | 'dissolve' | 'wipe';

export interface VoiceoverTrack {
  id: string;
  name: string;
  url: string;
  duration: number;
  sceneId?: string;
}

export interface ExportSettings {
  resolution: '720p' | '1080p' | '4k';
  format: 'mp4' | 'mov';
  quality: 'low' | 'medium' | 'high';
  includeBranding: boolean;
  watermark?: {
    text: string;
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  };
}
