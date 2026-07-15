import React from 'react';
import { Coffee, ArrowRight, Star, Heart, Compass } from 'lucide-react';
import ThreeCoffeeCup from '../components/ThreeCoffeeCup';

const Home = ({ setActivePage, settings }) => {
  const reviews = [
    {
      name: 'Aarav Mehta',
      role: 'Coffee Enthusiast',
      rating: 5,
      comment: 'The cappuccino here is next level, and the dark-red aesthetic is so moody and premium. Simply outstanding!'
    },
    {
      name: 'Pooja Sharma',
      role: 'Food Blogger',
      rating: 5,
      comment: 'Loved the Belgian Chocolate shake! The interface to order is super smooth, and they deliver incredibly fast.'
    },
    {
      name: 'Vikram Malhotra',
      role: 'Daily Regular',
      rating: 5,
      comment: 'Cloud 9 Café has become my go-to remote workspace. The 3D scene on their site is gorgeous and reflects their tech-forward vibe!'
    }
  ];

  return (
    <div style={styles.container} className="animate-fade-in-up">
      <div className="gradient-overlay" />

      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div className="hero-grid" style={styles.heroGrid}>
          {/* Hero Left Content */}
          <div style={styles.heroTextContainer}>
            <span className="badge badge-red hero-badge" style={styles.heroBadge}>
              <Coffee size={12} style={{ marginRight: '5px' }} /> Premium Coffee House
            </span>
            <h1 className="hero-title" style={styles.heroTitle}>
              Coffee Elevated <br />
              to <span style={styles.accentText} className="glow-text">
                {settings.name.includes('9') ? (
                  <>
                    {settings.name.split('9')[0]}
                    <span>9</span>
                    {settings.name.split('9')[1]}
                  </>
                ) : settings.name}
              </span>
            </h1>
            <p className="hero-description" style={styles.heroDescription}>
              Step into a premium sensory journey. Indulge in our craft coffees and delicacies, tailored to perfection and served in our iconic dark & crimson ambiance.
            </p>
            <div className="hero-btn-group" style={styles.btnGroup}>
              <button 
                onClick={() => setActivePage('menu')} 
                className="btn btn-primary"
                style={styles.heroBtn}
              >
                Explore Menu <ArrowRight size={18} />
              </button>
              <button 
                onClick={() => setActivePage('experience')} 
                className="btn btn-secondary"
                style={styles.heroBtn}
              >
                Experience 3D
              </button>
            </div>
          </div>

          {/* Hero Right 3D Scene */}
          <div className="hero-canvas-container" style={styles.heroCanvasContainer}>
            <ThreeCoffeeCup />
            <div style={styles.hintOverlay}>
              <span className="animate-float" style={styles.hintText}>
                <Compass size={14} style={{ marginRight: '6px' }} /> Drag to Rotate Cup
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="glass-panel home-features-section" style={styles.featuresSection}>
        <div className="section-header">
          <span className="section-subtitle">Why Choose Us</span>
          <h2 className="section-title">The Cloud 9 <span>Craft</span></h2>
        </div>
        <div className="grid-3" style={styles.featuresGrid}>
          <div style={styles.featureCard}>
            <div style={styles.featureIconContainer}>
              <Coffee size={28} color="var(--accent-red)" />
            </div>
            <h3 style={styles.featureTitle}>100% Arabica Beans</h3>
            <p style={styles.featureDesc}>
              Sourced ethically from organic single-origin farms, roasted in micro-batches to preserve absolute flavor notes.
            </p>
          </div>

          <div style={styles.featureCard}>
            <div style={styles.featureIconContainer}>
              <Star size={28} color="var(--accent-red)" />
            </div>
            <h3 style={styles.featureTitle}>Master Baristas</h3>
            <p style={styles.featureDesc}>
              Our brews are prepared with expert calculations of water temperature, pressure, and extraction time.
            </p>
          </div>

          <div style={styles.featureCard}>
            <div style={styles.featureIconContainer}>
              <Heart size={28} color="var(--accent-red)" />
            </div>
            <h3 style={styles.featureTitle}>Premium Vibe</h3>
            <p style={styles.featureDesc}>
              A futuristic, dark-ambient space with striking crimson neon glow lines designed for deep thoughts and great chats.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Banner / Quote */}
      <section style={styles.quoteSection}>
        <div style={styles.quoteContainer}>
          <h2 className="home-quote-text" style={styles.quoteText}>
            "Good communication is just as stimulating as black coffee, and just as hard to sleep after."
          </h2>
          <p style={styles.quoteAuthor}>— Anne Morrow Lindbergh</p>
        </div>
      </section>

      {/* Review Section */}
      <section style={styles.reviewSection}>
        <div className="section-header">
          <span className="section-subtitle">Testimonials</span>
          <h2 className="section-title">Loved By <span>Many</span></h2>
        </div>
        <div className="grid-3">
          {reviews.map((rev, index) => (
            <div key={index} className="glass-panel" style={styles.reviewCard}>
              <div style={styles.starsRow}>
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="var(--primary-red)" color="var(--primary-red)" />
                ))}
              </div>
              <p style={styles.reviewComment}>"{rev.comment}"</p>
              <div style={styles.reviewerInfo}>
                <div style={styles.reviewerAvatar}>
                  {rev.name.charAt(0)}
                </div>
                <div>
                  <h4 style={styles.reviewerName}>{rev.name}</h4>
                  <span style={styles.reviewerRole}>{rev.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    width: '100%',
  },
  heroSection: {
    minHeight: 'calc(100vh - 80px)',
    display: 'flex',
    alignItems: 'center',
    padding: '40px 5%',
  },
  heroGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.1fr',
    gap: '40px',
    width: '100%',
    alignItems: 'center',
  },
  heroTextContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    zIndex: 5,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    display: 'flex',
    alignItems: 'center',
    padding: '6px 14px',
    fontSize: '0.8rem',
    letterSpacing: '1px',
    backgroundColor: 'rgba(229, 9, 20, 0.1)',
    border: '1px solid rgba(229, 9, 20, 0.3)',
    borderRadius: '20px',
  },
  heroTitle: {
    fontSize: '4.2rem',
    fontWeight: '800',
    lineHeight: '1.1',
    letterSpacing: '-0.03em',
    color: '#ffffff',
  },
  accentText: {
    color: 'var(--accent-red)',
  },
  heroDescription: {
    fontSize: '1.15rem',
    lineHeight: '1.6',
    color: 'var(--text-secondary)',
    maxWidth: '520px',
  },
  btnGroup: {
    display: 'flex',
    gap: '16px',
    marginTop: '10px',
  },
  heroBtn: {
    padding: '14px 32px',
    fontSize: '1rem',
  },
  heroCanvasContainer: {
    height: '520px',
    position: 'relative',
    width: '100%',
  },
  hintOverlay: {
    position: 'absolute',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    pointerEvents: 'none',
  },
  hintText: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '8px 16px',
    fontSize: '0.8rem',
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.6)',
    backgroundColor: 'rgba(10, 10, 12, 0.7)',
    borderRadius: '30px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(5px)',
  },
  featuresSection: {
    margin: '60px auto',
    padding: '60px 40px',
    background: 'linear-gradient(135deg, rgba(20, 20, 25, 0.8) 0%, rgba(10, 10, 12, 0.9) 100%)',
  },
  featuresGrid: {
    marginTop: '20px',
  },
  featureCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '20px',
  },
  featureIconContainer: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 14, 60, 0.08)',
    border: '1px solid rgba(255, 14, 60, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
    boxShadow: '0 0 15px rgba(255, 14, 60, 0.1)',
  },
  featureTitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
    marginBottom: '10px',
    color: '#ffffff',
  },
  featureDesc: {
    fontSize: '0.92rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
  },
  quoteSection: {
    padding: '100px 5%',
    background: 'radial-gradient(ellipse at center, rgba(229, 9, 20, 0.08) 0%, transparent 70%)',
    textAlign: 'center',
  },
  quoteContainer: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  quoteText: {
    fontFamily: 'var(--font-accent)',
    fontSize: '2rem',
    fontWeight: '400',
    fontStyle: 'italic',
    lineHeight: '1.5',
    color: '#ffffff',
    marginBottom: '20px',
  },
  quoteAuthor: {
    color: 'var(--primary-red)',
    fontWeight: '600',
    letterSpacing: '1px',
    fontSize: '0.95rem',
  },
  reviewSection: {
    paddingBottom: '80px',
  },
  reviewCard: {
    padding: '30px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  starsRow: {
    display: 'flex',
    gap: '4px',
  },
  reviewComment: {
    fontSize: '0.95rem',
    lineHeight: '1.6',
    color: 'var(--text-secondary)',
    fontStyle: 'italic',
    flexGrow: 1,
  },
  reviewerInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    paddingTop: '15px',
  },
  reviewerAvatar: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 14, 60, 0.15)',
    border: '1px solid var(--primary-red)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontWeight: '700',
    fontSize: '1.1rem',
  },
  reviewerName: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#ffffff',
  },
  reviewerRole: {
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
  }
};

export default Home;
