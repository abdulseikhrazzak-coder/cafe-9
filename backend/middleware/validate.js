/**
 * Strict input validation middleware to ensure data sanitization.
 * Intercepts bad data before it reaches database operations.
 */
function validateOrder(req, res, next) {
  const { customer, items } = req.body;

  if (!customer) {
    return res.status(400).json({ error: 'Missing customer details' });
  }

  const { name, phone, address, type, payment } = customer;

  // Basic field checks
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ error: 'Invalid or missing customer name' });
  }

  if (!phone || typeof phone !== 'string' || phone.trim().length < 10) {
    return res.status(400).json({ error: 'Invalid or missing phone number' });
  }

  if (type !== 'delivery' && type !== 'takeaway') {
    return res.status(400).json({ error: 'Invalid order type. Must be delivery or takeaway' });
  }

  if (type === 'delivery' && (!address || typeof address !== 'string' || address.trim().length < 5)) {
    return res.status(400).json({ error: 'Address is required for delivery orders' });
  }

  if (payment !== 'cod' && payment !== 'upi') {
    return res.status(400).json({ error: 'Invalid payment method' });
  }

  // Items checks
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Order must contain at least one item' });
  }

  for (const item of items) {
    if (!item.id || typeof item.id !== 'string') {
      return res.status(400).json({ error: 'Invalid item ID' });
    }
    if (!item.name || typeof item.name !== 'string') {
      return res.status(400).json({ error: 'Invalid item name' });
    }
    if (typeof item.price !== 'number' || item.price <= 0) {
      return res.status(400).json({ error: 'Invalid item price' });
    }
    if (typeof item.quantity !== 'number' || item.quantity <= 0 || !Number.isInteger(item.quantity)) {
      return res.status(400).json({ error: 'Invalid item quantity' });
    }
  }

  next();
}

function validateMessage(req, res, next) {
  const { name, email, subject, message } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ error: 'Invalid or missing name' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid or missing email address' });
  }

  if (!subject || typeof subject !== 'string' || subject.trim().length < 3) {
    return res.status(400).json({ error: 'Invalid or missing subject' });
  }

  if (!message || typeof message !== 'string' || message.trim().length < 5) {
    return res.status(400).json({ error: 'Invalid or missing message body' });
  }

  next();
}

module.exports = {
  validateOrder,
  validateMessage
};
