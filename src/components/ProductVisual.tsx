import React, { useState } from 'react';
import { Product } from '../types';

interface ProductVisualProps {
  product: Product;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

// Curated high-resolution authentic photography mapping for each product
export const PRODUCT_REAL_IMAGES: Record<string, string> = {
  // prod-1: Basmati Rice Premium
  'prod-1': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
  // prod-2: Sona Masoori Rice
  'prod-2': 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=600&q=80',
  // prod-3: Toor Dal (Unpolished Arhar)
  'prod-3': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80',
  // prod-4: Moong Dal (Yellow Split)
  'prod-4': 'https://images.unsplash.com/photo-1612197527664-984e1b802e3b?auto=format&fit=crop&w=600&q=80',
  // prod-5: Kashmiri Lal Mirch Powder
  'prod-5': 'https://images.unsplash.com/photo-1627735483790-272e12a02b1f?auto=format&fit=crop&w=600&q=80',
  // prod-6: Shahi Garam Masala
  'prod-6': 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=600&q=80',
  // prod-7: Lakadong Turmeric (Haldi)
  'prod-7': 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
  // prod-8: Green Cardamom (Chhoti Elaichi)
  'prod-8': 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=600&q=80',
  // prod-9: Ceylon Dalchini Sticks (Cinnamon)
  'prod-9': 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=600&q=80',
  // prod-10: Black Pepper (Sabut Kali Mirch)
  'prod-10': 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=600&q=80',
  // prod-11: Royal Chandan Agarbatti
  'prod-11': 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80',
  // prod-12: Kesar Kasturi Flora Agarbatti
  'prod-12': 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80',
  // prod-13: Herbal Guggul Dhoop Cups
  'prod-13': 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80',
  // prod-14: Pure Bhimseni Camphor
  'prod-14': 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=600&q=80',
  // prod-15: Pure Desi Cow Ghee Diya Batti
  'prod-15': 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=600&q=80',
  // prod-16: Kashmiri Mamra Badam
  'prod-16': 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=600&q=80',
  // prod-17: Royal W240 Whole Cashews (Kaju)
  'prod-17': 'https://images.unsplash.com/photo-1536591375315-1988d64d5059?auto=format&fit=crop&w=600&q=80',
  // prod-18: Mustard Oil (Kachi Ghani)
  'prod-18': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
  // prod-19: Coriander Powder (Dhania)
  'prod-19': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
  // prod-20: Masoor Dal (Split Red Lentils)
  'prod-20': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80',
};

// Category fallback image resolver
const getCategoryFallbackImage = (category: string, name: string): string => {
  const lowerName = name.toLowerCase();
  const lowerCat = category.toLowerCase();

  if (lowerName.includes('rice') || lowerName.includes('basmati')) {
    return 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80';
  }
  if (lowerName.includes('dal') || lowerName.includes('arhar') || lowerName.includes('moong')) {
    return 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80';
  }
  if (lowerName.includes('mirch') || lowerName.includes('chili')) {
    return 'https://images.unsplash.com/photo-1627735483790-272e12a02b1f?auto=format&fit=crop&w=600&q=80';
  }
  if (lowerName.includes('haldi') || lowerName.includes('turmeric')) {
    return 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80';
  }
  if (lowerCat.includes('agarbatti') || lowerCat.includes('incense')) {
    return 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80';
  }
  if (lowerCat.includes('dhoop')) {
    return 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80';
  }
  if (lowerCat.includes('dry') || lowerName.includes('kaju') || lowerName.includes('badam')) {
    return 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=600&q=80';
  }
  if (lowerCat.includes('oil') || lowerName.includes('oil') || lowerName.includes('ghee')) {
    return 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80';
  }
  return 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80';
};

export const ProductVisual: React.FC<ProductVisualProps> = ({
  product,
  className = '',
  size = 'md',
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const imageUrl =
    product.image ||
    PRODUCT_REAL_IMAGES[product.id] ||
    getCategoryFallbackImage(product.category, product.name);

  const containerHeight =
    size === 'sm'
      ? 'h-16 w-16'
      : size === 'lg'
      ? 'h-64 sm:h-72 w-full'
      : 'h-44 sm:h-48 w-full';

  return (
    <div
      className={`relative ${containerHeight} ${className} bg-slate-50/70 rounded-xl overflow-hidden border border-slate-100 flex items-center justify-center p-1.5 transition-all duration-300 group`}
    >
      {/* Skeleton loading shimmer placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-100 via-slate-200/60 to-slate-100 animate-pulse rounded-lg flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
        </div>
      )}

      {!hasError ? (
        <img
          src={imageUrl}
          alt={product.name}
          referrerPolicy="no-referrer"
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setHasError(true);
            setIsLoaded(true);
          }}
          className={`w-full h-full object-cover object-center rounded-lg group-hover:scale-105 transition-all duration-500 ease-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-emerald-50/70 text-emerald-900 rounded-lg p-2 text-center">
          <span className="text-2xl mb-1">🌿</span>
          <span className="text-xs font-bold truncate max-w-[120px]">{product.name}</span>
          <span className="text-[10px] text-emerald-700 font-semibold">{product.unit}</span>
        </div>
      )}

      {/* Subtle bottom gradient shadow for contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent pointer-events-none rounded-lg" />
    </div>
  );
};

