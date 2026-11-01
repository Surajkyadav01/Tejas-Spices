import React, { useState } from 'react';
import { X, Package, ShoppingBag, Plus, Save, RefreshCw, CheckCircle2, TrendingUp } from 'lucide-react';
import { Product, Order, OrderStatus } from '../types';
import { CATEGORIES } from '../data/mockData';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onUpdateProductStock: (productId: string, stock: number) => void;
  onToggleProductStock: (productId: string) => void;
  onAddProduct: (newProduct: Product) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  products,
  orders,
  onUpdateOrderStatus,
  onUpdateProductStock,
  onToggleProductStock,
  onAddProduct,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'add'>('orders');

  // Add Product form states
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState(CATEGORIES[0].slug);
  const [newPrice, setNewPrice] = useState(85);
  const [newOriginalPrice, setNewOriginalPrice] = useState(110);
  const [newUnit, setNewUnit] = useState('200g Pack');
  const [newImage, setNewImage] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newAddedSuccess, setNewAddedSuccess] = useState(false);

  if (!isOpen) return null;

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    const discount = Math.round(((newOriginalPrice - newPrice) / newOriginalPrice) * 100);
    const categoryObj = CATEGORIES.find((c) => c.slug === newCategory);

    const product: Product = {
      id: `prod-${Date.now()}`,
      name: newName,
      category: categoryObj ? categoryObj.name : 'Spices & Masala',
      categorySlug: newCategory,
      price: Number(newPrice),
      originalPrice: Number(newOriginalPrice),
      discountPercent: discount > 0 ? discount : 0,
      unit: newUnit,
      image: newImage || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
      rating: 4.9,
      reviewsCount: 1,
      inStock: true,
      stockQuantity: 40,
      soldCount: 0,
      totalCount: 40,
      badge: 'New Arrival',
      badgeColor: 'emerald',
      description: newDesc || `${newName} fresh batch from Tejas Spices store.`,
      origin: 'Suriyawan, Uttar Pradesh',
      visualType: 'pesa',
      isNew: true,
      isFeatured: true,
    };

    onAddProduct(product);
    setNewAddedSuccess(true);
    setTimeout(() => {
      setNewName('');
      setNewDesc('');
      setNewAddedSuccess(false);
      setActiveTab('inventory');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                ⚙️
              </div>
              <div>
                <h2 className="text-lg font-bold">Tejas Spices · Store Admin Portal</h2>
                <p className="text-xs text-slate-400">Inventory & Order Management</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-100 border-b border-slate-100 bg-slate-50 text-xs py-3 px-5">
            <div>
              <span className="text-slate-400 block">Total Orders</span>
              <span className="text-base font-extrabold text-slate-900 font-mono">{orders.length}</span>
            </div>
            <div className="pl-4">
              <span className="text-slate-400 block">Total Catalog</span>
              <span className="text-base font-extrabold text-slate-900 font-mono">{products.length} Items</span>
            </div>
            <div className="pl-4">
              <span className="text-slate-400 block">Store Revenue</span>
              <span className="text-base font-extrabold text-emerald-700 font-mono">₹{totalRevenue}</span>
            </div>
            <div className="pl-4">
              <span className="text-slate-400 block">Active Status</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full inline-block mt-0.5">
                ● Store Open
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-200 bg-white px-5 pt-3 gap-4">
            <button
              onClick={() => setActiveTab('orders')}
              className={`pb-3 text-xs font-bold transition-colors border-b-2 cursor-pointer ${
                activeTab === 'orders'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Customer Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`pb-3 text-xs font-bold transition-colors border-b-2 cursor-pointer ${
                activeTab === 'inventory'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Product Inventory ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('add')}
              className={`pb-3 text-xs font-bold transition-colors border-b-2 cursor-pointer ${
                activeTab === 'add'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              + Add New Spice / Product
            </button>
          </div>

          {/* Content */}
          <div className="p-5 sm:p-6 max-h-[60vh] overflow-y-auto">
            {/* Orders Management */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div key={ord.orderId} className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-2xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                      <div>
                        <span className="font-mono font-bold text-sm text-slate-900">
                          #{ord.orderId}
                        </span>
                        <span className="text-xs text-slate-500 ml-2">
                          {ord.customer.fullName} · {ord.customer.phone}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-extrabold text-emerald-700">
                          ₹{ord.total} ({ord.paymentMethod})
                        </span>
                        <select
                          value={ord.status}
                          onChange={(e) => onUpdateOrderStatus(ord.orderId, e.target.value as OrderStatus)}
                          className="text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-300 bg-slate-50 cursor-pointer"
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
                      <strong>Address:</strong> {ord.customer.address}, {ord.customer.city} ({ord.customer.pincode})
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {ord.items.map((item, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-700 text-[11px] px-2 py-0.5 rounded">
                          {item.quantity}x {item.product.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Inventory Management */}
            {activeTab === 'inventory' && (
              <div className="divide-y divide-slate-100">
                {products.map((prod) => (
                  <div key={prod.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center text-xs shrink-0">
                        ₹{prod.price}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{prod.name}</div>
                        <div className="text-[11px] text-slate-500">{prod.category} · {prod.unit}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-slate-400">Stock:</span>
                        <input
                          type="number"
                          value={prod.stockQuantity}
                          onChange={(e) => onUpdateProductStock(prod.id, Number(e.target.value))}
                          className="w-16 px-2 py-1 rounded border border-slate-300 text-center font-mono text-xs"
                        />
                      </div>

                      <button
                        onClick={() => onToggleProductStock(prod.id)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg cursor-pointer ${
                          prod.inStock
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {prod.inStock ? 'In Stock' : 'Out of Stock'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Product */}
            {activeTab === 'add' && (
              <form onSubmit={handleAddSubmit} className="space-y-4 max-w-lg mx-auto">
                {newAddedSuccess && (
                  <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Product added successfully to Tejas Spices catalog!</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Product Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Shahi Biryani Masala"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.id} value={c.slug}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Pack / Unit</label>
                    <input
                      type="text"
                      value={newUnit}
                      onChange={(e) => setNewUnit(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Discounted Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={newPrice}
                      onChange={(e) => setNewPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Original MRP (₹)</label>
                    <input
                      type="number"
                      required
                      value={newOriginalPrice}
                      onChange={(e) => setNewOriginalPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Image URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Description</label>
                  <textarea
                    rows={2}
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Pure ingredients, grinding details..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer shadow-sm"
                >
                  Save & Publish Product
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
