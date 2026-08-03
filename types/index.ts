export type SkinType = 'dry' | 'oily' | 'combination' | 'sensitive' | 'normal' | 'all';

export type ProductCategory = 
  | 'cleanser'
  | 'serum'
  | 'moisturizer'
  | 'sunscreen'
  | 'eye-care'
  | 'mask'
  | 'exfoliant';

export type ProductUsage = 'morning' | 'evening' | 'both';

export type OrderStatus = 'placed' | 'packed' | 'shipped' | 'delivered' | 'cancelled';

export type UserRole = 'customer' | 'admin';

export interface UserAddress {
  id: string;
  label: string; // e.g. "Home", "Work"
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  phone?: string;
  skinType?: SkinType;
  primaryConcerns?: string[];
  addresses?: UserAddress[];
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  stock: number;
  category: ProductCategory;
  skinType: SkinType[];
  images: string[];
  description: string;
  ingredients: string[];
  benefits: string[];
  usage: ProductUsage;
  volume: string;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
}

export interface OrderTimelineStep {
  status: OrderStatus;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shippingFee: number;
  discount: number;
  total: number;
  couponCode?: string;
  shippingAddress: UserAddress;
  paymentMethod: string;
  status: OrderStatus;
  timeline: OrderTimelineStep[];
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

export interface WishlistItem {
  id: string;
  userId: string;
  product: Product;
  addedAt: string;
}

export interface Coupon {
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  minPurchase: number;
  expiryDate: string;
  isActive: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  type: 'order' | 'promo' | 'system';
  createdAt: string;
}

export interface SkinDiagnosticInput {
  skinType: SkinType;
  ageGroup: string;
  primaryConcerns: string[];
  isSensitive: boolean;
  preferredTexture: string;
}

export interface AIRoutineRecommendation {
  morningRoutine: {
    step: number;
    title: string;
    productCategory: string;
    recommendedProduct?: Product;
    explanation: string;
  }[];
  eveningRoutine: {
    step: number;
    title: string;
    productCategory: string;
    recommendedProduct?: Product;
    explanation: string;
  }[];
  expertAdvice: string;
  suggestedIngredients: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedProducts?: Product[];
}
