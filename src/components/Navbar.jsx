import React, { useState } from 'react';
import { ShoppingBag, Menu, X, Coffee } from 'lucide-react';

const Navbar = ({ activePage, setActivePage, cart }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Menu' },
    { id: 'experience', label: '3D Experience' },
    { id: 'order', label: 'Order Now' },
    { id: 'contact', label: 'Contact' }
  ];

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="glass-panel" style={styles.nav}>
      <div style={styles.navContainer}>
        {/* Brand/Logo */}
        <div onClick={() => handleNavClick('home')} style={styles.logoContainer}>
          <img 
            src="/logo.png" 
            alt="Cloud 9 Café Logo" 
            style={styles.logoImg}
            onError={(e) => {
              // Fallback if image fails to load
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div style={{ ...styles.fallbackLogo, display: 'none' }}>
            <Coffee size={24} color="#ff3344" />
          </div>
          <span style={styles.logoText}>
            Cloud <span style={styles.logoRed}>9</span> Café
          </span>
        </div>

        {/* Desktop Navigation */}
        <div style={styles.navLinks}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              style={{
                ...styles.navLink,
                ...(activePage === item.id ? styles.activeNavLink : {})
              }}
            >
              {item.label}
              {activePage === item.id && <span style={styles.activeDot} />}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div style={styles.actions}>
          <button 
            onClick={() => handleNavClick('order')} 
            style={styles.cartBtn}
            className="btn"
          >
            <ShoppingBag size={20} />
            {totalCartItems > 0 && (
              <span style={styles.cartBadge}>{totalCartItems}</span>
            )}
          </button>

          <button 
            onClick={() => setIsOpen(!isOpen)} 
            style={styles.menuToggle}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="glass-panel animate-fade-in-up" style={styles.mobileMenu}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              style={{
                ...styles.mobileNavLink,
                ...(activePage === item.id ? styles.mobileActiveNavLink : {})
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

const styles = {
  nav: {
    position: 'fixed',
    top: '15px',
    left: '5%',
    right: '5%',
    width: '90%',
    height: '65px',
    zIndex: 1000,
    borderRadius: '40px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    display: 'flex',
    alignItems: 'center',
    padding: '0 25px',
    margin: '0 auto',
    background: 'rgba(10, 10, 12, 0.65)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
  },
  navContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
  },
  logoImg: {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '1px solid rgba(255, 14, 60, 0.3)',
  },
  fallbackLogo: {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    background: 'rgba(255, 14, 60, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontFamily: 'var(--font-title)',
    fontSize: '1.4rem',
    fontWeight: '800',
    letterSpacing: '-0.02em',
    color: '#ffffff',
  },
  logoRed: {
    color: 'var(--primary-red)',
    textShadow: '0 0 10px rgba(229, 9, 20, 0.5)',
  },
  navLinks: {
    display: 'flex',
    gap: '24px',
    alignItems: 'center',
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  navLink: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    fontSize: '0.95rem',
    fontWeight: '500',
    cursor: 'pointer',
    padding: '8px 4px',
    position: 'relative',
    transition: 'var(--transition-fast)',
    outline: 'none',
  },
  activeNavLink: {
    color: '#ffffff',
    fontWeight: '600',
  },
  activeDot: {
    position: 'absolute',
    bottom: '-2px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary-red)',
    boxShadow: '0 0 6px var(--primary-red)',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  cartBtn: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '50%',
    width: '42px',
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    cursor: 'pointer',
    position: 'relative',
    padding: 0,
    transition: 'var(--transition-fast)',
    ':hover': {
      background: 'rgba(255, 14, 60, 0.1)',
      borderColor: 'var(--primary-red)',
    }
  },
  cartBadge: {
    position: 'absolute',
    top: '-3px',
    right: '-3px',
    background: 'var(--primary-red)',
    color: '#ffffff',
    fontSize: '0.75rem',
    fontWeight: '700',
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 8px rgba(229, 9, 20, 0.6)',
  },
  menuToggle: {
    display: 'none',
    background: 'none',
    border: 'none',
    color: '#ffffff',
    cursor: 'pointer',
    padding: '4px',
    '@media (max-width: 768px)': {
      display: 'block',
    },
  },
  mobileMenu: {
    position: 'absolute',
    top: '75px',
    left: 0,
    right: 0,
    background: 'rgba(10, 10, 12, 0.95)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '20px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.8)',
  },
  mobileNavLink: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    fontSize: '1.1rem',
    fontWeight: '500',
    padding: '10px 0',
    textAlign: 'left',
    cursor: 'pointer',
    borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
  },
  mobileActiveNavLink: {
    color: 'var(--accent-red)',
    fontWeight: '700',
    borderBottomColor: 'var(--primary-red)',
  }
};

// Add desktop/mobile CSS media rules dynamically or inject via a stylesheet
if (typeof document !== 'undefined') {
  const styleTag = document.createElement('style');
  styleTag.innerHTML = `
    @media (max-width: 768px) {
      .desktop-links {
        display: none !important;
      }
      nav > div > button {
        display: block !important;
      }
    }
    @media (min-width: 769px) {
      .menu-toggle-btn {
        display: none !important;
      }
    }
  `;
  // Set custom classes as style triggers
  styles.navLinks['className'] = 'desktop-links';
  styles.menuToggle['className'] = 'menu-toggle-btn';
}

export default Navbar;
