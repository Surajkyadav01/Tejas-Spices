import React from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  Heart, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Truck, 
  Award, 
  CheckCircle2, 
  ChevronRight 
} from 'lucide-react';
import { STORE_INFO } from '../data/mockData';
import { getAssetUrl } from '../utils/assetUrl';

interface AboutUsPageProps {
  onBackToHome: () => void;
  onExploreCatalog: () => void;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({
  onBackToHome,
  onExploreCatalog,
}) => {
  return (
    <div className="w-full min-h-screen bg-slate-50/70 pb-16">
      {/* Header / Breadcrumbs */}
      <div className="bg-white border-b border-slate-200">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2 font-medium">
                <button
                  onClick={onBackToHome}
                  className="hover:text-emerald-700 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Home</span>
                </button>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-emerald-700 font-bold">About Us</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={onBackToHome}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-emerald-200 transition-colors cursor-pointer group"
                >
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                  <span>Back to Store</span>
                </button>

                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  About Tejas Spices (हमारे बारे में)
                </h1>
              </div>
            </div>

            <button
              onClick={onExploreCatalog}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase px-5 py-2.5 rounded-xl transition-all shadow-xs self-start sm:self-auto cursor-pointer"
            >
              Explore Products
            </button>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 pt-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Hero Story Banner */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xs overflow-hidden relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full border border-emerald-200">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Purity, Heritage & Flavour</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  Bringing Fresh Authentic Aromas to Every Household in Suriyawan
                </h2>

                <p className="text-slate-600 text-sm leading-relaxed">
                  Welcome to <strong>Tejas Spices</strong>, your trusted neighbourhood provision store located in Suriyawan, Bhadohi (Uttar Pradesh). Founded and operated by <strong>{STORE_INFO.owners}</strong>, our store was established with a singular vision: to provide genuine, unadulterated whole spices, freshly stone-ground masalas, temple-grade royal agarbatti, and high-quality daily kitchen staples at honest local prices.
                </p>

                <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>100% Pure & Handpicked</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Local Doorstep Delivery</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Affordable Daily Kirana</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full max-w-sm rounded-2xl overflow-hidden border border-slate-200 shadow-md">
                  <img
                    src={getAssetUrl('assets/categories/spices_masala.jpg')}
                    alt="Authentic Indian Spices"
                    className="w-full h-56 object-cover object-center"
                    loading="lazy"
                  />
                  <div className="p-4 bg-emerald-900 text-white text-xs">
                    <div className="font-bold">Tejas Spices Store</div>
                    <div className="text-emerald-200 text-[11px] mt-0.5">{STORE_INFO.address}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-lg">
                🌿
              </div>
              <h3 className="font-bold text-slate-900 text-base">Unadulterated Whole Spices</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We personally source green cardamom, Ceylon cinnamon, black pepper, and Lakadong turmeric directly to ensure zero synthetic coloring and maximum natural essential oils.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-lg">
                🪔
              </div>
              <h3 className="font-bold text-slate-900 text-base">Pooja & Royal Fragrances</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                From pure Bhimseni camphor to desi cow ghee diya battis and authentic Chandan/Kesar flora agarbatti, our pooja supplies are crafted to invoke divine serenity.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-lg">
                🚚
              </div>
              <h3 className="font-bold text-slate-900 text-base">Community First Delivery</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We believe in serving our Suriyawan community with speed and warmth. Free express delivery on orders over ₹{STORE_INFO.freeDeliveryThreshold} delivered within 2-4 hours.
              </p>
            </div>
          </div>

          {/* Contact & Store Info */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-4">
            <h3 className="font-extrabold text-slate-900 text-lg">Visit Us or Get in Touch</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Store Address</span>
                <p className="font-medium text-slate-800">{STORE_INFO.address}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Helpline Phone</span>
                <p className="font-bold text-emerald-700">{STORE_INFO.phone1}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Email Contact</span>
                <p className="font-medium text-slate-800">{STORE_INFO.email}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Working Hours</span>
                <p className="font-medium text-slate-800">{STORE_INFO.workingHours}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
