import { Response } from 'express';
import youtubedl from 'youtube-dl-exec';
import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';
import ffmpegPath from 'ffmpeg-static';

export async function handleMediaDownload(
  res: Response,
  url: string,
  title: string,
  type: 'video' | 'audio',
  qualityId: string
) {
  // Sanitize filename to prevent directory traversal or bad headers
  let cleanTitle = title.replace(/[\\/*?:"<>|]/g, '').trim();
  if (!cleanTitle) cleanTitle = 'download';
  
  const ext = type === 'audio' ? 'mp3' : 'mp4';
  const filename = `${cleanTitle}_${qualityId}.${ext}`;
  const contentType = type === 'audio' ? 'audio/mpeg' : 'video/mp4';
  
  // Create a secure temporary path for the merge process
  const tempId = crypto.randomBytes(16).toString('hex');
  const tempFilePath = path.join(os.tmpdir(), `mediahub_${tempId}.${ext}`);

  // Config yt-dlp flags
  let flags: any = {
    noCheckCertificates: true,
    noWarnings: true,
    preferFreeFormats: true,
    addHeader: ['referer:youtube.com', 'user-agent:Mozilla/5.0'],
    output: tempFilePath, // We save it to a temp file to allow FFmpeg merging
    ffmpegLocation: ffmpegPath || undefined, // Apunta yt-dlp al binario estático de FFmpeg
    mergeOutputFormat: ext, // Asegura que yt-dlp arroje un mp4 o mp3 y no un mkv sorpresivo
  };

  if (type === 'audio') {
    flags = {
      ...flags,
      extractAudio: true,
      audioFormat: 'mp3',
    };
  } else {
    // Al usar yt-dlp dinámico en el metadataService, qualityId ya es el format string exacto
    flags = {
      ...flags,
      format: qualityId,
      formatSort: 'vcodec:h264', // Fuerza H.264 para mayor compatibilidad
    };
  }

  try {
    // Wait for the full download and merge to complete
    await youtubedl(url, flags);

    // If file exists, set headers and pipe it to the browser
    if (fs.existsSync(tempFilePath)) {
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
      
      const fileStream = fs.createReadStream(tempFilePath);
      fileStream.pipe(res);
      
      // Cleanup after successfully sending the stream
      fileStream.on('end', () => {
        if (fs.existsSync(tempFilePath)) {
          fs.unlink(tempFilePath, (err) => {
            if (err) console.error('Failed to clean up temp file:', err);
          });
        }
      });
      
      // Cleanup if error happens during streaming
      fileStream.on('error', (err) => {
        console.error('Stream read error:', err);
        if (!res.headersSent) res.status(500).send('Error leyendo el archivo temporal multimedia.');
        if (fs.existsSync(tempFilePath)) fs.unlink(tempFilePath, () => {});
      });

      // Cleanup if the connection drops unexpectedly
      res.on('close', () => {
        if (fs.existsSync(tempFilePath)) {
          fs.unlink(tempFilePath, () => {});
        }
      });
    } else {
      throw new Error('Temp file was not created by yt-dlp');
    }

  } catch (error) {
    console.error('yt-dlp processing/merging error:', error);
    if (fs.existsSync(tempFilePath)) {
      fs.unlink(tempFilePath, () => {});
    }
    if (!res.headersSent) {
      res.status(500).send('Error durante la descarga multimedia y mezcla de audio/video. ¿FFmpeg está instalado?');
    } else {
      res.end();
    }
  }
}
