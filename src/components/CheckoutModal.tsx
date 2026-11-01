import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, QrCode, Banknote, MapPin, Phone, User } from 'lucide-react';
import { CartItem, Order } from '../types';
import { STORE_INFO } from '../data/mockData';

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
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Suriyawan');
  const [pincode, setPincode] = useState('221404');
  const [notes, setNotes] = useState('');
  const [paymentMode, setPaymentMode] = useState<'COD' | 'UPI'>('COD');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const isFreeDelivery = subtotal >= STORE_INFO.freeDeliveryThreshold;
  const deliveryFee = isFreeDelivery ? 0 : STORE_INFO.deliveryFee;
  const discountAmount = appliedCoupon ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + deliveryFee - discountAmount;

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
        createdAt: new Date().toISOString(),
        deliveryRider: {
          name: 'Rameshwar Gurjar',
          phone: STORE_INFO.phone1,
          vehicleNumber: 'RJ-36-SB-2210',
        },
      };

      setIsSubmitting(false);
      onOrderSuccess(newOrder);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Complete Your Order
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Fast doorstep delivery by Tejas Spices store team
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  Full Name *
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
                  WhatsApp / Mobile Number *
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
                  House No., Street & Landmark *
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
                <label className="text-xs font-bold text-slate-700">City / Town</label>
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
                <label className="text-xs font-bold text-slate-700">Pincode</label>
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
                <label className="text-xs font-bold text-slate-700">Delivery Instructions (Optional)</label>
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
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-900 block">
                Select Payment Mode
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
                    <div className="text-xs font-bold text-slate-900">Cash on Delivery (COD)</div>
                    <div className="text-[10px] text-slate-500">Pay cash upon home delivery</div>
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
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">UPI / QR Code Scan</div>
                    <div className="text-[10px] text-slate-500">GPay, PhonePe, Paytm QR</div>
                  </div>
                </div>
              </div>

              {/* UPI Preview Box if UPI selected */}
              {paymentMode === 'UPI' && (
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl flex flex-col sm:flex-row items-center gap-4 mt-2">
                  <div className="w-24 h-24 bg-white p-2 rounded-xl border border-purple-300 flex items-center justify-center shadow-xs">
                    <div className="text-center font-mono text-[9px] text-purple-950">
                      <div className="w-16 h-16 bg-slate-900 rounded-lg mx-auto flex items-center justify-center text-white text-xs">
                        QR CODE
                      </div>
                      <span className="text-[8px] mt-0.5 block">Scan to Pay</span>
                    </div>
                  </div>
                  <div className="text-xs space-y-1 text-purple-900 text-center sm:text-left">
                    <div className="font-bold">UPI ID: <span className="font-mono bg-white px-2 py-0.5 rounded border border-purple-200">9450253342@okbizaxis</span></div>
                    <p className="text-[11px] text-purple-700">
                      Scan via GPay or PhonePe upon delivery or pay to rider directly.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Summary Strip */}
            <div className="p-4 bg-slate-100 rounded-2xl flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 block">Total Items: {cart.length}</span>
                <span className="font-bold text-slate-800">
                  Delivery: {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block">Grand Total:</span>
                <span className="text-lg font-extrabold text-emerald-700 tabular-nums tracking-tight">₹{total}</span>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              {isSubmitting ? (
                <span>Placing your order...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Place Order (₹{total})</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
