export interface Product {
  id: string;
  name: string;
  hindiName?: string;
  category: string;
  categorySlug: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  unit: string;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  stockQuantity: number;
  soldCount: number;
  totalCount: number;
  badge?: string;
  badgeColor?: 'red' | 'emerald' | 'amber';
  description: string;
  origin: string;
  benefits?: string[];
  visualType: 'khada' | 'pesa' | 'agarbatti' | 'dhoop' | 'pooja' | 'dryfruit' | 'oil' | 'kirana';
  image?: string;
  isFeatured?: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  isTopSell?: boolean;
  isTopRated?: boolean;
  isTrending?: boolean;
  isRecentlyAdded?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  itemCount: number;
  bgGradient: string;
  accentColor: string;
  imageVisual: string;
  imageUrl?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'placed' | 'packed' | 'dispatched' | 'out_for_delivery' | 'delivered';

export interface Order {
  orderId: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  statusTimestamp: string;
  customer: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
    notes?: string;
  };
  paymentMethod: 'COD' | 'UPI';
  createdAt: string;
  deliveryRider: {
    name: string;
    phone: string;
    vehicleNumber: string;
  };
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  savedAddress?: string;
  isLoggedIn: boolean;
}

export interface ProductReview {
  id: string;
  productId: string;
  author: string;
  rating: number; // 1 to 5
  date: string;
  title: string;
  comment: string;
  location?: string;
  verified: boolean;
  helpfulCount: number;
  userVotedHelpful?: boolean;
}
