import React from 'react';

interface CadVectorPreviewProps {
  type: string;
  className?: string;
  interactive?: boolean;
}

export const CadVectorPreview: React.FC<CadVectorPreviewProps> = ({
  type,
  className = '',
}) => {
  return (
    <div
      className={`relative w-full h-full bg-neutral-950 flex items-center justify-center overflow-hidden border border-neutral-800 font-mono ${className}`}
    >
      {/* CAD Grid Background */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #38bdf8 1px, transparent 1px),
            linear-gradient(to bottom, #38bdf8 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Origin / Axis Marker */}
      <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] text-cyan-400 font-mono">
        <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block animate-pulse" />
        <span>G00 X0.000 Y0.000 (Z-AXIS PARK)</span>
      </div>

      <div className="absolute top-3 right-3 text-[10px] text-neutral-400 font-mono">
        FEED: 4800 mm/min · N2 18 BAR
      </div>

      <div className="absolute bottom-3 left-3 text-[10px] text-neutral-400 font-mono">
        KERF OFFSET: 0.12mm · TOLERANCE: ±0.03mm
      </div>

      {/* SVG Vector Graphic based on type */}
      <div className="w-4/5 h-4/5 relative flex items-center justify-center p-4">
        {type.includes('parametric') || type.includes('gate') ? (
          <svg
            viewBox="0 0 600 360"
            className="w-full h-full max-h-72 stroke-cyan-400 fill-none"
            strokeWidth="1.5"
          >
            {/* Outer perimeter frame */}
            <rect
              x="20"
              y="20"
              width="560"
              height="320"
              rx="4"
              className="stroke-amber-400"
              strokeWidth="2"
            />
            {/* Slotted parametric wave pattern */}
            {Array.from({ length: 18 }).map((_, i) => {
              const x = 50 + i * 28;
              const yOffset = Math.sin(i * 0.45) * 40;
              return (
                <g key={i}>
                  <path
                    d={`M ${x} ${60 + yOffset} Q ${x + 15} 180 ${x} ${300 - yOffset}`}
                    strokeDasharray={i % 3 === 0 ? '4 2' : 'none'}
                    className={i % 2 === 0 ? 'stroke-cyan-400' : 'stroke-sky-300'}
                  />
                  <circle
                    cx={x}
                    cy={60 + yOffset}
                    r="2.5"
                    className="fill-cyan-400 stroke-none"
                  />
                  <circle
                    cx={x}
                    cy={300 - yOffset}
                    r="2.5"
                    className="fill-cyan-400 stroke-none"
                  />
                </g>
              );
            })}
            {/* Dimension Lines */}
            <line
              x1="20"
              y1="350"
              x2="580"
              y2="350"
              className="stroke-neutral-500"
              strokeWidth="1"
            />
            <text x="300" y="348" textAnchor="middle" className="text-[10px] fill-neutral-400">
              4200.00 mm [NOMINAL CLEAR OPENING]
            </text>
          </svg>
        ) : type.includes('hex') || type.includes('jali') || type.includes('screen') ? (
          <svg
            viewBox="0 0 400 400"
            className="w-full h-full max-h-72 stroke-amber-400 fill-none"
            strokeWidth="1.4"
          >
            <rect
              x="20"
              y="20"
              width="360"
              height="360"
              rx="2"
              className="stroke-neutral-600"
              strokeWidth="1.5"
            />
            {/* Hexagon lattice array */}
            {Array.from({ length: 5 }).map((_, row) =>
              Array.from({ length: 5 }).map((_, col) => {
                const cx = 60 + col * 70 + (row % 2 ? 35 : 0);
                const cy = 60 + row * 65;
                if (cx > 350 || cy > 350) return null;
                return (
                  <g key={`${row}-${col}`}>
                    <polygon
                      points={`
                        ${cx},${cy - 24}
                        ${cx + 21},${cy - 12}
                        ${cx + 21},${cy + 12}
                        ${cx},${cy + 24}
                        ${cx - 21},${cy + 12}
                        ${cx - 21},${cy - 12}
                      `}
                      className="stroke-cyan-400 hover:fill-cyan-950/40 transition-colors"
                    />
                    <circle cx={cx} cy={cy} r="6" className="stroke-amber-400" />
                  </g>
                );
              })
            )}
            <text x="200" y="390" textAnchor="middle" className="text-[10px] fill-neutral-400">
              1200 x 2400 mm [MODULAR FACADE SPAN]
            </text>
          </svg>
        ) : type.includes('mandala') || type.includes('wall') ? (
          <svg
            viewBox="0 0 400 400"
            className="w-full h-full max-h-72 stroke-amber-500 fill-none"
            strokeWidth="1.3"
          >
            <circle cx="200" cy="200" r="170" className="stroke-neutral-600" strokeWidth="2" />
            <circle cx="200" cy="200" r="140" className="stroke-cyan-400" />
            <circle cx="200" cy="200" r="90" className="stroke-amber-400" />
            <circle cx="200" cy="200" r="40" className="stroke-sky-300" />
            {Array.from({ length: 16 }).map((_, idx) => {
              const angle = (idx * 360) / 16;
              return (
                <g key={idx} transform={`rotate(${angle} 200 200)`}>
                  <path
                    d="M 200 60 Q 215 110 200 140 Q 185 110 200 60 Z"
                    className="stroke-cyan-300 fill-cyan-950/20"
                  />
                  <circle cx="200" cy="50" r="3" className="fill-amber-400 stroke-none" />
                </g>
              );
            })}
            <text x="200" y="392" textAnchor="middle" className="text-[10px] fill-neutral-400">
              Ø 1800.00 mm [CIRCULAR WATERJET / FIBER CUT]
            </text>
          </svg>
        ) : (
          <svg
            viewBox="0 0 400 300"
            className="w-full h-full max-h-72 stroke-cyan-400 fill-none"
            strokeWidth="1.5"
          >
            <rect
              x="40"
              y="40"
              width="320"
              height="220"
              rx="6"
              className="stroke-neutral-500"
              strokeWidth="2"
            />
            {/* Typography / Logo Contour Path */}
            <path
              d="M 90 200 L 140 80 L 190 200 M 110 160 L 170 160"
              className="stroke-amber-400"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="140" cy="65" r="8" className="fill-cyan-400 stroke-none" />
            <path
              d="M 230 110 C 260 110 270 140 270 160 C 270 185 255 200 230 200 L 210 200 L 210 110 Z"
              className="stroke-sky-300"
              strokeWidth="4"
            />
            {/* Standoff pin indicators */}
            <circle cx="60" cy="60" r="4" className="stroke-red-400" />
            <circle cx="340" cy="60" r="4" className="stroke-red-400" />
            <circle cx="60" cy="240" r="4" className="stroke-red-400" />
            <circle cx="340" cy="240" r="4" className="stroke-red-400" />
            <text x="200" y="285" textAnchor="middle" className="text-[10px] fill-neutral-400">
              PRECISION OFFSET 0.05mm · RED CIRCLES = 6mm STANDOFF DRILLS
            </text>
          </svg>
        )}
      </div>
    </div>
  );
};
