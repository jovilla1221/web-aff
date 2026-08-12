require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { createClient } = require('@supabase/supabase-js');

// Supabase Environment Variables
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

const useSupabase = !!(SUPABASE_URL && SUPABASE_KEY);
let supabase = null;

if (useSupabase) {
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  console.log("⚡ Database Mode: Supabase (PostgreSQL Cloud)");
} else {
  console.log("⚠️ Database Mode: Local JSON Files (Fallback - missing SUPABASE_URL/SUPABASE_KEY)");
}

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'products.json');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');

// Ensure data directory exists for local JSON mode
if (!useSupabase && !fs.existsSync(DATA_DIR)) {
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

// Helper: Local JSON Read/Write
function readProductsJson() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      writeProductsJson(DEFAULT_PRODUCTS);
      return DEFAULT_PRODUCTS;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const items = JSON.parse(raw);
    return items.map((item) => ({
      ...item,
      category: item.category || 'kawat_bulu',
    }));
  } catch (error) {
    console.error('Error reading products file:', error);
    return DEFAULT_PRODUCTS;
  }
}

function writeProductsJson(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing products file:', error);
  }
}

function readCategoriesJson() {
  try {
    if (!fs.existsSync(CATEGORIES_FILE)) {
      writeCategoriesJson(DEFAULT_CATEGORIES);
      return DEFAULT_CATEGORIES;
    }
    const raw = fs.readFileSync(CATEGORIES_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error reading categories file:', error);
    return DEFAULT_CATEGORIES;
  }
}

function writeCategoriesJson(data) {
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

// -----------------------------------------------------
// DATABASE OPERATIONS (SUPABASE OR LOCAL JSON FALLBACK)
// -----------------------------------------------------

const db = {
  // Category Operations
  getAllCategories: async () => {
    if (useSupabase) {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Supabase fetch categories error:', error);
        return DEFAULT_CATEGORIES;
      }
      if (!data || data.length === 0) {
        await supabase.from('categories').insert(DEFAULT_CATEGORIES);
        return DEFAULT_CATEGORIES;
      }
      return data;
    }

    const categories = readCategoriesJson();
    return categories.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  },

  createCategory: async ({ name, sort_order = 0 }) => {
    let id = slugify(name);
    const newCategory = {
      id,
      name: name.trim(),
      sort_order: Number(sort_order) || 0,
      created_at: new Date().toISOString(),
    };

    if (useSupabase) {
      const { data, error } = await supabase
        .from('categories')
        .insert([newCategory])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // Duplicate key
          newCategory.id = `${id}_${Date.now()}`;
          const { data: retryData } = await supabase
            .from('categories')
            .insert([newCategory])
            .select()
            .single();
          return retryData || newCategory;
        }
        console.error('Supabase create category error:', error);
        throw error;
      }
      return data;
    }

    const categories = readCategoriesJson();
    if (categories.some((c) => c.id === id)) {
      newCategory.id = `${id}_${Date.now()}`;
    }
    categories.push(newCategory);
    writeCategoriesJson(categories);
    return newCategory;
  },

  updateCategory: async (id, { name, sort_order }) => {
    if (useSupabase) {
      const updates = {};
      if (name !== undefined) updates.name = name.trim();
      if (sort_order !== undefined) updates.sort_order = Number(sort_order);

      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase update category error:', error);
        return null;
      }
      return data;
    }

    const categories = readCategoriesJson();
    const index = categories.findIndex((c) => c.id === id);
    if (index === -1) return null;

    if (name !== undefined) categories[index].name = name.trim();
    if (sort_order !== undefined) categories[index].sort_order = Number(sort_order);

    writeCategoriesJson(categories);
    return categories[index];
  },

  deleteCategory: async (id) => {
    if (useSupabase) {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase delete category error:', error);
        return false;
      }
      return true;
    }

    let categories = readCategoriesJson();
    const index = categories.findIndex((c) => c.id === id);
    if (index === -1) return false;

    categories = categories.filter((c) => c.id !== id);
    writeCategoriesJson(categories);
    return true;
  },

  // Product Operations
  getActiveProducts: async () => {
    if (useSupabase) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Supabase fetch active products error:', error);
        return DEFAULT_PRODUCTS;
      }
      if (!data || data.length === 0) {
        await supabase.from('products').insert(DEFAULT_PRODUCTS);
        return DEFAULT_PRODUCTS;
      }
      return data;
    }

    const products = readProductsJson();
    return products
      .filter((p) => p.is_active)
      .sort((a, b) => {
        if (a.sort_order !== b.sort_order) {
          return a.sort_order - b.sort_order;
        }
        return new Date(a.created_at) - new Date(b.created_at);
      });
  },

  getAllProducts: async () => {
    if (useSupabase) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Supabase fetch all products error:', error);
        return DEFAULT_PRODUCTS;
      }
      if (!data || data.length === 0) {
        await supabase.from('products').insert(DEFAULT_PRODUCTS);
        return DEFAULT_PRODUCTS;
      }
      return data;
    }

    const products = readProductsJson();
    return products.sort((a, b) => {
      if (a.sort_order !== b.sort_order) {
        return a.sort_order - b.sort_order;
      }
      return new Date(a.created_at) - new Date(b.created_at);
    });
  },

  getProductById: async (id) => {
    if (useSupabase) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) return null;
      return data;
    }

    const products = readProductsJson();
    return products.find((p) => p.id === id) || null;
  },

  createProduct: async ({ title, affiliate_url, category = 'kawat_bulu', sort_order = 0, is_active = true }) => {
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

    if (useSupabase) {
      const { data, error } = await supabase
        .from('products')
        .insert([newProduct])
        .select()
        .single();

      if (error) {
        console.error('Supabase create product error:', error);
        throw error;
      }
      return data;
    }

    const products = readProductsJson();
    products.push(newProduct);
    writeProductsJson(products);
    return newProduct;
  },

  updateProduct: async (id, { title, affiliate_url, category, sort_order, is_active }) => {
    if (useSupabase) {
      const updates = { updated_at: new Date().toISOString() };
      if (title !== undefined) updates.title = title.trim();
      if (affiliate_url !== undefined) updates.affiliate_url = affiliate_url.trim();
      if (category !== undefined) updates.category = category.trim();
      if (sort_order !== undefined) updates.sort_order = Number(sort_order);
      if (is_active !== undefined) updates.is_active = Boolean(is_active);

      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase update product error:', error);
        return null;
      }
      return data;
    }

    const products = readProductsJson();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    if (title !== undefined) products[index].title = title.trim();
    if (affiliate_url !== undefined) products[index].affiliate_url = affiliate_url.trim();
    if (category !== undefined) products[index].category = category.trim();
    if (sort_order !== undefined) products[index].sort_order = Number(sort_order);
    if (is_active !== undefined) products[index].is_active = Boolean(is_active);
    products[index].updated_at = new Date().toISOString();

    writeProductsJson(products);
    return products[index];
  },

  deleteProduct: async (id) => {
    if (useSupabase) {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase delete product error:', error);
        return false;
      }
      return true;
    }

    let products = readProductsJson();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return false;

    products = products.filter((p) => p.id !== id);
    writeProductsJson(products);
    return true;
  },
};

module.exports = db;
