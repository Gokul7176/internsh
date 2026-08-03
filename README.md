# Lumina Skincare | AI-Powered Luxury E-Commerce Platform

[![Next.js 15](https://img.shields.io/badge/Next.js-15%20App%20Router-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-FFCA28?logo=firebase)](https://firebase.google.com/)
[![Gemini API](https://img.shields.io/badge/Gemini%20API-2.5%20Flash-4285F4?logo=google)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%20v4-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deploys%20%26%20Analytics-000000?logo=vercel)](https://vercel.com/)

> **Portfolio Resume Description**:
> *"Developed a responsive web-based retail system for skin care products using Next.js, HTML, CSS, and JavaScript. Implemented Firebase Firestore for secure management of user, product, and order data, and integrated the Gemini API for AI-powered recommendations and chatbot support. Deployed the application on Vercel with Vercel Analytics and managed version control using GitHub."*

---

## 🌟 Executive Overview

**Lumina Skincare** is a full-stack, production-quality, responsive web application engineered for luxury clinical skincare products. Inspired by Apple & Aesop minimalist aesthetics, the platform combines soft cream/gold color palettes, glassmorphism, and dark mode support with artificial intelligence powered by **Google Gemini API** and cloud infrastructure on **Firebase Firestore & Authentication**.

---

## ✨ Key Features

### 🛒 Customer E-Commerce Experience
- **Editorial Hero & Collections**: High-impact luxury hero, category cards, featured products, best sellers, and new arrivals.
- **Multi-Facet Catalog**: Instant debounced search, checkable category filters, skin concern chips (Dry, Oily, Sensitive, Combination), price range slider, and grid/list view toggles.
- **Product Details & Gallery**: High-res multi-image zoom gallery, ingredient breakdown tags, usage directions, verified buyer reviews, and 1-click **Frequently Bought Together** bundle discounts.
- **Shopping Bag & Coupons**: Quantity adjustment, animated **Free Express Shipping** progress bar, promo coupon system (`GLOW20` for 20% off), and sales tax calculation.
- **Express Checkout**: Address book selection, inline form validation, order summary breakdown, and order placement in Firestore.
- **Order Timeline Tracking**: Real-time status timeline (*Order Placed ➔ Packed ➔ Out for Delivery ➔ Delivered*).

### 🤖 Gemini AI Innovations
1. **AI Skin Routine Builder (`/recommendations`)**: Step-by-step skin questionnaire analyzing skin type, age, and concerns. Gemini API generates tailored Morning & Evening sequences with scientific reasoning and catalog item matching.
2. **Floating Skincare AI Chatbot**: Accessible on every page to answer ingredient compatibility questions (e.g., *"Can I mix Niacinamide with Vitamin C?"*), skin type advice, and product suggestions.

### 🛡️ User & Admin Dashboards
- **User Dashboard**: Profile editing, order history with tracking timeline, reorder button, and wishlist link sharing.
- **Admin Dashboard**: Role-gated. KPI statistics (Revenue, Orders, Active Customers, Products), monthly sales charts, low stock alerts (<10 units), Product CRUD with **Cloudinary** image upload integration, Order Status Manager, and User directory.

---

## 🏗️ System Architecture & Data Layer

```
                     ┌──────────────────────────────────────────┐
                     │            Next.js 15 Client             │
                     │  (App Router, Tailwind CSS, Lucide, UI)  │
                     └────────────────────┬─────────────────────┘
                                          │
        ┌─────────────────────────────────┼─────────────────────────────────┐
        │                                 │                                 │
┌───────▼────────┐              ┌─────────▼────────┐             ┌──────────▼─────────┐
│ Context & Hooks│              │ Server API Routes│             │   Services Layer   │
│  (Auth, Cart,  │              │ (/api/gemini/*)  │             │(product, order,    │
│  Wishlist)     │              └─────────┬────────┘             │ user, review, cloud│
└───────┬────────┘                        │                      └──────────┬─────────┘
        │                                 │                                 │
┌───────▼────────┐              ┌─────────▼────────┐             ┌──────────▼─────────┐
│ Local Storage  │              │ Google Gemini API│             │ Firebase Firestore │
│ Fallback Layer │              │ (2.5 / 1.5 Flash)│             │  & Cloudinary API  │
└────────────────┘              └──────────────────┘             └────────────────────┘
```

---

## 🗄️ Firestore Database Schema

The system organizes data into 10 structured collections:

| Collection | Key Document Fields |
|---|---|
| `users` | `uid`, `email`, `displayName`, `role` (`customer` \| `admin`), `phone`, `skinType`, `addresses[]`, `createdAt` |
| `products` | `id`, `name`, `brand`, `price`, `originalPrice`, `rating`, `reviewCount`, `stock`, `category`, `skinType[]`, `images[]`, `description`, `ingredients[]`, `benefits[]`, `usage`, `volume`, `isFeatured`, `isBestSeller`, `isNewArrival` |
| `categories` | `id`, `name`, `description`, `image`, `productCount` |
| `orders` | `id`, `userId`, `customerName`, `customerEmail`, `items[]`, `subtotal`, `tax`, `shippingFee`, `discount`, `total`, `couponCode`, `shippingAddress`, `status` (`placed` \| `packed` \| `shipped` \| `delivered` \| `cancelled`), `timeline[]`, `createdAt` |
| `orderItems` | `productId`, `productName`, `productImage`, `price`, `quantity` |
| `wishlist` | `id`, `userId`, `product`, `addedAt` |
| `reviews` | `id`, `productId`, `userId`, `userName`, `userAvatar`, `rating`, `title`, `comment`, `verifiedPurchase`, `createdAt` |
| `cart` | `id`, `userId`, `items[]`, `updatedAt` |
| `coupons` | `code`, `discountPercent`, `discountAmount`, `minPurchase`, `expiryDate`, `isActive` |
| `notifications` | `id`, `userId`, `title`, `message`, `read`, `type`, `createdAt` |

---

## 🔌 API Routes Documentation

### `POST /api/gemini/recommend`
Generates a custom dermatological morning & evening skincare routine based on customer skin profile.
- **Request Body**:
  ```json
  {
    "skinType": "combination",
    "ageGroup": "25-34",
    "primaryConcerns": ["Hyperpigmentation", "Uneven Texture"],
    "isSensitive": false,
    "preferredTexture": "Lightweight Serum"
  }
  ```
- **Response**: `AIRoutineRecommendation` object containing morning/evening steps and catalog product matches.

### `POST /api/gemini/chat`
Answers ingredient compatibility and skincare queries via Gemini 2.5 API.
- **Request Body**:
  ```json
  {
    "query": "Can I mix Niacinamide with Vitamin C?",
    "history": []
  }
  ```
- **Response**: `{ "text": "...", "suggestedProducts": [...] }`

---

## ⚡ Local Installation & Setup Guide

### Prerequisites
- Node.js v18.0.0 or higher
- npm or yarn

### Step 1: Clone Repository & Install Dependencies
```bash
git clone https://github.com/your-username/lumina-skincare.git
cd lumina-skincare
npm install
```

### Step 2: Configure Environment Variables
Copy `.env.example` to create `.env.local`:
```bash
cp .env.example .env.local
```
*(Note: Lumina includes an automatic local fallback mode. If `.env.local` is omitted, the app runs seamlessly with pre-loaded seed data and mock AI response engines).*

### Step 3: Launch Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Deployment Guide for Vercel

1. Push your repository to **GitHub**.
2. Log in to [Vercel Dashboard](https://vercel.com) and click **Add New Project**.
3. Import your `lumina-skincare` repository.
4. Add the environment variables from `.env.example` under **Settings ➔ Environment Variables**.
5. Click **Deploy**. Vercel Analytics will automatically track visitor traffic and page performance.

---

## 📜 License & Acknowledgments
Built with clinical precision for software engineering portfolios and technical interviews. © 2026 Lumina Skincare.
