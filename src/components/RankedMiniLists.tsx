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
  // 4 mutually exclusive distinct lists so NO product ever appears more than once across the 4 columns
  const usedIds = new Set<string>();

  const getUniqueItems = (targetIds: string[], count = 3): Product[] => {
    const list: Product[] = [];
    for (const id of targetIds) {
      const found = products.find((p) => p.id === id && !usedIds.has(p.id));
      if (found) {
        list.push(found);
        usedIds.add(found.id);
      }
    }
    // Fallback if needed to always guarantee 3 unique items
    if (list.length < count) {
      for (const p of products) {
        if (!usedIds.has(p.id)) {
          list.push(p);
          usedIds.add(p.id);
          if (list.length >= count) break;
        }
      }
    }
    return list;
  };

  // 1. Top Sells (High-volume essentials: Basmati Rice, Shahi Garam Masala, Royal Chandan Agarbatti)
  const topSells = getUniqueItems(['prod-1', 'prod-6', 'prod-11']);

  // 2. Top Rated (Customer favorites: Sona Masoori Rice, Green Cardamom, Kashmiri Mamra Badam)
  const topRated = getUniqueItems(['prod-2', 'prod-8', 'prod-16']);

  // 3. Trending Items (Popular daily staples: Kashmiri Lal Mirch Powder, Toor Dal, Black Pepper)
  const trending = getUniqueItems(['prod-5', 'prod-3', 'prod-10']);

  // 4. Recently Added (Fresh new arrivals: Moong Dal, Lakadong Turmeric, Ceylon Dalchini)
  const recentlyAdded = getUniqueItems(['prod-4', 'prod-7', 'prod-9']);

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
                    className="group flex items-center gap-3 p-2.5 rounded-2xl bg-white hover:bg-emerald-50/40 transition-all cursor-pointer border border-slate-200/80 hover:border-emerald-300 hover:shadow-xs"
                  >
                    {/* Small thumbnail visual - edge-to-edge crisp view */}
                    <div className="w-16 h-16 shrink-0 bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-2xs group-hover:scale-105 group-hover:border-emerald-400 transition-all flex items-center justify-center">
                      <ProductVisual product={product} size="sm" />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 pr-1">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-tight tracking-tight">
                        {product.name}
                      </h4>
                      {product.hindiName && (
                        <div className="text-[10px] text-emerald-800/90 font-medium truncate mt-0.5">
                          {product.hindiName}
                        </div>
                      )}
                      <div className="flex items-center justify-between gap-1 mt-1">
                        <span className="text-[10px] text-slate-400 font-medium truncate">
                          {product.unit}
                        </span>
                        <div className="flex items-baseline gap-1.5 shrink-0">
                          <span className="text-xs sm:text-sm font-extrabold text-slate-900 tabular-nums">
                            ₹{product.price}
                          </span>
                          <span className="text-[10px] text-slate-400 line-through tabular-nums">
                            ₹{product.originalPrice}
                          </span>
                        </div>
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
                          ? 'bg-emerald-600 text-white shadow-xs'
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
