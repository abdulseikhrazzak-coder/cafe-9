import React, { useState, useEffect } from 'react';
import { ClipboardCheck, Coffee, Settings, Plus, Edit, Trash2, Save, FileImage, ShieldAlert, ShoppingBag, Eye, CheckCircle } from 'lucide-react';

const Admin = ({ settings, onSettingsChange, onLogout }) => {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'menu', 'settings'
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [menuForm, setMenuForm] = useState({
    id: '',
    name: '',
    category: 'hot-coffee',
    price: '',
    isVeg: true,
    desc: '',
    image: ''
  });
  const [isEditingMenu, setIsEditingMenu] = useState(false);
  const [showMenuForm, setShowMenuForm] = useState(false);
  
  const [settingsForm, setSettingsForm] = useState({
    name: '',
    logo: '',
    phone: '',
    email: '',
    address: '',
    timings: ''
  });

  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  const loadData = async () => {
    setLoading(true);
    try {
      const ordersRes = await fetch('/api/orders');
      const menuRes = await fetch('/api/menu');
      if (ordersRes.ok && menuRes.ok) {
        const ordersData = await ordersRes.json();
        const menuData = await menuRes.json();
        setOrders(ordersData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        setMenuItems(menuData);
      }
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- Orders Management Functions ---
  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOrderDelete = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setOrders(prev => prev.filter(o => o.id !== orderId));
      } else {
        alert('Failed to delete order');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- Menu CRUD Functions ---
  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    const url = isEditingMenu ? `/api/menu/${menuForm.id}` : '/api/menu';
    const method = isEditingMenu ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: menuForm.name,
          category: menuForm.category,
          price: Number(menuForm.price),
          isVeg: menuForm.isVeg,
          desc: menuForm.desc,
          image: menuForm.image
        })
      });
      if (res.ok) {
        await loadData();
        setShowMenuForm(false);
        setMenuForm({ id: '', name: '', category: 'hot-coffee', price: '', isVeg: true, desc: '', image: '' });
        setIsEditingMenu(false);
      } else {
        alert('Failed to save menu item');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMenuEditClick = (item) => {
    setMenuForm(item);
    setIsEditingMenu(true);
    setShowMenuForm(true);
  };

  const handleMenuDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;
    try {
      const res = await fetch(`/api/menu/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMenuItems(prev => prev.filter(item => item.id !== id));
      } else {
        alert('Failed to delete item');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setMenuForm(prev => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // --- Settings Customizer Functions ---
  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsForm)
      });
      if (res.ok) {
        alert('Café Settings updated successfully!');
        onSettingsChange();
      } else {
        alert('Failed to update settings');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setSettingsForm(prev => ({ ...prev, logo: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={styles.container} className="animate-fade-in-up">
      <div className="gradient-overlay" />

      <section style={styles.section}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginBottom: '30px' }}>
          <div className="section-header" style={{ margin: 0 }}>
            <span className="section-subtitle">Owner Controls</span>
            <h1 className="section-title">Café <span>Admin Dashboard</span></h1>
          </div>
          <button 
            onClick={onLogout}
            className="btn btn-secondary"
            style={{ marginBottom: '15px', padding: '10px 20px', fontSize: '0.9rem', borderColor: '#ef4444', color: '#ef4444' }}
          >
            Log Out Session
          </button>
        </div>

        {/* Tab Controls */}
        <div style={styles.tabContainer} className="glass-panel">
          <button 
            onClick={() => setActiveTab('orders')}
            style={{ ...styles.tabBtn, ...(activeTab === 'orders' ? styles.activeTabBtn : {}) }}
          >
            <ClipboardCheck size={18} /> Orders Manager ({orders.length})
          </button>
          <button 
            onClick={() => setActiveTab('menu')}
            style={{ ...styles.tabBtn, ...(activeTab === 'menu' ? styles.activeTabBtn : {}) }}
          >
            <Coffee size={18} /> Menu Manager ({menuItems.length})
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            style={{ ...styles.tabBtn, ...(activeTab === 'settings' ? styles.activeTabBtn : {}) }}
          >
            <Settings size={18} /> Site Customizer
          </button>
        </div>

        {loading ? (
          <div style={styles.centerText}>Loading administration data...</div>
        ) : (
          <div style={{ marginTop: '20px' }}>
            
            {/* --- TAB 1: ORDERS --- */}
            {activeTab === 'orders' && (
              <div style={styles.tableCard} className="glass-panel">
                <h3 style={styles.cardHeader}>Recent Customer Orders</h3>
                {orders.length === 0 ? (
                  <p style={styles.emptyText}>No orders placed yet.</p>
                ) : (
                  <div style={styles.responsiveTableContainer}>
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Customer</th>
                          <th>Items</th>
                          <th>Payment</th>
                          <th>Total</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((o) => (
                          <tr key={o.id} style={styles.tr}>
                            <td style={styles.orderId}>{o.id}</td>
                            <td>
                              <div style={{ fontWeight: '600', color: '#fff' }}>{o.customer.name}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{o.customer.phone}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'pre-line', maxWidth: '200px' }}>
                                {o.customer.type === 'delivery' ? o.customer.address : 'Self-Pickup'}
                              </div>
                            </td>
                            <td>
                              <ul style={{ paddingLeft: '15px', margin: 0, fontSize: '0.85rem' }}>
                                {o.items.map((item, idx) => (
                                  <li key={idx}>
                                    {item.name} <span style={{ color: 'var(--primary-red)' }}>x{item.quantity}</span>
                                  </li>
                                ))}
                              </ul>
                            </td>
                            <td style={{ fontSize: '0.85rem' }}>{o.customer.payment.toUpperCase()}</td>
                            <td style={{ fontWeight: '700', color: '#fff' }}>₹{o.total}</td>
                            <td>
                              <select 
                                value={o.status}
                                onChange={(e) => handleOrderStatusUpdate(o.id, e.target.value)}
                                style={{
                                  ...styles.selectInput,
                                  color: o.status === 'Delivered' ? '#22c55e' : (o.status === 'Cancelled' ? '#ef4444' : '#f59e0b')
                                }}
                              >
                                <option value="Preparing">Preparing</option>
                                <option value="Out for Delivery">Out for Delivery</option>
                                <option value="Ready for Pickup">Ready for Pickup</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td>
                              <button onClick={() => handleOrderDelete(o.id)} style={styles.deleteBtn} title="Delete Order">
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* --- TAB 2: MENU MANAGER --- */}
            {activeTab === 'menu' && (
              <div style={styles.flexCol}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, color: '#fff', fontSize: '1.25rem' }}>Menu Items List</h3>
                  <button 
                    onClick={() => {
                      setIsEditingMenu(false);
                      setMenuForm({ id: '', name: '', category: 'hot-coffee', price: '', isVeg: true, desc: '', image: '' });
                      setShowMenuForm(true);
                    }}
                    className="btn btn-primary"
                    style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                  >
                    <Plus size={16} /> Add Food/Drink
                  </button>
                </div>

                {showMenuForm && (
                  <form onSubmit={handleMenuSubmit} className="glass-panel" style={styles.formPanel}>
                    <h4 style={{ margin: '0 0 15px 0', color: 'var(--primary-red)' }}>
                      {isEditingMenu ? 'Edit Menu Item' : 'Create New Menu Item'}
                    </h4>
                    
                    <div style={styles.grid2}>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Item Name *</label>
                        <input 
                          type="text" 
                          required
                          value={menuForm.name} 
                          onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })} 
                          placeholder="e.g. Hazelnut Frappé"
                          style={styles.input} 
                        />
                      </div>
                      <div style={styles.grid2}>
                        <div style={styles.formGroup}>
                          <label style={styles.label}>Price (₹) *</label>
                          <input 
                            type="number" 
                            required
                            value={menuForm.price} 
                            onChange={(e) => setMenuForm({ ...menuForm, price: e.target.value })} 
                            placeholder="e.g. 180"
                            style={styles.input} 
                          />
                        </div>
                        <div style={styles.formGroup}>
                          <label style={styles.label}>Category *</label>
                          <select 
                            value={menuForm.category} 
                            onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value })} 
                            style={styles.selectInputFull}
                          >
                            <option value="hot-coffee">Hot Coffee</option>
                            <option value="cold-coffee">Cold Coffee</option>
                            <option value="snacks">Snacks</option>
                            <option value="desserts">Desserts</option>
                            <option value="tandoor-soups">Tandoor & Soups</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="admin-grid2" style={styles.grid2}>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Description</label>
                        <textarea 
                          value={menuForm.desc} 
                          onChange={(e) => setMenuForm({ ...menuForm, desc: e.target.value })} 
                          placeholder="Short description of ingredients/flavor"
                          rows={3}
                          style={styles.textarea} 
                        />
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Food Diet Type</label>
                        <div style={styles.radioGroup}>
                          <label style={{
                            ...styles.radioButton,
                            ...(menuForm.isVeg ? styles.radioButtonActive : {})
                          }}>
                            <input 
                              type="radio" 
                              name="isVeg" 
                              checked={menuForm.isVeg === true}
                              onChange={() => setMenuForm({ ...menuForm, isVeg: true })}
                              style={{ display: 'none' }}
                            />
                            Veg (Vegetarian)
                          </label>
                          <label style={{
                            ...styles.radioButton,
                            ...(!menuForm.isVeg ? styles.radioButtonActive : {})
                          }}>
                            <input 
                              type="radio" 
                              name="isVeg" 
                              checked={menuForm.isVeg === false}
                              onChange={() => setMenuForm({ ...menuForm, isVeg: false })}
                              style={{ display: 'none' }}
                            />
                            Non-Veg
                          </label>
                        </div>
                      </div>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Food Photo (Upload Image File or Paste URL)</label>
                      <div className="admin-image-selector" style={styles.imageSelectorBox}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <input 
                            type="text" 
                            value={menuForm.image} 
                            onChange={(e) => setMenuForm({ ...menuForm, image: e.target.value })} 
                            placeholder="Paste image URL (Unsplash, local public, etc.)"
                            style={styles.input} 
                          />
                          <div style={styles.fileUploadBtn}>
                            <FileImage size={16} /> Upload from Local Files
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={handleImageUpload}
                              style={styles.fileInputHidden}
                            />
                          </div>
                        </div>
                        {menuForm.image && (
                          <div style={styles.imagePreviewBox}>
                            <img src={menuForm.image} alt="Preview" style={styles.imagePreview} />
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                      <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px' }}>
                        <Save size={18} /> Save Item
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setShowMenuForm(false)} 
                        className="btn btn-secondary"
                        style={{ padding: '10px 20px' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div style={styles.menuGrid}>
                  {menuItems.map((item) => (
                    <div key={item.id} className="glass-panel" style={styles.menuItemCard}>
                      <img 
                        src={item.image || "/fallback-coffee.jpg"} 
                        alt={item.name} 
                        style={styles.itemImg}
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500'; }}
                      />
                      <div style={styles.itemInfo}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h4 style={styles.itemName}>{item.name}</h4>
                          <span style={styles.itemPrice}>₹{item.price}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '5px', margin: '5px 0' }}>
                          <span style={styles.categoryBadge}>{item.category}</span>
                          <span style={{ 
                            ...styles.dietBadge, 
                            borderColor: item.isVeg ? '#22c55e' : '#ef4444', 
                            color: item.isVeg ? '#22c55e' : '#ef4444' 
                          }}>
                            {item.isVeg ? 'Veg' : 'Non-Veg'}
                          </span>
                        </div>
                        <p style={styles.itemDesc}>{item.desc}</p>
                        
                        <div style={styles.itemActions}>
                          <button onClick={() => handleMenuEditClick(item)} style={styles.editBtn}>
                            <Edit size={14} /> Edit
                          </button>
                          <button onClick={() => handleMenuDelete(item.id)} style={styles.deleteMenuBtn}>
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* --- TAB 3: SITE CUSTOMIZER --- */}
            {activeTab === 'settings' && (
              <form onSubmit={handleSettingsSubmit} className="glass-panel" style={styles.settingsForm}>
                <h3 style={styles.cardHeader}><Settings size={20} color="var(--primary-red)" /> Café Info Settings</h3>
                
                <div className="admin-grid2" style={styles.grid2}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Café Brand Name *</label>
                    <input 
                      type="text" 
                      required
                      value={settingsForm.name} 
                      onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })} 
                      placeholder="e.g. Cloud 9 Café"
                      style={styles.input} 
                    />
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Café Logo (Upload Image File or Paste URL)</label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <input 
                        type="text" 
                        value={settingsForm.logo} 
                        onChange={(e) => setSettingsForm({ ...settingsForm, logo: e.target.value })} 
                        placeholder="Paste image URL or upload below"
                        style={{ ...styles.input, flex: 1 }} 
                      />
                      <div style={{ ...styles.fileUploadBtn, margin: 0, padding: '12px' }}>
                        <FileImage size={16} /> Upload
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleLogoUpload}
                          style={styles.fileInputHidden}
                        />
                      </div>
                      {settingsForm.logo && (
                        <img 
                          src={settingsForm.logo} 
                          alt="Logo Preview" 
                          style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255, 14, 60, 0.3)' }} 
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="admin-grid2" style={styles.grid2}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Contact Phone Number *</label>
                    <input 
                      type="text" 
                      required
                      value={settingsForm.phone} 
                      onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })} 
                      placeholder="+91 98765 43210"
                      style={styles.input} 
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Contact Email *</label>
                    <input 
                      type="email" 
                      required
                      value={settingsForm.email} 
                      onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })} 
                      placeholder="info@cloud9cafe.com"
                      style={styles.input} 
                    />
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Physical Address *</label>
                  <input 
                    type="text" 
                    required
                    value={settingsForm.address} 
                    onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })} 
                    placeholder="Café Address Details"
                    style={styles.input} 
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Timings & Hours of Operation *</label>
                  <input 
                    type="text" 
                    required
                    value={settingsForm.timings} 
                    onChange={(e) => setSettingsForm({ ...settingsForm, timings: e.target.value })} 
                    placeholder="e.g. Daily: 9:00 AM - 11:00 PM"
                    style={styles.input} 
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ padding: '12px 24px', alignSelf: 'flex-start', marginTop: '10px' }}>
                  <Save size={18} /> Update Brand Settings
                </button>
              </form>
            )}

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
  tabContainer: {
    display: 'flex',
    gap: '10px',
    padding: '10px',
    borderRadius: '12px',
    marginBottom: '20px',
    overflowX: 'auto',
  },
  tabBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    padding: '10px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '500',
    fontSize: '0.95rem',
    whiteSpace: 'nowrap',
    transition: 'var(--transition-fast)',
  },
  activeTabBtn: {
    background: 'rgba(255, 14, 60, 0.1)',
    color: '#fff',
    border: '1px solid rgba(255, 14, 60, 0.3)',
  },
  centerText: {
    textAlign: 'center',
    color: 'var(--text-muted)',
    padding: '40px',
  },
  emptyText: {
    color: 'var(--text-muted)',
    textAlign: 'center',
    padding: '20px',
  },
  tableCard: {
    padding: '25px',
    borderRadius: '16px',
  },
  cardHeader: {
    margin: '0 0 20px 0',
    color: '#fff',
    fontSize: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  responsiveTableContainer: {
    overflowX: 'auto',
    width: '100%',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  tr: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  orderId: {
    color: 'var(--primary-red)',
    fontWeight: '700',
    fontSize: '0.85rem',
  },
  selectInput: {
    background: 'rgba(10, 10, 12, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '6px',
    padding: '6px 10px',
    outline: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontWeight: '600',
  },
  selectInputFull: {
    background: 'rgba(10, 10, 12, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    padding: '12px',
    outline: 'none',
    cursor: 'pointer',
    color: '#fff',
    fontFamily: 'inherit',
    width: '100%',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    color: '#ef4444',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '4px',
    transition: 'var(--transition-fast)',
    ':hover': {
      background: 'rgba(239, 68, 68, 0.1)',
    }
  },
  deleteMenuBtn: {
    background: 'none',
    border: '1px solid #ef4444',
    color: '#ef4444',
    cursor: 'pointer',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '0.8rem',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    transition: 'var(--transition-fast)',
  },
  editBtn: {
    background: 'none',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: '#fff',
    cursor: 'pointer',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '0.8rem',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    transition: 'var(--transition-fast)',
  },
  flexCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formPanel: {
    padding: '25px',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
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
  },
  input: {
    background: 'rgba(10, 10, 12, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    padding: '12px',
    color: '#fff',
    outline: 'none',
    fontSize: '0.95rem',
    transition: 'var(--transition-fast)',
    width: '100%',
  },
  textarea: {
    background: 'rgba(10, 10, 12, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    padding: '12px',
    color: '#fff',
    outline: 'none',
    fontSize: '0.95rem',
    transition: 'var(--transition-fast)',
    width: '100%',
    fontFamily: 'inherit',
    resize: 'vertical',
  },
  radioGroup: {
    display: 'flex',
    gap: '10px',
  },
  radioButton: {
    flex: 1,
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    background: 'rgba(10, 10, 12, 0.8)',
    color: 'var(--text-secondary)',
    textAlign: 'center',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'var(--transition-fast)',
    display: 'block',
  },
  radioButtonActive: {
    background: 'rgba(255, 14, 60, 0.1)',
    borderColor: 'var(--primary-red)',
    color: '#fff',
  },
  imageSelectorBox: {
    display: 'flex',
    gap: '20px',
    alignItems: 'flex-start',
  },
  fileUploadBtn: {
    position: 'relative',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px dashed rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    padding: '14px',
    textAlign: 'center',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  fileInputHidden: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: 'pointer',
  },
  imagePreviewBox: {
    width: '120px',
    height: '120px',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0,0,0,0.2)',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  menuGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
    marginTop: '10px',
  },
  menuItemCard: {
    borderRadius: '16px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  itemImg: {
    width: '100%',
    height: '160px',
    objectFit: 'cover',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  itemInfo: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: 1,
  },
  itemName: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#fff',
    margin: 0,
  },
  itemPrice: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: 'var(--primary-red)',
  },
  categoryBadge: {
    fontSize: '0.75rem',
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '4px 8px',
    borderRadius: '4px',
    color: 'var(--text-muted)',
    textTransform: 'capitalize',
  },
  dietBadge: {
    fontSize: '0.75rem',
    border: '1px solid',
    padding: '3px 8px',
    borderRadius: '4px',
  },
  itemDesc: {
    fontSize: '0.82rem',
    color: 'var(--text-muted)',
    lineHeight: '1.5',
    margin: '5px 0 15px 0',
    flex: 1,
  },
  itemActions: {
    display: 'flex',
    gap: '10px',
    marginTop: 'auto',
  },
  settingsForm: {
    padding: '30px',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  }
};

// Inject custom table stylesheet rule
if (typeof document !== 'undefined') {
  const styleTag = document.createElement('style');
  styleTag.innerHTML = `
    table th {
      padding: 12px 16px;
      font-size: 0.88rem;
      font-weight: 600;
      color: var(--text-secondary);
      border-bottom: 2px solid rgba(255, 255, 255, 0.08);
    }
    table td {
      padding: 16px;
      vertical-align: top;
    }
  `;
  document.head.appendChild(styleTag);
}

export default Admin;
