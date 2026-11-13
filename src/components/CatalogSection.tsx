import React, { useState } from 'react';
import { Heart, Plus, Minus, ShoppingCart, SlidersHorizontal, X } from 'lucide-react';
import { Product, CartItem, PackVariant } from '../types';
import { ProductVisual } from './ProductVisual';
import { ScrollReveal } from './ScrollReveal';
import { getProductVariants, getDefaultVariant } from '../utils/variants';
import { useLanguage, CATEGORY_HINDI_NAMES } from '../utils/i18n';

interface CatalogSectionProps {
  products: Product[];
  activeCategory: string | null;
  searchQuery: string;
  cart: CartItem[];
  wishlist: string[];
  onAddToCart: (product: Product, variant?: PackVariant) => void;
  onUpdateQuantity: (productId: string, quantity: number, variantLabel?: string) => void;
  onToggleWishlist: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
  onClearCategory: () => void;
  onClearSearch: () => void;
}

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  products,
  activeCategory,
  searchQuery,
  cart,
  wishlist,
  onAddToCart,
  onUpdateQuantity,
  onToggleWishlist,
  onSelectProduct,
  onClearCategory,
  onClearSearch,
}) => {
  const { lang, t } = useLanguage();
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [selectedVariants, setSelectedVariants] = useState<Record<string, PackVariant>>({});

  const getActiveVariant = (product: Product): PackVariant => {
    return selectedVariants[product.id] || getDefaultVariant(product);
  };

  // Filter
  let filtered = [...products];

  if (activeCategory) {
    filtered = filtered.filter((p) => p.categorySlug === activeCategory);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.hindiName && p.hindiName.includes(q)) ||
        p.description.toLowerCase().includes(q)
    );
  }

  // Sort
  if (sortBy === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  const activeCategoryName = activeCategory
    ? lang === 'hi'
      ? CATEGORY_HINDI_NAMES[activeCategory] || products.find((p) => p.categorySlug === activeCategory)?.category
      : products.find((p) => p.categorySlug === activeCategory)?.category
    : null;

  return (
    <section id="catalog-section" className="w-full bg-white px-4 sm:px-8 lg:px-12 xl:px-16 py-8 border-t border-slate-100">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {activeCategoryName
                ? activeCategoryName
                : searchQuery
                ? t(`Results for "${searchQuery}"`, `"${searchQuery}" के परिणाम`)
                : t('All Spices & Daily Essentials', 'सभी शुद्ध मसाले व दैनिक किराना')}
            </h2>
            <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
              {filtered.length} {t('Items', 'आइटम')}
            </span>
          </div>

          {(activeCategory || searchQuery) && (
            <div className="flex items-center gap-2 mt-2">
              {activeCategory && (
                <button
                  onClick={onClearCategory}
                  className="inline-flex items-center gap-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full cursor-pointer transition-colors"
                >
                  <span>{t('Category Filter', 'कैटेगरी फ़िल्टर')}</span>
                  <X className="w-3 h-3" />
                </button>
              )}
              {searchQuery && (
                <button
                  onClick={onClearSearch}
                  className="inline-flex items-center gap-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full cursor-pointer transition-colors"
                >
                  <span>{t('Search', 'खोजें')}: "{searchQuery}"</span>
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 text-xs">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          <span className="text-slate-500 font-medium">{t('Sort by:', 'क्रम चुनें:')}</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-semibold text-slate-800 text-xs focus:outline-hidden focus:border-emerald-600 cursor-pointer"
          >
            <option value="featured">{t('Featured / Best Deal', 'लोकप्रिय / बेस्ट डील')}</option>
            <option value="price-asc">{t('Price: Low to High', 'दाम: कम से ज़्यादा')}</option>
            <option value="price-desc">{t('Price: High to Low', 'दाम: ज़्यादा से कम')}</option>
            <option value="rating">{t('Customer Rating', 'ग्राहक रेटिंग')}</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center bg-slate-50 rounded-3xl border border-slate-200 p-8 space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center text-3xl mx-auto">
            🔍
          </div>
          <h3 className="text-base font-bold text-slate-800">{t('No products found', 'कोई प्रोडक्ट नहीं मिला')}</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {t(
              "We couldn't find any products matching your query. Try searching for rice, haldi, mirch, agarbatti, or toor dal.",
              'आपकी खोज से जुड़ा कोई प्रोडक्ट नहीं मिला। चावल, हल्दी, मिर्च, अगरबत्ती या तुअर दाल खोजें।'
            )}
          </p>
          <button
            onClick={() => {
              onClearCategory();
              onClearSearch();
            }}
            className="bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-emerald-700 cursor-pointer"
          >
            {t('Reset Filters', 'फ़िल्टर हटाएं')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-5">
          {filtered.map((product, index) => {
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
              <ScrollReveal
                key={product.id}
                animation="fade-up"
                delay={(index % 4) * 40}
                duration={450}
                className="h-full"
              >
                <div className="group relative bg-white rounded-2xl border border-slate-200/90 p-3.5 sm:p-4 flex flex-col justify-between hover:shadow-lg transition-all duration-200 hover:border-emerald-300 h-full">
                  {/* Badges & Wishlist heart on top */}
                  <div className="flex items-start justify-between gap-1 mb-1.5">
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

                  {/* Visual */}
                  <div
                    onClick={() => onSelectProduct(product)}
                    className="cursor-pointer my-1.5 flex justify-center items-center"
                  >
                    <ProductVisual product={product} size="md" priority={index < 2} />
                  </div>

                  {/* Details */}
                  <div className="space-y-1.5 mt-1.5">
                    <div className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest truncate">
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

                    {/* Pack Weight / Size Selector */}
                    <div className="pt-0.5">
                      <div className="flex flex-wrap gap-1">
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
                                setSelectedVariants((prev) => ({
                                  ...prev,
                                  [product.id]: v,
                                }));
                              }}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-emerald-400 hover:text-emerald-700'
                              }`}
                            >
                              {shortLabel}
                            </button>
                          );
                        })}
                      </div>
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

                    {/* Sold progress */}
                    <div className="space-y-1 pt-1">
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-600 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <div className="text-[11px] font-medium text-slate-500 tabular-nums">
                        {t('Sold', 'बिका')} {product.soldCount}/{product.totalCount}
                      </div>
                    </div>
                  </div>

                  {/* Add to Cart or Stepper */}
                  <div className="mt-3.5 pt-1">
                    {!product.inStock ? (
                      <div className="w-full bg-slate-100 text-slate-500 font-bold text-xs py-2.5 px-4 rounded-xl text-center">
                        {t('Out of Stock', 'स्टॉक खत्म')}
                      </div>
                    ) : quantity === 0 ? (
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
              </ScrollReveal>
            );
          })}
        </div>
      )}
    </section>
  );
};
