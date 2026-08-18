import { motion } from 'framer-motion';
import { Award, Users, Globe } from 'lucide-react';

const ClientsRecognition = () => {
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
          <span className="section-subtitle">OUR NETWORK</span>
          <h1 style={{ 
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(2.8rem, 6vw, 4.2rem)',
            fontWeight: 500,
            lineHeight: 1.1,
            color: 'var(--navy)',
            margin: '0.5rem 0'
          }}>
            Clients & <span style={{ fontStyle: 'italic', color: 'var(--primary)' }}>Recognition</span>
          </h1>
          <div style={{ width: '80px', height: '2px', background: 'var(--primary)', margin: '1.5rem auto 0' }} />
        </div>

        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '6rem' }}>
          
          {/* Section 1: Our Clients */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
              <div style={{ background: 'rgba(197,168,128,0.08)', padding: '0.5rem', borderRadius: '2px', border: '1px solid var(--border-color)' }}>
                <Users size={24} color="var(--primary)" />
              </div>
              <h2 style={{ 
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '2.2rem', 
                fontWeight: 600, 
                color: 'var(--navy)',
                margin: 0
              }}>Our Clients</h2>
            </div>
            
            <div style={{ 
              background: 'var(--surface-color)', 
              padding: 'var(--card-padding-lg)', 
              borderRadius: '2px', 
              border: '1px solid var(--border-color)',
              position: 'relative'
            }}>
              {/* Gold top corner line */}
              <div style={{ position: 'absolute', top: 0, left: 0, width: '15px', height: '15px', borderTop: '2px solid var(--primary)', borderLeft: '2px solid var(--primary)' }} />
              
              <p style={{ color: 'var(--text-primary)', lineHeight: 1.85, fontSize: '1.05rem', marginBottom: '2.5rem', textAlign: 'justify' }}>
                BRICK FORCE has engaged with industry leaders in diverse areas. We leverage our functional expertise to enhance and strengthen our services & offerings. Our leadership experience and exceptional team have been working across various verticals & sectors.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))', gap: '1.5rem' }}>
                {[
                  "Manufacturing",
                  "Information Technology",
                  "Govt. Bodies & PSUs",
                  "Educational Institutions",
                  "Consulting Firms",
                  "Society at Large"
                ].map((sector, i) => (
                  <div 
                    key={i} 
                    style={{ 
                      background: 'var(--bg-color)', 
                      padding: '1.8rem 1rem', 
                      borderRadius: '2px', 
                      textAlign: 'center', 
                      fontWeight: 800, 
                      fontSize: '0.8rem',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      color: 'var(--navy)', 
                      border: '1px solid var(--border-color)',
                      transition: 'all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--primary)';
                      e.currentTarget.style.background = 'var(--surface-color)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                      e.currentTarget.style.background = 'var(--bg-color)';
                    }}
                  >
                    {sector}
                  </div>
                ))}
              </div>
              <p style={{ marginTop: '2.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic', margin: '2rem 0 0 0' }}>
                Note: All logos and brands are property of their respective owners and are used for identification purposes only.
              </p>
            </div>
          </section>
 
          {/* Section 2: Recognition */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
              <div style={{ background: 'rgba(197,168,128,0.08)', padding: '0.5rem', borderRadius: '2px', border: '1px solid var(--border-color)' }}>
                <Award size={24} color="var(--primary)" />
              </div>
              <h2 style={{ 
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '2.2rem', 
                fontWeight: 600, 
                color: 'var(--navy)',
                margin: 0
              }}>Recognition</h2>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              style={{ 
                background: 'var(--navy)', 
                padding: 'var(--card-padding-lg)', 
                borderRadius: '2px', 
                color: '#fff', 
                textAlign: 'center', 
                position: 'relative', 
                overflow: 'hidden',
                border: '1px solid var(--primary)'
              }}
            >
              <div style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', bottom: '10px', border: '1px dashed rgba(197,168,128,0.2)', pointerEvents: 'none' }} />
              
              <div style={{ position: 'absolute', top: '-40px', right: '-40px', opacity: 0.05, color: 'var(--primary)' }}>
                <Award size={250} />
              </div>
              
              <h3 style={{ 
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '2.4rem', 
                fontWeight: 500, 
                marginBottom: '1.5rem',
                color: 'var(--primary)'
              }}>APEA INDIA 2017 Nomination</h3>
              
              <p style={{ fontSize: '1.05rem', opacity: 0.85, lineHeight: 1.85, maxWidth: '800px', margin: '0 auto', textAlign: 'justify' }}>
                BRICK FORCE Consulting Services Pvt. Ltd. was nominated for the most prestigious recognition honoring business leaders in India. This award honors iconic leaders under the Professional & Business Services industry. The nomination recognizes our leadership quality, performance, and excellence in providing quality, best practices, and innovation.
              </p>
            </motion.div>
          </section>
 
          {/* Section 3: Associates & Collaboration */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
              <div style={{ background: 'rgba(197,168,128,0.08)', padding: '0.5rem', borderRadius: '2px', border: '1px solid var(--border-color)' }}>
                <Globe size={24} color="var(--primary)" />
              </div>
              <h2 style={{ 
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '2.2rem', 
                fontWeight: 600, 
                color: 'var(--navy)',
                margin: 0
              }}>Associates & Collaboration</h2>
            </div>
            
            <div style={{ 
              background: 'var(--surface-color)', 
              padding: 'var(--card-padding-lg)', 
              borderRadius: '2px', 
              border: '1px solid var(--border-color)', 
              textAlign: 'center',
              position: 'relative'
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '15px', height: '15px', borderTop: '2px solid var(--primary)', borderLeft: '2px solid var(--primary)' }} />
              
              <h3 style={{ 
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.8rem', 
                fontWeight: 600, 
                marginBottom: '1rem', 
                color: 'var(--navy)' 
              }}>Connect, Contribute & Collaborate</h3>
              
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.05rem', maxWidth: '650px', margin: '0 auto' }}>
                We are always open to collaborating with partners who share our vision of excellence and community development.
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default ClientsRecognition;
