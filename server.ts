import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { fetchMetadata } from './src/services/metadataService';
import { handleMediaDownload } from './src/services/downloadService';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Middlewares
  app.use(express.json());

  // SEO: robots.txt Route
  app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send(`User-agent: *\nAllow: /\nSitemap: ${process.env.APP_URL || 'http://localhost:3000'}/sitemap.xml`);
  });

  // SEO: Dynamic sitemap.xml Route
  app.get('/sitemap.xml', (req, res) => {
    const appUrl = process.env.APP_URL || 'http://localhost:3000';
    res.type('application/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${appUrl}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`);
  });

  // API: Health Check
  app.get('/api/health', (req, res) => {
    res.json({ success: true, status: 'ok', timestamp: new Date() });
  });

  // API: Fetch Metadata
  app.post('/api/fetch-metadata', async (req, res) => {
    try {
      const { url } = req.body;
      if (!url || typeof url !== 'string') {
        res.status(400).json({ success: false, error: 'Se requiere una URL válida.' });
        return;
      }

      console.log(`Petición para extraer metadatos de: ${url}`);
      const metadata = await fetchMetadata(url);
      res.json({ success: true, data: metadata });
    } catch (error: any) {
      console.error('Error in /api/fetch-metadata:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message || 'Error interno al procesar la URL.' 
      });
    }
  });

  // API: Download File Stream
  app.get('/api/download-file', async (req, res) => {
    try {
      const { url, title, type, quality } = req.query;

      if (!url || typeof url !== 'string' || !title || typeof title !== 'string') {
        res.status(400).send('Falta la URL o el título del archivo.');
        return;
      }

      const mediaType = type === 'audio' ? 'audio' : 'video';
      const qualityId = typeof quality === 'string' ? quality : 'default';

      console.log(`Drenando descarga: [${mediaType}] ${title} (${qualityId}) desde ${url}`);
      await handleMediaDownload(res, url, title, mediaType, qualityId);
    } catch (error) {
      console.error('Error in /api/download-file:', error);
      if (!res.headersSent) {
        res.status(500).send('Error al procesar la descarga.');
      }
    }
  });

  // Vite Integration & Asset Serving
  if (process.env.NODE_ENV !== 'production') {
    console.log('Iniciando Vite en modo desarrollo para Express...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    console.log('Sirviendo assets de producción construidos en /dist...');
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MediaHub Express Server corriendo en http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start MediaHub application server:', err);
});
