import React, { useState } from 'react';
import { X, Copy, Check, Database, Server, Smartphone, BookOpen, Layers } from 'lucide-react';

interface ArchitectureDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureDocsModal: React.FC<ArchitectureDocsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'firestore' | 'sql' | 'react-native' | 'flutter' | 'setup-guide'>('firestore');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const firestoreSchemaText = `// ===============================================================
// FIREBASE FIRESTORE DATA MODEL & SECURITY RULES
// Database Architecture: Laser Cutting & Fabrication Catalog App
// ===============================================================

// 1. COLLECTION: 'categories'
// Document ID: auto-generated or slug (e.g. 'gates', 'jali')
{
  "id": "jali",
  "name": "Architectural Jali & Facades",
  "slug": "jali",
  "iconName": "Grid3X3",
  "sortOrder": 1,
  "isActive": true
}

// 2. COLLECTION: 'products'
// Document ID: e.g. 'prod-jali-01'
{
  "id": "prod-jali-01",
  "name": "Mashrabiya Hex Architectural Screen",
  "category": "jali",
  "description": "Modular interior partition and exterior sunshade facade screen...",
  "basePrice": 4200.00, // ৳ ৪,২০০ টাকা
  "priceUnit": "per sq.ft", // "প্রতি বর্গফুট" | "প্রতি পিস" | "প্রতি শিট"
  "detailedSpecs": {
    "sheetThicknessRange": "1.6mm - 4.0mm",
    "kerfTolerance": "±0.03 mm",
    "recommendedLaserPower": "3kW - 6kW Fiber Laser",
    "cuttingTechnology": "Fiber Laser (High Precision)",
    "maxSheetDimensions": "1500mm x 3000mm",
    "cutComplexity": "Ultra-Intricate Geometric",
    "nestingEfficiency": "91%"
  },
  "materialOptions": [
    "Solid Architectural Brass",
    "Stainless Steel 304",
    "Aluminum 5052/6061",
    "Mild Steel (CR/HR)"
  ],
  "images": [
    "https://storage.googleapis.com/laser-fab-bucket/jali-01-main.jpg",
    "https://storage.googleapis.com/laser-fab-bucket/jali-01-detail.jpg"
  ],
  "cadVectorPreviewPath": "jali-hex",
  "vectorFormats": ["DXF", "DWG", "SVG"],
  "isNewArrival": true,
  "inStock": true,
  "rating": 4.85,           // Denormalized aggregate average (1.00 - 5.00)
  "reviewCount": 22,         // Denormalized total reviews count
  "createdAt": "2026-10-24T10:00:00Z",
  "updatedAt": "2026-11-08T12:00:00Z"
}

// 3. SUBCOLLECTION: 'products/{productId}/reviews/{reviewId}'
// Document ID: auto-generated (e.g. 'rev-9921')
{
  "id": "rev-9921",
  "productId": "prod-jali-01",
  "userId": "usr_auth_8829",
  "authorName": "Elena Rostova",
  "authorLocation": "Chicago, IL",
  "rating": 5,              // Integer: 1, 2, 3, 4, 5
  "title": "Turned a dark hotel atrium into an illuminated jewel",
  "comment": "Specified this hex jali in 3mm solid architectural brass with brushed satin...",
  "verifiedPurchase": true,
  "projectApplication": "Hotel Lobby Partition Screen",
  "finishChosen": "Brushed Satin Finish",
  "helpfulCount": 24,
  "createdAt": "2026-10-30T14:22:00Z"
}

// 4. COLLECTION: 'quote_inquiries' (RFQs)
// Document ID: e.g. 'rfq-1049'
{
  "id": "rfq-1049",
  "productId": "prod-jali-01",
  "productName": "Mashrabiya Hex Architectural Screen",
  "customerName": "Claire Beaumont",
  "email": "c.beaumont@archdesign.com",
  "phone": "+1 (555) 382-9912",
  "company": "Beaumont Studio Architecture",
  "dimensions": {
    "width": 1200,
    "height": 2400,
    "unit": "mm"
  },
  "material": "Solid Architectural Brass",
  "thickness": "3.0 mm",
  "finish": "Brushed Satin Finish",
  "quantity": 6,
  "estimatedTotal": 285000.00, // ৳ ২,৮৫,০০০ টাকা
  "cadStorageUrl": "gs://laser-fab-bucket/cad_uploads/rfq-1049.dxf",
  "projectNotes": "Countersunk holes along perimeter",
  "status": "Quoted", // 'Pending' | 'Reviewing' | 'Quoted' | 'Approved' | 'In Production'
  "createdAt": "2026-11-06T14:20:00Z"
}

// -----------------------------------------------------------------
// PRODUCTION FIRESTORE SECURITY RULES (firestore.rules)
// -----------------------------------------------------------------
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Public read for catalog items
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.role == 'admin';

      // Reviews subcollection
      match /reviews/{reviewId} {
        allow read: if true;
        allow create: if request.auth != null 
          && request.resource.data.rating >= 1 
          && request.resource.data.rating <= 5
          && request.resource.data.authorName is string;
        allow update, delete: if request.auth != null && (
          request.auth.uid == resource.data.userId || 
          request.auth.token.role == 'admin'
        );
      }
    }

    // Customers can submit RFQ quote inquiries
    match /quote_inquiries/{inquiryId} {
      allow create: if request.resource.data.customerName is string
                    && request.resource.data.email is string;
      allow read, update, delete: if request.auth != null && request.auth.token.role == 'admin';
    }
  }
}`;

  const sqlSchemaText = `-- ===============================================================
-- POSTGRESQL RELATIONAL DATABASE SCHEMA (DDL)
-- Laser Cutting & Fabrication Catalog App
-- ===============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Categories Table
CREATE TABLE categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Products Table
CREATE TABLE products (
    id VARCHAR(50) PRIMARY KEY,
    category_id VARCHAR(50) NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    base_price NUMERIC(10, 2) NOT NULL CHECK (base_price >= 0),
    price_unit VARCHAR(20) NOT NULL DEFAULT 'per sq.ft', -- 'per sq.ft', 'per piece', 'per sheet'
    
    -- Technical Specs
    thickness_range VARCHAR(50) NOT NULL,    -- e.g. '1.6mm - 6.0mm'
    kerf_tolerance VARCHAR(30) NOT NULL,     -- e.g. '±0.03 mm'
    cutting_tech VARCHAR(50) NOT NULL,       -- 'Fiber Laser', 'CO2', 'Waterjet'
    laser_power_rec VARCHAR(50) NOT NULL,    -- '3kW - 6kW Fiber Laser'
    max_dimensions VARCHAR(100) NOT NULL,    -- '1500mm x 3000mm'
    cut_complexity VARCHAR(50) NOT NULL,     -- 'Standard', 'Fine', 'Ultra-Intricate'
    nesting_efficiency VARCHAR(20) DEFAULT '88%',
    
    cad_preview_path VARCHAR(100),
    vector_formats TEXT[] DEFAULT ARRAY['DXF', 'DWG', 'SVG'],
    is_new_arrival BOOLEAN DEFAULT FALSE,
    in_stock BOOLEAN DEFAULT TRUE,
    
    -- Denormalized Review Metrics
    average_rating NUMERIC(3, 2) DEFAULT 0.00,
    review_count INT DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexing for high-speed catalog filtering
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_new_arrival ON products(is_new_arrival);
CREATE INDEX idx_products_price ON products(base_price);

-- 3. Product Images Table
CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id VARCHAR(50) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text VARCHAR(255),
    display_order INT DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Product Material Compatibility Table
CREATE TABLE product_materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id VARCHAR(50) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    material_name VARCHAR(100) NOT NULL, -- e.g. 'Solid Architectural Brass', 'Corten Steel'
    cost_multiplier NUMERIC(4, 2) DEFAULT 1.00
);

-- 5. User Reviews and Ratings Table
CREATE TABLE product_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id VARCHAR(50) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID,
    author_name VARCHAR(120) NOT NULL,
    author_location VARCHAR(120),
    rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200) NOT NULL,
    comment TEXT NOT NULL,
    verified_purchase BOOLEAN DEFAULT FALSE,
    project_application VARCHAR(150), -- e.g. 'Driveway Gate', 'Lobby Partition'
    finish_chosen VARCHAR(100) NOT NULL,
    helpful_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reviews_product ON product_reviews(product_id);

-- Trigger to recompute average rating automatically
CREATE OR REPLACE FUNCTION update_product_rating() 
RETURNS TRIGGER AS $$
BEGIN
    UPDATE products
    SET average_rating = COALESCE((
            SELECT ROUND(AVG(rating), 2) 
            FROM product_reviews 
            WHERE product_id = NEW.product_id
        ), 0.00),
        review_count = (
            SELECT COUNT(*) 
            FROM product_reviews 
            WHERE product_id = NEW.product_id
        )
    WHERE id = NEW.product_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_after_review_insert
AFTER INSERT OR UPDATE OR DELETE ON product_reviews
FOR EACH ROW EXECUTE FUNCTION update_product_rating();

-- 6. Quote Inquiries (RFQs) Table
CREATE TABLE quote_inquiries (
    id VARCHAR(30) PRIMARY KEY,
    product_id VARCHAR(50) REFERENCES products(id) ON DELETE SET NULL,
    customer_name VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(50),
    company VARCHAR(150),
    dimension_width NUMERIC(10, 2) NOT NULL,
    dimension_height NUMERIC(10, 2) NOT NULL,
    dimension_unit VARCHAR(10) NOT NULL, -- 'mm', 'inches', 'feet'
    material VARCHAR(100) NOT NULL,
    thickness VARCHAR(50) NOT NULL,
    surface_finish VARCHAR(100) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    estimated_total NUMERIC(12, 2) NOT NULL,
    cad_file_url TEXT,
    project_notes TEXT,
    status VARCHAR(30) DEFAULT 'Pending', -- 'Pending', 'Reviewing', 'Quoted', 'Approved'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_inquiries_status ON quote_inquiries(status);
CREATE INDEX idx_inquiries_created_at ON quote_inquiries(created_at DESC);`;

  const reactNativeCode = `// ===============================================================
// REACT NATIVE / EXPO PRODUCTION IMPLEMENTATION
// File: src/screens/ProductDetailScreen.tsx
// ===============================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import firestore from '@react-native-firebase/firestore';

interface Review {
  id: string;
  authorName: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  projectApplication: string;
  finishChosen: string;
  date: string;
}

export const ProductDetailScreen = ({ route, navigation }: any) => {
  const { productId } = route.params;
  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isReviewModalVisible, setReviewModalVisible] = useState(false);

  // Review form states
  const [newRating, setNewRating] = useState(5);
  const [newAuthor, setNewAuthor] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newApp, setNewApp] = useState('');

  useEffect(() => {
    // 1. Fetch Product Realtime
    const unsubscribeProduct = firestore()
      .collection('products')
      .doc(productId)
      .onSnapshot((doc) => {
        if (doc.exists) {
          setProduct({ id: doc.id, ...doc.data() });
        }
        setLoading(false);
      });

    // 2. Fetch Reviews Subcollection Realtime
    const unsubscribeReviews = firestore()
      .collection('products')
      .doc(productId)
      .collection('reviews')
      .orderBy('createdAt', 'desc')
      .onSnapshot((querySnapshot) => {
        const revs: Review[] = [];
        querySnapshot.forEach((doc) => {
          revs.push({ id: doc.id, ...(doc.data() as any) });
        });
        setReviews(revs);
      });

    return () => {
      unsubscribeProduct();
      unsubscribeReviews();
    };
  }, [productId]);

  const handlePostReview = async () => {
    if (!newAuthor || !newComment || !newTitle) return;

    try {
      await firestore()
        .collection('products')
        .doc(productId)
        .collection('reviews')
        .add({
          authorName: newAuthor,
          rating: newRating,
          title: newTitle,
          comment: newComment,
          verifiedPurchase: true,
          projectApplication: newApp || 'Custom Laser Fabrication',
          finishChosen: 'Matte Black Powder Coat',
          createdAt: firestore.FieldValue.serverTimestamp(),
        });

      setReviewModalVisible(false);
      setNewComment('');
      setNewTitle('');
    } catch (err) {
      console.error('Error posting review:', err);
    }
  };

  if (loading || !product) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#F59E0B" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Product Image Lead */}
      <Image source={{ uri: product.images[0] }} style={styles.heroImage} />

      <View style={styles.contentPadding}>
        {/* Title & Category */}
        <Text style={styles.category}>{product.category.toUpperCase()}</Text>
        <Text style={styles.title}>{product.name}</Text>

        {/* Rating summary */}
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={16} color="#F59E0B" />
          <Text style={styles.ratingText}>
            {product.rating ?? '4.9'} ({reviews.length} Reviews)
          </Text>
        </View>

        {/* Pricing */}
        <Text style={styles.price}>
          \${product.basePrice}{' '}
          <Text style={styles.priceUnit}>{product.priceUnit}</Text>
        </Text>

        {/* Specs Box */}
        <View style={styles.specsCard}>
          <Text style={styles.specsHeader}>CNC FABRICATION SPECS</Text>
          <Text style={styles.specLine}>
            Kerf Tolerance: {product.detailedSpecs?.kerfTolerance ?? '±0.04mm'}
          </Text>
          <Text style={styles.specLine}>
            Laser: {product.detailedSpecs?.recommendedLaserPower ?? 'Fiber 4kW'}
          </Text>
          <Text style={styles.specLine}>
            Gauges: {product.detailedSpecs?.sheetThicknessRange ?? '1.6mm - 6mm'}
          </Text>
        </View>

        {/* Quote CTA */}
        <TouchableOpacity
          style={styles.quoteButton}
          onPress={() => navigation.navigate('QuoteModal', { product })}
        >
          <Text style={styles.quoteButtonText}>Request Custom Quote (RFQ)</Text>
        </TouchableOpacity>

        {/* Reviews Section */}
        <View style={styles.reviewsHeaderRow}>
          <Text style={styles.reviewsHeading}>Fabrication Reviews</Text>
          <TouchableOpacity
            style={styles.writeButton}
            onPress={() => setReviewModalVisible(true)}
          >
            <Text style={styles.writeButtonText}>+ Add Review</Text>
          </TouchableOpacity>
        </View>

        {reviews.map((item) => (
          <View key={item.id} style={styles.reviewCard}>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Ionicons
                  key={s}
                  name={s <= item.rating ? 'star' : 'star-outline'}
                  size={14}
                  color="#F59E0B"
                />
              ))}
              <Text style={styles.reviewTitle}>{item.title}</Text>
            </View>
            <Text style={styles.reviewMeta}>
              {item.authorName} · {item.projectApplication}
            </Text>
            <Text style={styles.reviewComment}>{item.comment}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0A0A' },
  heroImage: { width: '100%', height: 260, backgroundColor: '#171717' },
  contentPadding: { padding: 18 },
  category: { color: '#F59E0B', fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  title: { color: '#FFFFFF', fontSize: 20, fontWeight: '800', marginVertical: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginVertical: 4 },
  ratingText: { color: '#D4D4D4', fontSize: 13 },
  price: { color: '#F59E0B', fontSize: 22, fontWeight: '900', marginVertical: 8 },
  priceUnit: { color: '#A3A3A3', fontSize: 12, fontWeight: 'normal' },
  specsCard: { backgroundColor: '#171717', padding: 14, borderRadius: 12, marginVertical: 12, borderWidth: 1, borderColor: '#262626' },
  specsHeader: { color: '#A3A3A3', fontSize: 11, fontWeight: '700', marginBottom: 6 },
  specLine: { color: '#E5E5E5', fontSize: 12, marginVertical: 2 },
  quoteButton: { backgroundColor: '#F59E0B', padding: 14, borderRadius: 10, alignItems: 'center', marginVertical: 10 },
  quoteButtonText: { color: '#0A0A0A', fontWeight: '800', fontSize: 14 },
  reviewsHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 12 },
  reviewsHeading: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  writeButton: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 6, backgroundColor: '#262626' },
  writeButtonText: { color: '#F59E0B', fontSize: 12, fontWeight: '600' },
  reviewCard: { backgroundColor: '#171717', padding: 14, borderRadius: 10, marginVertical: 6, borderWidth: 1, borderColor: '#262626' },
  starsRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  reviewTitle: { color: '#FFFFFF', fontWeight: '700', fontSize: 13, marginLeft: 6 },
  reviewMeta: { color: '#737373', fontSize: 11, marginVertical: 4 },
  reviewComment: { color: '#D4D4D4', fontSize: 12, lineHeight: 18 },
});`;

  const flutterCode = `// ===============================================================
// FLUTTER PRODUCTION IMPLEMENTATION
// File: lib/screens/product_detail_screen.dart
// ===============================================================

import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class ProductDetailScreen extends StatefulWidget {
  final String productId;

  const ProductDetailScreen({Key? key, required this.productId}) : super(key: key);

  @override
  State<ProductDetailScreen> createState() => _ProductDetailScreenState();
}

class _ProductDetailScreenState extends State<ProductDetailScreen> {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  void _showAddReviewDialog(BuildContext context) {
    int rating = 5;
    final authorCtrl = TextEditingController();
    final titleCtrl = TextEditingController();
    final commentCtrl = TextEditingController();
    final appCtrl = TextEditingController();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: const Color(0xFF171717),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setSheetState) => Padding(
          padding: EdgeInsets.only(
            left: 20, right: 20, top: 20,
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 20,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'RATE FABRICATION QUALITY',
                style: TextStyle(color: Color(0xFFF59E0B), fontWeight: FontWeight.bold, fontSize: 13),
              ),
              const SizedBox(height: 12),
              Row(
                children: List.generate(5, (index) {
                  return IconButton(
                    icon: Icon(
                      index < rating ? Icons.star : Icons.star_border,
                      color: const Color(0xFFF59E0B),
                    ),
                    onPressed: () => setSheetState(() => rating = index + 1),
                  );
                }),
              ),
              TextField(
                controller: authorCtrl,
                style: const TextStyle(color: Colors.white, fontSize: 13),
                decoration: const InputDecoration(labelText: 'Your Name / Studio', labelStyle: TextStyle(color: Colors.grey)),
              ),
              TextField(
                controller: titleCtrl,
                style: const TextStyle(color: Colors.white, fontSize: 13),
                decoration: const InputDecoration(labelText: 'Review Headline', labelStyle: TextStyle(color: Colors.grey)),
              ),
              TextField(
                controller: commentCtrl,
                maxLines: 3,
                style: const TextStyle(color: Colors.white, fontSize: 13),
                decoration: const InputDecoration(labelText: 'Cutting Kerf & Fit Experience', labelStyle: TextStyle(color: Colors.grey)),
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFF59E0B),
                  minimumSize: const Size.fromHeight(45),
                ),
                onPressed: () async {
                  if (authorCtrl.text.isNotEmpty && commentCtrl.text.isNotEmpty) {
                    await _firestore
                        .collection('products')
                        .doc(widget.productId)
                        .collection('reviews')
                        .add({
                      'authorName': authorCtrl.text.trim(),
                      'rating': rating,
                      'title': titleCtrl.text.trim(),
                      'comment': commentCtrl.text.trim(),
                      'verifiedPurchase': true,
                      'projectApplication': appCtrl.text.trim().isEmpty ? 'Architectural Job' : appCtrl.text.trim(),
                      'finishChosen': 'Matte Black Powder Coat',
                      'createdAt': FieldValue.serverTimestamp(),
                    });
                    if (mounted) Navigator.pop(ctx);
                  }
                },
                child: const Text('Submit Review', style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0A0A0A),
      appBar: AppBar(
        title: const Text('Design Details', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: const Color(0xFF0A0A0A),
      ),
      body: StreamBuilder<DocumentSnapshot>(
        stream: _firestore.collection('products').doc(widget.productId).snapshots(),
        builder: (context, snapshot) {
          if (!snapshot.hasData) {
            return const Center(child: CircularProgressIndicator(color: Color(0xFFF59E0B)));
          }
          final data = snapshot.data!.data() as Map<String, dynamic>;

          return SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Image.network(
                  data['images'][0],
                  height: 250,
                  width: double.infinity,
                  fit: BoxFit.cover,
                ),
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        data['category'].toString().toUpperCase(),
                        style: const TextStyle(color: Color(0xFFF59E0B), fontSize: 12, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        data['name'],
                        style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.w800),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        '\$\${data['basePrice']} \${data['priceUnit']}',
                        style: const TextStyle(color: Color(0xFFF59E0B), fontSize: 22, fontWeight: FontWeight.w900),
                      ),
                      const SizedBox(height: 16),
                      // Request Quote Button
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFFF59E0B),
                          minimumSize: const Size.fromHeight(48),
                        ),
                        onPressed: () {
                          // Launch RFQ sheet
                        },
                        child: const Text('Get Quote / Order Inquiry', style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
                      ),
                      const SizedBox(height: 24),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.between,
                        children: [
                          const Text('Reviews & Ratings', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
                          TextButton(
                            onPressed: () => _showAddReviewDialog(context),
                            child: const Text('+ Write Review', style: TextStyle(color: Color(0xFFF59E0B))),
                          ),
                        ],
                      ),
                      // Reviews Stream
                      StreamBuilder<QuerySnapshot>(
                        stream: _firestore
                            .collection('products')
                            .doc(widget.productId)
                            .collection('reviews')
                            .orderBy('createdAt', descending: true)
                            .snapshots(),
                        builder: (ctx, revSnap) {
                          if (!revSnap.hasData) return const SizedBox();
                          final docs = revSnap.data!.docs;
                          return ListView.builder(
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            itemCount: docs.length,
                            itemBuilder: (ctx, i) {
                              final rev = docs[i].data() as Map<String, dynamic>;
                              return Container(
                                margin: const EdgeInsets.symmetric(vertical: 6),
                                padding: const EdgeInsets.all(12),
                                decoration: BoxDecoration(
                                  color: const Color(0xFF171717),
                                  borderRadius: BorderRadius.circular(10),
                                  border: Border.all(color: const Color(0xFF262626)),
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      children: [
                                        const Icon(Icons.star, color: Color(0xFFF59E0B), size: 14),
                                        const SizedBox(width: 4),
                                        Text('\${rev['rating']}.0', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
                                        const SizedBox(width: 8),
                                        Text(rev['title'] ?? '', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
                                      ],
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      '\${rev['authorName']} · \${rev['projectApplication'] ?? ''}',
                                      style: const TextStyle(color: Colors.grey, fontSize: 11),
                                    ),
                                    const SizedBox(height: 6),
                                    Text(rev['comment'] ?? '', style: const TextStyle(color: Color(0xFFD4D4D4), fontSize: 12)),
                                  ],
                                ),
                              );
                            },
                          );
                        },
                      ),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}`;

  const setupGuideText = `# STEP-BY-STEP INTEGRATION & PRODUCTION SETUP GUIDE
## Laser Cutting & Fabrication Catalog App (Firebase, Storage, and Mobile UI)

---

### Phase 1: Firebase Project & Firestore Provisioning
1. Go to https://console.firebase.google.com and create a project named 'laser-fab-catalog'.
2. Enable Firestore Database in 'Production Mode' (select your closest cloud region, e.g., us-central1 or europe-west1).
3. Paste the \`firestore.rules\` provided in the "Firestore Schema" tab into the Firebase Console -> Firestore -> Rules.
4. Create initial root collections:
   - \`products\` (Catalog items with specs, price, images array, CAD vector paths)
   - \`categories\` (Gates, Jali, Signage, Wall Decor, Industrial)
   - \`quote_inquiries\` (Customer RFQs with dimensions, finish, estimated total)

---

### Phase 2: High-Resolution Images & CAD Storage (Firebase Storage / Cloud Storage)
1. In Firebase Console, navigate to 'Storage' and click 'Get Started'.
2. Set Storage Rules to allow public read of verified product assets:
   \`\`\`
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       // Public catalog images
       match /product_images/{allPaths=**} {
         allow read: if true;
         allow write: if request.auth != null && request.auth.token.role == 'admin';
       }
       // Customer uploaded DXF/DWG files
       match /cad_uploads/{allPaths=**} {
         allow write: if request.resource.size < 25 * 1024 * 1024; // 25MB max
         allow read: if request.auth != null && request.auth.token.role == 'admin';
       }
     }
   }
   \`\`\`
3. Configure CORS on your Firebase storage bucket to allow direct browser/mobile preview uploads:
   \`\`\`json
   [
     {
       "origin": ["*"],
       "method": ["GET", "POST", "PUT"],
       "maxAgeSeconds": 3600
     }
   ]
   \`\`\`
   Deploy with: \`gsutil cors set cors.json gs://<your-bucket-name>\`

---

### Phase 3: Connecting the Frontend Mobile UI (React Native / Flutter)
#### For React Native / Expo:
1. Install dependencies:
   \`\`\`bash
   npx expo install @react-native-firebase/app @react-native-firebase/firestore @react-native-firebase/storage
   \`\`\`
2. Place \`google-services.json\` (Android) in \`/android/app\` and \`GoogleService-Info.plist\` in \`/ios\`.
3. Copy the production code from the **React Native** tab into your navigation stack.

#### For Flutter:
1. Add dependencies in \`pubspec.yaml\`:
   \`\`\`yaml
   dependencies:
     flutter:
       sdk: flutter
     firebase_core: ^3.6.0
     cloud_firestore: ^5.4.4
     firebase_storage: ^12.3.2
   \`\`\`
2. Initialize in \`main.dart\`:
   \`\`\`dart
   void main() async {
     WidgetsFlutterBinding.ensureInitialized();
     await Firebase.initializeApp();
     runApp(const LaserFabCatalogApp());
   }
   \`\`\`
3. Import the \`ProductDetailScreen\` provided in the **Flutter** tab.

---

### Phase 4: Review & Rating Aggregate Cloud Function (Optional Node.js)
To automatically recompute average ratings in Firestore on review insertion, deploy this Cloud Function:
\`\`\`javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.aggregateReviews = functions.firestore
  .document('products/{productId}/reviews/{reviewId}')
  .onWrite(async (change, context) => {
    const productId = context.params.productId;
    const revSnap = await admin.firestore()
      .collection('products').doc(productId)
      .collection('reviews').get();

    let total = 0;
    revSnap.forEach(doc => total += doc.data().rating);
    const avg = revSnap.size > 0 ? parseFloat((total / revSnap.size).toFixed(2)) : 0;

    return admin.firestore().collection('products').doc(productId).update({
      rating: avg,
      reviewCount: revSnap.size
    });
  });
\`\`\``;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
              <Database size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-100">
                Architecture, Database Schemas & Mobile Code Hub
              </h3>
              <p className="text-xs text-neutral-400 font-mono">
                Production Firestore, SQL DDL, React Native, Flutter & Cloud Setup
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-100 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Strip */}
        <div className="flex items-center gap-1 px-6 py-3 bg-neutral-950/60 border-b border-neutral-800 text-xs overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('firestore')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'firestore'
                ? 'bg-amber-500 text-neutral-950 font-bold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Database size={13} />
            <span>Firebase Firestore Schema</span>
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'sql'
                ? 'bg-amber-500 text-neutral-950 font-bold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Server size={13} />
            <span>PostgreSQL SQL DDL</span>
          </button>
          <button
            onClick={() => setActiveTab('react-native')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'react-native'
                ? 'bg-amber-500 text-neutral-950 font-bold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Smartphone size={13} />
            <span>React Native Code</span>
          </button>
          <button
            onClick={() => setActiveTab('flutter')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'flutter'
                ? 'bg-amber-500 text-neutral-950 font-bold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Smartphone size={13} />
            <span>Flutter Code</span>
          </button>
          <button
            onClick={() => setActiveTab('setup-guide')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'setup-guide'
                ? 'bg-amber-500 text-neutral-950 font-bold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <BookOpen size={13} />
            <span>Setup & Cloud Storage Guide</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-neutral-950">
          <div className="relative">
            {/* Copy Button */}
            <button
              onClick={() => {
                const text =
                  activeTab === 'firestore'
                    ? firestoreSchemaText
                    : activeTab === 'sql'
                    ? sqlSchemaText
                    : activeTab === 'react-native'
                    ? reactNativeCode
                    : activeTab === 'flutter'
                    ? flutterCode
                    : setupGuideText;
                copyToClipboard(text, activeTab);
              }}
              className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-mono transition-colors shadow-md border border-neutral-700 z-10"
            >
              {copiedKey === activeTab ? (
                <>
                  <Check size={13} className="text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span>Copy Code</span>
                </>
              )}
            </button>

            {/* Code Block Pre */}
            <pre className="p-5 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-300 font-mono text-xs overflow-x-auto leading-relaxed max-h-[65vh]">
              {activeTab === 'firestore' && firestoreSchemaText}
              {activeTab === 'sql' && sqlSchemaText}
              {activeTab === 'react-native' && reactNativeCode}
              {activeTab === 'flutter' && flutterCode}
              {activeTab === 'setup-guide' && setupGuideText}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
