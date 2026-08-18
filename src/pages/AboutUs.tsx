import { motion } from 'framer-motion';

const AboutUs = () => {
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
        background: 'linear-gradient(to bottom, rgba(197, 168, 128, 0.08) 0%, rgba(197, 168, 128, 0.02) 100%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        
        {/* Editorial Title */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: 'left', marginBottom: '5rem', maxWidth: '800px' }}
        >
          <span className="section-subtitle">COMPANY PROFILE</span>
          <h1 style={{ 
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(3rem, 6vw, 4.5rem)',
            fontWeight: 500,
            lineHeight: 1.05,
            color: 'var(--navy)',
            margin: '0.5rem 0 0 0'
          }}>
            We Inspire You in <span style={{ fontStyle: 'italic', color: 'var(--primary)' }}>Many Ways</span>
          </h1>
          <div style={{ width: '80px', height: '2px', background: 'var(--primary)', marginTop: '1.5rem' }} />
        </motion.div>

        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          
          {/* Main Content Grid */}
          <div className="about-main-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(400px, 100%), 1fr))', 
            gap: '5rem', 
            alignItems: 'center',
            marginBottom: '6rem'
          }}>
            {/* Studio Frame Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              style={{ position: 'relative' }}
            >
              <div 
                className="studio-frame-backing"
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '-12px',
                  right: '12px',
                  bottom: '-12px',
                  border: '1px solid var(--primary)',
                  borderRadius: '2px',
                  background: 'var(--navy)',
                  zIndex: -1
                }} 
              />
              
              <img 
                src="/images/about_team.png" 
                alt="Leadership Team" 
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '2px',
                  boxShadow: '0 20px 45px rgba(11,17,32,0.06)',
                  border: '1px solid var(--border-color)',
                  display: 'block'
                }}
              />
            </motion.div>
 
            {/* Editorial Bio Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 style={{ 
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic',
                fontSize: '2.2rem', 
                fontWeight: 500, 
                lineHeight: 1.3,
                marginBottom: '2rem', 
                color: 'var(--primary-hover)',
                borderLeft: '2px solid var(--primary)',
                paddingLeft: '1.5rem',
                letterSpacing: '-0.5px'
              }}>
                "Young, vibrant, futuristic and innovative."
              </h2>
              <p className="drop-cap" style={{ color: 'var(--text-primary)', lineHeight: 1.85, fontSize: '1.05rem', marginBottom: '1.5rem', textAlign: 'justify' }}>
                Our goal is to bring the right people to deliver unconditional services together at the right time for a solid client relationship. Driven by a passion to reinvent, improve and outperform the consulting, services & solution industry.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, fontSize: '1.05rem', textAlign: 'justify' }}>
                Our corporate ideology to the client is to be with them in all times and ensuring them to succeed in their vision, which will in-turn reflect our success and long term sustainability.
              </p>
            </motion.div>
          </div>
 
          {/* Core Focus Columns */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ 
              background: 'var(--surface-color)',
              padding: 'var(--card-padding-lg)',
              borderRadius: '2px',
              border: '1px solid var(--border-color)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
              gap: '4rem',
              position: 'relative'
            }}
          >
            {/* Decorative Corner Lines */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '15px', height: '15px', borderTop: '2px solid var(--primary)', borderLeft: '2px solid var(--primary)' }} />
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: '15px', height: '15px', borderBottom: '2px solid var(--primary)', borderRight: '2px solid var(--primary)' }} />
 
            <div>
              <h3 style={{ 
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.8rem', 
                fontWeight: 600, 
                marginBottom: '1.2rem', 
                color: 'var(--navy)',
                letterSpacing: '0.5px'
              }}>Expertise</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.98rem' }}>
                BRICK FORCE provides Search & Selection, Out Sourcing, Audits, Training, Leadership Development, Consulting, Placements, Advisory for Start-ups and other Services & Solutions to the entire gamut of HR & IT.
              </p>
            </div>
 
            <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '4rem' }} className="second-expertise-col">
              <h3 style={{ 
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.8rem', 
                fontWeight: 600, 
                marginBottom: '1.2rem', 
                color: 'var(--navy)',
                letterSpacing: '0.5px'
              }}>Beyond Expectations</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.98rem' }}>
                A solid team in place with over seventy years of expertise in various functional domains & technologies. We ensure our clients succeed in their vision through our commitment to excellence.
              </p>
            </div>
          </motion.div>
 
        </div>
      </div>
 
      <style>{`
        @media (max-width: 991px) {
          .about-main-grid {
            grid-template-columns: 1fr !important;
            gap: 4rem !important;
          }
          .second-expertise-col {
            border-left: none !important;
            padding-left: 0 !important;
            border-top: 1px solid var(--border-color);
            padding-top: 2rem;
          }
        }
        @media (max-width: 768px) {
          .studio-frame-backing {
            left: 0px !important;
            right: 0px !important;
            top: 8px !important;
            bottom: -8px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AboutUs;
