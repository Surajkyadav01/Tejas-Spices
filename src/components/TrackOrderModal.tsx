import React, { useState } from 'react';
import { X, Search, CheckCircle2, Clock, PackageCheck, Truck, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { STORE_INFO } from '../data/mockData';

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  currentOrderId?: string;
}

const STEPS: { key: OrderStatus; label: string; desc: string }[] = [
  { key: 'placed', label: 'Order Placed', desc: 'Received & verified by store' },
  { key: 'packed', label: 'Packed by Store', desc: 'Aroma-sealed & quality checked' },
  { key: 'dispatched', label: 'Dispatched', desc: 'Handed to store delivery rider' },
  { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'Rider is arriving at your doorstep' },
  { key: 'delivered', label: 'Delivered', desc: 'Handed over successfully' },
];

export const TrackOrderModal: React.FC<TrackOrderModalProps> = ({
  isOpen,
  onClose,
  orders,
  currentOrderId,
}) => {
  const [searchId, setSearchId] = useState(currentOrderId || (orders[0]?.orderId || ''));

  if (!isOpen) return null;

  const activeOrder = orders.find(
    (o) => o.orderId.toLowerCase() === searchId.trim().toLowerCase()
  ) || orders[0];

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

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Track Your Order
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time delivery status for Tejas Spices
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 sm:p-6 space-y-6">
            {/* Search Input for Order ID */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="Enter Order ID (e.g. TS-94821)"
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600 font-mono uppercase bg-slate-50 focus:bg-white"
                />
              </div>
              <button
                onClick={() => {}}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
              >
                Track
              </button>
            </div>

            {/* Quick Order Selector if multiple */}
            {orders.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                <span className="text-slate-400 shrink-0">Recent Orders:</span>
                {orders.map((ord) => (
                  <button
                    key={ord.orderId}
                    onClick={() => setSearchId(ord.orderId)}
                    className={`px-2.5 py-1 rounded-lg border font-mono text-[11px] font-bold cursor-pointer transition-colors ${
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
              <div className="space-y-6">
                {/* Active Order Card Banner */}
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-slate-900 font-mono">
                        Order #{activeOrder.orderId}
                      </span>
                      <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                        {activeOrder.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Placed for: <strong>{activeOrder.customer.fullName}</strong> ({activeOrder.customer.phone})
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500">Payment: <strong>{activeOrder.paymentMethod}</strong></div>
                    <div className="text-sm font-black text-emerald-700 font-mono">Total: ₹{activeOrder.total}</div>
                  </div>
                </div>

                {/* Step-by-Step Timeline matching prompt */}
                <div className="space-y-4 px-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Live Progress Timeline
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
                            <div className="flex items-center justify-between">
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
                                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full animate-pulse">
                                  In Progress
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
                        Vehicle: {activeOrder.deliveryRider.vehicleNumber}
                      </div>
                    </div>
                  </div>
                  <a
                    href={`tel:${activeOrder.deliveryRider.phone}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Delivery Partner</span>
                  </a>
                </div>

                {/* Delivery Address */}
                <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-800 block mb-1">Delivering to:</span>
                  <div>{activeOrder.customer.address}, {activeOrder.customer.city} - {activeOrder.customer.pincode}</div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs">
                No order found with that ID. Please verify your order number.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
