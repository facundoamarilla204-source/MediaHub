import youtubedl from 'youtube-dl-exec';
import { detectPlatform } from './detectPlatform';
import { MediaMetadata, MediaQuality } from '../types';

function formatBytes(bytes?: number): string {
  if (!bytes) return 'N/A';
  const mb = bytes / (1024 * 1024);
  return mb.toFixed(1) + ' MB';
}

function formatDuration(seconds?: number): string {
  if (!seconds) return '00:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export async function fetchMetadata(url: string): Promise<MediaMetadata> {
  const { platform } = detectPlatform(url);

  try {
    // Ejecuta yt-dlp para descargar el manifiesto JSON del video
    const info: any = await youtubedl(url, {
      dumpJson: true,
      noCheckCertificates: true,
      noWarnings: true,
      preferFreeFormats: true,
      addHeader: ['referer:youtube.com', 'user-agent:Mozilla/5.0']
    });

    const qualities: MediaQuality[] = [];

    // 1. OPCIÓN DE AUDIO
    const audioFormats = info.formats.filter((f: any) => f.vcodec === 'none' && f.acodec !== 'none');
    let bestAudioSize = 0;
    if (audioFormats.length > 0) {
      // Selecciona el mejor formato de audio por bitrate
      const bestAudio = audioFormats.reduce((prev: any, current: any) => 
        ((current.abr || 0) > (prev.abr || 0)) ? current : prev
      );
      bestAudioSize = bestAudio.filesize || bestAudio.filesize_approx || 0;
      qualities.push({
        id: 'bestaudio/best', // Delegamos a yt-dlp el audio
        label: 'Audio MP3',
        size: formatBytes(bestAudioSize),
        type: 'audio',
        bitrate: bestAudio.abr ? `${Math.round(bestAudio.abr)} kbps` : undefined
      });
    } else {
      qualities.push({
        id: 'bestaudio/best',
        label: 'Audio MP3',
        size: 'N/A',
        type: 'audio'
      });
    }

    // 2. OPCIONES DE VIDEO
    const videoFormats = info.formats.filter((f: any) => f.vcodec !== 'none' && f.height);
    // Ordenar de mayor a menor resolución
    videoFormats.sort((a: any, b: any) => b.height - a.height);
    
    const seenHeights = new Set<number>();
    
    for (const f of videoFormats) {
      // Mostramos las resoluciones sin repetir, excluyendo calidades excesivamente bajas
      if (!seenHeights.has(f.height) && (f.height >= 360 || videoFormats.length <= 2)) {
        seenHeights.add(f.height);
        
        const videoSize = f.filesize || f.filesize_approx || 0;
        // Si el formato no tiene audio, calculamos el peso sumando el del audio
        const totalSize = (f.acodec === 'none' && bestAudioSize) ? videoSize + bestAudioSize : videoSize;

        let formatId = '';
        if (f.acodec !== 'none') {
           formatId = `${f.format_id}`; // Ya incluye audio
        } else {
           formatId = `${f.format_id}+bestaudio/best`; // Forzamos combinación
        }

        qualities.push({
          id: formatId, // yt-dlp identificador exacto de este formato
          label: `Video ${f.height}p (MP4)`,
          size: formatBytes(totalSize),
          type: 'video',
          resolution: `${f.width}x${f.height}`
        });
      }
    }

    // Fallback genérico si yt-dlp no devolvió videos de forma explícita
    if (qualities.filter(q => q.type === 'video').length === 0) {
      qualities.push({
        id: 'bestvideo+bestaudio/best',
        label: 'Video Original (MP4)',
        size: 'Automático',
        type: 'video'
      });
    }

    return {
      url,
      title: info.title || 'Video Multimedia',
      description: info.description,
      duration: formatDuration(info.duration),
      thumbnail: info.thumbnail || 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7',
      platform: platform,
      author: info.uploader || info.channel || info.creator || 'Autor',
      qualities
    };

  } catch (error: any) {
    console.error('yt-dlp extract error:', error);
    throw new Error('No se pudo extraer información del enlace. Revisa que sea un video público válido.');
  }
}
