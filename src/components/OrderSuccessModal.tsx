import React, { useEffect, useRef, useState } from 'react';
import { Check, MapPin, X } from 'lucide-react';
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

/**
 * Dynamic Confetti Canvas that shoots celebratory ribbons and sparkling stars
 * across the viewport upon order placement, smoothly cascades down, and
 * COMPLETELY DISAPPEARS after ~2.5 seconds so no particles linger on the screen.
 */
const ConfettiCanvas: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const colors = [
      '#10b981', // Emerald green
      '#059669', // Deep green
      '#3b82f6', // Royal blue
      '#ec4899', // Celebration pink
      '#f59e0b', // Gold yellow
      '#8b5cf6', // Bright purple
      '#ef4444', // Festive red
      '#14b8a6', // Teal
    ];

    const particlesCount = 75;
    const particles: Array<{
      x: number;
      y: number;
      w: number;
      h: number;
      color: string;
      vx: number;
      vy: number;
      angle: number;
      vAngle: number;
      shape: 'rect' | 'circle' | 'star';
      opacity: number;
    }> = [];

    // Burst from center-top of screen
    for (let i = 0; i < particlesCount; i++) {
      const angle = (Math.PI * 2 * i) / particlesCount + (Math.random() - 0.5) * 0.5;
      const speed = Math.random() * 8 + 4;
      particles.push({
        x: width / 2 + (Math.random() - 0.5) * 80,
        y: height * 0.32 + (Math.random() - 0.5) * 40,
        w: Math.random() * 8 + 5,
        h: Math.random() * 12 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - Math.random() * 5 - 3,
        angle: Math.random() * 360,
        vAngle: (Math.random() - 0.5) * 12,
        shape: Math.random() > 0.65 ? 'star' : Math.random() > 0.4 ? 'circle' : 'rect',
        opacity: 1,
      });
    }

    let animationId: number;
    const startTime = performance.now();
    const TOTAL_DURATION_MS = 2500; // Complete celebration duration 2.5 seconds

    const render = (time: number) => {
      const elapsed = time - startTime;
      ctx.clearRect(0, 0, width, height);

      // Once the duration is reached, clean canvas completely and unmount
      if (elapsed >= TOTAL_DURATION_MS) {
        ctx.clearRect(0, 0, width, height);
        setIsVisible(false);
        if (onComplete) onComplete();
        return;
      }

      // Smooth fade-out in the last 800ms
      const fadeProgress = elapsed > 1700 ? Math.max(0, 1 - (elapsed - 1700) / 800) : 1;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.26; // Gravity
        p.vx *= 0.985; // Subtle air friction
        p.angle += p.vAngle;

        const currentOpacity = p.opacity * fadeProgress;
        if (currentOpacity > 0.02 && p.y < height + 60) {
          ctx.save();
          ctx.globalAlpha = currentOpacity;
          ctx.translate(p.x, p.y);
          ctx.rotate((p.angle * Math.PI) / 180);
          ctx.fillStyle = p.color;

          if (p.shape === 'rect') {
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          } else if (p.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Celebration 5-point star
            ctx.beginPath();
            for (let s = 0; s < 5; s++) {
              ctx.lineTo(
                Math.cos(((18 + s * 72) * Math.PI) / 180) * p.w,
                -Math.sin(((18 + s * 72) * Math.PI) / 180) * p.w
              );
              ctx.lineTo(
                Math.cos(((54 + s * 72) * Math.PI) / 180) * (p.w / 2),
                -Math.sin(((54 + s * 72) * Math.PI) / 180) * (p.w / 2)
              );
            }
            ctx.closePath();
            ctx.fill();
          }

          ctx.restore();
        }
      });

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      if (canvas) {
        const c = canvas.getContext('2d');
        if (c) c.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-60 w-full h-full"
    />
  );
};

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  isOpen,
  order,
  onClose,
  onBackToHome,
  onTrackOrder,
}) => {
  const [showConfetti, setShowConfetti] = useState(false);

  // Trigger celebration shower and sound strictly once when order modal opens
  useEffect(() => {
    if (isOpen && order) {
      playOrderSuccessSound();
      setShowConfetti(true);
    } else {
      setShowConfetti(false);
    }
  }, [isOpen, order?.orderId]);

  if (!isOpen || !order) return null;

  const firstItem = order.items[0]?.product;
  const itemsCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* 1. Dynamic Confetti Canvas Burst - Automatically disappears after ~2.5s */}
      {showConfetti && (
        <ConfettiCanvas
          key={order.orderId}
          onComplete={() => setShowConfetti(false)}
        />
      )}

      {/* 2. Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* 3. Main Modal Card matching Attachment 2 (image_df51a48e.png) */}
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
          {/* Subtle pulsating celebration glow ring */}
          <span className="absolute w-28 h-28 rounded-full bg-emerald-400/20 animate-ping pointer-events-none" />

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

        {/* 4. Action Buttons matching Attachment 2 */}
        <div className="space-y-3 mt-6">
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
