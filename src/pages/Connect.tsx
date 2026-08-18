import { useState } from 'react';
import { MapPin, Phone, Mail, Send, CheckCircle, X, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { checkFormRateLimit, validateEmail, sanitizeText, logSecurityEvent } from '../utils/security';

const Connect = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [secError, setSecError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSecError('');

    const rateCheck = checkFormRateLimit(5);
    if (!rateCheck.allowed) {
      setSecError(`Security Alert: Request rate limit exceeded. Please wait ${rateCheck.retryAfterSec} seconds.`);
      return;
    }

    if (!formData.firstName || !formData.email || !formData.message) {
      setSecError('Please fill out all required contact fields.');
      return;
    }

    if (!validateEmail(formData.email)) {
      setSecError('Security Policy: Please enter a valid email address.');
      return;
    }

    // Sanitize inputs
    const sanitized = {
      firstName: sanitizeText(formData.firstName),
      lastName: sanitizeText(formData.lastName),
      email: sanitizeText(formData.email),
      message: sanitizeText(formData.message)
    };

    logSecurityEvent('FILE_ACCEPTED', 'INFO', `Contact inquiry received from ${sanitized.email}. Inputs sanitized.`);

    // Show success modal
    setShowModal(true);
  };
  return (
    <div style={{ background: 'var(--bg-color)', minHeight: '100vh', paddingTop: '150px', paddingBottom: '8rem', overflow: 'hidden', position: 'relative' }}>
      {/* Blueprint Grid Lines Overlay */}
      <div className="architectural-grid" />

      {/* Decorative vertical blueprint line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '12%',
        width: '1px',
        height: '100%',
        background: 'linear-gradient(to bottom, rgba(197, 168, 128, 0.08) 0%, rgba(197, 168, 128, 0.01) 100%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        
        {/* Page Title */}
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <span className="section-subtitle">GET IN TOUCH</span>
          <h1 style={{ 
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(2.8rem, 6vw, 4.2rem)',
            fontWeight: 500,
            lineHeight: 1.1,
            color: 'var(--navy)',
            margin: '0.5rem 0'
          }}>
            Connect <span style={{ fontStyle: 'italic', color: 'var(--primary)' }}>With Us</span>
          </h1>
          <div style={{ width: '80px', height: '2px', background: 'var(--primary)', margin: '1.5rem auto 0' }} />
          <p style={{ color: 'var(--text-secondary)', maxWidth: '650px', margin: '2rem auto 0', fontSize: '1.05rem', lineHeight: 1.75 }}>
            We would love to hear from you. Whether you have a question about services, pricing, or anything else, our team is ready to answer all your questions.
          </p>
        </div>

        {/* Central Contact Module */}
        <div className="connect-main-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: '1.1fr 1.5fr', 
          background: 'var(--surface-color)',
          borderRadius: '2px',
          border: '1px solid var(--border-color)',
          boxShadow: '0 25px 55px rgba(11,17,32,0.04)',
          overflow: 'hidden'
        }}>
          
          {/* Contact Information (Left Side - Obsidian Navy) */}
          <div style={{ 
            background: 'var(--navy)', 
            color: '#ffffff', 
            padding: 'var(--card-padding-lg)',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            borderRight: '1px solid var(--border-color)',
            overflow: 'hidden'
          }}>
            {/* Fine dashed coordinate lines backing */}
            <div style={{ position: 'absolute', top: '15px', left: '15px', right: '15px', bottom: '15px', border: '1px dashed rgba(197,168,128,0.15)', pointerEvents: 'none' }} />

            <h3 style={{ 
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '2rem', 
              fontWeight: 500, 
              color: 'var(--primary)',
              marginBottom: '3rem', 
              position: 'relative', 
              zIndex: 1 
            }}>Contact Information</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', position: 'relative', zIndex: 1 }}>
              
              <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-start' }}>
                <MapPin size={20} color="var(--primary)" style={{ marginTop: '4px', flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: '#fff', marginBottom: '0.5rem' }}>Head & Regd. Office</h4>
                  <p style={{ lineHeight: 1.7, opacity: 0.8, fontSize: '0.95rem', margin: 0 }}>
                    No. 95, 4th Cross, Vishveshvaraiah layout,<br />
                    Dr. S K Road, Abbigere Main Road,<br />
                    Kammagoondanahalli, Jalahalli, Bengaluru,<br />
                    Karnataka 560015, India
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
                <Phone size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: '#fff', marginBottom: '0.3rem' }}>Contact No.</h4>
                  <p style={{ opacity: 0.8, fontSize: '0.95rem', margin: 0 }}>+91 97691 14460</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
                <Mail size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: '#fff', marginBottom: '0.3rem' }}>Email Enquiries</h4>
                  <a 
                    href="mailto:ceo@brickforcecs.com" 
                    style={{ color: 'var(--primary)', opacity: 0.9, textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--primary)'}
                  >
                    ceo@brickforcecs.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form (Right Side - Warm Cream) */}
          <div style={{ padding: 'var(--card-padding-lg)' }} className="connect-form-col">
            <h3 style={{ 
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '2rem', 
              fontWeight: 600, 
              color: 'var(--navy)',
              marginBottom: '2.5rem' 
            }}>Send us a Message</h3>

            {secError && (
              <div style={{
                background: '#FEF2F2',
                border: '1px solid #FCA5A5',
                borderRadius: '4px',
                padding: '0.8rem 1rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                color: '#991B1B',
                fontSize: '0.85rem'
              }}>
                <ShieldAlert size={18} color="#DC2626" style={{ flexShrink: 0 }} />
                <div>{secError}</div>
              </div>
            )}
            
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }} onSubmit={handleSubmit}>
              <div style={{ display: 'flex', gap: '1.5rem' }} className="form-name-row">
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--navy)' }}>First Name</label>
                  <input 
                    type="text" 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    placeholder="John" 
                    style={{ 
                      width: '100%', 
                      padding: '0.9rem 1.2rem', 
                      borderRadius: '2px', 
                      border: '1px solid var(--border-color)', 
                      outline: 'none', 
                      background: 'var(--bg-color)',
                      color: 'var(--text-primary)',
                      fontSize: '0.92rem',
                      transition: 'border-color 0.3s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--navy)' }}>Last Name</label>
                  <input 
                    type="text" 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe" 
                    style={{ 
                      width: '100%', 
                      padding: '0.9rem 1.2rem', 
                      borderRadius: '2px', 
                      border: '1px solid var(--border-color)', 
                      outline: 'none', 
                      background: 'var(--bg-color)',
                      color: 'var(--text-primary)',
                      fontSize: '0.92rem',
                      transition: 'border-color 0.3s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--navy)' }}>Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@company.com" 
                  style={{ 
                    width: '100%', 
                    padding: '0.9rem 1.2rem', 
                    borderRadius: '2px', 
                    border: '1px solid var(--border-color)', 
                    outline: 'none', 
                    background: 'var(--bg-color)',
                    color: 'var(--text-primary)',
                    fontSize: '0.92rem',
                    transition: 'border-color 0.3s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--navy)' }}>Message</label>
                <textarea 
                  rows={4} 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="How can we help you?" 
                  style={{ 
                    width: '100%', 
                    padding: '0.9rem 1.2rem', 
                    borderRadius: '2px', 
                    border: '1px solid var(--border-color)', 
                    outline: 'none', 
                    background: 'var(--bg-color)',
                    color: 'var(--text-primary)',
                    fontSize: '0.92rem',
                    resize: 'vertical',
                    transition: 'border-color 0.3s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                ></textarea>
              </div>

              <button 
                type="submit"
                className="btn btn-primary" 
                style={{ 
                  alignSelf: 'flex-start', 
                  padding: '1.1rem 2.8rem', 
                  fontSize: '0.85rem', 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: '0.8rem' 
                }}
              >
                Send Message <Send size={14} />
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Modal Notification Overlay */}
      <AnimatePresence>
        {showModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(11, 17, 32, 0.65)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              style={{
                background: 'var(--surface-color)',
                border: '1px solid var(--primary)',
                borderRadius: '2px',
                padding: '3.5rem 2.5rem',
                maxWidth: '500px',
                width: '100%',
                position: 'relative',
                boxShadow: '0 30px 60px rgba(11, 17, 32, 0.3)',
                textAlign: 'center'
              }}
            >
              {/* Corner fine line accent */}
              <div style={{ position: 'absolute', top: 0, left: 0, width: '15px', height: '15px', borderTop: '2px solid var(--primary)', borderLeft: '2px solid var(--primary)' }} />
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: '15px', height: '15px', borderBottom: '2px solid var(--primary)', borderRight: '2px solid var(--primary)' }} />
              
              <button 
                onClick={() => setShowModal(false)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '5px'
                }}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

              <div style={{
                display: 'inline-flex',
                background: 'rgba(197, 168, 128, 0.1)',
                color: 'var(--primary)',
                padding: '1.2rem',
                borderRadius: '50%',
                marginBottom: '1.8rem',
                border: '1px solid var(--border-color)'
              }}>
                <CheckCircle size={44} />
              </div>

              <h3 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '2.4rem',
                color: 'var(--navy)',
                marginBottom: '1rem',
                fontWeight: 500,
                lineHeight: 1.2
              }}>Message Sent!</h3>

              <p style={{
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                fontSize: '1rem',
                marginBottom: '2.5rem'
              }}>
                Thank you for connecting with BRICK FORCE. We have received your inquiry and our team will get back to you within 24 hours.
              </p>

              <button
                onClick={() => setShowModal(false)}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '1.1rem',
                  fontSize: '0.85rem',
                  letterSpacing: '1px'
                }}
              >
                Return to Website
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 991px) {
          .connect-main-grid {
            grid-template-columns: 1fr !important;
          }
          .connect-form-col {
            padding: 3.5rem 2rem !important;
          }
        }
        @media (max-width: 576px) {
          .form-name-row {
            flex-direction: column !important;
            gap: 1.8rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Connect;
