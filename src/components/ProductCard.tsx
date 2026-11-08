import React from 'react';
import { Product } from '../types/catalog';
import { formatTaka, formatPriceUnit } from '../utils/formatters';
import { Star, ArrowRight, ShieldCheck, FileCode } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onOpenQuote: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onOpenQuote,
}) => {
  return (
    <div className="group flex flex-col bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-700 transition-all duration-300 hover:shadow-xl hover:shadow-neutral-950/40">
      {/* Product Image Lead (65-75% visual weight) */}
      <div
        className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-950 cursor-pointer"
        onClick={() => onSelect(product)}
      >
        <img
          src={product.images[0]}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient Scrim for Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent opacity-60" />

        {/* Top Badges (New Arrival or CAD Formats) */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          {product.isNewArrival && (
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-500 text-neutral-950 rounded shadow">
              NEW ARRIVAL
            </span>
          )}
          <span className="px-2 py-0.5 text-[10px] font-mono bg-neutral-900/90 text-cyan-400 border border-neutral-700/80 rounded backdrop-blur-sm">
            .{product.vectorFormats[0]}
          </span>
        </div>

        {/* Bottom Quick Overlay: Kerf tolerance */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-neutral-300 font-mono">
          <span>Kerf {product.detailedSpecs.kerfTolerance}</span>
          <span>{product.detailedSpecs.nestingEfficiency} Nesting</span>
        </div>
      </div>

      {/* Card Content Area */}
      <div className="flex-1 p-5 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Unboxed Metadata with Typographic Separator */}
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span className="uppercase tracking-wider font-mono text-[11px] text-amber-500 font-medium">
              {product.category}
            </span>
            <span aria-hidden="true">·</span>
            <span>{product.detailedSpecs.sheetThicknessRange}</span>
            <span aria-hidden="true">·</span>
            <span>{product.materialOptions[0]?.split(' ')[0]}</span>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onSelect(product)}
            className="text-base font-bold text-neutral-100 hover:text-amber-400 transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          {/* Description snippet */}
          <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Rating and Reviews Line */}
          <div className="flex items-center gap-2 pt-1">
            <div className="flex items-center gap-1 text-amber-400">
              <Star size={13} className="fill-amber-400" />
              <span className="text-xs font-mono font-bold">{product.rating}</span>
            </div>
            <span className="text-neutral-600">·</span>
            <span className="text-xs text-neutral-400 hover:text-neutral-200 cursor-pointer" onClick={() => onSelect(product)}>
              {product.reviewCount} Reviews
            </span>
          </div>
        </div>

        {/* Pricing and Action Strip */}
        <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] text-neutral-500 font-medium">প্রারম্ভিক দাম</div>
            <div className="text-sm sm:text-base font-extrabold text-amber-400 font-mono">
              {formatTaka(product.basePrice)}
            </div>
            <div className="text-[10px] text-neutral-400 font-sans">
              {formatPriceUnit(product.priceUnit)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelect(product)}
              className="px-3 py-1.5 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
            >
              Details
            </button>
            <button
              onClick={() => onOpenQuote(product)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-lg transition-colors shadow-sm"
            >
              <span>Get Quote</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
