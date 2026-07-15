const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const MENU_FILE = path.join(DATA_DIR, 'menu.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

/**
 * Safely writes JSON content to a file atomically.
 * Prevents file corruption on server crashes by writing to a temp file and renaming it.
 * Includes a retry loop for Windows EPERM/EBUSY conflicts.
 */
function safeWriteJSON(filePath, data) {
  const tempPath = `${filePath}.tmp`;
  try {
    const jsonString = JSON.stringify(data, null, 2);
    
    // Write to temporary file
    fs.writeFileSync(tempPath, jsonString, 'utf8');
    
    // Force flush to disk
    const fd = fs.openSync(tempPath, 'r+');
    fs.fsyncSync(fd);
    fs.closeSync(fd);
    
    // Rename temp file to target file atomically (with retries for Windows indexer locks)
    let retries = 10;
    while (retries > 0) {
      try {
        fs.renameSync(tempPath, filePath);
        break;
      } catch (err) {
        if ((err.code === 'EPERM' || err.code === 'EBUSY') && retries > 1) {
          retries--;
          // Block sleep for 10ms to let indexer release lock
          const limit = Date.now() + 10;
          while (Date.now() < limit) {}
        } else {
          throw err;
        }
      }
    }
  } catch (err) {
    // Clean up temp file on failure
    if (fs.existsSync(tempPath)) {
      try { fs.unlinkSync(tempPath); } catch (_) {}
    }
    throw err;
  }
}

function readJSON(filePath, defaultValue = []) {
  try {
    if (!fs.existsSync(filePath)) {
      safeWriteJSON(filePath, defaultValue);
      return defaultValue;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content || JSON.stringify(defaultValue));
  } catch (err) {
    console.error(`Error reading database file: ${filePath}. Falling back to default.`, err);
    return defaultValue;
  }
}

// Initial Menu Seed Data (exactly matches Menu.jsx frontend)
const DEFAULT_MENU = [
  // Hot Coffee
  { id: 'hc1', name: 'Cappuccino', category: 'hot-coffee', price: 120, isVeg: true, desc: 'Espresso topped with a deep layer of foamy steamed milk.' },
  { id: 'hc2', name: 'Café Latte', category: 'hot-coffee', price: 160, isVeg: true, desc: 'Rich espresso balanced with steamed milk and a light layer of foam.' },
  { id: 'hc3', name: 'Velvet Coffee', category: 'hot-coffee', price: 240, isVeg: true, desc: 'Smooth dark coffee with a velvety chocolate whipped cream top.' },
  { id: 'hc4', name: 'Flat White', category: 'hot-coffee', price: 120, isVeg: true, desc: 'Double shot of espresso combined with microfoamed milk.' },
  { id: 'hc5', name: 'Cinnamon Coffee', category: 'hot-coffee', price: 180, isVeg: true, desc: 'Brewed coffee infused with natural ground cinnamon sticks.' },
  { id: 'hc6', name: 'Espresso', category: 'hot-coffee', price: 90, isVeg: true, desc: 'Intense, concentrated shot of pure dark roast coffee beans.' },
  { id: 'hc7', name: 'Vanilla Latte', category: 'hot-coffee', price: 180, isVeg: true, desc: 'Espresso blended with steamed milk and premium sweet vanilla syrup.' },
  { id: 'hc8', name: 'Filter Coffee', category: 'hot-coffee', price: 120, isVeg: true, desc: 'Traditional Indian drip-filter brewed coffee with frothed milk.' },
  
  // Cold Coffee
  { id: 'cc1', name: 'Vegan Shake', category: 'cold-coffee', price: 160, isVeg: true, desc: 'Cold brew blended with organic almond milk and vegan chocolate syrup.' },
  { id: 'cc2', name: 'Cold Coffee', category: 'cold-coffee', price: 140, isVeg: true, desc: 'Classic blended iced coffee with milk, vanilla ice cream, and chocolate sauce.' },
  { id: 'cc3', name: 'Cold Mocha', category: 'cold-coffee', price: 180, isVeg: true, desc: 'Rich espresso mixed with cocoa, milk, ice, and dark chocolate drizzles.' },
  { id: 'cc4', name: 'Iced Tea', category: 'cold-coffee', price: 110, isVeg: true, desc: 'Refreshing brewed black tea chilled and infused with fresh lemon and mint.' },
  { id: 'cc5', name: 'Chilled Latte', category: 'cold-coffee', price: 160, isVeg: true, desc: 'Smooth espresso shot poured over ice and chilled milk.' },
  { id: 'cc6', name: 'Belgian Chocolate Shake', category: 'cold-coffee', price: 180, isVeg: true, desc: 'Thick shake made with rich Belgian dark chocolate ice cream.' },
  { id: 'cc7', name: 'Crunchy Frappé', category: 'cold-coffee', price: 190, isVeg: true, desc: 'Ice blended coffee topped with crunchy caramel butterscotch chips.' },
  { id: 'cc8', name: 'Chocolate Shake', category: 'cold-coffee', price: 190, isVeg: true, desc: 'Creamy classic chocolate shake blended with chocolate ice cream and chips.' },
  
  // Snacks
  { id: 'sn1', name: 'Sandwich', category: 'snacks', price: 120, isVeg: true, desc: 'Grilled toastie stuffed with fresh bell peppers, corn, and cheese.' },
  { id: 'sn2', name: 'Cottage Cheese Fry', category: 'snacks', price: 180, isVeg: true, desc: 'Crispy paneer strips fried to golden perfection with local spices.' },
  { id: 'sn3', name: 'Garlic Bread', category: 'snacks', price: 150, isVeg: true, desc: 'Toasted baguette slices brushed with garlic butter and melted mozzarella.' },
  { id: 'sn4', name: 'Bread Sticks', category: 'snacks', price: 90, isVeg: true, desc: 'Freshly baked buttery breadsticks served with custom marinara dip.' },
  { id: 'sn5', name: 'Veg Burger', category: 'snacks', price: 160, isVeg: true, desc: 'Crispy potato patty burger with lettuce, tomato, and spicy mayo.' },
  { id: 'sn6', name: 'Veg Pizza', category: 'snacks', price: 220, isVeg: true, desc: 'Personal hand-tossed pizza topped with capsicum, onion, and black olives.' },
  { id: 'sn7', name: 'Chicken Pockets', category: 'snacks', price: 190, isVeg: false, desc: 'Baked puff pastry pockets filled with spicy shredded chicken.' },
  { id: 'sn8', name: 'Pita Bread with Hummus', category: 'snacks', price: 160, isVeg: true, desc: 'Warm soft pita bread served alongside creamy olive oil hummus.' },
  
  // Desserts
  { id: 'ds1', name: 'New York Cheesecake', category: 'desserts', price: 190, isVeg: true, desc: 'Decadent, rich cream cheese cake on a crunchy graham cracker crust.' },
  { id: 'ds2', name: 'Choco Fantasy', category: 'desserts', price: 160, isVeg: true, desc: 'Warm chocolate cake with a molten chocolate lava center.' },
  { id: 'ds3', name: 'Warm Brownie', category: 'desserts', price: 150, isVeg: true, desc: 'Fudgy dark chocolate brownie loaded with roasted walnuts.' },
  { id: 'ds4', name: 'Choco Fudge', category: 'desserts', price: 140, isVeg: true, desc: 'Decadent warm chocolate fudge pudding layered with hot chocolate fudge.' },
  { id: 'ds5', name: 'Vanilla Scoop', category: 'desserts', price: 90, isVeg: true, desc: 'Premium Madagascar vanilla bean ice cream single scoop.' },
  { id: 'ds6', name: 'Berry Cheesecake', category: 'desserts', price: 190, isVeg: true, desc: 'Rich cheesecake topped with a sweet homemade mixed berry compote.' },
  { id: 'ds7', name: 'Strawberry Cake Slice', category: 'desserts', price: 160, isVeg: true, desc: 'Moist vanilla sponge cake layered with fresh strawberries and cream.' },
  { id: 'ds8', name: 'Red Velvet Cake Slice', category: 'desserts', price: 190, isVeg: true, desc: 'Crimson cocoa cake layers frosted with sweet cream cheese frosting.' },

  // Non-Veg Soups & Shorba
  { id: 'nv_sp1', name: 'Chicken Munchow Soup', category: 'tandoor-soups', price: 120, isVeg: false, desc: 'Classic Indo-Chinese soup with shredded chicken, mixed veggies, and crispy noodles.' },
  { id: 'nv_sp2', name: 'Murg Dhaniya Shorba', category: 'tandoor-soups', price: 120, isVeg: false, desc: 'A clear chicken soup infused with fresh coriander leaves and aromatic spices.' },
  { id: 'nv_sp3', name: 'Cream of Chicken Soup', category: 'tandoor-soups', price: 120, isVeg: false, desc: 'Rich, creamy soup with tender chicken pieces and a hint of herbs.' },
  { id: 'nv_sp4', name: 'Chicken Sweet Corn Soup', category: 'tandoor-soups', price: 115, isVeg: false, desc: 'Comforting soup featuring sweet corn kernels and tender chicken in a savory broth.' },
  { id: 'nv_sp5', name: 'Chicken Hot & Sour Soup', category: 'tandoor-soups', price: 110, isVeg: false, desc: 'Spicy and tangy soup loaded with chicken, vegetables, and vinegar.' },
  { id: 'nv_sp6', name: 'Chicken Clear Soup', category: 'tandoor-soups', price: 95, isVeg: false, desc: 'Light and nutritious chicken broth with delicate vegetables.' },
  
  // Non-Veg Starters Tandoor Se...
  { id: 'nv_st1', name: 'Non-Veg Kebab Platter', category: 'tandoor-soups', price: 595, isVeg: false, desc: 'An assortment of our finest tandoori chicken, fish, and mutton kebabs.' },
  { id: 'nv_st2', name: 'Jheenga Dum Ajwaini', category: 'tandoor-soups', price: 495, isVeg: false, desc: 'Jumbo prawns marinated in yogurt, carom seeds, and tandoori spices, cooked in clay oven.' },
  { id: 'nv_st3', name: 'Hariyali Jheenga Tikka', category: 'tandoor-soups', price: 495, isVeg: false, desc: 'Succulent prawns marinated in a fresh green paste of mint and coriander, grilled.' },
  { id: 'nv_st4', name: 'Tandoori Fish', category: 'tandoor-soups', price: 390, isVeg: false, desc: 'Whole fish marinated in yogurt and traditional spices, roasted in clay oven.' },
  { id: 'nv_st5', name: 'Fish Tikka', category: 'tandoor-soups', price: 380, isVeg: false, desc: 'Boneless chunks of fish marinated in tandoori spices and cooked in clay oven.' },
  { id: 'nv_st6', name: 'Murg Changeezi Kebab', category: 'tandoor-soups', price: 340, isVeg: false, desc: 'Tender chicken chunks marinated in a rich, creamy spices blend and chargrilled.' },
  { id: 'nv_st7', name: 'Murgh Malai Tikka', category: 'tandoor-soups', price: 320, isVeg: false, desc: 'Melt-in-your-mouth chicken pieces marinated in cream, cheese, and mild spices.' },
  { id: 'nv_st8', name: 'Murgh Afghani Tikka', category: 'tandoor-soups', price: 310, isVeg: false, desc: 'Rich and creamy chicken tikka marinated with cashews, cream, and green cardamom.' },
  { id: 'nv_st9', name: 'Murg Dum Pook Tikka', category: 'tandoor-soups', price: 290, isVeg: false, desc: 'Slow-cooked, succulent tandoori chicken tikka infused with royal spices.' },
  { id: 'nv_st10', name: 'Tangdi Kebab (3 Piece)', category: 'tandoor-soups', price: 275, isVeg: false, desc: 'Chicken drumsticks marinated in rich yogurt and spices, grilled to perfection.' },
  { id: 'nv_st11', name: 'Murgh Achari Tikka', category: 'tandoor-soups', price: 270, isVeg: false, desc: 'Spicy chicken tikka infused with the tangy notes of pickling (achari) spices.' },
  { id: 'nv_st12', name: 'Khas Seekh Tikka', category: 'tandoor-soups', price: 260, isVeg: false, desc: 'Minced chicken flavored with fresh herbs and spices, skewered and grilled.' },
  { id: 'nv_st13', name: 'Murgh Banjara Tikka', category: 'tandoor-soups', price: 260, isVeg: false, desc: 'Spicy chicken tikka marinated in a robust mixture of sesame seeds, green chillies, and spices.' },
  { id: 'nv_st14', name: 'Murgh Angara Tikka', category: 'tandoor-soups', price: 260, isVeg: false, desc: 'Fiery, red-hot grilled chicken chunks marinated in extra spicy spices and chilies.' },
  { id: 'nv_st15', name: 'Murgh Jeerawala Tikka', category: 'tandoor-soups', price: 250, isVeg: false, desc: 'Tender chicken tikka flavored with freshly roasted cumin seeds and spices.' },
  { id: 'nv_st16_h', name: 'Tandoori Chicken (Half)', category: 'tandoor-soups', price: 250, isVeg: false, desc: 'Classic tandoori-spiced bone-in chicken grilled to juicy perfection (Half Portion).' },
  { id: 'nv_st16_f', name: 'Tandoori Chicken (Full)', category: 'tandoor-soups', price: 495, isVeg: false, desc: 'Classic tandoori-spiced bone-in chicken grilled to juicy perfection (Full Portion).' }
];

// Initialize database
const db = {
  getMenu() {
    return readJSON(MENU_FILE, DEFAULT_MENU);
  },
  
  getOrders() {
    return readJSON(ORDERS_FILE, []);
  },
  
  getOrderById(id) {
    const orders = this.getOrders();
    return orders.find(o => o.id === id);
  },
  
  createOrder(orderData) {
    const orders = this.getOrders();
    const newOrder = {
      id: 'C9C-' + Math.floor(100000 + Math.random() * 900000),
      ...orderData,
      status: 'Preparing',
      createdAt: new Date().toISOString()
    };
    orders.push(newOrder);
    safeWriteJSON(ORDERS_FILE, orders);
    return newOrder;
  },
  
  createMessage(messageData) {
    const messages = readJSON(MESSAGES_FILE, []);
    const newMessage = {
      id: 'MSG-' + Math.floor(100000 + Math.random() * 900000),
      ...messageData,
      createdAt: new Date().toISOString()
    };
    messages.push(newMessage);
    safeWriteJSON(MESSAGES_FILE, messages);
    return newMessage;
  },

  updateOrderStatus(id, status) {
    const orders = this.getOrders();
    const orderIndex = orders.findIndex(o => o.id === id);
    if (orderIndex === -1) return null;
    
    orders[orderIndex].status = status;
    safeWriteJSON(ORDERS_FILE, orders);
    return orders[orderIndex];
  },

  getSettings() {
    const defaultSettings = {
      name: "Cloud 9 Café",
      logo: "/logo.png",
      phone: "+91 98765 43210",
      email: "info@cloud9cafe.com",
      address: "Cloud 9 Plaza, 4th Floor, Skyline Road, Mumbai, India",
      timings: "Daily: 9:00 AM - 11:00 PM"
    };
    return readJSON(SETTINGS_FILE, defaultSettings);
  },

  updateSettings(settingsData) {
    const current = this.getSettings();
    const updated = { ...current, ...settingsData };
    safeWriteJSON(SETTINGS_FILE, updated);
    return updated;
  },

  createMenuItem(itemData) {
    const menu = this.getMenu();
    const newItem = {
      id: 'item_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      ...itemData
    };
    menu.push(newItem);
    safeWriteJSON(MENU_FILE, menu);
    return newItem;
  },

  updateMenuItem(id, itemData) {
    const menu = this.getMenu();
    const itemIndex = menu.findIndex(item => item.id === id);
    if (itemIndex === -1) return null;
    menu[itemIndex] = { ...menu[itemIndex], ...itemData, id };
    safeWriteJSON(MENU_FILE, menu);
    return menu[itemIndex];
  },

  deleteMenuItem(id) {
    const menu = this.getMenu();
    const filtered = menu.filter(item => item.id !== id);
    safeWriteJSON(MENU_FILE, filtered);
    return true;
  },

  updateOrder(id, orderData) {
    const orders = this.getOrders();
    const orderIndex = orders.findIndex(o => o.id === id);
    if (orderIndex === -1) return null;
    orders[orderIndex] = { ...orders[orderIndex], ...orderData, id };
    safeWriteJSON(ORDERS_FILE, orders);
    return orders[orderIndex];
  },

  deleteOrder(id) {
    const orders = this.getOrders();
    const filtered = orders.filter(o => o.id !== id);
    safeWriteJSON(ORDERS_FILE, filtered);
    return true;
  }
};

module.exports = db;
