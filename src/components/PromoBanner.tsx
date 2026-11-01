import React from 'react';
import { Globe, ArrowRight, Smartphone, Sparkles, CheckCircle2 } from 'lucide-react';
import { STORE_INFO } from '../data/mockData';

interface PromoBannerProps {
  onExploreCatalog: () => void;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({ onExploreCatalog }) => {
  return (
    <section className="w-full bg-[#edf8f0] border-t border-emerald-100/60 py-12 px-4 sm:px-8 lg:px-12 xl:px-16 relative overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-5">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Shop Faster With <br />
              <span className="text-emerald-700">Tejas Spices Online</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-lg leading-relaxed">
              Order whole spices, freshly milled powders, temple-grade agarbatti and daily essentials online from your neighbourhood store in Suriyawan. Enjoy fast delivery with no minimum order constraints.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onExploreCatalog}
                className="inline-flex items-center gap-2.5 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer group"
              >
                <Globe className="w-4 h-4 text-emerald-400" />
                <div className="text-left">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Continue shopping on</div>
                  <div className="text-xs font-extrabold tracking-wide">Our Online Store</div>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform ml-1" />
              </button>

              <div className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Call & WhatsApp Ordering: <strong className="text-slate-900">{STORE_INFO.phone1}</strong></span>
              </div>
            </div>
          </div>

          {/* Right visual mockup frames matching Screenshot 6 */}
          <div className="lg:col-span-5 flex items-center justify-center gap-4">
            {/* Phone Card Mockup 1 */}
            <div className="w-36 sm:w-44 h-64 sm:h-72 rounded-3xl bg-slate-900 p-2 shadow-2xl border-4 border-slate-800 -rotate-3 transition-transform hover:rotate-0 duration-300">
              <div className="w-full h-full rounded-2xl bg-gradient-to-b from-emerald-800 via-teal-900 to-slate-900 p-3 text-white flex flex-col justify-between overflow-hidden relative">
                <div className="text-center pt-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 mx-auto flex items-center justify-center font-bold text-xs mb-1">
                    T
                  </div>
                  <div className="text-[11px] font-black uppercase">Tejas Spices</div>
                  <div className="text-[8px] text-emerald-300">Instant Delivery App</div>
                </div>

                <div className="space-y-1.5 my-auto">
                  <div className="bg-white/10 backdrop-blur-xs p-1.5 rounded-lg text-[9px] flex items-center justify-between">
                    <span>🌶️ Kashmiri Mirch</span>
                    <span className="font-bold text-amber-300">₹88</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-xs p-1.5 rounded-lg text-[9px] flex items-center justify-between">
                    <span>🪔 Chandan Agarbatti</span>
                    <span className="font-bold text-amber-300">₹145</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-xs p-1.5 rounded-lg text-[9px] flex items-center justify-between">
                    <span>🌾 Royal Basmati</span>
                    <span className="font-bold text-amber-300">₹120</span>
                  </div>
                </div>

                <div className="w-full bg-emerald-500 text-stone-950 font-bold text-[9px] py-1 rounded text-center">
                  Order Now (Suriyawan)
                </div>
              </div>
            </div>

            {/* Phone Card Mockup 2 */}
            <div className="w-36 sm:w-44 h-64 sm:h-72 rounded-3xl bg-white p-2 shadow-2xl border-4 border-slate-200 rotate-3 transition-transform hover:rotate-0 duration-300 hidden sm:block">
              <div className="w-full h-full rounded-2xl bg-gradient-to-b from-amber-50 to-emerald-50 p-3 text-slate-800 flex flex-col justify-between overflow-hidden">
                <div className="text-center pt-2">
                  <span className="text-2xl">📦</span>
                  <div className="text-[11px] font-black text-slate-900 mt-1">Order #TS-94821</div>
                  <div className="text-[9px] text-emerald-700 font-bold">Out for Delivery</div>
                </div>

                <div className="text-[9px] text-center space-y-1 bg-white p-2 rounded-xl shadow-xs border border-emerald-100">
                  <div className="text-slate-500">Estimated Arrival:</div>
                  <div className="text-emerald-700 font-extrabold text-xs">25 Minutes</div>
                  <div className="text-[8px] text-slate-400">Rider: Rameshwar (+91 94502...)</div>
                </div>

                <div className="w-full bg-slate-900 text-white font-bold text-[9px] py-1 rounded text-center">
                  Track Live
                </div>
              </div>
            </div>
        </div>
      </div>
    </section>
  );
};
