import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';
import { STORE_INFO } from '../data/mockData';
import { useLanguage } from '../utils/i18n';
import { ProductVisual } from './ProductVisual';

interface MobileStickyCartBarProps {
  cart: CartItem[];
  appliedCoupon: string | null;
  onOpenCart: () => void;
  hidden?: boolean;
}

export const MobileStickyCartBar: React.FC<MobileStickyCartBarProps> = ({
  cart,
  appliedCoupon,
  onOpenCart,
  hidden = false,
}) => {
  const { t } = useLanguage();

  if (hidden || cart.length === 0) return null;

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => {
    const unitPrice = item.selectedVariant?.price ?? item.product.price;
    return sum + unitPrice * item.quantity;
  }, 0);
  const discount = appliedCoupon ? Math.round(subtotal * 0.1) : 0;
  const netSubtotal = Math.max(0, subtotal - discount);
  const firstProduct = cart[0].product;
  const remainingForFree = Math.max(0, STORE_INFO.freeDeliveryThreshold - subtotal);

  return (
    <div className="fixed bottom-3 left-3 right-3 z-40 md:hidden animate-in slide-in-from-bottom-4 duration-300">
      <button
        type="button"
        onClick={onOpenCart}
        className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white rounded-2xl p-2.5 pl-3 shadow-xl shadow-emerald-950/25 border border-emerald-400/40 flex items-center justify-between gap-2.5 transition-all cursor-pointer"
      >
        {/* Left: Packet thumbnail + Items & Price */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-white p-0.5 shrink-0 overflow-hidden shadow-2xs flex items-center justify-center">
            <ProductVisual product={firstProduct} size="sm" priority={true} className="!w-full !h-full !border-0" />
          </div>

          <div className="text-left min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-extrabold tracking-tight leading-tight">
              <span>
                {totalItems} {totalItems === 1 ? t('Item', 'आइटम') : t('Items', 'आइटम्स')}
              </span>
              <span className="text-emerald-200">·</span>
              <span className="font-mono text-sm font-black">₹{netSubtotal}</span>
            </div>
            <div className="text-[10px] text-emerald-100 font-medium truncate mt-0.5">
              {remainingForFree === 0
                ? t('🎉 Free Delivery Unlocked!', '🎉 मुफ़्त डिलीवरी उपलब्ध!')
                : t(
                    `Add ₹${remainingForFree} more for Free Delivery`,
                    `मुफ़्त डिलीवरी के लिए ₹${remainingForFree} और जोड़ें`
                  )}
            </div>
          </div>
        </div>

        {/* Right: View Cart Pill */}
        <div className="bg-white text-emerald-700 font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shrink-0 shadow-xs">
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>{t('View Cart', 'कार्ट देखें')}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </button>
    </div>
  );
};
