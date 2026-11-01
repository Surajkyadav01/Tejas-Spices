import React from 'react';
import { Plus, Check, Star } from 'lucide-react';
import { Product, CartItem } from '../types';
import { ProductVisual } from './ProductVisual';
import { ScrollReveal } from './ScrollReveal';

interface RankedMiniListsProps {
  products: Product[];
  cart: CartItem[];
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const RankedMiniLists: React.FC<RankedMiniListsProps> = ({
  products,
  cart,
  onAddToCart,
  onSelectProduct,
}) => {
  // 4 lists
  const topSells = products.filter((p) => p.isTopSell).slice(0, 3);
  const topRated = products.filter((p) => p.isTopRated).slice(0, 3);
  const trending = products.filter((p) => p.isTrending).slice(0, 3);
  const recentlyAdded = products.filter((p) => p.isNew || p.badge?.includes('Curcumin') || p.id === 'prod-19' || p.id === 'prod-20').slice(0, 3);

  const columns = [
    { title: 'Top Sells', items: topSells },
    { title: 'Top Rated', items: topRated },
    { title: 'Trending Items', items: trending },
    { title: 'Recently Added', items: recentlyAdded },
  ];

  return (
    <section className="w-full bg-white px-4 sm:px-8 lg:px-12 xl:px-16 py-8 border-t border-slate-100">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((col, idx) => (
          <ScrollReveal
            key={idx}
            animation="fade-up"
            delay={idx * 75}
            duration={500}
            className="space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                {col.title}
              </h3>
            </div>


            <div className="space-y-3">
              {col.items.map((product) => {
                const inCart = cart.some((item) => item.product.id === product.id);

                return (
                  <div
                    key={product.id}
                    onClick={() => onSelectProduct(product)}
                    className="group flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                  >
                    {/* Small thumbnail visual */}
                    <div className="w-16 h-16 shrink-0 bg-white rounded-lg border border-slate-200/80 p-1 flex items-center justify-center overflow-hidden shadow-2xs">
                      <ProductVisual product={product} size="sm" />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors truncate tracking-tight">
                        {product.name}
                      </h4>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {product.unit}
                      </div>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-sm font-bold text-slate-900 tabular-nums tracking-tight">
                          ₹{product.price}
                        </span>
                        <span className="text-xs text-slate-400 line-through tabular-nums">
                          ₹{product.originalPrice}
                        </span>
                      </div>
                    </div>

                    {/* Quick Add Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(product);
                      }}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                        inCart
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 group-hover:bg-emerald-600 group-hover:text-white text-slate-600'
                      }`}
                      title={inCart ? 'In cart' : 'Add to cart'}
                      aria-label="Add to cart"
                    >
                      {inCart ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};
