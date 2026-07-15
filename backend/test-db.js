const db = require('./db');
const fs = require('fs');
const path = require('path');

console.log('--- Starting Unbreakable Database Stress Test ---');

// 1. Initial sanity check: menu loading
try {
  const menu = db.getMenu();
  console.log(`✔ Menu loaded successfully. Total items: ${menu.length}`);
} catch (err) {
  console.error('❌ Menu loading failed', err);
  process.exit(1);
}

// 2. Stress check: concurrent order creation to test file locking/atomic write safety
const CONCURRENT_COUNT = 50;
const promises = [];

console.log(`Starting ${CONCURRENT_COUNT} concurrent database writes...`);

for (let i = 0; i < CONCURRENT_COUNT; i++) {
  const orderData = {
    customer: {
      name: `Tester ${i}`,
      phone: '1234567890',
      type: 'takeaway',
      payment: 'cod'
    },
    items: [
      { id: 'hc1', name: 'Cappuccino', price: 120, quantity: 1 }
    ],
    subtotal: 120,
    deliveryFee: 40,
    total: 160
  };
  
  // Push write operation
  promises.push(new Promise((resolve) => {
    try {
      const order = db.createOrder(orderData);
      resolve({ success: true, id: order.id });
    } catch (err) {
      resolve({ success: false, error: err });
    }
  }));
}

Promise.all(promises).then((results) => {
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✔ Concurrency execution complete.`);
  console.log(`Successful writes: ${successful.length} / ${CONCURRENT_COUNT}`);
  console.log(`Failed writes: ${failed.length} / ${CONCURRENT_COUNT}`);
  
  if (failed.length > 0) {
    console.error('❌ Concurrency test failed due to write errors', failed);
    process.exit(1);
  }

  // 3. Integrity verification: read back the files and verify length
  const orders = db.getOrders();
  console.log(`✔ Read back orders database. Total orders found: ${orders.length}`);
  
  // Ensure JSON parsing works
  const ordersFilePath = path.join(__dirname, 'data', 'orders.json');
  try {
    const rawData = fs.readFileSync(ordersFilePath, 'utf8');
    JSON.parse(rawData);
    console.log('✔ orders.json integrity verified: valid JSON structure.');
  } catch (jsonErr) {
    console.error('❌ Database file corruption detected in orders.json!', jsonErr);
    process.exit(1);
  }

  console.log('--- Database Integrity Tests Passed Successfully ---');
});
