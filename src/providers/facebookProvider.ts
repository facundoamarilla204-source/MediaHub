import { MediaMetadata, Platform } from '../types';

export class FacebookProvider {
  name = 'Facebook';
  id: Platform = 'facebook';

  isValidUrl(url: string): boolean {
    const pattern = /^(https?:\/\/)?(www\.|web\.|m\.)?(facebook\.com|fb\.watch|fb\.com)\/.+$/i;
    return pattern.test(url);
  }

  async extractMetadata(url: string, htmlContent?: string): Promise<MediaMetadata> {
    let title = 'Facebook Video';
    let thumbnail = `https://images.unsplash.com/photo-1543269865-cbf427effbad?w=1200&auto=format&fit=crop&q=80`;
    let duration = '04:12';
    let author = 'Facebook Creator';

    if (htmlContent) {
      const titleMatch = htmlContent.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i) ||
                         htmlContent.match(/<title>([^<]+)<\/title>/i);
      
      const thumbMatch = htmlContent.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);

      if (titleMatch) title = titleMatch[1];
      if (thumbMatch) thumbnail = thumbMatch[1];
    }

    return {
      url,
      title,
      duration,
      thumbnail,
      platform: this.id,
      author,
      qualities: [
        { id: 'hd', label: 'Video HD 720p (MP4)', size: '28.4 MB', type: 'video' },
        { id: 'sd', label: 'Video SD 360p (MP4)', size: '11.1 MB', type: 'video' },
        { id: 'audio', label: 'Extraer Audio (MP3)', size: '3.8 MB', type: 'audio' },
      ]
    };
  }
}
