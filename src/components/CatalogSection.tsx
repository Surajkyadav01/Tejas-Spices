import React, { useState } from 'react';
import { Heart, Plus, Minus, ShoppingCart, SlidersHorizontal, X } from 'lucide-react';
import { Product, CartItem } from '../types';
import { ProductVisual } from './ProductVisual';
import { ScrollReveal } from './ScrollReveal';

interface CatalogSectionProps {
  products: Product[];
  activeCategory: string | null;
  searchQuery: string;
  cart: CartItem[];
  wishlist: string[];
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
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
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

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

  return (
    <section id="catalog-section" className="w-full bg-white px-4 sm:px-8 lg:px-12 xl:px-16 py-8 border-t border-slate-100">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {activeCategory
                ? products.find((p) => p.categorySlug === activeCategory)?.category || 'Category Products'
                : searchQuery
                ? `Results for "${searchQuery}"`
                : 'All Spices & Daily Essentials'}
            </h2>
            <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
              {filtered.length} Items
            </span>
          </div>

          {(activeCategory || searchQuery) && (
            <div className="flex items-center gap-2 mt-2">
              {activeCategory && (
                <button
                  onClick={onClearCategory}
                  className="inline-flex items-center gap-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full cursor-pointer transition-colors"
                >
                  <span>Category Filter</span>
                  <X className="w-3 h-3" />
                </button>
              )}
              {searchQuery && (
                <button
                  onClick={onClearSearch}
                  className="inline-flex items-center gap-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full cursor-pointer transition-colors"
                >
                  <span>Search: "{searchQuery}"</span>
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 text-xs">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          <span className="text-slate-500 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-semibold text-slate-800 text-xs focus:outline-hidden focus:border-emerald-600 cursor-pointer"
          >
            <option value="featured">Featured / Best Deal</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Customer Rating</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center bg-slate-50 rounded-3xl border border-slate-200 p-8 space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center text-3xl mx-auto">
            🔍
          </div>
          <h3 className="text-base font-bold text-slate-800">No products found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            We couldn't find any products matching your query. Try searching for rice, haldi, mirch, agarbatti, or toor dal.
          </p>
          <button
            onClick={() => {
              onClearCategory();
              onClearSearch();
            }}
            className="bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-emerald-700 cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5">
          {filtered.map((product, index) => {
            const cartItem = cart.find((item) => item.product.id === product.id);
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
                <div
                  className="group relative bg-white rounded-2xl border border-slate-200/90 p-4 flex flex-col justify-between hover:shadow-lg transition-all duration-200 hover:border-emerald-300 h-full"
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

                {/* Visual */}
                <div
                  onClick={() => onSelectProduct(product)}
                  className="cursor-pointer my-2 flex justify-center items-center"
                >
                  <ProductVisual product={product} size="md" />
                </div>

                {/* Details */}
                <div className="space-y-1 mt-2">
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

                  {/* Sold progress */}
                  <div className="space-y-1 pt-1.5">
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-600 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <div className="text-[11px] font-medium text-slate-500 tabular-nums">
                      Sold {product.soldCount}/{product.totalCount}
                    </div>
                  </div>
                </div>

                {/* Add to Cart or Stepper */}
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
            </ScrollReveal>
          );
          })}
        </div>
      )}
    </section>
  );
};
