const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'products.json');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial seed categories
const DEFAULT_CATEGORIES = [
  {
    id: 'kawat_bulu',
    name: 'Kawat Bulu',
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 'fashion',
    name: 'Fashion',
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
];

// Initial seed products
const DEFAULT_PRODUCTS = [
  {
    id: 'kb-001',
    title: 'Kawat Bulu Mercy Pastel / Pipe Cleaner DIY Craft (100 Pcs)',
    affiliate_url: 'https://s.shopee.co.id/7Kz9X1mP8Q',
    category: 'kawat_bulu',
    sort_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'kb-002',
    title: 'Paket DIY Bunga Kawat Bulu Tulip Full Set + Pot & Solasi',
    affiliate_url: 'https://s.shopee.co.id/8Ly0Y2nQ9R',
    category: 'kawat_bulu',
    sort_order: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'kb-003',
    title: 'Kawat Bulu Macaron Soft Color Premium (50 Pcs)',
    affiliate_url: 'https://s.shopee.co.id/9Mz1Z3oR0S',
    category: 'kawat_bulu',
    sort_order: 3,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'kb-004',
    title: 'Lem Tembak Mini Melt Gun Kerajinan Kawat Bulu',
    affiliate_url: 'https://s.shopee.co.id/1Na2A4pS1T',
    category: 'kawat_bulu',
    sort_order: 4,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'kb-005',
    title: 'Tang Potong Mini & Pinset DIY Kawat Bulu',
    affiliate_url: 'https://s.shopee.co.id/2Ob3B5qT2U',
    category: 'kawat_bulu',
    sort_order: 5,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Read products from file
function readData() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      writeData(DEFAULT_PRODUCTS);
      return DEFAULT_PRODUCTS;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const items = JSON.parse(raw);
    return items.map((item) => ({
      ...item,
      category: item.category || 'kawat_bulu',
    }));
  } catch (error) {
    console.error('Error reading database file:', error);
    return DEFAULT_PRODUCTS;
  }
}

// Write products to file
function writeData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing database file:', error);
  }
}

// Read categories from file
function readCategories() {
  try {
    if (!fs.existsSync(CATEGORIES_FILE)) {
      writeCategories(DEFAULT_CATEGORIES);
      return DEFAULT_CATEGORIES;
    }
    const raw = fs.readFileSync(CATEGORIES_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error reading categories file:', error);
    return DEFAULT_CATEGORIES;
  }
}

// Write categories to file
function writeCategories(data) {
  try {
    fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing categories file:', error);
  }
}

// Helper: Slugify category name safely
function slugify(text) {
  const slug = text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '_');
  return slug || `cat_${Date.now()}`;
}

// Database Operations
const db = {
  // Category Operations
  getAllCategories: () => {
    const categories = readCategories();
    return categories.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  },

  createCategory: ({ name, sort_order = 0 }) => {
    const categories = readCategories();
    let id = slugify(name);

    // If ID exists, append timestamp
    if (categories.some((c) => c.id === id)) {
      id = `${id}_${Date.now()}`;
    }

    const newCategory = {
      id,
      name: name.trim(),
      sort_order: Number(sort_order) || 0,
      created_at: new Date().toISOString(),
    };

    categories.push(newCategory);
    writeCategories(categories);
    return newCategory;
  },

  updateCategory: (id, { name, sort_order }) => {
    const categories = readCategories();
    const index = categories.findIndex((c) => c.id === id);
    if (index === -1) return null;

    if (name !== undefined) categories[index].name = name.trim();
    if (sort_order !== undefined) categories[index].sort_order = Number(sort_order);

    writeCategories(categories);
    return categories[index];
  },

  deleteCategory: (id) => {
    let categories = readCategories();
    const index = categories.findIndex((c) => c.id === id);
    if (index === -1) return false;

    categories = categories.filter((c) => c.id !== id);
    writeCategories(categories);
    return true;
  },

  // Product Operations
  getActiveProducts: () => {
    const products = readData();
    return products
      .filter((p) => p.is_active)
      .sort((a, b) => {
        if (a.sort_order !== b.sort_order) {
          return a.sort_order - b.sort_order;
        }
        return new Date(a.created_at) - new Date(b.created_at);
      });
  },

  getAllProducts: () => {
    const products = readData();
    return products.sort((a, b) => {
      if (a.sort_order !== b.sort_order) {
        return a.sort_order - b.sort_order;
      }
      return new Date(a.created_at) - new Date(b.created_at);
    });
  },

  getProductById: (id) => {
    const products = readData();
    return products.find((p) => p.id === id) || null;
  },

  createProduct: ({ title, affiliate_url, category = 'kawat_bulu', sort_order = 0, is_active = true }) => {
    const products = readData();
    const newProduct = {
      id: uuidv4(),
      title: title.trim(),
      affiliate_url: affiliate_url.trim(),
      category: category.trim(),
      sort_order: Number(sort_order) || 0,
      is_active: Boolean(is_active),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    products.push(newProduct);
    writeData(products);
    return newProduct;
  },

  updateProduct: (id, { title, affiliate_url, category, sort_order, is_active }) => {
    const products = readData();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    if (title !== undefined) products[index].title = title.trim();
    if (affiliate_url !== undefined) products[index].affiliate_url = affiliate_url.trim();
    if (category !== undefined) products[index].category = category.trim();
    if (sort_order !== undefined) products[index].sort_order = Number(sort_order);
    if (is_active !== undefined) products[index].is_active = Boolean(is_active);
    products[index].updated_at = new Date().toISOString();

    writeData(products);
    return products[index];
  },

  deleteProduct: (id) => {
    let products = readData();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return false;

    products = products.filter((p) => p.id !== id);
    writeData(products);
    return true;
  },
};

module.exports = db;
