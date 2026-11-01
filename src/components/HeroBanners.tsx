import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Sparkles, ShieldCheck, Truck, Percent } from 'lucide-react';
import { STORE_INFO } from '../data/mockData';
import { HeroSpiceBanner } from './HeroSpiceBanner';

interface HeroBannersProps {
  onShopNow: () => void;
  onOpenQualityModal: () => void;
  onApplyPromoCode?: (code: string) => void;
}

export const HeroBanners: React.FC<HeroBannersProps> = ({
  onShopNow,
  onOpenQualityModal,
  onApplyPromoCode,
}) => {
  const [email, setEmail] = useState('');
  const [registered, setRegistered] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setRegistered(true);
      if (onApplyPromoCode) {
        onApplyPromoCode('TEJAS10');
      }
    }
  };

  return (
    <div className="w-full">
      {/* 1. Main Hero Full-Bleed Section matching Screenshot 1 */}
      <div className="w-full bg-[#edf8f0] border-b border-emerald-100/60 py-10 sm:py-12 lg:py-16 px-4 sm:px-8 lg:px-12 xl:px-16 relative overflow-hidden">
        {/* Decorative soft glowing circles */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-yellow-200/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text & Newsletter Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                Don't miss our daily <br className="hidden sm:inline" />
                <span className="text-emerald-600">authentic spice deals.</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 max-w-xl font-normal leading-relaxed">
                Your trusted neighbourhood store in Suriyawan. Rice, dals, spices, royal agarbatti & daily essentials at the best prices.
              </p>
            </div>

            {/* Newsletter Input Box matching reference */}
            <form onSubmit={handleRegister} className="max-w-md">
              {!registered ? (
                <div className="flex flex-col sm:flex-row items-stretch gap-2 bg-white/90 p-1.5 rounded-2xl shadow-sm border border-emerald-200/80 backdrop-blur-xs">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 px-4 py-3 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden bg-transparent"
                  />
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm tracking-wide px-7 py-3 rounded-xl transition-all shadow-xs shrink-0 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    Register
                  </button>
                </div>
              ) : (
                <div className="bg-emerald-100/90 border border-emerald-300 text-emerald-900 p-4 rounded-2xl flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                  <div className="text-xs sm:text-sm">
                    <span className="font-bold">Welcome to Tejas Spices!</span> Use coupon code{' '}
                    <span className="bg-emerald-800 text-white font-mono font-bold px-2 py-0.5 rounded text-xs">
                      TEJAS10
                    </span>{' '}
                    at checkout for 10% instant discount.
                  </div>
                </div>
              )}
            </form>

            {/* Micro Trust Pills */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-700 pt-2">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 100% Farm-Pure & Cold-Milled
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Chemical-Free Incense
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 2-Hour Doorstep Delivery
              </span>
            </div>
          </div>

          {/* Right Spice Showcase Banner matching user request */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <HeroSpiceBanner onShopNow={onShopNow} />
          </div>
        </div>
      </div>

      {/* 2. Dual Promo Cards matching Screenshot 3 */}
      <div className="w-full bg-white py-6 sm:py-8 px-4 sm:px-8 lg:px-12 xl:px-16 border-b border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: Free Delivery over ₹299 */}
        <div className="rounded-2xl bg-[#fff7ea] border border-amber-200/70 p-6 sm:p-7 relative overflow-hidden transition-all hover:shadow-md group">
          <div className="space-y-3 max-w-sm">
            <span className="inline-block bg-[#fedc97] text-amber-900 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
              Free delivery
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
              Free delivery over ₹{STORE_INFO.freeDeliveryThreshold}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              Shop ₹{STORE_INFO.freeDeliveryThreshold}+ and get free doorstep delivery in Suriyawan.
            </p>
            <button
              onClick={onShopNow}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-800 group-hover:gap-2.5 transition-all cursor-pointer pt-1"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="absolute right-4 bottom-4 w-20 h-20 rounded-full bg-amber-200/40 flex items-center justify-center text-4xl pointer-events-none">
            🚚
          </div>
        </div>

        {/* Card 2: Trusted Kirana & Spice Quality */}
        <div className="rounded-2xl bg-[#eefaf4] border border-emerald-200/70 p-6 sm:p-7 relative overflow-hidden transition-all hover:shadow-md group">
          <div className="space-y-3 max-w-sm">
            <span className="inline-block bg-[#bbf7d0] text-emerald-900 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
              Quality
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
              Trusted Spice & Kirana Quality
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              Fresh stock of pure spices, chemical-free agarbatti & essentials from Tejas Spices.
            </p>
            <button
              onClick={onOpenQualityModal}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-800 group-hover:gap-2.5 transition-all cursor-pointer pt-1"
            >
              <span>Learn more</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="absolute right-4 bottom-4 w-20 h-20 rounded-full bg-emerald-200/40 flex items-center justify-center text-4xl pointer-events-none">
            🌿
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
