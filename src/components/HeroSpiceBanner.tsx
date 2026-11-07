import React, { useState } from 'react';
import { Sparkles, ShieldCheck, Check, ArrowRight, Flame } from 'lucide-react';
import { STORE_INFO } from '../data/mockData';

interface HeroSpiceBannerProps {
  onShopNow: () => void;
}

export const HeroSpiceBanner: React.FC<HeroSpiceBannerProps> = ({ onShopNow }) => {
  const [imageError, setImageError] = useState(false);

  // High quality authentic Indian spices photography (local fast asset)
  const primarySpiceImageUrl = '/assets/hero_spices.jpg';

  return (
    <div className="relative w-full max-w-md lg:max-w-xl rounded-3xl bg-white shadow-2xl border-4 border-white/90 overflow-hidden group">
      {/* 1. Main Spice Image or Styled Fallback */}
      <div className="relative h-72 sm:h-84 lg:h-96 w-full overflow-hidden bg-gradient-to-br from-amber-900 via-amber-950 to-stone-900">
        {!imageError ? (
          <img
            src={primarySpiceImageUrl}
            alt="Authentic Indian Spices Assortment - Turmeric, Red Chili, Cardamom, Cinnamon"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          /* High fidelity vector/graphic fallback */
          <div className="w-full h-full p-6 flex flex-col justify-between bg-gradient-to-br from-amber-950 via-stone-900 to-red-950 text-white relative">
            <div className="flex justify-between items-start">
              <span className="bg-amber-500/90 text-stone-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                100% Pure Harvest
              </span>
              <span className="text-3xl">🌶️ 🌿 🪵</span>
            </div>

            <div className="my-auto text-center space-y-2">
              <span className="text-4xl block">✨ 🧂 🪔</span>
              <h3 className="text-xl font-black text-amber-200 uppercase tracking-wide">
                Tejas Heritage Spices
              </h3>
              <p className="text-xs text-amber-100/80 max-w-xs mx-auto">
                Khada Masala, Cold-Ground Kashmiri Chili, Lakadong Haldi & Shahi Garam Masala
              </p>
            </div>

            <div className="flex items-center justify-between text-xs text-amber-300 font-semibold border-t border-white/20 pt-2">
              <span>Authentic Pure Quality</span>
              <span>Direct From Farmers</span>
            </div>
          </div>
        )}

        {/* Soft gradient scrim on bottom of photo for legible overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-900/30 to-transparent pointer-events-none" />

        {/* Top-Left Floating Badge: 100% Pure Spices */}
        <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-1.5 bg-black/60 backdrop-blur-md text-amber-300 border border-amber-400/40 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>100% Pure & Asli Masale</span>
        </div>

        {/* Top-Right Discount Badge */}
        <div className="absolute top-3.5 right-3.5 z-10 bg-emerald-600 text-white font-black text-xs px-3 py-1.5 rounded-full shadow-lg border border-emerald-400/50 flex items-center gap-1">
          <Flame className="w-3.5 h-3.5 fill-white" />
          <span>Save up to 25%</span>
        </div>

        {/* Bottom Banner Content on top of image */}
        <div className="absolute bottom-2.5 sm:bottom-3 inset-x-2.5 sm:inset-x-3 z-10">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-2.5 sm:p-3.5 border border-white/80 shadow-lg flex items-center justify-between gap-2 sm:gap-3">
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center text-lg sm:text-xl shrink-0">
                🌶️
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-black text-slate-900 truncate">
                  Farm-Fresh Indian Spices & Fragrances
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-500 truncate">
                  Cold-milled · Zero artificial color · Aroma locked
                </div>
              </div>
            </div>

            <button
              onClick={onShopNow}
              className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer flex items-center gap-1 whitespace-nowrap"
            >
              <span>Explore</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
