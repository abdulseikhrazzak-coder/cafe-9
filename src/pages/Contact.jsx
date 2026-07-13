import React, { useState } from 'react';
import { Send, MapPin, Phone, Mail, Clock, Star, Award, Coffee } from 'lucide-react';

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

const Contact = () => {
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Mock Instagram Feed images (Representing premium dark/red café visual vibes)
  const instagramFeed = [
    { id: 1, likes: 342, tag: '#Brews' },
    { id: 2, likes: 218, tag: '#Vibe' },
    { id: 3, likes: 512, tag: '#Decadence' },
    { id: 4, likes: 189, tag: '#Atmosphere' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormState({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1200);
  };

  return (
    <div style={styles.container} className="animate-fade-in-up">
      <div className="gradient-overlay" />

      <section style={styles.section}>
        <div className="section-header">
          <span className="section-subtitle">Get In Touch</span>
          <h1 className="section-title">Contact <span>Us</span></h1>
        </div>

        <div style={styles.contactGrid}>
          {/* Left Column: Form */}
          <div style={styles.formContainer}>
            <h2 style={styles.colHeader}>Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="glass-panel" style={styles.contactForm}>
              
              <div style={styles.row2}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Name</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formState.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Email</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    value={formState.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Subject</label>
                <input 
                  type="text" 
                  name="subject"
                  required
                  value={formState.subject}
                  onChange={handleInputChange}
                  placeholder="How can we help you?"
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Message</label>
                <textarea 
                  name="message"
                  required
                  rows={5}
                  value={formState.message}
                  onChange={handleInputChange}
                  placeholder="Type your message here..."
                  style={styles.textarea}
                />
              </div>

              {submitSuccess && (
                <div style={styles.successMessage} className="animate-fade-in-up">
                  🎉 Thank you! Your message has been sent successfully. We will get back to you shortly.
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
                style={styles.submitBtn}
              >
                {isSubmitting ? 'Sending...' : (
                  <>
                    <Send size={18} /> Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Info & Instagram */}
          <div style={styles.infoContainer}>
            <h2 style={styles.colHeader}>Connect Directly</h2>
            
            {/* Quick Contact Cards */}
            <div className="glass-panel" style={styles.infoDetailsCard}>
              <div style={styles.contactItem}>
                <div style={styles.iconCircle}>
                  <MapPin size={20} color="var(--primary-red)" />
                </div>
                <div>
                  <h4 style={styles.infoItemTitle}>Find Us</h4>
                  <p style={styles.infoItemText}>9, Cloud Avenue, Sector 62, Noida, UP - 201301</p>
                </div>
              </div>

              <div style={styles.contactItem}>
                <div style={styles.iconCircle}>
                  <Phone size={20} color="var(--primary-red)" />
                </div>
                <div>
                  <h4 style={styles.infoItemTitle}>Call Us</h4>
                  <p style={styles.infoItemText}>+91 98765 43210</p>
                </div>
              </div>

              <div style={styles.contactItem}>
                <div style={styles.iconCircle}>
                  <Mail size={20} color="var(--primary-red)" />
                </div>
                <div>
                  <h4 style={styles.infoItemTitle}>Email Us</h4>
                  <p style={styles.infoItemText}>hello@cloud9cafe.in</p>
                </div>
              </div>
            </div>

            {/* Mock Google Map matching styling */}
            <div className="glass-panel" style={styles.mapPlaceholder}>
              <div style={styles.mapGridLines} />
              <div style={styles.mapPinPulse} />
              <div style={styles.mapLabelCard}>
                <h4 style={{ fontSize: '0.85rem', color: '#ffffff' }}>Cloud 9 Café Location</h4>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Tap to navigate</span>
              </div>
            </div>

            {/* Social Grid section */}
            <div style={styles.socialSection}>
              <h3 style={styles.socialHeader}>
                <InstagramIcon size={18} color="var(--primary-red)" /> @cloud9_cafe
              </h3>
              <div style={styles.instaGrid}>
                {instagramFeed.map((post) => (
                  <div key={post.id} style={styles.instaCard}>
                    {/* Simulated post overlay with red ambient filter */}
                    <div style={styles.instaOverlay}>
                      <span style={styles.instaTag}>{post.tag}</span>
                      <span style={styles.instaLikes}>❤️ {post.likes}</span>
                    </div>
                    {/* Visual pattern generator for coffee cups/beans */}
                    <div style={{
                      ...styles.instaImgFallback,
                      background: `linear-gradient(135deg, rgba(229, 9, 20, 0.25) 0%, rgba(10, 10, 12, 0.9) 100%)`
                    }}>
                      <Coffee size={32} color="rgba(255, 14, 60, 0.4)" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
  section: {
    paddingBottom: '85px',
  },
  contactGrid: {
    display: 'grid',
    gridTemplateColumns: '1.1fr 0.9fr',
    gap: '40px',
    marginTop: '30px',
    alignItems: 'start',
    '@media (max-width: 992px)': {
      gridTemplateColumns: '1fr',
    }
  },
  colHeader: {
    fontFamily: 'var(--font-title)',
    fontSize: '1.4rem',
    color: '#ffffff',
    marginBottom: '20px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    paddingBottom: '10px',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  contactForm: {
    padding: '30px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    background: 'rgba(15, 15, 17, 0.65)',
  },
  row2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    '@media (max-width: 576px)': {
      gridTemplateColumns: '1fr',
    }
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
  successMessage: {
    padding: '14px',
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    border: '1px solid rgba(34, 197, 94, 0.3)',
    borderRadius: '8px',
    color: '#22c55e',
    fontSize: '0.9rem',
    fontWeight: '600',
  },
  submitBtn: {
    padding: '14px',
    fontSize: '1rem',
    marginTop: '5px',
  },
  infoContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  infoDetailsCard: {
    padding: '24px',
    background: 'rgba(15, 15, 17, 0.5)',
    display: 'flex',
    flexDirection: 'column',
    gap: '22px',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  iconCircle: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 14, 60, 0.06)',
    border: '1px solid rgba(255, 14, 60, 0.12)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  infoItemTitle: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '4px',
  },
  infoItemText: {
    fontSize: '0.88rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
  },
  mapPlaceholder: {
    height: '180px',
    position: 'relative',
    background: '#0d0d0e',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: '1px solid rgba(255, 14, 60, 0.1)',
  },
  mapGridLines: {
    position: 'absolute',
    width: '200%',
    height: '200%',
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
    `,
    backgroundSize: '20px 20px',
    transform: 'rotate(15deg)',
  },
  mapPinPulse: {
    width: '14px',
    height: '14px',
    backgroundColor: 'var(--primary-red)',
    borderRadius: '50%',
    boxShadow: '0 0 15px var(--primary-red)',
    position: 'relative',
    '::after': {
      content: '""',
      position: 'absolute',
      width: '30px',
      height: '30px',
      border: '2px solid var(--primary-red)',
      borderRadius: '50%',
      top: '-8px',
      left: '-8px',
      animation: 'pulse-glow 2s infinite ease-out',
    }
  },
  mapLabelCard: {
    position: 'absolute',
    bottom: '12px',
    left: '12px',
    background: 'rgba(5, 5, 5, 0.85)',
    border: '1px solid rgba(255, 14, 60, 0.2)',
    padding: '8px 14px',
    borderRadius: '8px',
    backdropFilter: 'blur(4px)',
  },
  socialSection: {
    marginTop: '10px',
  },
  socialHeader: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '15px',
  },
  instaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
    '@media (max-width: 576px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    }
  },
  instaCard: {
    aspectRatio: '1',
    borderRadius: '10px',
    overflow: 'hidden',
    position: 'relative',
    cursor: 'pointer',
  },
  instaOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    opacity: 0,
    zIndex: 3,
    transition: 'var(--transition-fast)',
    ':hover': {
      opacity: 1,
    }
  },
  instaTag: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: 'var(--accent-red)',
  },
  instaLikes: {
    fontSize: '0.8rem',
    color: '#ffffff',
    fontWeight: '600',
  },
  instaImgFallback: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    border: '1px solid rgba(255,255,255,0.03)',
  }
};

// Inject custom classes
if (typeof document !== 'undefined') {
  const styleTag = document.createElement('style');
  styleTag.innerHTML = `
    .insta-card:hover > div {
      opacity: 1 !important;
    }
    .contact-inp:focus, .contact-txt:focus {
      border-color: var(--primary-red) !important;
      background: rgba(255, 255, 255, 0.04) !important;
      box-shadow: 0 0 10px rgba(229, 9, 20, 0.1) !important;
    }
  `;
  document.head.appendChild(styleTag);
  styles.input['className'] = 'contact-inp';
  styles.textarea['className'] = 'contact-txt';
}

export default Contact;
