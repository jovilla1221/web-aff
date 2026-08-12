# PRD — Website List Link Shopee Affiliate

## 1. Ringkasan

Website sederhana untuk menampilkan **daftar produk Shopee Affiliate**.

Setiap produk hanya ditampilkan sebagai **teks/judul yang berbentuk hyperlink**. Ketika pengunjung mengklik judul produk, pengunjung diarahkan ke URL Shopee Affiliate terkait.

Website tidak memiliki fungsi marketplace, checkout, keranjang, pembayaran, atau halaman detail produk.

### Konsep utama

```text
Website
│
├── Judul Website
│
├── List Produk
│   ├── Nama Produk → Link Shopee Affiliate
│   ├── Nama Produk → Link Shopee Affiliate
│   ├── Nama Produk → Link Shopee Affiliate
│   └── dst.
│
└── Footer
```

---

# 2. Tujuan Produk

Tujuan utama website:

1. Menyediakan tempat terpusat untuk mengumpulkan link produk Shopee Affiliate.
2. Membuat daftar link mudah dibaca dan diklik.
3. Mengarahkan pengunjung dari website ke Shopee melalui affiliate link.
4. Membuat website yang sangat ringan dan cepat.
5. Memudahkan admin menambah dan mengelola link produk.

---

# 3. Target Pengguna

## 3.1 Pengunjung

Pengunjung yang ingin melihat daftar rekomendasi produk dan mengakses produk tersebut di Shopee.

## 3.2 Admin

Pemilik website yang bertugas:

* Menambahkan produk.
* Mengubah nama produk.
* Mengubah link affiliate.
* Menghapus produk.
* Mengatur urutan produk.

---

# 4. Konsep UI

UI harus **minimalis dan sederhana**.

Tidak menggunakan:

* Product card.
* Gambar produk.
* Harga.
* Rating.
* Review.
* Deskripsi produk.
* Tombol kompleks.
* Keranjang.
* Checkout.

Produk hanya berupa:

```text
Nama Produk
```

Nama tersebut merupakan hyperlink.

### Contoh

```text
# Rekomendasi Produk Shopee

1. Wireless Mechanical Keyboard
2. Mouse Gaming Wireless
3. USB Hub 4 Port
4. Headset Gaming
5. Stand Laptop
```

Namun secara visual setiap nama produk merupakan link:

```text
[Wireless Mechanical Keyboard]
[Mouse Gaming Wireless]
[USB Hub 4 Port]
[Headset Gaming]
[Stand Laptop]
```

---

# 5. Homepage

Homepage merupakan halaman utama website.

## Struktur

```text
Header
│
├── Nama Website
└── Deskripsi singkat (opsional)

Main
│
└── List Produk

Footer
└── Affiliate Disclosure
```

---

# 6. Header

Header hanya berisi:

* Nama/logo website.
* Judul website.

Contoh:

```text
Shopee Picks
```

Tidak membutuhkan navbar kompleks.

---

# 7. Product List

Bagian utama website adalah daftar produk.

Setiap item terdiri dari dua data:

```text
title
affiliate_url
```

Contoh:

```text
Wireless Mechanical Keyboard
https://s.shopee.co.id/xxxxx
```

Pada frontend:

```html
<a href="https://s.shopee.co.id/xxxxx">
    Wireless Mechanical Keyboard
</a>
```

---

# 8. Product Item

Setiap produk harus memenuhi ketentuan:

* Hanya menampilkan nama/judul produk.
* Nama produk adalah hyperlink.
* Link mengarah ke Shopee Affiliate.
* Tidak menampilkan URL mentah.
* Tidak menampilkan gambar.
* Tidak menampilkan harga.
* Tidak menampilkan deskripsi.

### Contoh tampilan

```text
Rekomendasi Produk

Wireless Mechanical Keyboard

Mouse Gaming Wireless

USB Hub 4 Port

Headset Gaming

Stand Laptop
```

Setiap teks produk di atas dapat diklik.

---

# 9. Data Produk

Struktur data minimum:

```text
Product
├── id
├── title
├── affiliate_url
├── sort_order
├── is_active
├── created_at
└── updated_at
```

## Field

### id

ID unik produk.

### title

Nama/judul yang ditampilkan kepada pengunjung.

Contoh:

```text
Wireless Mechanical Keyboard
```

### affiliate_url

URL affiliate Shopee.

Contoh:

```text
https://s.shopee.co.id/xxxxx
```

### sort_order

Menentukan urutan produk pada halaman.

### is_active

Menentukan apakah produk ditampilkan atau tidak.

### created_at

Tanggal produk dibuat.

### updated_at

Tanggal terakhir produk diubah.

---

# 10. Admin Panel

Admin panel dibuat sederhana.

Admin dapat melihat daftar produk:

```text
Produk

1. Wireless Mechanical Keyboard
   [Edit] [Hapus]

2. Mouse Gaming Wireless
   [Edit] [Hapus]

3. USB Hub 4 Port
   [Edit] [Hapus]
```

---

# 11. Tambah Produk

Admin memiliki form:

```text
Tambah Produk

Nama Produk
[____________________________]

Shopee Affiliate Link
[____________________________]

Urutan
[____]

[ Simpan ]
```

Setelah disimpan, produk langsung tersedia di homepage jika statusnya aktif.

---

# 12. Edit Produk

Admin dapat mengubah:

* Nama produk.
* Affiliate URL.
* Urutan.
* Status aktif/nonaktif.

Contoh:

```text
Edit Produk

Nama Produk
[Wireless Mechanical Keyboard]

Shopee Affiliate Link
[https://s.shopee.co.id/xxxxx]

Urutan
[1]

Status
[Aktif]

[ Simpan Perubahan ]
```

---

# 13. Hapus Produk

Admin dapat menghapus produk.

Sebelum menghapus, sistem menampilkan konfirmasi:

```text
Apakah Anda yakin ingin menghapus produk ini?

[ Batal ] [ Hapus ]
```

---

# 14. Urutan Produk

Produk ditampilkan berdasarkan `sort_order`.

Contoh:

```text
sort_order = 1
Wireless Mechanical Keyboard

sort_order = 2
Mouse Gaming Wireless

sort_order = 3
USB Hub 4 Port
```

Maka frontend menampilkan:

```text
Wireless Mechanical Keyboard
Mouse Gaming Wireless
USB Hub 4 Port
```

Admin dapat mengubah urutan.

---

# 15. Link Behavior

Ketika pengunjung mengklik produk:

```text
User
 ↓
Klik Nama Produk
 ↓
Affiliate URL
 ↓
Shopee
```

Website tidak melakukan transaksi.

Website juga tidak menyimpan informasi pembayaran.

---

# 16. Affiliate Link

Semua produk harus memiliki affiliate URL.

Validasi minimal:

* URL tidak boleh kosong.
* URL harus memiliki format URL yang valid.
* Admin tidak dapat menyimpan produk tanpa affiliate URL.

Contoh:

```text
Title:
Mouse Gaming Wireless

Affiliate URL:
https://s.shopee.co.id/xxxxx
```

---

# 17. Affiliate Disclosure

Website harus memberikan informasi bahwa website menggunakan affiliate link.

Contoh:

```text
Disclosure: Beberapa link di website ini merupakan link affiliate.
Kami dapat menerima komisi apabila Anda melakukan pembelian melalui
link tersebut.
```

Disclosure dapat ditempatkan di footer.

---

# 18. Search Engine Optimization

Karena website sangat sederhana, SEO juga dibuat sederhana.

Homepage harus memiliki:

* `<title>`.
* Meta description.
* Heading utama.
* URL yang sederhana.
* Sitemap.
* Robots.txt.

Contoh:

```text
Title:
Rekomendasi Produk Shopee

Description:
Daftar rekomendasi produk pilihan dari Shopee.
```

---

# 19. Responsive Design

Website harus responsive.

### Mobile

List produk memenuhi lebar layar dengan margin yang nyaman.

### Desktop

List tetap sederhana dan tidak perlu menggunakan layout kompleks.

Prioritas utama:

```text
Mobile > Tablet > Desktop
```

---

# 20. Performance

Website harus sangat ringan.

Requirement:

* Tidak menggunakan gambar produk.
* Tidak menggunakan video.
* JavaScript seminimal mungkin.
* CSS seminimal mungkin.
* Tidak menggunakan library UI besar jika tidak diperlukan.
* Page load cepat.
* HTML sederhana.

Target utama:

> Website harus terasa seperti halaman daftar link yang sangat cepat dibuka.

---

# 21. Security

Admin panel harus dilindungi dengan authentication.

Pengunjung umum:

```text
GET homepage
GET product links
```

Admin:

```text
LOGIN
   ↓
Dashboard
   ↓
CRUD Products
```

Pengunjung tidak boleh dapat mengubah data produk.

---

# 22. Database

Database minimum:

### products

```text
products
├── id
├── title
├── affiliate_url
├── sort_order
├── is_active
├── created_at
└── updated_at
```

Tidak membutuhkan tabel:

* Orders.
* Customers.
* Payments.
* Cart.
* Reviews.
* Inventory.
* Products detail.
* Product variants.

---

# 23. Routing

Minimal routing:

```text
/
```

Homepage.

Admin:

```text
/admin
/admin/login
/admin/products
/admin/products/new
/admin/products/:id/edit
```

Tidak perlu route detail produk publik.

---

# 24. Teknologi

Teknologi dapat disesuaikan dengan kebutuhan developer.

Contoh stack:

### Frontend

* Next.js
* React
* CSS/Tailwind CSS

### Backend

* Next.js API / server actions

### Database

* PostgreSQL
* Supabase

### Authentication

* Supabase Auth atau authentication sederhana yang aman.

### Hosting

* Vercel atau platform hosting sejenis.

Stack bukan requirement mutlak. Yang paling penting adalah hasil akhirnya tetap sederhana.

---

# 25. MVP

MVP wajib memiliki:

* Homepage.
* Judul website.
* Daftar produk.
* Nama produk berbentuk hyperlink.
* Affiliate URL Shopee.
* Admin login.
* Tambah produk.
* Edit produk.
* Hapus produk.
* Atur urutan produk.
* Aktif/nonaktif produk.
* Affiliate disclosure.
* Responsive design.

---

# 26. Fitur yang Tidak Dibutuhkan

Untuk menjaga scope tetap sederhana, fitur berikut **tidak termasuk MVP**:

* Shopping cart.
* Checkout.
* Payment gateway.
* User registration.
* User login.
* Product image.
* Product description.
* Product price.
* Product rating.
* Product review.
* Wishlist.
* Inventory.
* Order management.
* Chat.
* Komentar.
* Product comparison.
* Marketplace functionality.

---

# 27. Acceptance Criteria

## Homepage

* [ ] Homepage dapat dibuka tanpa login.
* [ ] Homepage menampilkan nama website.
* [ ] Homepage menampilkan daftar produk.
* [ ] Setiap produk hanya menampilkan judul/nama produk.
* [ ] Judul produk merupakan hyperlink.
* [ ] Hyperlink mengarah ke affiliate URL yang telah disimpan.
* [ ] Produk nonaktif tidak ditampilkan.
* [ ] Urutan produk sesuai `sort_order`.

## Admin

* [ ] Admin dapat login.
* [ ] Admin dapat melihat daftar produk.
* [ ] Admin dapat menambahkan produk.
* [ ] Admin dapat mengedit produk.
* [ ] Admin dapat menghapus produk.
* [ ] Admin dapat mengubah urutan produk.
* [ ] Admin dapat mengaktifkan/nonaktifkan produk.
* [ ] Affiliate URL wajib diisi.
* [ ] Affiliate URL harus memiliki format URL yang valid.

## Responsive

* [ ] Website dapat digunakan di smartphone.
* [ ] Website dapat digunakan di tablet.
* [ ] Website dapat digunakan di desktop.
* [ ] Link mudah diklik pada layar mobile.

---

# 28. Contoh Final UI

Website publik cukup seperti ini:

```text
────────────────────────────────────

        SHOPEE PICKS

  Rekomendasi produk pilihan

────────────────────────────────────

Wireless Mechanical Keyboard

Mouse Gaming Wireless

USB Hub 4 Port

Headset Gaming

Stand Laptop

Kabel USB Type-C

Laptop Stand Aluminium

────────────────────────────────────

Disclosure: Beberapa link merupakan
link affiliate Shopee.

────────────────────────────────────
```

Tidak ada card.

Tidak ada gambar.

Tidak ada harga.

Tidak ada deskripsi.

Tidak ada tombol "Buy".

**Nama produk = hyperlink affiliate.**

---

# 29. Contoh Data

```json
[
  {
    "title": "Wireless Mechanical Keyboard",
    "affiliate_url": "https://s.shopee.co.id/xxxxx",
    "sort_order": 1,
    "is_active": true
  },
  {
    "title": "Mouse Gaming Wireless",
    "affiliate_url": "https://s.shopee.co.id/yyyyy",
    "sort_order": 2,
    "is_active": true
  },
  {
    "title": "USB Hub 4 Port",
    "affiliate_url": "https://s.shopee.co.id/zzzzz",
    "sort_order": 3,
    "is_active": true
  }
]
```

---

# 30. Product Principle

Prinsip utama proyek:

> **One product = one text link.**

Website bukan toko online.

Website bukan katalog produk lengkap.

Website adalah **landing page/list sederhana yang berisi kumpulan link Shopee Affiliate**.

Alur bisnis:

```text
Traffic
   ↓
Website
   ↓
List Produk
   ↓
Klik Nama Produk
   ↓
Shopee Affiliate Link
   ↓
Shopee
```

# 31. Definition of Done

Project dianggap selesai apabila:

1. Pengunjung dapat membuka homepage.
2. Pengunjung dapat melihat daftar nama produk.
3. Setiap nama produk dapat diklik.
4. Setiap klik mengarah ke affiliate link yang benar.
5. Admin dapat mengelola seluruh daftar link.
6. Website berjalan dengan baik di mobile dan desktop.
7. Website memiliki affiliate disclosure.
8. Tidak terdapat fitur marketplace yang tidak diperlukan.
9. Tampilan tetap sederhana.
10. Website dapat digunakan sebagai tempat utama untuk mengumpulkan dan mendistribusikan link Shopee Affiliate.
