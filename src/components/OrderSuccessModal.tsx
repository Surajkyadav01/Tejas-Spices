import React, { useEffect, useState } from 'react';
import { Check, MapPin, Volume2, Sparkles, X } from 'lucide-react';
import { Order } from '../types';

interface OrderSuccessModalProps {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
  onBackToHome: () => void;
  onTrackOrder: () => void;
}

/**
 * Synthesizes a crisp, uplifting 4-note celebration chime (C5 -> E5 -> G5 -> C6)
 * using the Web Audio API. Zero external audio file requests, works reliably on
 * mobile, desktop, and GitHub Pages without 404 or CORS issues.
 */
export function playOrderSuccessSound(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    // Harmonic 4-note celebration sequence (Flipkart / Amazon style pleasant chime)
    const notes = [
      { freq: 523.25, time: 0.00, dur: 0.22, vol: 0.26 }, // C5
      { freq: 659.25, time: 0.09, dur: 0.25, vol: 0.28 }, // E5
      { freq: 783.99, time: 0.18, dur: 0.32, vol: 0.32 }, // G5
      { freq: 1046.50, time: 0.28, dur: 0.70, vol: 0.36 }, // C6 (High bell resonance)
    ];

    notes.forEach(({ freq, time, dur, vol }) => {
      // Primary chime tone (warm sine wave)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + time);

      // Bell envelope (quick attack, natural smooth decay)
      gain.gain.setValueAtTime(0.001, now + time);
      gain.gain.exponentialRampToValueAtTime(vol, now + time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + time + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + time);
      osc.stop(now + time + dur + 0.05);

      // Subtle bell shimmer overtone
      const overtone = ctx.createOscillator();
      const otGain = ctx.createGain();
      overtone.type = 'triangle';
      overtone.frequency.setValueAtTime(freq * 2, now + time);
      otGain.gain.setValueAtTime(0.0005, now + time);
      otGain.gain.exponentialRampToValueAtTime(vol * 0.18, now + time + 0.02);
      otGain.gain.exponentialRampToValueAtTime(0.0001, now + time + dur * 0.65);

      overtone.connect(otGain);
      otGain.connect(ctx.destination);

      overtone.start(now + time);
      overtone.stop(now + time + dur);
    });
  } catch (err) {
    console.warn('AudioContext not allowed without prior user interaction', err);
  }
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  isOpen,
  order,
  onClose,
  onBackToHome,
  onTrackOrder,
}) => {
  const [audioPlayed, setAudioPlayed] = useState(false);

  useEffect(() => {
    if (isOpen && order) {
      setAudioPlayed(true);
      // Play uplifting celebratory chime
      playOrderSuccessSound();
    } else {
      setAudioPlayed(false);
    }
  }, [isOpen, order?.orderId]);

  if (!isOpen || !order) return null;

  const firstItem = order.items[0]?.product;
  const itemsCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Main Card Modal matching Attachment 2 (image_df51a48e.png) */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 overflow-hidden z-10 transition-all animate-in zoom-in-95 duration-300">
        
        {/* Subtle Close 'X' in top-right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. Celebratory Graphic Badge matching Attachment 2 */}
        <div className="relative flex items-center justify-center pt-2 pb-1">
          {/* Outer glowing mint disc */}
          <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-[#dcfce7] flex items-center justify-center border-6 border-[#bbf7d0]/60 shadow-inner">
            
            {/* Center bold vibrant green disc */}
            <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-[#10b981] flex items-center justify-center text-white shadow-lg ring-4 ring-white/80">
              <Check className="w-11 h-11 sm:w-12 sm:h-12 stroke-[3.5]" />
            </div>

            {/* Orbiting Colorful Confetti & Stars matching Attachment 2 */}
            {/* Top blue pill */}
            <span className="absolute top-3 left-12 w-2.5 h-6 rounded-full bg-[#2563eb] -rotate-45 shadow-2xs" />
            
            {/* Top green dot */}
            <span className="absolute top-1 right-16 w-3.5 h-3.5 rounded-full bg-[#10b981]" />

            {/* Top-right pink arc */}
            <span className="absolute top-2 right-5 text-xl font-black text-[#ec4899] rotate-45 select-none">
              (
            </span>

            {/* Right yellow star */}
            <span className="absolute top-12 right-2 text-amber-400 text-lg select-none">
              ★
            </span>

            {/* Bottom-right pink curve */}
            <span className="absolute bottom-6 right-5 text-2xl font-black text-[#ec4899] rotate-12 select-none">
              )
            </span>

            {/* Bottom blue capsule */}
            <span className="absolute bottom-2 right-12 w-2.5 h-5 rounded-full bg-[#2563eb] -rotate-25 shadow-2xs" />

            {/* Bottom-left green arc */}
            <span className="absolute bottom-3 left-10 text-xl font-black text-[#10b981] rotate-90 select-none">
              (
            </span>

            {/* Left yellow star */}
            <span className="absolute bottom-10 left-3 text-amber-400 text-xl select-none">
              ★
            </span>

            {/* Left pink dot */}
            <span className="absolute top-14 left-4 w-3.5 h-3.5 rounded-full bg-[#ec4899]" />

            {/* Left green rectangle */}
            <span className="absolute top-8 left-3 w-4 h-2 rounded-sm bg-[#10b981] rotate-12" />

            {/* Top-left blue star */}
            <span className="absolute top-5 left-8 text-blue-500 text-sm select-none">
              ★
            </span>
          </div>
        </div>

        {/* 2. Headline & Subtitle matching Attachment 2 */}
        <div className="text-center space-y-2 mt-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
            Order Placed Successfully!
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-xs mx-auto leading-relaxed font-normal">
            Your order is on the way and will be delivered shortly.
          </p>
        </div>

        {/* 3. Compact Order Summary Card */}
        <div className="mt-5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 text-xs space-y-2">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/70">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
              Order ID
            </span>
            <span className="font-mono font-black text-slate-900 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
              #{order.orderId}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-700">
            <span>Total Items:</span>
            <span className="font-semibold text-slate-900">
              {itemsCount} {itemsCount > 1 ? 'items' : 'item'} {firstItem ? `(${firstItem.name})` : ''}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-700">
            <span>Payment Method:</span>
            <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
              {order.paymentMethod === 'COD' ? 'Cash on Delivery (नकद)' : 'Instant UPI'}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-700">
            <span>Amount to Pay:</span>
            <span className="font-mono font-black text-sm text-slate-900">
              ₹{order.total}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-500 text-[11px] pt-1 border-t border-slate-200/60">
            <span>Delivery Location:</span>
            <span className="font-medium text-slate-800 truncate max-w-[170px]">
              {order.customer.address}, {order.customer.city}
            </span>
          </div>
        </div>

        {/* Sound replay button */}
        <div className="mt-2 text-center">
          <button
            type="button"
            onClick={playOrderSuccessSound}
            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 hover:text-emerald-900 hover:underline cursor-pointer py-1"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Replay Chime / साउंड दोबारा सुनें</span>
          </button>
        </div>

        {/* 4. Action Buttons matching Attachment 2 */}
        <div className="space-y-3 mt-4 pt-1">
          {/* Button 1: Back to Home (Solid Green) */}
          <button
            type="button"
            onClick={onBackToHome}
            className="w-full bg-[#059669] hover:bg-[#047857] active:bg-[#065f46] text-white font-extrabold py-3.5 px-6 rounded-2xl text-base shadow-md transition-all cursor-pointer text-center flex items-center justify-center"
          >
            Back to Home
          </button>

          {/* Button 2: Track Order (Outline Green with Pin icon) */}
          <button
            type="button"
            onClick={onTrackOrder}
            className="w-full bg-white hover:bg-emerald-50 active:bg-emerald-100 border-2 border-[#059669] text-[#059669] font-extrabold py-3.5 px-6 rounded-2xl text-base transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <MapPin className="w-5 h-5 text-[#059669]" />
            <span>Track Order</span>
          </button>
        </div>
      </div>
    </div>
  );
};
