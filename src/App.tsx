import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Sparkles, 
  ArrowRight, 
  Play, 
  RotateCcw, 
  Clock, 
  HelpCircle, 
  AlertCircle, 
  CheckCircle, 
  X, 
  ExternalLink,
  Video,
  Music,
  Share2
} from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { MediaMetadata, MediaQuality, ApiResponse } from './types';
import { detectPlatform } from './services/detectPlatform';
import { PrivacyPolicy, TermsOfService, DmcaPolicy, ContactPage } from './components/LegalTexts';

export default function App() {
  const [url, setUrl] = useState('');
  const [detected, setDetected] = useState<{ platform: string; name: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('Analizando enlace...');
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<MediaMetadata | null>(null);
  const [selectedQuality, setSelectedQuality] = useState<MediaQuality | null>(null);
  const [modalType, setModalType] = useState<'about' | 'privacy' | 'terms' | 'dmca' | 'contact' | null>(null);
  const [notyf, setNotyf] = useState<string | null>(null);

  // Auto detect platform as user types
  useEffect(() => {
    if (!url) {
      setDetected(null);
      setError(null);
      return;
    }

    try {
      if (url.startsWith('http://') || url.startsWith('https://')) {
        const info = detectPlatform(url);
        setDetected({ platform: info.platform, name: info.name });
        setError(null);
      } else {
        setDetected(null);
      }
    } catch {
      setDetected(null);
    }
  }, [url]);

  // Toast notifier helper
  const showToast = (msg: string) => {
    setNotyf(msg);
    setTimeout(() => setNotyf(null), 3000);
  };

  const handleFetchMetadata = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!url) {
      setError('Por favor, introduce una URL válida.');
      return;
    }

    setLoading(true);
    setError(null);
    setMetadata(null);
    setSelectedQuality(null);

    // Simulate stepping for extreme production look
    const steps = [
      'Identificando proveedor de medios...',
      'Estableciendo canal de conexión seguro...',
      'Extrayendo etiquetas OG y flujos de video...',
      'Utilizando Gemini AI para corregir metadatos...'
    ];

    let currentStep = 0;
    setLoadingStep(steps[currentStep]);
    const stepInterval = setInterval(() => {
      if (currentStep < steps.length - 1) {
        currentStep++;
        setLoadingStep(steps[currentStep]);
      }
    }, 1200);

    try {
      const response = await fetch('/api/fetch-metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      clearInterval(stepInterval);

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        throw new Error(errorJson.error || 'No se pudo recuperar los metadatos de esta URL. Verifica que sea un enlace público.');
      }

      const result: ApiResponse<MediaMetadata> = await response.json();
      if (result.success && result.data) {
        setMetadata(result.data);
        // Pre-select the highest quality video
        const firstVideo = result.data.qualities.find(q => q.type === 'video');
        setSelectedQuality(firstVideo || result.data.qualities[0] || null);
        showToast('¡Información multimedia cargada con éxito!');
      } else {
        throw new Error(result.error || 'Servicio ocupado. Reclama metadatos más tarde.');
      }
    } catch (err: any) {
      clearInterval(stepInterval);
      setError(err.message || 'Error técnico al extraer datos. El servidor está configurado para proxy remoto.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setUrl('');
    setMetadata(null);
    setSelectedQuality(null);
    setError(null);
    setDetected(null);
  };

  // Pre-configured URLs for easy testing
  const sampleUrls = [
    { name: 'YouTube Video', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    { name: 'TikTok Reel', url: 'https://www.tiktok.com/@creative/video/718293810293' },
    { name: 'Instagram Creator', url: 'https://www.instagram.com/p/C_sampleReel/' },
    { name: 'Facebook Medios', url: 'https://facebook.com/watch/?v=19283748293' }
  ];

  return (
    <div id="mediahub-root" className="min-h-screen bg-[#0a0a0a] text-[#ededed] font-sans flex flex-col relative overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      {/* Dynamic Notification Toast */}
      {notyf && (
        <div id="toast-notyf" className="fixed top-20 right-4 z-50 flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-xs px-4 py-3 rounded-xl shadow-2xl animate-bounce">
          <CheckCircle className="h-4 w-4 text-emerald-400" />
          <span className="font-medium text-zinc-100">{notyf}</span>
        </div>
      )}

      {/* Embedded Ambient Geometric glow effect */}
      <div id="ambient-glow" className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none z-0"></div>

      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-7xl mx-auto z-10 py-6 sm:py-12">
        
        {/* UPPER MAIN LAYOUT: INPUT AREA */}
        {!metadata && !loading && (
          <div id="input-section" className="w-full max-w-2xl text-center mb-8 sm:mb-10 transition-all duration-300 px-4 sm:px-0">


            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tighter mb-4 text-white leading-tight">
              Descarga multimedia <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">instantánea.</span>
            </h1>
            <p className="text-sm sm:text-base text-white/40 mb-10 max-w-lg mx-auto">
              MediaHub procesa vídeos en alta definición en tiempo real. Pega tu URL abajo sin necesidad de registrarte ni instalar extensiones.
            </p>

            <form onSubmit={handleFetchMetadata} className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white/[0.02] border border-white/10 rounded-2xl p-2.5 backdrop-blur-md group focus-within:border-indigo-500/40 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all">
              <input 
                id="url-input-field"
                type="text" 
                value={url} 
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Pega enlace de YouTube, TikTok, Instagram, Facebook..."
                className="flex-1 bg-transparent px-4 py-3.5 text-sm sm:text-base text-white placeholder-white/20 focus:outline-none w-full"
              />
              
              {/* Reset button inside input if text exists */}
              {url && (
                <button 
                  type="button" 
                  onClick={() => setUrl('')}
                  className="sm:absolute sm:right-36 hover:bg-white/15 p-1 rounded-lg text-white/40 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              <button 
                id="search-btn"
                type="submit" 
                className="px-6 py-3.5 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Procesar</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            {/* Quick Validation Hint or Platform Indicator */}
            {detected && (
              <div id="detected-indicator" className="mt-4 flex items-center justify-center gap-2 text-xs font-mono text-zinc-400">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></span>
                <span>Plataforma detectada de forma automática: </span>
                <strong className="text-white bg-white/5 border border-white/10 px-2 py-0.5 rounded-md uppercase tracking-wider">{detected.name}</strong>
              </div>
            )}

            {/* Demo Quick Try links */}
            <div id="quick-try-section" className="mt-12">
              <span className="text-xs text-zinc-600 uppercase tracking-widest font-mono">Enlaces de prueba rápidos:</span>
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                {sampleUrls.map((sample) => (
                  <button
                    key={sample.name}
                    type="button"
                    onClick={() => setUrl(sample.url)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-zinc-900 bg-zinc-950 hover:bg-zinc-900 hover:border-zinc-800 text-zinc-400 hover:text-white transition-all cursor-pointer"
                  >
                    {sample.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* LOADER DURING REMOTE PROCESSING */}
        {loading && (
          <div id="loader-view" className="w-full max-w-md text-center py-16 px-6 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-md transition-all duration-300">
            <div className="relative mx-auto w-16 h-16 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 border-r-indigo-500 animate-spin"></div>
              <div className="absolute inset-2 bg-zinc-950 rounded-full flex items-center justify-center">
                <Download className="h-5 w-5 text-indigo-400 animate-pulse" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Procesando enlace remoto</h3>
            <p className="text-sm text-indigo-400 font-mono animate-pulse mb-3">{loadingStep}</p>
            <p className="text-xs text-white/30 max-w-xs mx-auto">No almacenamos archivos pesados permanentemente. El procesamiento remueve marcas de agua.</p>
          </div>
        )}

        {/* ERROR MESSAGE CARD */}
        {error && !loading && (
          <div id="error-card" className="w-full sm:max-w-xl mx-auto mb-8 bg-red-500/5 border-y sm:border border-red-500/15 p-4 sm:p-5 sm:rounded-2xl flex flex-col sm:flex-row items-start gap-3.5 text-sm my-4">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5 hidden sm:block" />
            <div className="flex-1">
              <h4 className="font-semibold text-red-400 mb-1">No se pudo procesar la URL</h4>
              <p className="text-red-300/80 leading-relaxed mb-4">{error}</p>
              <div className="flex gap-2">
                <button 
                  onClick={handleFetchMetadata}
                  className="px-3.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Reintentar
                </button>
                <button 
                  onClick={handleReset}
                  className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                >
                  Probar otro enlace
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DOWNLOAD COMPONENT & MEDIA CARD */}
        {metadata && !loading && (
          <div id="results-card" className="w-full sm:max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-0 sm:gap-8 bg-white/[0.02] border-y sm:border border-white/10 sm:rounded-3xl sm:p-6 backdrop-blur-md animate-fade-in">
            
            {/* Left Preview Box */}
            <div className="lg:col-span-5 flex flex-col gap-0 sm:gap-4">
              <div className="aspect-video bg-[#121212] sm:rounded-2xl overflow-hidden sm:border border-white/5 relative group shadow-2xl">
                <img 
                  id="media-preview-thumbnail"
                  src={metadata.thumbnail} 
                  onError={(e) => {
                    // fallback to generic placeholder
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800';
                  }}
                  className="w-full h-full object-cover opacity-80" 
                  alt={metadata.title} 
                />
                
                {/* Visual Glassmorphism Play Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-xl group-hover:scale-105 transition-transform">
                    <Play className="w-6 h-6 text-white fill-current translate-x-0.5" />
                  </div>
                </div>

                <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 rounded font-mono text-[11px] text-zinc-300 font-bold flex items-center gap-1 border border-white/5">
                  <Clock className="h-3 w-3" />
                  {metadata.duration}
                </div>
              </div>

              {/* Share / Copy buttons */}
              <div className="grid grid-cols-2 gap-2 mt-0 sm:mt-1 p-4 sm:p-0 bg-zinc-950/50 sm:bg-transparent border-b sm:border-0 border-white/5">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(metadata.url);
                    showToast('¡URL original copiada al portapapeles!');
                  }}
                  className="flex items-center justify-center gap-2 text-xs py-2.5 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 text-zinc-300 hover:text-white transition-all cursor-pointer"
                >
                  <Share2 className="h-3.5 w-3.5 text-zinc-500" />
                  <span>Copiar Enlace</span>
                </button>
                <a
                  href={metadata.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 text-xs py-2.5 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 text-zinc-300 hover:text-white transition-all text-center"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-zinc-500" />
                  <span>Ver Original</span>
                </a>
              </div>
            </div>

            {/* Right Information & download options */}
            <div className="lg:col-span-7 flex flex-col justify-between py-5 sm:py-1 px-4 sm:px-0 gap-6">
              <div>
                <div className="flex items-center gap-2.5 mb-3 flex-wrap">
                  <span className={`px-2.5 py-0.5 text-[11px] font-extrabold rounded uppercase tracking-wider border ${
                    metadata.platform === 'youtube' ? 'bg-red-500/20 text-red-400 border-red-500/20' :
                    metadata.platform === 'tiktok' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' :
                    metadata.platform === 'instagram' ? 'bg-pink-500/20 text-pink-400 border-pink-500/20' :
                    metadata.platform === 'facebook' ? 'bg-blue-500/20 text-blue-400 border-blue-500/20' :
                    'bg-zinc-500/20 text-zinc-400 border-zinc-500/20'
                  }`}>
                    {metadata.platform === 'other' ? 'General' : metadata.platform}
                  </span>
                  <span className="text-zinc-500 text-xs font-mono">• Automáticamente detectado</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug mb-2 line-clamp-2">
                  {metadata.title}
                </h2>
                
                <p className="text-xs sm:text-sm text-zinc-400 font-medium">
                  Autor / Canal: <span className="text-indigo-400">{metadata.author || 'Desconocido'}</span>
                </p>
              </div>

              {/* Quality Selectors Grid */}
              <div id="quality-selector-block" className="space-y-3.5">
                <span className="block text-xs font-mono text-zinc-500 uppercase tracking-wider">Selecciona formato y resolución:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[170px] overflow-y-auto pr-1">
                  {metadata.qualities.map((quality) => {
                    const isSelected = selectedQuality?.id === quality.id;
                    const isAudio = quality.type === 'audio';

                    return (
                      <button
                        key={quality.id}
                        type="button"
                        onClick={() => setSelectedQuality(quality)}
                        className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                          isSelected 
                            ? 'bg-zinc-100 border-white text-zinc-950 font-semibold shadow-lg shadow-zinc-900/10' 
                            : 'bg-zinc-900/30 border-white/5 text-zinc-300 hover:border-white/10 hover:bg-zinc-900/60'
                        } cursor-pointer`}
                      >
                        <div className="flex items-center gap-2">
                          {isAudio ? (
                            <Music className={`h-4 w-4 ${isSelected ? 'text-indigo-600' : 'text-zinc-500'}`} />
                          ) : (
                            <Video className={`h-4 w-4 ${isSelected ? 'text-indigo-600' : 'text-zinc-500'}`} />
                          )}
                          <div className="text-xs">
                            <p className={`font-medium ${isSelected ? 'text-black' : 'text-zinc-100'}`}>{quality.label}</p>
                            {quality.resolution && (
                              <span className="text-[10px] text-zinc-400 block font-mono">{quality.resolution}</span>
                            )}
                          </div>
                        </div>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          isSelected ? 'bg-zinc-200 text-zinc-800' : 'bg-zinc-950 text-zinc-500'
                        }`}>
                          {quality.size}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Download / Pivot triggers */}
              <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center justify-center gap-2 bg-zinc-900 border border-white/5 hover:bg-zinc-800 hover:border-white/10 text-zinc-300 px-5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer capitalize"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Descargar Otro</span>
                </button>

                {selectedQuality ? (
                  <a
                    id="download-link-anchor"
                    href={`/api/download-file?url=${encodeURIComponent(metadata.url)}&title=${encodeURIComponent(metadata.title)}&type=${selectedQuality.type}&quality=${encodeURIComponent(selectedQuality.id)}`}
                    onClick={() => {
                      showToast(`Iniciando descarga de ${selectedQuality.label}...`);
                    }}
                    className="flex-1 flex items-center justify-center gap-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-95 text-white py-3 px-6 rounded-xl text-sm font-bold shadow-xl shadow-indigo-500/10 transition-all text-center"
                  >
                    <Download className="h-4 w-4" />
                    <span>Descargar {selectedQuality.type === 'audio' ? 'MP3' : 'MP4'}</span>
                  </a>
                ) : (
                  <div className="flex-1 bg-zinc-900 text-zinc-500 text-center py-3 rounded-xl text-sm">
                    Elige una calidad de descarga
                  </div>
                )}
              </div>

            </div>
          </div>
        )}



      </main>

      <Footer onOpenModal={(type) => setModalType(type)} />

      {/* LEGAL / CONTACT MODALS */}
      {modalType && (
        <div id="legal-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative">
            
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider font-mono">
                {modalType === 'about' && 'Acerca de MediaHub'}
                {modalType === 'privacy' && 'Privacidad y Cookies'}
                {modalType === 'terms' && 'Términos de Servicio y AUP'}
                {modalType === 'dmca' && 'Aviso Legal y DMCA'}
                {modalType === 'contact' && 'Canal de Contacto'}
              </h3>
              <button 
                onClick={() => setModalType(null)}
                className="hover:bg-zinc-900 p-2 rounded-xl text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto text-sm text-zinc-400 leading-relaxed font-sans">
              {modalType === 'about' && (
                <div className="space-y-4">
                  <p><strong>MediaHub</strong> es un extractor de metadatos y proxies multimedia diseñado como respuesta a las necesidades de portabilidad de medios para creadores.</p>
                  <p>La plataforma utiliza una arquitectura <strong>sin base de datos</strong> ni almacenamiento persistente para garantizar una privacidad inquebrantable.</p>
                  <p>Cada archivo se descarga directamente de forma reactiva (en un buffer de streaming) de forma que el contenido del usuario fluye de extremo a extremo sin tocar nuestros servidores permanentemente.</p>
                </div>
              )}

              {modalType === 'privacy' && <PrivacyPolicy />}
              {modalType === 'terms' && <TermsOfService />}
              {modalType === 'dmca' && <DmcaPolicy />}
              {modalType === 'contact' && <ContactPage />}
            </div>

            <div className="p-6 border-t border-zinc-800 flex justify-end">
              <button 
                onClick={() => setModalType(null)}
                className="px-5 py-2.5 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-all text-xs cursor-pointer"
              >
                Cerrar Ventana
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
