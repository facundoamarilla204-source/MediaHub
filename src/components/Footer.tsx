import { Heart, Globe, Shield, FileText, Mail } from 'lucide-react';

interface FooterProps {
  onOpenModal: (type: 'about' | 'privacy' | 'terms' | 'dmca' | 'contact') => void;
}

export default function Footer({ onOpenModal }: FooterProps) {
  return (
    <footer className="mt-auto border-t border-zinc-900 bg-zinc-950/20 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          {/* Copyrights */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
            <span>© 2026 MediaHub. Hecho con y para la web.</span>
          </div>

          {/* Links with icons */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 font-sans text-xs font-medium text-zinc-400">
            <button
              onClick={() => onOpenModal('about')}
              className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
            >
              <Globe className="h-3 w-3" />
              <span>Acerca de</span>
            </button>
            <button
              onClick={() => onOpenModal('privacy')}
              className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
            >
              <Shield className="h-3 w-3" />
              <span>Privacidad</span>
            </button>
            <button
              onClick={() => onOpenModal('terms')}
              className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
            >
              <FileText className="h-3 w-3" />
              <span>Términos y AUP</span>
            </button>
            <button
              onClick={() => onOpenModal('dmca')}
              className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
            >
              <Shield className="h-3 w-3" />
              <span>Legal y DMCA</span>
            </button>
            <button
              onClick={() => onOpenModal('contact')}
              className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
            >
              <Mail className="h-3 w-3" />
              <span>Contacto</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
