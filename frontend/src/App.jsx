import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Experience from './pages/Experience';
import Order from './pages/Order';
import Contact from './pages/Contact';
import Admin from './pages/Admin';

function App() {
  const [activePage, setActivePage] = useState('home');
  const [cart, setCart] = useState([]);
  const [settings, setSettings] = useState({
    name: 'Cloud 9 Café',
    logo: '/logo.png',
    phone: '+91 98765 43210',
    email: 'info@cloud9cafe.com',
    address: 'Cloud 9 Plaza, 4th Floor, Skyline Road, Mumbai, India',
    timings: 'Daily: 9:00 AM - 11:00 PM'
  });
  const [isAdmin, setIsAdmin] = useState(
    localStorage.getItem('isAdmin') === 'true'
  );

  const loginAdmin = (passcode) => {
    if (passcode === 'admin99') {
      setIsAdmin(true);
      localStorage.setItem('isAdmin', 'true');
      setActivePage('admin');
      return true;
    }
    alert('Incorrect passcode. Access Denied!');
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
    if (activePage === 'admin') {
      setActivePage('home');
    }
  };

  const fetchSettings = () => {
    fetch('/api/settings')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch settings');
        return res.json();
      })
      .then((data) => setSettings(data))
      .catch((err) => console.error('Error fetching settings:', err));
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Add Item to Basket (Cart)
  const addToCart = (item) => {
    setCart((prevCart) => {
      const existing = prevCart.find((c) => c.id === item.id);
      if (existing) {
        return prevCart.map((c) => 
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  // Remove / Decrement Item in Basket
  const removeFromCart = (itemId) => {
    setCart((prevCart) => {
      const existing = prevCart.find((c) => c.id === itemId);
      if (existing) {
        if (existing.quantity <= 1) {
          return prevCart.filter((c) => c.id !== itemId);
        }
        return prevCart.map((c) => 
          c.id === itemId ? { ...c, quantity: c.quantity - 1 } : c
        );
      }
      return prevCart;
    });
  };

  // Clear Basket (Upon direct checkout success)
  const clearCart = () => {
    setCart([]);
  };

  // Simple Router mapping
  const renderActivePage = () => {
    switch (activePage) {
      case 'home':
        return <Home setActivePage={setActivePage} settings={settings} />;
      case 'menu':
        return <Menu cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} />;
      case 'experience':
        return <Experience />;
      case 'order':
        return <Order cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} clearCart={clearCart} />;
      case 'contact':
        return <Contact settings={settings} />;
      case 'admin':
        return isAdmin ? (
          <Admin settings={settings} onSettingsChange={fetchSettings} onLogout={logoutAdmin} />
        ) : (
          <Home setActivePage={setActivePage} settings={settings} />
        );
      default:
        return <Home setActivePage={setActivePage} settings={settings} />;
    }
  };

  return (
    <div className="app-container">
      {/* Dynamic glow design background shadows */}
      <div style={styles.ambientTopGlow} />
      
      {/* Sticky Header Navbar */}
      <Navbar activePage={activePage} setActivePage={setActivePage} cart={cart} settings={settings} isAdmin={isAdmin} />

      {/* Main Routed Content */}
      <main className="main-content">
        {renderActivePage()}
      </main>

      {/* Sticky Footer Layout */}
      <Footer 
        setActivePage={setActivePage} 
        settings={settings} 
        isAdmin={isAdmin} 
        onAdminLogin={loginAdmin} 
        onAdminLogout={logoutAdmin} 
      />
    </div>
  );
}

const styles = {
  ambientTopGlow: {
    position: 'absolute',
    top: 0,
    left: '10%',
    width: '80%',
    height: '600px',
    background: 'radial-gradient(ellipse at 50% 0%, rgba(229, 9, 20, 0.12) 0%, transparent 65%)',
    pointerEvents: 'none',
    zIndex: 1,
  }
};

export default App;
