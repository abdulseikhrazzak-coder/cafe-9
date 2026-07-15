const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');
const db = require('./db');
const { validateOrder, validateMessage } = require('./middleware/validate');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Security Middlewares ---
app.use(helmet({
  contentSecurityPolicy: false, // Turn off CSP restriction for local development/Three.js assets if served locally
}));
app.use(cors({
  origin: '*', // Allow all origins for the direct API checkout
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting: max 100 requests per 15 minutes from an IP address
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// --- Logging & Parsing ---
app.use(morgan('dev'));
app.use(express.json());

// --- API Routes ---

// Get Menu List
app.get('/api/menu', (req, res, next) => {
  try {
    const menu = db.getMenu();
    res.json(menu);
  } catch (err) {
    next(err);
  }
});

// Submit Direct Order
app.post('/api/orders', validateOrder, (req, res, next) => {
  try {
    const { customer, items } = req.body;
    
    // Calculate total price on server side to prevent client tampering
    const menu = db.getMenu();
    const total = items.reduce((sum, item) => {
      const dbItem = menu.find(m => m.id === item.id);
      const price = dbItem ? dbItem.price : item.price;
      return sum + (price * item.quantity);
    }, 0);
    
    const deliveryFee = total > 300 || total === 0 ? 0 : 40;
    const grandTotal = total + deliveryFee;

    const orderPayload = {
      customer,
      items,
      subtotal: total,
      deliveryFee,
      total: grandTotal
    };

    const newOrder = db.createOrder(orderPayload);
    res.status(201).json(newOrder);
  } catch (err) {
    next(err);
  }
});

// Retrieve Order by ID (For checking tracking status)
app.get('/api/orders/:id', (req, res, next) => {
  try {
    const order = db.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
});

// Submit Contact Form Message
app.post('/api/contact', validateMessage, (req, res, next) => {
  try {
    const newMessage = db.createMessage(req.body);
    res.status(201).json({ success: true, message: newMessage });
  } catch (err) {
    next(err);
  }
});

// --- Settings Routes ---

// Get Settings
app.get('/api/settings', (req, res, next) => {
  try {
    const settings = db.getSettings();
    res.json(settings);
  } catch (err) {
    next(err);
  }
});

// Update Settings
app.put('/api/settings', (req, res, next) => {
  try {
    const updated = db.updateSettings(req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// --- Menu Admin Routes ---

// Add Menu Item
app.post('/api/menu', (req, res, next) => {
  try {
    const newItem = db.createMenuItem(req.body);
    res.status(201).json(newItem);
  } catch (err) {
    next(err);
  }
});

// Update Menu Item
app.put('/api/menu/:id', (req, res, next) => {
  try {
    const updated = db.updateMenuItem(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Delete Menu Item
app.delete('/api/menu/:id', (req, res, next) => {
  try {
    const success = db.deleteMenuItem(req.params.id);
    res.json({ success });
  } catch (err) {
    next(err);
  }
});

// --- Orders Admin Routes ---

// List All Orders
app.get('/api/orders', (req, res, next) => {
  try {
    const orders = db.getOrders();
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

// Update Order Info / Status
app.patch('/api/orders/:id', (req, res, next) => {
  try {
    const updated = db.updateOrder(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Delete Order
app.delete('/api/orders/:id', (req, res, next) => {
  try {
    const success = db.deleteOrder(req.params.id);
    res.json({ success });
  } catch (err) {
    next(err);
  }
});

// --- Serve Static Assets in Production ---
const distPath = path.join(__dirname, '../frontend/dist');
if (require('fs').existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// --- Global Error Handler ---
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.message || err);
  
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred.'
  });
});

// --- Start Server ---
const server = app.listen(PORT, () => {
  console.log(`Cloud 9 Café Backend listening on port ${PORT}`);
});

// --- Graceful Shutdown Handler ---
function gracefulShutdown(signal) {
  console.log(`Received ${signal}. Starting graceful shutdown...`);
  
  // Stop accepting new connections
  server.close(() => {
    console.log('HTTP server closed. Exiting process.');
    process.exit(0);
  });
  
  // Timeout force close if server hangs
  setTimeout(() => {
    console.error('Forcing shutdown due to timeout.');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
