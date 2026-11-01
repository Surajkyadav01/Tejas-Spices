# 🌶️ Tejas Spices - Official eCommerce Web Application

![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-7.0-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/License-Apache_2.0-green)

A modern, fast, and responsive full-featured eCommerce web application built for **Tejas Spices (तेजस स्पाइसेस)** — an authentic Indian spice, dry fruits, royal agarbatti, and pooja samagri retail store based in **Suriyawan, Bhadohi (Uttar Pradesh - 221404)**.

---

## 🌟 Key Highlights & Features

### 🛒 1. Customer Shopping Experience
- **Interactive Product Catalog**: Real-time filtering across 10 authentic categories, multi-criteria sorting (Price Low/High, Rating, Featured), and instant search (English & Hindi keywords).
- **Cart & Wishlist System**: Persistent cart drawer and wishlist management stored seamlessly in browser localStorage.
- **Express Local Delivery Calculation**: Automatic free shipping calculation for orders exceeding ₹299 in Suriyawan and surrounding rural areas.
- **Star-Rating & Review Section**: Interactive customer rating modal allowing buyers to submit star reviews, written feedback, and read authentic customer experiences.
- **Smooth Auto-Sliding Category Carousel**: Infinite, readable carousel highlighting whole spices, daily kirana staples, pooja essentials, and fragrances.

### 📜 2. Dedicated Full-Page Store Policies (No Popup Modals)
- Dedicated internal page architecture allowing users to read complete, professional store policies:
  - **🚚 Shipping & Delivery Policy**: 2–4 hours local delivery details, dispatch schedules (8:00 AM – 9:00 PM), airtight 3-layer packaging standards, and free shipping slabs.
  - **🔒 Privacy Policy**: Customer data protection pledge, 100% financial privacy with zero card/PIN storage, and no third-party data sharing.
  - **📝 Ordering & Buying Terms**: Step-by-step ordering guide (Website, Direct Phone Call, WhatsApp), transparent GST invoicing, and purity guarantees.
  - **🔄 Return & Refund Policy**: 24–48 hours replacement window for damaged/defective items with instant UPI or cash-on-hand refunds.
  - **💬 Help Center & FAQs**: Answers to common questions regarding local deliveries and payment methods.

### ⚡ 3. Performance & Lazy Loading
- **Native IntersectionObserver Scroll Reveal**: Hardware-accelerated (`transform-gpu`) entrance animations (Fade-Up, Slide-In) triggered smoothly as users scroll down the page.
- **Asynchronous Image Optimization**: All product and category images leverage `loading="lazy"` and `decoding="async"` accompanied by shimmer skeleton placeholders to achieve near-zero Cumulative Layout Shift (CLS).

### 📦 4. Live Order Tracking & Management
- Real-time visual progress tracker showing orders moving through:
  `Order Placed` ➔ `Confirmed & Packed` ➔ `Out for Delivery` ➔ `Delivered`.
- Direct customer support and instant WhatsApp dispatch verification.

### 🛠️ 5. Built-in Merchant Admin Portal
- Protected admin panel for store owners to:
  - Update live order delivery statuses.
  - Manage product stock availability in real-time.
  - Add new spices and groceries to the catalog dynamically.

---

## 📱 Mobile-First Responsive Design
- Optimized specifically for smartphones, tablets, and desktop displays.
- Responsive sticky navigation bar, mobile slide-out drawer, touch-friendly product cards, and clean typography.

---

## 🛠️ Tech Stack & Architecture

| Technology | Purpose |
|------------|---------|
| **React 19** | Modern UI framework with hooks and functional component design |
| **TypeScript** | Strict type safety for products, cart, orders, and user profiles |
| **Vite 8** | Ultra-fast next-generation frontend build tooling and local dev server |
| **Tailwind CSS v4** | Modern utility-first CSS engine with authentic brand palette |
| **Lucide React** | Clean, accessible vector icons |

---

## 📂 Project Directory Structure

```text
├── public/
│   ├── assets/
│   │   ├── aistudio/           # Official Tejas Spices logo & brand assets
│   │   └── categories/         # High-resolution optimized category photography
│   └── favicon.png             # Official branded browser favicon
├── src/
│   ├── components/
│   │   ├── Header.tsx          # Top alert bar, search, navigation & mobile menu
│   │   ├── HeroBanners.tsx     # Hero promotion banners with newsletter discount
│   │   ├── CategoriesSlider.tsx# Auto-sliding category carousel
│   │   ├── DailyBestSells.tsx  # Daily deals with countdown timer & discount badges
│   │   ├── CatalogSection.tsx  # Grid of all products with search & sorting
│   │   ├── ProductVisual.tsx   # Lazy-loaded image handler with skeleton loader
│   │   ├── ScrollReveal.tsx    # IntersectionObserver scroll-triggered animation wrapper
│   │   ├── PolicyPage.tsx      # Full-page legal, shipping, refund & privacy policies
│   │   ├── AboutUsPage.tsx     # Store history, owner information & mission
│   │   ├── ProductDetailModal.tsx # Quick-view detail modal with star rating & reviews
│   │   ├── CartDrawer.tsx      # Slide-out shopping cart drawer
│   │   ├── CheckoutModal.tsx   # Order checkout with COD / UPI payment support
│   │   ├── TrackOrderModal.tsx # Live order tracking modal
│   │   ├── AdminModal.tsx      # Store owner admin management panel
│   │   └── Footer.tsx          # Store details, verified policy links & copyright
│   ├── data/
│   │   └── mockData.ts         # Initial products catalog, store info & category list
│   ├── types.ts                # TypeScript data interfaces and contracts
│   ├── App.tsx                 # Root application state and view router
│   ├── main.tsx                # React DOM entry point
│   └── index.css               # Global Tailwind CSS configuration & typography
├── package.json                # Project dependencies and npm scripts
├── tsconfig.json               # TypeScript configuration
└── vite.config.ts              # Vite bundler configuration
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- [Node.js](https://nodejs.org/) (Version 18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/tejas-spices.git
cd tejas-spices
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```
Open your browser at `http://localhost:3000` to preview the application.

### 4. Build for production
```bash
npm run build
```
The optimized production bundle will be generated in the `dist/` directory.

### 5. Check type safety and linting
```bash
npm run lint
```

---

## 🏪 Store & Business Details

- **Store Name**: Tejas Spices (तेजस स्पाइसेस)
- **Tagline**: Authentic Indian Spices & Fragrances
- **Location**: Suriyawan, Bhadohi, Uttar Pradesh - 221404
- **Customer Helpline**: `+91 94502 53342` / `094502 53342`
- **Email Contact**: `contact@tejaspices.com`
- **Operating Hours**: 8:00 AM – 9:00 PM (All 7 Days)
- **Free Home Delivery**: Available on all orders above ₹299 in Suriyawan

---

## 📄 License
This project is open-source and available under the [Apache-2.0 License](LICENSE).
