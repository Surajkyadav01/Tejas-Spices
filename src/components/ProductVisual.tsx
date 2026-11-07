import React, { useState, useMemo, useEffect } from 'react';
import { Product } from '../types';
import { getAssetUrl, getAssetUrlVariants } from '../utils/assetUrl';

interface ProductVisualProps {
  product: Product;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  priority?: boolean;
}

// Curated high-resolution verified authentic photography mapping for each product
// Uses relative clean asset paths for GitHub Pages, local dev and production compatibility
export const PRODUCT_REAL_IMAGES: Record<string, string> = {
  // prod-1: Basmati Rice Premium (raw grains)
  'prod-1': 'assets/products/basmati_rice.jpg',
  // prod-2: Sona Masoori Rice (raw grain rice container)
  'prod-2': 'assets/products/sona_masoori.jpg',
  // prod-3: Toor Dal (Unpolished Arhar split yellow grains)
  'prod-3': 'assets/products/toor_dal.jpg',
  // prod-4: Moong Dal (Dhuli Yellow Split lentils)
  'prod-4': 'assets/products/moong_dal.jpg',
  // prod-5: Kashmiri Lal Mirch Powder (pure vibrant red chili powder)
  'prod-5': 'assets/products/kashmiri_mirch.jpg',
  // prod-6: Shahi Garam Masala
  'prod-6': 'assets/products/garam_masala.jpg',
  // prod-7: Lakadong Turmeric Powder (pure golden haldi in bowl)
  'prod-7': 'assets/products/haldi_turmeric.jpg',
  // prod-8: Green Cardamom (Chhoti Elaichi bold pods)
  'prod-8': 'assets/products/elaichi.jpg',
  // prod-9: Ceylon Dalchini Sticks (cinnamon quills)
  'prod-9': 'assets/products/dalchini.jpg',
  // prod-10: Black Pepper (Sabut Kali Mirch on leaf)
  'prod-10': 'assets/products/kali_mirch.jpg',
  // prod-11: Royal Chandan Agarbatti
  'prod-11': 'assets/products/agarbatti.jpg',
  // prod-12: Kesar Kasturi Agarbatti
  'prod-12': 'assets/products/agarbatti.jpg',
  // prod-13: Herbal Guggul Dhoop Cups
  'prod-13': 'assets/products/dhoop.jpg',
  // prod-14: Pure Bhimseni Kapoor
  'prod-14': 'assets/products/pooja_samagri.jpg',
  // prod-15: Pure Desi Cow Ghee Diya Batti
  'prod-15': 'assets/products/pooja_samagri.jpg',
  // prod-16: Kashmiri Mamra Badam (Almonds)
  'prod-16': 'assets/products/badam.jpg',
  // prod-17: Royal Cashews (Kaju)
  'prod-17': 'assets/products/kaju.jpg',
  // prod-18: Mustard Oil (Kachi Ghani)
  'prod-18': 'assets/products/mustard_oil.jpg',
  // prod-19: Coriander Powder (Dhania)
  'prod-19': 'assets/products/dhania_powder.jpg',
  // prod-20: Masoor Dal (Split Red Lentils)
  'prod-20': 'assets/products/masoor_dal.jpg',
  // prod-21: Bikaneri Bhujia & Namkeen
  'prod-21': 'assets/products/namkeen.jpg',
  // prod-22: Royal Assam Kadak Chai
  'prod-22': 'assets/products/assam_tea.jpg',
};

// Category fallback image resolver
const getCategoryFallbackImage = (category: string, name: string): string => {
  const lowerName = name.toLowerCase();
  const lowerCat = category.toLowerCase();

  if (lowerName.includes('rice') || lowerName.includes('basmati')) {
    return 'assets/products/basmati_rice.jpg';
  }
  if (lowerName.includes('moong')) {
    return 'assets/products/moong_dal.jpg';
  }
  if (lowerName.includes('toor') || lowerName.includes('arhar') || lowerName.includes('dal')) {
    return 'assets/products/toor_dal.jpg';
  }
  if (lowerName.includes('mirch') || lowerName.includes('chili')) {
    return 'assets/products/kashmiri_mirch.jpg';
  }
  if (lowerName.includes('haldi') || lowerName.includes('turmeric')) {
    return 'assets/products/haldi_turmeric.jpg';
  }
  if (lowerName.includes('elaichi') || lowerName.includes('cardamom')) {
    return 'assets/products/elaichi.jpg';
  }
  if (lowerName.includes('dalchini') || lowerName.includes('cinnamon')) {
    return 'assets/products/dalchini.jpg';
  }
  if (lowerCat.includes('agarbatti') || lowerCat.includes('incense')) {
    return 'assets/products/agarbatti.jpg';
  }
  if (lowerCat.includes('dhoop')) {
    return 'assets/products/dhoop.jpg';
  }
  if (lowerCat.includes('dry') || lowerName.includes('kaju')) {
    return 'assets/products/kaju.jpg';
  }
  if (lowerCat.includes('dry') || lowerName.includes('badam')) {
    return 'assets/products/badam.jpg';
  }
  if (lowerCat.includes('oil') || lowerName.includes('oil') || lowerName.includes('ghee')) {
    return 'assets/products/mustard_oil.jpg';
  }
  return 'assets/products/kashmiri_mirch.jpg';
};

export const ProductVisual: React.FC<ProductVisualProps> = ({
  product,
  className = '',
  size = 'md',
  priority = false,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [variantIndex, setVariantIndex] = useState(0);

  const [isInView, setIsInView] = useState(() => {
    // If priority is true or during SSR/no-IntersectionObserver environments, show immediately
    if (priority) return true;
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return true;
    return false;
  });

  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (priority || isInView) return;

    const targetElement = containerRef.current;
    if (!targetElement) return;

    if (!('IntersectionObserver' in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry && entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        // Preload 200px before scrolling into viewport
        rootMargin: '200px 0px',
        threshold: 0.01,
      }
    );

    observer.observe(targetElement);

    return () => {
      observer.disconnect();
    };
  }, [priority, isInView]);

  const rawImagePath =
    PRODUCT_REAL_IMAGES[product.id] ||
    product.image ||
    getCategoryFallbackImage(product.category, product.name);

  // Generate URL variants (GitHub Pages path, relative path, root path)
  const variants = useMemo(() => getAssetUrlVariants(rawImagePath), [rawImagePath]);
  const currentSrc = variants[variantIndex] || variants[0] || getAssetUrl(rawImagePath);

  // Reset retry index if product changes
  useEffect(() => {
    setVariantIndex(0);
    setHasError(false);
    setIsLoaded(false);
  }, [product.id, rawImagePath]);

  const handleImageError = () => {
    // Try the next asset URL variant (e.g. relative vs subpath)
    if (variantIndex < variants.length - 1) {
      setVariantIndex((prev) => prev + 1);
    } else {
      setHasError(true);
      setIsLoaded(true);
    }
  };

  const containerHeight =
    size === 'sm'
      ? 'h-16 w-16'
      : size === 'lg'
      ? 'h-64 sm:h-72 w-full'
      : 'h-44 sm:h-48 w-full';

  const paddingClass = size === 'sm' ? 'p-0' : 'p-1';

  return (
    <div
      ref={containerRef}
      className={`relative ${containerHeight} ${className} bg-slate-50/70 rounded-xl overflow-hidden border border-slate-100 flex items-center justify-center ${paddingClass} transition-all duration-300 group`}
    >
      {/* Skeleton placeholder shown while waiting for intersection or image decode */}
      {(!isInView || (!isLoaded && !hasError)) && (
        <div className="absolute inset-1 rounded-lg bg-slate-100/90 animate-pulse flex items-center justify-center pointer-events-none">
          <div className="w-7 h-7 rounded-full bg-slate-200/60" />
        </div>
      )}

      {isInView && (
        <>
          {!hasError ? (
            <img
              key={currentSrc}
              src={currentSrc}
              alt={product.name}
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
              referrerPolicy="no-referrer"
              onLoad={() => setIsLoaded(true)}
              onError={handleImageError}
              className={`w-full h-full object-cover object-center rounded-lg group-hover:scale-105 transition-all duration-500 ease-out ${
                isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-emerald-50 text-emerald-900 rounded-lg p-1.5 text-center">
              <span className="text-xl mb-0.5">🌾</span>
              <span className="text-[11px] font-bold truncate max-w-[110px]">{product.name}</span>
              <span className="text-[9px] text-emerald-700 font-semibold">{product.unit}</span>
            </div>
          )}
        </>
      )}

      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none rounded-lg" />
    </div>
  );
};
