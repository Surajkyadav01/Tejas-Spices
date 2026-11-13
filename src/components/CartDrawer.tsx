import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Tag, MessageCircle } from 'lucide-react';
import { CartItem } from '../types';
import { STORE_INFO } from '../data/mockData';
import { ProductVisual } from './ProductVisual';
import { getCartKey } from '../utils/variants';
import { buildWhatsAppOrderUrl } from '../utils/whatsapp';
import { useLanguage } from '../utils/i18n';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number, variantLabel?: string) => void;
  onRemoveItem: (productId: string, variantLabel?: string) => void;
  onProceedToCheckout: () => void;
  appliedCoupon: string | null;
  onApplyCoupon: (code: string) => void;
  onRemoveCoupon: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
}) => {
  const { t } = useLanguage();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => {
    const unitPrice = item.selectedVariant?.price ?? item.product.price;
    return sum + unitPrice * item.quantity;
  }, 0);

  const isFreeDelivery = subtotal >= STORE_INFO.freeDeliveryThreshold;
  const deliveryFee = subtotal === 0 ? 0 : isFreeDelivery ? 0 : STORE_INFO.deliveryFee;
  const differenceForFree = Math.max(0, STORE_INFO.freeDeliveryThreshold - subtotal);
  const deliveryProgress = Math.min(100, Math.round((subtotal / STORE_INFO.freeDeliveryThreshold) * 100));

  // Discount calculation
  const discountAmount = appliedCoupon ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + deliveryFee - discountAmount;

  const whatsappUrl = buildWhatsAppOrderUrl({
    items: cart,
    subtotal,
    deliveryFee,
    discount: discountAmount,
    total,
  });

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (couponInput.trim().toUpperCase() === 'TEJAS10') {
      onApplyCoupon('TEJAS10');
      setCouponInput('');
    } else {
      setCouponError(t('Invalid coupon. Try "TEJAS10" for 10% off.', 'गलत कूपन कोड। 10% छूट के लिए "TEJAS10" डालें।'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-8 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {t('Your Shopping Cart', 'आपका शॉपिंग कार्ट')} ({cart.reduce((c, i) => c + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Bar */}
          <div className="bg-emerald-50 px-4 py-3 border-b border-emerald-100">
            {isFreeDelivery ? (
              <div className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                <span>🎉</span>
                <span>
                  {t(
                    'Congratulations! You qualify for FREE Doorstep Delivery!',
                    'बधाई हो! आपका ऑर्डर मुफ़्त होम डिलीवरी के लिए योग्य है!'
                  )}
                </span>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span>
                    {t('Add', 'मुफ़्त डिलीवरी के लिए')}{' '}
                    <strong className="text-emerald-700 font-mono">₹{differenceForFree}</strong>{' '}
                    {t('more for FREE Delivery', 'और जोड़ें')}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">{deliveryProgress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${deliveryProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl">
                  🛒
                </div>
                <h3 className="text-base font-bold text-slate-800">
                  {t('Your cart is empty', 'आपका कार्ट खाली है')}
                </h3>
                <p className="text-xs text-slate-500 max-w-xs">
                  {t(
                    'Explore our farm-fresh spices, pure chandan agarbatti, and pooja essentials.',
                    'हमारे शुद्ध मसाले, चंदन अगरबत्ती, दाल-चावल और पूजा सामग्री देखें।'
                  )}
                </p>
                <button
                  onClick={onClose}
                  className="bg-emerald-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors cursor-pointer"
                >
                  {t('Start Shopping', 'खरीदारी शुरू करें')}
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const packLabel = item.selectedVariant?.label || item.product.unit;
                const unitPrice = item.selectedVariant?.price ?? item.product.price;
                return (
                  <div key={getCartKey(item)} className="py-3 flex items-center gap-3">
                    {/* Small Pack Visual */}
                    <div className="w-16 h-16 bg-white rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                      <ProductVisual product={item.product} size="sm" priority={true} className="!border-0" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-slate-900 truncate tracking-tight">
                        {item.product.name}
                      </h4>
                      <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                        {packLabel} · ₹{unitPrice} {t('each', 'प्रति पैक')}
                      </div>
                      <div className="text-xs font-bold text-slate-900 tabular-nums mt-1">
                        ₹{unitPrice * item.quantity}
                      </div>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg p-1 shrink-0">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1, packLabel)}
                        className="w-6 h-6 rounded bg-white text-slate-700 flex items-center justify-center hover:bg-emerald-50 transition-colors shadow-2xs cursor-pointer"
                        aria-label="Decrease"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold tabular-nums px-1">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1, packLabel)}
                        className="w-6 h-6 rounded bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 transition-colors shadow-2xs cursor-pointer"
                        aria-label="Increase"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => onRemoveItem(item.product.id, packLabel)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Calculations & Checkout */}
          {cart.length > 0 && (
            <div className="border-t border-slate-200 p-4 sm:p-5 bg-slate-50/70 space-y-3">
              {/* Coupon input */}
              <div>
                {!appliedCoupon ? (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder={t('Coupon (e.g. TEJAS10)', 'कूपन कोड (जैसे TEJAS10)')}
                        className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600 uppercase font-mono bg-white"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-900 text-white transition-colors cursor-pointer"
                    >
                      {t('Apply', 'लागू करें')}
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center justify-between bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-xl text-xs text-emerald-900">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <Tag className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{appliedCoupon} {t('applied (10% OFF)', 'लागू (10% छूट)')}</span>
                    </div>
                    <button
                      onClick={onRemoveCoupon}
                      className="text-emerald-700 hover:text-emerald-900 font-bold underline cursor-pointer"
                    >
                      {t('Remove', 'हटाएं')}
                    </button>
                  </div>
                )}
                {couponError && <p className="text-[11px] text-rose-600 mt-1">{couponError}</p>}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1 text-xs text-slate-600 pt-1">
                <div className="flex justify-between">
                  <span>{t('Subtotal', 'कुल सामान')}</span>
                  <span className="tabular-nums font-bold text-slate-800">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('Doorstep Delivery', 'होम डिलीवरी शुल्क')}</span>
                  <span className="tabular-nums">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-700 font-bold">{t('FREE', 'मुफ़्त')}</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>{t('Member Discount (10%)', 'सदस्य छूट (10%)')}</span>
                    <span className="tabular-nums font-semibold">-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>{t('Total Amount', 'कुल देय राशि')}</span>
                  <span className="tabular-nums text-emerald-700 text-base font-extrabold tracking-tight">₹{total}</span>
                </div>
              </div>

              {/* Primary Checkout CTA + Order via WhatsApp */}
              <div className="space-y-2">
                <button
                  onClick={onProceedToCheckout}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-sm tracking-wide uppercase"
                >
                  <span>{t('Proceed to Checkout', 'ऑर्डर पूरा करें')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 text-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{t('Quick Order via WhatsApp', 'WhatsApp पर सीधा ऑर्डर भेजें')}</span>
                </a>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t('Cash on Delivery & Instant UPI Available', 'कैश ऑन डिलीवरी और इंस्टेंट UPI उपलब्ध')}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
