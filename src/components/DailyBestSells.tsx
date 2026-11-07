import React, { useState, useEffect } from 'react';
import { Heart, Plus, Minus, ShoppingCart, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product, CartItem } from '../types';
import { ProductVisual } from './ProductVisual';

interface DailyBestSellsProps {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onToggleWishlist: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
  onApplyCoupon: (code: string) => void;
}

export const DailyBestSells: React.FC<DailyBestSellsProps> = ({
  products,
  cart,
  wishlist,
  onAddToCart,
  onUpdateQuantity,
  onToggleWishlist,
  onSelectProduct,
  onApplyCoupon,
}) => {
  const [activeTab, setActiveTab] = useState<'featured' | 'popular' | 'new'>('featured');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberPassword, setMemberPassword] = useState('');
  const [memberRegistered, setMemberRegistered] = useState(false);

  // Dynamic countdown timer (hours : mins : secs)
  const [timeLeft, setTimeLeft] = useState({ hours: 10, minutes: 45, seconds: 34 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 23, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatNum = (num: number) => num.toString().padStart(2, '0');

  // Filter products based on selected tab
  const filteredProducts = products.filter((p) => {
    if (activeTab === 'popular') return p.isPopular;
    if (activeTab === 'new') return p.isNew;
    return p.isFeatured;
  }).slice(0, 4);

  const handleMemberSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (memberEmail && memberPassword) {
      setMemberRegistered(true);
      onApplyCoupon('TEJAS10');
    }
  };

  return (
    <section className="w-full bg-white px-4 sm:px-8 lg:px-12 xl:px-16 py-8">
      {/* Header with Title, Tabs, Countdown Timer & Arrow controls matching Screenshot 3 & 5 */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-3 sm:gap-5">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Daily Best Sells
          </h2>

          {/* Tab buttons */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full">
            <button
              onClick={() => setActiveTab('featured')}
              className={`px-3.5 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                activeTab === 'featured'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Featured
            </button>
            <button
              onClick={() => setActiveTab('popular')}
              className={`px-3.5 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                activeTab === 'popular'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Popular
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`px-3.5 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                activeTab === 'new'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              New
            </button>
          </div>

          {/* Dynamic Countdown Timer badge matching Screenshot 3 */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold font-mono">
            <span className="font-sans font-semibold text-rose-500">Expires in:</span>
            <span>{formatNum(timeLeft.hours)}</span>
            <span className="animate-pulse">:</span>
            <span>{formatNum(timeLeft.minutes)}</span>
            <span className="animate-pulse">:</span>
            <span>{formatNum(timeLeft.seconds)}</span>
          </div>
        </div>

        {/* Carousel arrows */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => setActiveTab('featured')}
            className="w-8 h-8 rounded-full border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
            aria-label="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTab(activeTab === 'featured' ? 'popular' : 'new')}
            className="w-8 h-8 rounded-full border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
            aria-label="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: 4 Products + 1 Right Side Banner matching Screenshot 5 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-5 items-stretch">
        {filteredProducts.map((product, index) => {
          const cartItem = cart.find((item) => item.product.id === product.id);
          const quantity = cartItem ? cartItem.quantity : 0;
          const isWishlisted = wishlist.includes(product.id);
          const progressPercent = Math.min(100, Math.round((product.soldCount / product.totalCount) * 100));

          return (
            <div
              key={product.id}
              className="group relative bg-white rounded-2xl border border-slate-200/90 p-4 flex flex-col justify-between hover:shadow-lg transition-all duration-200 hover:border-emerald-300"
            >
              {/* Badges & Wishlist heart on top */}
              <div className="flex items-start justify-between gap-1 mb-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  {product.discountPercent > 0 && (
                    <span className="bg-[#ef4444] text-white text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full shadow-2xs">
                      Save {product.discountPercent}%
                    </span>
                  )}
                  {product.badge && product.badge !== `Save ${product.discountPercent}%` && (
                    <span className="bg-emerald-600 text-white text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full shadow-2xs">
                      {product.badge}
                    </span>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWishlist(product.id);
                  }}
                  className={`p-1.5 rounded-full border transition-colors cursor-pointer ${
                    isWishlisted
                      ? 'bg-rose-50 border-rose-200 text-rose-500'
                      : 'bg-white border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                </button>
              </div>

              {/* Product Visual */}
              <div
                onClick={() => onSelectProduct(product)}
                className="cursor-pointer my-2 flex justify-center items-center"
              >
                <ProductVisual product={product} size="md" priority={index === 0} />
              </div>

              {/* Product Info */}
              <div className="space-y-1.5 mt-2">
                <div className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  {product.category}
                </div>
                <h3
                  onClick={() => onSelectProduct(product)}
                  className="font-semibold text-slate-800 text-sm leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2 cursor-pointer h-10 tracking-tight"
                >
                  {product.name}
                </h3>

                {/* Price */}
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-base font-bold text-slate-900 tabular-nums tracking-tight">
                    ₹{product.price}
                  </span>
                  <span className="text-xs text-slate-400 line-through tabular-nums">
                    ₹{product.originalPrice}
                  </span>
                  <span className="text-[11px] font-medium text-slate-500 ml-auto">
                    {product.unit}
                  </span>
                </div>

                {/* Sold progress bar matching Screenshot 3 & 5 */}
                <div className="space-y-1 pt-1.5">
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                  <div className="text-[11px] font-medium text-slate-500 tabular-nums">
                    Sold {product.soldCount}/{product.totalCount}
                  </div>
                </div>
              </div>

              {/* Action: Add to cart or Quantity Stepper */}
              <div className="mt-4 pt-1">
                {quantity === 0 ? (
                  <button
                    onClick={() => onAddToCart(product)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs tracking-wide py-2.5 px-4 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer uppercase"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Add to cart</span>
                  </button>
                ) : (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-300 rounded-xl p-1 text-emerald-900">
                    <button
                      onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                      className="w-7 h-7 rounded-lg bg-white border border-emerald-200 text-emerald-700 flex items-center justify-center hover:bg-emerald-100 transition-colors cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-black font-mono px-2">
                      {quantity} in cart
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 transition-colors cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* 5th Card: Side Banner matching Screenshot 5 */}
        <div className="rounded-2xl bg-[#fffcf5] border border-amber-200/90 p-5 flex flex-col justify-between shadow-xs">
          <div className="space-y-3">
            <span className="inline-block text-2xl font-black text-slate-900">
              10% OFF
            </span>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              For new members sign up for the first time
            </p>

            {!memberRegistered ? (
              <form onSubmit={handleMemberSignup} className="space-y-2.5 pt-2">
                <div>
                  <input
                    type="email"
                    required
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600 bg-white placeholder-slate-400"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    required
                    value={memberPassword}
                    onChange={(e) => setMemberPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600 bg-white placeholder-slate-400"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-xs cursor-pointer mt-1"
                >
                  Register Now
                </button>
              </form>
            ) : (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-1">
                <Check className="w-5 h-5 text-emerald-600 mx-auto" />
                <div className="text-xs font-bold text-emerald-900">Registered!</div>
                <div className="text-[11px] text-emerald-700">
                  Coupon <span className="font-mono font-bold">TEJAS10</span> applied to cart.
                </div>
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-400 border-t border-amber-200/60 pt-3 mt-4">
            🔒 Safe & Secure 100% Authentic Store
          </div>
        </div>
      </div>
    </section>
  );
};
