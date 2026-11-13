import React from 'react';
import { X, Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { Product, CartItem } from '../types';
import { ProductVisual } from './ProductVisual';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistIds: string[];
  allProducts: Product[];
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onSelectProduct?: (product: Product) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  wishlistIds,
  allProducts,
  onToggleWishlist,
  onAddToCart,
  onSelectProduct,
}) => {
  if (!isOpen) return null;

  const wishlistProducts = allProducts.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Saved Wishlist ({wishlistProducts.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="p-5 max-h-[60vh] overflow-y-auto divide-y divide-slate-100">
            {wishlistProducts.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center text-3xl mx-auto">
                  ❤️
                </div>
                <h3 className="text-base font-bold text-slate-800">Your wishlist is empty</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Tap the heart icon on any spice or incense product to save it for later.
                </p>
                <button
                  onClick={onClose}
                  className="bg-emerald-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors cursor-pointer"
                >
                  Explore Products
                </button>
              </div>
            ) : (
              wishlistProducts.map((product) => (
                <div key={product.id} className="py-3 flex items-center gap-3">
                  <div
                    onClick={() => {
                      if (onSelectProduct) {
                        onSelectProduct(product);
                        onClose();
                      }
                    }}
                    className="w-16 h-16 bg-white rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center shrink-0 cursor-pointer"
                  >
                    <ProductVisual product={product} size="sm" priority={true} className="!border-0" />
                  </div>

                  <div
                    onClick={() => {
                      if (onSelectProduct) {
                        onSelectProduct(product);
                        onClose();
                      }
                    }}
                    className="flex-1 min-w-0 cursor-pointer group"
                  >
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                      {product.name}
                    </h4>
                    <div className="text-[10px] text-slate-400 mt-0.5">{product.category} · {product.unit}</div>
                    <div className="text-xs font-mono font-extrabold text-slate-900 mt-1">₹{product.price}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onAddToCart(product);
                        onToggleWishlist(product.id);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Move to Cart</span>
                    </button>
                    <button
                      onClick={() => onToggleWishlist(product.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg cursor-pointer transition-colors"
                      aria-label="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
