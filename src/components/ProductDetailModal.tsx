import React, { useState } from 'react';
import { Product, ProductReview } from '../types/catalog';
import { ReviewSystem } from './ReviewSystem';
import { CadVectorPreview } from './CadVectorPreview';
import { formatTaka, formatPriceUnit } from '../utils/formatters';
import {
  X,
  Star,
  Layers,
  Cpu,
  Scissors,
  Maximize2,
  FileCode,
  Shield,
  ArrowRight,
  Eye,
  Check,
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenQuote: (product: Product) => void;
  reviews: ProductReview[];
  onAddReview: (review: Omit<ProductReview, 'id' | 'date' | 'helpfulCount'>) => void;
  onLikeReview: (reviewId: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onOpenQuote,
  reviews,
  onAddReview,
  onLikeReview,
}) => {
  if (!isOpen || !product) return null;

  const [activeView, setActiveView] = useState<'photo' | 'cad'>('photo');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const productReviews = reviews.filter((r) => r.productId === product.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-500">
              {product.category}
            </span>
            <span className="text-neutral-600">/</span>
            <span className="text-xs text-neutral-400 font-mono">ID: {product.id}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenQuote(product)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold rounded-lg transition-colors"
            >
              <span>Get Quote</span>
              <ArrowRight size={13} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-100 rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Main Top Section: Image/CAD Left & Core Purchase Module Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Visual Viewport Left (lg:col-span-7) */}
            <div className="lg:col-span-7 space-y-3">
              {/* Image / CAD Switcher Tabs */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-lg border border-neutral-800">
                  <button
                    onClick={() => setActiveView('photo')}
                    className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                      activeView === 'photo'
                        ? 'bg-neutral-800 text-neutral-100 shadow-sm'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <Eye size={12} />
                    <span>Fabricated Photo</span>
                  </button>
                  <button
                    onClick={() => setActiveView('cad')}
                    className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                      activeView === 'cad'
                        ? 'bg-neutral-800 text-cyan-400 font-mono shadow-sm'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <FileCode size={12} />
                    <span>Laser Vector Toolpath (CAD)</span>
                  </button>
                </div>

                <div className="text-[11px] font-mono text-neutral-500">
                  {product.detailedSpecs.nestingEfficiency} Nesting Efficiency
                </div>
              </div>

              {/* Main Display Container */}
              <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950 group">
                {activeView === 'photo' ? (
                  <img
                    src={product.images[selectedImageIndex] || product.images[0]}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <CadVectorPreview type={product.cadPreviewSvgPath || product.category} />
                )}

                {product.isNewArrival && (
                  <div className="absolute top-3 left-3 bg-neutral-900/90 border border-amber-500/50 text-amber-400 text-[10px] font-mono font-bold px-2.5 py-1 rounded-md backdrop-blur-sm">
                    NEW 2026 VECTOR
                  </div>
                )}
              </div>

              {/* Vector Formats Strip */}
              <div className="flex items-center justify-between text-xs text-neutral-400 bg-neutral-950/60 p-3 rounded-lg border border-neutral-800/80">
                <span className="text-[11px] font-medium text-neutral-300">Ready CAM Vector Files:</span>
                <div className="flex items-center gap-1.5">
                  {product.vectorFormats.map((fmt) => (
                    <span
                      key={fmt}
                      className="px-2 py-0.5 bg-neutral-900 border border-neutral-700/80 rounded text-[10px] font-mono text-cyan-400"
                    >
                      .{fmt}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Summary Right (lg:col-span-5) */}
            <div className="lg:col-span-5 space-y-5">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-neutral-100 tracking-tight leading-snug">
                  {product.name}
                </h1>

                {/* Rating & Review summary */}
                <div className="flex items-center gap-3 mt-2 text-xs">
                  <div className="flex items-center gap-1 text-amber-400 font-mono">
                    <Star size={14} className="fill-amber-400" />
                    <span className="font-bold">{product.rating}</span>
                  </div>
                  <span className="text-neutral-600">·</span>
                  <a
                    href="#reviews-section"
                    className="text-neutral-400 hover:text-amber-400 underline decoration-neutral-700 transition-colors"
                  >
                    {productReviews.length} Verified Customer Reviews
                  </a>
                </div>
              </div>

              {/* Price Banner */}
              <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800">
                <div className="text-[11px] text-neutral-400 font-medium">প্রারম্ভিক বেস রেট (Starting Price)</div>
                <div className="text-2xl font-black text-amber-400 font-mono mt-0.5">
                  {formatTaka(product.basePrice)}{' '}
                  <span className="text-xs text-neutral-400 font-sans font-normal">
                    / {formatPriceUnit(product.priceUnit)}
                  </span>
                </div>
                <div className="text-[11px] text-neutral-500 mt-1">
                  *চূড়ান্ত খরচ নির্ভর করবে শিটের থিকনেস (গেজ), মেটেরিয়াল টাইপ এবং কাটিং ফিনিশের ওপর।
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-neutral-300 leading-relaxed">
                {product.description}
              </p>

              {/* Key Highlights */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-neutral-300">
                  <Scissors size={14} className="text-amber-400 shrink-0" />
                  <span>
                    Kerf Tolerance:{' '}
                    <strong className="text-neutral-100 font-mono">
                      {product.detailedSpecs.kerfTolerance}
                    </strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-neutral-300">
                  <Cpu size={14} className="text-amber-400 shrink-0" />
                  <span>
                    Laser Power:{' '}
                    <strong className="text-neutral-100 font-mono">
                      {product.detailedSpecs.recommendedLaserPower}
                    </strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-neutral-300">
                  <Layers size={14} className="text-amber-400 shrink-0" />
                  <span>
                    Sheet Gauge:{' '}
                    <strong className="text-neutral-100 font-mono">
                      {product.detailedSpecs.sheetThicknessRange}
                    </strong>
                  </span>
                </div>
              </div>

              {/* Primary Call To Action */}
              <button
                onClick={() => onOpenQuote(product)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm rounded-xl transition-colors shadow-lg shadow-amber-500/10"
              >
                <span>Configure Specs & Get Instant Quote</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Fabrication Specifications Grid */}
          <div className="space-y-4 pt-4 border-t border-neutral-800">
            <h3 className="text-sm font-bold text-neutral-200 uppercase tracking-wider font-mono">
              Manufacturing & Material Specifications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-xl space-y-1">
                <div className="text-[11px] text-neutral-400">Cutting Tech</div>
                <div className="text-xs font-semibold text-neutral-200">
                  {product.detailedSpecs.cuttingTechnology}
                </div>
              </div>
              <div className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-xl space-y-1">
                <div className="text-[11px] text-neutral-400">Max Single Sheet</div>
                <div className="text-xs font-semibold text-neutral-200 font-mono">
                  {product.detailedSpecs.maxSheetDimensions}
                </div>
              </div>
              <div className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-xl space-y-1">
                <div className="text-[11px] text-neutral-400">Complexity Profile</div>
                <div className="text-xs font-semibold text-neutral-200">
                  {product.detailedSpecs.cutComplexity}
                </div>
              </div>
              <div className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-xl space-y-1">
                <div className="text-[11px] text-neutral-400">Available Materials</div>
                <div className="text-xs font-semibold text-neutral-200">
                  {product.materialOptions.length} Engineered Alloys
                </div>
              </div>
            </div>

            {/* Compatible Materials Pills */}
            <div className="bg-neutral-950/80 p-4 rounded-xl border border-neutral-800 space-y-2">
              <div className="text-[11px] text-neutral-400 uppercase tracking-wider font-mono">
                Approved Metal & Substrate Alloys:
              </div>
              <div className="flex flex-wrap gap-2">
                {product.materialOptions.map((mat) => (
                  <div
                    key={mat}
                    className="flex items-center gap-1.5 px-3 py-1 bg-neutral-900 border border-neutral-700/80 rounded-lg text-xs text-neutral-200"
                  >
                    <Check size={12} className="text-amber-400" />
                    <span>{mat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* USER REVIEWS AND RATING SYSTEM */}
          <div id="reviews-section" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-neutral-100 tracking-tight">
                  Fabrication Reviews & Customer Ratings
                </h3>
                <p className="text-xs text-neutral-400">
                  Feedback from certified architects, fabricators, and structural contractors.
                </p>
              </div>
            </div>

            <ReviewSystem
              productId={product.id}
              productName={product.name}
              reviews={productReviews}
              onAddReview={onAddReview}
              onLikeReview={onLikeReview}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
