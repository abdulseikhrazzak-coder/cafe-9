import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Experience from './pages/Experience';
import Order from './pages/Order';
import Contact from './pages/Contact';

function App() {
  const [activePage, setActivePage] = useState('home');
  const [cart, setCart] = useState([]);

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
        return <Home setActivePage={setActivePage} />;
      case 'menu':
        return <Menu cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} />;
      case 'experience':
        return <Experience />;
      case 'order':
        return <Order cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} clearCart={clearCart} />;
      case 'contact':
        return <Contact />;
      default:
        return <Home setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="app-container">
      {/* Dynamic glow design background shadows */}
      <div style={styles.ambientTopGlow} />
      
      {/* Sticky Header Navbar */}
      <Navbar activePage={activePage} setActivePage={setActivePage} cart={cart} />

      {/* Main Routed Content */}
      <main className="main-content">
        {renderActivePage()}
      </main>

      {/* Sticky Footer Layout */}
      <Footer setActivePage={setActivePage} />
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
