import { z } from 'zod';

// ==========================================
// Enums & Literal Types
// ==========================================
export const SkinTypeSchema = z.enum([
  'dry',
  'oily',
  'combination',
  'sensitive',
  'normal',
  'all',
]);

export const ProductCategorySchema = z.enum([
  'cleanser',
  'serum',
  'moisturizer',
  'sunscreen',
  'eye-care',
  'mask',
  'exfoliant',
]);

export const ProductUsageSchema = z.enum(['morning', 'evening', 'both']);

export const OrderStatusSchema = z.enum([
  'placed',
  'packed',
  'shipped',
  'delivered',
  'cancelled',
]);

export const UserRoleSchema = z.enum(['customer', 'admin']);

// ==========================================
// User & Address Schemas
// ==========================================
export const UserAddressSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  fullName: z.string().min(1),
  street: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  zipCode: z.string().min(1),
  country: z.string().min(1),
  isDefault: z.boolean(),
});

export const UserProfileSchema = z.object({
  uid: z.string().min(1),
  email: z.string().email(),
  displayName: z.string().min(1),
  photoURL: z.string().url().optional(),
  role: UserRoleSchema,
  phone: z.string().optional(),
  skinType: SkinTypeSchema.optional(),
  primaryConcerns: z.array(z.string()).optional(),
  addresses: z.array(UserAddressSchema).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// ==========================================
// Product Schemas
// ==========================================
export const ProductSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  brand: z.string().min(1),
  price: z.number().positive(),
  originalPrice: z.number().positive().optional(),
  rating: z.number().min(0).max(5),
  reviewCount: z.number().nonnegative(),
  stock: z.number().nonnegative(),
  category: ProductCategorySchema,
  skinType: z.array(SkinTypeSchema),
  images: z.array(z.string()),
  description: z.string(),
  ingredients: z.array(z.string()),
  benefits: z.array(z.string()),
  usage: ProductUsageSchema,
  volume: z.string(),
  isFeatured: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
  isNewArrival: z.boolean().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const CreateProductSchema = ProductSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateProductSchema = ProductSchema.partial().omit({ id: true });

// ==========================================
// Cart & Order Schemas
// ==========================================
export const CartItemSchema = z.object({
  id: z.string().min(1),
  product: ProductSchema,
  quantity: z.number().int().positive(),
});

export const OrderItemSchema = z.object({
  productId: z.string().min(1),
  productName: z.string().min(1),
  productImage: z.string(),
  price: z.number().nonnegative(),
  quantity: z.number().int().positive(),
});

export const OrderTimelineStepSchema = z.object({
  status: OrderStatusSchema,
  title: z.string(),
  description: z.string(),
  timestamp: z.string(),
  completed: z.boolean(),
});

export const OrderSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  items: z.array(OrderItemSchema),
  subtotal: z.number().nonnegative(),
  tax: z.number().nonnegative(),
  shippingFee: z.number().nonnegative(),
  discount: z.number().nonnegative(),
  total: z.number().nonnegative(),
  couponCode: z.string().optional(),
  shippingAddress: UserAddressSchema,
  paymentMethod: z.string(),
  status: OrderStatusSchema,
  timeline: z.array(OrderTimelineStepSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const CreateOrderSchema = OrderSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  timeline: true,
  status: true,
});

// ==========================================
// Review & Coupon Schemas
// ==========================================
export const ReviewSchema = z.object({
  id: z.string().min(1),
  productId: z.string().min(1),
  userId: z.string().min(1),
  userName: z.string().min(1),
  userAvatar: z.string().optional(),
  rating: z.number().min(1).max(5),
  title: z.string().min(1),
  comment: z.string().min(1),
  verifiedPurchase: z.boolean(),
  createdAt: z.string(),
});

export const CreateReviewSchema = ReviewSchema.omit({
  id: true,
  createdAt: true,
});

export const CouponSchema = z.object({
  code: z.string().min(1),
  discountPercent: z.number().min(1).max(100).optional(),
  discountAmount: z.number().positive().optional(),
  minPurchase: z.number().nonnegative(),
  expiryDate: z.string(),
  isActive: z.boolean(),
});

// ==========================================
// AI & Diagnostic Schemas
// ==========================================
export const SkinDiagnosticInputSchema = z.object({
  skinType: SkinTypeSchema,
  ageGroup: z.string().min(1),
  primaryConcerns: z.array(z.string()).min(1, 'Select at least one skin concern'),
  secondaryConcerns: z.array(z.string()).optional(),
  isSensitive: z.boolean(),
  preferredTexture: z.string().min(1),
  budget: z.number().positive().optional(),
  routinePreference: z.string().optional(),
  allergies: z.string().optional(),
  goals: z.string().optional(),
});

export const AIRoutineStepSchema = z.object({
  step: z.number().int().positive(),
  title: z.string().optional(),
  productCategory: z.string().optional(),
  recommendedProductId: z.string().optional(),
  productId: z.string().optional(),
  productName: z.string().optional(),
  explanation: z.string().optional(),
  reason: z.string().optional(),
  estimatedTime: z.string().optional(),
});

export const ClinicalIngredientSchema = z.object({
  name: z.string().min(1),
  mechanism: z.string().optional(),
  benefits: z.string().optional(),
  compatibility: z.string().optional(),
  possibleIrritationNotes: z.string().optional(),
  reason: z.string().optional(),
});

export const ClinicalTimelineSchema = z.object({
  week1: z.string().optional(),
  week2: z.string().optional(),
  week4: z.string().optional(),
  week8: z.string().optional(),
  maintenance: z.string().optional(),
});

export const ClinicalConfidenceSchema = z.object({
  confidenceScore: z.number().min(0).max(100),
  matchReasons: z.array(z.string()),
});

export const GeminiRecommendationOutputSchema = z.object({
  summary: z.string().optional(),
  skinAnalysis: z.string().min(1),
  morningRoutine: z.array(AIRoutineStepSchema),
  eveningRoutine: z.array(AIRoutineStepSchema).optional(),
  nightRoutine: z.array(AIRoutineStepSchema).optional(),
  recommendedIngredients: z.array(z.union([z.string(), ClinicalIngredientSchema])),
  whyTheseProducts: z.string().optional(),
  expertAdvice: z.string().optional(),
  lifestyleTips: z.array(z.string()).optional(),
  ingredientInteractionNotes: z.string().optional(),
  expectedTimeline: ClinicalTimelineSchema.optional(),
  recommendationConfidence: ClinicalConfidenceSchema.optional(),
  clarifyingQuestion: z.string().nullable().optional(),
});

export const GeminiChatOutputSchema = z.object({
  text: z.string().min(1),
  recommendedProductIds: z.array(z.string()).optional(),
  structuredAnalysis: GeminiRecommendationOutputSchema.optional(),
});

export const ChatMessageSchema = z.object({
  id: z.string().min(1),
  sender: z.enum(['user', 'ai']),
  text: z.string(),
  timestamp: z.string(),
  suggestedProducts: z.array(ProductSchema).optional(),
});

export const AIChatRequestSchema = z.object({
  query: z.string().min(1, 'Query cannot be empty').max(1000, 'Query exceeds maximum length'),
  history: z.array(ChatMessageSchema).optional(),
  userProfile: z
    .object({
      skinType: SkinTypeSchema.optional(),
      primaryConcerns: z.array(z.string()).optional(),
      ageGroup: z.string().optional(),
      isSensitive: z.boolean().optional(),
      budget: z.number().optional(),
    })
    .optional(),
});

// ==========================================
// Environment Variables Schema
// ==========================================
export const EnvSchema = z.object({
  GEMINI_API_KEY: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().optional(),
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().optional(),
  NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: z.string().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});
