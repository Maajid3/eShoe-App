<div align="center">

# eShoe — Premium Footwear Store

**A full-stack e-commerce storefront built with React**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-5-FF4154?style=for-the-badge&logo=reactquery)](https://tanstack.com/query)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe)](https://stripe.com)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com)

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=flat-square)](https://your-eshoe.vercel.app)
[![Backend API](https://img.shields.io/badge/Backend-Django_API-092E20?style=flat-square)]

</div>

## 📸 Preview

<div align="center">
<img src="https://images.unsplash.com/photo-1661152655333-7b5275ad6baa?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="eShoe Preview" width="100%" />
</div>

---
## Features

| Feature | Details |
|---|---|
| Home & Browsing | Product grid with pagination, search, and category filters |
| Authentication | Register, login, JWT token management, delete account |
| Cart | Add items, update quantity, remove — synced with backend |
| Checkout | 3-step flow — Address, Payment, Confirm |
| Payments | Stripe card, UPI with QR, Cash on Delivery |
| Order Success | Real-time order tracker with estimated delivery |
| Profile | Order history, payment history, account settings |
| Change Password | Inline password update with validation |
| Responsive | Fully mobile-optimised across all pages |
| Error Handling | Global ErrorBoundary + axios interceptor toasts |

---

## Tech Stack

```
UI Framework   ->  React 18 + Vite
State/Data     ->  TanStack Query v5
Routing        ->  React Router v6
HTTP           ->  Axios with interceptors
Icons          ->  MUI Icons
Payments       ->  Stripe Checkout
Toasts         ->  React Hot Toast
Styling        ->  Custom CSS
Fonts          ->  Cormorant Garamond + DM Sans
Deploy         ->  Vercel
```

---

## Pages

| Route | Page | Auth Required |
|-------|------|---------------|
| `/` | Home — product listing | No |
| `/buy/:id` | Product detail + size select | No |
| `/cart` | Cart | Yes |
| `/checkout` | Checkout — address + payment | Yes |
| `/order-success/:id` | Order confirmation | Yes |
| `/account` | Profile — orders, payments, settings | Yes |
| `/login` | Login | No |
| `/signup` | Register | No |
| `/change-password` | Change password | Yes |

---

## Payment Methods

| Method | Provider | Mode |
|--------|----------|------|
| Card | Stripe | Test |
| UPI | Simulated + QR | Demo |
| Cash on Delivery | Backend confirmed | Live |

**Stripe Test Card:** `4242 4242 4242 4242` — any future date — any CVV

---

## Related

[![Backend](https://img.shields.io/badge/Backend-Django_REST_API-092E20?style=for-the-badge&logo=django&logoColor=white)]
[![Live API](https://img.shields.io/badge/Live-API-46E3B7?style=for-the-badge&logo=render&logoColor=white)]

---

<div align="center">
  <sub>Built with love by <a href="https://github.com/Maajid3">Maajid</a></sub>
</div>