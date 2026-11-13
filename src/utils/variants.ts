import { Product, PackVariant, CartItem } from '../types';

/**
 * Generates realistic Indian grocery / spice pack size options (250g, 500g, 1kg, 5kg, etc.)
 * tailored to each product's base unit & category, preserving the exact base unit option as one of the choices.
 */
export function getProductVariants(product: Product): PackVariant[] {
  if (product.variants && product.variants.length > 0) {
    return product.variants;
  }

  const u = (product.unit || '').toLowerCase();
  const basePrice = product.price;
  const baseMrp = product.originalPrice;

  const calc = (multiplier: number, extraBulkSave = 0) => {
    const rawPrice = Math.max(10, Math.round(basePrice * multiplier * (1 - extraBulkSave)));
    const rawMrp = Math.max(rawPrice, Math.round(baseMrp * multiplier));
    const discountPercent = rawMrp > rawPrice ? Math.round(((rawMrp - rawPrice) / rawMrp) * 100) : product.discountPercent;
    return { price: rawPrice, originalPrice: rawMrp, discountPercent };
  };

  // Rice & Grains (base 1 kg Pack)
  if (u.includes('1 kg') || u.includes('1kg')) {
    return [
      { id: '500g', label: '500g Pack', ...calc(0.55) },
      { id: '1kg', label: product.unit || '1 kg Pack', price: basePrice, originalPrice: baseMrp, discountPercent: product.discountPercent },
      { id: '5kg', label: '5 kg Pack', ...calc(5, 0.08) },
    ];
  }

  // Pulses & Dal (base 500g Pack) -> 250g, 500g, 1kg, 5kg
  if (product.categorySlug === 'kirana-dals' && u.includes('500g')) {
    return [
      { id: '250g', label: '250g Pack', ...calc(0.55) },
      { id: '500g', label: product.unit || '500g Pack', price: basePrice, originalPrice: baseMrp, discountPercent: product.discountPercent },
      { id: '1kg', label: '1 kg Pack', ...calc(2, 0.04) },
      { id: '5kg', label: '5 kg Pack', ...calc(10, 0.1) },
    ];
  }

  // Cooking Oil (base 1 Litre Bottle)
  if (product.categorySlug === 'oils-ghee' || u.includes('litre')) {
    return [
      { id: '500ml', label: '500 ml Bottle', ...calc(0.54) },
      { id: '1l', label: product.unit || '1 Litre Bottle', price: basePrice, originalPrice: baseMrp, discountPercent: product.discountPercent },
      { id: '2l', label: '2 Litre Jar', ...calc(2, 0.04) },
      { id: '5l', label: '5 Litre Tin', ...calc(5, 0.08) },
    ];
  }

  // Agarbatti / Dhoop / Pooja packs (sticks, cups, pieces)
  if (
    product.categorySlug === 'agarbatti' ||
    product.categorySlug === 'dhoop' ||
    u.includes('stick') ||
    u.includes('cup') ||
    u.includes('piece')
  ) {
    return [
      { id: '1x', label: product.unit, price: basePrice, originalPrice: baseMrp, discountPercent: product.discountPercent },
      { id: '2x', label: 'Pack of 2', ...calc(2, 0.05) },
      { id: '4x', label: 'Pack of 4', ...calc(4, 0.1) },
    ];
  }

  // Spices / Dry Fruits / Tea / Namkeen starting at 100g
  if (u.includes('100g')) {
    return [
      { id: '100g', label: product.unit || '100g Pack', price: basePrice, originalPrice: baseMrp, discountPercent: product.discountPercent },
      { id: '250g', label: '250g Pack', ...calc(2.5, 0.05) },
      { id: '500g', label: '500g Pack', ...calc(5, 0.08) },
      { id: '1kg', label: '1 kg Pack', ...calc(10, 0.12) },
    ];
  }

  // Spices / Namkeen / Tea / Dry Fruits starting at 200g or 250g
  if (u.includes('200g') || u.includes('250g')) {
    const is200 = u.includes('200g');
    const ratio500 = is200 ? 2.5 : 2;
    const ratio1kg = is200 ? 5 : 4;
    return [
      { id: is200 ? '200g' : '250g', label: product.unit, price: basePrice, originalPrice: baseMrp, discountPercent: product.discountPercent },
      { id: '500g', label: '500g Pack', ...calc(ratio500, 0.05) },
      { id: '1kg', label: '1 kg Pack', ...calc(ratio1kg, 0.1) },
    ];
  }

  // Generic weight fallback
  return [
    { id: 'base', label: product.unit || 'Standard Pack', price: basePrice, originalPrice: baseMrp, discountPercent: product.discountPercent },
    { id: '500g', label: '500g Pack', ...calc(2, 0.05) },
    { id: '1kg', label: '1 kg Pack', ...calc(4, 0.1) },
  ];
}

/**
 * Returns default variant matching product's listed base unit
 */
export function getDefaultVariant(product: Product): PackVariant {
  const variants = getProductVariants(product);
  return (
    variants.find((v) => v.label === product.unit) ||
    variants[0]
  );
}

/**
 * Returns a product snapshot configured with the selected variant's price/unit
 */
export function applyVariantToProduct(product: Product, variant?: PackVariant): Product {
  if (!variant) return product;
  return {
    ...product,
    unit: variant.label,
    price: variant.price,
    originalPrice: variant.originalPrice,
    discountPercent: variant.discountPercent,
  };
}

/**
 * Unique cart key combining product ID and pack size label
 */
export function getCartKey(item: Pick<CartItem, 'product' | 'selectedVariant'>): string {
  const label = item.selectedVariant?.label || item.product.unit;
  return `${item.product.id}__${label}`;
}
