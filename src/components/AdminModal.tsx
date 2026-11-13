import React, { useState, useMemo } from 'react';
import {
  X,
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
} from 'lucide-react';
import { Product, Order, OrderStatus } from '../types';
import { CATEGORIES } from '../data/mockData';
import { ProductVisual } from './ProductVisual';
import { buildCustomerStatusWhatsAppUrl } from '../utils/whatsapp';
import { getAssetUrl } from '../utils/assetUrl';
import { useLanguage } from '../utils/i18n';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onUpdateProductStock: (productId: string, stock: number) => void;
  onToggleProductStock: (productId: string) => void;
  onAddProduct: (newProduct: Product) => void;
  onUpdateProduct?: (productId: string, updates: Partial<Product>) => void;
  onDeleteProduct?: (productId: string) => void;
}

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

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  products,
  orders,
  onUpdateOrderStatus,
  onUpdateProductStock,
  onToggleProductStock,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'add'>('orders');

  // Orders filter & search
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | OrderStatus>('all');

  // Inventory search & delete confirmation
  const [inventorySearch, setInventorySearch] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

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

  if (!isOpen) return null;

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrdersCount = orders.filter((o) => o.status !== 'delivered').length;
  const lowStockCount = products.filter((p) => !p.inStock || p.stockQuantity <= 10).length;

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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" />

      <div className="flex min-h-full items-center justify-center p-2.5 sm:p-4">
        <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-4">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shrink-0">
                ⚙️
              </div>
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-bold truncate">
                  {t('Tejas Spices · Admin Portal', 'तेजस स्पाइसेस · एडमिन पैनल')}
                </h2>
                <p className="text-[11px] text-slate-400">
                  {t('Orders, Inventory & WhatsApp Updates', 'ऑर्डर, स्टॉक और WhatsApp अपडेट मैनेज करें')}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Metrics Grid (2x2 on phone, 4 cols on desktop) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 border-b border-slate-100 bg-slate-50 p-3 sm:px-5 text-xs">
            <div className="bg-white rounded-xl p-2.5 border border-slate-200/80">
              <span className="text-[11px] text-slate-400 block font-medium">
                {t('Total Orders', 'कुल ऑर्डर')}
              </span>
              <span className="text-base font-extrabold text-slate-900 font-mono">{orders.length}</span>
            </div>
            <div className="bg-white rounded-xl p-2.5 border border-slate-200/80">
              <span className="text-[11px] text-slate-400 block font-medium">
                {t('Pending Dispatch', 'बाकी ऑर्डर')}
              </span>
              <span className="text-base font-extrabold text-amber-600 font-mono">{pendingOrdersCount}</span>
            </div>
            <div className="bg-white rounded-xl p-2.5 border border-slate-200/80">
              <span className="text-[11px] text-slate-400 block font-medium">
                {t('Store Revenue', 'कुल बिक्री')}
              </span>
              <span className="text-base font-extrabold text-emerald-700 font-mono">₹{totalRevenue}</span>
            </div>
            <div className="bg-white rounded-xl p-2.5 border border-slate-200/80">
              <span className="text-[11px] text-slate-400 block font-medium">
                {t('Low Stock Alerts', 'कम स्टॉक अलर्ट')}
              </span>
              <span className={`text-base font-extrabold font-mono flex items-center gap-1 ${lowStockCount > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                {lowStockCount > 0 && <AlertTriangle className="w-3.5 h-3.5" />}
                <span>{lowStockCount} {t('Items', 'आइटम')}</span>
              </span>
            </div>
          </div>

          {/* Scrollable Tabs */}
          <div className="flex border-b border-slate-200 bg-white px-3 sm:px-5 pt-2.5 gap-3 sm:gap-5 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`pb-2.5 text-xs font-bold transition-colors border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                activeTab === 'orders'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{t(`Orders (${orders.length})`, `ऑर्डर्स (${orders.length})`)}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('inventory')}
              className={`pb-2.5 text-xs font-bold transition-colors border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                activeTab === 'inventory'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>{t(`Inventory (${products.length})`, `स्टॉक / कीमत (${products.length})`)}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('add')}
              className={`pb-2.5 text-xs font-bold transition-colors border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                activeTab === 'add'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{t('+ Add New Product', '+ नया प्रोडक्ट जोड़ें')}</span>
            </button>
          </div>

          {/* Content */}
          <div className="p-3.5 sm:p-5 max-h-[65vh] overflow-y-auto bg-slate-50/40">
            {/* TAB 1: ORDERS MANAGEMENT */}
            {activeTab === 'orders' && (
              <div className="space-y-3.5">
                {/* Search & Status Filters */}
                <div className="space-y-2.5">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      placeholder={t(
                        'Search by Order ID, Customer Name or Mobile...',
                        'ऑर्डर आईडी, ग्राहक का नाम या फ़ोन नंबर खोजें...'
                      )}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:border-emerald-600"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                    {statusChips.map((chip) => (
                      <button
                        key={chip.key}
                        type="button"
                        onClick={() => setOrderStatusFilter(chip.key)}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap shrink-0 cursor-pointer transition-colors border ${
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
                  <div className="text-center py-8 text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
                    {t('No matching orders found.', 'कोई मिलता-जुलता ऑर्डर नहीं मिला।')}
                  </div>
                ) : (
                  filteredOrders.map((ord) => (
                    <div
                      key={ord.orderId}
                      className="p-3.5 sm:p-4 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-2xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-100 pb-2.5">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-extrabold text-sm text-slate-900">
                              #{ord.orderId}
                            </span>
                            <span className="text-xs font-bold text-slate-700">
                              {ord.customer.fullName}
                            </span>
                            <span className="text-[11px] font-mono text-slate-500">
                              {ord.customer.phone}
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
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-2">
                          <span className="text-xs font-mono font-black text-emerald-700">
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

                      <div className="text-xs text-slate-600">
                        <strong>{t('Address:', 'पता:')}</strong> {ord.customer.address},{' '}
                        {ord.customer.city} ({ord.customer.pincode})
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <div className="flex flex-wrap gap-1.5">
                          {ord.items.map((item, idx) => (
                            <span
                              key={idx}
                              className="bg-slate-100 text-slate-700 text-[11px] px-2 py-0.5 rounded-md font-medium"
                            >
                              {item.quantity}x {item.product.name} ({item.selectedVariant?.label || item.product.unit})
                            </span>
                          ))}
                        </div>

                        <a
                          href={buildCustomerStatusWhatsAppUrl(ord)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold transition-colors shrink-0"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{t('Notify Customer on WhatsApp', 'ग्राहक को WhatsApp अपडेट भेजें')}</span>
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 2: INVENTORY MANAGEMENT */}
            {activeTab === 'inventory' && (
              <div className="space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={inventorySearch}
                    onChange={(e) => setInventorySearch(e.target.value)}
                    placeholder={t('Filter products by name or category...', 'प्रोडक्ट या कैटेगरी का नाम लिखें...')}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:border-emerald-600"
                  />
                </div>

                <div className="space-y-2.5">
                  {filteredProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="p-3 bg-white rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-white">
                          <ProductVisual product={prod} size="sm" priority={true} className="!w-12 !h-12 !border-0" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 truncate">{prod.name}</div>
                          <div className="text-[11px] text-slate-500">
                            {prod.category} · {prod.unit}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 justify-between sm:justify-end">
                        {/* Price editor */}
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

                        {/* Stock editor */}
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

                        {/* Delete Product with inline confirmation */}
                        {onDeleteProduct && (
                          confirmDeleteId === prod.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  onDeleteProduct(prod.id);
                                  setConfirmDeleteId(null);
                                }}
                                className="px-2 py-1 rounded-lg bg-rose-600 text-white text-[10px] font-bold cursor-pointer"
                              >
                                {t('Confirm', 'हटाएं')}
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-2 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold cursor-pointer"
                              >
                                {t('No', 'नहीं')}
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(prod.id)}
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

            {/* TAB 3: ADD NEW PRODUCT */}
            {activeTab === 'add' && (
              <form
                onSubmit={handleAddSubmit}
                className="space-y-4 max-w-lg mx-auto bg-white p-4 sm:p-5 rounded-2xl border border-slate-200"
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
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
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">{t('Category', 'कैटेगरी')}</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.id} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">{t('Pack / Unit', 'पैकेट साइज़')}</label>
                    <input
                      type="text"
                      value={newUnit}
                      onChange={(e) => setNewUnit(e.target.value)}
                      placeholder="250g Pack / 1 kg Pack"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      {t('Selling Price (₹)', 'बिक्री मूल्य (₹)')}
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={newPrice}
                      onChange={(e) => setNewPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      {t('Original MRP (₹)', 'एमआरपी (₹)')}
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={newOriginalPrice}
                      onChange={(e) => setNewOriginalPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono"
                    />
                  </div>
                </div>

                {/* Phone Photo Upload OR Packet Preset Picker */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">
                      {t('Product Packet Image', 'प्रोडक्ट पैकेट की फोटो')}
                    </label>
                    <label className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-[11px] font-bold cursor-pointer">
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

                  {/* Quick store packet presets */}
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
                            className="w-11 h-11 object-contain rounded-lg"
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      {t('Initial Stock Quantity', 'शुरुआती स्टॉक')}
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={newStock}
                      onChange={(e) => setNewStock(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono"
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
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs cursor-pointer shadow-sm"
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
