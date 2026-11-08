import React, { useState, useEffect, useMemo } from 'react';
import {
  Product,
  ProductCategory,
  ProductReview,
  QuoteInquiry,
  MetalMaterial,
} from './types/catalog';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS, INITIAL_INQUIRIES } from './data/initialProducts';
import { formatTaka } from './utils/formatters';
import { TopNav } from './components/TopNav';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { QuoteInquiryModal } from './components/QuoteInquiryModal';
import { NewArrivalsSection } from './components/NewArrivalsSection';
import { LaserVisualizer } from './components/LaserVisualizer';
import { AdminDashboard } from './components/AdminDashboard';
import { ArchitectureDocsModal } from './components/ArchitectureDocsModal';
import { MobileAppFrame } from './components/MobileAppFrame';
import {
  Search,
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  Sparkles,
  Layers,
  ShieldCheck,
  Check,
  ChevronRight,
  Database,
  Info,
} from 'lucide-react';

export default function App() {
  // Persistence via localStorage
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('rblaser_products') || localStorage.getItem('beamcraft_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // If old sample data in USD, migrate to BDT initial data
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].basePrice < 1000) {
          return INITIAL_PRODUCTS;
        }
        return parsed;
      } catch (e) {
        return INITIAL_PRODUCTS;
      }
    }
    return INITIAL_PRODUCTS;
  });

  const [reviews, setReviews] = useState<ProductReview[]>(() => {
    const saved = localStorage.getItem('rblaser_reviews') || localStorage.getItem('beamcraft_reviews');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_REVIEWS;
      }
    }
    return INITIAL_REVIEWS;
  });

  const [inquiries, setInquiries] = useState<QuoteInquiry[]>(() => {
    const saved = localStorage.getItem('rblaser_inquiries') || localStorage.getItem('beamcraft_inquiries');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].estimatedTotal < 10000) {
          return INITIAL_INQUIRIES;
        }
        return parsed;
      } catch (e) {
        return INITIAL_INQUIRIES;
      }
    }
    return INITIAL_INQUIRIES;
  });

  // Navigation State
  const [activeSection, setActiveSection] = useState<'catalog' | 'new-arrivals' | 'visualizer' | 'admin'>('catalog');
  const [isMobileFrameMode, setIsMobileFrameMode] = useState<boolean>(false);

  // Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quoteProduct, setQuoteProduct] = useState<Product | null>(null);
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(35000);
  const [sortBy, setSortBy] = useState<'featured' | 'rating' | 'price-asc' | 'price-desc' | 'newest'>('featured');

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('rblaser_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('rblaser_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('rblaser_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  // Recalculate average rating & review count for products when reviews change
  const recomputedProducts = useMemo(() => {
    return products.map((prod) => {
      const prodRevs = reviews.filter((r) => r.productId === prod.id);
      if (prodRevs.length === 0) return prod;
      const avg = Number(
        (prodRevs.reduce((acc, r) => acc + r.rating, 0) / prodRevs.length).toFixed(2)
      );
      return {
        ...prod,
        rating: avg,
        reviewCount: prodRevs.length,
      };
    });
  }, [products, reviews]);

  // Filter & Search Logic
  const filteredProducts = useMemo(() => {
    return recomputedProducts.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // Material filter
      if (selectedMaterial !== 'all') {
        const hasMaterial = product.materialOptions.some((m) =>
          m.toLowerCase().includes(selectedMaterial.toLowerCase())
        );
        if (!hasMaterial) return false;
      }

      // Price filter
      if (product.basePrice > maxPrice) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesCat = product.category.toLowerCase().includes(query);
        const matchesTech = product.detailedSpecs.cuttingTechnology.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCat && !matchesTech) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price-asc') return a.basePrice - b.basePrice;
      if (sortBy === 'price-desc') return b.basePrice - a.basePrice;
      if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      return 0; // default featured
    });
  }, [recomputedProducts, selectedCategory, selectedMaterial, maxPrice, searchQuery, sortBy]);

  // Handlers
  const handleAddReview = (newRevData: Omit<ProductReview, 'id' | 'date' | 'helpfulCount'>) => {
    const newRev: ProductReview = {
      ...newRevData,
      id: `rev-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      helpfulCount: 0,
    };
    setReviews((prev) => [newRev, ...prev]);
  };

  const handleLikeReview = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          const userLiked = !r.userLiked;
          return {
            ...r,
            userLiked,
            helpfulCount: userLiked ? r.helpfulCount + 1 : r.helpfulCount - 1,
          };
        }
        return r;
      })
    );
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleUpdateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    if (selectedProduct && selectedProduct.id === updated.id) {
      setSelectedProduct(updated);
    }
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    if (selectedProduct?.id === productId) {
      setSelectedProduct(null);
    }
  };

  const handleDeleteReview = (reviewId: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
  };

  const handleUpdateInquiryStatus = (inquiryId: string, status: QuoteInquiry['status']) => {
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === inquiryId ? { ...inq, status } : inq))
    );
  };

  const handleResetSampleData = () => {
    setProducts(INITIAL_PRODUCTS);
    setReviews(INITIAL_REVIEWS);
    setInquiries(INITIAL_INQUIRIES);
    localStorage.removeItem('beamcraft_products');
    localStorage.removeItem('beamcraft_reviews');
    localStorage.removeItem('beamcraft_inquiries');
  };

  // Categories config
  const categories: { id: ProductCategory; label: string }[] = [
    { id: 'all', label: 'All Catalog' },
    { id: 'gates', label: 'Gates & Railings' },
    { id: 'jali', label: 'Jali & Facades' },
    { id: 'signage', label: 'Signage & Logos' },
    { id: 'wall-art', label: 'Wall Decor' },
    { id: 'industrial', label: 'Industrial Parts' },
  ];

  // Material options list for filter dropdown
  const materialsList = [
    { id: 'all', label: 'All Metal Alloys' },
    { id: 'mild steel', label: 'Mild Steel (CR/HR)' },
    { id: 'stainless', label: 'Stainless Steel (304/316)' },
    { id: 'corten', label: 'Corten Weathering Steel' },
    { id: 'brass', label: 'Solid Architectural Brass' },
    { id: 'aluminum', label: 'Aluminum Alloys' },
  ];

  // Main Page Content Renderer (Used in both Desktop and Mobile Frame mode)
  const renderMainContent = () => {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        {/* SECTION 1: CATALOG VIEW */}
        {activeSection === 'catalog' && (
          <div className="space-y-8">
            {/* Hero Banner / Intro */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 border border-neutral-800 p-6 sm:p-10">
              <div className="relative z-10 max-w-2xl space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-500 uppercase tracking-widest">
                  <Sparkles size={14} />
                  <span>Precision CNC Fiber & CO2 Laser Cutting</span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-100 tracking-tight leading-tight">
                  Architectural Metal & Industrial Fabrication
                </h1>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-xl">
                  Explore calibrated DXF/DWG vector designs for gates, intricate jali facade screens, 3D backlit signage, and high-tolerance industrial components.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => setActiveSection('new-arrivals')}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl transition-colors shadow-sm"
                  >
                    Explore 2026 Vector Feed
                  </button>
                  <button
                    onClick={() => setIsArchitectureModalOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white font-mono text-xs rounded-xl transition-colors"
                  >
                    <Database size={13} className="text-cyan-400" />
                    <span>View DB Schema & Code</span>
                  </button>
                </div>
              </div>

              {/* Decorative Subtle CAD Radial Glow */}
              <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none bg-gradient-to-l from-amber-500/30 to-transparent" />
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-neutral-900 border border-neutral-800 p-4 sm:p-5 rounded-2xl space-y-4">
              {/* Search Input Row */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search gates, mashrabiya jali, brass signage, 4kW fiber, tolerances..."
                    className="w-full pl-10 pr-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500 hover:text-neutral-300"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2 shrink-0">
                  <ArrowUpDown size={14} className="text-neutral-500 shrink-0" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-300 focus:outline-none focus:border-amber-400"
                  >
                    <option value="featured">Sort: Featured Designs</option>
                    <option value="rating">Sort: Highest Customer Rating</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="newest">Sort: Newest Releases</option>
                  </select>
                </div>
              </div>

              {/* Category Segmented Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                        : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Secondary Filters: Material and Max Price */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-neutral-800/80 text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-neutral-400 font-mono text-[11px] uppercase">
                    Filter Material:
                  </span>
                  <select
                    value={selectedMaterial}
                    onChange={(e) => setSelectedMaterial(e.target.value)}
                    className="px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-300 text-xs focus:outline-none focus:border-amber-400"
                  >
                    {materialsList.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-neutral-400 font-mono text-[11px] uppercase">
                    সর্বোচ্চ রেট: <strong className="text-amber-400">{formatTaka(maxPrice)}</strong>
                  </span>
                  <input
                    type="range"
                    min="1000"
                    max="35000"
                    step="1000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-32 accent-amber-500 cursor-pointer"
                  />
                </div>

                <div className="text-neutral-500 font-mono text-[11px]">
                  Showing {filteredProducts.length} of {recomputedProducts.length} designs
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="py-16 text-center space-y-3 bg-neutral-900/40 border border-neutral-800 rounded-2xl">
                <Filter size={32} className="mx-auto text-neutral-600" />
                <h3 className="text-base font-bold text-neutral-300">No Laser Designs Found</h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  Try broadening your search term, resetting the price range, or clearing material filters.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedMaterial('all');
                    setMaxPrice(35000);
                  }}
                  className="px-4 py-2 bg-neutral-800 text-neutral-200 text-xs font-semibold rounded-lg hover:bg-neutral-700 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={(p) => setSelectedProduct(p)}
                    onOpenQuote={(p) => setQuoteProduct(p)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* SECTION 2: NEW ARRIVALS FEED */}
        {activeSection === 'new-arrivals' && (
          <NewArrivalsSection
            products={recomputedProducts}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onOpenQuote={(p) => setQuoteProduct(p)}
          />
        )}

        {/* SECTION 3: INTERACTIVE VISUALIZER */}
        {activeSection === 'visualizer' && (
          <LaserVisualizer
            products={recomputedProducts}
            onOpenQuote={(p) => setQuoteProduct(p)}
          />
        )}

        {/* SECTION 4: ADMIN DASHBOARD */}
        {activeSection === 'admin' && (
          <AdminDashboard
            products={recomputedProducts}
            reviews={reviews}
            inquiries={inquiries}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onDeleteReview={handleDeleteReview}
            onUpdateInquiryStatus={handleUpdateInquiryStatus}
            onResetSampleData={handleResetSampleData}
          />
        )}
      </main>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Bar Contract Navigation */}
      <TopNav
        activeSection={activeSection}
        onSelectSection={(sec) => setActiveSection(sec)}
        onOpenArchitecture={() => setIsArchitectureModalOpen(true)}
        onOpenQuickQuote={() => setQuoteProduct(recomputedProducts[0])}
        isMobileFrameMode={isMobileFrameMode}
        onToggleMobileFrame={() => setIsMobileFrameMode(!isMobileFrameMode)}
        inquiryCount={inquiries.filter((i) => i.status === 'Pending').length}
      />

      {/* Main Content: Render in either Mobile App Frame or Full Width Desktop */}
      {isMobileFrameMode ? (
        <MobileAppFrame
          activeSection={activeSection}
          onSelectSection={(sec) => setActiveSection(sec)}
          inquiryCount={inquiries.filter((i) => i.status === 'Pending').length}
        >
          {renderMainContent()}
        </MobileAppFrame>
      ) : (
        <div className="flex-1">{renderMainContent()}</div>
      )}

      {/* Product Detail Modal with Reviews and CAD view */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        onOpenQuote={(p) => {
          setSelectedProduct(null);
          setQuoteProduct(p);
        }}
        reviews={reviews}
        onAddReview={handleAddReview}
        onLikeReview={handleLikeReview}
      />

      {/* Quote / RFQ Modal */}
      {quoteProduct && (
        <QuoteInquiryModal
          product={quoteProduct}
          isOpen={Boolean(quoteProduct)}
          onClose={() => setQuoteProduct(null)}
          onSubmitInquiry={(newInq) => {
            setInquiries((prev) => [newInq, ...prev]);
          }}
        />
      )}

      {/* Full Architecture, Database Schema, and Mobile Code Hub */}
      <ArchitectureDocsModal
        isOpen={isArchitectureModalOpen}
        onClose={() => setIsArchitectureModalOpen(false)}
      />

      {/* Quiet Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-8 px-6 text-xs text-neutral-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block" />
            <span className="text-neutral-300 font-bold font-sans">RB Laser Cutting Catalog</span>
            <span>·</span>
            <span>High-Precision CNC Laser Cutting & Metal Fabrication</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setIsArchitectureModalOpen(true)}
              className="text-amber-500 hover:underline"
            >
              Firestore & SQL Schemas
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveSection('admin')}
              className="hover:text-neutral-300"
            >
              Admin Dashboard
            </button>
            <span>·</span>
            <span>© 2026 RB Laser Cutting. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
