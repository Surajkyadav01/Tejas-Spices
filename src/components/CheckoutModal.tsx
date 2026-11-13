import React, { useState } from 'react';
import { X, CheckCircle2, QrCode, Banknote, MapPin, Phone, User, MessageCircle } from 'lucide-react';
import { CartItem, Order } from '../types';
import { STORE_INFO } from '../data/mockData';
import { DynamicUpiPaymentBox } from './DynamicUpiPaymentBox';
import { buildWhatsAppOrderUrl } from '../utils/whatsapp';
import { useLanguage } from '../utils/i18n';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  appliedCoupon: string | null;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  appliedCoupon,
  onOrderSuccess,
}) => {
  const { t } = useLanguage();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Suriyawan');
  const [pincode, setPincode] = useState('221404');
  const [notes, setNotes] = useState('');
  const [paymentMode, setPaymentMode] = useState<'COD' | 'UPI'>('COD');
  const [upiRef, setUpiRef] = useState('');
  const [isUpiVerified, setIsUpiVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => {
    const unitPrice = item.selectedVariant?.price ?? item.product.price;
    return sum + unitPrice * item.quantity;
  }, 0);
  const isFreeDelivery = subtotal >= STORE_INFO.freeDeliveryThreshold;
  const deliveryFee = isFreeDelivery ? 0 : STORE_INFO.deliveryFee;
  const discountAmount = appliedCoupon ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + deliveryFee - discountAmount;

  const whatsappUrl = buildWhatsAppOrderUrl({
    items: cart,
    subtotal,
    deliveryFee,
    discount: discountAmount,
    total,
    paymentMethod: paymentMode,
    upiRef: isUpiVerified ? upiRef : undefined,
    customer: { fullName, phone, address, city, pincode, notes },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !address) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const orderId = `TS-${Math.floor(10000 + Math.random() * 90000)}`;
      const newOrder: Order = {
        orderId,
        items: [...cart],
        subtotal,
        deliveryFee,
        discount: discountAmount,
        total,
        status: 'placed',
        statusTimestamp: 'Just now',
        customer: {
          fullName,
          phone,
          address,
          city,
          pincode,
          notes,
        },
        paymentMethod: paymentMode,
        paymentVerified: paymentMode === 'UPI' ? isUpiVerified : false,
        upiRef: paymentMode === 'UPI' && upiRef.trim() ? upiRef.trim() : undefined,
        createdAt: new Date().toISOString(),
        deliveryRider: {
          name: 'Rameshwar Kumar',
          phone: STORE_INFO.phone1,
          vehicleNumber: 'UP-66-AB-2210',
        },
      };

      setIsSubmitting(false);
      onOrderSuccess(newOrder);
    }, 650);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-4">
        <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                {t('Complete Your Order', 'अपना ऑर्डर कन्फर्म करें')}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {t('Fast doorstep delivery by Tejas Spices store team', 'तेजस स्पाइसेस टीम द्वारा तेज़ होम डिलीवरी')}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              aria-label="Close checkout"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  {t('Full Name *', 'पूरा नाम *')}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Suresh Kumar"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600 bg-slate-50 focus:bg-white"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  {t('WhatsApp / Mobile Number *', 'मोबाइल / WhatsApp नंबर *')}
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600 bg-slate-50 focus:bg-white font-mono"
                />
              </div>

              {/* Street Address */}
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  {t('House No., Street & Landmark *', 'मकान नंबर, गली और पास की पहचान *')}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. House #15, Main Market, Near Digambar Jain Mandir"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600 bg-slate-50 focus:bg-white"
                />
              </div>

              {/* City */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">{t('City / Town', 'शहर / कस्बा')}</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600 bg-slate-50 focus:bg-white"
                />
              </div>

              {/* Pincode */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">{t('Pincode', 'पिन कोड')}</label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600 bg-slate-50 focus:bg-white font-mono"
                />
              </div>

              {/* Delivery Notes */}
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-700">{t('Delivery Instructions (Optional)', 'डिलीवरी निर्देश (वैकल्पिक)')}</label>
                <input
                  type="text"
                  placeholder="e.g. Ring bell twice, deliver after 4 PM"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600 bg-slate-50"
                />
              </div>
            </div>

            {/* Payment Mode Selector */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-bold text-slate-900 block">
                {t('Select Payment Mode', 'भुगतान का तरीका चुनें')}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Cash on Delivery */}
                <div
                  onClick={() => setPaymentMode('COD')}
                  className={`p-3.5 rounded-2xl border-2 flex items-center gap-3 cursor-pointer transition-all ${
                    paymentMode === 'COD'
                      ? 'border-emerald-600 bg-emerald-50/70 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{t('Cash on Delivery (COD)', 'कैश ऑन डिलीवरी (COD)')}</div>
                    <div className="text-[10px] text-slate-500">{t('Pay cash upon home delivery', 'डिलीवरी मिलने पर नकद दें')}</div>
                  </div>
                </div>

                {/* UPI QR */}
                <div
                  onClick={() => setPaymentMode('UPI')}
                  className={`p-3.5 rounded-2xl border-2 flex items-center gap-3 cursor-pointer transition-all ${
                    paymentMode === 'UPI'
                      ? 'border-emerald-600 bg-emerald-50/70 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{t('Dynamic UPI / QR Pay', 'डायनामिक UPI / QR पेमेंट')}</div>
                    <div className="text-[10px] text-slate-500">{t('Verified GPay, PhonePe, Paytm', 'GPay, PhonePe, Paytm वेरिफाइड')}</div>
                  </div>
                </div>
              </div>

              {/* Real Dynamic UPI QR & Verification */}
              {paymentMode === 'UPI' && (
                <DynamicUpiPaymentBox
                  amount={total}
                  orderHint={`Tejas Spices (${cart.length} items)`}
                  upiRef={upiRef}
                  onChangeUpiRef={setUpiRef}
                  isVerified={isUpiVerified}
                  onVerifyChange={setIsUpiVerified}
                />
              )}
            </div>

            {/* Summary Strip */}
            <div className="p-4 bg-slate-100 rounded-2xl flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 block">
                  {t('Total Items:', 'कुल आइटम:')} {cart.reduce((s, i) => s + i.quantity, 0)}
                </span>
                <span className="font-bold text-slate-800">
                  {t('Delivery:', 'डिलीवरी:')}{' '}
                  {deliveryFee === 0 ? t('FREE', 'मुफ़्त') : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block">{t('Grand Total:', 'कुल राशि:')}</span>
                <span className="text-lg font-extrabold text-emerald-700 tabular-nums tracking-tight">₹{total}</span>
              </div>
            </div>

            {/* Submit + WhatsApp Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                {isSubmitting ? (
                  <span>{t('Placing your order...', 'ऑर्डर बुक हो रहा है...')}</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>{t(`Place Order (₹${total})`, `ऑर्डर कन्फर्म करें (₹${total})`)}</span>
                  </>
                )}
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-3.5 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 text-sm"
              >
                <MessageCircle className="w-5 h-5" />
                <span>{t('Order via WhatsApp', 'WhatsApp पर भेजें')}</span>
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
