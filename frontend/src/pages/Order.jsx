import React, { useState } from 'react';
import { ShoppingCart, Trash2, ArrowRight, CheckCircle, ExternalLink, QrCode, ClipboardCheck, MapPin } from 'lucide-react';

const Order = ({ cart, addToCart, removeFromCart, clearCart }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    type: 'delivery', // delivery, takeaway
    payment: 'cod' // cod, upi
  });
  
  const [orderStatus, setOrderStatus] = useState('idle'); // idle, processing, success
  const [lastOrderDetails, setLastOrderDetails] = useState(null);
  const [detectingLocation, setDetectingLocation] = useState(false);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    
    setDetectingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Fetch human-readable address from OpenStreetMap Nominatim
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
          .then((res) => {
            if (!res.ok) throw new Error('Geocoding request failed');
            return res.json();
          })
          .then((data) => {
            const displayAddress = data.display_name || `${latitude}, ${longitude}`;
            setFormData((prev) => ({
              ...prev,
              address: `[Exact Location Detected]\nAddress: ${displayAddress}\nCoords: ${latitude}, ${longitude}`
            }));
            setDetectingLocation(false);
          })
          .catch((err) => {
            console.warn('Reverse geocoding failed, falling back to raw coordinates', err);
            setFormData((prev) => ({
              ...prev,
              address: `[Exact Location Detected]\nCoords: ${latitude}, ${longitude}\n(Could not retrieve street name)`
            }));
            setDetectingLocation(false);
          });
      },
      (error) => {
        console.error('Error getting location', error);
        alert(`Failed to detect location: ${error.message}. Please input manually.`);
        setDetectingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 300 || subtotal === 0 ? 0 : 40;
  const grandTotal = subtotal + deliveryFee;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setOrderStatus('processing');
    
    // Submit the order payload to the backend
    fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer: formData,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        }))
      })
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then(errData => {
            throw new Error(errData.error || 'Failed to place order');
          });
        }
        return res.json();
      })
      .then((data) => {
        setLastOrderDetails(data);
        setOrderStatus('success');
        clearCart();
      })
      .catch((err) => {
        console.error('Order checkout error:', err);
        alert(`Checkout failed: ${err.message || 'Server connection error'}`);
        setOrderStatus('idle');
      });
  };

  return (
    <div style={styles.container} className="animate-fade-in-up">
      <div className="gradient-overlay" />

      <section style={styles.section}>
        <div className="section-header">
          <span className="section-subtitle">Secure Checkout</span>
          <h1 className="section-title">Direct <span>Order</span></h1>
        </div>

        {orderStatus === 'success' && lastOrderDetails ? (
          // Success State View
          <div className="glass-panel" style={styles.successPanel}>
            <CheckCircle size={64} color="#22c55e" style={{ marginBottom: '20px' }} />
            <h2 style={styles.successTitle}>Order Placed Successfully!</h2>
            <p style={styles.successDesc}>
              Thank you, <strong>{lastOrderDetails.customer.name}</strong>! Your coffee is being brewed by our master baristas.
            </p>
            
            <div style={styles.receiptBox}>
              <div style={styles.receiptHeader}>
                <span style={styles.receiptId}>Order ID: {lastOrderDetails.id}</span>
                <span style={styles.receiptBadge}>Preparing</span>
              </div>
              <div style={styles.receiptDivider} />
              <div style={styles.receiptItems}>
                {lastOrderDetails.items.map((item) => (
                  <div key={item.id} style={styles.receiptItem}>
                    <span>{item.name} x {item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div style={styles.receiptDivider} />
              <div style={styles.receiptTotal}>
                <span>Total Paid ({lastOrderDetails.customer.payment.toUpperCase()})</span>
                <span>₹{lastOrderDetails.total}</span>
              </div>
            </div>

            <p style={styles.deliveryTimeText}>
              Estimated Delivery: <strong>25-35 minutes</strong> to {lastOrderDetails.customer.type === 'delivery' ? lastOrderDetails.customer.address : 'Counter Pickup'}.
            </p>

            <button 
              onClick={() => {
                setOrderStatus('idle');
                setLastOrderDetails(null);
                setFormData({ name: '', phone: '', address: '', type: 'delivery', payment: 'cod' });
              }}
              className="btn btn-primary"
              style={{ marginTop: '20px' }}
            >
              Order Something Else
            </button>
          </div>
        ) : (
          // Checkout Layout View
          <div className="order-checkout-grid" style={styles.checkoutGrid}>
            
            {/* Left Side: Cart Items */}
            <div style={styles.cartColumn}>
              <h2 style={styles.colHeader}>Your Basket</h2>
              {cart.length > 0 ? (
                <div style={styles.cartItemsContainer}>
                  {cart.map((item) => (
                    <div key={item.id} className="glass-panel order-cart-item-card" style={styles.cartItemCard}>
                      <div style={styles.itemMainInfo}>
                        <h3 style={styles.cartItemName}>{item.name}</h3>
                        <span style={styles.cartItemSubtotal}>₹{item.price} x {item.quantity}</span>
                      </div>
                      
                      <div style={styles.cartItemActions}>
                        <div style={styles.quantityControls}>
                          <button onClick={() => removeFromCart(item.id)} style={styles.qtyBtn}>-</button>
                          <span style={styles.qtyVal}>{item.quantity}</span>
                          <button onClick={() => addToCart(item)} style={styles.qtyBtn}>+</button>
                        </div>
                        <span style={styles.cartItemTotal}>₹{item.price * item.quantity}</span>
                      </div>
                    </div>
                  ))}

                  <div className="glass-panel" style={styles.summaryCard}>
                    <div style={styles.summaryRow}>
                      <span>Subtotal</span>
                      <span>₹{subtotal}</span>
                    </div>
                    <div style={styles.summaryRow}>
                      <span>Delivery Charge</span>
                      <span>{deliveryFee === 0 ? <strong style={{ color: '#22c55e' }}>FREE</strong> : `₹${deliveryFee}`}</span>
                    </div>
                    {deliveryFee > 0 && (
                      <span style={styles.promoHint}>Add items worth ₹{300 - subtotal} more for FREE Delivery!</span>
                    )}
                    <div style={styles.summaryDivider} />
                    <div style={{ ...styles.summaryRow, ...styles.grandTotalRow }}>
                      <span>Total Amount</span>
                      <span className="glow-text" style={styles.grandTotalVal}>₹{grandTotal}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="glass-panel" style={styles.emptyCartCard}>
                  <ShoppingCart size={48} color="var(--text-muted)" style={{ marginBottom: '15px' }} />
                  <h3>Your basket is empty</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '5px' }}>
                    Head over to our Menu page to add some rich delicacies!
                  </p>
                </div>
              )}

            </div>

            {/* Right Side: Order Info Form */}
            <div style={styles.formColumn}>
              <h2 style={styles.colHeader}>Delivery Details</h2>
              <form onSubmit={handleFormSubmit} className="glass-panel" style={styles.checkoutForm}>
                
                {/* Form Group: Name */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>Your Name *</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    style={styles.input}
                    disabled={cart.length === 0}
                  />
                </div>

                {/* Form Group: Phone */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>Phone Number *</label>
                  <input 
                    type="tel" 
                    name="phone"
                    required
                    pattern="[0-9]{10}"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter 10-digit mobile number"
                    style={styles.input}
                    disabled={cart.length === 0}
                  />
                </div>

                {/* Form Group: Order Type */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>Order Type</label>
                  <div style={styles.radioGroup}>
                    <label style={{
                      ...styles.radioButton,
                      ...(formData.type === 'delivery' ? styles.radioButtonActive : {})
                    }}>
                      <input 
                        type="radio" 
                        name="type" 
                        value="delivery" 
                        checked={formData.type === 'delivery'}
                        onChange={handleInputChange}
                        style={{ display: 'none' }}
                      />
                      Home Delivery
                    </label>
                    <label style={{
                      ...styles.radioButton,
                      ...(formData.type === 'takeaway' ? styles.radioButtonActive : {})
                    }}>
                      <input 
                        type="radio" 
                        name="type" 
                        value="takeaway" 
                        checked={formData.type === 'takeaway'}
                        onChange={handleInputChange}
                        style={{ display: 'none' }}
                      />
                      Takeaway / Self-Pickup
                    </label>
                  </div>
                </div>

                {/* Form Group: Address */}
                {formData.type === 'delivery' && (
                  <div style={styles.formGroup} className="animate-fade-in-up">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label style={{ ...styles.label, marginBottom: 0 }}>Delivery Address *</label>
                      <button
                        type="button"
                        onClick={detectLocation}
                        disabled={cart.length === 0 || detectingLocation}
                        className="btn btn-secondary"
                        style={styles.locateBtn}
                      >
                        <MapPin size={14} color="var(--primary-red)" />
                        {detectingLocation ? 'Detecting...' : 'Get Exact Location'}
                      </button>
                    </div>
                    <textarea 
                      name="address"
                      required={formData.type === 'delivery'}
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter complete house address (Click 'Get Exact Location' to autofill GPS position)"
                      rows={3}
                      style={styles.textarea}
                      disabled={cart.length === 0}
                    />
                  </div>
                )}

                {/* Form Group: Payment Method */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>Payment Method</label>
                  <div style={styles.radioGroup}>
                    <label style={{
                      ...styles.radioButton,
                      ...(formData.payment === 'cod' ? styles.radioButtonActive : {})
                    }}>
                      <input 
                        type="radio" 
                        name="payment" 
                        value="cod" 
                        checked={formData.payment === 'cod'}
                        onChange={handleInputChange}
                        style={{ display: 'none' }}
                      />
                      Cash / Card on Delivery
                    </label>
                    <label style={{
                      ...styles.radioButton,
                      ...(formData.payment === 'upi' ? styles.radioButtonActive : {})
                    }}>
                      <input 
                        type="radio" 
                        name="payment" 
                        value="upi" 
                        checked={formData.payment === 'upi'}
                        onChange={handleInputChange}
                        style={{ display: 'none' }}
                      />
                      Pay with UPI Scan
                    </label>
                  </div>
                </div>

                {/* Simulated QR Code for UPI */}
                {formData.payment === 'upi' && cart.length > 0 && (
                  <div style={styles.upiContainer} className="animate-fade-in-up">
                    <div style={styles.qrHeader}>
                      <QrCode size={20} color="var(--primary-red)" />
                      <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>Scan & Pay via UPI</span>
                    </div>
                    <div style={styles.qrPlaceholder}>
                      {/* Generates a simple pixel-art mock QR using css gradients/borders */}
                      <div style={styles.qrCodeBox}>
                        <div style={styles.qrCornerSquare} />
                        <div style={{ ...styles.qrCornerSquare, right: 0 }} />
                        <div style={{ ...styles.qrCornerSquare, bottom: 0 }} />
                        <div style={styles.qrCenterDot} />
                      </div>
                      <span style={styles.upiId}>UPI ID: cloud9cafe@upi</span>
                      <span style={styles.upiAmount}>Total Payable: ₹{grandTotal}</span>
                    </div>
                  </div>
                )}

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={cart.length === 0 || orderStatus === 'processing'}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '14px',
                    fontSize: '1.05rem',
                    marginTop: '10px',
                    cursor: cart.length === 0 ? 'not-allowed' : 'pointer',
                    opacity: cart.length === 0 ? 0.6 : 1
                  }}
                >
                  {orderStatus === 'processing' ? (
                    'Processing Order...'
                  ) : (
                    <>
                      <ClipboardCheck size={20} /> Place Direct Order (₹{grandTotal})
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>
        )}
      </section>
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    width: '100%',
  },
  section: {
    paddingBottom: '85px',
  },
  checkoutGrid: {
    display: 'grid',
    gridTemplateColumns: '1.1fr 0.9fr',
    gap: '40px',
    marginTop: '30px',
    alignItems: 'start',
  },
  colHeader: {
    fontFamily: 'var(--font-title)',
    fontSize: '1.4rem',
    color: '#ffffff',
    marginBottom: '20px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    paddingBottom: '10px',
  },
  cartColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  cartItemsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  cartItemCard: {
    padding: '16px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(15, 15, 17, 0.5)',
    gap: '15px',
  },
  itemMainInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  cartItemName: {
    fontSize: '1.05rem',
    fontWeight: '600',
    color: '#ffffff',
  },
  cartItemSubtotal: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
  },
  cartItemActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
  },
  quantityControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '15px',
    padding: '2px 6px',
  },
  qtyBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '1rem',
  },
  qtyVal: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#ffffff',
  },
  cartItemTotal: {
    fontFamily: 'var(--font-title)',
    fontWeight: '700',
    fontSize: '1.1rem',
    color: '#ffffff',
  },
  summaryCard: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    background: 'rgba(255, 14, 60, 0.02)',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.95rem',
    color: 'var(--text-secondary)',
  },
  promoHint: {
    fontSize: '0.78rem',
    color: 'var(--primary-red)',
    marginTop: '-4px',
    display: 'block',
  },
  summaryDivider: {
    height: '1px',
    background: 'rgba(255, 255, 255, 0.08)',
    margin: '4px 0',
  },
  grandTotalRow: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#ffffff',
  },
  grandTotalVal: {
    fontSize: '1.4rem',
    color: 'var(--accent-red)',
  },
  emptyCartCard: {
    padding: '50px 30px',
    textAlign: 'center',
    background: 'rgba(15, 15, 17, 0.3)',
  },
  locateBtn: {
    padding: '6px 14px',
    fontSize: '0.8rem',
    borderRadius: '20px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
  },
  formColumn: {
    position: 'sticky',
    top: '100px',
  },
  checkoutForm: {
    padding: '30px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    background: 'rgba(15, 15, 17, 0.65)',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    letterSpacing: '0.5px',
  },
  input: {
    padding: '12px 16px',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '8px',
    color: '#ffffff',
    outline: 'none',
    fontSize: '0.95rem',
    transition: 'var(--transition-fast)',
    ':focus': {
      borderColor: 'var(--primary-red)',
      background: 'rgba(255, 255, 255, 0.04)',
    }
  },
  textarea: {
    padding: '12px 16px',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '8px',
    color: '#ffffff',
    outline: 'none',
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    resize: 'none',
    transition: 'var(--transition-fast)',
    ':focus': {
      borderColor: 'var(--primary-red)',
      background: 'rgba(255, 255, 255, 0.04)',
    }
  },
  radioGroup: {
    display: 'flex',
    gap: '10px',
  },
  radioButton: {
    flexGrow: 1,
    textAlign: 'center',
    padding: '10px 12px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
    transition: 'var(--transition-fast)',
    userSelect: 'none',
  },
  radioButtonActive: {
    borderColor: 'var(--primary-red)',
    color: '#ffffff',
    backgroundColor: 'rgba(229, 9, 20, 0.06)',
  },
  upiContainer: {
    border: '1px dashed rgba(255, 14, 60, 0.3)',
    borderRadius: '10px',
    padding: '15px',
    background: 'rgba(229, 9, 20, 0.02)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  qrHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#ffffff',
  },
  qrPlaceholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '10px',
  },
  qrCodeBox: {
    width: '120px',
    height: '120px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    position: 'relative',
    padding: '10px',
    backgroundImage: `
      linear-gradient(45deg, #000000 25%, transparent 25%), 
      linear-gradient(-45deg, #000000 25%, transparent 25%), 
      linear-gradient(45deg, transparent 75%, #000000 75%), 
      linear-gradient(-45deg, transparent 75%, #000000 75%)
    `,
    backgroundSize: '12px 12px',
    backgroundPosition: '0 0, 0 6px, 6px -6px, -6px 0px',
  },
  qrCornerSquare: {
    width: '32px',
    height: '32px',
    border: '8px solid #000000',
    backgroundColor: '#ffffff',
    position: 'absolute',
    top: '10px',
    left: '10px',
  },
  qrCenterDot: {
    width: '20px',
    height: '20px',
    backgroundColor: '#000000',
    position: 'absolute',
    top: '50px',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  upiId: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    fontWeight: '500',
  },
  upiAmount: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: 'var(--primary-red)',
  },
  successPanel: {
    maxWidth: '650px',
    margin: '30px auto 0',
    padding: '40px 30px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  successTitle: {
    fontSize: '1.8rem',
    color: '#ffffff',
    marginBottom: '10px',
  },
  successDesc: {
    fontSize: '1rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
    marginBottom: '25px',
  },
  receiptBox: {
    width: '100%',
    background: 'rgba(0, 0, 0, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    fontFamily: 'monospace',
    fontSize: '0.9rem',
  },
  receiptHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptId: {
    color: '#ffffff',
    fontWeight: '700',
  },
  receiptBadge: {
    backgroundColor: 'rgba(255, 142, 0, 0.15)',
    color: '#fc8019',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: '700',
  },
  receiptDivider: {
    borderTop: '1px dashed rgba(255, 255, 255, 0.15)',
  },
  receiptItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    color: 'var(--text-secondary)',
  },
  receiptItem: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  receiptTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: '700',
    fontSize: '1.05rem',
    color: '#ffffff',
  },
  deliveryTimeText: {
    fontSize: '0.92rem',
    color: 'var(--text-muted)',
    marginTop: '25px',
  }
};

// Inject custom input hover styles
if (typeof document !== 'undefined') {
  const styleTag = document.createElement('style');
  styleTag.innerHTML = `
    .checkout-input:focus, .checkout-textarea:focus {
      border-color: var(--primary-red) !important;
      box-shadow: 0 0 10px rgba(229, 9, 20, 0.15) !important;
      background: rgba(255, 255, 255, 0.04) !important;
    }
  `;
  document.head.appendChild(styleTag);
  styles.input['className'] = 'checkout-input';
  if (styles.textarea) styles.textarea['className'] = 'checkout-textarea';
}

export default Order;
