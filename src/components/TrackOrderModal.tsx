import React, { useState, useEffect } from 'react';
import { X, Search, CheckCircle2, Phone, ShieldCheck, RotateCcw, MessageCircle, Package } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { buildWhatsAppOrderFromOrder } from '../utils/whatsapp';
import { useLanguage } from '../utils/i18n';

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  currentOrderId?: string;
  onReorder?: (order: Order) => void;
}

export const TrackOrderModal: React.FC<TrackOrderModalProps> = ({
  isOpen,
  onClose,
  orders,
  currentOrderId,
  onReorder,
}) => {
  const { t } = useLanguage();
  const [searchId, setSearchId] = useState(currentOrderId || (orders[0]?.orderId || ''));

  useEffect(() => {
    if (isOpen) {
      setSearchId(currentOrderId || orders[0]?.orderId || '');
    }
  }, [isOpen, currentOrderId, orders]);

  if (!isOpen) return null;

  const STEPS: { key: OrderStatus; label: string; desc: string }[] = [
    {
      key: 'placed',
      label: t('Order Placed', 'ऑर्डर प्राप्त हुआ'),
      desc: t('Received & verified by store', 'स्टोर द्वारा ऑर्डर सत्यापित किया गया'),
    },
    {
      key: 'packed',
      label: t('Packed by Store', 'पैक किया गया'),
      desc: t('Aroma-sealed & quality checked', 'शुद्धता जांच व एयरटाइट पैकिंग'),
    },
    {
      key: 'dispatched',
      label: t('Dispatched', 'रवाना किया गया'),
      desc: t('Handed to store delivery rider', 'डिलीवरी पार्टनर को सौंपा गया'),
    },
    {
      key: 'out_for_delivery',
      label: t('Out for Delivery', 'डिलीवरी के रास्ते में'),
      desc: t('Rider is arriving at your doorstep', 'डिलीवरी बॉय आपके पते पर पहुँच रहा है'),
    },
    {
      key: 'delivered',
      label: t('Delivered', 'डिलीवरी पूर्ण'),
      desc: t('Handed over successfully', 'ऑर्डर सफलतापूर्वक प्राप्त हुआ'),
    },
  ];

  const activeOrder =
    orders.find((o) => o.orderId.toLowerCase() === searchId.trim().toLowerCase()) || orders[0];

  const getStepStatus = (stepKey: OrderStatus, currentStatus: OrderStatus) => {
    const orderIndex = STEPS.findIndex((s) => s.key === currentStatus);
    const stepIndex = STEPS.findIndex((s) => s.key === stepKey);

    if (stepIndex < orderIndex) return 'completed';
    if (stepIndex === orderIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-4">
        <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                {t('Track Your Order', 'अपना ऑर्डर ट्रैक करें')}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {t('Real-time delivery status for Tejas Spices', 'तेजस स्पाइसेस का लाइव डिलीवरी स्टेटस')}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 sm:p-6 space-y-5 max-h-[82vh] overflow-y-auto">
            {/* Search Input for Order ID */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder={t('Enter Order ID (e.g. TS-94821)', 'ऑर्डर नंबर डालें (उदा. TS-94821)')}
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600 font-mono uppercase bg-slate-50 focus:bg-white"
                />
              </div>
              <button
                type="button"
                onClick={() => {}}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors cursor-pointer shrink-0"
              >
                {t('Track', 'खोजें')}
              </button>
            </div>

            {/* Quick Order Selector if multiple */}
            {orders.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                <span className="text-slate-400 shrink-0">{t('Recent Orders:', 'पिछले ऑर्डर:')}</span>
                {orders.map((ord) => (
                  <button
                    key={ord.orderId}
                    type="button"
                    onClick={() => setSearchId(ord.orderId)}
                    className={`px-2.5 py-1 rounded-lg border font-mono text-[11px] font-bold cursor-pointer transition-colors shrink-0 ${
                      activeOrder?.orderId === ord.orderId
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {ord.orderId}
                  </button>
                ))}
              </div>
            )}

            {activeOrder ? (
              <div className="space-y-5">
                {/* Active Order Card Banner */}
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-extrabold text-slate-900 font-mono">
                        {t('Order', 'ऑर्डर')} #{activeOrder.orderId}
                      </span>
                      <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                        {activeOrder.status.replace(/_/g, ' ')}
                      </span>
                      {activeOrder.paymentVerified && (
                        <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          <ShieldCheck className="w-3 h-3" />
                          <span>UPI Verified</span>
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-600 mt-1">
                      {t('Placed for:', 'ग्राहक:')} <strong>{activeOrder.customer.fullName}</strong> ({activeOrder.customer.phone})
                    </div>
                  </div>
                  <div className="sm:text-right">
                    <div className="text-xs text-slate-500">
                      {t('Payment:', 'भुगतान:')} <strong>{activeOrder.paymentMethod}</strong>
                      {activeOrder.upiRef && (
                        <span className="ml-1 font-mono text-[10px] text-indigo-700">({activeOrder.upiRef})</span>
                      )}
                    </div>
                    <div className="text-sm font-black text-emerald-700 font-mono">
                      {t('Total:', 'कुल:')} ₹{activeOrder.total}
                    </div>
                  </div>
                </div>

                {/* Items Ordered + Quick 1-Tap Reorder & WhatsApp Help */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t(`Items (${activeOrder.items.length})`, `सामान (${activeOrder.items.length})`)}</span>
                    </span>
                    <div className="flex items-center gap-2">
                      {onReorder && (
                        <button
                          type="button"
                          onClick={() => onReorder(activeOrder)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-xs transition-colors cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>{t('1-Tap Reorder', 'दोबारा ऑर्डर करें')}</span>
                        </button>
                      )}
                      <a
                        href={buildWhatsAppOrderFromOrder(activeOrder)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-50 text-[11px] font-bold transition-colors"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {activeOrder.items.map((item, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-slate-700 font-medium"
                      >
                        {item.quantity}x {item.product.name} ({item.selectedVariant?.label || item.product.unit})
                      </span>
                    ))}
                  </div>
                </div>

                {/* Step-by-Step Timeline */}
                <div className="space-y-4 px-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {t('Live Progress Timeline', 'लाइव डिलीवरी प्रोग्रेस')}
                  </h3>

                  <div className="relative space-y-6 before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
                    {STEPS.map((step, idx) => {
                      const status = getStepStatus(step.key, activeOrder.status);
                      const isCompleted = status === 'completed';
                      const isCurrent = status === 'current';

                      return (
                        <div key={step.key} className="relative flex items-start gap-4">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors ${
                              isCompleted
                                ? 'bg-emerald-600 text-white'
                                : isCurrent
                                ? 'bg-emerald-100 text-emerald-700 ring-4 ring-emerald-50'
                                : 'bg-slate-200 text-slate-400'
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : (
                              <span className="text-xs font-bold font-mono">{idx + 1}</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0 pt-0.5">
                            <div className="flex items-center justify-between gap-2">
                              <h4
                                className={`text-sm font-bold ${
                                  isCurrent
                                    ? 'text-emerald-700 font-extrabold'
                                    : isCompleted
                                    ? 'text-slate-900'
                                    : 'text-slate-400'
                                }`}
                              >
                                {step.label}
                              </h4>
                              {isCurrent && (
                                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full animate-pulse shrink-0">
                                  {t('In Progress', 'प्रगति पर')}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Delivery Boy Details */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                      🏍️
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        {activeOrder.deliveryRider.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {t('Vehicle:', 'वाहन:')} {activeOrder.deliveryRider.vehicleNumber}
                      </div>
                    </div>
                  </div>
                  <a
                    href={`tel:${activeOrder.deliveryRider.phone}`}
                    className="inline-flex items-center justify-center gap-1.5 w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{t('Call Delivery Partner', 'डिलीवरी पार्टनर को कॉल करें')}</span>
                  </a>
                </div>

                {/* Delivery Address */}
                <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-800 block mb-1">
                    {t('Delivering to:', 'डिलीवरी पता:')}
                  </span>
                  <div>
                    {activeOrder.customer.address}, {activeOrder.customer.city} - {activeOrder.customer.pincode}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs">
                {t(
                  'No order found with that ID. Please verify your order number.',
                  'इस आईडी से कोई ऑर्डर नहीं मिला। कृपया सही ऑर्डर नंबर जांचें।'
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
