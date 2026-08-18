import { Link } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      background: 'var(--navy)',
      color: 'rgba(255, 255, 255, 0.7)',
      padding: '5rem 0 2rem 0',
      borderTop: '1px solid rgba(197, 168, 128, 0.2)',
      position: 'relative'
    }}>
      {/* Decorative dashed coordinate line */}
      <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px', background: 'rgba(197, 168, 128, 0.08)' }} />

      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '3rem',
          marginBottom: '4rem'
        }}>
          {/* Company Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <img
                src="/logo.avif"
                alt="Brick Force Logo"
                style={{ width: '28px', height: '28px', objectFit: 'contain' }}
              />
              <span style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '1px', color: '#ffffff' }}>
                BRICK <span style={{ color: 'var(--primary)', fontStyle: 'italic', fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}>FORCE</span>
              </span>
            </div>
            <p style={{ color: 'rgba(255, 255, 255, 0.5)', lineHeight: 1.7, fontSize: '0.88rem', margin: 0, maxWidth: '280px' }}>
              Empowering clients with user-friendly solutions that enhance productivity and sustainable growth.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.2rem',
              marginBottom: '1.5rem',
              fontWeight: 500,
              color: 'var(--primary)',
              letterSpacing: '0.5px'
            }}>Company</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: 0, margin: 0 }}>
              <li>
                <Link to="/about-us" style={{ color: 'rgba(255, 255, 255, 0.6)', textDecoration: 'none', fontSize: '0.88rem', transition: 'color 0.3s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                >Profile</Link>
              </li>
              <li>
                <Link to="/about-us/core-values" style={{ color: 'rgba(255, 255, 255, 0.6)', textDecoration: 'none', fontSize: '0.88rem', transition: 'color 0.3s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                >Vision & Philosophy</Link>
              </li>
              <li>
                <Link to="/about-us/board-of-directors" style={{ color: 'rgba(255, 255, 255, 0.6)', textDecoration: 'none', fontSize: '0.88rem', transition: 'color 0.3s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                >Board of Directors</Link>
              </li>
            </ul>
          </div>

          {/* Solutions Links */}
          <div>
            <h4 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.2rem',
              marginBottom: '1.5rem',
              fontWeight: 500,
              color: 'var(--primary)',
              letterSpacing: '0.5px'
            }}>Solutions</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: 0, margin: 0 }}>
              <li>
                <Link to="/solutions-services/human-resource" style={{ color: 'rgba(255, 255, 255, 0.6)', textDecoration: 'none', fontSize: '0.88rem', transition: 'color 0.3s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                >HR Solutions</Link>
              </li>
              <li>
                <Link to="/my-career" style={{ color: 'rgba(255, 255, 255, 0.6)', textDecoration: 'none', fontSize: '0.88rem', transition: 'color 0.3s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                >Careers</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.2rem',
              marginBottom: '1.5rem',
              fontWeight: 500,
              color: 'var(--primary)',
              letterSpacing: '0.5px'
            }}>Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                <div style={{ background: 'rgba(197, 168, 128, 0.08)', padding: '0.4rem', borderRadius: '2px', border: '1px solid rgba(197,168,128,0.2)', display: 'flex' }}>
                  <Phone size={14} color="var(--primary)" />
                </div>
                <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.88rem' }}>+91 97691 14460</span>
              </div>
              <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                <div style={{ background: 'rgba(197, 168, 128, 0.08)', padding: '0.4rem', borderRadius: '2px', border: '1px solid rgba(197,168,128,0.2)', display: 'flex' }}>
                  <Mail size={14} color="var(--primary)" />
                </div>
                <a href="mailto:ceo@brickforcecs.com" style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.88rem', textDecoration: 'none', transition: 'color 0.3s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                >ceo@brickforcecs.com</a>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          paddingTop: '2rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          color: 'rgba(255, 255, 255, 0.4)',
          fontSize: '0.78rem'
        }}>
          <p style={{ margin: 0 }}>© {new Date().getFullYear()} BRICK FORCE Consulting Services Pvt Ltd. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>CIN: U74999KA2016PTC094363</span>
            <span>GST: 29AAGCB7916H1ZE</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
