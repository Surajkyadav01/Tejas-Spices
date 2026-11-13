import React, { useState, useMemo, useEffect } from 'react';
import { getAssetUrl, getAssetUrlVariants } from '../utils/assetUrl';

interface CategoryBadgeVisualProps {
  imageVisual: string;
  name: string;
  imageUrl?: string;
}

const CATEGORY_IMAGES: Record<string, string> = {
  spice_bowl: 'assets/products/kashmiri_mirch.jpg',
  whole_spices: 'assets/products/elaichi.jpg',
  incense: 'assets/products/agarbatti.jpg',
  dhoop_cup: 'assets/products/dhoop.jpg',
  camphor: 'assets/products/pooja_samagri.jpg',
  dry_fruits: 'assets/products/badam.jpg',
  oil_bottle: 'assets/products/mustard_oil.jpg',
  dal_rice: 'assets/products/toor_dal.jpg',
  snacks: 'assets/products/namkeen.jpg',
  tea: 'assets/products/assam_tea.jpg',
};

export const CategoryBadgeVisual: React.FC<CategoryBadgeVisualProps> = ({
  imageVisual,
  name,
  imageUrl,
}) => {
  const [variantIndex, setVariantIndex] = useState(0);
  const [hasError, setHasError] = useState(false);

  const rawPath = imageUrl || CATEGORY_IMAGES[imageVisual] || CATEGORY_IMAGES.spice_bowl;
  const variants = useMemo(() => getAssetUrlVariants(rawPath), [rawPath]);
  const currentSrc = variants[variantIndex] || variants[0] || getAssetUrl(rawPath);

  useEffect(() => {
    setVariantIndex(0);
    setHasError(false);
  }, [rawPath]);

  const handleImageError = () => {
    if (variantIndex < variants.length - 1) {
      setVariantIndex((prev) => prev + 1);
    } else {
      setHasError(true);
    }
  };

  return (
    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl p-1.5 bg-white border border-slate-100 shadow-2xs flex items-center justify-center relative overflow-hidden group-hover:scale-105 group-hover:border-emerald-400 group-hover:shadow-sm transition-all duration-300">
      {!hasError ? (
        <img
          key={currentSrc}
          src={currentSrc}
          alt={name}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={handleImageError}
          className="w-full h-full object-contain object-center transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <span className="text-2xl">📦</span>
      )}
    </div>
  );
};
