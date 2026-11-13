import { CartItem, Order } from '../types';
import { STORE_INFO } from '../data/mockData';

const STORE_WHATSAPP_NUMBER = '919450253342'; // +91 94502 53342

export function buildWhatsAppOrderUrl(params: {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount?: number;
  total: number;
  orderId?: string;
  paymentMethod?: 'COD' | 'UPI';
  upiRef?: string;
  customer?: {
    fullName?: string;
    phone?: string;
    address?: string;
    city?: string;
    pincode?: string;
    notes?: string;
  };
}): string {
  const { items, subtotal, deliveryFee, discount = 0, total, orderId, paymentMethod, upiRef, customer } = params;

  const lines: string[] = [];
  lines.push(`🙏 *Namaste ${STORE_INFO.name}!*`);
  if (orderId) {
    lines.push(`*Order ID:* #${orderId}`);
  } else {
    lines.push(`*New Quick Order Request*`);
  }
  lines.push('');
  lines.push('*📦 Order Items:*');

  items.forEach((item, idx) => {
    const packLabel = item.selectedVariant?.label || item.product.unit;
    const unitPrice = item.selectedVariant?.price ?? item.product.price;
    const lineTotal = unitPrice * item.quantity;
    lines.push(`${idx + 1}. ${item.product.name} (${packLabel}) x ${item.quantity} = ₹${lineTotal}`);
  });

  lines.push('');
  lines.push(`Subtotal: ₹${subtotal}`);
  if (discount > 0) {
    lines.push(`Discount: -₹${discount}`);
  }
  lines.push(`Delivery: ${deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}`);
  lines.push(`*Grand Total: ₹${total}*`);

  if (paymentMethod) {
    const payStr =
      paymentMethod === 'UPI'
        ? upiRef
          ? `UPI Paid (Ref: ${upiRef})`
          : 'UPI / QR Scan'
        : 'Cash on Delivery (COD)';
    lines.push(`*Payment Mode:* ${payStr}`);
  }

  if (customer && (customer.fullName || customer.address || customer.phone)) {
    lines.push('');
    lines.push('*📍 Delivery Details:*');
    if (customer.fullName) lines.push(`Name: ${customer.fullName}`);
    if (customer.phone) lines.push(`Phone: ${customer.phone}`);
    if (customer.address) {
      lines.push(`Address: ${customer.address}, ${customer.city || 'Suriyawan'} - ${customer.pincode || '221404'}`);
    }
    if (customer.notes) lines.push(`Notes: ${customer.notes}`);
  }

  const encoded = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encoded}`;
}

export function buildWhatsAppOrderFromOrder(order: Order): string {
  return buildWhatsAppOrderUrl({
    items: order.items,
    subtotal: order.subtotal,
    deliveryFee: order.deliveryFee,
    discount: order.discount,
    total: order.total,
    orderId: order.orderId,
    paymentMethod: order.paymentMethod,
    upiRef: order.upiRef,
    customer: order.customer,
  });
}

export function buildCustomerStatusWhatsAppUrl(order: Order): string {
  const rawPhone = (order.customer.phone || '').replace(/\D/g, '');
  const targetPhone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone || STORE_WHATSAPP_NUMBER;
  const statusText: Record<Order['status'], string> = {
    placed: 'Order Received & Verified ✅',
    packed: 'Packed & Aroma-Sealed 📦',
    dispatched: 'Dispatched with Delivery Rider 🛵',
    out_for_delivery: 'Out for Delivery — Reaching Shortly 🚚',
    delivered: 'Delivered Successfully 🎉',
  };

  const msg = [
    `🙏 Namaste ${order.customer.fullName}!`,
    `Update from *${STORE_INFO.name}*:`,
    `*Order #${order.orderId}* (₹${order.total})`,
    `*Current Status:* ${statusText[order.status]}`,
    `Thank you for shopping with us!`,
  ].join('\n');

  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(msg)}`;
}
