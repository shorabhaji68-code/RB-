import React from 'react';
import { Product } from '../types/catalog';
import { formatTaka, formatPriceUnit } from '../utils/formatters';
import { Sparkles, ArrowRight, Download, FileCode, CheckCircle2 } from 'lucide-react';

interface NewArrivalsSectionProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onOpenQuote: (product: Product) => void;
}

export const NewArrivalsSection: React.FC<NewArrivalsSectionProps> = ({
  products,
  onSelectProduct,
  onOpenQuote,
}) => {
  const newArrivals = products.filter((p) => p.isNewArrival);

  return (
    <section className="space-y-6">
      {/* Editorial Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-500 uppercase tracking-widest mb-1.5">
            <Sparkles size={14} />
            <span>Latest 2026 Vector Catalog Releases</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-100 tracking-tight">
            New Laser Vector Arrivals
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl">
            Freshly engineered geometric matrices, parametric curves, and architectural screens tested for thermal stability and zero dross.
          </p>
        </div>

        <div className="text-xs font-mono text-neutral-500">
          Showing {newArrivals.length} production-verified files
        </div>
      </div>

      {/* Grid of New Arrivals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newArrivals.map((prod) => (
          <div
            key={prod.id}
            className="group bg-neutral-900 border border-neutral-800 hover:border-amber-500/40 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col"
          >
            {/* Visual Header */}
            <div
              className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-950 cursor-pointer"
              onClick={() => onSelectProduct(prod)}
            >
              <img
                src={prod.images[0]}
                alt={prod.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />

              <div className="absolute top-3 left-3 bg-amber-500 text-neutral-950 text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow">
                NEW RELEASE
              </div>

              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-mono text-neutral-300">
                <span className="text-cyan-400">.{prod.vectorFormats.join(' / .')}</span>
                <span>{prod.detailedSpecs.kerfTolerance} Tolerance</span>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-mono">
                  <span className="text-amber-500 uppercase">{prod.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{prod.detailedSpecs.recommendedLaserPower}</span>
                </div>

                <h3
                  onClick={() => onSelectProduct(prod)}
                  className="text-base font-bold text-neutral-100 hover:text-amber-400 transition-colors cursor-pointer"
                >
                  {prod.name}
                </h3>

                <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                  {prod.description}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-neutral-800">
                <div className="flex items-center justify-between">
                  <div className="text-xs sm:text-sm font-bold text-amber-400 font-mono">
                    {formatTaka(prod.basePrice)}{' '}
                    <span className="text-[10px] font-normal text-neutral-500">
                      / {formatPriceUnit(prod.priceUnit)}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-400 font-mono">
                    ★ {prod.rating} ({prod.reviewCount})
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSelectProduct(prod)}
                    className="w-full py-2 px-3 text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg transition-colors text-center"
                  >
                    Inspect CAD
                  </button>
                  <button
                    onClick={() => onOpenQuote(prod)}
                    className="w-full py-2 px-3 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-lg transition-colors text-center"
                  >
                    Quick RFQ
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
