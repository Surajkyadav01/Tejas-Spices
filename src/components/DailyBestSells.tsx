import React, { useState, useEffect } from 'react';
import { Heart, Plus, Minus, ShoppingCart, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product, CartItem, PackVariant } from '../types';
import { ProductVisual } from './ProductVisual';
import { getProductVariants, getDefaultVariant } from '../utils/variants';
import { useLanguage, CATEGORY_HINDI_NAMES } from '../utils/i18n';

interface DailyBestSellsProps {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  onAddToCart: (product: Product, variant?: PackVariant) => void;
  onUpdateQuantity: (productId: string, quantity: number, variantLabel?: string) => void;
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
  const { lang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'featured' | 'popular' | 'new'>('featured');
  const [selectedVariants, setSelectedVariants] = useState<Record<string, PackVariant>>({});
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

  const getActiveVariant = (product: Product): PackVariant => {
    return selectedVariants[product.id] || getDefaultVariant(product);
  };

  // Filter products based on selected tab
  const filteredProducts = products
    .filter((p) => {
      if (activeTab === 'popular') return p.isPopular;
      if (activeTab === 'new') return p.isNew;
      return p.isFeatured;
    })
    .slice(0, 4);

  const handleMemberSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (memberEmail && memberPassword) {
      setMemberRegistered(true);
      onApplyCoupon('TEJAS10');
    }
  };

  return (
    <section className="w-full bg-white px-4 sm:px-8 lg:px-12 xl:px-16 py-8">
      {/* Header with Title, Tabs, Countdown Timer & Arrow controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-3 sm:gap-5">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {t('Daily Best Sells', 'आज की बेस्ट डील्स')}
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
              {t('Featured', 'खास')}
            </button>
            <button
              onClick={() => setActiveTab('popular')}
              className={`px-3.5 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                activeTab === 'popular'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('Popular', 'लोकप्रिय')}
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`px-3.5 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                activeTab === 'new'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('New', 'नया स्टॉक')}
            </button>
          </div>

          {/* Dynamic Countdown Timer badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold font-mono">
            <span className="font-sans font-semibold text-rose-500">
              {t('Expires in:', 'ऑफर समाप्त होने में:')}
            </span>
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

      {/* Main Grid: 4 Products + 1 Right Side Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-5 items-stretch">
        {filteredProducts.map((product, index) => {
          const variants = getProductVariants(product);
          const activeVariant = getActiveVariant(product);
          const cartItem = cart.find(
            (item) =>
              item.product.id === product.id &&
              (item.selectedVariant?.label || item.product.unit) === activeVariant.label
          );
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
                  {activeVariant.discountPercent > 0 && (
                    <span className="bg-[#ef4444] text-white text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full shadow-2xs">
                      {t(`Save ${activeVariant.discountPercent}%`, `${activeVariant.discountPercent}% छूट`)}
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
                className="cursor-pointer my-1.5 flex justify-center items-center"
              >
                <ProductVisual product={product} size="md" priority={index === 0} />
              </div>

              {/* Product Info */}
              <div className="space-y-1.5 mt-1.5">
                <div className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  {lang === 'hi'
                    ? CATEGORY_HINDI_NAMES[product.categorySlug] || product.category
                    : product.category}
                </div>
                <h3
                  onClick={() => onSelectProduct(product)}
                  className="font-semibold text-slate-800 text-sm leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2 cursor-pointer min-h-[2.5rem] tracking-tight"
                >
                  {lang === 'hi' && product.hindiName ? product.hindiName : product.name}
                </h3>

                {/* Pack Size Pills */}
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {variants.map((v) => {
                    const isSelected = v.label === activeVariant.label;
                    const shortLabel = v.label
                      .replace(' Family Pack', '')
                      .replace(' Vacuum Pack', '')
                      .replace(' Kraft Pouch', '')
                      .replace(' Zipper Pouch', '')
                      .replace(' Aroma Seal Pack', '')
                      .replace(' Sealed Jar', '')
                      .replace('Bottle', '')
                      .trim();
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVariants((prev) => ({ ...prev, [product.id]: v }));
                        }}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-emerald-400'
                        }`}
                      >
                        {shortLabel}
                      </button>
                    );
                  })}
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-base font-bold text-slate-900 tabular-nums tracking-tight">
                    ₹{activeVariant.price}
                  </span>
                  <span className="text-xs text-slate-400 line-through tabular-nums">
                    ₹{activeVariant.originalPrice}
                  </span>
                  <span className="text-[11px] font-medium text-slate-500 ml-auto truncate max-w-[90px]">
                    {activeVariant.label}
                  </span>
                </div>

                {/* Sold progress bar */}
                <div className="space-y-1 pt-1">
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                  <div className="text-[11px] font-medium text-slate-500 tabular-nums">
                    {t('Sold', 'बिका')} {product.soldCount}/{product.totalCount}
                  </div>
                </div>
              </div>

              {/* Action: Add to cart or Quantity Stepper */}
              <div className="mt-4 pt-1">
                {quantity === 0 ? (
                  <button
                    onClick={() => onAddToCart(product, activeVariant)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs tracking-wide py-2.5 px-4 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer uppercase"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>{t('Add to cart', 'कार्ट में जोड़ें')}</span>
                  </button>
                ) : (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-300 rounded-xl p-1 text-emerald-900">
                    <button
                      onClick={() => onUpdateQuantity(product.id, quantity - 1, activeVariant.label)}
                      className="w-7 h-7 rounded-lg bg-white border border-emerald-200 text-emerald-700 flex items-center justify-center hover:bg-emerald-100 transition-colors cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-black font-mono px-2">
                      {quantity} {t('in cart', 'कार्ट में')}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(product.id, quantity + 1, activeVariant.label)}
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

        {/* 5th Card: Side Banner */}
        <div className="rounded-2xl bg-[#fffcf5] border border-amber-200/90 p-5 flex flex-col justify-between shadow-xs">
          <div className="space-y-3">
            <span className="inline-block text-2xl font-black text-slate-900">
              {t('10% OFF', '10% की छूट')}
            </span>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              {t('For new members sign up for the first time', 'पहली बार नए ग्राहक रजिस्ट्रेशन करने पर तुरंत छूट पाएं')}
            </p>

            {!memberRegistered ? (
              <form onSubmit={handleMemberSignup} className="space-y-2.5 pt-2">
                <div>
                  <input
                    type="email"
                    required
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                    placeholder={t('Email address', 'ईमेल पता दर्ज करें')}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600 bg-white placeholder-slate-400"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    required
                    value={memberPassword}
                    onChange={(e) => setMemberPassword(e.target.value)}
                    placeholder={t('Password', 'पासवर्ड बनाएं')}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600 bg-white placeholder-slate-400"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-xs cursor-pointer mt-1"
                >
                  {t('Register Now', 'अभी रजिस्टर करें')}
                </button>
              </form>
            ) : (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-1">
                <Check className="w-5 h-5 text-emerald-600 mx-auto" />
                <div className="text-xs font-bold text-emerald-900">{t('Registered!', 'रजिस्टर हो गया!')}</div>
                <div className="text-[11px] text-emerald-700">
                  {t('Coupon', 'कूपन')} <span className="font-mono font-bold">TEJAS10</span> {t('applied to cart.', 'कार्ट में लागू हो गया।')}
                </div>
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-400 border-t border-amber-200/60 pt-3 mt-4">
            🔒 {t('Safe & Secure 100% Authentic Store', 'सुरक्षित व 100% शुद्ध विश्वसनीय स्टोर')}
          </div>
        </div>
      </div>
    </section>
  );
};
