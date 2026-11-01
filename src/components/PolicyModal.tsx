import React, { useState, useEffect } from 'react';
import { 
  X, 
  Truck, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  FileText,
  PackageCheck
} from 'lucide-react';
import { STORE_INFO } from '../data/mockData';

export type PolicyTab = 'shipping' | 'privacy';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: PolicyTab;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'shipping',
}) => {
  const [activeTab, setActiveTab] = useState<PolicyTab>(initialTab);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-3 sm:p-4">
        <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[90vh]">
          
          {/* Header */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-xl shadow-inner">
                  {activeTab === 'shipping' ? (
                    <Truck className="w-5 h-5 text-emerald-100" />
                  ) : (
                    <ShieldCheck className="w-5 h-5 text-emerald-100" />
                  )}
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
                    {activeTab === 'shipping' ? 'Shipping & Delivery Policy' : 'Privacy & Data Protection Policy'}
                  </h2>
                  <p className="text-xs text-emerald-200">
                    Official Store Policies for {STORE_INFO.name} · Suriyawan, UP
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Switcher */}
            <div className="flex items-center gap-2 mt-5 bg-black/20 p-1 rounded-2xl w-fit">
              <button
                onClick={() => setActiveTab('shipping')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'shipping'
                    ? 'bg-white text-emerald-900 shadow-sm'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Shipping Policy</span>
              </button>
              <button
                onClick={() => setActiveTab('privacy')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'privacy'
                    ? 'bg-white text-emerald-900 shadow-sm'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Privacy Policy</span>
              </button>
            </div>
          </div>

          {/* Body Content - Scrollable */}
          <div className="p-5 sm:p-8 overflow-y-auto space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
            {activeTab === 'shipping' ? (
              /* ================= SHIPPING POLICY ================= */
              <div className="space-y-6">
                {/* Highlights Card */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs mb-1">
                      <Truck className="w-4 h-4 text-emerald-600" />
                      <span>Free Delivery</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Orders above <strong>₹{STORE_INFO.freeDeliveryThreshold}</strong> get Free Delivery in Suriyawan & nearby areas.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-teal-50/80 border border-teal-200">
                    <div className="flex items-center gap-2 text-teal-800 font-bold text-xs mb-1">
                      <Clock className="w-4 h-4 text-teal-600" />
                      <span>Same-Day Dispatch</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Orders placed before 5:00 PM are delivered same-day locally within Suriyawan.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200">
                    <div className="flex items-center gap-2 text-amber-800 font-bold text-xs mb-1">
                      <PackageCheck className="w-4 h-4 text-amber-600" />
                      <span>Tamper-Proof Pack</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Food-grade sealed pouches protecting freshness, aroma & purity.
                    </p>
                  </div>
                </div>

                {/* Section 1 */}
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">1</span>
                    Delivery Zones & Service Coverage
                  </h3>
                  <p className="text-slate-600 pl-8">
                    We currently offer direct localized delivery across <strong>Suriyawan, Bhadohi, and surrounding rural/urban pin codes</strong> (including 221404 and adjacent areas). Express domestic shipping is also available across all districts of Uttar Pradesh and throughout India via reputed courier partners (Delhivery, BlueDart, and India Post Speed Post).
                  </p>
                </div>

                {/* Section 2 */}
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">2</span>
                    Shipping Charges & Free Delivery Threshold
                  </h3>
                  <div className="pl-8 space-y-2 text-slate-600">
                    <ul className="list-disc pl-4 space-y-1">
                      <li>
                        <strong>Local Orders (Suriyawan area):</strong> Free delivery on all orders valued at <strong>₹{STORE_INFO.freeDeliveryThreshold} or more</strong>. For orders below ₹{STORE_INFO.freeDeliveryThreshold}, a nominal delivery fee of <strong>₹{STORE_INFO.deliveryFee}</strong> applies to support our delivery team.
                      </li>
                      <li>
                        <strong>Regional / Pan-India Courier Orders:</strong> Calculated automatically at checkout based on package weight and destination pin code.
                      </li>
                      <li>
                        <strong>Cash on Delivery (COD):</strong> Available with zero extra surcharge across our local delivery zone in Suriyawan.
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Section 3 */}
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">3</span>
                    Estimated Delivery Timelines
                  </h3>
                  <div className="pl-8 text-slate-600 space-y-2">
                    <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
                      <div className="grid grid-cols-2 bg-slate-100 font-bold p-2.5 text-slate-800">
                        <span>Location / Zone</span>
                        <span>Estimated Delivery Time</span>
                      </div>
                      <div className="grid grid-cols-2 p-2.5 border-t border-slate-100">
                        <span>Suriyawan Town & Main Market</span>
                        <span className="text-emerald-700 font-semibold">Within 2 to 4 Hours (Same Day)</span>
                      </div>
                      <div className="grid grid-cols-2 p-2.5 border-t border-slate-100 bg-slate-50/50">
                        <span>Bhadohi District & Adjacent Grams</span>
                        <span>Same Day / Next Morning</span>
                      </div>
                      <div className="grid grid-cols-2 p-2.5 border-t border-slate-100">
                        <span>Varanasi, Prayagraj & UP Major Cities</span>
                        <span>1 to 2 Business Days</span>
                      </div>
                      <div className="grid grid-cols-2 p-2.5 border-t border-slate-100 bg-slate-50/50">
                        <span>Rest of India (Courier Express)</span>
                        <span>3 to 5 Business Days</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 pt-1">
                      *Note: Deliveries operate all 7 days from 8:00 AM to 9:00 PM. In case of extreme weather or road blockages, our team will proactively call you.
                    </p>
                  </div>
                </div>

                {/* Section 4 */}
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">4</span>
                    Live Order Tracking & Support
                  </h3>
                  <p className="text-slate-600 pl-8">
                    Once your order is confirmed, you receive an instantaneous Order ID (e.g. <code>ORD-8821</code>). You can track live progress directly via the <strong>"Track Order"</strong> tab on our website or by contacting our Suriyawan store desk on WhatsApp at <strong className="text-slate-900">{STORE_INFO.phone1}</strong>.
                  </p>
                </div>

                {/* Section 5 */}
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">5</span>
                    Damaged, Leaked or Tampered Parcels
                  </h3>
                  <p className="text-slate-600 pl-8">
                    All spices, pulses, ghee, and incense are hand-inspected before dispatch. In the rare event that a package arrives open, damaged, or wet, please refuse delivery or share a photo with us on WhatsApp ({STORE_INFO.phone1}) within 24 hours for an immediate replacement or full refund.
                  </p>
                </div>
              </div>
            ) : (
              /* ================= PRIVACY POLICY ================= */
              <div className="space-y-6">
                {/* Intro statement */}
                <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
                  <div className="flex items-center gap-2 font-bold text-sm mb-1 text-emerald-950">
                    <Lock className="w-4 h-4 text-emerald-700" />
                    <span>Your Privacy is Fully Protected & Respected</span>
                  </div>
                  At {STORE_INFO.name}, we value the trust you place in us. This Privacy Policy outlines our procedures regarding the collection, use, and disclosure of your personal information in compliance with the Information Technology Act, 2000 and the Digital Personal Data Protection (DPDP) Act, 2023.
                </div>

                {/* Section 1 */}
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">1</span>
                    Information We Collect
                  </h3>
                  <div className="pl-8 text-slate-600 space-y-1.5">
                    <p>To process and deliver your grocery and spice orders smoothly, we collect:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li><strong>Personal Identification:</strong> Name, phone number, and optional email address.</li>
                      <li><strong>Shipping Details:</strong> Delivery street address, landmark, town/village, and postal PIN code.</li>
                      <li><strong>Order History:</strong> Products purchased, quantities, order timestamps, and preferred payment mode (UPI, Cash on Delivery, etc.).</li>
                      <li><strong>Customer Communications:</strong> Reviews, ratings, customer service messages, or special delivery instructions provided by you.</li>
                    </ul>
                  </div>
                </div>

                {/* Section 2 */}
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">2</span>
                    How We Use Your Information
                  </h3>
                  <div className="pl-8 text-slate-600 space-y-1">
                    <p>Your details are used exclusively for legitimate business purposes:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Packing, dispatching, and navigating our delivery rider to your home or shop.</li>
                      <li>Sending order status updates, digital invoices, and delivery ETA alerts via SMS/WhatsApp.</li>
                      <li>Resolving any product feedback, replacements, or return requests promptly.</li>
                      <li>Preventing fraudulent orders and maintaining secure store operations.</li>
                    </ul>
                  </div>
                </div>

                {/* Section 3 */}
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">3</span>
                    Payment Security & Banking Data
                  </h3>
                  <div className="pl-8 text-slate-600 space-y-1.5">
                    <p>
                      <strong>We never store your card numbers, CVV, bank account details, or UPI PINs.</strong> All online digital payments are securely processed through RBI-authorized payment gateways and standardized NPCI UPI apps (Google Pay, PhonePe, Paytm, BHIM).
                    </p>
                    <p>
                      For Cash on Delivery (COD) transactions, payment is collected in cash or via live UPI QR scan only upon physical handover of your package.
                    </p>
                  </div>
                </div>

                {/* Section 4 */}
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">4</span>
                    No Sharing or Selling of Personal Data
                  </h3>
                  <p className="text-slate-600 pl-8">
                    We strictly uphold your privacy. <strong>We do not sell, rent, trade, or expose your phone number or personal details to third-party marketing companies, telemarketers, or advertising networks.</strong> Your contact details are shared only with the assigned delivery personnel solely for the duration required to complete the delivery.
                  </p>
                </div>

                {/* Section 5 */}
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">5</span>
                    Grievance Officer & Contact Information
                  </h3>
                  <div className="pl-8 text-slate-600 space-y-2">
                    <p>
                      In case of any concerns, questions, or requests regarding your personal data or privacy preferences, you may reach out to our Store Grievance Contact:
                    </p>
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1.5 text-xs">
                      <div><strong>Entity:</strong> {STORE_INFO.name} (Proprietors: {STORE_INFO.owners})</div>
                      <div><strong>Address:</strong> {STORE_INFO.address}</div>
                      <div><strong>Direct Phone:</strong> <a href={`tel:${STORE_INFO.phone1}`} className="text-emerald-700 font-bold hover:underline">{STORE_INFO.phone1}</a></div>
                      <div><strong>Email:</strong> <a href={`mailto:${STORE_INFO.email}`} className="text-emerald-700 font-bold hover:underline">{STORE_INFO.email}</a></div>
                      <div><strong>Working Hours:</strong> {STORE_INFO.workingHours}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="text-[11px] text-slate-500 text-center sm:text-left">
              Last updated: November 2026 · Compliant with Indian E-Commerce & DPDP Guidelines
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
              >
                I Understand & Agree
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
