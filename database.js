const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'products.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial seed products: Kawat Bulu & Fashion
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
  {
    id: 'fs-001',
    title: 'Cardigan Rajut Oversize Korean Style Soft Pink',
    affiliate_url: 'https://s.shopee.co.id/5Re6E8tW5X',
    category: 'fashion',
    sort_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'fs-002',
    title: 'Tote Bag Canvas Minimalis Aesthetic',
    affiliate_url: 'https://s.shopee.co.id/6Sf7F9uX6Y',
    category: 'fashion',
    sort_order: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'fs-003',
    title: 'Hijab Bella Square Premium Soft Tone',
    affiliate_url: 'https://s.shopee.co.id/7Tg8G0vY7Z',
    category: 'fashion',
    sort_order: 3,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'fs-004',
    title: 'Rok Plisket Premium Silk Glossy Flare',
    affiliate_url: 'https://s.shopee.co.id/8Uh9H1wZ8A',
    category: 'fashion',
    sort_order: 4,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'fs-005',
    title: 'Blouse Cut Out Korean Collar Pastel',
    affiliate_url: 'https://s.shopee.co.id/9Vi0I2xa9B',
    category: 'fashion',
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
    // Ensure all items have category property
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

// Database Operations
const db = {
  // Get active products sorted by sort_order ASC
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

  // Get all products (Admin view)
  getAllProducts: () => {
    const products = readData();
    return products.sort((a, b) => {
      if (a.sort_order !== b.sort_order) {
        return a.sort_order - b.sort_order;
      }
      return new Date(a.created_at) - new Date(b.created_at);
    });
  },

  // Get single product by ID
  getProductById: (id) => {
    const products = readData();
    return products.find((p) => p.id === id) || null;
  },

  // Create product
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

  // Update product
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

  // Delete product
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
