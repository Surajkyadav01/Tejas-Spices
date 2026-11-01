import React, { useState } from 'react';
import { 
  Search, 
  Heart, 
  ShoppingCart, 
  User, 
  Phone, 
  LayoutGrid, 
  Flame, 
  Tag, 
  Sparkles, 
  Home, 
  ChevronDown, 
  X,
  Menu,
  FileText
} from 'lucide-react';
import { STORE_INFO, CATEGORIES } from '../data/mockData';
import { Product } from '../types';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAuth: () => void;
  onOpenTrackOrder: () => void;
  onOpenAdmin: () => void;
  onSelectCategory: (categorySlug: string | null) => void;
  activeCategory: string | null;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  allProducts: Product[];
  onSelectProduct: (product: Product) => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenAuth,
  onOpenTrackOrder,
  onOpenAdmin,
  onSelectCategory,
  activeCategory,
  activeTab,
  onSelectTab,
  allProducts,
  onSelectProduct,
}) => {
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Search filtered products for quick dropdown
  const searchResults = searchQuery.trim().length > 1
    ? allProducts.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.hindiName && p.hindiName.includes(searchQuery))
      ).slice(0, 5)
    : [];

  return (
    <header className="sticky top-0 z-40 bg-white shadow-xs">
      {/* 1. Top Alert Bar */}
      {/* 1. Top Alert Bar matching reference screenshot */}
      <div className="bg-emerald-600 text-white text-[11px] sm:text-xs md:text-sm font-medium py-1.5 sm:py-2 px-3 sm:px-4 text-center">
        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2.5">
          <span className="whitespace-nowrap tracking-tight">
            Free delivery on orders above ₹{STORE_INFO.freeDeliveryThreshold} in Suriyawan
          </span>
          <span className="hidden sm:inline text-emerald-200 select-none">·</span>
          <span className="whitespace-nowrap">
            Call us:{' '}
            <a 
              href={`tel:${STORE_INFO.phone1}`} 
              className="underline hover:text-amber-200 transition-colors font-bold tracking-wide"
            >
              {STORE_INFO.phone1}
            </a>
          </span>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-3.5">
        <div className="flex items-center justify-between gap-4 md:gap-8">
          {/* Brand Logo matching reference */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                onSelectCategory(null);
                onSelectTab('home');
              }}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <img
                src="/assets/aistudio/image_585fccde.png"
                alt="Tejas Spices Official Logo"
                className="h-10 sm:h-11 md:h-12 w-auto object-contain drop-shadow-xs transition-transform group-hover:scale-105"
              />
              <div>
                <div className="text-lg sm:text-xl font-black tracking-tight leading-tight flex items-center gap-1.5">
                  <span className="text-slate-900">Tejas</span>
                  <span className="text-red-600">Spices</span>
                </div>
                <div className="text-[10px] sm:text-[11px] font-bold text-emerald-600 tracking-wider uppercase leading-none mt-0.5">
                  Authentic Spices & Fragrances
                </div>
              </div>
            </button>
          </div>

          {/* Wide Search Bar matching reference */}
          <div className="relative flex-1 max-w-3xl hidden md:block">
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
                placeholder="Search for rice, dal, spices, agarbatti, dhoop, dry fruits..."
                className="w-full pl-5 pr-14 py-2.5 rounded-full border border-slate-300 focus:outline-hidden focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-sm text-slate-800 placeholder-slate-400 bg-slate-50/50 hover:bg-white transition-all shadow-2xs"
              />
              <button 
                type="button"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-colors shadow-xs cursor-pointer"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>

            {/* Quick search live preview dropdown */}
            {isSearchFocused && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="p-2 border-b border-slate-100 bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Matching Products ({searchResults.length})
                </div>
                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                  {searchResults.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => onSelectProduct(product)}
                      className="w-full text-left p-3 hover:bg-emerald-50/60 flex items-center gap-3 transition-colors cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-800 shrink-0">
                        ₹{product.price}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-slate-800 truncate">{product.name}</div>
                        <div className="text-xs text-slate-500">{product.category} · {product.unit}</div>
                      </div>
                      <div className="text-xs font-bold text-emerald-600 shrink-0">
                        Save {product.discountPercent}%
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Action Icons matching reference */}
          <div className="flex items-center gap-3 sm:gap-6 shrink-0">
            {/* Direct click to call phone */}
            <a 
              href={`tel:${STORE_INFO.phone1}`}
              className="hidden lg:flex items-center gap-2 text-slate-700 hover:text-emerald-600 font-semibold text-sm transition-colors"
            >
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>{STORE_INFO.phone1}</span>
            </a>

            {/* Wishlist */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2 text-slate-700 hover:text-emerald-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-emerald-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart with Live Count */}
            <button
              onClick={onOpenCart}
              className="relative p-2 text-slate-700 hover:text-emerald-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              title="Shopping Cart"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-emerald-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Login */}
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 text-sm font-semibold transition-colors cursor-pointer border border-transparent hover:border-emerald-200"
            >
              <User className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Login</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 text-slate-700 hover:text-emerald-600 rounded-lg"
              aria-label="Toggle menu"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-3 md:hidden">
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search rice, spices, agarbatti..."
              className="w-full pl-4 pr-12 py-2 rounded-full border border-slate-300 text-sm text-slate-800 placeholder-slate-400 bg-slate-50 focus:outline-hidden focus:border-emerald-600"
            />
            <button className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center">
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Sub-Navbar matching reference */}
      <div className="border-t border-slate-100 hidden md:block">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-2.5">
          <div className="flex items-center justify-between">
            {/* Left Category Button & Navigation Links */}
            <div className="flex items-center gap-8">
              {/* Green Category Pill */}
              <div className="relative">
                <button
                  onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span>Browse All Categories</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showCategoryMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {showCategoryMenu && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in duration-150">
                    <button
                      onClick={() => {
                        onSelectCategory(null);
                        setShowCategoryMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-emerald-50 ${activeCategory === null ? 'text-emerald-700 font-bold bg-emerald-50/50' : 'text-slate-700'}`}
                    >
                      <span>All Products</span>
                      <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full text-slate-500">
                        {allProducts.length}
                      </span>
                    </button>
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          onSelectCategory(cat.slug);
                          setShowCategoryMenu(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-emerald-50 ${activeCategory === cat.slug ? 'text-emerald-700 font-bold bg-emerald-50/50' : 'text-slate-700'}`}
                      >
                        <span>{cat.name}</span>
                        <span className="text-xs text-slate-400">({cat.itemCount})</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Main Nav Links */}
              <nav className="flex items-center gap-7 text-sm font-semibold text-slate-700">
                <button
                  onClick={() => {
                    onSelectTab('home');
                    onSelectCategory(null);
                  }}
                  className={`flex items-center gap-1.5 hover:text-emerald-600 transition-colors cursor-pointer ${activeTab === 'home' && activeCategory === null ? 'text-emerald-600' : ''}`}
                >
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </button>

                <button
                  onClick={() => onSelectTab('hot-deals')}
                  className={`flex items-center gap-1.5 hover:text-emerald-600 transition-colors cursor-pointer ${activeTab === 'hot-deals' ? 'text-emerald-600' : ''}`}
                >
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span>Hot deals</span>
                </button>

                <button
                  onClick={() => onSelectTab('promotions')}
                  className={`flex items-center gap-1.5 hover:text-emerald-600 transition-colors cursor-pointer ${activeTab === 'promotions' ? 'text-emerald-600' : ''}`}
                >
                  <Tag className="w-4 h-4 text-blue-500" />
                  <span>Promotions</span>
                </button>

                <button
                  onClick={() => onSelectTab('new-products')}
                  className={`flex items-center gap-1.5 hover:text-emerald-600 transition-colors cursor-pointer ${activeTab === 'new-products' ? 'text-emerald-600' : ''}`}
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>New products</span>
                </button>

                <button
                  onClick={() => onSelectTab('policy')}
                  className={`flex items-center gap-1.5 hover:text-emerald-600 transition-colors cursor-pointer ${activeTab === 'policy' ? 'text-emerald-600 font-bold' : ''}`}
                >
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>Store Policies</span>
                </button>
              </nav>
            </div>

            {/* Right Helpline matching reference */}
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Phone className="w-4 h-4 text-emerald-600" />
              <a href={`tel:${STORE_INFO.phone1}`} className="hover:text-emerald-600 transition-colors">
                {STORE_INFO.phone1} <span className="text-slate-400 font-normal">/ Support</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {showMobileMenu && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
          <div className="font-bold text-slate-900 text-sm">Navigation</div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <button
              onClick={() => {
                onSelectTab('home');
                onSelectCategory(null);
                setShowMobileMenu(false);
              }}
              className="p-2 text-left bg-slate-50 rounded-lg font-medium text-slate-800"
            >
              Home
            </button>
            <button
              onClick={() => {
                onSelectTab('hot-deals');
                setShowMobileMenu(false);
              }}
              className="p-2 text-left bg-slate-50 rounded-lg font-medium text-slate-800 flex items-center gap-1 text-orange-600"
            >
              <Flame className="w-3.5 h-3.5" /> Hot deals
            </button>
            <button
              onClick={() => {
                onSelectTab('promotions');
                setShowMobileMenu(false);
              }}
              className="p-2 text-left bg-slate-50 rounded-lg font-medium text-slate-800"
            >
              Promotions
            </button>
            <button
              onClick={() => {
                onSelectTab('new-products');
                setShowMobileMenu(false);
              }}
              className="p-2 text-left bg-slate-50 rounded-lg font-medium text-slate-800"
            >
              New Products
            </button>
            <button
              onClick={() => {
                onSelectTab('policy');
                setShowMobileMenu(false);
              }}
              className="p-2 text-left bg-emerald-50 rounded-lg font-bold text-emerald-800 flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Policies & Terms</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <div className="font-bold text-slate-900 text-sm mb-2">Categories</div>
            <div className="max-h-48 overflow-y-auto space-y-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    onSelectCategory(cat.slug);
                    setShowMobileMenu(false);
                  }}
                  className="w-full text-left px-2 py-1.5 text-xs text-slate-700 hover:bg-emerald-50 rounded"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <button onClick={onOpenTrackOrder} className="text-emerald-700 font-bold underline">
              Track My Order
            </button>
            <button onClick={onOpenAdmin} className="text-slate-600 font-semibold underline">
              Admin Portal
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
