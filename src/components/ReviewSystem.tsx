import React, { useState } from 'react';
import { ProductReview, SurfaceFinish } from '../types/catalog';
import { Star, ThumbsUp, CheckCircle, Plus, Filter, MessageSquare, ShieldCheck } from 'lucide-react';

interface ReviewSystemProps {
  productId: string;
  productName: string;
  reviews: ProductReview[];
  onAddReview: (review: Omit<ProductReview, 'id' | 'date' | 'helpfulCount'>) => void;
  onLikeReview: (reviewId: string) => void;
}

export const ReviewSystem: React.FC<ReviewSystemProps> = ({
  productId,
  productName,
  reviews,
  onAddReview,
  onLikeReview,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'highest' | 'helpful'>('recent');

  // Form State
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [authorName, setAuthorName] = useState('');
  const [authorLocation, setAuthorLocation] = useState('');
  const [projectApplication, setProjectApplication] = useState('');
  const [finishChosen, setFinishChosen] = useState<SurfaceFinish>('Matte Black Powder Coat');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [verifiedPurchase, setVerifiedPurchase] = useState(true);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Compute Statistics
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
      : '0.0';

  const ratingCounts = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  // Filter & Sort
  const filteredReviews = reviews
    .filter((r) => {
      if (ratingFilter !== 'all' && r.rating !== ratingFilter) return false;
      if (verifiedOnly && !r.verifiedPurchase) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'highest') return b.rating - a.rating;
      if (sortBy === 'helpful') return b.helpfulCount - a.helpfulCount;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim() || !title.trim()) return;

    onAddReview({
      productId,
      authorName: authorName.trim(),
      authorLocation: authorLocation.trim() || undefined,
      rating,
      title: title.trim(),
      comment: comment.trim(),
      verifiedPurchase,
      projectApplication: projectApplication.trim() || 'Custom Architectural Project',
      finishChosen,
    });

    setFormSubmitted(true);
    setTimeout(() => {
      setShowAddForm(false);
      setFormSubmitted(false);
      setComment('');
      setTitle('');
      setAuthorName('');
      setAuthorLocation('');
      setProjectApplication('');
    }, 1500);
  };

  return (
    <div className="space-y-6 pt-4 border-t border-neutral-800">
      {/* Header and Aggregate Rating Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-neutral-900/60 p-5 rounded-xl border border-neutral-800">
        <div className="flex items-center gap-5">
          <div className="text-center shrink-0">
            <div className="text-4xl font-extrabold text-neutral-100 font-mono tracking-tight">
              {averageRating}
            </div>
            <div className="flex items-center justify-center gap-0.5 text-amber-400 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={15}
                  className={i < Math.round(Number(averageRating)) ? 'fill-amber-400' : 'text-neutral-600'}
                />
              ))}
            </div>
            <div className="text-[11px] text-neutral-400 mt-1 font-mono">
              {totalReviews} {totalReviews === 1 ? 'Review' : 'Reviews'}
            </div>
          </div>

          {/* Rating Breakdown Bars */}
          <div className="w-48 sm:w-64 space-y-1 text-xs">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = ratingCounts[stars as keyof typeof ratingCounts];
              const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              return (
                <div key={stars} className="flex items-center gap-2 text-neutral-400">
                  <span className="w-3 text-right font-mono">{stars}</span>
                  <Star size={10} className="fill-amber-400 text-amber-400 shrink-0" />
                  <div className="flex-1 h-2 bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-6 text-right font-mono text-[11px] text-neutral-500">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button to Open Form */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 transition-colors shadow-sm"
          >
            <Plus size={16} />
            <span>Write a Fabrication Review</span>
          </button>
        </div>
      </div>

      {/* Write Review Form Card */}
      {showAddForm && (
        <div className="p-5 bg-neutral-900 border border-amber-500/30 rounded-xl transition-all">
          {formSubmitted ? (
            <div className="py-8 text-center space-y-2">
              <CheckCircle size={32} className="mx-auto text-emerald-400 animate-bounce" />
              <h4 className="text-base font-semibold text-neutral-100">Review Submitted!</h4>
              <p className="text-xs text-neutral-400">
                Thank you for reviewing {productName}. Your rating is now reflected in the RB Laser Cutting catalog specs.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <h4 className="text-sm font-bold text-neutral-100 uppercase tracking-wider font-mono">
                  Review & Rate Fabrication Quality
                </h4>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-xs text-neutral-400 hover:text-neutral-200"
                >
                  Cancel
                </button>
              </div>

              {/* Star Rating Picker */}
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Overall Rating <span className="text-amber-400">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((starVal) => {
                      const active = (hoverRating || rating) >= starVal;
                      return (
                        <button
                          type="button"
                          key={starVal}
                          onClick={() => setRating(starVal)}
                          onMouseEnter={() => setHoverRating(starVal)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            size={22}
                            className={active ? 'fill-amber-400 text-amber-400' : 'text-neutral-600'}
                          />
                        </button>
                      );
                    })}
                  </div>
                  <span className="text-xs font-mono text-amber-400 font-semibold ml-2">
                    {rating === 5 && '5.0 - Superior Precision'}
                    {rating === 4 && '4.0 - High Quality Fabricated'}
                    {rating === 3 && '3.0 - Meets Expectations'}
                    {rating === 2 && '2.0 - Tolerances Off'}
                    {rating === 1 && '1.0 - Unacceptable Kerf/Defects'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Your Name / Company <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g. Jason Myers (Arch Design Co)"
                    className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    City / Location (Optional)
                  </label>
                  <input
                    type="text"
                    value={authorLocation}
                    onChange={(e) => setAuthorLocation(e.target.value)}
                    placeholder="e.g. Dallas, TX"
                    className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Project Application
                  </label>
                  <input
                    type="text"
                    value={projectApplication}
                    onChange={(e) => setProjectApplication(e.target.value)}
                    placeholder="e.g. Villa Facade Screen, Entry Gate"
                    className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Finish / Coating Used
                  </label>
                  <select
                    value={finishChosen}
                    onChange={(e) => setFinishChosen(e.target.value as SurfaceFinish)}
                    className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-200 focus:outline-none focus:border-amber-400"
                  >
                    <option value="Matte Black Powder Coat">Matte Black Powder Coat</option>
                    <option value="Raw / Mill Finish">Raw / Mill Finish</option>
                    <option value="Brushed Satin Finish">Brushed Satin Finish</option>
                    <option value="Accelerated Rust Patina">Accelerated Rust Patina (Corten)</option>
                    <option value="Champagne Gold Anodized">Champagne Gold Anodized</option>
                    <option value="Mirror Polish">Mirror Polish</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Review Headline <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Outstanding cut edge with zero slag, perfect DXF import"
                  className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Detailed Experience <span className="text-amber-400">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Describe the sheet thickness accuracy, kerf sharpness, packaging, weldability, or client feedback..."
                  className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 text-xs text-neutral-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={verifiedPurchase}
                    onChange={(e) => setVerifiedPurchase(e.target.checked)}
                    className="rounded bg-neutral-800 border-neutral-700 text-amber-500 focus:ring-0"
                  />
                  <span>I verified this order with RB Laser Cutting fab</span>
                </label>

                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 transition-colors"
                >
                  Publish Review
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-neutral-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Filter size={13} className="text-neutral-500" />
          <span className="text-neutral-400 font-medium">Filter:</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setRatingFilter('all')}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                ratingFilter === 'all'
                  ? 'bg-neutral-800 text-neutral-100 font-semibold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              All
            </button>
            {[5, 4, 3].map((star) => (
              <button
                key={star}
                onClick={() => setRatingFilter(star)}
                className={`px-2.5 py-1 rounded text-xs transition-colors flex items-center gap-1 ${
                  ratingFilter === star
                    ? 'bg-neutral-800 text-amber-400 font-semibold'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <span>{star}</span>
                <Star size={10} className="fill-amber-400 text-amber-400" />
              </button>
            ))}
            <button
              onClick={() => setVerifiedOnly(!verifiedOnly)}
              className={`px-2.5 py-1 rounded text-xs transition-colors flex items-center gap-1 ${
                verifiedOnly
                  ? 'bg-emerald-950 text-emerald-400 font-semibold border border-emerald-800/40'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <ShieldCheck size={12} />
              <span>Verified Only</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-neutral-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-neutral-900 border border-neutral-800 text-neutral-300 rounded px-2.5 py-1 text-xs focus:outline-none"
          >
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
      </div>

      {/* Review Cards List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="py-8 text-center text-xs text-neutral-500">
            <MessageSquare size={24} className="mx-auto text-neutral-600 mb-2" />
            No reviews match the selected filter.
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-4 bg-neutral-900/40 border border-neutral-800/80 rounded-xl space-y-2.5 hover:border-neutral-700/60 transition-colors"
            >
              {/* Header row: Stars, Date, Verified */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        className={i < rev.rating ? 'fill-amber-400' : 'text-neutral-700'}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-neutral-200">
                    {rev.title}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono">
                  {rev.verifiedPurchase && (
                    <span className="flex items-center gap-1 text-emerald-400 text-[11px] font-sans">
                      <ShieldCheck size={12} />
                      Verified Fabrication
                    </span>
                  )}
                  <span>·</span>
                  <span>{rev.date}</span>
                </div>
              </div>

              {/* Author & Application Metadata */}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-400">
                <span className="font-medium text-neutral-300">{rev.authorName}</span>
                {rev.authorLocation && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{rev.authorLocation}</span>
                  </>
                )}
                <span aria-hidden="true">·</span>
                <span className="text-amber-400/90 font-mono text-[11px]">
                  App: {rev.projectApplication}
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-neutral-400 font-mono text-[11px]">
                  Finish: {rev.finishChosen}
                </span>
              </div>

              {/* Comment Prose */}
              <p className="text-xs text-neutral-300 leading-relaxed">{rev.comment}</p>

              {/* Helpful footer */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => onLikeReview(rev.id)}
                  className={`flex items-center gap-1.5 text-[11px] transition-colors ${
                    rev.userLiked
                      ? 'text-amber-400 font-medium'
                      : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  <ThumbsUp size={12} className={rev.userLiked ? 'fill-amber-400' : ''} />
                  <span>Helpful ({rev.helpfulCount})</span>
                </button>
                <span className="text-[10px] text-neutral-600 font-mono">
                  REF-{rev.id}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
