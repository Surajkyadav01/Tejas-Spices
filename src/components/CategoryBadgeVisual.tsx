import React, { useState } from 'react';
import { getAssetUrl } from '../utils/assetUrl';

interface CategoryBadgeVisualProps {
  imageVisual: string;
  name: string;
  imageUrl?: string;
}

const CATEGORY_IMAGES: Record<string, string> = {
  spice_bowl: 'assets/categories/spices_masala.jpg',
  whole_spices: 'assets/categories/khada_masala.jpg',
  incense: 'assets/categories/agarbatti.jpg',
  dhoop_cup: 'assets/categories/dhoop.jpg',
  camphor: 'assets/categories/pooja_samagri.jpg',
  dry_fruits: 'assets/categories/dry_fruits.jpg',
  oil_bottle: 'assets/categories/oils_ghee.jpg',
  dal_rice: 'assets/categories/kirana_dals.jpg',
  snacks: 'assets/categories/snacks_namkeen.jpg',
  tea: 'assets/categories/tea_beverages.jpg',
};

export const CategoryBadgeVisual: React.FC<CategoryBadgeVisualProps> = ({
  imageVisual,
  name,
  imageUrl,
}) => {
  const [hasError, setHasError] = useState(false);
  const rawSrc = (!hasError && (imageUrl || CATEGORY_IMAGES[imageVisual])) || CATEGORY_IMAGES.spice_bowl;
  const src = getAssetUrl(rawSrc);


  return (
    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 bg-white border border-slate-200/90 shadow-2xs flex items-center justify-center relative overflow-hidden group-hover:scale-105 group-hover:border-emerald-500 group-hover:shadow-md transition-all duration-300">
      <img
        src={src}
        alt={name}
        loading="lazy"
        decoding="async"
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className="w-full h-full rounded-full object-cover object-center transition-transform duration-300 group-hover:scale-110"
      />
    </div>
  );
};
