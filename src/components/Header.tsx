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
  ChevronRight,
  Package
} from 'lucide-react';
import { STORE_INFO, CATEGORIES } from '../data/mockData';
import { Product } from '../types';
import tejasLogo from '../assets/logo.png';

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
      <div className="w-full px-3.5 sm:px-8 lg:px-12 xl:px-16 py-3 sm:py-3.5">
        <div className="flex items-center justify-between gap-2 sm:gap-4 md:gap-8">
          {/* Brand Logo matching reference */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
            <button
              onClick={() => {
                onSelectCategory(null);
                onSelectTab('home');
              }}
              className="flex items-center gap-2 sm:gap-2.5 text-left group cursor-pointer"
            >
              <img
                src={tejasLogo}
                alt="Tejas Spices Official Logo"
                className="h-9 sm:h-11 md:h-12 w-auto object-contain drop-shadow-xs transition-transform group-hover:scale-105"
              />
              <div>
                <div className="text-base sm:text-xl font-black tracking-tight leading-tight flex items-center gap-1">
                  <span className="text-slate-900">Tejas</span>
                  <span className="text-red-600">Spices</span>
                </div>
                <div className="hidden xs:block sm:block text-[10px] sm:text-[11px] font-bold text-emerald-600 tracking-wider uppercase leading-none mt-0.5 truncate">
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
          <div className="flex items-center gap-1 sm:gap-3 lg:gap-6 shrink-0">
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
              className="relative p-1.5 sm:p-2 text-slate-700 hover:text-emerald-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer shrink-0"
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
              className="relative p-1.5 sm:p-2 text-slate-700 hover:text-emerald-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer shrink-0"
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

            {/* User Login - Visible on all devices (Icon on mobile, Pill with label on desktop) */}
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-full text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 text-sm font-semibold transition-colors cursor-pointer border border-transparent hover:border-emerald-200 shrink-0"
              title="Login / My Account"
              aria-label="Login"
            >
              <User className="w-5 h-5 sm:w-4 sm:h-4 text-emerald-600" />
              <span className="hidden sm:inline">Login</span>
            </button>

            {/* Mobile Menu Button - 3-line hamburger icon only, no extra text, perfectly sized */}
            <button
              onClick={() => setShowMobileMenu(true)}
              className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white shadow-2xs transition-all cursor-pointer shrink-0 ml-0.5"
              title="Menu"
              aria-label="Open mobile menu"
            >
              <Menu className="w-4.5 h-4.5" />
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

      {/* Mobile Slide-Over Drawer Sheet (Visible exclusively on mobile screens, completely hidden on laptop/desktop) */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            onClick={() => setShowMobileMenu(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 right-0 w-full max-w-xs sm:max-w-sm bg-white shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <img
                  src={tejasLogo}
                  alt="Tejas Spices"
                  className="h-8 sm:h-9 w-auto object-contain"
                />
                <div>
                  <div className="text-base font-black tracking-tight leading-tight flex items-center gap-1">
                    <span className="text-slate-900">Tejas</span>
                    <span className="text-red-600">Spices</span>
                  </div>
                  <div className="text-[10px] font-semibold text-emerald-600 uppercase">
                    Mobile Menu
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowMobileMenu(false)}
                className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* 1. Account / Login Section */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-900">
                      Customer Profile & Login
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      Sign in with Email & Password
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    onOpenAuth();
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-3 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Login / Registration (लॉगिन करें)</span>
                </button>
              </div>

              {/* 2. Key Featured Navigation (Hot Deals, Promotions, New Products, Home) */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider px-1">
                  Featured Sections
                </div>

                <button
                  onClick={() => {
                    onSelectTab('home');
                    onSelectCategory(null);
                    setShowMobileMenu(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors cursor-pointer ${
                    activeTab === 'home' && activeCategory === null
                      ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                      : 'hover:bg-slate-50 text-slate-800 font-semibold border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <Home className="w-4 h-4" />
                    </div>
                    <span className="text-xs">Home (मुख्य पेज)</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => {
                    onSelectTab('hot-deals');
                    setShowMobileMenu(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors cursor-pointer ${
                    activeTab === 'hot-deals'
                      ? 'bg-orange-50 text-orange-900 font-bold border border-orange-200'
                      : 'hover:bg-slate-50 text-slate-800 font-semibold border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                      <Flame className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Hot Deals (हॉट डील्स)</div>
                      <div className="text-[10px] text-orange-600 font-medium">Daily Best Sells & Discounts</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-orange-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Live
                  </span>
                </button>

                <button
                  onClick={() => {
                    onSelectTab('promotions');
                    setShowMobileMenu(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors cursor-pointer ${
                    activeTab === 'promotions'
                      ? 'bg-blue-50 text-blue-900 font-bold border border-blue-200'
                      : 'hover:bg-slate-50 text-slate-800 font-semibold border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                      <Tag className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Promotions (प्रमोशन / ऑफर्स)</div>
                      <div className="text-[10px] text-blue-600 font-medium">Save up to 25% Off</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-blue-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Offer
                  </span>
                </button>

                <button
                  onClick={() => {
                    onSelectTab('new-products');
                    setShowMobileMenu(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors cursor-pointer ${
                    activeTab === 'new-products'
                      ? 'bg-amber-50 text-amber-900 font-bold border border-amber-200'
                      : 'hover:bg-slate-50 text-slate-800 font-semibold border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">New Products (नए प्रोडक्ट्स)</div>
                      <div className="text-[10px] text-amber-600 font-medium">Fresh Harvest & Milling</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                    New
                  </span>
                </button>
              </div>

              {/* 3. Quick Actions: Track Order, Cart, Wishlist */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider px-1">
                  Quick Actions
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setShowMobileMenu(false);
                      onOpenCart();
                    }}
                    className="p-3 bg-slate-50 hover:bg-emerald-50 rounded-xl text-left border border-slate-200/80 transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-slate-800">Cart</span>
                    </div>
                    <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {cartCount}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setShowMobileMenu(false);
                      onOpenWishlist();
                    }}
                    className="p-3 bg-slate-50 hover:bg-emerald-50 rounded-xl text-left border border-slate-200/80 transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-rose-500" />
                      <span className="text-xs font-bold text-slate-800">Wishlist</span>
                    </div>
                    <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {wishlistCount}
                    </span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    onOpenTrackOrder();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Package className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="text-xs font-bold text-slate-900">Track My Order</div>
                      <div className="text-[10px] text-slate-500">Live doorstep delivery status</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {/* 4. Product Categories */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider px-1">
                  Product Categories ({CATEGORIES.length})
                </div>

                <div className="max-h-48 overflow-y-auto space-y-1 divide-y divide-slate-100 border border-slate-200 rounded-xl p-1 bg-slate-50/50">
                  <button
                    onClick={() => {
                      onSelectCategory(null);
                      setShowMobileMenu(false);
                    }}
                    className={`w-full text-left p-2 text-xs flex items-center justify-between rounded-lg cursor-pointer ${
                      activeCategory === null
                        ? 'bg-emerald-100 text-emerald-800 font-bold'
                        : 'text-slate-700 hover:bg-emerald-50'
                    }`}
                  >
                    <span>All Spices & Kirana</span>
                    <span className="text-[10px] bg-slate-200/80 px-2 py-0.5 rounded-full text-slate-600 font-semibold">
                      {allProducts.length}
                    </span>
                  </button>

                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        onSelectCategory(cat.slug);
                        setShowMobileMenu(false);
                      }}
                      className={`w-full text-left p-2 text-xs flex items-center justify-between rounded-lg cursor-pointer ${
                        activeCategory === cat.slug
                          ? 'bg-emerald-100 text-emerald-800 font-bold'
                          : 'text-slate-700 hover:bg-emerald-50'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {cat.itemCount} items
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Helpline Call & WhatsApp info */}
              <div className="pt-2 border-t border-slate-100 p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200/80 space-y-1.5 text-xs">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Call & WhatsApp Ordering</span>
                </div>
                <a
                  href={`tel:${STORE_INFO.phone1}`}
                  className="font-extrabold text-emerald-800 block text-sm hover:underline"
                >
                  {STORE_INFO.phone1}
                </a>
                <div className="text-[10px] text-slate-500">
                  Suriyawan, Bhadohi · 8:00 AM – 9:00 PM
                </div>
              </div>

              {/* Admin Portal link */}
              <div className="text-center pt-1">
                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    onOpenAdmin();
                  }}
                  className="text-[11px] text-slate-400 hover:text-slate-600 underline cursor-pointer"
                >
                  Store Admin Portal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
