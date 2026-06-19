import { MediaMetadata, Platform } from '../types';

export class TiktokProvider {
  name = 'TikTok';
  id: Platform = 'tiktok';

  isValidUrl(url: string): boolean {
    const pattern = /^(https?:\/\/)?(www\.|vm\.|vt\.|m\.)?tiktok\.com\/.+$/i;
    return pattern.test(url);
  }

  async extractMetadata(url: string, htmlContent?: string): Promise<MediaMetadata> {
    let title = 'TikTok video by creator';
    // Beautiful default fallback illustration for TikTok
    let thumbnail = `https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&auto=format&fit=crop&q=80`;
    let duration = '00:15';
    let author = 'TikTok User';

    if (htmlContent) {
      const titleMatch = htmlContent.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i) ||
                         htmlContent.match(/<meta\s+name="twitter:title"\s+content="([^"]+)"/i) ||
                         htmlContent.match(/<title>([^<]+)<\/title>/i);
                         
      const authorMatch = htmlContent.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i) ||
                          htmlContent.match(/<meta\s+name="description"\s+content="([^"]+)"/i);

      const thumbMatch = htmlContent.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i) ||
                          htmlContent.match(/<meta\s+name="twitter:image"\s+content="([^"]+)"/i);

      if (titleMatch) {
        title = titleMatch[1].replace('&amp;', '&');
      }
      if (authorMatch) {
        // Tik Tok descriptions often contain creator tags "TikTok video from @username: descriptions"
        const usernameMatch = authorMatch[1].match(/from\s+(@\w+)/i) || authorMatch[1].match(/by\s+([\w\s]+)/i);
        if (usernameMatch) {
          author = usernameMatch[1];
        } else {
          author = authorMatch[1].split(':')[0];
        }
      }
      if (thumbMatch) {
        thumbnail = thumbMatch[1];
      }
    }

    return {
      url,
      title: title.length > 80 ? title.substring(0, 80) + '...' : title,
      duration,
      thumbnail,
      platform: this.id,
      author,
      qualities: [
        { id: 'hd_watermark', label: 'Video Original (MP4)', size: '8.4 MB', type: 'video' },
        { id: 'hd_no_watermark', label: 'Sin Marca de Agua (MP4)', size: '7.2 MB', type: 'video' },
        { id: 'audio_mp3', label: 'Audio Original (MP3)', size: '1.4 MB', type: 'audio' },
      ]
    };
  }
}
