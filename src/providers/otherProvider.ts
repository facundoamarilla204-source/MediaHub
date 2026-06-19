import { MediaMetadata, Platform } from '../types';

export class OtherProvider {
  name = 'General Link';
  id: Platform = 'other';

  isValidUrl(url: string): boolean {
    // Try to catch any valid URL
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  async extractMetadata(url: string, htmlContent?: string): Promise<MediaMetadata> {
    let title = 'Contenido Web';
    let thumbnail = `https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80`;
    let duration = 'N/A';
    let author = 'Sitio Web';

    if (htmlContent) {
      const titleMatch = htmlContent.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i) ||
                         htmlContent.match(/<title>([^<]+)<\/title>/i);
      const thumbMatch = htmlContent.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);
      const authorMatch = htmlContent.match(/<meta\s+property="og:site_name"\s+content="([^"]+)"/i);

      if (titleMatch) title = titleMatch[1];
      if (thumbMatch) thumbnail = thumbMatch[1];
      if (authorMatch) author = authorMatch[1];
    } else {
      // Extract hostname as title/author
      try {
        const hostname = new URL(url).hostname;
        title = `Contenido de ${hostname}`;
        author = hostname;
      } catch {
        // noop
      }
    }

    return {
      url,
      title,
      duration,
      thumbnail,
      platform: this.id,
      author,
      qualities: [
        { id: 'video_hq', label: 'Descargar Video Original (MP4)', size: '18.9 MB', type: 'video' },
        { id: 'audio_hq', label: 'Descargar Audio Original (MP3)', size: '3.1 MB', type: 'audio' },
      ]
    };
  }
}
