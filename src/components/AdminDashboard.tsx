import React, { useState } from 'react';
import { Product, ProductReview, QuoteInquiry, MetalMaterial } from '../types/catalog';
import { formatTaka, formatPriceUnit } from '../utils/formatters';
import {
  Plus,
  Trash2,
  Edit2,
  FileText,
  DollarSign,
  Star,
  CheckCircle,
  X,
  Upload,
  AlertCircle,
  Check,
  RefreshCw,
} from 'lucide-react';

interface AdminDashboardProps {
  products: Product[];
  reviews: ProductReview[];
  inquiries: QuoteInquiry[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onDeleteReview: (reviewId: string) => void;
  onUpdateInquiryStatus: (inquiryId: string, status: QuoteInquiry['status']) => void;
  onResetSampleData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  reviews,
  inquiries,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onDeleteReview,
  onUpdateInquiryStatus,
  onResetSampleData,
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'inquiries' | 'reviews'>('products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form State for Add / Edit
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<Product['category']>('gates');
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState<number>(5000);
  const [formUnit, setFormUnit] = useState<Product['priceUnit']>('per sq.ft');
  const [formThickness, setFormThickness] = useState('2.0mm - 6.0mm');
  const [formKerf, setFormKerf] = useState('±0.04 mm');
  const [formPower, setFormPower] = useState('4kW Fiber Laser');
  const [formTech, setFormTech] = useState<Product['detailedSpecs']['cuttingTechnology']>(
    'Fiber Laser (High Precision)'
  );
  const [formMaxSheet, setFormMaxSheet] = useState('1500mm x 3000mm');
  const [formComplexity, setFormComplexity] = useState<Product['detailedSpecs']['cutComplexity']>(
    'Fine Precision'
  );
  const [formIsNew, setFormIsNew] = useState(true);
  const [formImageUrl, setFormImageUrl] = useState('');

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory('gates');
    setFormDescription('');
    setFormPrice(4500);
    setFormUnit('per sq.ft');
    setFormThickness('2.0mm - 6.0mm');
    setFormKerf('±0.04 mm');
    setFormPower('4kW Fiber');
    setFormTech('Fiber Laser (High Precision)');
    setFormMaxSheet('1500mm x 3000mm');
    setFormComplexity('Fine Precision');
    setFormIsNew(true);
    setFormImageUrl('/src/assets/images/laser_cut_gate_1794161596501.jpg');
    setIsCreating(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormCategory(p.category);
    setFormDescription(p.description);
    setFormPrice(p.basePrice);
    setFormUnit(p.priceUnit);
    setFormThickness(p.detailedSpecs.sheetThicknessRange);
    setFormKerf(p.detailedSpecs.kerfTolerance);
    setFormPower(p.detailedSpecs.recommendedLaserPower);
    setFormTech(p.detailedSpecs.cuttingTechnology);
    setFormMaxSheet(p.detailedSpecs.maxSheetDimensions);
    setFormComplexity(p.detailedSpecs.cutComplexity);
    setFormIsNew(p.isNewArrival);
    setFormImageUrl(p.images[0] || '');
    setIsCreating(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingProduct) {
      const updated: Product = {
        ...editingProduct,
        name: formName.trim(),
        category: formCategory,
        description: formDescription.trim(),
        basePrice: Number(formPrice),
        priceUnit: formUnit,
        isNewArrival: formIsNew,
        images: formImageUrl ? [formImageUrl] : editingProduct.images,
        detailedSpecs: {
          ...editingProduct.detailedSpecs,
          sheetThicknessRange: formThickness,
          kerfTolerance: formKerf,
          recommendedLaserPower: formPower,
          cuttingTechnology: formTech,
          maxSheetDimensions: formMaxSheet,
          cutComplexity: formComplexity,
        },
      };
      onUpdateProduct(updated);
    } else {
      const newProduct: Product = {
        id: `prod-${Date.now().toString().slice(-4)}`,
        name: formName.trim(),
        category: formCategory,
        description: formDescription.trim(),
        basePrice: Number(formPrice),
        priceUnit: formUnit,
        isNewArrival: formIsNew,
        inStock: true,
        createdAt: new Date().toISOString().split('T')[0],
        rating: 5.0,
        reviewCount: 0,
        images: [formImageUrl || '/src/assets/images/laser_jali_screen_1794161594333.jpg'],
        cadPreviewSvgPath: formCategory === 'jali' ? 'jali-hex' : 'gate-parametric',
        vectorFormats: ['DXF', 'DWG', 'SVG'],
        materialOptions: [
          'Mild Steel (CR/HR)',
          'Stainless Steel 304',
          'Aluminum 5052/6061',
        ],
        detailedSpecs: {
          sheetThicknessRange: formThickness,
          kerfTolerance: formKerf,
          recommendedLaserPower: formPower,
          cuttingTechnology: formTech,
          maxSheetDimensions: formMaxSheet,
          cutComplexity: formComplexity,
          nestingEfficiency: '88%',
        },
      };
      onAddProduct(newProduct);
    }
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      {/* Header and Quick Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="text-xs font-mono text-amber-500 uppercase tracking-widest mb-1">
            Shop Operations & CAD Library
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-100 tracking-tight">
            Fabrication Admin Dashboard
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onResetSampleData}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 hover:text-neutral-200 bg-neutral-900 border border-neutral-800 rounded-lg transition-colors"
          >
            <RefreshCw size={13} />
            <span>Reset Demo Data</span>
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-lg transition-colors shadow-sm"
          >
            <Plus size={15} />
            <span>Add New Laser Design</span>
          </button>
        </div>
      </div>

      {/* Admin Tab Switcher */}
      <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800 w-fit text-xs">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'products'
              ? 'bg-neutral-800 text-amber-400 shadow'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <span>Catalog Items ({products.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('inquiries')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'inquiries'
              ? 'bg-neutral-800 text-amber-400 shadow'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <span>Quotes & RFQs ({inquiries.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'reviews'
              ? 'bg-neutral-800 text-amber-400 shadow'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <span>Customer Reviews ({reviews.length})</span>
        </button>
      </div>

      {/* PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-950 border-b border-neutral-800 text-neutral-400 font-mono uppercase tracking-wider">
                <tr>
                  <th className="p-4">Item & Preview</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Pricing</th>
                  <th className="p-4">Laser Specs</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/80">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-800/30 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 object-cover rounded-lg border border-neutral-800 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-neutral-100 flex items-center gap-2">
                          <span>{p.name}</span>
                          {p.isNewArrival && (
                            <span className="text-[9px] bg-amber-500/20 text-amber-400 border border-amber-500/40 px-1.5 py-0.2 rounded font-mono">
                              NEW
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-neutral-400 font-mono">
                          ID: {p.id} · {p.vectorFormats.join(', ')}
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="capitalize text-neutral-300 font-mono">
                        {p.category}
                      </span>
                    </td>

                    <td className="p-4 font-mono font-bold text-amber-400">
                      <div>{formatTaka(p.basePrice)}</div>
                      <div className="text-[10px] text-neutral-500 font-sans font-normal">
                        {formatPriceUnit(p.priceUnit)}
                      </div>
                    </td>

                    <td className="p-4 text-neutral-300 space-y-0.5 font-mono text-[11px]">
                      <div>{p.detailedSpecs.sheetThicknessRange}</div>
                      <div className="text-neutral-500">{p.detailedSpecs.recommendedLaserPower}</div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1 text-amber-400 font-mono">
                        <Star size={12} className="fill-amber-400" />
                        <span>{p.rating}</span>
                        <span className="text-neutral-500 text-[10px]">({p.reviewCount})</span>
                      </div>
                    </td>

                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 text-neutral-400 hover:text-amber-400 hover:bg-neutral-800 rounded transition-colors"
                        title="Edit Item"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => onDeleteProduct(p.id)}
                        className="p-1.5 text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 rounded transition-colors"
                        title="Delete Item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* INQUIRIES TAB */}
      {activeTab === 'inquiries' && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-950 border-b border-neutral-800 text-neutral-400 font-mono uppercase tracking-wider">
                <tr>
                  <th className="p-4">RFQ ID & Date</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Product & Alloy</th>
                  <th className="p-4">Dimensions</th>
                  <th className="p-4">Est. Total</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/80">
                {inquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-neutral-800/30 transition-colors">
                    <td className="p-4 font-mono">
                      <div className="font-bold text-neutral-200">#{inq.id}</div>
                      <div className="text-[10px] text-neutral-500">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-neutral-200">{inq.customerName}</div>
                      <div className="text-[11px] text-neutral-400">{inq.email}</div>
                      {inq.company && (
                        <div className="text-[10px] text-neutral-500">{inq.company}</div>
                      )}
                    </td>

                    <td className="p-4">
                      <div className="text-neutral-200 font-medium">{inq.productName}</div>
                      <div className="text-[11px] text-amber-500/90 font-mono">
                        {inq.material} · {inq.thickness}
                      </div>
                    </td>

                    <td className="p-4 font-mono text-neutral-300">
                      {inq.dimensions.width} x {inq.dimensions.height} {inq.dimensions.unit} (Qty:{' '}
                      {inq.quantity})
                    </td>

                    <td className="p-4 font-mono font-bold text-amber-400">
                      {formatTaka(inq.estimatedTotal)}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                          inq.status === 'Approved'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : inq.status === 'Quoted'
                            ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                            : inq.status === 'Reviewing'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : 'bg-neutral-800 text-neutral-300'
                        }`}
                      >
                        {inq.status}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <select
                        value={inq.status}
                        onChange={(e) =>
                          onUpdateInquiryStatus(inq.id, e.target.value as QuoteInquiry['status'])
                        }
                        className="bg-neutral-950 border border-neutral-700 text-neutral-200 rounded px-2 py-1 text-xs focus:outline-none"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Reviewing">Reviewing</option>
                        <option value="Quoted">Quoted</option>
                        <option value="Approved">Approved</option>
                        <option value="In Production">In Production</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REVIEWS TAB */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-400 font-mono text-xs">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={i < rev.rating ? 'fill-amber-400' : 'text-neutral-700'}
                        />
                      ))}
                      <span className="font-bold ml-1">{rev.rating}.0</span>
                    </div>

                    <button
                      onClick={() => onDeleteReview(rev.id)}
                      className="text-neutral-500 hover:text-rose-400 transition-colors"
                      title="Delete review"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  <h4 className="text-xs font-bold text-neutral-200">{rev.title}</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">{rev.comment}</p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-neutral-500 border-t border-neutral-800 pt-2 font-mono">
                  <span>{rev.authorName}</span>
                  <span>{rev.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE / EDIT PRODUCT MODAL */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-6">
            <div className="flex items-center justify-between p-5 border-b border-neutral-800 bg-neutral-950">
              <h3 className="text-base font-bold text-neutral-100 font-mono">
                {editingProduct ? 'Edit Catalog Item' : 'Add Laser Cutting Catalog Item'}
              </h3>
              <button
                onClick={() => setIsCreating(false)}
                className="text-neutral-400 hover:text-neutral-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div>
                <label className="block text-neutral-300 font-medium mb-1">
                  Design Name <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Parametric Ripple Balustrade Screen"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value="gates">Gates & Railings</option>
                    <option value="jali">Jali / Facade Screens</option>
                    <option value="signage">Signage & Lettering</option>
                    <option value="wall-art">Wall Decor & Panels</option>
                    <option value="industrial">Industrial Parts</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-neutral-300 font-medium mb-1">প্রারম্ভিক দাম / Base Price (৳ টাকা)</label>
                    <input
                      type="number"
                      required
                      value={formPrice}
                      onChange={(e) => setFormPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-100 focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 font-medium mb-1">Price Unit</label>
                    <select
                      value={formUnit}
                      onChange={(e) => setFormUnit(e.target.value as any)}
                      className="px-2 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-100 focus:outline-none focus:border-amber-400"
                    >
                      <option value="per sq.ft">per sq.ft</option>
                      <option value="per piece">per piece</option>
                      <option value="per sheet">per sheet</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Architectural purpose, structural frame details, nesting, and application..."
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Thickness Range</label>
                  <input
                    type="text"
                    value={formThickness}
                    onChange={(e) => setFormThickness(e.target.value)}
                    placeholder="e.g. 1.6mm - 6.0mm"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-100 font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Kerf Tolerance</label>
                  <input
                    type="text"
                    value={formKerf}
                    onChange={(e) => setFormKerf(e.target.value)}
                    placeholder="e.g. ±0.04 mm"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-100 font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Recommended Laser</label>
                  <input
                    type="text"
                    value={formPower}
                    onChange={(e) => setFormPower(e.target.value)}
                    placeholder="e.g. 4kW - 8kW Fiber Laser"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Max Sheet Dimension</label>
                  <input
                    type="text"
                    value={formMaxSheet}
                    onChange={(e) => setFormMaxSheet(e.target.value)}
                    placeholder="1500mm x 3000mm"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-100 font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Image Asset Path */}
              <div>
                <label className="block text-neutral-300 font-medium mb-1">
                  Product Image Asset Path / URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    placeholder="/src/assets/images/laser_..."
                    className="flex-1 px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-100 font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setFormImageUrl('/src/assets/images/laser_jali_screen_1794161594333.jpg')}
                    className="text-[10px] bg-neutral-800 text-neutral-300 px-2 py-1 rounded"
                  >
                    Use Jali Image
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormImageUrl('/src/assets/images/laser_cut_gate_1794161596501.jpg')}
                    className="text-[10px] bg-neutral-800 text-neutral-300 px-2 py-1 rounded"
                  >
                    Use Gate Image
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormImageUrl('/src/assets/images/laser_backlit_sign_1794161595680.jpg')}
                    className="text-[10px] bg-neutral-800 text-neutral-300 px-2 py-1 rounded"
                  >
                    Use Sign Image
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormImageUrl('/src/assets/images/laser_wall_art_1794161595453.jpg')}
                    className="text-[10px] bg-neutral-800 text-neutral-300 px-2 py-1 rounded"
                  >
                    Use Wall Art Image
                  </button>
                </div>
              </div>

              {/* New Arrival Checkbox */}
              <label className="flex items-center gap-2 text-neutral-300 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={formIsNew}
                  onChange={(e) => setFormIsNew(e.target.checked)}
                  className="rounded bg-neutral-800 border-neutral-700 text-amber-500"
                />
                <span>Feature in "New Arrivals" vector feed</span>
              </label>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 text-neutral-400 hover:text-neutral-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg transition-colors"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
