import ffmpegPath from 'ffmpeg-static';
import youtubedl from 'youtube-dl-exec';
import path from 'path';
import os from 'os';

console.log('ffmpeg path:', ffmpegPath);

const tempPath = path.join(os.tmpdir(), 'test_dl.mp4');

youtubedl('https://www.instagram.com/reel/DZm5yRDBVsv/', {
  noCheckCertificates: true,
  noWarnings: true,
  output: tempPath,
  ffmpegLocation: ffmpegPath,
  format: 'bestvideo[height<=1080]+bestaudio/best[height<=1080]/best',
  mergeOutputFormat: 'mp4',
}).then(() => {
  console.log('Finished. Check if exists:', require('fs').existsSync(tempPath));
}).catch(err => {
  console.error('yt-dlp Error:', err.message);
});
