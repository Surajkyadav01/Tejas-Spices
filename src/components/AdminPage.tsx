import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Search,
  MessageCircle,
  Trash2,
  Upload,
  AlertTriangle,
  ShieldCheck,
  Package,
  ShoppingBag,
  PlusCircle,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Phone,
  AlertCircle,
} from 'lucide-react';
import { Product, Order, OrderStatus } from '../types';
import { CATEGORIES } from '../data/mockData';
import { ProductVisual } from './ProductVisual';
import { buildCustomerStatusWhatsAppUrl } from '../utils/whatsapp';
import { getAssetUrl } from '../utils/assetUrl';
import { useLanguage } from '../utils/i18n';

interface AdminPageProps {
  products: Product[];
  orders: Order[];
  onBackToStore: () => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onDeleteOrder: (orderId: string) => void;
  onUpdateProductStock: (productId: string, stock: number) => void;
  onToggleProductStock: (productId: string) => void;
  onAddProduct: (newProduct: Product) => void;
  onUpdateProduct?: (productId: string, updates: Partial<Product>) => void;
  onDeleteProduct?: (productId: string) => void;
}

const ADMIN_PASSCODE = '0000';

const AdminPortalLogo: React.FC<{ size?: 'md' | 'lg'; locked?: boolean }> = ({
  size = 'md',
  locked = false,
}) => {
  const boxSize = size === 'lg' ? 'w-16 h-16 rounded-2xl' : 'w-11 h-11 sm:w-12 sm:h-12 rounded-xl';
  const svgSize = size === 'lg' ? 'w-10 h-10' : 'w-7 h-7 sm:w-8 sm:h-8';

  return (
    <div
      className={`relative ${boxSize} bg-gradient-to-br from-emerald-500/25 via-slate-800 to-slate-950 border border-emerald-400/40 shadow-lg shadow-emerald-950/40 flex items-center justify-center shrink-0`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={svgSize}
      >
        {/* Faceted Security Shield */}
        <path
          d="M24 4L8 10.5V22.2C8 32.5 14.8 41.3 24 44.5C33.2 41.3 40 32.5 40 22.2V10.5L24 4Z"
          fill="#064E3B"
          stroke="#34D399"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        <path
          d="M24 7.8L11.5 12.9V22.2C11.5 30.3 16.7 37.3 24 40.2V7.8Z"
          fill="#10B981"
          fillOpacity="0.22"
        />
        {/* Golden Admin Crown */}
        <path
          d="M17.5 19.5L19.5 14.5L24 17.5L28.5 14.5L30.5 19.5H17.5Z"
          fill="#FBBF24"
          stroke="#FEF3C7"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        {/* Admin Silhouette */}
        <circle cx="24" cy="24.2" r="3.4" fill="#FFFFFF" />
        <path
          d="M16.8 34C17.6 30.6 20.4 28.8 24 28.8C27.6 28.8 30.4 30.6 31.2 34"
          stroke="#FFFFFF"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
      </svg>

      {locked && (
        <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-amber-400 text-slate-950 border-2 border-slate-900 flex items-center justify-center shadow-sm">
          <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
        </span>
      )}
    </div>
  );
};

const PACKET_PRESETS = [
  { label: 'Garam Masala', path: 'assets/products/garam_masala.jpg' },
  { label: 'Mirch Powder', path: 'assets/products/kashmiri_mirch.jpg' },
  { label: 'Haldi Powder', path: 'assets/products/haldi_turmeric.jpg' },
  { label: 'Dhania Powder', path: 'assets/products/dhania_powder.jpg' },
  { label: 'Basmati Rice', path: 'assets/products/basmati_rice.jpg' },
  { label: 'Toor Dal', path: 'assets/products/toor_dal.jpg' },
  { label: 'Agarbatti', path: 'assets/products/agarbatti.jpg' },
  { label: 'Dry Fruits', path: 'assets/products/badam.jpg' },
  { label: 'Mustard Oil', path: 'assets/products/mustard_oil.jpg' },
  { label: 'Tea / Chai', path: 'assets/products/assam_tea.jpg' },
];

export const AdminPage: React.FC<AdminPageProps> = ({
  products,
  orders,
  onBackToStore,
  onUpdateOrderStatus,
  onDeleteOrder,
  onUpdateProductStock,
  onToggleProductStock,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
}) => {
  const { t } = useLanguage();

  // Security PIN Gate state
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [pinError, setPinError] = useState('');

  // Active section tab
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'add'>('orders');

  // Orders filter, search & delete confirmation
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | OrderStatus>('all');
  const [confirmDeleteOrderId, setConfirmDeleteOrderId] = useState<string | null>(null);

  // Inventory search & delete confirmation
  const [inventorySearch, setInventorySearch] = useState('');
  const [confirmDeleteProdId, setConfirmDeleteProdId] = useState<string | null>(null);

  // Add Product form states
  const [newName, setNewName] = useState('');
  const [newHindiName, setNewHindiName] = useState('');
  const [newCategory, setNewCategory] = useState(CATEGORIES[0].slug);
  const [newPrice, setNewPrice] = useState(85);
  const [newOriginalPrice, setNewOriginalPrice] = useState(110);
  const [newUnit, setNewUnit] = useState('250g Pack');
  const [newStock, setNewStock] = useState(40);
  const [newImage, setNewImage] = useState(PACKET_PRESETS[0].path);
  const [newDesc, setNewDesc] = useState('');
  const [newAddedSuccess, setNewAddedSuccess] = useState(false);

  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      if (orderStatusFilter !== 'all' && ord.status !== orderStatusFilter) return false;
      if (orderSearch.trim()) {
        const q = orderSearch.toLowerCase();
        return (
          ord.orderId.toLowerCase().includes(q) ||
          ord.customer.fullName.toLowerCase().includes(q) ||
          ord.customer.phone.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [orders, orderSearch, orderStatusFilter]);

  const filteredProducts = useMemo(() => {
    if (!inventorySearch.trim()) return products;
    const q = inventorySearch.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.hindiName && p.hindiName.includes(q))
    );
  }, [products, inventorySearch]);

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrdersCount = orders.filter((o) => o.status !== 'delivered').length;
  const lowStockCount = products.filter((p) => !p.inStock || p.stockQuantity <= 10).length;

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');
    if (pinInput.trim() === ADMIN_PASSCODE) {
      setIsUnlocked(true);
      setPinInput('');
    } else {
      setPinError(
        t(
          'Incorrect admin password. Please try again.',
          'गलत एडमिन पासवर्ड! कृपया सही 4-अंकों का पासवर्ड दर्ज करें।'
        )
      );
    }
  };

  const handleLockPortal = () => {
    setIsUnlocked(false);
    setPinInput('');
    setPinError('');
  };

  // Compress local uploaded photo via canvas so it stays lightweight inside localStorage
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxSide = 480;
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          setNewImage(canvas.toDataURL('image/jpeg', 0.8));
        } else if (typeof reader.result === 'string') {
          setNewImage(reader.result);
        }
      };
      if (typeof reader.result === 'string') {
        img.src = reader.result;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const mrp = Math.max(Number(newPrice), Number(newOriginalPrice));
    const discount = mrp > 0 ? Math.round(((mrp - Number(newPrice)) / mrp) * 100) : 0;
    const categoryObj = CATEGORIES.find((c) => c.slug === newCategory);

    const product: Product = {
      id: `prod-${Date.now()}`,
      name: newName.trim(),
      hindiName: newHindiName.trim() || undefined,
      category: categoryObj ? categoryObj.name : 'Spices & Masala',
      categorySlug: newCategory,
      price: Number(newPrice),
      originalPrice: mrp,
      discountPercent: discount > 0 ? discount : 0,
      unit: newUnit.trim() || '250g Pack',
      image: newImage || 'assets/products/garam_masala.jpg',
      rating: 4.9,
      reviewsCount: 1,
      inStock: Number(newStock) > 0,
      stockQuantity: Number(newStock) || 40,
      soldCount: 0,
      totalCount: Number(newStock) || 40,
      badge: 'New Arrival',
      badgeColor: 'emerald',
      description: newDesc.trim() || `${newName.trim()} fresh batch from Tejas Spices store.`,
      origin: 'Suriyawan, Uttar Pradesh',
      visualType: 'pesa',
      isNew: true,
      isFeatured: true,
    };

    onAddProduct(product);
    setNewAddedSuccess(true);
    setTimeout(() => {
      setNewName('');
      setNewHindiName('');
      setNewDesc('');
      setNewAddedSuccess(false);
      setActiveTab('inventory');
    }, 900);
  };

  const statusChips: { key: 'all' | OrderStatus; label: string }[] = [
    { key: 'all', label: t('All', 'सभी') },
    { key: 'placed', label: t('Placed', 'नया ऑर्डर') },
    { key: 'packed', label: t('Packed', 'पैक्ड') },
    { key: 'dispatched', label: t('Dispatched', 'रवाना') },
    { key: 'out_for_delivery', label: t('Out for Delivery', 'रास्ते में') },
    { key: 'delivered', label: t('Delivered', 'डिलीवर्ड') },
  ];

  // ========================== VIEW 1: PASSWORD LOCK SCREEN ==========================
  if (!isUnlocked) {
    return (
      <div className="w-full min-h-[75vh] bg-slate-50 py-8 sm:py-14 px-4 flex flex-col items-center justify-center">
        <div className="w-full max-w-md space-y-4">
          <button
            type="button"
            onClick={onBackToStore}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-emerald-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('Back to Store', 'स्टोर पर वापस जाएं')}</span>
          </button>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
            {/* Dark Security Banner */}
            <div className="bg-slate-900 text-white p-6 text-center space-y-2.5">
              <div className="flex justify-center">
                <AdminPortalLogo size="lg" locked />
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[10px] font-black tracking-widest uppercase">
                <ShieldCheck className="w-3 h-3" />
                <span>{t('Admin Access', 'एडमिन एक्सेस')}</span>
              </div>
              <h1 className="text-xl font-black tracking-tight">
                {t('Store Admin Portal', 'स्टोर एडमिन पोर्टल')}
              </h1>
              <p className="text-xs text-slate-400">
                {t(
                  'Protected area · Enter admin password to continue',
                  'सुरक्षित क्षेत्र · आगे बढ़ने के लिए एडमिन पासवर्ड दर्ज करें'
                )}
              </p>
            </div>

            {/* Password Form */}
            <form onSubmit={handleUnlockSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {t('Admin Password (PIN)', 'एडमिन पासवर्ड (4 अंक)')}
                </label>
                <div className="relative">
                  <input
                    type={showPin ? 'text' : 'password'}
                    inputMode="numeric"
                    maxLength={8}
                    autoFocus
                    required
                    value={pinInput}
                    onChange={(e) => {
                      setPinInput(e.target.value);
                      if (pinError) setPinError('');
                    }}
                    placeholder="••••"
                    className="w-full px-4 py-3 pr-11 text-center text-xl tracking-[0.4em] font-mono font-black rounded-2xl border-2 border-slate-200 focus:outline-hidden focus:border-emerald-600 bg-slate-50 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer p-1"
                    aria-label={showPin ? 'Hide password' : 'Show password'}
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {pinError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{pinError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-sm py-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Unlock className="w-4 h-4" />
                <span>{t('Unlock Admin Portal', 'एडमिन पोर्टल खोलें')}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ========================== VIEW 2: FULL-PAGE ADMIN PORTAL ==========================
  return (
    <div className="w-full min-h-screen bg-slate-50/70 pb-16">
      {/* Top Full-Page Header Bar */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            <AdminPortalLogo size="md" />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-black tracking-tight truncate">
                  {t('Tejas Spices · Admin Portal', 'तेजस स्पाइसेस · एडमिन पोर्टल')}
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[10px] font-black tracking-widest uppercase shrink-0">
                  <ShieldCheck className="w-3 h-3" />
                  <span>ADMIN</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 truncate">
                {t(
                  'Store Control · Orders, Stock & Catalog Management',
                  'स्टोर कंट्रोल · ऑर्डर हिस्ट्री, स्टॉक और नया प्रोडक्ट मैनेजमेंट'
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={handleLockPortal}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{t('Lock', 'लॉक करें')}</span>
            </button>

            <button
              type="button"
              onClick={onBackToStore}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('Back to Store', 'स्टोर पर वापस')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 space-y-6">
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs">
            <span className="text-xs text-slate-500 font-semibold block">
              {t('Total Orders', 'कुल ऑर्डर')}
            </span>
            <span className="text-2xl font-black text-slate-900 font-mono mt-1 block">
              {orders.length}
            </span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs">
            <span className="text-xs text-slate-500 font-semibold block">
              {t('Pending Dispatch', 'बाकी ऑर्डर')}
            </span>
            <span className="text-2xl font-black text-amber-600 font-mono mt-1 block">
              {pendingOrdersCount}
            </span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs">
            <span className="text-xs text-slate-500 font-semibold block">
              {t('Store Revenue', 'कुल बिक्री')}
            </span>
            <span className="text-2xl font-black text-emerald-700 font-mono mt-1 block">
              ₹{totalRevenue}
            </span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs">
            <span className="text-xs text-slate-500 font-semibold block">
              {t('Low Stock Alerts', 'कम स्टॉक अलर्ट')}
            </span>
            <span
              className={`text-2xl font-black font-mono mt-1 flex items-center gap-1.5 ${
                lowStockCount > 0 ? 'text-rose-600' : 'text-emerald-700'
              }`}
            >
              {lowStockCount > 0 && <AlertTriangle className="w-5 h-5" />}
              <span>
                {lowStockCount} {t('Items', 'आइटम')}
              </span>
            </span>
          </div>
        </div>

        {/* Section Tabs Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="flex border-b border-slate-200 bg-white px-4 sm:px-6 pt-3 gap-4 sm:gap-7 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`pb-3.5 text-xs sm:text-sm font-bold transition-colors border-b-2 cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 ${
                activeTab === 'orders'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{t(`Customer Orders (${orders.length})`, `ऑर्डर हिस्ट्री (${orders.length})`)}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('inventory')}
              className={`pb-3.5 text-xs sm:text-sm font-bold transition-colors border-b-2 cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 ${
                activeTab === 'inventory'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>{t(`Inventory & Prices (${products.length})`, `स्टॉक / कीमत (${products.length})`)}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('add')}
              className={`pb-3.5 text-xs sm:text-sm font-bold transition-colors border-b-2 cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 ${
                activeTab === 'add'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t('+ Add New Product', '+ नया प्रोडक्ट जोड़ें')}</span>
            </button>
          </div>

          <div className="p-4 sm:p-6 bg-slate-50/40">
            {/* ================= TAB 1: CUSTOMER ORDERS ================= */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {/* Search & Status Filter Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      placeholder={t(
                        'Search by Order ID, Customer Name or Mobile...',
                        'ऑर्डर आईडी, ग्राहक का नाम या फ़ोन नंबर खोजें...'
                      )}
                      className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:border-emerald-600"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
                    {statusChips.map((chip) => (
                      <button
                        key={chip.key}
                        type="button"
                        onClick={() => setOrderStatusFilter(chip.key)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer transition-colors border ${
                          orderStatusFilter === chip.key
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredOrders.length === 0 ? (
                  <div className="text-center py-12 text-sm text-slate-500 bg-white rounded-2xl border border-slate-200">
                    {t('No matching orders found.', 'कोई मिलता-जुलता ऑर्डर नहीं मिला।')}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredOrders.map((ord) => (
                      <div
                        key={ord.orderId}
                        className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-2xs flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          {/* Top Row: ID, Customer & Status Dropdown */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-100 pb-3">
                            <div className="space-y-0.5 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono font-black text-sm sm:text-base text-slate-900">
                                  #{ord.orderId}
                                </span>
                                <span className="text-xs sm:text-sm font-bold text-slate-800">
                                  {ord.customer.fullName}
                                </span>
                                {ord.paymentVerified && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                                    <ShieldCheck className="w-3 h-3" />
                                    <span>
                                      UPI Verified {ord.upiRef ? `(${ord.upiRef})` : ''}
                                    </span>
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-slate-500">
                                <a
                                  href={`tel:${ord.customer.phone}`}
                                  className="inline-flex items-center gap-1 text-emerald-700 hover:underline font-mono font-semibold"
                                >
                                  <Phone className="w-3 h-3" />
                                  <span>{ord.customer.phone}</span>
                                </a>
                                <span>·</span>
                                <span className="text-[11px]">{ord.statusTimestamp}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
                              <span className="text-xs sm:text-sm font-mono font-black text-emerald-700">
                                ₹{ord.total} ({ord.paymentMethod})
                              </span>
                              <select
                                value={ord.status}
                                onChange={(e) =>
                                  onUpdateOrderStatus(ord.orderId, e.target.value as OrderStatus)
                                }
                                className="text-xs font-bold px-2.5 py-1.5 rounded-xl border border-slate-300 bg-slate-50 cursor-pointer"
                              >
                                <option value="placed">Placed</option>
                                <option value="packed">Packed</option>
                                <option value="dispatched">Dispatched</option>
                                <option value="out_for_delivery">Out for Delivery</option>
                                <option value="delivered">Delivered</option>
                              </select>
                            </div>
                          </div>

                          {/* Address */}
                          <div className="text-xs text-slate-600">
                            <strong className="text-slate-800">{t('Address:', 'पता:')}</strong>{' '}
                            {ord.customer.address}, {ord.customer.city} ({ord.customer.pincode})
                          </div>

                          {/* Ordered Items */}
                          <div className="flex flex-wrap gap-1.5">
                            {ord.items.map((item, idx) => (
                              <span
                                key={idx}
                                className="bg-slate-100 text-slate-700 text-[11px] px-2.5 py-1 rounded-lg font-medium"
                              >
                                {item.quantity}x {item.product.name} ({item.selectedVariant?.label || item.product.unit})
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Bottom Action Bar: WhatsApp Notify + Delete Order History */}
                        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                          <a
                            href={buildCustomerStatusWhatsAppUrl(ord)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{t('Notify on WhatsApp', 'WhatsApp अपडेट भेजें')}</span>
                          </a>

                          {confirmDeleteOrderId === ord.orderId ? (
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] font-bold text-rose-700">
                                {t('Delete?', 'हटाएं?')}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  onDeleteOrder(ord.orderId);
                                  setConfirmDeleteOrderId(null);
                                }}
                                className="px-2.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold cursor-pointer transition-colors"
                              >
                                {t('Yes, Delete', 'हाँ, हटाएं')}
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteOrderId(null)}
                                className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold cursor-pointer transition-colors"
                              >
                                {t('Cancel', 'रद्द करें')}
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteOrderId(ord.orderId)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>{t('Delete Order', 'ऑर्डर डिलीट करें')}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ================= TAB 2: INVENTORY MANAGEMENT ================= */}
            {activeTab === 'inventory' && (
              <div className="space-y-4">
                <div className="relative max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={inventorySearch}
                    onChange={(e) => setInventorySearch(e.target.value)}
                    placeholder={t('Filter products by name or category...', 'प्रोडक्ट या कैटेगरी का नाम लिखें...')}
                    className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:border-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {filteredProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="p-3.5 bg-white rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-white">
                          <ProductVisual product={prod} size="sm" priority={true} className="!w-12 !h-12 !border-0" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">{prod.name}</div>
                          <div className="text-[11px] text-slate-500">
                            {prod.category} · {prod.unit}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 justify-between sm:justify-end">
                        {onUpdateProduct && (
                          <div className="flex items-center gap-1 text-xs">
                            <span className="text-slate-400">₹</span>
                            <input
                              type="number"
                              min={1}
                              value={prod.price}
                              onChange={(e) =>
                                onUpdateProduct(prod.id, { price: Math.max(1, Number(e.target.value)) })
                              }
                              className="w-16 px-2 py-1 rounded-lg border border-slate-300 text-center font-mono text-xs font-bold"
                              aria-label="Product price"
                            />
                          </div>
                        )}

                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="text-slate-400">{t('Stock:', 'स्टॉक:')}</span>
                          <input
                            type="number"
                            min={0}
                            value={prod.stockQuantity}
                            onChange={(e) =>
                              onUpdateProductStock(prod.id, Math.max(0, Number(e.target.value)))
                            }
                            className={`w-16 px-2 py-1 rounded-lg border text-center font-mono text-xs ${
                              prod.stockQuantity <= 10
                                ? 'border-rose-300 bg-rose-50 text-rose-700 font-bold'
                                : 'border-slate-300'
                            }`}
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => onToggleProductStock(prod.id)}
                          className={`text-[11px] font-bold px-2.5 py-1.5 rounded-lg cursor-pointer ${
                            prod.inStock
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {prod.inStock ? t('In Stock', 'उपलब्ध') : t('Out of Stock', 'स्टॉक खत्म')}
                        </button>

                        {onDeleteProduct && (
                          confirmDeleteProdId === prod.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  onDeleteProduct(prod.id);
                                  setConfirmDeleteProdId(null);
                                }}
                                className="px-2 py-1 rounded-lg bg-rose-600 text-white text-[10px] font-bold cursor-pointer"
                              >
                                {t('Confirm', 'हटाएं')}
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteProdId(null)}
                                className="px-2 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold cursor-pointer"
                              >
                                {t('No', 'नहीं')}
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteProdId(prod.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              aria-label="Delete product"
                              title={t('Delete Product', 'प्रोडक्ट हटाएं')}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= TAB 3: ADD NEW PRODUCT ================= */}
            {activeTab === 'add' && (
              <form
                onSubmit={handleAddSubmit}
                className="space-y-4 max-w-2xl mx-auto bg-white p-5 sm:p-6 rounded-2xl border border-slate-200"
              >
                {newAddedSuccess && (
                  <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>
                      {t(
                        'Product added successfully to Tejas Spices catalog!',
                        'नया प्रोडक्ट स्टोर में सफलतापूर्वक जोड़ दिया गया!'
                      )}
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      {t('Product Name (English) *', 'प्रोडक्ट का नाम *')}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Royal Shahi Biryani Masala"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      {t('Hindi Name (Optional)', 'हिंदी नाम (वैकल्पिक)')}
                    </label>
                    <input
                      type="text"
                      placeholder="उदा. शाही बिरयानी मसाला"
                      value={newHindiName}
                      onChange={(e) => setNewHindiName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="space-y-1 col-span-2 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700">{t('Category', 'कैटेगरी')}</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.id} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1 col-span-2 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700">{t('Pack / Unit', 'पैकेट साइज़')}</label>
                    <input
                      type="text"
                      value={newUnit}
                      onChange={(e) => setNewUnit(e.target.value)}
                      placeholder="250g Pack / 1 kg Pack"
                      className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300"
                    />
                  </div>

                  <div className="space-y-1 col-span-1 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700">
                      {t('Selling Price (₹)', 'बिक्री मूल्य (₹)')}
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={newPrice}
                      onChange={(e) => setNewPrice(Number(e.target.value))}
                      className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 font-mono"
                    />
                  </div>

                  <div className="space-y-1 col-span-1 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700">
                      {t('Original MRP (₹)', 'एमआरपी (₹)')}
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={newOriginalPrice}
                      onChange={(e) => setNewOriginalPrice(Number(e.target.value))}
                      className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 font-mono"
                    />
                  </div>
                </div>

                {/* Phone Photo Upload OR Packet Preset Picker */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <label className="text-xs font-bold text-slate-700">
                      {t('Product Packet Image', 'प्रोडक्ट पैकेट की फोटो')}
                    </label>
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{t('Upload from Phone/PC', 'फ़ोन से फोटो चुनें')}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto pb-1.5">
                    {PACKET_PRESETS.map((preset) => {
                      const active = newImage === preset.path;
                      return (
                        <button
                          key={preset.path}
                          type="button"
                          onClick={() => setNewImage(preset.path)}
                          className={`shrink-0 p-1 rounded-xl border text-center cursor-pointer transition-all ${
                            active
                              ? 'border-emerald-600 ring-2 ring-emerald-500/30 bg-emerald-50'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                          title={preset.label}
                        >
                          <img
                            src={getAssetUrl(preset.path)}
                            alt={preset.label}
                            className="w-12 h-12 object-contain rounded-lg"
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      {t('Initial Stock Quantity', 'शुरुआती स्टॉक')}
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={newStock}
                      onChange={(e) => setNewStock(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      {t('Description', 'विवरण')}
                    </label>
                    <input
                      type="text"
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      placeholder="Pure ingredients, cold milled..."
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl text-sm cursor-pointer shadow-sm"
                >
                  {t('Save & Publish Product', 'प्रोडक्ट सेव व पब्लिश करें')}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
