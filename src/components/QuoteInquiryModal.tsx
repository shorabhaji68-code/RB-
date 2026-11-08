import React, { useState } from 'react';
import { Product, MetalMaterial, SurfaceFinish, QuoteInquiry } from '../types/catalog';
import { formatTaka } from '../utils/formatters';
import { X, Calculator, Upload, CheckCircle, Send, MessageCircle, FileText, ArrowRight } from 'lucide-react';

interface QuoteInquiryModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onSubmitInquiry: (inquiry: QuoteInquiry) => void;
}

export const QuoteInquiryModal: React.FC<QuoteInquiryModalProps> = ({
  product,
  isOpen,
  onClose,
  onSubmitInquiry,
}) => {
  if (!isOpen) return null;

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');

  // Dimensions
  const [width, setWidth] = useState<number>(1200);
  const [height, setHeight] = useState<number>(2400);
  const [unit, setUnit] = useState<'mm' | 'inches' | 'feet'>('mm');

  // Specs
  const [material, setMaterial] = useState<MetalMaterial>(
    product.materialOptions[0] || 'Mild Steel (CR/HR)'
  );
  const [thickness, setThickness] = useState<string>('3.0 mm');
  const [finish, setFinish] = useState<SurfaceFinish>('Matte Black Powder Coat');
  const [quantity, setQuantity] = useState<number>(1);
  const [cadFileName, setCadFileName] = useState<string>('');
  const [projectNotes, setProjectNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [lastInquiryId, setLastInquiryId] = useState('');

  // Calculate Square Feet and Estimated Price
  const widthInInches = unit === 'mm' ? width / 25.4 : unit === 'feet' ? width * 12 : width;
  const heightInInches = unit === 'mm' ? height / 25.4 : unit === 'feet' ? height * 12 : height;
  const areaSqFt = Math.max(0.5, ((widthInInches * heightInInches) / 144));

  // Multiplier by material
  const materialMultipliers: Record<string, number> = {
    'Mild Steel (CR/HR)': 1.0,
    'Stainless Steel 304': 1.6,
    'Stainless Steel 316L': 2.1,
    'Corten Weathering Steel': 1.4,
    'Solid Architectural Brass': 3.2,
    'Aluminum 5052/6061': 1.35,
    'Cast Acrylic': 0.9,
    'Birch Plywood / MDF': 0.75,
  };

  const matMultiplier = materialMultipliers[material] || 1.0;
  const finishFee = finish === 'Raw / Mill Finish' ? 0 : 350 * areaSqFt;
  const unitEstimatedPrice = Math.round(
    (product.priceUnit === 'per sq.ft'
      ? product.basePrice * areaSqFt * matMultiplier + finishFee
      : product.basePrice * matMultiplier + finishFee)
  );
  const totalEstimatedPrice = unitEstimatedPrice * Math.max(1, quantity);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCadFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !email.trim()) return;

    const newId = `rfq-${Date.now().toString().slice(-4)}`;
    const newInquiry: QuoteInquiry = {
      id: newId,
      productId: product.id,
      productName: product.name,
      category: product.category,
      customerName: customerName.trim(),
      email: email.trim(),
      phone: phone.trim() || 'N/A',
      company: company.trim() || undefined,
      dimensions: {
        width: Number(width),
        height: Number(height),
        unit,
      },
      material,
      thickness,
      finish,
      quantity: Number(quantity),
      estimatedTotal: totalEstimatedPrice,
      cadFileName: cadFileName || undefined,
      projectNotes: projectNotes.trim() || 'Standard laser cutting specs',
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    onSubmitInquiry(newInquiry);
    setLastInquiryId(newId);
    setSubmitted(true);
  };

  const generateWhatsAppMessage = () => {
    const text = `Hi RB Laser Cutting team! I want to request a custom laser cutting quote:%0A%0A*Item:* ${product.name}%0A*Size:* ${width} x ${height} ${unit} (${areaSqFt.toFixed(1)} sq.ft)%0A*Material:* ${material} (${thickness})%0A*Finish:* ${finish}%0A*Quantity:* ${quantity} unit(s)%0A*Est. Total:* ৳${totalEstimatedPrice.toLocaleString()} টাকা%0A*Customer:* ${customerName} (${email})%0A*Notes:* ${projectNotes || 'None'}`;
    return `https://wa.me/?text=${text}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-800 bg-neutral-950">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-amber-500 font-mono text-xs uppercase tracking-wider font-bold">
                RB Laser Cutting · RFQ
              </span>
              <span className="text-neutral-500">·</span>
              <span className="text-neutral-400 text-xs font-mono">{product.detailedSpecs.cuttingTechnology}</span>
            </div>
            <h3 className="text-base font-bold text-neutral-100">{product.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-100 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-14 h-14 bg-emerald-950/80 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle size={28} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-neutral-100">Inquiry Logged #{lastInquiryId}</h4>
              <p className="text-xs text-neutral-400 mt-1 max-w-md mx-auto">
                Your laser fabrication RFQ has been routed to the RB Laser Cutting CNC engineering team. We estimate a formal CAM nesting breakdown within 2-4 business hours.
              </p>
            </div>

            <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl text-left max-w-md mx-auto text-xs space-y-1.5 font-mono">
              <div className="flex justify-between text-neutral-400">
                <span>Material & Thickness:</span>
                <span className="text-neutral-200">{material} ({thickness})</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Total Net Area:</span>
                <span className="text-neutral-200">{areaSqFt.toFixed(2)} sq.ft</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Estimated Budget:</span>
                <span className="text-amber-400 font-bold">{formatTaka(totalEstimatedPrice)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                href={generateWhatsAppMessage()}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-neutral-100 rounded-lg text-xs font-semibold transition-colors"
              >
                <MessageCircle size={15} />
                <span>Dispatch to Fab via WhatsApp</span>
              </a>
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-semibold transition-colors"
              >
                Return to Catalog
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-5 max-h-[80vh] overflow-y-auto">
            {/* Dimensions & Calculator Row */}
            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Calculator size={14} className="text-amber-400" />
                  Custom Dimensions & Area
                </span>
                <div className="flex rounded-md bg-neutral-900 p-0.5 border border-neutral-800 text-[11px]">
                  {(['mm', 'inches', 'feet'] as const).map((u) => (
                    <button
                      type="button"
                      key={u}
                      onClick={() => setUnit(u)}
                      className={`px-2 py-0.5 rounded transition-colors ${
                        unit === u ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400'
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">Width</label>
                  <input
                    type="number"
                    min="10"
                    value={width}
                    onChange={(e) => setWidth(Math.max(1, Number(e.target.value)))}
                    className="w-full px-2.5 py-1.5 text-xs bg-neutral-900 border border-neutral-700 rounded-lg text-neutral-100 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">Height</label>
                  <input
                    type="number"
                    min="10"
                    value={height}
                    onChange={(e) => setHeight(Math.max(1, Number(e.target.value)))}
                    className="w-full px-2.5 py-1.5 text-xs bg-neutral-900 border border-neutral-700 rounded-lg text-neutral-100 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">Calculated Area</label>
                  <div className="px-2.5 py-1.5 text-xs bg-neutral-900/60 border border-neutral-800 rounded-lg text-amber-400 font-mono">
                    {areaSqFt.toFixed(2)} sq.ft
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-full px-2.5 py-1.5 text-xs bg-neutral-900 border border-neutral-700 rounded-lg text-neutral-100 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Material & Finish Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-neutral-300 font-medium mb-1">
                  Sheet Material <span className="text-amber-400">*</span>
                </label>
                <select
                  value={material}
                  onChange={(e) => setMaterial(e.target.value as MetalMaterial)}
                  className="w-full px-2.5 py-2 text-xs bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-100 focus:outline-none focus:border-amber-400"
                >
                  {product.materialOptions.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-neutral-300 font-medium mb-1">
                  Thickness Spec <span className="text-amber-400">*</span>
                </label>
                <select
                  value={thickness}
                  onChange={(e) => setThickness(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-100 focus:outline-none focus:border-amber-400 font-mono"
                >
                  <option value="1.2 mm">1.2 mm (18 Ga) - Fine Facade</option>
                  <option value="2.0 mm">2.0 mm (14 Ga) - Screens & Sign</option>
                  <option value="3.0 mm">3.0 mm (11 Ga) - Standard Heavy</option>
                  <option value="4.0 mm">4.0 mm (8 Ga) - Gate Leaf</option>
                  <option value="6.0 mm">6.0 mm (1/4 in) - Structural</option>
                  <option value="10.0 mm">10.0 mm (3/8 in) - Heavy Bracket</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-neutral-300 font-medium mb-1">
                  Post-Cut Surface Finish
                </label>
                <select
                  value={finish}
                  onChange={(e) => setFinish(e.target.value as SurfaceFinish)}
                  className="w-full px-2.5 py-2 text-xs bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-100 focus:outline-none focus:border-amber-400"
                >
                  <option value="Matte Black Powder Coat">Matte Black Powder Coat</option>
                  <option value="Raw / Mill Finish">Raw / Mill Finish (Self-Finish)</option>
                  <option value="Brushed Satin Finish">Brushed Satin Finish</option>
                  <option value="Accelerated Rust Patina">Accelerated Rust Patina</option>
                  <option value="Champagne Gold Anodized">Champagne Gold Anodized</option>
                  <option value="Mirror Polish">Mirror Polish</option>
                </select>
              </div>
            </div>

            {/* CAD File Upload (Optional) */}
            <div>
              <label className="block text-[11px] text-neutral-300 font-medium mb-1 flex items-center justify-between">
                <span>Upload Custom CAD Drawing (Optional DXF / DWG / PDF)</span>
                {cadFileName && (
                  <span className="text-cyan-400 font-mono text-[10px] flex items-center gap-1">
                    <FileText size={12} />
                    {cadFileName}
                  </span>
                )}
              </label>
              <label className="border border-dashed border-neutral-700 hover:border-amber-500/50 bg-neutral-950/50 rounded-xl p-3 flex items-center justify-center gap-3 cursor-pointer transition-colors">
                <Upload size={16} className="text-neutral-400" />
                <span className="text-xs text-neutral-400">
                  {cadFileName ? 'Replace attached drawing' : 'Click to select or drag DXF / DWG / PDF files'}
                </span>
                <input
                  type="file"
                  accept=".dxf,.dwg,.pdf,.step,.svg"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">
                  Contact Name <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Samuel Green"
                  className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">
                  Work Email <span className="text-amber-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="samuel@archbuild.com"
                  className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">Phone / WhatsApp</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">Company / Studio</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Optional architectural firm"
                  className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-neutral-400 mb-1">
                Specific Tolerances or Fabrication Notes
              </label>
              <textarea
                rows={2}
                value={projectNotes}
                onChange={(e) => setProjectNotes(e.target.value)}
                placeholder="Countersunk holes, edge beveling, lead time urgency, delivery destination..."
                className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Real-time Calculation Summary Bar */}
            <div className="flex items-center justify-between p-3.5 bg-neutral-950 border border-neutral-800 rounded-xl">
              <div>
                <div className="text-[11px] text-neutral-400 font-medium">আনুমানিক মোট খরচ (Estimated Total):</div>
                <div className="text-lg sm:text-xl font-extrabold text-amber-400 font-mono">
                  {formatTaka(totalEstimatedPrice)}{' '}
                  <span className="text-xs text-neutral-500 font-normal">
                    ({formatTaka(unitEstimatedPrice, false)} / ইউনিট)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs text-neutral-400 hover:text-neutral-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold rounded-lg transition-colors shadow-sm"
                >
                  <span>Submit RFQ</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
