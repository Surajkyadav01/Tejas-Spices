import React from 'react';
import { 
  IndianRupee, 
  RotateCcw, 
  Truck, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  Heart,
  Store
} from 'lucide-react';
import { STORE_INFO } from '../data/mockData';

interface FooterProps {
  onOpenWishlist: () => void;
  onOpenCart: () => void;
  onOpenTrackOrder: () => void;
  onOpenAuth: () => void;
  onSelectCategory: (category: string | null) => void;
  onSelectTab: (tab: string) => void;
  onOpenAdmin: () => void;
  onOpenPolicy?: (tab: 'shipping' | 'privacy' | 'terms' | 'refund' | 'faq') => void;
  onOpenAboutUs?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenWishlist,
  onOpenCart,
  onOpenTrackOrder,
  onOpenAuth,
  onSelectCategory,
  onSelectTab,
  onOpenAdmin,
  onOpenPolicy,
  onOpenAboutUs,
}) => {
  return (
    <footer className="border-t border-slate-200 bg-white">
      {/* 1. Value / Trust Badges matching Screenshot 7 */}
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8 border-b border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Badge 1 */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100/70 text-emerald-700 flex items-center justify-center shrink-0">
              <IndianRupee className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Best Prices & Deals</h4>
              <p className="text-xs text-slate-500 mt-0.5">Competitive prices on daily essentials</p>
            </div>
          </div>

          {/* Badge 2 */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100/70 text-emerald-700 flex items-center justify-center shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Easy Returns</h4>
              <p className="text-xs text-slate-500 mt-0.5">Hassle-free returns on eligible items</p>
            </div>
          </div>

          {/* Badge 3 */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100/70 text-emerald-700 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Local Delivery</h4>
              <p className="text-xs text-slate-500 mt-0.5">Free delivery over ₹{STORE_INFO.freeDeliveryThreshold} in Suriyawan</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Full 4-Column Footer matching Screenshot 7 */}
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          {/* Column 1: Brand Info (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/aistudio/image_585fccde.png"
                alt="Tejas Spices Official Logo"
                className="h-10 sm:h-11 w-auto object-contain drop-shadow-xs"
              />
              <div>
                <div className="text-lg font-black tracking-tight leading-tight flex items-center gap-1.5">
                  <span className="text-slate-900">Tejas</span>
                  <span className="text-red-600">Spices</span>
                </div>
                <div className="text-[11px] font-semibold text-emerald-600 tracking-wide uppercase leading-none mt-0.5">
                  Authentic Spices & Fragrances
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm">
              Your trusted destination for authentic Indian spices, royal agarbatti & pooja essentials in Suriyawan, Uttar Pradesh. Owned by {STORE_INFO.owners}.
            </p>

            <div className="space-y-2 text-xs text-slate-600 pt-1">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{STORE_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <a href={`tel:${STORE_INFO.phone1}`} className="hover:text-emerald-700 font-semibold">{STORE_INFO.phone1}</a>
                  {' '}|{' '}
                  <a href={`tel:${STORE_INFO.phone2}`} className="hover:text-emerald-700 font-semibold">{STORE_INFO.phone2}</a>
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                <a href={`mailto:${STORE_INFO.email}`} className="hover:text-emerald-700">
                  {STORE_INFO.email}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{STORE_INFO.workingHours}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Account (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-slate-900 tracking-tight">Account</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <button onClick={onOpenWishlist} className="hover:text-emerald-700 transition-colors cursor-pointer">
                  Wishlist
                </button>
              </li>
              <li>
                <button onClick={onOpenCart} className="hover:text-emerald-700 transition-colors cursor-pointer">
                  Cart
                </button>
              </li>
              <li>
                <button onClick={onOpenTrackOrder} className="hover:text-emerald-700 transition-colors cursor-pointer font-semibold text-emerald-700">
                  Track Order
                </button>
              </li>
              <li>
                <button onClick={onOpenAuth} className="hover:text-emerald-700 transition-colors cursor-pointer">
                  My Account
                </button>
              </li>
              <li>
                <button onClick={onOpenAdmin} className="hover:text-emerald-700 transition-colors cursor-pointer text-slate-500">
                  Store Admin Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Useful Links & Policies (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-slate-900 tracking-tight">Policies & Information</h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li>
                <button
                  onClick={() => onOpenPolicy ? onOpenPolicy('shipping') : onSelectTab('shipping-policy')}
                  className="hover:text-emerald-700 transition-colors cursor-pointer flex items-center gap-2 font-medium group text-left"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 group-hover:scale-125 transition-transform"></span>
                  <span>Shipping & Delivery Policy (शिपिंग नीति)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy ? onOpenPolicy('privacy') : onSelectTab('privacy-policy')}
                  className="hover:text-emerald-700 transition-colors cursor-pointer flex items-center gap-2 font-medium group text-left"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 group-hover:scale-125 transition-transform"></span>
                  <span>Privacy Policy (गोपनीयता नीति)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy ? onOpenPolicy('terms') : onSelectTab('terms-policy')}
                  className="hover:text-emerald-700 transition-colors cursor-pointer flex items-center gap-2 font-medium group text-left"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 group-hover:scale-125 transition-transform"></span>
                  <span>Ordering & Buying Terms (खरीद नियम)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy ? onOpenPolicy('refund') : onSelectTab('refund-policy')}
                  className="hover:text-emerald-700 transition-colors cursor-pointer flex items-center gap-2 font-medium group text-left"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 group-hover:scale-125 transition-transform"></span>
                  <span>Return & Refund Policy (रिफंड नीति)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenAboutUs ? onOpenAboutUs() : onSelectTab('about-us')}
                  className="hover:text-emerald-700 transition-colors cursor-pointer flex items-center gap-2 font-medium group text-left"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 group-hover:scale-125 transition-transform"></span>
                  <span>About Tejas Spices (हमारे बारे में)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Help Center (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-slate-900 tracking-tight">Help & Support</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <button
                  onClick={() => onOpenPolicy ? onOpenPolicy('faq') : onSelectTab('faq')}
                  className="hover:text-emerald-700 transition-colors cursor-pointer block text-left"
                >
                  Customer FAQ & Help
                </button>
              </li>
              <li>
                <a href={`tel:${STORE_INFO.phone1}`} className="hover:text-emerald-700 transition-colors cursor-pointer block font-semibold text-emerald-800">
                  Call: {STORE_INFO.phone1}
                </a>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy ? onOpenPolicy('shipping') : onSelectTab('shipping-policy')}
                  className="hover:text-emerald-700 transition-colors cursor-pointer block text-left"
                >
                  Free Shipping &gt; ₹{STORE_INFO.freeDeliveryThreshold}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory(null)}
                  className="hover:text-emerald-700 transition-colors cursor-pointer block text-left"
                >
                  Browse All Spices
                </button>
              </li>
            </ul>

            <div className="pt-2">
              <div className="text-[11px] font-semibold text-slate-500 mb-1.5">Accepted Payment Methods</div>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-slate-700 font-bold">UPI</span>
                <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-slate-700 font-bold">GPay</span>
                <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-slate-700 font-bold">PhonePe</span>
                <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-slate-700 font-bold">COD</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Copyright Bar matching original reference */}
      <div className="border-t border-slate-100 bg-slate-50/60 py-4 px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div>
            © 2026 Tejas Spices. All rights reserved.
          </div>
          <div className="text-slate-400">
            Suriyawan, Uttar Pradesh · Online Kirana & Authentic Spice Store
          </div>
        </div>
      </div>
    </footer>
  );
};
