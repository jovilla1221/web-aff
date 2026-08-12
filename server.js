const express = require('express');
const session = require('express-session');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Admin Default Credentials
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'shopee-affiliate-secret-key-cute-pink',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: true,
      secure: false, // Set true in production HTTPS
    },
  })
);

// Serve static assets from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Auth Middleware for Admin APIs
function requireAuth(req, res, next) {
  if (req.session && req.session.isAdmin) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized: Access restricted to Admin' });
}

// URL Validator Helper
function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

// ==========================================
// PUBLIC API ROUTES
// ==========================================

// GET /api/categories — Fetch all categories for public tabs
app.get('/api/categories', (req, res) => {
  try {
    const categories = db.getAllCategories();
    return res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({ error: 'Gagal mengambil data kategori' });
  }
});

// GET /api/products — Fetch active products for homepage
app.get('/api/products', (req, res) => {
  try {
    const products = db.getActiveProducts();
    const publicProducts = products.map((p) => ({
      id: p.id,
      title: p.title,
      affiliate_url: p.affiliate_url,
      category: p.category || 'kawat_bulu',
    }));
    return res.json(publicProducts);
  } catch (error) {
    console.error('Error fetching public products:', error);
    return res.status(500).json({ error: 'Gagal mengambil data produk' });
  }
});

// ==========================================
// ADMIN AUTH ROUTES
// ==========================================

// POST /api/admin/login — Admin Login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username dan password wajib diisi' });
  }

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    req.session.isAdmin = true;
    req.session.username = username;
    return res.json({ success: true, message: 'Login berhasil' });
  }

  return res.status(401).json({ error: 'Username atau password salah' });
});

// POST /api/admin/logout — Admin Logout
app.post('/api/admin/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Gagal logout' });
    }
    res.clearCookie('connect.sid');
    return res.json({ success: true, message: 'Logout berhasil' });
  });
});

// GET /api/admin/check-auth — Check Auth Status
app.get('/api/admin/check-auth', (req, res) => {
  if (req.session && req.session.isAdmin) {
    return res.json({ authenticated: true, username: req.session.username });
  }
  return res.json({ authenticated: false });
});

// ==========================================
// ADMIN CATEGORY (KATALOG) CRUD API ROUTES
// ==========================================

// GET /api/admin/categories — List all categories
app.get('/api/admin/categories', requireAuth, (req, res) => {
  try {
    const categories = db.getAllCategories();
    return res.json(categories);
  } catch (error) {
    console.error('Error fetching admin categories:', error);
    return res.status(500).json({ error: 'Gagal mengambil daftar kategori' });
  }
});

// POST /api/admin/categories — Create category
app.post('/api/admin/categories', requireAuth, (req, res) => {
  const { name, sort_order } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'Nama katalog/kategori wajib diisi' });
  }

  try {
    const newCategory = db.createCategory({
      name,
      sort_order: sort_order !== undefined ? parseInt(sort_order, 10) : 0,
    });

    const allCategories = db.getAllCategories();
    return res.status(201).json({
      success: true,
      category: newCategory,
      categories: allCategories,
    });
  } catch (error) {
    console.error('Error creating category:', error);
    return res.status(500).json({ error: 'Gagal menyimpan kategori baru' });
  }
});

// PUT /api/admin/categories/:id — Update category
app.put('/api/admin/categories/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const { name, sort_order } = req.body;

  try {
    const updated = db.updateCategory(id, {
      name,
      sort_order: sort_order !== undefined ? parseInt(sort_order, 10) : undefined,
    });

    if (!updated) {
      return res.status(404).json({ error: 'Kategori tidak ditemukan' });
    }

    const allCategories = db.getAllCategories();
    return res.json({
      success: true,
      category: updated,
      categories: allCategories,
    });
  } catch (error) {
    console.error('Error updating category:', error);
    return res.status(500).json({ error: 'Gagal mengedit kategori' });
  }
});

// DELETE /api/admin/categories/:id — Delete category
app.delete('/api/admin/categories/:id', requireAuth, (req, res) => {
  const { id } = req.params;

  try {
    const success = db.deleteCategory(id);
    if (success) {
      const allCategories = db.getAllCategories();
      return res.json({
        success: true,
        message: 'Kategori berhasil dihapus',
        categories: allCategories,
      });
    }
    return res.status(500).json({ error: 'Gagal menghapus kategori' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return res.status(500).json({ error: 'Gagal menghapus kategori' });
  }
});

// ==========================================
// ADMIN PRODUCT CRUD API ROUTES
// ==========================================

// GET /api/admin/products — List all products (active & inactive)
app.get('/api/admin/products', requireAuth, (req, res) => {
  try {
    const products = db.getAllProducts();
    return res.json(products);
  } catch (error) {
    console.error('Error fetching admin products:', error);
    return res.status(500).json({ error: 'Gagal mengambil daftar produk' });
  }
});

// POST /api/admin/products — Create new product
app.post('/api/admin/products', requireAuth, (req, res) => {
  const { title, affiliate_url, category, sort_order, is_active } = req.body;

  // Validation
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({ error: 'Nama produk (title) wajib diisi' });
  }

  if (title.trim().length > 200) {
    return res.status(400).json({ error: 'Nama produk maksimal 200 karakter' });
  }

  if (!affiliate_url || typeof affiliate_url !== 'string' || !isValidUrl(affiliate_url.trim())) {
    return res.status(400).json({ error: 'Link affiliate Shopee harus berupa URL yang valid (http/https)' });
  }

  try {
    const newProduct = db.createProduct({
      title,
      affiliate_url,
      category: category || 'kawat_bulu',
      sort_order: sort_order !== undefined ? parseInt(sort_order, 10) : 0,
      is_active: is_active !== undefined ? Boolean(is_active) : true,
    });

    return res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({ error: 'Gagal menyimpan produk baru' });
  }
});

// PUT /api/admin/products/:id — Update existing product
app.put('/api/admin/products/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const { title, affiliate_url, category, sort_order, is_active } = req.body;

  const existing = db.getProductById(id);
  if (!existing) {
    return res.status(404).json({ error: 'Produk tidak ditemukan' });
  }

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({ error: 'Nama produk tidak boleh kosong' });
    }
    if (title.trim().length > 200) {
      return res.status(400).json({ error: 'Nama produk maksimal 200 karakter' });
    }
  }

  if (affiliate_url !== undefined) {
    if (typeof affiliate_url !== 'string' || !isValidUrl(affiliate_url.trim())) {
      return res.status(400).json({ error: 'Link affiliate Shopee harus berupa URL yang valid' });
    }
  }

  try {
    const updated = db.updateProduct(id, {
      title,
      affiliate_url,
      category,
      sort_order: sort_order !== undefined ? parseInt(sort_order, 10) : undefined,
      is_active: is_active !== undefined ? Boolean(is_active) : undefined,
    });

    return res.json(updated);
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({ error: 'Gagal mengedit produk' });
  }
});

// DELETE /api/admin/products/:id — Delete product
app.delete('/api/admin/products/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const existing = db.getProductById(id);
  if (!existing) {
    return res.status(404).json({ error: 'Produk tidak ditemukan' });
  }

  try {
    const success = db.deleteProduct(id);
    if (success) {
      return res.json({ success: true, message: 'Produk berhasil dihapus' });
    }
    return res.status(500).json({ error: 'Gagal menghapus produk' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ error: 'Gagal menghapus produk' });
  }
});

// ==========================================
// ROUTE FALLBACKS
// ==========================================

// Serve admin page on /admin
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Catch-all route to serve public index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`✨ Server Shopee Affiliate Link List berjalan di http://localhost:${PORT}`);
  console.log(`🔑 Admin Login: http://localhost:${PORT}/admin (User: ${ADMIN_USERNAME}, Pass: ${ADMIN_PASSWORD})`);
});
