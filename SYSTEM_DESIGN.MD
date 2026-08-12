# System Design — Website Shopee Affiliate Link List

## 1. Overview

Website ini merupakan website sederhana untuk menampilkan kumpulan **link Shopee Affiliate**.

Setiap produk hanya terdiri dari:

* Judul/nama produk.
* Link affiliate Shopee.

Di halaman publik, judul produk ditampilkan sebagai **hyperlink yang dapat diklik**.

Tidak ada gambar, harga, deskripsi, rating, review, cart, checkout, atau detail produk.

Konsep utama:

```text
Admin
  ↓
Input Judul Produk
  +
Input Affiliate URL
  ↓
Database
  ↓
Product List
  ↓
Pengunjung klik judul
  ↓
Shopee Affiliate URL
  ↓
Shopee
```

---

# 2. Design Goals

Sistem harus memiliki karakteristik:

* Simple.
* Minimalis.
* Cepat.
* Mobile-first.
* Cute.
* Pink.
* Mudah digunakan.
* Mudah dikelola.
* Mudah dikembangkan.
* Tidak memiliki fitur yang tidak diperlukan.

Prinsip utama:

> **One product = one title = one affiliate link.**

---

# 3. Scope

## Included

* Homepage.
* Product list.
* Product hyperlink.
* Admin login.
* Admin dashboard.
* CRUD produk.
* Pengaturan urutan produk.
* Status aktif/nonaktif.
* Affiliate disclosure.
* Responsive UI.
* Pink cute design.

## Not Included

* Product image.
* Product price.
* Product description.
* Product rating.
* Product review.
* Shopping cart.
* Checkout.
* Payment.
* Order management.
* Customer account.
* Wishlist.
* Inventory.
* Product detail page.

---

# 4. High-Level Architecture

```text
                         ┌─────────────────┐
                         │     Visitor     │
                         └────────┬────────┘
                                  │
                                  ▼
                       ┌─────────────────────┐
                       │    Public Website   │
                       │      Pink UI        │
                       └──────────┬──────────┘
                                  │
                                  ▼
                       ┌─────────────────────┐
                       │     Product Data    │
                       └──────────┬──────────┘
                                  │
                                  ▼
                           ┌─────────────┐
                           │  Database   │
                           └──────▲──────┘
                                  │
                         ┌────────┴────────┐
                         │                 │
                         │   Admin Panel   │
                         │                 │
                         └─────────────────┘
```

---

# 5. Technology Architecture

Recommended architecture:

```text
Frontend
    │
    ▼
Next.js / React
    │
    ├── Public Pages
    ├── Admin Pages
    └── Server Actions / API
              │
              ▼
          Database
              │
              ▼
          PostgreSQL
```

Authentication digunakan hanya untuk admin.

---

# 6. Application Structure

```text
Application
│
├── Public
│   └── Homepage
│
├── Admin
│   ├── Login
│   ├── Dashboard
│   └── Products
│
├── Database
│   └── Products
│
└── External
    └── Shopee Affiliate Links
```

---

# 7. Public Website

Public website hanya memiliki satu halaman utama:

```text
/
```

Homepage berfungsi sebagai halaman kumpulan link.

Struktur:

```text
Header
   ↓
Website Title
   ↓
Short Description
   ↓
Product List
   ↓
Affiliate Disclosure
   ↓
Footer
```

---

# 8. Public UI Design

Tema visual:

**Cute Pink Minimalist**

Karakter visual:

* Soft pink.
* Rounded.
* Clean.
* Banyak whitespace.
* Typography rounded.
* Dekorasi kecil.
* Tidak terlalu ramai.

Contoh layout:

```text
┌───────────────────────────────────┐
│                                   │
│               ♡                   │
│                                   │
│          WEBSITE TITLE            │
│       short description ♡         │
│                                   │
│                                   │
│    ♡ [Judul Produk 1]             │
│                                   │
│    ♡ [Judul Produk 2]             │
│                                   │
│    ♡ [Judul Produk 3]             │
│                                   │
│    ♡ [Judul Produk 4]             │
│                                   │
│    ♡ [Judul Produk 5]             │
│                                   │
│                                   │
│  Affiliate disclosure             │
│                                   │
└───────────────────────────────────┘
```

**Catatan:** `[Judul Produk 1]`, `[Judul Produk 2]`, dan seterusnya hanya placeholder. Nama produk sebenarnya berasal dari database dan dimasukkan oleh admin.

---

# 9. Design System

## 9.1 Color Palette

```text
Primary Pink
#FF7EB6

Soft Pink
#FFE5EF

Very Light Pink
#FFF7FA

Dark Pink
#D94F87

Text
#49353F

White
#FFFFFF
```

---

# 10. Background

Background utama:

```text
#FFF7FA
```

Background harus terasa lembut dan tidak terlalu mencolok.

Tidak menggunakan gradient yang berat.

Jika menggunakan gradient, hanya sebagai dekorasi ringan.

---

# 11. Typography

Rekomendasi font:

```text
Heading:
Nunito / Quicksand / Poppins

Body:
Nunito / Poppins / Inter
```

Karakter font:

* Rounded.
* Friendly.
* Mudah dibaca.
* Tidak terlalu dekoratif.

---

# 12. Header

Header dibuat sederhana.

Contoh:

```text
             ♡

       WEBSITE TITLE

    your little links ♡
```

Elemen:

* Logo/title.
* Subtitle opsional.
* Dekorasi kecil.

Tidak membutuhkan navigation bar.

---

# 13. Product List

Product list adalah komponen paling penting.

Component:

```text
ProductList
    │
    ├── ProductLink
    ├── ProductLink
    ├── ProductLink
    └── ProductLink
```

Setiap item hanya memiliki:

```text
title
affiliate_url
```

---

# 14. Product Link

Tampilan default:

```text
♡ [Judul Produk]
```

Teks `[Judul Produk]` merupakan hyperlink.

Contoh struktur HTML:

```html
<a href="{affiliate_url}" rel="nofollow sponsored">
    {title}
</a>
```

Tidak ada tombol "Buy".

Tidak ada card.

Tidak ada gambar.

---

# 15. Product Link Interaction

### Default

```text
♡ [Judul Produk]
```

### Hover

```text
♡ [Judul Produk]
  ─────────────
```

### Focus

Link mendapatkan outline/focus state yang jelas.

### Mobile

Area klik dibuat cukup besar agar mudah disentuh.

---

# 16. Decorative Elements

Dekorasi boleh menggunakan:

```text
♡
୨୧
☆
✿
```

Penggunaan harus minimal.

Contoh:

```text
♡ [Judul Produk 1]

♡ [Judul Produk 2]

♡ [Judul Produk 3]
```

Dekorasi tidak boleh mengganggu hyperlink.

---

# 17. Responsive Design

Website menggunakan pendekatan mobile-first.

## Mobile

```text
width: 100%
padding: 20px
```

## Desktop

```text
max-width: 600px
margin: auto
```

Layout tetap satu kolom.

Tidak perlu membuat grid produk.

---

# 18. Homepage Component Tree

```text
Homepage
│
├── Header
│   ├── Logo
│   ├── Title
│   └── Subtitle
│
├── ProductList
│   └── ProductLink[]
│
├── AffiliateDisclosure
│
└── Footer
```

---

# 19. Database Architecture

Database MVP hanya membutuhkan satu tabel utama.

```text
products
```

Struktur:

```text
products
│
├── id
├── title
├── affiliate_url
├── sort_order
├── is_active
├── created_at
└── updated_at
```

---

# 20. Product Entity

```text
Product
│
├── id
│   Unique identifier
│
├── title
│   Nama/judul yang ditampilkan
│
├── affiliate_url
│   URL Shopee Affiliate
│
├── sort_order
│   Urutan tampilan
│
├── is_active
│   Status tampil/tidak tampil
│
├── created_at
│   Waktu dibuat
│
└── updated_at
    Waktu terakhir diubah
```

Tidak ada field produk lain yang diperlukan untuk MVP.

---

# 21. Database Schema

Contoh:

```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    title VARCHAR(200) NOT NULL,

    affiliate_url TEXT NOT NULL,

    sort_order INTEGER NOT NULL DEFAULT 0,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

# 22. Product Data Example

Data contoh hanya menggunakan placeholder:

```json
{
  "id": "uuid",
  "title": "[Judul Produk]",
  "affiliate_url": "[Shopee Affiliate URL]",
  "sort_order": 1,
  "is_active": true
}
```

Tidak ada nama produk spesifik yang di-hardcode di sistem.

---

# 23. Homepage Data Flow

```text
Visitor membuka "/"
        │
        ▼
Frontend
        │
        ▼
Request active products
        │
        ▼
Database
        │
        ▼
SELECT products
WHERE is_active = true
        │
        ▼
ORDER BY sort_order ASC
        │
        ▼
Product List
        │
        ▼
Render title sebagai hyperlink
```

---

# 24. Affiliate Click Flow

```text
Visitor
   │
   ▼
Klik [Judul Produk]
   │
   ▼
Browser membuka affiliate_url
   │
   ▼
Shopee
```

Website tidak menangani:

* Checkout.
* Payment.
* Order.
* Shipping.
* Customer data.

---

# 25. Admin Architecture

Admin memiliki area terpisah:

```text
/admin
```

Struktur:

```text
Admin
│
├── Login
│
├── Dashboard
│
└── Products
    ├── List
    ├── Add
    └── Edit
```

---

# 26. Admin Login

Flow:

```text
Admin
  ↓
/admin/login
  ↓
Authentication
  ↓
Valid?
 ├── No → Error
 └── Yes
       ↓
   /admin
```

Semua halaman admin harus protected.

---

# 27. Admin Dashboard

Dashboard dibuat sederhana.

Contoh:

```text
┌─────────────────────────────────┐
│ ♡ ADMIN                         │
│                                 │
│ Products                        │
│                                 │
│ 24 Total                        │
│ 20 Active                       │
│ 4 Inactive                      │
│                                 │
│ [ Manage Products ]             │
└─────────────────────────────────┘
```

Angka di atas hanya contoh UI dan bukan data default.

---

# 28. Admin Product List

```text
Products

[ + Add Product ]

──────────────────────────────

[Judul Produk 1]

[Edit] [Delete]

──────────────────────────────

[Judul Produk 2]

[Edit] [Delete]

──────────────────────────────

[Judul Produk 3]

[Edit] [Delete]
```

Nama produk berasal dari database.

---

# 29. Add Product

Form:

```text
Add Product

Title
┌───────────────────────────┐
│ [Judul Produk]            │
└───────────────────────────┘

Affiliate URL
┌───────────────────────────┐
│ [Shopee Affiliate URL]    │
└───────────────────────────┘

Sort Order
┌─────────┐
│ [1]     │
└─────────┘

Status
○ Active
○ Inactive

[ Save ♡ ]
```

---

# 30. Edit Product

Admin dapat mengubah:

* Title.
* Affiliate URL.
* Sort order.
* Status.

Tidak ada field lain.

---

# 31. Delete Product

Ketika admin memilih delete:

```text
Delete Product?

[Judul Produk]

This action cannot be undone.

[Cancel] [Delete]
```

Konfirmasi wajib sebelum penghapusan.

---

# 32. Product Ordering

Urutan ditentukan oleh:

```text
sort_order
```

Query:

```sql
SELECT *
FROM products
WHERE is_active = TRUE
ORDER BY sort_order ASC;
```

Jika dua produk memiliki urutan yang sama, sistem dapat menggunakan `created_at` sebagai secondary ordering.

---

# 33. Product Status

Terdapat dua status:

```text
ACTIVE
INACTIVE
```

### Active

Produk tampil di homepage.

### Inactive

Produk tetap tersimpan tetapi tidak tampil di homepage.

---

# 34. Validation

## Title

Required.

Maksimum:

```text
200 characters
```

Tidak boleh kosong.

## Affiliate URL

Required.

Harus berupa URL yang valid.

## Sort Order

Harus berupa angka integer.

---

# 35. API Design

Jika menggunakan API:

### List Products

```text
GET /api/products
```

Public hanya mendapatkan produk aktif.

### Create

```text
POST /api/products
```

Admin only.

### Update

```text
PATCH /api/products/:id
```

Admin only.

### Delete

```text
DELETE /api/products/:id
```

Admin only.

---

# 36. API Response

Public response:

```json
[
  {
    "id": "uuid",
    "title": "[Judul Produk]",
    "affiliate_url": "[Shopee Affiliate URL]"
  }
]
```

Admin response dapat menyertakan:

```text
sort_order
is_active
created_at
updated_at
```

---

# 37. Security

Security requirements:

* Admin wajib authentication.
* CRUD API hanya dapat digunakan admin.
* Database credentials tidak boleh exposed.
* Input harus divalidasi server-side.
* Affiliate URL harus divalidasi.
* Gunakan HTTPS.
* Gunakan secure session/cookie.
* Admin route harus protected.

---

# 38. SEO

Homepage harus memiliki:

```text
Title
Meta Description
H1
Canonical URL
Robots
Sitemap
```

Contoh:

```text
Title:
[Website Title]

Description:
[Website Description]
```

Tidak menggunakan nama produk spesifik sebagai static SEO content.

Produk berasal dari database.

---

# 39. Accessibility

Requirement:

* Semua produk menggunakan elemen `<a>`.
* Link dapat dinavigasi menggunakan keyboard.
* Focus state terlihat.
* Text memiliki contrast yang cukup.
* Ukuran font nyaman.
* Touch target cukup besar.
* Dekorasi tidak menjadi satu-satunya informasi.

---

# 40. Performance

Website harus sangat ringan.

Tidak diperlukan:

* Image loading.
* Video.
* Heavy animation.
* Large UI library.
* Complex JavaScript.
* Client-side state management yang kompleks.

Homepage pada dasarnya hanya:

```text
HTML
+
CSS
+
Product Data
```

---

# 41. Recommended Rendering

Jika menggunakan Next.js, homepage dapat menggunakan server-side/static rendering.

Flow:

```text
Request
   ↓
Server
   ↓
Database
   ↓
Products
   ↓
HTML
   ↓
Browser
```

Karena produk hanya berupa text link, pendekatan ini sangat ringan.

---

# 42. Suggested Project Structure

```text
src/
│
├── app/
│   │
│   ├── page.tsx
│   │
│   └── admin/
│       ├── page.tsx
│       │
│       ├── login/
│       │   └── page.tsx
│       │
│       └── products/
│           ├── page.tsx
│           ├── new/
│           │   └── page.tsx
│           │
│           └── [id]/
│               └── edit/
│                   └── page.tsx
│
├── components/
│   ├── Header.tsx
│   ├── ProductList.tsx
│   ├── ProductLink.tsx
│   ├── AffiliateDisclosure.tsx
│   └── Footer.tsx
│
├── components/admin/
│   ├── ProductForm.tsx
│   ├── ProductList.tsx
│   └── DeleteDialog.tsx
│
├── lib/
│   ├── db.ts
│   ├── auth.ts
│   └── validation.ts
│
└── styles/
    └── globals.css
```

---

# 43. UI Component Specification

## Header

Props:

```text
title
subtitle
```

## ProductList

Props:

```text
products[]
```

## ProductLink

Props:

```text
title
affiliate_url
```

## AffiliateDisclosure

Props:

```text
text
```

---

# 44. CSS Design Tokens

```css
:root {
  --color-primary: #ff7eb6;
  --color-primary-dark: #d94f87;

  --color-background: #fff7fa;
  --color-surface: #ffffff;

  --color-text: #49353f;
  --color-text-muted: #8a737d;

  --color-border: #ffd9e7;

  --radius-sm: 10px;
  --radius-md: 16px;
  --radius-lg: 24px;

  --container-width: 600px;
}
```

---

# 45. Homepage Styling

Container:

```css
.container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 24px 20px;
}
```

Product list:

```css
.product-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
```

Product link:

```css
.product-link {
  color: var(--color-primary-dark);
  text-decoration: none;
}
```

Hover:

```css
.product-link:hover {
  text-decoration: underline;
}
```

---

# 46. Visual Hierarchy

Urutan visual:

```text
1. Website Title
       ↓
2. Subtitle
       ↓
3. Product Links
       ↓
4. Affiliate Disclosure
```

Product links merupakan elemen paling penting setelah title.

---

# 47. Mobile UX

Pada mobile:

* Container menggunakan hampir seluruh lebar layar.
* Product link memiliki padding vertikal.
* Font minimal nyaman dibaca.
* Jarak antar link cukup besar.
* Tidak menggunakan horizontal scrolling.
* Tidak ada menu kompleks.

Contoh:

```text
┌─────────────────────────────┐
│                             │
│             ♡               │
│       WEBSITE TITLE         │
│       cute links ♡         │
│                             │
│  ♡ [Judul Produk 1]        │
│                             │
│  ♡ [Judul Produk 2]        │
│                             │
│  ♡ [Judul Produk 3]        │
│                             │
│  ♡ [Judul Produk 4]        │
│                             │
└─────────────────────────────┘
```

---

# 48. Desktop UX

Desktop menggunakan container sempit:

```text
                 ┌────────────────────┐
                 │        ♡           │
                 │   WEBSITE TITLE    │
                 │                    │
                 │ ♡ [Judul Produk 1]│
                 │                    │
                 │ ♡ [Judul Produk 2]│
                 │                    │
                 │ ♡ [Judul Produk 3]│
                 │                    │
                 │ ♡ [Judul Produk 4]│
                 │                    │
                 └────────────────────┘
```

Tidak perlu menggunakan full-width product grid.

---

# 49. Error State

Jika produk gagal dimuat:

```text
♡ Oops!

The links couldn't be loaded.
Please try again later.
```

Jika belum ada produk:

```text
♡ Nothing here yet!

New links are coming soon.
```

Pesan bersifat generic dan tidak mengandung produk spesifik.

---

# 50. Affiliate Disclosure

Footer:

```text
♡ Affiliate Disclosure

Some links on this website are affiliate links.
We may earn a commission when you make a purchase
through these links.
```

Bahasa dapat disesuaikan dengan target audience website.

---

# 51. Deployment Architecture

Recommended:

```text
                 Internet
                    │
                    ▼
              ┌───────────┐
              │  Vercel   │
              └─────┬─────┘
                    │
                    ▼
              ┌───────────┐
              │ Next.js   │
              └─────┬─────┘
                    │
                    ▼
              ┌───────────┐
              │ Database  │
              └───────────┘
```

Domain:

```text
[YOUR-DOMAIN]
```

Tidak ditentukan di system design.

---

# 52. Environment Variables

Contoh:

```text
DATABASE_URL=
AUTH_SECRET=
NEXT_PUBLIC_SITE_URL=
```

Credential tidak boleh disimpan langsung di source code.

---

# 53. Logging

Minimal logging untuk:

* Authentication failure.
* Database error.
* Product creation error.
* Product update error.
* Product deletion error.

Tidak perlu analytics kompleks untuk MVP.

---

# 54. Backup

Database sebaiknya memiliki backup otomatis sesuai kemampuan provider database.

Data utama yang harus dibackup:

```text
products
```

---

# 55. Scalability

Sistem sengaja dibuat sederhana sehingga dapat menangani pertumbuhan jumlah link tanpa perubahan arsitektur besar.

Jika jumlah produk bertambah:

```text
Database
   ↓
Pagination / caching
   ↓
Product List
```

Pagination hanya diperlukan jika jumlah link sudah cukup besar.

---

# 56. Future Enhancement

Fitur berikut dapat ditambahkan kemudian:

* Click tracking.
* Analytics.
* Search.
* Category.
* Multiple collections.
* Featured links.
* Custom ordering dengan drag-and-drop.
* Import CSV.
* Bulk product management.
* Scheduled publishing.
* Multiple admin.
* Dark mode.

Fitur-fitur tersebut **tidak termasuk MVP**.

---

# 57. Final UX Principle

Website harus terasa seperti:

> **A cute, pink, simple page full of useful clickable links.**

Bukan seperti marketplace.

Bukan seperti e-commerce.

Bukan seperti katalog produk lengkap.

Tampilan publik cukup:

```text
             ♡

        WEBSITE TITLE
       cute links for you


    ♡ [Judul Produk 1]

    ♡ [Judul Produk 2]

    ♡ [Judul Produk 3]

    ♡ [Judul Produk 4]

    ♡ [Judul Produk 5]


       affiliate disclosure ♡
```

Semua `[Judul Produk]` adalah **data dinamis dari database**.

Tidak ada nama produk spesifik yang ditentukan oleh system design.

---

# 58. Final Architecture

```text
                         ┌───────────────┐
                         │    ADMIN      │
                         └───────┬───────┘
                                 │
                         CRUD Products
                                 │
                                 ▼
                         ┌───────────────┐
                         │   DATABASE    │
                         │               │
                         │ title         │
                         │ affiliate_url │
                         │ sort_order    │
                         │ is_active     │
                         └───────┬───────┘
                                 │
                                 ▼
                         ┌───────────────┐
                         │   HOMEPAGE    │
                         │   PINK UI     │
                         └───────┬───────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │ ♡ [Judul Produk 1]     │
                    │ ♡ [Judul Produk 2]     │
                    │ ♡ [Judul Produk 3]     │
                    │ ♡ [Judul Produk 4]     │
                    └───────────┬────────────┘
                                │
                                ▼
                         SHOPEE AFFILIATE
```

**Core system:**

```text
Admin → Database → List Link → Shopee
```

Semua kompleksitas yang tidak dibutuhkan sengaja dihilangkan agar website tetap **ringan, cepat, cute, dan mudah dikelola**.
