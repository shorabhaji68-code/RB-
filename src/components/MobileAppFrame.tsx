import React from 'react';
import { Wifi, Battery, Signal, Grid, Sparkles, Eye, ShieldAlert, FileText } from 'lucide-react';

interface MobileAppFrameProps {
  children: React.ReactNode;
  activeSection: 'catalog' | 'new-arrivals' | 'visualizer' | 'admin';
  onSelectSection: (section: 'catalog' | 'new-arrivals' | 'visualizer' | 'admin') => void;
  inquiryCount: number;
}

export const MobileAppFrame: React.FC<MobileAppFrameProps> = ({
  children,
  activeSection,
  onSelectSection,
  inquiryCount,
}) => {
  return (
    <div className="py-6 flex items-center justify-center min-h-[calc(100vh-65px)] bg-neutral-950 p-2 sm:p-4">
      {/* Smartphone Chassis */}
      <div className="relative w-full max-w-[414px] h-[844px] bg-neutral-900 border-[10px] border-neutral-800 rounded-[50px] shadow-2xl shadow-neutral-950 flex flex-col overflow-hidden ring-1 ring-neutral-700/50">
        {/* Dynamic Island / Speaker Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-5 bg-neutral-950 rounded-full z-50 flex items-center justify-end px-3">
          <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 border border-neutral-800" />
        </div>

        {/* Status Bar */}
        <div className="h-10 pt-1.5 px-6 flex items-center justify-between text-[11px] font-mono text-neutral-400 bg-neutral-950 select-none shrink-0 z-40">
          <span>09:41</span>
          <div className="flex items-center gap-1.5 text-neutral-300">
            <Signal size={12} />
            <Wifi size={12} />
            <Battery size={14} className="text-amber-400" />
          </div>
        </div>

        {/* Scrollable Mobile App Body */}
        <div className="flex-1 overflow-y-auto bg-neutral-950 pb-16 custom-scrollbar">
          {children}
        </div>

        {/* Mobile Bottom Tab Bar */}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-neutral-950/95 backdrop-blur-md border-t border-neutral-800 px-4 flex items-center justify-around z-40">
          <button
            onClick={() => onSelectSection('catalog')}
            className={`flex flex-col items-center gap-0.5 text-[10px] transition-colors ${
              activeSection === 'catalog' ? 'text-amber-400 font-bold' : 'text-neutral-500'
            }`}
          >
            <Grid size={18} />
            <span>Catalog</span>
          </button>

          <button
            onClick={() => onSelectSection('new-arrivals')}
            className={`flex flex-col items-center gap-0.5 text-[10px] transition-colors ${
              activeSection === 'new-arrivals' ? 'text-amber-400 font-bold' : 'text-neutral-500'
            }`}
          >
            <Sparkles size={18} />
            <span>New CAD</span>
          </button>

          <button
            onClick={() => onSelectSection('visualizer')}
            className={`flex flex-col items-center gap-0.5 text-[10px] transition-colors ${
              activeSection === 'visualizer' ? 'text-amber-400 font-bold' : 'text-neutral-500'
            }`}
          >
            <Eye size={18} />
            <span>Simulator</span>
          </button>

          <button
            onClick={() => onSelectSection('admin')}
            className={`flex flex-col items-center gap-0.5 text-[10px] transition-colors relative ${
              activeSection === 'admin' ? 'text-amber-400 font-bold' : 'text-neutral-500'
            }`}
          >
            <ShieldAlert size={18} />
            <span>Admin</span>
            {inquiryCount > 0 && (
              <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-amber-500 text-neutral-950 text-[9px] font-bold rounded-full flex items-center justify-center">
                {inquiryCount}
              </span>
            )}
          </button>
        </div>

        {/* Home Indicator Bar */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-neutral-600 rounded-full z-50 pointer-events-none" />
      </div>
    </div>
  );
};
