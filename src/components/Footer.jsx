import { Coffee, Phone, MapPin, Clock, Award, ExternalLink } from 'lucide-react';

const InstagramIcon = ({ size = 20, color = "currentColor" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const Footer = ({ setActivePage }) => {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (pageId) => {
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.footerTop}>
        {/* Info Column */}
        <div style={styles.col}>
          <div style={styles.logoRow}>
            <img 
              src="/logo.png" 
              alt="Cloud 9 Café Logo" 
              style={styles.logoImg}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span style={styles.logoText}>Cloud <span style={styles.logoRed}>9</span> Café</span>
          </div>
          <p style={styles.description}>
            Experience coffee elevated to cloud nine. Blended with passion, served in a dark-red neon ambiance. Crafted with precision for true coffee connoisseurs.
          </p>
          <div style={styles.socials}>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noreferrer" 
              style={styles.socialIcon}
              title="Instagram"
            >
              <InstagramIcon size={18} />
            </a>
          </div>
        </div>

        {/* Links Column */}
        <div style={styles.col}>
          <h4 style={styles.colTitle}>Quick Links</h4>
          <ul style={styles.list}>
            <li><button onClick={() => handleLinkClick('home')} style={styles.linkBtn}>Home</button></li>
            <li><button onClick={() => handleLinkClick('menu')} style={styles.linkBtn}>Café Menu</button></li>
            <li><button onClick={() => handleLinkClick('experience')} style={styles.linkBtn}>3D Experience</button></li>
            <li><button onClick={() => handleLinkClick('order')} style={styles.linkBtn}>Order Direct</button></li>
            <li><button onClick={() => handleLinkClick('contact')} style={styles.linkBtn}>Contact Us</button></li>
          </ul>
        </div>

        {/* Delivery / Orders Column */}
        <div style={styles.col}>
          <h4 style={styles.colTitle}>Order Delivery</h4>
          <p style={styles.description}>
            Order online from your favorite platforms. We deliver fast and fresh!
          </p>
          <div style={styles.deliveryContainer}>
            {/* Zomato Link Mock */}
            <a 
              href="https://zomato.com" 
              target="_blank" 
              rel="noreferrer" 
              style={styles.deliveryCard}
            >
              <div style={styles.deliveryIconZomato}>Z</div>
              <div style={styles.deliveryDetails}>
                <span style={styles.deliveryTitle}>Zomato</span>
                <span style={styles.deliveryStatus}>Order Online <ExternalLink size={12} /></span>
              </div>
            </a>

            {/* Swiggy Link Mock */}
            <a 
              href="https://swiggy.com" 
              target="_blank" 
              rel="noreferrer" 
              style={styles.deliveryCard}
            >
              <div style={styles.deliveryIconSwiggy}>S</div>
              <div style={styles.deliveryDetails}>
                <span style={styles.deliveryTitle}>Swiggy</span>
                <span style={styles.deliveryStatus}>Order Online <ExternalLink size={12} /></span>
              </div>
            </a>
          </div>
        </div>

        {/* Contact Info Column */}
        <div style={styles.col}>
          <h4 style={styles.colTitle}>Contact Info</h4>
          <ul style={styles.contactList}>
            <li style={styles.contactItem}>
              <MapPin size={18} color="var(--primary-red)" style={{ flexShrink: 0 }} />
              <span>9, Cloud Avenue, Sector 62, Noida, UP - 201301</span>
            </li>
            <li style={styles.contactItem}>
              <Phone size={18} color="var(--primary-red)" style={{ flexShrink: 0 }} />
              <span>+91 98765 43210</span>
            </li>
            <li style={styles.contactItem}>
              <Clock size={18} color="var(--primary-red)" style={{ flexShrink: 0 }} />
              <div>
                <div>Mon - Fri: 8:00 AM - 11:00 PM</div>
                <div style={{ color: 'var(--primary-red)' }}>Sat - Sun: 8:00 AM - 12:00 AM</div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div style={styles.footerBottom}>
        <p style={styles.copyright}>
          &copy; {currentYear} Cloud 9 Café. All rights reserved. Made with ❤️ for Coffee Lovers.
        </p>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: 'var(--bg-secondary)',
    borderTop: '1px solid var(--border-color)',
    padding: '70px 5% 30px',
    color: 'var(--text-secondary)',
    position: 'relative',
    zIndex: 10,
  },
  footerTop: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 0.8fr 1fr 1fr',
    gap: '40px',
    maxWidth: '1400px',
    margin: '0 auto 50px',
    '@media (max-width: 1024px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    '@media (max-width: 576px)': {
      gridTemplateColumns: '1fr',
    }
  },
  col: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoImg: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: '1px solid rgba(255, 14, 60, 0.3)',
  },
  logoText: {
    fontFamily: 'var(--font-title)',
    fontSize: '1.5rem',
    fontWeight: '800',
    color: '#ffffff',
  },
  logoRed: {
    color: 'var(--primary-red)',
  },
  description: {
    fontSize: '0.9rem',
    lineHeight: '1.6',
    color: 'var(--text-muted)',
  },
  socials: {
    display: 'flex',
    gap: '12px',
    marginTop: '5px',
  },
  socialIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-primary)',
    transition: 'var(--transition-fast)',
    ':hover': {
      backgroundColor: 'var(--primary-red)',
      borderColor: 'var(--primary-red)',
      transform: 'translateY(-3px)',
      boxShadow: '0 5px 15px rgba(229, 9, 20, 0.4)',
    }
  },
  colTitle: {
    fontFamily: 'var(--font-title)',
    color: '#ffffff',
    fontSize: '1.1rem',
    fontWeight: '600',
    position: 'relative',
    paddingBottom: '8px',
    '::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '30px',
      height: '2px',
      backgroundColor: 'var(--primary-red)',
    }
  },
  list: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  linkBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    textAlign: 'left',
    cursor: 'pointer',
    padding: 0,
    transition: 'var(--transition-fast)',
    ':hover': {
      color: 'var(--accent-red)',
      transform: 'translateX(5px)',
    }
  },
  deliveryContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  deliveryCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 14px',
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid var(--border-color)',
    transition: 'var(--transition-smooth)',
    ':hover': {
      borderColor: 'var(--border-color-hover)',
      backgroundColor: 'rgba(255, 255, 255, 0.04)',
      transform: 'translateY(-2px)',
    }
  },
  deliveryIconZomato: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#cb202d',
    color: '#ffffff',
    fontSize: '1.1rem',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deliveryIconSwiggy: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#fc8019',
    color: '#ffffff',
    fontSize: '1.1rem',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deliveryDetails: {
    display: 'flex',
    flexDirection: 'column',
  },
  deliveryTitle: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#ffffff',
  },
  deliveryStatus: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  contactList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  contactItem: {
    display: 'flex',
    gap: '12px',
    fontSize: '0.9rem',
    lineHeight: '1.5',
    color: 'var(--text-muted)',
  },
  footerBottom: {
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    paddingTop: '25px',
    textAlign: 'center',
  },
  copyright: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
  }
};

// Add responsive layout styles inject
if (typeof document !== 'undefined') {
  const styleTag = document.createElement('style');
  styleTag.innerHTML = `
    footer button:hover {
      color: var(--accent-red) !important;
      transform: translateX(5px) !important;
    }
    footer a:hover {
      border-color: var(--primary-red) !important;
      background: rgba(255, 14, 60, 0.03) !important;
    }
    .footer-social-icon:hover {
      background: var(--primary-red) !important;
      border-color: var(--primary-red) !important;
      color: white !important;
      transform: translateY(-3px) !important;
      box-shadow: 0 5px 15px rgba(229, 9, 20, 0.4) !important;
    }
  `;
  document.head.appendChild(styleTag);
  styles.socialIcon['className'] = 'footer-social-icon';
}

export default Footer;
