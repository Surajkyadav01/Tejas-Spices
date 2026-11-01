import React, { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import { CategoryBadgeVisual } from './CategoryBadgeVisual';

interface CategoriesSliderProps {
  activeCategory: string | null;
  onSelectCategory: (categorySlug: string | null) => void;
}

interface SliderItem {
  id: string;
  name: string;
  slug: string;
  itemCountText: string;
  imageVisual: string;
  imageUrl?: string;
}

export const CategoriesSlider: React.FC<CategoriesSliderProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  // Categories list without "All Items" (as requested by user)
  const categoryItems: SliderItem[] = CATEGORIES.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    itemCountText: `${cat.itemCount} Items`,
    imageVisual: cat.imageVisual,
    imageUrl: cat.imageUrl,
  }));

  // Quadruple items to guarantee seamless infinite looping across all screen sizes
  const displayItems = [
    ...categoryItems,
    ...categoryItems,
    ...categoryItems,
    ...categoryItems,
  ];

  // Medium, clear, readable speed (35px/s) auto-sliding animation
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();
    const speed = 35; // Medium, readable, smooth speed

    const step = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (!isDraggingRef.current && scrollRef.current) {
        const container = scrollRef.current;
        const singleSetWidth = container.scrollWidth / 4;

        if (singleSetWidth > 0) {
          container.scrollLeft += speed * delta;
          // When 1 full cycle has passed, seamlessly reset by subtracting one cycle width
          if (container.scrollLeft >= singleSetWidth) {
            container.scrollLeft -= singleSetWidth;
          }
        }
      }

      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Handle manual arrow scroll
  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const singleSetWidth = container.scrollWidth / 4;
      const offset = direction === 'left' ? -280 : 280;

      if (singleSetWidth > 0) {
        if (direction === 'left' && container.scrollLeft < 280) {
          container.scrollLeft += singleSetWidth;
        } else if (direction === 'right' && container.scrollLeft >= singleSetWidth) {
          container.scrollLeft -= singleSetWidth;
        }
      }

      container.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full bg-white px-4 sm:px-8 lg:px-12 xl:px-16 py-6 border-b border-slate-100 select-none overflow-hidden">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Explore Categories
        </h2>

        {/* Carousel Navigation Arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleScroll('left')}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-slate-200 hover:border-emerald-500 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95"
            aria-label="Previous categories"
            title="Previous categories"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-slate-200 hover:border-emerald-500 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95"
            aria-label="Next categories"
            title="Next categories"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel with Smooth Medium-Speed Sliding */}
      <div
        ref={scrollRef}
        onMouseDown={() => {
          isDraggingRef.current = true;
        }}
        onMouseUp={() => {
          isDraggingRef.current = false;
        }}
        onTouchStart={() => {
          isDraggingRef.current = true;
        }}
        onTouchEnd={() => {
          isDraggingRef.current = false;
        }}
        className="flex items-stretch gap-3.5 sm:gap-4 overflow-x-auto pb-3 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {displayItems.map((item, index) => {
          const isActive = activeCategory === item.slug;

          return (
            <button
              key={`${item.id}-${index}`}
              onClick={() => onSelectCategory(item.slug)}
              className={`group shrink-0 w-28 sm:w-36 rounded-2xl p-3.5 flex flex-col items-center justify-between text-center transition-all duration-200 cursor-pointer border ${
                isActive
                  ? 'bg-emerald-50/90 border-emerald-500 shadow-sm ring-2 ring-emerald-500/20'
                  : 'bg-white border-slate-200/90 hover:border-emerald-400 hover:shadow-md'
              }`}
            >
              <div className="mb-2.5">
                <CategoryBadgeVisual
                  imageVisual={item.imageVisual}
                  name={item.name}
                  imageUrl={item.imageUrl}
                />
              </div>

              <div className="w-full">
                <span
                  className={`block text-xs sm:text-[13px] font-bold leading-tight line-clamp-2 transition-colors ${
                    isActive
                      ? 'text-emerald-800'
                      : 'text-slate-800 group-hover:text-emerald-700'
                  }`}
                >
                  {item.name}
                </span>
                <span className="block text-[10px] text-slate-400 font-medium mt-1 font-mono">
                  {item.itemCountText}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
