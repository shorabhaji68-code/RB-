export type ProductCategory = 'all' | 'gates' | 'jali' | 'signage' | 'wall-art' | 'industrial';

export type MetalMaterial =
  | 'Mild Steel (CR/HR)'
  | 'Stainless Steel 304'
  | 'Stainless Steel 316L'
  | 'Corten Weathering Steel'
  | 'Solid Architectural Brass'
  | 'Aluminum 5052/6061'
  | 'Cast Acrylic'
  | 'Birch Plywood / MDF';

export type CuttingTechnology = 'Fiber Laser (High Precision)' | 'CO2 Laser' | 'CNC Plasma' | 'Waterjet Precision';

export type SurfaceFinish =
  | 'Raw / Mill Finish'
  | 'Matte Black Powder Coat'
  | 'Brushed Satin Finish'
  | 'Accelerated Rust Patina'
  | 'Mirror Polish'
  | 'Champagne Gold Anodized'
  | 'Clear Coat Sealed';

export interface ProductReview {
  id: string;
  productId: string;
  authorName: string;
  authorLocation?: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  projectApplication: string; // e.g. "Residential Main Gate", "Restaurant Partition"
  finishChosen: SurfaceFinish;
  date: string;
  helpfulCount: number;
  userLiked?: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: Exclude<ProductCategory, 'all'>;
  description: string;
  detailedSpecs: {
    sheetThicknessRange: string; // e.g. "1.6mm - 12.0mm"
    kerfTolerance: string; // e.g. "±0.05 mm"
    recommendedLaserPower: string; // e.g. "3kW - 6kW Fiber"
    cuttingTechnology: CuttingTechnology;
    maxSheetDimensions: string; // e.g. "1500mm x 3000mm (5ft x 10ft)"
    cutComplexity: 'Standard' | 'Fine Precision' | 'Ultra-Intricate Geometric';
    nestingEfficiency: string; // e.g. "88%"
  };
  materialOptions: MetalMaterial[];
  basePrice: number;
  priceUnit: 'per sq.ft' | 'per piece' | 'per sheet';
  images: string[];
  cadPreviewSvgPath?: string;
  isNewArrival: boolean;
  vectorFormats: ('DXF' | 'DWG' | 'SVG' | 'STEP' | 'PDF')[];
  inStock: boolean;
  createdAt: string;
  rating: number; // computed average
  reviewCount: number;
}

export interface QuoteInquiry {
  id: string;
  productId: string;
  productName: string;
  category: string;
  customerName: string;
  email: string;
  phone: string;
  company?: string;
  dimensions: {
    width: number;
    height: number;
    unit: 'mm' | 'inches' | 'feet';
  };
  material: MetalMaterial;
  thickness: string;
  finish: SurfaceFinish;
  quantity: number;
  estimatedTotal: number;
  cadFileName?: string;
  projectNotes: string;
  status: 'Pending' | 'Reviewing' | 'Quoted' | 'Approved' | 'In Production';
  createdAt: string;
}
