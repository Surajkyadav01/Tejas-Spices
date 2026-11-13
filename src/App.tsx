/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Product, CartItem, Order, UserProfile, OrderStatus, PackVariant } from './types';
import { STORE_INFO, CATEGORIES, INITIAL_PRODUCTS, INITIAL_ORDERS } from './data/mockData';
import { Header } from './components/Header';
import { HeroBanners } from './components/HeroBanners';
import { CategoriesSlider } from './components/CategoriesSlider';
import { DailyBestSells } from './components/DailyBestSells';
import { RankedMiniLists } from './components/RankedMiniLists';
import { PromoBanner } from './components/PromoBanner';
import { CatalogSection } from './components/CatalogSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { TrackOrderModal } from './components/TrackOrderModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { AdminPage } from './components/AdminPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { WishlistModal } from './components/WishlistModal';
import { AuthModal } from './components/AuthModal';
import { QualityModal } from './components/QualityModal';
import { PRODUCT_REAL_IMAGES } from './components/ProductVisual';
import { ScrollReveal } from './components/ScrollReveal';
import { PolicyPage, PolicyTabType } from './components/PolicyPage';
import { AboutUsPage } from './components/AboutUsPage';
import { MobileStickyCartBar } from './components/MobileStickyCartBar';
import { getDefaultVariant, applyVariantToProduct, getCartKey } from './utils/variants';

export default function App() {
  // Persistent Products with photographic image hydration
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('tejas_products');
      if (saved) {
        const parsed = JSON.parse(saved) as Product[];
        return parsed.map((p) => {
          const defaultProd = INITIAL_PRODUCTS.find((ip) => ip.id === p.id);
          return {
            ...p,
            image: PRODUCT_REAL_IMAGES[p.id] || (p.image && p.image.startsWith('/') ? p.image.slice(1) : p.image) || defaultProd?.image,
          };
        });
      }
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Persistent Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('tejas_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persistent Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tejas_wishlist');
      return saved ? JSON.parse(saved) : ['prod-5', 'prod-11'];
    } catch {
      return ['prod-5', 'prod-11'];
    }
  });

  // Persistent Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('tejas_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // User Profile
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('tejas_user');
      return saved
        ? JSON.parse(saved)
        : {
            name: '',
            phone: '',
            email: '',
            isLoggedIn: false,
          };
    } catch {
      return { name: '', phone: '', email: '', isLoggedIn: false };
    }
  });

  // Navigation & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeNavTab, setActiveNavTab] = useState<string>('home');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'policy' | 'about' | 'product' | 'admin'>('home');
  const [policyTab, setPolicyTab] = useState<PolicyTabType>('shipping');

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState<string | undefined>(undefined);
  const [isOrderSuccessOpen, setIsOrderSuccessOpen] = useState(false);
  const [latestPlacedOrder, setLatestPlacedOrder] = useState<Order | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isQualityOpen, setIsQualityOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('tejas_products', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('tejas_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('tejas_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('tejas_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('tejas_user', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  // Scroll helper
  const scrollToCatalog = useCallback(() => {
    setTimeout(() => {
      const el = document.getElementById('catalog-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 60);
  }, []);

  // Push / update hash cleanly so phone Back button navigates instead of exiting site
  const pushHash = useCallback((nextHash: string) => {
    const normalized = nextHash.startsWith('#') ? nextHash : `#${nextHash}`;
    if (window.location.hash !== normalized) {
      window.location.hash = normalized;
    }
  }, []);

  // Sync React view state from window.location.hash (for mobile Back/Forward & deep links)
  const syncFromHash = useCallback(
    (hashStr: string) => {
      const clean = hashStr.replace(/^#\/?/, '').trim();
      if (!clean || clean === 'home') {
        setCurrentView('home');
        setActiveCategory(null);
        setActiveNavTab('home');
        return;
      }
      if (clean.startsWith('product/')) {
        const prodId = decodeURIComponent(clean.slice('product/'.length));
        const found = products.find((p) => p.id === prodId);
        if (found) {
          setSelectedProduct(found);
          setCurrentView('product');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        setCurrentView('home');
        return;
      }
      if (clean === 'about') {
        setCurrentView('about');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (clean === 'admin') {
        setCurrentView('admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (clean.startsWith('policy/')) {
        const tab = clean.slice('policy/'.length) as PolicyTabType;
        if (['shipping', 'privacy', 'terms', 'refund', 'faq'].includes(tab)) {
          setPolicyTab(tab);
        }
        setCurrentView('policy');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (clean.startsWith('category/')) {
        const slug = decodeURIComponent(clean.slice('category/'.length));
        setCurrentView('home');
        setActiveCategory(slug);
        setSearchQuery('');
        scrollToCatalog();
      }
    },
    [products, scrollToCatalog]
  );

  // Listen to browser Back / Forward / hashchange events
  useEffect(() => {
    if (window.location.hash) {
      syncFromHash(window.location.hash);
    }
    const handleHashChange = () => {
      syncFromHash(window.location.hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [syncFromHash]);

  // Variant-aware Cart operations
  const handleAddToCart = (product: Product, variant?: PackVariant) => {
    const chosenVariant = variant || getDefaultVariant(product);
    const productSnapshot = applyVariantToProduct(product, chosenVariant);
    const targetKey = `${product.id}__${chosenVariant.label}`;

    setCart((prev) => {
      const existing = prev.find((item) => getCartKey(item) === targetKey);
      if (existing) {
        return prev.map((item) =>
          getCartKey(item) === targetKey
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product: productSnapshot, quantity: 1, selectedVariant: chosenVariant }];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number, variantLabel?: string) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId, variantLabel);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        const label = item.selectedVariant?.label || item.product.unit;
        if (item.product.id === productId && (!variantLabel || label === variantLabel)) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const handleRemoveFromCart = (productId: string, variantLabel?: string) => {
    setCart((prev) =>
      prev.filter((item) => {
        const label = item.selectedVariant?.label || item.product.unit;
        if (item.product.id !== productId) return true;
        if (variantLabel && label !== variantLabel) return true;
        return false;
      })
    );
  };

  // 1-Tap Reorder from past orders
  const handleReorder = (order: Order) => {
    setCart((prev) => {
      const next = [...prev];
      order.items.forEach((ordItem) => {
        const latestProd = products.find((p) => p.id === ordItem.product.id) || ordItem.product;
        const chosenVariant = ordItem.selectedVariant || getDefaultVariant(latestProd);
        const snapshot = applyVariantToProduct(latestProd, chosenVariant);
        const key = `${latestProd.id}__${chosenVariant.label}`;
        const existingIdx = next.findIndex((i) => getCartKey(i) === key);
        if (existingIdx >= 0) {
          next[existingIdx] = {
            ...next[existingIdx],
            quantity: next[existingIdx].quantity + ordItem.quantity,
          };
        } else {
          next.push({
            product: snapshot,
            quantity: ordItem.quantity,
            selectedVariant: chosenVariant,
          });
        }
      });
      return next;
    });
    setIsAuthOpen(false);
    setIsTrackOrderOpen(false);
    setIsCartOpen(true);
  };

  // Wishlist operations
  const handleToggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // Order Placement
  const handleOrderSuccess = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setIsCheckoutOpen(false);
    setLatestPlacedOrder(newOrder);
    setTrackingOrderId(newOrder.orderId);
    // Open the Order Placed Successfully popup first
    setIsOrderSuccessOpen(true);
  };

  const handleSuccessBackToHome = () => {
    setIsOrderSuccessOpen(false);
    setCurrentView('home');
    setActiveNavTab('home');
    setActiveCategory(null);
    setSearchQuery('');
    pushHash('#/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSuccessTrackOrder = () => {
    setIsOrderSuccessOpen(false);
    if (latestPlacedOrder) {
      setTrackingOrderId(latestPlacedOrder.orderId);
    }
    setIsTrackOrderOpen(true);
  };

  // Admin handlers
  const handleOpenAdmin = () => {
    setCurrentView('admin');
    pushHash('#/admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.orderId === orderId
          ? { ...ord, status, statusTimestamp: 'Updated by Store Admin' }
          : ord
      )
    );
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((ord) => ord.orderId !== orderId));
  };

  const handleUpdateProductStock = (productId: string, stock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stockQuantity: stock, inStock: stock > 0 } : p))
    );
  };

  const handleToggleProductStock = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, inStock: !p.inStock } : p
      )
    );
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleUpdateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...updates } : p))
    );
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleAddProductReview = (productId: string, newRating: number, updatedReviewsCount: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, rating: newRating, reviewsCount: updatedReviewsCount }
          : p
      )
    );
    setSelectedProduct((prev) =>
      prev && prev.id === productId
        ? { ...prev, rating: newRating, reviewsCount: updatedReviewsCount }
        : prev
    );
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product');
    pushHash(`#/product/${encodeURIComponent(product.id)}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filtered products for current nav tab
  let displayProducts = products;
  if (activeNavTab === 'hot-deals') {
    displayProducts = products.filter((p) => p.discountPercent >= 18);
  } else if (activeNavTab === 'promotions') {
    displayProducts = products.filter((p) => p.badge && p.badge.length > 0);
  } else if (activeNavTab === 'new-products') {
    displayProducts = products.filter((p) => p.isNew || p.id === 'prod-15' || p.id === 'prod-19');
  }

  const navigateHome = () => {
    setCurrentView('home');
    setActiveNavTab('home');
    setActiveCategory(null);
    pushHash('#/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const anyModalOpen =
    isCartOpen ||
    isCheckoutOpen ||
    isOrderSuccessOpen ||
    isAuthOpen ||
    isTrackOrderOpen ||
    isWishlistOpen ||
    isQualityOpen;

  return (
    <div
      className={`min-h-screen bg-white text-slate-900 flex flex-col font-sans ${
        cart.length > 0 && currentView !== 'product' && currentView !== 'admin' ? 'pb-20 md:pb-0' : ''
      }`}
    >
      {/* 1. Header with Top Alert Bar & Sub-Nav */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (q.trim()) {
            setActiveCategory(null);
            setCurrentView('home');
          }
        }}
        cartCount={cart.reduce((c, i) => c + i.quantity, 0)}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenTrackOrder={() => {
          setTrackingOrderId(orders[0]?.orderId);
          setIsTrackOrderOpen(true);
        }}
        onOpenAdmin={handleOpenAdmin}
        onSelectCategory={(slug) => {
          setActiveCategory(slug);
          setSearchQuery('');
          setCurrentView('home');
          if (slug) {
            pushHash(`#/category/${encodeURIComponent(slug)}`);
            scrollToCatalog();
          } else {
            pushHash('#/');
          }
        }}
        activeCategory={activeCategory}
        activeTab={currentView === 'policy' ? 'policy' : activeNavTab}
        onSelectTab={(tab) => {
          if (tab === 'policy') {
            setCurrentView('policy');
            pushHash(`#/policy/${policyTab}`);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else if (tab === 'shipping-policy') {
            setPolicyTab('shipping');
            setCurrentView('policy');
            pushHash('#/policy/shipping');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else if (tab === 'privacy-policy') {
            setPolicyTab('privacy');
            setCurrentView('policy');
            pushHash('#/policy/privacy');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else if (tab === 'terms-policy') {
            setPolicyTab('terms');
            setCurrentView('policy');
            pushHash('#/policy/terms');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else if (tab === 'refund-policy') {
            setPolicyTab('refund');
            setCurrentView('policy');
            pushHash('#/policy/refund');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else if (tab === 'faq') {
            setPolicyTab('faq');
            setCurrentView('policy');
            pushHash('#/policy/faq');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else if (tab === 'about-us') {
            setCurrentView('about');
            pushHash('#/about');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            setCurrentView('home');
            setActiveNavTab(tab);
            setActiveCategory(null);
            setSearchQuery('');
            pushHash('#/');
            if (tab !== 'home') scrollToCatalog();
          }
        }}
        allProducts={products}
        onSelectProduct={handleSelectProduct}
      />

      {/* Main Body: Full Page Switching (No popup for product/policy/about pages) */}
      <main className="flex-1 w-full">
        {currentView === 'product' && selectedProduct ? (
          <ProductDetailPage
            product={selectedProduct}
            allProducts={products}
            cart={cart}
            wishlist={wishlist}
            user={user}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            onToggleWishlist={handleToggleWishlist}
            onBackToStore={navigateHome}
            onSelectProduct={handleSelectProduct}
            onAddReview={handleAddProductReview}
            onOrderSuccess={handleOrderSuccess}
          />
        ) : currentView === 'admin' ? (
          <AdminPage
            products={products}
            orders={orders}
            onBackToStore={navigateHome}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onDeleteOrder={handleDeleteOrder}
            onUpdateProductStock={handleUpdateProductStock}
            onToggleProductStock={handleToggleProductStock}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        ) : currentView === 'policy' ? (
          <PolicyPage
            initialTab={policyTab}
            onBackToHome={navigateHome}
          />
        ) : currentView === 'about' ? (
          <AboutUsPage
            onBackToHome={navigateHome}
            onExploreCatalog={() => {
              navigateHome();
              scrollToCatalog();
            }}
          />
        ) : (
          <>
            {/* Active tab notice banner if not home */}
            {activeNavTab !== 'home' && (
              <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 pt-5 pb-2">
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-wider font-bold text-emerald-800">
                      Viewing Collection:
                    </span>
                    <h1 className="text-lg font-extrabold text-slate-900 capitalize">
                      {activeNavTab.replace('-', ' ')}
                    </h1>
                  </div>
                  <button
                    onClick={() => setActiveNavTab('home')}
                    className="text-xs font-bold text-emerald-700 bg-white border border-emerald-200 px-3 py-1.5 rounded-xl hover:bg-emerald-100 transition-colors cursor-pointer"
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            )}

            {/* 2. Hero & Dual Promo Banners (shown on home) */}
            {activeNavTab === 'home' && !activeCategory && !searchQuery && (
              <HeroBanners
                onShopNow={scrollToCatalog}
                onOpenQualityModal={() => setIsQualityOpen(true)}
                onApplyPromoCode={(code) => setAppliedCoupon(code)}
              />
            )}

            {/* 3. Explore Categories Slider with live counts */}
            <CategoriesSlider
              products={products}
              activeCategory={activeCategory}
              onSelectCategory={(slug) => {
                setActiveCategory(slug);
                setSearchQuery('');
                if (slug) {
                  pushHash(`#/category/${encodeURIComponent(slug)}`);
                  scrollToCatalog();
                } else {
                  pushHash('#/');
                }
              }}
            />

            {/* 4. Daily Best Sells (with live countdown & member signup) matching Screenshot 3 & 5 */}
            {activeNavTab === 'home' && !activeCategory && !searchQuery && (
              <ScrollReveal animation="fade-up" duration={550} rootMargin="70px 0px">
                <DailyBestSells
                  products={products}
                  cart={cart}
                  wishlist={wishlist}
                  onAddToCart={handleAddToCart}
                  onUpdateQuantity={handleUpdateQuantity}
                  onToggleWishlist={handleToggleWishlist}
                  onSelectProduct={handleSelectProduct}
                  onApplyCoupon={(code) => setAppliedCoupon(code)}
                />
              </ScrollReveal>
            )}

            {/* 5. 4-Column Ranked Mini Lists matching Screenshot 4 */}
            {activeNavTab === 'home' && !activeCategory && !searchQuery && (
              <ScrollReveal animation="fade-up" duration={550} rootMargin="70px 0px">
                <RankedMiniLists
                  products={products}
                  cart={cart}
                  onAddToCart={handleAddToCart}
                  onSelectProduct={handleSelectProduct}
                />
              </ScrollReveal>
            )}

            {/* 6. Promotional Store / App Mockup Banner matching Screenshot 6 */}
            {activeNavTab === 'home' && !activeCategory && !searchQuery && (
              <ScrollReveal animation="fade-up" duration={550} rootMargin="70px 0px">
                <PromoBanner onExploreCatalog={scrollToCatalog} />
              </ScrollReveal>
            )}

            {/* 7. Full Product Catalog Grid with real-time category filtering & sorting */}
            <CatalogSection
              products={displayProducts}
              activeCategory={activeCategory}
              searchQuery={searchQuery}
              cart={cart}
              wishlist={wishlist}
              onAddToCart={handleAddToCart}
              onUpdateQuantity={handleUpdateQuantity}
              onToggleWishlist={handleToggleWishlist}
              onSelectProduct={handleSelectProduct}
              onClearCategory={() => setActiveCategory(null)}
              onClearSearch={() => setSearchQuery('')}
            />
          </>
        )}
      </main>

      {/* 8. Trust Badges & 4-Column Footer with Direct Policy Links */}
      <ScrollReveal animation="fade-in" duration={600} rootMargin="60px 0px">
        <Footer
          onOpenWishlist={() => setIsWishlistOpen(true)}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenTrackOrder={() => {
            setTrackingOrderId(orders[0]?.orderId);
            setIsTrackOrderOpen(true);
          }}
          onOpenAuth={() => setIsAuthOpen(true)}
          onSelectCategory={(slug) => {
            setCurrentView('home');
            setActiveCategory(slug);
            if (slug) {
              pushHash(`#/category/${encodeURIComponent(slug)}`);
              scrollToCatalog();
            } else {
              pushHash('#/');
            }
          }}
          onSelectTab={(tab) => {
            if (tab === 'shipping-policy') {
              setPolicyTab('shipping');
              setCurrentView('policy');
              pushHash('#/policy/shipping');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (tab === 'privacy-policy') {
              setPolicyTab('privacy');
              setCurrentView('policy');
              pushHash('#/policy/privacy');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (tab === 'terms-policy') {
              setPolicyTab('terms');
              setCurrentView('policy');
              pushHash('#/policy/terms');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (tab === 'refund-policy') {
              setPolicyTab('refund');
              setCurrentView('policy');
              pushHash('#/policy/refund');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (tab === 'faq') {
              setPolicyTab('faq');
              setCurrentView('policy');
              pushHash('#/policy/faq');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (tab === 'about-us') {
              setCurrentView('about');
              pushHash('#/about');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              setCurrentView('home');
              setActiveNavTab(tab);
              pushHash('#/');
              scrollToCatalog();
            }
          }}
          onOpenAdmin={handleOpenAdmin}
          onOpenPolicy={(tab) => {
            setPolicyTab(tab);
            setCurrentView('policy');
            pushHash(`#/policy/${tab}`);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenAboutUs={() => {
            setCurrentView('about');
            pushHash('#/about');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </ScrollReveal>

      {/* Mobile Sticky Bottom Floating Cart Bar */}
      <MobileStickyCartBar
        cart={cart}
        appliedCoupon={appliedCoupon}
        onOpenCart={() => setIsCartOpen(true)}
        hidden={anyModalOpen || currentView === 'product' || currentView === 'admin'}
      />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={(code) => setAppliedCoupon(code)}
        onRemoveCoupon={() => setAppliedCoupon(null)}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        appliedCoupon={appliedCoupon}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Live Order Tracking Modal */}
      <TrackOrderModal
        isOpen={isTrackOrderOpen}
        onClose={() => setIsTrackOrderOpen(false)}
        orders={orders}
        currentOrderId={trackingOrderId}
        onReorder={handleReorder}
      />

      {/* Order Placed Successfully Celebration Modal */}
      <OrderSuccessModal
        isOpen={isOrderSuccessOpen}
        order={latestPlacedOrder}
        onClose={() => setIsOrderSuccessOpen(false)}
        onBackToHome={handleSuccessBackToHome}
        onTrackOrder={handleSuccessTrackOrder}
      />

      {/* Saved Wishlist Modal */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistIds={wishlist}
        allProducts={products}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onSelectProduct={handleSelectProduct}
      />

      {/* User Login & Account Profile Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        user={user}
        orders={orders}
        onUpdateUser={setUser}
        onOpenTrackOrder={() => {
          setIsAuthOpen(false);
          setTrackingOrderId(orders[0]?.orderId);
          setIsTrackOrderOpen(true);
        }}
        onReorder={handleReorder}
      />

      {/* 100% Quality & Purity Modal */}
      <QualityModal
        isOpen={isQualityOpen}
        onClose={() => setIsQualityOpen(false)}
      />
    </div>
  );
}
