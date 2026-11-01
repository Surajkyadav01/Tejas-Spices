import React from 'react';
import { X, ShieldCheck, CheckCircle2, Sparkles, Award, HeartHandshake } from 'lucide-react';
import { STORE_INFO } from '../data/mockData';

interface QualityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QualityModal: React.FC<QualityModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
          <div className="p-6 bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-xl">
                🌿
              </div>
              <div>
                <h2 className="text-lg font-bold">100% Pure & Certified Quality</h2>
                <p className="text-xs text-emerald-200">The Tejas Spices Purity Commitment</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-5 text-xs text-slate-600 leading-relaxed">
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Cold Milled Spices</h3>
                  <p className="text-slate-600 mt-0.5">
                    Traditional heavy stone milling heats ground spices above 70°C, burning out essential volatile aromas. Our spices are ground slowly at low temperatures to lock in original pungent fragrance and essential oils.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">100% Charcoal-Free Incense</h3>
                  <p className="text-slate-600 mt-0.5">
                    Commercial incense relies on toxic black coal powder. Tejas Spices agarbatti uses pure Mysore sandalwood powder, tree gums, and Vedic cow dung bases for soothing clean fragrance.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Unpolished Desi Grains & Dals</h3>
                  <p className="text-slate-600 mt-0.5">
                    No water, chemical, or marble powder polishing. We deliver 100% raw, nutrient-rich pulses and traditional aged basmati directly to your kitchen.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 text-center">
              <p className="text-slate-500 text-[11px]">
                Personally guaranteed by store founders <strong>{STORE_INFO.owners}</strong>. Visit us at {STORE_INFO.address}.
              </p>
              <button
                onClick={onClose}
                className="mt-3 bg-emerald-600 text-white font-bold px-6 py-2 rounded-xl hover:bg-emerald-700 transition-colors"
              >
                Close & Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
