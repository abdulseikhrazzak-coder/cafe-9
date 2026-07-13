import React, { useState } from 'react';
import { Search, ShoppingCart, Plus, Minus, Check } from 'lucide-react';

const Menu = ({ cart, addToCart, removeFromCart }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dietFilter, setDietFilter] = useState('all'); // all, veg, nonveg
  const [addedAnimationId, setAddedAnimationId] = useState(null);

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'hot-coffee', label: 'Hot Coffee' },
    { id: 'cold-coffee', label: 'Cold Coffee' },
    { id: 'snacks', label: 'Snacks' },
    { id: 'desserts', label: 'Desserts' }
  ];

  const menuItems = [
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
    { id: 'ds8', name: 'Red Velvet Cake Slice', category: 'desserts', price: 190, isVeg: true, desc: 'Crimson cocoa cake layers frosted with sweet cream cheese frosting.' }
  ];

  // Filtering Logic
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDiet = dietFilter === 'all' || 
                        (dietFilter === 'veg' && item.isVeg) || 
                        (dietFilter === 'nonveg' && !item.isVeg);
    return matchesCategory && matchesSearch && matchesDiet;
  });

  const getCartQuantity = (id) => {
    const item = cart.find(c => c.id === id);
    return item ? item.quantity : 0;
  };

  const handleAddToCart = (item) => {
    addToCart(item);
    setAddedAnimationId(item.id);
    setTimeout(() => {
      setAddedAnimationId(null);
    }, 800);
  };

  return (
    <div style={styles.container} className="animate-fade-in-up">
      <div className="gradient-overlay" />

      <section style={styles.menuHeaderSection}>
        <div className="section-header">
          <span className="section-subtitle">Exquisite Taste</span>
          <h1 className="section-title">Cloud 9 <span>Menu</span></h1>
        </div>

        {/* Search and Food Habit Filter Panel */}
        <div style={styles.filterControls} className="glass-panel">
          {/* Search Box */}
          <div style={styles.searchBox}>
            <Search size={18} color="var(--text-muted)" style={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search coffee, desserts, snacks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          {/* Diet Habit Switcher */}
          <div style={styles.dietSelector}>
            <button 
              onClick={() => setDietFilter('all')}
              style={{
                ...styles.dietBtn,
                ...(dietFilter === 'all' ? styles.dietBtnActive : {})
              }}
            >
              All
            </button>
            <button 
              onClick={() => setDietFilter('veg')}
              style={{
                ...styles.dietBtn,
                ...(dietFilter === 'veg' ? styles.dietBtnActive : {})
              }}
            >
              Veg Only
            </button>
            <button 
              onClick={() => setDietFilter('nonveg')}
              style={{
                ...styles.dietBtn,
                ...(dietFilter === 'nonveg' ? styles.dietBtnActive : {})
              }}
            >
              Non-Veg
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div style={styles.categoryTabs}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                ...styles.categoryTabBtn,
                ...(activeCategory === cat.id ? styles.categoryTabBtnActive : {})
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Menu Grid */}
      <section style={styles.menuGridSection}>
        {filteredItems.length > 0 ? (
          <div className="grid-3" style={styles.menuGrid}>
            {filteredItems.map((item) => {
              const qty = getCartQuantity(item.id);
              const isAnimating = addedAnimationId === item.id;
              
              return (
                <div key={item.id} className="glass-panel" style={styles.menuCard}>
                  {/* Card Header (Veg/Nonveg Badge) */}
                  <div style={styles.cardHeader}>
                    <div style={styles.badgeRow}>
                      <span className={item.isVeg ? 'veg-indicator' : 'nonveg-indicator'} title={item.isVeg ? 'Veg' : 'Non-Veg'} />
                      <span style={styles.dietLabel}>{item.isVeg ? 'VEG' : 'NON-VEG'}</span>
                    </div>
                    <span style={styles.itemCategoryName}>{item.category.replace('-', ' ')}</span>
                  </div>

                  {/* Card Body */}
                  <div style={styles.cardBody}>
                    <h3 style={styles.itemName}>{item.name}</h3>
                    <p style={styles.itemDesc}>{item.desc}</p>
                  </div>

                  {/* Card Footer (Price and Add Actions) */}
                  <div style={styles.cardFooter}>
                    <span style={styles.itemPrice}>₹{item.price}</span>
                    
                    {qty > 0 ? (
                      <div style={styles.quantityControls}>
                        <button 
                          onClick={() => removeFromCart(item.id)} 
                          style={styles.quantityBtn}
                        >
                          <Minus size={14} />
                        </button>
                        <span style={styles.quantityVal}>{qty}</span>
                        <button 
                          onClick={() => addToCart(item)} 
                          style={styles.quantityBtn}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleAddToCart(item)}
                        className={`btn ${isAnimating ? 'btn-primary' : 'btn-outline-red'}`}
                        style={{
                          ...styles.addBtn,
                          ...(isAnimating ? { background: '#22c55e', boxShadow: '0 0 12px rgba(34, 197, 94, 0.5)', borderColor: '#22c55e' } : {})
                        }}
                      >
                        {isAnimating ? (
                          <>
                            <Check size={16} /> Added
                          </>
                        ) : (
                          <>
                            <ShoppingCart size={16} /> Add to Cart
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={styles.noResults} className="glass-panel">
            <h3 style={{ marginBottom: '10px' }}>No delicacies found</h3>
            <p style={{ color: 'var(--text-muted)' }}>Try adjusting your filters or search query.</p>
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
  menuHeaderSection: {
    paddingBottom: '20px',
  },
  filterControls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px',
    maxWidth: '800px',
    margin: '0 auto 30px',
    padding: '12px 24px',
    borderRadius: '30px',
    background: 'rgba(15, 15, 17, 0.8)',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      borderRadius: '20px',
      padding: '16px',
    }
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
    position: 'relative',
    width: '100%',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
  },
  searchInput: {
    width: '100%',
    padding: '10px 10px 10px 40px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '25px',
    color: '#ffffff',
    fontSize: '0.92rem',
    outline: 'none',
    transition: 'var(--transition-fast)',
    ':focus': {
      borderColor: 'var(--primary-red)',
      background: 'rgba(255, 255, 255, 0.05)',
      boxShadow: '0 0 10px rgba(229, 9, 20, 0.1)',
    }
  },
  dietSelector: {
    display: 'flex',
    gap: '6px',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: '4px',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    flexShrink: 0,
    '@media (max-width: 768px)': {
      width: '100%',
      justifyContent: 'space-around',
    }
  },
  dietBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    fontSize: '0.85rem',
    fontWeight: '600',
    padding: '6px 16px',
    borderRadius: '16px',
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
  },
  dietBtnActive: {
    backgroundColor: 'var(--primary-red)',
    color: '#ffffff',
    boxShadow: '0 2px 8px rgba(229, 9, 20, 0.3)',
  },
  categoryTabs: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '12px',
    marginTop: '10px',
  },
  categoryTabBtn: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
    fontWeight: '600',
    padding: '10px 22px',
    borderRadius: '30px',
    cursor: 'pointer',
    transition: 'var(--transition-smooth)',
    ':hover': {
      borderColor: 'var(--primary-red)',
      color: '#ffffff',
      background: 'rgba(255, 14, 60, 0.02)',
    }
  },
  categoryTabBtnActive: {
    backgroundColor: 'var(--primary-red)',
    borderColor: 'var(--primary-red)',
    color: '#ffffff',
    boxShadow: '0 4px 15px rgba(229, 9, 20, 0.4)',
  },
  menuGridSection: {
    paddingTop: '20px',
    paddingBottom: '80px',
  },
  menuGrid: {
    marginTop: '20px',
  },
  menuCard: {
    padding: '25px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '220px',
    gap: '15px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  dietLabel: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'var(--text-muted)',
    letterSpacing: '0.5px',
  },
  itemCategoryName: {
    fontSize: '0.72rem',
    fontWeight: '700',
    color: 'var(--primary-red)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    backgroundColor: 'rgba(229, 9, 20, 0.06)',
    padding: '3px 8px',
    borderRadius: '4px',
  },
  cardBody: {
    flexGrow: 1,
  },
  itemName: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '8px',
  },
  itemDesc: {
    fontSize: '0.88rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.5',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid rgba(255, 255, 255, 0.04)',
    paddingTop: '15px',
    marginTop: '5px',
  },
  itemPrice: {
    fontFamily: 'var(--font-title)',
    fontSize: '1.3rem',
    fontWeight: '800',
    color: '#ffffff',
  },
  addBtn: {
    padding: '8px 16px',
    fontSize: '0.85rem',
    borderRadius: '30px',
  },
  quantityControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '20px',
    padding: '3px 8px',
  },
  quantityBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-primary)',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      color: 'var(--accent-red)',
    }
  },
  quantityVal: {
    fontSize: '0.9rem',
    fontWeight: '700',
    minWidth: '15px',
    textAlign: 'center',
  },
  noResults: {
    padding: '60px',
    textAlign: 'center',
    maxWidth: '600px',
    margin: '0 auto',
  }
};

// Inject hover and focus states custom styles
if (typeof document !== 'undefined') {
  const styleTag = document.createElement('style');
  styleTag.innerHTML = `
    .menu-search-input:focus {
      border-color: var(--primary-red) !important;
      background: rgba(255, 255, 255, 0.05) !important;
      box-shadow: 0 0 10px rgba(229, 9, 20, 0.2) !important;
    }
    .menu-cat-btn:hover {
      border-color: var(--primary-red) !important;
      color: #ffffff !important;
      background: rgba(255, 14, 60, 0.02) !important;
    }
  `;
  document.head.appendChild(styleTag);
  styles.searchInput['className'] = 'menu-search-input';
  styles.categoryTabBtn['className'] = 'menu-cat-btn';
}

export default Menu;
