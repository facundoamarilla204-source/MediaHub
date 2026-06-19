import { Download, Sparkles } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-zinc-950/60 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo / Brand */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-400 p-0.5 text-zinc-950 shadow-lg shadow-zinc-950/50">
            <Download className="h-5 w-5" />
          </div>
          <span className="font-sans text-xl font-bold tracking-tight text-white">
            Media<span className="bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">Hub</span>
          </span>
        </div>

        {/* Badges / Navigation indicators */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-xs font-mono text-zinc-400">
            <Sparkles className="h-3 w-3 text-amber-400 animate-pulse" />
            <span>Procesamiento de archivos multimedia</span>
          </div>
          <div className="rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1 text-xs font-semibold text-zinc-200">
            v1.2.0-MVP
          </div>
        </div>
      </div>
    </nav>
  );
}
