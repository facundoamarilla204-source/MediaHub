import { MediaMetadata, Platform } from '../types';

export class YoutubeProvider {
  name = 'YouTube';
  id: Platform = 'youtube';

  isValidUrl(url: string): boolean {
    const pattern = /^(https?:\/\/)?(www\.|m\.)?(youtube\.com|youtu\.be)\/.+$/i;
    return pattern.test(url);
  }

  extractVideoId(url: string): string | null {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  async extractMetadata(url: string, htmlContent?: string): Promise<MediaMetadata> {
    const videoId = this.extractVideoId(url);
    let title = 'YouTube Video';
    let thumbnail = `https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1200&auto=format&fit=crop&q=80`; // default fallback
    let duration = '03:45';
    let author = 'YouTube Creator';

    if (videoId) {
      thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      title = `YouTube Video #${videoId}`;
    }

    if (htmlContent) {
      // Try to parse from Open Graph metadata in the fetched HTML
      const titleMatch = htmlContent.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i) ||
                         htmlContent.match(/<title>([^<]+)<\/title>/i);
      const authorMatch = htmlContent.match(/<link\s+itemprop="name"\s+content="([^"]+)"/i) ||
                          htmlContent.match(/<meta\s+name="author"\s+content="([^"]+)"/i);
      
      if (titleMatch) title = titleMatch[1].replace('&amp;', '&').replace(' - YouTube', '');
      if (authorMatch) author = authorMatch[1];
    }

    return {
      url,
      title,
      duration,
      thumbnail,
      platform: this.id,
      author,
      qualities: [
        { id: '1080p', label: '1080p Full HD (MP4)', size: '42.8 MB', type: 'video', resolution: '1920x1080' },
        { id: '720p', label: '720p HD (MP4)', size: '24.1 MB', type: 'video', resolution: '1280x720' },
        { id: '360p', label: '360p (MP4)', size: '9.8 MB', type: 'video', resolution: '640x360' },
        { id: 'mp3', label: 'Audio MP3 (320kbps)', size: '5.2 MB', type: 'audio', bitrate: '320kbps' },
      ]
    };
  }
}
