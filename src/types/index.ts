export type Platform = 'tiktok' | 'instagram' | 'youtube' | 'facebook' | 'other';

export interface MediaQuality {
  id: string;
  label: string;
  size: string;
  type: 'video' | 'audio';
  resolution?: string;
  bitrate?: string;
}

export interface MediaMetadata {
  url: string;
  title: string;
  description?: string;
  duration: string;
  thumbnail: string;
  platform: Platform;
  author?: string;
  qualities: MediaQuality[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
