# Nivaroa — Modern E-Commerce Platform

A fast, elegant, and production-ready e-commerce platform built with **Next.js 16 (App Router & React 19)**, **Tailwind CSS v4**, **Shadcn / Base UI**, and **Supabase** (PostgreSQL, Storage, Auth, and RLS).

---

## 🌟 Key Features

### 🛍️ Storefront Experience
- **Daraz-Style Autoplay Hero Slider**: Dynamic featured products carousel with gradient themes, ambient halos, auto-pause on hover, touch swipe support, and glassmorphic inside-overlapping navigation controls.
- **Curated Essentials Carousel**: Multi-item featured products showcase with pagination indicators and touch-optimized responsive card basis.
- **Category-Wise Product Showcases**: Distinct departmental sections displaying up to 5 curated products per category with smooth horizontal swipe on mobile and a 5-column grid on desktop.
- **Dynamic Category Pages (`/categories/[slug]` & `/category/[slug]`)**:
  - Full Server-Side Generation with static params pre-rendering (`generateStaticParams`).
  - Interactive category switcher chips.
  - Live client-side product filtering (by stock status & in-category search).
  - Live sorting (*Featured First*, *Newest*, *Price: Low to High*, *Price: High to Low*).
  - Breadcrumb navigation and item counters.
- **Categories Directory (`/categories`)**: Visual department directory displaying item counts and direct collection links.
- **Complete Shop Catalog (`/shop`)**: Browse the entire catalog with automatic query redirection (`/shop?category=[slug]` → `/categories/[slug]`).
- **Resilient Image Presentation**: Zero broken image states with `<ProductCardImage>`, loading skeletons, unclipped `object-contain` scaling, and graceful `<Package />` fallbacks.
- **Dynamic Navbar & Footer**:
  - Live database-cached categories.
  - Desktop dropdown navigation with hover debounce buffering.
  - Mobile slide-out drawer navigation.
  - Reactive User Account badge & dropdown (`UserNav`) with instant sign-in / profile switch / sign-out.

### 🔐 Authentication & Access Control
- **Customer Registration (`/register`)**: Email and password registration with Zod validation, automated profile creation, and Google OAuth.
- **User & Admin Login (`/login`, `/admin/login`)**: Role-aware login routing (customers redirected to storefront or previous destination, admins routed to `/admin`).
- **Google OAuth ("Continue with Google")**: One-click Google sign-in using Supabase PKCE OAuth with server callback exchange (`/auth/callback`).
- **Password Recovery**: Complete self-service forgot password (`/forgot-password`) and reset password (`/reset-password`) flow.
- **Proxy Validation Engine (`src/lib/proxy.ts`)**:
  - `AdminProxy`: Guards all administrative routes; verifies valid session and `profiles.role === 'admin'`.
  - `UserProxy`: Protects customer accounts and authenticated checkouts.
  - `GuestProxy`: Prevents authenticated users from accessing login/registration pages.
  - `getCurrentUser`: Safe non-redirecting session inspector for server components and layouts.
- **Automated Profile Provisioning**: PostgreSQL `handle_new_user()` trigger on `auth.users` automatically synchronizes customer profile records upon sign-up or OAuth login.

### 🛡️ Admin Portal (`/admin`)
- **Inventory & Product Management (`/admin/product`)**:
  - Real-time catalog table with stock statistics and low-stock alerts (< 5 units).
  - "Featured" badge toggle to promote items directly to the homepage hero slider.
- **Product Creation & Editing (`/admin/add-product`, `/admin/product/[id]/edit`)**:
  - Direct file upload to Supabase Storage `products` bucket.
  - Zod-validated forms with React Hook Form.
- **Hierarchical Category Management (`/admin/categories`)**:
  - Multi-level parent-child category tree with automatic slug generation.
- **Role-Based Access Control (RBAC)**:
  - Secured with Supabase Auth, `AdminProxy`, and PostgreSQL Row Level Security (RLS) policies (`profiles.role = 'admin'`).

### ⚡ Performance & Caching
- **Zero Redundant API Calls**: Powered by Next.js `unstable_cache` with granular revalidation tags (`categories`, `products`, `featured-products`).
- **Next.js Image Optimization**: Wildcard remote patterns for Supabase Storage (`*.supabase.co`), Unsplash, and fallback placeholders.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack, Server Actions)
- **Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Base UI](https://base-ui.com/), [Shadcn UI](https://ui.shadcn.com/), [Embla Carousel](https://www.embla-carousel.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL, Storage, Auth, RLS)
- **Form Handling & Validation**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)

---

## 📂 Project Structure

```text
src/
├── app/
│   ├── (admin)/                 # Protected admin portal routes
│   │   ├── admin/
│   │   │   ├── categories/      # Category management (new, edit, list)
│   │   │   ├── product/         # Product catalog and stock management
│   │   │   ├── add-product/     # New product creation
│   │   │   └── page.tsx         # Admin dashboard overview
│   │   └── layout.tsx
│   ├── (auth)/                  # Authentication routes (login)
│   ├── (store)/                 # Public storefront routes
│   │   ├── categories/          # Category directory & /categories/[slug] detail
│   │   ├── category/[slug]/     # Re-exported category detail alias
│   │   ├── shop/                # Global product shop
│   │   ├── page.tsx             # Homepage with Hero, Featured & Category sections
│   │   └── layout.tsx
│   ├── globals.css              # Tailwind v4 styles & theme tokens
│   └── layout.tsx               # Root application layout
├── components/
│   ├── admin/                   # Admin layout and sidebar navigation
│   ├── store/
│   │   ├── category/            # Category product views, filters & sorting
│   │   ├── home/                # Hero carousel, featured carousel, category sections
│   │   └── layouts/             # Navbar, mobile drawer, dropdowns, footer
│   └── ui/                      # Base UI / Shadcn design primitives (Button, Carousel, etc.)
├── features/
│   ├── categories/              # Category schemas, actions, tree helpers & data caching
│   └── products/                # Product schemas, upload actions, forms & data queries
├── utils/
│   └── supabase/                # Supabase browser, server & middleware clients
└── constant/                    # Brand assets, logos & static images
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 20+ installed
- A [Supabase](https://supabase.com/) project with Database and Storage enabled

### 2. Environment Configuration
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### 3. Database & Storage Setup
Execute the migration scripts located in `supabase/migrations/`:
- `20261007230104_create_product.sql`: Creates `categories`, `products`, `profiles` tables, and RLS policies.
- `20261009060700_add_is_featured_to_products.sql`: Adds the `is_featured` column and performance index for carousel highlights.
- `20261010023000_create_profile_trigger_and_policies.sql`: Adds the `handle_new_user()` trigger for automated user profile creation and customer RLS policies.

In your Supabase Storage dashboard, create a public bucket named:
- **`products`** (Public access enabled for `/catalog/*` images)

### 4. Install Dependencies & Run
```bash
# Install packages
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the storefront.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server with Turbopack |
| `npm run build` | Builds the application for production deployment |
| `npm run start` | Starts the production server |
| `npm run lint` | Runs ESLint to check for code issues |

---

## 🔒 Security & Data Integrity

- **Row Level Security (RLS)**: Public users have read-only access to products and categories. All create, update, and delete mutations require an authenticated user with an `admin` role in `profiles`.
- **Image Sanitization**: Product image uploads are validated and stored with unique timestamped keys in Supabase Storage.
- **Type Safety**: End-to-end TypeScript validation from database schemas (Zod) to front-end components.

---

## 📄 License

This project is licensed under the MIT License.
