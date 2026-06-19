import { MediaMetadata, Platform } from '../types';

export class InstagramProvider {
  name = 'Instagram';
  id: Platform = 'instagram';

  isValidUrl(url: string): boolean {
    const pattern = /^(https?:\/\/)?(www\.)?instagram\.com\/(p|reel|shorts|tv)\/.+$/i;
    return pattern.test(url);
  }

  async extractMetadata(url: string, htmlContent?: string): Promise<MediaMetadata> {
    let title = 'Instagram Reel';
    let thumbnail = `https://images.unsplash.com/photo-1611224885990-ab7363d1f2a9?w=1200&auto=format&fit=crop&q=80`;
    let duration = '00:30';
    let author = 'Instagram User';

    if (htmlContent) {
      const titleMatch = htmlContent.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i) ||
                         htmlContent.match(/<title>([^<]+)<\/title>/i);
      
      const thumbMatch = htmlContent.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);
      const descMatch = htmlContent.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i);

      if (titleMatch) title = titleMatch[1].replace('Instagram: ', '').replace('• Photos and videos', '');
      if (thumbMatch) thumbnail = thumbMatch[1];
      if (descMatch) {
        const parts = descMatch[1].split(' - ');
        if (parts.length > 0) {
          author = parts[0];
        }
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
        { id: 'hd', label: 'Alta Definición (MP4)', size: '14.5 MB', type: 'video' },
        { id: 'sd', label: 'Resolución Estándar (MP4)', size: '6.2 MB', type: 'video' },
        { id: 'audio', label: 'Audio de la publicación (MP3)', size: '1.1 MB', type: 'audio' },
      ]
    };
  }
}
