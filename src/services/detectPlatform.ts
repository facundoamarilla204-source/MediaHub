import { YoutubeProvider } from '../providers/youtubeProvider';
import { TiktokProvider } from '../providers/tiktokProvider';
import { InstagramProvider } from '../providers/instagramProvider';
import { FacebookProvider } from '../providers/facebookProvider';
import { OtherProvider } from '../providers/otherProvider';
import { Platform } from '../types';

const youtube = new YoutubeProvider();
const tiktok = new TiktokProvider();
const instagram = new InstagramProvider();
const facebook = new FacebookProvider();
const other = new OtherProvider();

export function detectPlatform(url: string): { platform: Platform; name: string; provider: any } {
  if (youtube.isValidUrl(url)) {
    return { platform: 'youtube', name: 'YouTube', provider: youtube };
  }
  if (tiktok.isValidUrl(url)) {
    return { platform: 'tiktok', name: 'TikTok', provider: tiktok };
  }
  if (instagram.isValidUrl(url)) {
    return { platform: 'instagram', name: 'Instagram', provider: instagram };
  }
  if (facebook.isValidUrl(url)) {
    return { platform: 'facebook', name: 'Facebook', provider: facebook };
  }
  return { platform: 'other', name: 'General', provider: other };
}
