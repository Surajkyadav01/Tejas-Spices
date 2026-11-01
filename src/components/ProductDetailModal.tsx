import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Heart,
  ShoppingCart,
  Plus,
  Minus,
  Check,
  Star,
  ShieldCheck,
  MapPin,
  Sparkles,
  ThumbsUp,
  MessageSquarePlus,
  CheckCircle2,
  Award,
  ArrowRight,
  User,
  Send,
} from 'lucide-react';
import { Product, CartItem, ProductReview, UserProfile } from '../types';
import { ProductVisual } from './ProductVisual';
import {
  getReviewsForProduct,
  saveNewReview,
  toggleHelpfulVote,
} from '../data/mockReviews';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  cart: CartItem[];
  wishlist: string[];
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onToggleWishlist: (productId: string) => void;
  user?: UserProfile;
  onAddReview?: (productId: string, newRating: number, updatedReviewsCount: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  cart,
  wishlist,
  onAddToCart,
  onUpdateQuantity,
  onToggleWishlist,
  user,
  onAddReview,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews'>('overview');
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'highest' | 'helpful'>('recent');

  // Form states
  const [newRating, setNewRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [authorName, setAuthorName] = useState<string>('');
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
    }
  }, [product]);

  // Pre-fill user details if logged in
  useEffect(() => {
    if (user && user.isLoggedIn) {
      if (user.name) setAuthorName(user.name);
      if (user.savedAddress) {
        const parts = user.savedAddress.split(',');
        const cityPart = parts[parts.length - 2]?.trim() || 'Suriyawan, UP';
        setLocationName(cityPart);
      }
    } else {
      setAuthorName('');
    }
  }, [user]);

  // Derived rating metrics
  const { averageRating, ratingCounts, totalReviewsCount, recommendRate } = useMemo(() => {
    if (!reviews || reviews.length === 0) {
      return {
        averageRating: product?.rating || 4.8,
        ratingCounts: { 5: 12, 4: 3, 3: 1, 2: 0, 1: 0 },
        totalReviewsCount: product?.reviewsCount || 16,
        recommendRate: 96,
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

  // Filtered & sorted reviews
  const filteredReviews = useMemo(() => {
    let list = [...reviews];
    if (selectedRatingFilter !== 'all') {
      list = list.filter((r) => Math.round(r.rating) === selectedRatingFilter);
    }

    if (sortBy === 'recent') {
      // Keep natural order (newest first)
    } else if (sortBy === 'highest') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'helpful') {
      list.sort((a, b) => b.helpfulCount - a.helpfulCount);
    }

    return list;
  }, [reviews, selectedRatingFilter, sortBy]);

  if (!product) return null;

  const cartItem = cart.find((item) => item.product.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;
  const isWishlisted = wishlist.includes(product.id);

  const getRatingFeedbackLabel = (stars: number) => {
    switch (stars) {
      case 5:
        return '5 Stars — Excellent / Loved it!';
      case 4:
        return '4 Stars — Very Good Quality';
      case 3:
        return '3 Stars — Average / Satisfactory';
      case 2:
        return '2 Stars — Below Expectations';
      case 1:
        return '1 Star — Poor Experience';
      default:
        return 'Select a star rating';
    }
  };

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

    // Calculate new overall product rating
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-4 md:p-6">
        <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-4 sm:my-8 flex flex-col max-h-[92vh]">
          {/* Top Bar with Navigation Tabs & Close */}
          <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Overview & Details
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('reviews')}
                className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'reviews'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>Ratings & Reviews</span>
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold tabular-nums ${
                    activeTab === 'reviews'
                      ? 'bg-emerald-800 text-emerald-100'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {totalReviewsCount}
                </span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6">
            {/* ================= TAB 1: OVERVIEW ================= */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  {/* Left Product Visual */}
                  <div className="p-6 sm:p-8 bg-slate-50/80 rounded-2xl flex flex-col items-center justify-center border border-slate-100">
                    <div className="w-full max-w-xs">
                      <ProductVisual product={product} size="lg" />
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-3 py-1.5 rounded-full font-semibold">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>100% Farm-Pure & Cold-Milled Guarantee</span>
                    </div>
                  </div>

                  {/* Right Product Buy Box */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="font-bold uppercase tracking-wider text-emerald-700 text-[11px]">
                          {product.category}
                        </span>
                        <span className="font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                          {product.unit}
                        </span>
                      </div>

                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                        {product.name}
                      </h2>

                      {product.hindiName && (
                        <div className="text-xs sm:text-sm text-slate-500 font-medium">
                          {product.hindiName}
                        </div>
                      )}

                      {/* Interactive Rating Banner Link */}
                      <button
                        type="button"
                        onClick={() => setActiveTab('reviews')}
                        className="flex items-center gap-2 pt-1 group cursor-pointer text-left"
                      >
                        <div className="flex items-center bg-amber-50 border border-amber-200/70 px-2 py-0.5 rounded-lg">
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
                          <span className="font-extrabold ml-1.5 text-xs text-slate-800 tabular-nums">
                            {averageRating}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-emerald-700 group-hover:underline flex items-center gap-1">
                          <span>{totalReviewsCount} customer ratings & reviews</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </button>
                    </div>

                    {/* Price & Savings */}
                    <div className="flex items-baseline gap-2.5 pt-1">
                      <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums tracking-tight">
                        ₹{product.price}
                      </span>
                      <span className="text-sm text-slate-400 line-through tabular-nums">
                        ₹{product.originalPrice}
                      </span>
                      <span className="text-xs font-bold tracking-wider uppercase bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                        Save {product.discountPercent}%
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {product.description}
                    </p>

                    {/* Origin & Sourcing */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        Sourced & Packed at: <strong className="text-slate-800">{product.origin}</strong>
                      </span>
                    </div>

                    {/* Benefits List */}
                    {product.benefits && product.benefits.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                          Key Highlights:
                        </div>
                        <ul className="space-y-1.5">
                          {product.benefits.map((b, i) => (
                            <li key={i} className="text-xs text-slate-600 flex items-center gap-2">
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Cart & Wishlist Actions */}
                    <div className="pt-3 flex items-center gap-3">
                      <button
                        onClick={() => onToggleWishlist(product.id)}
                        className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                          isWishlisted
                            ? 'bg-rose-50 border-rose-300 text-rose-500'
                            : 'border-slate-300 hover:border-slate-400 text-slate-600'
                        }`}
                        aria-label="Wishlist"
                        title={isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
                      >
                        <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                      </button>

                      <div className="flex-1">
                        {quantity === 0 ? (
                          <button
                            onClick={() => onAddToCart(product)}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            <span>Add to Cart</span>
                          </button>
                        ) : (
                          <div className="flex items-center justify-between bg-emerald-50 border border-emerald-300 rounded-xl p-1 text-emerald-900">
                            <button
                              onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                              className="w-9 h-9 rounded-lg bg-white border border-emerald-200 text-emerald-700 flex items-center justify-center hover:bg-emerald-100 transition-colors cursor-pointer"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="text-sm font-black font-mono px-3">
                              {quantity} in Cart
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                              className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 transition-colors cursor-pointer"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Customer Reviews Snapshot Banner */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-xs shrink-0">
                      {averageRating}
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-amber-500">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-4 h-4 ${
                              s <= Math.round(averageRating)
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-amber-200'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-xs text-slate-600 font-medium mt-0.5">
                        Based on {totalReviewsCount} verified customer reviews ({recommendRate}% recommend)
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('reviews');
                        setIsWritingReview(true);
                      }}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      <MessageSquarePlus className="w-4 h-4" />
                      <span>Write a Review</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('reviews')}
                      className="inline-flex items-center justify-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 px-3 py-2.5 rounded-xl border border-emerald-300 hover:bg-white transition-colors cursor-pointer"
                    >
                      <span>Read All ({totalReviewsCount})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB 2: RATINGS & REVIEWS ================= */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* 1. Star Rating Summary & Breakdown Grid */}
                <div className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-4 sm:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    {/* Left: Overall Score */}
                    <div className="md:col-span-4 text-center md:border-r md:border-slate-200/80 md:pr-6 space-y-2">
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
                        {totalReviewsCount} Customer Ratings & Reviews
                      </p>
                      <div className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-100/70 font-semibold px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{recommendRate}% of buyers recommend</span>
                      </div>
                    </div>

                    {/* Middle: 5 to 1 Star Progress Breakdown */}
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
                            className={`w-full flex items-center gap-3 text-xs group cursor-pointer p-1 rounded-lg transition-colors ${
                              isSelected ? 'bg-emerald-50 ring-1 ring-emerald-400' : 'hover:bg-slate-100/80'
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

                  {/* Write a Review Action Row */}
                  <div className="mt-5 pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <span>Have you tried this product? Share your honest review.</span>
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

                {/* 2. Interactive "Write a Review" Form Panel */}
                {isWritingReview && (
                  <div className="bg-white border-2 border-emerald-400/80 rounded-2xl p-5 sm:p-6 shadow-lg transition-all animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                          ✍️
                        </span>
                        <div>
                          <h3 className="text-sm sm:text-base font-bold text-slate-900">
                            Write your review for {product.name}
                          </h3>
                          <p className="text-xs text-slate-500">
                            Help shoppers in Suriyawan and across India make the right choice
                          </p>
                        </div>
                      </div>
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
                        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
                          ✓
                        </div>
                        <h4 className="text-base font-bold text-slate-900">Review Submitted!</h4>
                        <p className="text-xs text-slate-600">
                          Thank you for sharing your feedback. Your verified customer review is now live!
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleReviewSubmit} className="space-y-4 pt-4">
                        {/* Interactive Star Rating Selector */}
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Overall Rating <span className="text-rose-500">*</span>
                          </label>
                          <div className="flex items-center gap-2">
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
                                    aria-label={`${star} Star`}
                                  >
                                    <Star
                                      className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                                        star <= activeStar
                                          ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                                          : 'text-slate-300 hover:text-amber-200'
                                      }`}
                                    />
                                  </button>
                                );
                              })}
                            </div>
                            <span className="text-xs sm:text-sm font-bold text-slate-700 ml-2">
                              {getRatingFeedbackLabel(hoverRating || newRating)}
                            </span>
                          </div>
                        </div>

                        {/* Author & Location Inputs */}
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
                              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-hidden"
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
                              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-hidden"
                            />
                          </div>
                        </div>

                        {/* Review Title */}
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
                            className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-hidden"
                          />
                        </div>

                        {/* Review Comment */}
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Detailed Feedback <span className="text-rose-500">*</span>
                          </label>
                          <textarea
                            required
                            rows={3}
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            placeholder="Describe freshness, aroma, taste, packaging or your cooking experience..."
                            className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-hidden"
                          />
                        </div>

                        {/* Recommendation Checkbox */}
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="recommend-check"
                            checked={recommendProduct}
                            onChange={(e) => setRecommendProduct(e.target.checked)}
                            className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                          />
                          <label
                            htmlFor="recommend-check"
                            className="text-xs text-slate-700 font-medium cursor-pointer"
                          >
                            I recommend this product to other buyers
                          </label>
                        </div>

                        {/* Form Buttons */}
                        <div className="flex items-center justify-end gap-2.5 pt-2">
                          <button
                            type="button"
                            onClick={() => setIsWritingReview(false)}
                            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                          >
                            <Send className="w-4 h-4" />
                            <span>Submit Review</span>
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}

                {/* 3. Review Filtering & Sorting Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                  {/* Rating Filter Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                    <button
                      type="button"
                      onClick={() => setSelectedRatingFilter('all')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                        selectedRatingFilter === 'all'
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      All ({totalReviewsCount})
                    </button>
                    {[5, 4, 3, 2, 1].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedRatingFilter(s)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shrink-0 ${
                          selectedRatingFilter === s
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <span>{s}★</span>
                        <span className="text-[10px] opacity-80">({ratingCounts[s] || 0})</span>
                      </button>
                    ))}
                  </div>

                  {/* Sort Order */}
                  <div className="flex items-center gap-2 shrink-0 text-xs">
                    <span className="text-slate-400 font-medium">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
                    >
                      <option value="recent">Most Recent</option>
                      <option value="highest">Highest Rating</option>
                      <option value="helpful">Most Helpful</option>
                    </select>
                  </div>
                </div>

                {/* 4. Customer Reviews List */}
                <div className="space-y-4">
                  {filteredReviews.length === 0 ? (
                    <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                      <Star className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="text-sm font-bold text-slate-700">No reviews found for this rating</p>
                      <p className="text-xs text-slate-500">
                        Try selecting another filter or be the first to write a review!
                      </p>
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
                          className="bg-white border border-slate-100 rounded-2xl p-4 sm:p-5 shadow-xs hover:border-slate-200 transition-all space-y-3"
                        >
                          {/* Header: Author, Star Rating, Verified Badge */}
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
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
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

                            {/* Stars */}
                            <div className="flex items-center text-amber-400 bg-amber-50/80 px-2 py-1 rounded-lg border border-amber-200/50">
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

                          {/* Headline & Body */}
                          <div className="space-y-1">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                              {rev.title}
                            </h4>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                              {rev.comment}
                            </p>
                          </div>

                          {/* Helpful button vote */}
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
        </div>
      </div>
    </div>
  );
};
