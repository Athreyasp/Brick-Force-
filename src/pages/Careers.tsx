import { ArrowRight, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Careers = () => {
  return (
    <div style={{ background: 'var(--bg-color)', minHeight: '100vh', paddingTop: '150px', paddingBottom: '8rem', overflow: 'hidden', position: 'relative' }}>
      {/* Blueprint Grid Lines Overlay */}
      <div className="architectural-grid" />

      {/* Decorative vertical blueprint line */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: '15%',
        width: '1px',
        height: '100%',
        background: 'linear-gradient(to bottom, rgba(197, 168, 128, 0.08) 0%, rgba(197, 168, 128, 0.01) 100%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        
        {/* Page Title */}
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <span className="section-subtitle">MY CAREER</span>
          <h1 style={{ 
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(2.8rem, 6vw, 4.2rem)',
            fontWeight: 500,
            lineHeight: 1.1,
            color: 'var(--navy)',
            margin: '0.5rem 0'
          }}>
            Join Our <span style={{ fontStyle: 'italic', color: 'var(--primary)' }}>Team</span>
          </h1>
          <div style={{ width: '80px', height: '2px', background: 'var(--primary)', margin: '1.5rem auto 0' }} />
        </div>

        <div style={{ 
          maxWidth: '800px', 
          margin: '0 auto', 
          background: 'var(--surface-color)',
          borderRadius: '2px',
          border: '1px solid var(--border-color)',
          padding: 'var(--card-padding-lg)',
          textAlign: 'center',
          position: 'relative',
          boxShadow: '0 20px 45px rgba(11,17,32,0.03)'
        }}>
          {/* Corner Line */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '15px', height: '15px', borderTop: '2px solid var(--primary)', borderLeft: '2px solid var(--primary)' }} />
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: '15px', height: '15px', borderBottom: '2px solid var(--primary)', borderRight: '2px solid var(--primary)' }} />
          
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
            <div style={{ background: 'rgba(197,168,128,0.08)', padding: '1.5rem', borderRadius: '2px', border: '1px solid var(--border-color)', color: 'var(--primary)' }}>
              <Users size={36} />
            </div>
          </div>

          <h2 style={{ 
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '2.2rem', 
            fontWeight: 600, 
            marginBottom: '1.5rem', 
            color: 'var(--navy)' 
          }}>
            We're Always Looking for Talent
          </h2>
          
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: 1.8 }}>
            All Open Positions are advertised on our Social Media platforms (Facebook, LinkedIn, Twitter). If you are looking for your next big opportunity, check out our current openings.
          </p>

          <Link 
            to="/open-positions" 
            className="btn btn-primary"
            style={{ 
              display: 'inline-flex', 
              padding: '1.1rem 2.8rem', 
              fontSize: '0.85rem',
              alignItems: 'center',
              gap: '0.8rem',
              boxShadow: '0 10px 25px rgba(11,17,32,0.1)'
            }}
          >
            View Current Openings <ArrowRight size={16} />
          </Link>

          <div style={{ marginTop: '3.5rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Or directly email your resume to: <br/>
              <a href="mailto:makemycareer@brickforcecs.com" style={{ 
                color: 'var(--primary)', 
                fontWeight: 800, 
                fontSize: '1.1rem', 
                display: 'inline-block', 
                marginTop: '0.5rem',
                letterSpacing: '0.5px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--navy)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--primary)'}
              >
                makemycareer@brickforcecs.com
              </a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Careers;
