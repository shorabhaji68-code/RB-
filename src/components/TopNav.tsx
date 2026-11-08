import React from 'react';
import { Smartphone, Monitor, Database, Plus, Search } from 'lucide-react';

interface TopNavProps {
  activeSection: 'catalog' | 'new-arrivals' | 'visualizer' | 'admin';
  onSelectSection: (section: 'catalog' | 'new-arrivals' | 'visualizer' | 'admin') => void;
  onOpenArchitecture: () => void;
  onOpenQuickQuote: () => void;
  isMobileFrameMode: boolean;
  onToggleMobileFrame: () => void;
  inquiryCount: number;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeSection,
  onSelectSection,
  onOpenArchitecture,
  onOpenQuickQuote,
  isMobileFrameMode,
  onToggleMobileFrame,
  inquiryCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Single text element wordmark */}
        <div
          onClick={() => onSelectSection('catalog')}
          className="text-lg sm:text-xl font-extrabold tracking-tight text-neutral-100 whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-2"
        >
          <span className="w-2.5 h-2.5 bg-amber-500 rounded-sm inline-block" />
          <span>RB Laser</span>
          <span className="text-amber-500 font-mono text-xs uppercase tracking-wider font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30">
            Cutting
          </span>
        </div>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-neutral-400">
          <button
            onClick={() => onSelectSection('catalog')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-neutral-100 ${
              activeSection === 'catalog' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            Catalog
          </button>
          <button
            onClick={() => onSelectSection('new-arrivals')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-neutral-100 ${
              activeSection === 'new-arrivals' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            New Arrivals
          </button>
          <button
            onClick={() => onSelectSection('visualizer')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-neutral-100 ${
              activeSection === 'visualizer' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            CAD Simulator
          </button>
          <button
            onClick={() => onSelectSection('admin')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-neutral-100 flex items-center gap-1.5 ${
              activeSection === 'admin' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            <span>Admin Suite</span>
            {inquiryCount > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
            )}
          </button>
          <button
            onClick={onOpenArchitecture}
            className="text-neutral-400 hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 font-mono text-xs flex items-center gap-1"
          >
            <Database size={13} />
            <span>Schema & Code</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Mobile frame preview toggle */}
          <button
            onClick={onToggleMobileFrame}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors whitespace-nowrap shrink-0"
            title="Toggle between Mobile App Frame and Full Desktop view"
          >
            {isMobileFrameMode ? (
              <>
                <Monitor size={13} className="text-amber-400" />
                <span className="hidden sm:inline">Desktop View</span>
              </>
            ) : (
              <>
                <Smartphone size={13} className="text-amber-400" />
                <span className="hidden sm:inline">Mobile App View</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenQuickQuote}
            className="px-4 py-2 text-xs font-bold text-neutral-950 bg-amber-500 rounded-lg hover:bg-amber-400 transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            Instant RFQ
          </button>
        </div>
      </div>
    </header>
  );
};
