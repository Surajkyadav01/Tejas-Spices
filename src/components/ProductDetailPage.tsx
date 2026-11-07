import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  Zap,
  Check,
  Star,
  ShieldCheck,
  MapPin,
  Truck,
  RotateCcw,
  Package,
  Clock,
  Sparkles,
  ThumbsUp,
  MessageSquarePlus,
  CheckCircle2,
  Share2,
  Send,
  X,
  CreditCard,
  Banknote,
  QrCode,
  AlertCircle,
  ChevronRight,
  Info,
  Phone,
  User,
  Plus,
  Minus
} from 'lucide-react';
import { Product, CartItem, Order, UserProfile, ProductReview } from '../types';
import { STORE_INFO } from '../data/mockData';
import { ProductVisual } from './ProductVisual';
import {
  getReviewsForProduct,
  saveNewReview,
  toggleHelpfulVote,
} from '../data/mockReviews';

interface ProductDetailPageProps {
  product: Product;
  allProducts: Product[];
  cart: CartItem[];
  wishlist: string[];
  user: UserProfile;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onToggleWishlist: (productId: string) => void;
  onBackToStore: () => void;
  onSelectProduct: (product: Product) => void;
  onAddReview?: (productId: string, newRating: number, updatedReviewsCount: number) => void;
  onOrderSuccess: (order: Order) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  allProducts,
  cart,
  wishlist,
  user,
  onAddToCart,
  onUpdateQuantity,
  onToggleWishlist,
  onBackToStore,
  onSelectProduct,
  onAddReview,
  onOrderSuccess,
}) => {
  // Quantity selected on page
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [showBuyNowSection, setShowBuyNowSection] = useState(false);
  const buyNowRef = useRef<HTMLDivElement>(null);

  // Address & Checkout form state for Direct Buy Now
  const [fullName, setFullName] = useState(user.name || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [address, setAddress] = useState(user.savedAddress || '');
  const [city, setCity] = useState('Suriyawan');
  const [pincode, setPincode] = useState('221404');
  const [notes, setNotes] = useState('');
  const [paymentMode, setPaymentMode] = useState<'COD' | 'UPI'>('COD');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Pincode delivery check state
  const [checkPincode, setCheckPincode] = useState('221404');
  const [pincodeStatus, setPincodeStatus] = useState<{
    checked: boolean;
    valid: boolean;
    message: string;
  }>({
    checked: true,
    valid: true,
    message: 'Fast Delivery in 24-48 hrs available for Suriyawan & UP',
  });

  // Active section tab
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews'>('overview');

  // Reviews state
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'highest' | 'helpful'>('recent');

  // Review form states
  const [newRating, setNewRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [authorName, setAuthorName] = useState<string>(user.name || '');
  const [locationName, setLocationName] = useState<string>('Suriyawan, UP');
  const [reviewTitle, setReviewTitle] = useState<string>('');
  const [reviewComment, setReviewComment] = useState<string>('');
  const [recommendProduct, setRecommendProduct] = useState<boolean>(true);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  // Load reviews when product changes
  useEffect(() => {
    if (product) {
      const prodReviews = getReviewsForProduct(product.id, product.name);
      setReviews(prodReviews);
      setIsWritingReview(false);
      setSelectedRatingFilter('all');
      setSubmitSuccess(false);
      setSelectedQuantity(1);
      setShowBuyNowSection(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [product.id]);

  // Sync user info if user logs in
  useEffect(() => {
    if (user.isLoggedIn) {
      if (user.name) setFullName(user.name);
      if (user.phone) setPhone(user.phone);
      if (user.savedAddress) setAddress(user.savedAddress);
      if (user.name) setAuthorName(user.name);
    }
  }, [user]);

  // Derived rating metrics
  const { averageRating, ratingCounts, totalReviewsCount, recommendRate } = useMemo(() => {
    if (!reviews || reviews.length === 0) {
      return {
        averageRating: product.rating || 4.8,
        ratingCounts: { 5: 14, 4: 3, 3: 1, 2: 0, 1: 0 },
        totalReviewsCount: product.reviewsCount || 18,
        recommendRate: 95,
      };
    }

    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;
    reviews.forEach((r) => {
      const rounded = Math.min(5, Math.max(1, Math.round(r.rating)));
      counts[rounded] = (counts[rounded] || 0) + 1;
      sum += r.rating;
    });

    const avg = parseFloat((sum / reviews.length).toFixed(1));
    const positiveReviews = (counts[5] || 0) + (counts[4] || 0);
    const recPct = Math.round((positiveReviews / reviews.length) * 100);

    return {
      averageRating: avg,
      ratingCounts: counts,
      totalReviewsCount: reviews.length,
      recommendRate: recPct || 95,
    };
  }, [reviews, product]);

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    let list = [...reviews];
    if (selectedRatingFilter !== 'all') {
      list = list.filter((r) => Math.round(r.rating) === selectedRatingFilter);
    }

    if (sortBy === 'highest') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'helpful') {
      list.sort((a, b) => b.helpfulCount - a.helpfulCount);
    }
    return list;
  }, [reviews, selectedRatingFilter, sortBy]);

  // Check Cart & Wishlist state
  const cartItem = cart.find((item) => item.product.id === product.id);
  const currentCartQuantity = cartItem ? cartItem.quantity : 0;
  const isWishlisted = wishlist.includes(product.id);

  // Financial calculations for Direct Buy Now
  const itemSubtotal = product.price * selectedQuantity;
  const isFreeDelivery = itemSubtotal >= STORE_INFO.freeDeliveryThreshold;
  const deliveryFee = isFreeDelivery ? 0 : STORE_INFO.deliveryFee;
  const totalAmount = itemSubtotal + deliveryFee;

  // Handle Pincode verification
  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkPincode.trim() || checkPincode.trim().length < 6) {
      setPincodeStatus({
        checked: true,
        valid: false,
        message: 'Please enter a valid 6-digit postal pincode',
      });
      return;
    }

    if (checkPincode.startsWith('221') || checkPincode.startsWith('22') || checkPincode.startsWith('2')) {
      setPincodeStatus({
        checked: true,
        valid: true,
        message: '⚡ Express Delivery in 24 hrs available! Cash on Delivery accepted.',
      });
    } else {
      setPincodeStatus({
        checked: true,
        valid: true,
        message: 'Standard Courier Delivery available (3-5 business days).',
      });
    }
  };

  // Handle Share Product
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Buy authentic ${product.name} from Tejas Spices, Suriyawan`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  // Handle Direct Buy Now click
  const triggerBuyNow = () => {
    setShowBuyNowSection(true);
    setTimeout(() => {
      buyNowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  // Handle Direct Order Placement
  const handlePlaceDirectOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      alert('कृपया अपना नाम, मोबाइल नंबर और पूरा पता दर्ज करें');
      return;
    }

    setIsPlacingOrder(true);

    setTimeout(() => {
      const orderId = `TS-${Math.floor(10000 + Math.random() * 90000)}`;
      const newOrder: Order = {
        orderId,
        items: [{ product, quantity: selectedQuantity }],
        subtotal: itemSubtotal,
        deliveryFee,
        discount: 0,
        total: totalAmount,
        status: 'placed',
        statusTimestamp: 'Just now',
        customer: {
          fullName: fullName.trim(),
          phone: phone.trim(),
          address: address.trim(),
          city: city.trim() || 'Suriyawan',
          pincode: pincode.trim() || '221404',
          notes: notes.trim(),
        },
        paymentMethod: paymentMode,
        createdAt: new Date().toISOString(),
        deliveryRider: {
          name: 'Rameshwar Gurjar',
          phone: STORE_INFO.phone1,
          vehicleNumber: 'RJ-36-SB-2210',
        },
      };

      setIsPlacingOrder(false);
      setShowBuyNowSection(false);
      onOrderSuccess(newOrder);
    }, 800);
  };

  // Handle Review Submission
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTitle.trim() || !reviewComment.trim()) return;

    const newRev: ProductReview = {
      id: `user-rev-${Date.now()}`,
      productId: product.id,
      author: authorName.trim() || 'Verified Shopper',
      rating: newRating,
      date: 'Just now',
      title: reviewTitle.trim(),
      comment: reviewComment.trim(),
      location: locationName.trim() || 'Suriyawan, UP',
      verified: true,
      helpfulCount: 0,
      userVotedHelpful: false,
    };

    const updated = saveNewReview(newRev);
    const prodReviews = updated.filter((r) => r.productId === product.id);
    setReviews(prodReviews);

    const newSum = prodReviews.reduce((sum, r) => sum + r.rating, 0);
    const newAvg = parseFloat((newSum / prodReviews.length).toFixed(1));
    const newTotalCount = prodReviews.length;

    if (onAddReview) {
      onAddReview(product.id, newAvg, newTotalCount);
    }

    setSubmitSuccess(true);
    setReviewTitle('');
    setReviewComment('');

    setTimeout(() => {
      setIsWritingReview(false);
      setSubmitSuccess(false);
    }, 1800);
  };

  const handleHelpfulClick = (reviewId: string) => {
    const updated = toggleHelpfulVote(reviewId);
    setReviews(updated.filter((r) => r.productId === product.id));
  };

  // Related products from same category or top sells
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && (p.categorySlug === product.categorySlug || p.isTopSell))
    .slice(0, 4);

  return (
    <div className="w-full bg-slate-50/50 pb-20 sm:pb-24">
      {/* 1. Breadcrumbs & Top Navigation Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-14 z-20 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3 text-xs sm:text-sm">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-slate-500 overflow-x-auto whitespace-nowrap">
            <button
              onClick={onBackToStore}
              className="hover:text-emerald-700 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Home</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <button
              onClick={onBackToStore}
              className="hover:text-emerald-700 font-semibold cursor-pointer transition-colors"
            >
              {product.category}
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-bold text-slate-900 truncate max-w-[140px] sm:max-w-xs">
              {product.name}
            </span>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold cursor-pointer transition-colors"
              title="Share Product"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{copiedShare ? 'Link Copied!' : 'Share'}</span>
            </button>

            <button
              onClick={onBackToStore}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Store</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Product Container (Full-Page Layout) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ================= LEFT COLUMN: PRODUCT IMAGERY & TRUST ================= */}
            <div className="lg:col-span-5 space-y-5">
              {/* Main Image Frame */}
              <div className="relative bg-slate-50/80 rounded-2xl border border-slate-200/80 p-4 sm:p-6 flex flex-col items-center justify-center overflow-hidden">
                {/* Floating Discount & Authentic Badges */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
                  {product.discountPercent > 0 && (
                    <span className="bg-rose-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-full shadow-xs uppercase tracking-wider">
                      {product.discountPercent}% OFF
                    </span>
                  )}
                  {product.badge && product.badge !== `Save ${product.discountPercent}%` && (
                    <span className="bg-emerald-600 text-white font-bold text-[11px] px-2.5 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
                      {product.badge}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => onToggleWishlist(product.id)}
                  className={`absolute top-4 right-4 z-10 p-2.5 rounded-full border transition-all cursor-pointer ${
                    isWishlisted
                      ? 'bg-rose-50 border-rose-300 text-rose-500 shadow-xs'
                      : 'bg-white/90 backdrop-blur-xs border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200'
                  }`}
                  aria-label="Wishlist"
                  title={isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                </button>

                {/* Big Visual */}
                <div className="w-full max-w-sm my-2">
                  <ProductVisual product={product} size="lg" priority={true} />
                </div>

                {/* Sourcing Pin Badge */}
                <div className="mt-2 w-full flex items-center justify-center gap-2 text-xs text-slate-700 bg-white/90 border border-slate-200 py-1.5 px-3 rounded-xl shadow-2xs font-medium">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>
                    Origin & Milled at: <strong className="text-slate-900">{product.origin}</strong>
                  </span>
                </div>
              </div>

              {/* Trust Badges Strip (Amazon/Flipkart Trust Features) */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-start gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900">100% Purity Certified</div>
                    <div className="text-[11px] text-slate-500">Chemical & dye-free spice guarantee</div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-start gap-2.5">
                  <Truck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900">Doorstep Delivery</div>
                    <div className="text-[11px] text-slate-500">Fast delivery from Suriyawan Hub</div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-start gap-2.5">
                  <RotateCcw className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900">7-Day Replacement</div>
                    <div className="text-[11px] text-slate-500">Easy exchange if not satisfied</div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-start gap-2.5">
                  <Banknote className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900">Cash on Delivery</div>
                    <div className="text-[11px] text-slate-500">Pay cash or UPI upon delivery</div>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= RIGHT COLUMN: PRODUCT INFO & BUY FLOW ================= */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Title & Category Info */}
              <div className="space-y-2 border-b border-slate-100 pb-5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200/80">
                    {product.category}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">·</span>
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                    Tejas Spices Store
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                  {product.name}
                </h1>

                {product.hindiName && (
                  <div className="text-base text-emerald-800 font-semibold flex items-center gap-2">
                    <span className="text-xl">🌿</span>
                    <span>{product.hindiName}</span>
                  </div>
                )}

                {/* Rating & Reviews Jump */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    onClick={() => {
                      setActiveTab('reviews');
                      const el = document.getElementById('details-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="flex items-center gap-1.5 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-lg cursor-pointer hover:bg-amber-100 transition-colors"
                  >
                    <div className="flex items-center text-amber-500">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= Math.round(averageRating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-amber-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-black text-slate-900 tabular-nums ml-1">
                      {averageRating}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('reviews');
                      const el = document.getElementById('details-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
                  >
                    {totalReviewsCount} Customer Ratings & Reviews
                  </button>

                  <span className="text-slate-300">|</span>

                  <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{recommendRate}% Verified Buyers Recommend</span>
                  </span>
                </div>
              </div>

              {/* Price & Savings Block */}
              <div className="bg-slate-50/70 rounded-2xl p-4 sm:p-5 border border-slate-100 space-y-3">
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900 tabular-nums tracking-tight">
                    ₹{product.price}
                  </span>
                  <span className="text-sm sm:text-base text-slate-400 line-through tabular-nums">
                    M.R.P. ₹{product.originalPrice}
                  </span>
                  <span className="text-xs font-bold bg-rose-100 text-rose-700 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Save ₹{product.originalPrice - product.price} ({product.discountPercent}% OFF)
                  </span>
                </div>

                <div className="text-xs text-slate-500 font-medium">
                  Inclusive of all taxes · Available Pack Size:{' '}
                  <span className="font-bold text-slate-800 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                    {product.unit}
                  </span>
                </div>

                {/* Stock Status Indicator */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-700">
                    In Stock — Ready to dispatch from Suriyawan Store
                  </span>
                </div>
              </div>

              {/* Delivery Pin Code & Estimated Time Checker (Flipkart/Amazon style) */}
              <div className="space-y-2 border border-slate-200 rounded-2xl p-4 bg-white">
                <div className="flex items-center justify-between text-xs text-slate-700 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    <span>Check Delivery & Cash on Delivery Availability</span>
                  </span>
                </div>

                <form onSubmit={handlePincodeCheck} className="flex gap-2">
                  <div className="relative flex-1">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      maxLength={6}
                      value={checkPincode}
                      onChange={(e) => setCheckPincode(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 6-digit Pincode"
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600 font-mono font-medium"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors"
                  >
                    Check
                  </button>
                </form>

                {pincodeStatus.checked && (
                  <div
                    className={`text-xs p-2.5 rounded-xl flex items-center gap-2 font-medium ${
                      pincodeStatus.valid
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {pincodeStatus.valid ? (
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span>{pincodeStatus.message}</span>
                  </div>
                )}
              </div>

              {/* Quantity Selector & Action Buttons (Add to Cart + Buy Now) */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Quantity:
                  </span>
                  <div className="flex items-center border border-slate-300 rounded-xl bg-white p-1">
                    <button
                      type="button"
                      onClick={() => setSelectedQuantity((prev) => Math.max(1, prev - 1))}
                      className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center font-black font-mono text-sm text-slate-900">
                      {selectedQuantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedQuantity((prev) => Math.min(20, prev + 1))}
                      className="w-8 h-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center cursor-pointer transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    Total: <strong className="text-slate-900">₹{itemSubtotal}</strong>
                  </span>
                </div>

                {/* Primary Dual Buttons (Amazon/Flipkart Paradigm) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Button 1: Add to Cart */}
                  <button
                    type="button"
                    onClick={() => {
                      for (let i = 0; i < selectedQuantity; i++) {
                        onAddToCart(product);
                      }
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-sm py-3.5 px-6 rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>
                      {currentCartQuantity > 0 ? `Add More (${currentCartQuantity} in Cart)` : 'Add to Cart / कार्ट में जोड़ें'}
                    </span>
                  </button>

                  {/* Button 2: Buy Now (तुरंत खरीदें) */}
                  <button
                    type="button"
                    onClick={triggerBuyNow}
                    className="w-full bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-black text-sm py-3.5 px-6 rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-600/30"
                  >
                    <Zap className="w-4 h-4 fill-slate-950" />
                    <span>Buy Now / तुरंत खरीदें</span>
                  </button>
                </div>
              </div>

              {/* ================= INTEGRATED BUY NOW & DELIVERY ADDRESS FORM ================= */}
              {showBuyNowSection && (
                <div
                  ref={buyNowRef}
                  className="mt-6 p-5 sm:p-6 bg-gradient-to-b from-amber-50/70 to-emerald-50/50 rounded-2xl border-2 border-amber-400/90 shadow-md transition-all animate-in fade-in slide-in-from-top-2 duration-300 space-y-5"
                >
                  <div className="flex items-center justify-between border-b border-amber-200 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                        ⚡
                      </div>
                      <div>
                        <h3 className="text-base font-black text-slate-900">
                          Express Doorstep Checkout (तुरंत ऑर्डर करें)
                        </h3>
                        <p className="text-xs text-slate-600">
                          अपना डिलीवरी पता दर्ज करें और सीधे ऑर्डर बुक करें
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowBuyNowSection(false)}
                      className="p-1.5 rounded-full hover:bg-amber-200/60 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handlePlaceDirectOrder} className="space-y-4">
                    {/* Name & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Full Name (पूरा नाम) <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="e.g. Ramesh Kumar"
                            className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:border-emerald-600"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Mobile / WhatsApp Number <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+91 94502 XXXXX"
                            className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 bg-white font-mono focus:outline-hidden focus:border-emerald-600"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Street Address */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Delivery Address (मकान नंबर, गली, मोहल्ला / लैंडमार्क) <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <textarea
                          required
                          rows={2}
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="e.g. House No. 24, Near Jain Mandir, Main Market, Suriyawan"
                          className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:border-emerald-600"
                        />
                      </div>
                    </div>

                    {/* City & Pincode */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          City / Town (शहर)
                        </label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Suriyawan"
                          className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Postal Pincode (पिन कोड)
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                          placeholder="221404"
                          className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-mono focus:outline-hidden focus:border-emerald-600"
                        />
                      </div>
                    </div>

                    {/* Payment Mode Selector */}
                    <div className="space-y-1.5 pt-1">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Select Payment Method (भुगतान का तरीका):
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {/* Option 1: COD */}
                        <div
                          onClick={() => setPaymentMode('COD')}
                          className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                            paymentMode === 'COD'
                              ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Banknote className="w-5 h-5 text-emerald-600" />
                            <div>
                              <div className="text-xs font-bold text-slate-900">Cash on Delivery (COD)</div>
                              <div className="text-[11px] text-slate-500">डिलीवरी पर नकद या UPI दें</div>
                            </div>
                          </div>
                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              paymentMode === 'COD'
                                ? 'border-emerald-600 bg-emerald-600 text-white text-[10px]'
                                : 'border-slate-300'
                            }`}
                          >
                            {paymentMode === 'COD' && '✓'}
                          </span>
                        </div>

                        {/* Option 2: UPI */}
                        <div
                          onClick={() => setPaymentMode('UPI')}
                          className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                            paymentMode === 'UPI'
                              ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <QrCode className="w-5 h-5 text-indigo-600" />
                            <div>
                              <div className="text-xs font-bold text-slate-900">Instant UPI / QR</div>
                              <div className="text-[11px] text-slate-500">GPay, PhonePe, Paytm QR</div>
                            </div>
                          </div>
                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              paymentMode === 'UPI'
                                ? 'border-emerald-600 bg-emerald-600 text-white text-[10px]'
                                : 'border-slate-300'
                            }`}
                          >
                            {paymentMode === 'UPI' && '✓'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Pricing summary row */}
                    <div className="bg-white p-3 rounded-xl border border-amber-200/90 text-xs space-y-1">
                      <div className="flex justify-between text-slate-600">
                        <span>
                          {product.name} (x{selectedQuantity}):
                        </span>
                        <span className="font-mono font-bold text-slate-900">₹{itemSubtotal}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Delivery Fee:</span>
                        <span className="font-semibold text-emerald-700">
                          {isFreeDelivery ? 'FREE Delivery' : `₹${deliveryFee}`}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm font-black text-slate-900 border-t border-slate-100 pt-1.5 mt-1">
                        <span>Total Payable (कुल राशि):</span>
                        <span className="text-base text-emerald-800">₹{totalAmount}</span>
                      </div>
                    </div>

                    {/* Submit Order Button */}
                    <button
                      type="submit"
                      disabled={isPlacingOrder}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black text-sm py-3.5 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isPlacingOrder ? (
                        <span>Processing Order...</span>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Place Order Now / ऑर्डर कन्फर्म करें (₹{totalAmount})</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* ================= 3. PRODUCT DETAILS & REVIEWS TABS SECTION ================= */}
        <div id="details-section" className="mt-8 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-6 lg:p-8">
          {/* Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Overview & Specifications
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'reviews'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>Ratings & Customer Reviews</span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-bold tabular-nums ${
                  activeTab === 'reviews'
                    ? 'bg-emerald-800 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {totalReviewsCount}
              </span>
            </button>
          </div>

          {/* TAB 1: OVERVIEW & SPECIFICATIONS */}
          {activeTab === 'overview' && (
            <div className="pt-6 space-y-8">
              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">About this Item</h3>
                <p className="text-sm text-slate-600 leading-relaxed max-w-4xl">
                  {product.description}
                </p>
              </div>

              {/* Key Highlights */}
              {product.benefits && product.benefits.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-slate-900">Key Quality Highlights</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {product.benefits.map((benefit, i) => (
                      <div
                        key={i}
                        className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-start gap-2.5"
                      >
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-xs font-medium text-slate-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technical Specifications Table */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-slate-900">Product Specifications</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse border border-slate-200 rounded-xl overflow-hidden">
                    <tbody>
                      <tr className="border-b border-slate-200">
                        <td className="w-1/3 py-3 px-4 font-bold text-slate-700 bg-slate-50">
                          Brand / Store
                        </td>
                        <td className="py-3 px-4 text-slate-800">Tejas Spices & Kirana</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="py-3 px-4 font-bold text-slate-700 bg-slate-50">
                          Category
                        </td>
                        <td className="py-3 px-4 text-slate-800">{product.category}</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="py-3 px-4 font-bold text-slate-700 bg-slate-50">
                          Net Quantity / Unit
                        </td>
                        <td className="py-3 px-4 text-slate-800 font-semibold">{product.unit}</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="py-3 px-4 font-bold text-slate-700 bg-slate-50">
                          Origin / Sourced From
                        </td>
                        <td className="py-3 px-4 text-slate-800">{product.origin}</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="py-3 px-4 font-bold text-slate-700 bg-slate-50">
                          Shelf Life
                        </td>
                        <td className="py-3 px-4 text-slate-800">
                          9 Months from the date of packaging
                        </td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="py-3 px-4 font-bold text-slate-700 bg-slate-50">
                          Diet Type
                        </td>
                        <td className="py-3 px-4 text-emerald-700 font-bold flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                          <span>100% Vegetarian (शाकाहारी)</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-bold text-slate-700 bg-slate-50">
                          Storage Instructions
                        </td>
                        <td className="py-3 px-4 text-slate-800">
                          Store in an airtight container in a cool, dry and hygienic environment.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RATINGS & CUSTOMER REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="pt-6 space-y-6">
              {/* Star Rating Breakdown & Summary */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Left: Overall Score */}
                  <div className="md:col-span-4 text-center md:border-r md:border-slate-200 md:pr-6 space-y-2">
                    <div className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight tabular-nums">
                      {averageRating}
                      <span className="text-base sm:text-lg text-slate-400 font-normal"> / 5.0</span>
                    </div>
                    <div className="flex items-center justify-center gap-1 text-amber-500">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-5 h-5 ${
                            s <= Math.round(averageRating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-amber-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      Based on {totalReviewsCount} Customer Ratings
                    </p>
                    <div className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-100 font-semibold px-2.5 py-1 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{recommendRate}% of verified buyers recommend</span>
                    </div>
                  </div>

                  {/* Right: Star Bar Breakdown */}
                  <div className="md:col-span-8 space-y-2">
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const count = ratingCounts[stars] || 0;
                      const pct = totalReviewsCount > 0 ? Math.round((count / totalReviewsCount) * 100) : 0;
                      const isSelected = selectedRatingFilter === stars;

                      return (
                        <button
                          key={stars}
                          type="button"
                          onClick={() =>
                            setSelectedRatingFilter((prev) => (prev === stars ? 'all' : stars))
                          }
                          className={`w-full flex items-center gap-3 text-xs group cursor-pointer p-1.5 rounded-lg transition-colors ${
                            isSelected ? 'bg-emerald-50 ring-1 ring-emerald-400' : 'hover:bg-slate-100'
                          }`}
                        >
                          <span className="w-12 font-bold text-slate-700 flex items-center gap-1 shrink-0">
                            <span>{stars}</span>
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          </span>

                          <div className="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                stars >= 4
                                  ? 'bg-emerald-500'
                                  : stars === 3
                                  ? 'bg-amber-400'
                                  : 'bg-rose-400'
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>

                          <span className="w-10 text-right text-slate-500 font-mono text-[11px] tabular-nums shrink-0">
                            {pct}%
                          </span>
                          <span className="w-8 text-right text-slate-400 font-mono text-[11px] tabular-nums shrink-0">
                            ({count})
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Write Review Action */}
                <div className="mt-5 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs text-slate-600 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Have you tried this product? Share your experience with other shoppers.</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsWritingReview((prev) => !prev)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <MessageSquarePlus className="w-4 h-4" />
                    <span>{isWritingReview ? 'Close Review Form' : 'Write a Customer Review'}</span>
                  </button>
                </div>
              </div>

              {/* Review Form */}
              {isWritingReview && (
                <div className="bg-white border-2 border-emerald-400 rounded-2xl p-5 sm:p-6 shadow-md transition-all">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      Write your review for {product.name}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsWritingReview(false)}
                      className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {submitSuccess ? (
                    <div className="py-8 text-center space-y-2">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl font-bold">
                        ✓
                      </div>
                      <h4 className="text-base font-bold text-slate-900">Review Submitted!</h4>
                      <p className="text-xs text-slate-600">
                        Thank you for sharing your feedback. Your review is now live!
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleReviewSubmit} className="space-y-4 pt-4">
                      {/* Star Rating */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Overall Rating <span className="text-rose-500">*</span>
                        </label>
                        <div className="flex items-center gap-1.5">
                          {[1, 2, 3, 4, 5].map((star) => {
                            const activeStar = hoverRating || newRating;
                            return (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setNewRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                className="p-1 rounded-md transition-transform hover:scale-125 focus:outline-hidden cursor-pointer"
                              >
                                <Star
                                  className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                                    star <= activeStar
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'text-slate-300 hover:text-amber-200'
                                  }`}
                                />
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Author & Location */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Your Name <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={authorName}
                            onChange={(e) => setAuthorName(e.target.value)}
                            placeholder="e.g. Ramesh Kumar"
                            className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            City / Town
                          </label>
                          <input
                            type="text"
                            value={locationName}
                            onChange={(e) => setLocationName(e.target.value)}
                            placeholder="e.g. Suriyawan, UP"
                            className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 outline-hidden"
                          />
                        </div>
                      </div>

                      {/* Title */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Review Headline <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={reviewTitle}
                          onChange={(e) => setReviewTitle(e.target.value)}
                          placeholder="e.g. Pure authentic aroma and rich flavor!"
                          className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 outline-hidden"
                        />
                      </div>

                      {/* Comment */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Detailed Feedback <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                          required
                          rows={3}
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="Describe freshness, aroma, taste or cooking experience..."
                          className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 outline-hidden"
                        />
                      </div>

                      {/* Recommendation */}
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="recommend-check-pdp"
                          checked={recommendProduct}
                          onChange={(e) => setRecommendProduct(e.target.checked)}
                          className="w-4 h-4 text-emerald-600 rounded border-slate-300"
                        />
                        <label
                          htmlFor="recommend-check-pdp"
                          className="text-xs text-slate-700 font-medium cursor-pointer"
                        >
                          I recommend this product to other buyers
                        </label>
                      </div>

                      {/* Submit */}
                      <div className="flex items-center justify-end gap-2.5 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsWritingReview(false)}
                          className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 rounded-xl cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl cursor-pointer transition-colors"
                        >
                          <Send className="w-4 h-4" />
                          <span>Submit Review</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* Review List */}
              <div className="space-y-4 pt-2">
                {filteredReviews.length === 0 ? (
                  <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                    <Star className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-sm font-bold text-slate-700">No reviews found for this rating</p>
                    <button
                      type="button"
                      onClick={() => setSelectedRatingFilter('all')}
                      className="text-xs font-bold text-emerald-700 hover:underline pt-1 cursor-pointer"
                    >
                      View all reviews
                    </button>
                  </div>
                ) : (
                  filteredReviews.map((rev) => {
                    const initial = rev.author ? rev.author.charAt(0).toUpperCase() : 'U';
                    return (
                      <div
                        key={rev.id}
                        className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                              {initial}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs sm:text-sm text-slate-900">
                                  {rev.author}
                                </span>
                                {rev.verified && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    Verified Buyer
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                                {rev.location && <span>{rev.location}</span>}
                                {rev.location && <span>·</span>}
                                <span>{rev.date}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center text-amber-400 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200/50">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3.5 h-3.5 ${
                                  s <= Math.round(rev.rating)
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-amber-200'
                                }`}
                              />
                            ))}
                            <span className="ml-1 text-xs font-bold text-slate-800 tabular-nums">
                              {rev.rating}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                            {rev.title}
                          </h4>
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                            {rev.comment}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                          <span className="text-[11px] text-slate-400">
                            Was this review helpful?
                          </span>
                          <button
                            type="button"
                            onClick={() => handleHelpfulClick(rev.id)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                              rev.userVotedHelpful
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            <ThumbsUp className={`w-3.5 h-3.5 ${rev.userVotedHelpful ? 'fill-emerald-700' : ''}`} />
                            <span>Helpful ({rev.helpfulCount})</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* ================= 4. RELATED & RECOMMENDED PRODUCTS ================= */}
        {relatedProducts.length > 0 && (
          <div className="mt-10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  Frequently Bought Together & Related Items
                </h3>
                <p className="text-xs text-slate-500">
                  Customers in Suriyawan also ordered these authentic products
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((relProd) => (
                <div
                  key={relProd.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-3.5 flex flex-col justify-between hover:shadow-md hover:border-emerald-300 transition-all group"
                >
                  <div
                    onClick={() => onSelectProduct(relProd)}
                    className="cursor-pointer flex justify-center items-center my-1"
                  >
                    <ProductVisual product={relProd} size="md" />
                  </div>

                  <div className="space-y-1 mt-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {relProd.category}
                    </span>
                    <h4
                      onClick={() => onSelectProduct(relProd)}
                      className="font-semibold text-slate-800 text-xs sm:text-sm line-clamp-2 hover:text-emerald-700 cursor-pointer h-10 leading-snug"
                    >
                      {relProd.name}
                    </h4>
                    <div className="flex items-baseline gap-2 pt-0.5">
                      <span className="text-sm font-bold text-slate-900 tabular-nums">
                        ₹{relProd.price}
                      </span>
                      <span className="text-xs text-slate-400 line-through tabular-nums">
                        ₹{relProd.originalPrice}
                      </span>
                      <span className="text-[10px] text-slate-500 ml-auto font-medium">
                        {relProd.unit}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-1 flex gap-2">
                    <button
                      onClick={() => onSelectProduct(relProd)}
                      className="flex-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 py-2 rounded-xl transition-colors cursor-pointer text-center"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => onAddToCart(relProd)}
                      className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors cursor-pointer"
                      title="Add to Cart"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ================= 5. MOBILE STICKY BOTTOM BAR (AMAZON/FLIPKART STYLE) ================= */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2.5 shadow-lg">
        <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
          <div>
            <div className="text-[11px] text-slate-500 uppercase tracking-wider font-bold">
              Total ({selectedQuantity} item)
            </div>
            <div className="text-lg font-black text-slate-900 tabular-nums leading-none">
              ₹{itemSubtotal}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-1 justify-end">
            <button
              onClick={() => {
                for (let i = 0; i < selectedQuantity; i++) {
                  onAddToCart(product);
                }
              }}
              className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>

            <button
              onClick={triggerBuyNow}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs border border-amber-600/30"
            >
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
