import React, { useState } from 'react';
import { Product } from '../types/catalog';
import { Sparkles, Sun, Moon, Sliders, Layers, Eye } from 'lucide-react';

interface LaserVisualizerProps {
  products: Product[];
  onOpenQuote: (product: Product) => void;
}

export const LaserVisualizer: React.FC<LaserVisualizerProps> = ({
  products,
  onOpenQuote,
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(
    products[1]?.id || products[0]?.id || ''
  );
  const [backdrop, setBackdrop] = useState<'backlit' | 'sunlit' | 'concrete' | 'wood'>('backlit');
  const [finishColor, setFinishColor] = useState<'brass' | 'corten' | 'black' | 'steel'>('brass');
  const [lightIntensity, setLightIntensity] = useState<number>(75);
  const [shadowAngle, setShadowAngle] = useState<number>(35);

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  // Material tone mappings
  const materialStyles = {
    brass: 'text-amber-300 drop-shadow-[0_2px_10px_rgba(251,191,36,0.35)]',
    corten: 'text-amber-700 drop-shadow-[0_2px_8px_rgba(180,83,9,0.4)]',
    black: 'text-neutral-900 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]',
    steel: 'text-slate-300 drop-shadow-[0_2px_8px_rgba(203,213,225,0.4)]',
  };

  return (
    <div className="space-y-6">
      {/* Visualizer Header */}
      <div className="border-b border-neutral-800 pb-5">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-500 uppercase tracking-widest mb-1">
          <Eye size={14} />
          <span>Interactive Architectural Material & Lighting Simulator</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-100 tracking-tight">
          Laser Cut Simulation Studio
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl">
          Preview how intricate geometric screens, gates, and signage render under direct sun angles, backlit LED lighting, or architectural substrates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Sidebar (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-5 bg-neutral-900 border border-neutral-800 p-5 rounded-2xl">
          {/* Select Design */}
          <div>
            <label className="block text-xs font-mono text-neutral-300 uppercase tracking-wider mb-1.5">
              1. Select Cut Pattern
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-100 focus:outline-none focus:border-amber-400"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.category.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          {/* Backdrop Environment */}
          <div>
            <label className="block text-xs font-mono text-neutral-300 uppercase tracking-wider mb-1.5">
              2. Architectural Environment
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => setBackdrop('backlit')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border transition-colors ${
                  backdrop === 'backlit'
                    ? 'bg-amber-500/10 border-amber-500 text-amber-400 font-semibold'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Moon size={13} />
                <span>Backlit LED</span>
              </button>
              <button
                onClick={() => setBackdrop('sunlit')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border transition-colors ${
                  backdrop === 'sunlit'
                    ? 'bg-amber-500/10 border-amber-500 text-amber-400 font-semibold'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Sun size={13} />
                <span>Sunlit Shadow</span>
              </button>
              <button
                onClick={() => setBackdrop('concrete')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border transition-colors ${
                  backdrop === 'concrete'
                    ? 'bg-amber-500/10 border-amber-500 text-amber-400 font-semibold'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Layers size={13} />
                <span>Industrial Raw</span>
              </button>
              <button
                onClick={() => setBackdrop('wood')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border transition-colors ${
                  backdrop === 'wood'
                    ? 'bg-amber-500/10 border-amber-500 text-amber-400 font-semibold'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Layers size={13} />
                <span>Walnut Wood</span>
              </button>
            </div>
          </div>

          {/* Metal Alloy Finish */}
          <div>
            <label className="block text-xs font-mono text-neutral-300 uppercase tracking-wider mb-1.5">
              3. Fabricated Finish
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => setFinishColor('brass')}
                className={`py-2 px-3 rounded-lg border flex items-center gap-2 ${
                  finishColor === 'brass'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-semibold'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                }`}
              >
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block shadow-sm" />
                <span>Brushed Brass</span>
              </button>
              <button
                onClick={() => setFinishColor('corten')}
                className={`py-2 px-3 rounded-lg border flex items-center gap-2 ${
                  finishColor === 'corten'
                    ? 'bg-amber-800/30 border-amber-700 text-amber-400 font-semibold'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                }`}
              >
                <span className="w-3 h-3 rounded-full bg-amber-800 inline-block shadow-sm" />
                <span>Corten Rust</span>
              </button>
              <button
                onClick={() => setFinishColor('black')}
                className={`py-2 px-3 rounded-lg border flex items-center gap-2 ${
                  finishColor === 'black'
                    ? 'bg-neutral-800 border-neutral-600 text-neutral-200 font-semibold'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                }`}
              >
                <span className="w-3 h-3 rounded-full bg-neutral-950 border border-neutral-700 inline-block" />
                <span>Matte Black</span>
              </button>
              <button
                onClick={() => setFinishColor('steel')}
                className={`py-2 px-3 rounded-lg border flex items-center gap-2 ${
                  finishColor === 'steel'
                    ? 'bg-slate-800 border-slate-500 text-slate-200 font-semibold'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                }`}
              >
                <span className="w-3 h-3 rounded-full bg-slate-300 inline-block shadow-sm" />
                <span>304 Stainless</span>
              </button>
            </div>
          </div>

          {/* Interactive Sliders */}
          {backdrop === 'backlit' ? (
            <div>
              <div className="flex items-center justify-between text-xs text-neutral-300 mb-1">
                <span>LED Halo Glow Lux</span>
                <span className="font-mono text-amber-400">{lightIntensity}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={lightIntensity}
                onChange={(e) => setLightIntensity(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between text-xs text-neutral-300 mb-1">
                <span>Direct Solar Shadow Angle</span>
                <span className="font-mono text-amber-400">{shadowAngle}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                value={shadowAngle}
                onChange={(e) => setShadowAngle(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          )}

          {/* Direct RFQ Action */}
          <div className="pt-2 border-t border-neutral-800">
            <button
              onClick={() => onOpenQuote(selectedProduct)}
              className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl transition-colors text-center"
            >
              Get Custom Quote for this Simulation
            </button>
          </div>
        </div>

        {/* Live Simulation Viewport (lg:col-span-8) */}
        <div className="lg:col-span-8 bg-neutral-900 border border-neutral-800 rounded-2xl p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
            <span>REAL-TIME RENDERING CANVAS</span>
            <span className="text-amber-500">
              {selectedProduct.name} · {finishColor.toUpperCase()}
            </span>
          </div>

          <div
            className={`relative aspect-[16/10] w-full rounded-xl overflow-hidden flex items-center justify-center p-8 transition-all duration-500 border border-neutral-800 shadow-2xl ${
              backdrop === 'backlit'
                ? 'bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950'
                : backdrop === 'sunlit'
                ? 'bg-[#ece9e4]'
                : backdrop === 'concrete'
                ? 'bg-neutral-800'
                : 'bg-[#2a1b14]'
            }`}
          >
            {/* Backlit Halo Glow Effect */}
            {backdrop === 'backlit' && (
              <div
                className="absolute inset-0 pointer-events-none rounded-xl"
                style={{
                  background: `radial-gradient(circle at center, rgba(251, 191, 36, ${
                    (lightIntensity / 100) * 0.45
                  }) 0%, rgba(245, 158, 11, ${(lightIntensity / 100) * 0.15}) 40%, transparent 75%)`,
                }}
              />
            )}

            {/* Sunlit Cast Shadow on Wall */}
            {backdrop === 'sunlit' && (
              <div
                className="absolute inset-0 pointer-events-none opacity-35"
                style={{
                  transform: `translate(${shadowAngle * 0.5}px, ${shadowAngle * 0.8}px) scale(0.98)`,
                  filter: 'blur(3px)',
                }}
              >
                <div className="w-full h-full text-neutral-900 flex items-center justify-center">
                  <svg viewBox="0 0 400 400" className="w-4/5 h-4/5 stroke-current fill-none stroke-[2]">
                    <rect x="20" y="20" width="360" height="360" rx="4" />
                    {Array.from({ length: 6 }).map((_, r) =>
                      Array.from({ length: 6 }).map((_, c) => (
                        <circle key={`${r}-${c}`} cx={40 + c * 60} cy={40 + r * 60} r="18" />
                      ))
                    )}
                  </svg>
                </div>
              </div>
            )}

            {/* Laser Cut Screen Foreground */}
            <div
              className={`relative z-10 w-4/5 h-4/5 flex items-center justify-center transition-all ${
                materialStyles[finishColor]
              }`}
            >
              <svg
                viewBox="0 0 500 400"
                className="w-full h-full stroke-current fill-none transition-all duration-300"
                strokeWidth="2.5"
                style={{
                  filter:
                    finishColor === 'brass'
                      ? 'drop-shadow(0 4px 12px rgba(217, 119, 6, 0.4))'
                      : finishColor === 'corten'
                      ? 'drop-shadow(0 4px 10px rgba(120, 53, 15, 0.5))'
                      : 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.5))',
                }}
              >
                {/* Border Frame */}
                <rect
                  x="20"
                  y="20"
                  width="460"
                  height="360"
                  rx="6"
                  className={finishColor === 'black' ? 'fill-neutral-900/90' : 'fill-transparent'}
                  strokeWidth="4"
                />

                {/* Simulated Complex Pattern depending on product category */}
                {selectedProduct.category === 'jali' || selectedProduct.category === 'wall-art' ? (
                  Array.from({ length: 7 }).map((_, r) =>
                    Array.from({ length: 9 }).map((_, c) => {
                      const x = 50 + c * 50;
                      const y = 50 + r * 50;
                      return (
                        <g key={`${r}-${c}`}>
                          <polygon
                            points={`${x},${y - 18} ${x + 16},${y - 9} ${x + 16},${y + 9} ${x},${
                              y + 18
                            } ${x - 16},${y + 9} ${x - 16},${y - 9}`}
                            strokeWidth="1.8"
                          />
                          <circle cx={x} cy={y} r="5" strokeWidth="1.5" />
                        </g>
                      );
                    })
                  )
                ) : (
                  Array.from({ length: 14 }).map((_, i) => {
                    const x = 50 + i * 30;
                    return (
                      <g key={i}>
                        <path
                          d={`M ${x} 40 C ${x + 20} 120, ${x - 20} 240, ${x} 360`}
                          strokeWidth="2"
                        />
                        <circle cx={x} cy="200" r="4" strokeWidth="2" />
                      </g>
                    );
                  })
                )}
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
