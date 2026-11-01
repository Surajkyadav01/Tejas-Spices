import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  ShieldCheck, 
  FileText, 
  RotateCcw, 
  HelpCircle, 
  ArrowLeft, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Search
} from 'lucide-react';
import { STORE_INFO } from '../data/mockData';

export type PolicyTabType = 'shipping' | 'privacy' | 'terms' | 'refund' | 'faq';

interface PolicyPageProps {
  initialTab?: PolicyTabType;
  onBackToHome: () => void;
  onSelectTab?: (tab: PolicyTabType) => void;
}

export const PolicyPage: React.FC<PolicyPageProps> = ({
  initialTab = 'shipping',
  onBackToHome,
}) => {
  const [activeTab, setActiveTab] = useState<PolicyTabType>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');

  // Sync when initialTab changes
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [initialTab]);

  const navItems: { id: PolicyTabType; label: string; hindiLabel: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'shipping',
      label: 'Shipping & Delivery Policy',
      hindiLabel: 'शिपिंग और डिलीवरी नियम',
      icon: <Truck className="w-4 h-4" />,
      badge: `Free > ₹${STORE_INFO.freeDeliveryThreshold}`,
    },
    {
      id: 'privacy',
      label: 'Privacy Policy',
      hindiLabel: 'गोपनीयता नीति',
      icon: <ShieldCheck className="w-4 h-4" />,
      badge: '100% Secure',
    },
    {
      id: 'terms',
      label: 'Ordering & Buying Terms',
      hindiLabel: 'ऑर्डर और खरीद नियम',
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: 'refund',
      label: 'Return & Refund Policy',
      hindiLabel: 'रिटर्न और रिफंड नीति',
      icon: <RotateCcw className="w-4 h-4" />,
      badge: 'Easy Return',
    },
    {
      id: 'faq',
      label: 'Help & Customer FAQ',
      hindiLabel: 'सहायता एवं सवाल-जवाब',
      icon: <HelpCircle className="w-4 h-4" />,
    },
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50/70 pb-16">
      {/* Top Banner / Breadcrumb Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              {/* Breadcrumb */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2 font-medium">
                <button
                  onClick={onBackToHome}
                  className="hover:text-emerald-700 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Home</span>
                </button>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-600">Legal & Store Policies</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-emerald-700 font-bold capitalize">
                  {activeTab.replace('-', ' ')}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={onBackToHome}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-emerald-200 transition-colors cursor-pointer group"
                  aria-label="Back to store"
                >
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                  <span>Back to Store (होमपेज पर जाएं)</span>
                </button>

                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Tejas Spices Store Policies & Terms
                </h1>
              </div>
            </div>

            {/* Quick Contact badge */}
            <div className="flex items-center gap-3 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-2.5 px-4 text-xs">
              <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
              <div>
                <div className="text-[10px] uppercase font-bold text-emerald-800">Need Immediate Help?</div>
                <a href={`tel:${STORE_INFO.phone1}`} className="font-extrabold text-slate-900 hover:text-emerald-700">
                  {STORE_INFO.phone1}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Navigation Sidebar */}
          <aside className="lg:col-span-4 xl:col-span-3 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-3 shadow-xs sticky top-24">
              <div className="text-xs font-black uppercase text-slate-400 tracking-wider px-3 py-2 border-b border-slate-100">
                Policy Navigation
              </div>

              <nav className="space-y-1.5 pt-2">
                {navItems.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        window.scrollTo({ top: 120, behavior: 'smooth' });
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all cursor-pointer ${
                        isActive
                          ? 'bg-emerald-600 text-white font-bold shadow-xs'
                          : 'text-slate-700 hover:bg-slate-100 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={isActive ? 'text-white' : 'text-emerald-700'}>
                          {item.icon}
                        </span>
                        <div className="truncate">
                          <div className="text-xs leading-tight">{item.label}</div>
                          <div className={`text-[10px] leading-tight ${isActive ? 'text-emerald-100' : 'text-slate-400'}`}>
                            {item.hindiLabel}
                          </div>
                        </div>
                      </div>

                      {item.badge && (
                        <span
                          className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full shrink-0 uppercase tracking-wider ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Store Address card in sidebar */}
              <div className="mt-4 pt-4 border-t border-slate-100 p-3 bg-slate-50/80 rounded-xl space-y-2 text-[11px] text-slate-600">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Physical Store Address</span>
                </div>
                <p className="leading-relaxed">
                  {STORE_INFO.address}
                </p>
                <div className="pt-1 flex items-center gap-1.5 text-emerald-700 font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{STORE_INFO.workingHours}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Document Body */}
          <main className="lg:col-span-8 xl:col-span-9 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xs">
            {/* Active Document Header */}
            <div className="border-b border-slate-100 pb-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Official Store Policy · Tejas Spices
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
                  {activeTab === 'shipping' && 'Shipping & Delivery Policy (शिपिंग और डिलीवरी नियम)'}
                  {activeTab === 'privacy' && 'Privacy Policy (ग्राहक गोपनीयता एवं डेटा सुरक्षा नीति)'}
                  {activeTab === 'terms' && 'Ordering & Buying Terms (ऑर्डर व खरीद नियम व शर्तें)'}
                  {activeTab === 'refund' && 'Return & Refund Policy (रिटर्न, रिप्लेसमेंट व रिफंड नीति)'}
                  {activeTab === 'faq' && 'Customer Help & Frequently Asked Questions (सामान्य प्रश्न)'}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Last updated: October 2026 · Effective for all orders placed on Tejas Spices (Suriyawan, Uttar Pradesh)
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Merchant
                </span>
              </div>
            </div>

            {/* TAB 1: SHIPPING POLICY */}
            {activeTab === 'shipping' && (
              <div className="space-y-8 text-slate-700 leading-relaxed text-sm">
                {/* Highlights banner */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-2xl">
                    <div className="text-emerald-800 font-extrabold text-lg">₹{STORE_INFO.freeDeliveryThreshold}+</div>
                    <div className="font-bold text-slate-900 text-xs">Free Home Delivery</div>
                    <p className="text-[11px] text-slate-600 mt-0.5">Available across Suriyawan market & adjacent rural pincodes.</p>
                  </div>
                  <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-2xl">
                    <div className="text-emerald-800 font-extrabold text-lg">2 - 4 Hours</div>
                    <div className="font-bold text-slate-900 text-xs">Express Local Dispatch</div>
                    <p className="text-[11px] text-slate-600 mt-0.5">Orders received before 7:00 PM are delivered on the same day.</p>
                  </div>
                  <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-2xl">
                    <div className="text-emerald-800 font-extrabold text-lg">Airtight Packing</div>
                    <div className="font-bold text-slate-900 text-xs">100% Aroma Locked</div>
                    <p className="text-[11px] text-slate-600 mt-0.5">Hygienic, sealed food-grade packaging for maximum freshness.</p>
                  </div>
                </div>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">1</span>
                    1. Delivery Locations & Coverage (डिलीवरी क्षेत्र)
                  </h3>
                  <p>
                    <strong>Tejas Spices</strong> provides direct home delivery across <strong>Suriyawan, Bhadohi district, Uttar Pradesh (Pincode: 221404)</strong> and its immediate surrounding localities.
                  </p>
                  <p>
                    Whether you are ordering whole spices (खड़ा मसाला), freshly grounded turmeric/mirch powders, fragrant royal agarbatti, or daily grocery provisions, our local dispatch riders ensure quick doorstep service.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">2</span>
                    2. Delivery Charges & Free Delivery Slabs (डिलीवरी शुल्क)
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border border-slate-200 rounded-xl overflow-hidden text-xs">
                      <thead className="bg-slate-100 text-slate-700 font-bold">
                        <tr>
                          <th className="p-3">Order Total</th>
                          <th className="p-3">Delivery Charge</th>
                          <th className="p-3">Estimated Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="p-3 font-semibold text-emerald-700">₹{STORE_INFO.freeDeliveryThreshold} and Above</td>
                          <td className="p-3 font-bold text-emerald-800">FREE (निःशुल्क)</td>
                          <td className="p-3">Same Day (2 - 4 hours)</td>
                        </tr>
                        <tr>
                          <td className="p-3">Orders Below ₹{STORE_INFO.freeDeliveryThreshold}</td>
                          <td className="p-3 font-medium text-slate-800">Nominal ₹30 (स्थानीय खर्च)</td>
                          <td className="p-3">Same Day</td>
                        </tr>
                        <tr>
                          <td className="p-3">Bulk / Special Temple Orders</td>
                          <td className="p-3 font-medium text-slate-800">Free / Custom Transport</td>
                          <td className="p-3">Coordinated directly via Call/WhatsApp</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">3</span>
                    3. Dispatch Timings & Schedule (ऑर्डर भेजने का समय)
                  </h3>
                  <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                    <li>Our store operates <strong>8:00 AM – 9:00 PM (All 7 Days)</strong>.</li>
                    <li>Orders placed between 8:00 AM and 7:00 PM are dispatched on the <strong>same day</strong>.</li>
                    <li>Orders placed after 7:00 PM are dispatched first thing the following morning by 9:00 AM.</li>
                    <li>In case of urgent pooja or family ritual requirements, customers can call our direct helpline at <strong className="text-slate-900">{STORE_INFO.phone1}</strong> for priority express dispatch.</li>
                  </ul>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">4</span>
                    4. Packaging & Quality Protection (पैकेजिंग सुरक्षा)
                  </h3>
                  <p>
                    Spices, dry fruits, and incense require delicate protection from humidity and aroma loss. Every item from Tejas Spices is:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                    <li>Packed in 3-layer food-grade, moisture-barrier pouches.</li>
                    <li>Tamper-evident sealed with quality inspection batch tags.</li>
                    <li>Ghee, oils, and camphor are packed in spill-proof containers.</li>
                  </ul>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">5</span>
                    5. Order Tracking & Delivery Confirmation (ऑर्डर ट्रैकिंग)
                  </h3>
                  <p>
                    Once your order is accepted, you can track it anytime using the <strong>Track Order</strong> feature on our website or by contacting our delivery desk. Our rider confirms the address by phone before arriving at your door.
                  </p>
                </section>
              </div>
            )}

            {/* TAB 2: PRIVACY POLICY */}
            {activeTab === 'privacy' && (
              <div className="space-y-8 text-slate-700 leading-relaxed text-sm">
                <div className="bg-emerald-50/60 border border-emerald-200 p-4 rounded-2xl flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div className="text-xs text-emerald-950">
                    <strong className="block text-emerald-900 font-bold mb-1">Our Privacy Commitment (गोपनीयता संकल्प):</strong>
                    At Tejas Spices, we respect your privacy. We strictly never sell, rent, or trade your personal contact details or order history to any third-party advertisers or marketing agencies.
                  </div>
                </div>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">1</span>
                    1. Information We Collect (हम कौन सी जानकारी एकत्र करते हैं)
                  </h3>
                  <p>When you browse, register, or place an order on our store, we only collect information necessary to fulfill your groceries:</p>
                  <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                    <li><strong>Contact Information:</strong> Customer Name, Phone Number, and Email Address.</li>
                    <li><strong>Delivery Address:</strong> House/landmark address in Suriyawan, Bhadohi or adjacent areas for accurate drop-off.</li>
                    <li><strong>Order Details:</strong> Selected items, quantities, date of order, and invoice total.</li>
                    <li><strong>Customer Preferences:</strong> Saved items in Wishlist or Shopping Cart for your convenience.</li>
                  </ul>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">2</span>
                    2. How We Use Your Information (जानकारी का उपयोग कैसे होता है)
                  </h3>
                  <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                    <li>To prepare, pack, and safely dispatch your grocery & spice order.</li>
                    <li>To send SMS, WhatsApp, or phone confirmations regarding dispatch and delivery timing.</li>
                    <li>To provide customer support and process returns or refunds when requested.</li>
                    <li>To share store discounts or festival offers (e.g., Diwali, Holi, Navratri special deals) only if you have opted in.</li>
                  </ul>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">3</span>
                    3. Payment Security & Zero Financial Data Storage (भुगतान सुरक्षा)
                  </h3>
                  <p>
                    Your financial safety is our highest priority.
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                    <li><strong>No Stored Cards or PINs:</strong> We never store credit card numbers, debit card CVVs, or UPI MPINs on our servers.</li>
                    <li><strong>Cash on Delivery (COD):</strong> You can safely pay directly to the delivery person upon receiving and verifying your package.</li>
                    <li><strong>Digital Payments:</strong> UPI payments (Google Pay, PhonePe, Paytm, BHIM) are processed through secure, bank-grade encrypted payment channels.</li>
                  </ul>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">4</span>
                    4. Cookies & Browser Storage (कुकीज नीति)
                  </h3>
                  <p>
                    We use standard browser localStorage to remember your active cart items, wishlist, and preferred language so that you do not lose your selected items if your internet drops or page refreshes.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">5</span>
                    5. Contact Us Regarding Your Privacy
                  </h3>
                  <p>
                    If you have questions about our privacy practices, wish to update your saved phone number, or want your account details removed, please reach out to us directly:
                  </p>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div><strong>Store Owner / Privacy Officer:</strong> Suresh Kumar Jaiswal / Tejas</div>
                    <div><strong>Email:</strong> {STORE_INFO.email}</div>
                    <div><strong>Phone:</strong> {STORE_INFO.phone1}</div>
                    <div><strong>Address:</strong> {STORE_INFO.address}</div>
                  </div>
                </section>
              </div>
            )}

            {/* TAB 3: ORDERING & BUYING TERMS */}
            {activeTab === 'terms' && (
              <div className="space-y-8 text-slate-700 leading-relaxed text-sm">
                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">1</span>
                    1. How to Place an Order (ऑर्डर कैसे दें)
                  </h3>
                  <p>
                    Ordering from <strong>Tejas Spices</strong> is simple and hassle-free:
                  </p>
                  <ol className="list-decimal pl-5 space-y-2 text-slate-600">
                    <li><strong>Online Website:</strong> Browse our categories, choose package weights (100g, 250g, 500g, 1kg), add items to cart, and click Checkout.</li>
                    <li><strong>Phone Order:</strong> Call our store helpline directly at <strong className="text-slate-900">{STORE_INFO.phone1}</strong> between 8:00 AM – 9:00 PM. Our staff will note your grocery list.</li>
                    <li><strong>WhatsApp Ordering:</strong> Send your handwritten list or voice note on WhatsApp to <strong className="text-slate-900">{STORE_INFO.phone1}</strong> for instant confirmation.</li>
                  </ol>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">2</span>
                    2. Pricing & Invoicing Transparency (कीमत और बिलिंग)
                  </h3>
                  <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                    <li>All prices listed on the website are in <strong>Indian Rupees (₹)</strong> and inclusive of all applicable taxes.</li>
                    <li>Discounts and special deal prices (e.g. Save 15%, 20%) shown on product cards will be honored at the time of checkout.</li>
                    <li>Every order comes with an authentic printed/digital cash receipt detailing item names, weights, prices, and applicable discounts.</li>
                  </ul>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">3</span>
                    3. Authenticity & Quality Guarantee (100% शुद्धता की गारंटी)
                  </h3>
                  <p>
                    At Tejas Spices, we stand firmly behind the quality of our merchandise:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                    <li>Whole spices (elaichi, dalchini, laung, kali mirch) are sorted and graded by hand.</li>
                    <li>Pooja samagri, such as pure Bhimseni Kapoor, Cow Ghee Batti, and Flora Agarbatti, is sourced from certified traditional manufacturers.</li>
                    <li>We do not sell expired, stale, or adulterated spices. If any batch fails to meet your expectation, we replace it without hesitation.</li>
                  </ul>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">4</span>
                    4. Order Modifications & Cancellations (ऑर्डर रद्द या बदलना)
                  </h3>
                  <p>
                    Need to add more items or change delivery address? You can modify or cancel your order anytime before our dispatch rider departs from our Suriyawan store. Simply call <strong className="text-slate-900">{STORE_INFO.phone1}</strong> with your Order ID.
                  </p>
                </section>
              </div>
            )}

            {/* TAB 4: RETURN & REFUND POLICY */}
            {activeTab === 'refund' && (
              <div className="space-y-8 text-slate-700 leading-relaxed text-sm">
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-950">
                    <strong className="block text-amber-900 font-bold mb-1">Hassle-Free Return Window (24 - 48 Hours):</strong>
                    If you receive any damaged package, seal breach, or wrong product, notify us within 24-48 hours. We provide instant replacement or a 100% refund.
                  </div>
                </div>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">1</span>
                    1. Eligible Return Conditions (वापसी की शर्तें)
                  </h3>
                  <p>Items are eligible for return or replacement under the following circumstances:</p>
                  <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                    <li>Package received in damaged, leaking, or torn condition.</li>
                    <li>Wrong item or quantity delivered contrary to order summary.</li>
                    <li>Quality variance in spice aroma or purity.</li>
                    <li>Manufacturing defect in dhoop cones or agarbatti packaging.</li>
                  </ul>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">2</span>
                    2. How to Request a Return or Replacement (रिटर्न कैसे करें)
                  </h3>
                  <ol className="list-decimal pl-5 space-y-2 text-slate-600">
                    <li>Call or WhatsApp our support line at <strong className="text-slate-900">{STORE_INFO.phone1}</strong> within 48 hours of delivery.</li>
                    <li>Mention your <strong>Order ID</strong> (found in your order receipt or Track Order panel).</li>
                    <li>Our local rider will visit your address, inspect the item, and either hand over an instant replacement or initiate the refund immediately.</li>
                  </ol>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">3</span>
                    3. Refund Process & Timelines (धनवापसी का समय)
                  </h3>
                  <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                    <li><strong>Cash on Delivery Orders:</strong> Immediate cash refund handed over at your doorstep by our executive upon return pickup.</li>
                    <li><strong>UPI / Online Payments:</strong> Instant refund transferred to your original UPI ID within 2 to 4 hours of return approval.</li>
                    <li>No deductions or restocking charges apply for defective or incorrect dispatches.</li>
                  </ul>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">4</span>
                    4. Non-Returnable Items
                  </h3>
                  <p className="text-xs text-slate-600">
                    For food safety and hygiene reasons, items where original packaging has been substantially consumed or contaminated by improper external storage after delivery cannot be accepted for return, unless a genuine quality defect is verified.
                  </p>
                </section>
              </div>
            )}

            {/* TAB 5: FAQ & CUSTOMER HELP */}
            {activeTab === 'faq' && (
              <div className="space-y-6 text-slate-700 leading-relaxed text-sm">
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-1">Q. सुरियावां में डिलीवरी का समय क्या है? (What is the delivery time in Suriyawan?)</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      अधिकांश स्थानीय ऑर्डर्स <strong>2 से 4 घंटे</strong> के भीतर आपके घर तक पहुंचा दिए जाते हैं। सुबह 8 बजे से शाम 7 बजे तक के ऑर्डर्स उसी दिन डिलीवर होते हैं।
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-1">Q. क्या मुझे फ्री डिलीवरी मिल सकती है? (Is delivery free?)</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      हाँ, सुरियावां में <strong>₹{STORE_INFO.freeDeliveryThreshold} से अधिक</strong> के सभी ऑर्डर्स पर होम डिलीवरी पूरी तरह मुफ्त (FREE) है।
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-1">Q. क्या मैं कैश ऑन डिलीवरी (COD) से भुगतान कर सकता हूँ? (Can I pay with COD?)</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      हाँ! आप सामान प्राप्त करने के बाद नकद (Cash on Delivery) या डिलीवरी बॉय के स्कैनर पर Google Pay, PhonePe, Paytm द्वारा भी भुगतान कर सकते हैं।
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-1">Q. क्या मैं फोन या व्हाट्सएप पर सामान मंगा सकता हूँ? (Can I order via Phone/WhatsApp?)</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      हाँ, आप सीधे <strong className="text-emerald-700">{STORE_INFO.phone1}</strong> पर कॉल या व्हाट्सएप संदेश भेजकर भी अपना किराना या पूजा सामान मंगा सकते हैं।
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-1">Q. क्या मसाले और पूजा सामग्री शुद्ध हैं? (Are products 100% pure?)</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      तेजस स्पाइसेस में हम गुणवत्ता से कोई समझौता नहीं करते। हमारे सभी खड़े मसाले, पिसे मसाले, असली भीमसेनी कपूर और अगरबत्ती शत-प्रतिशत शुद्ध एवं प्राकृतिक होते हैं।
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Actions Bar */}
            <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={onBackToHome}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wide px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Shopping (दुकान पर वापस जाएं)</span>
              </button>

              <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
                <span>Any questions? Call:</span>
                <a
                  href={`tel:${STORE_INFO.phone1}`}
                  className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-extrabold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{STORE_INFO.phone1}</span>
                </a>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
