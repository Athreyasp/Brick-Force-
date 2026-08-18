import { motion } from 'framer-motion';
import { Target, Shield, Heart, Users, Award } from 'lucide-react';

const CoreValues = () => {
  const values = [
    {
      title: "Excellence",
      icon: <Award size={28} color="var(--primary)" />,
      desc: "We strive to deliver the best services and improve the way client services are delivered globally."
    },
    {
      title: "Integrity",
      icon: <Shield size={28} color="var(--primary)" />,
      desc: "We are committed to personal and professional integrity, ethics, honesty, and fair dealing."
    },
    {
      title: "Community Development",
      icon: <Heart size={28} color="var(--primary)" />,
      desc: "We value the success of our clients and the positive impact on our community."
    },
    {
      title: "Accountability",
      icon: <Target size={28} color="var(--primary)" />,
      desc: "We take responsibility for our actions and ensure long-term value for our clients."
    },
    {
      title: "Respect",
      icon: <Users size={28} color="var(--primary)" />,
      desc: "We foster an ethical culture that respects diverse perspectives and backgrounds."
    }
  ];

  return (
    <div style={{ background: 'var(--bg-color)', minHeight: '100vh', paddingTop: '150px', paddingBottom: '8rem', overflow: 'hidden', position: 'relative' }}>
      {/* Blueprint Grid Lines Overlay */}
      <div className="architectural-grid" />

      {/* Decorative vertical blueprint line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '8%',
        width: '1px',
        height: '100%',
        background: 'linear-gradient(to bottom, rgba(197, 168, 128, 0.08) 0%, rgba(197, 168, 128, 0.01) 100%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        
        {/* Page Title */}
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <span className="section-subtitle">OUR PHILOSOPHY</span>
          <h1 style={{ 
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(2.8rem, 6vw, 4.2rem)',
            fontWeight: 500,
            lineHeight: 1.1,
            color: 'var(--navy)',
            margin: '0.5rem 0'
          }}>
            Vision, Mission & <span style={{ fontStyle: 'italic', color: 'var(--primary)' }}>Core Values</span>
          </h1>
          <div style={{ width: '80px', height: '2px', background: 'var(--primary)', margin: '1.5rem auto 0' }} />
        </div>

        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '5rem' }}>
          
          {/* Vision and Mission Grid */}
          <div className="vision-mission-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(400px, 100%), 1fr))', gap: '3rem' }}>
            
            {/* Vision */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              style={{ 
                background: 'var(--surface-color)', 
                padding: 'var(--card-padding-lg)', 
                borderRadius: '2px', 
                border: '1px solid var(--border-color)',
                position: 'relative'
              }}
            >
              {/* Gold top corner line */}
              <div style={{ position: 'absolute', top: 0, left: 0, width: '15px', height: '15px', borderTop: '2px solid var(--primary)', borderLeft: '2px solid var(--primary)' }} />
              
              <h2 style={{ 
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '2rem', 
                fontWeight: 600, 
                marginBottom: '1.5rem', 
                color: 'var(--navy)'
              }}>Our Vision</h2>
              
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, fontSize: '1.02rem', textAlign: 'justify' }}>
                To be a progressive and trusted business leader in IT Consulting, HR Services & Solutions. We intend to provide our client the best services from beginning to end and improve the way the client services are delivered globally by setting <strong style={{ color: 'var(--primary)', letterSpacing: '0.5px' }}>BEYOND EXPECTATIONS</strong>.
              </p>
            </motion.div>
 
            {/* Mission */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              style={{ 
                background: 'var(--surface-color)', 
                padding: 'var(--card-padding-lg)', 
                borderRadius: '2px', 
                border: '1px solid var(--border-color)',
                position: 'relative'
              }}
            >
              {/* Gold top corner line */}
              <div style={{ position: 'absolute', top: 0, left: 0, width: '15px', height: '15px', borderTop: '2px solid var(--primary)', borderLeft: '2px solid var(--primary)' }} />
              
              <h2 style={{ 
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '2rem', 
                fontWeight: 600, 
                marginBottom: '1.5rem', 
                color: 'var(--navy)'
              }}>Our Mission</h2>
              
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, fontSize: '1.02rem', textAlign: 'justify' }}>
                We endeavor for long-term sustainable practices and anticipate the needs of our client for a better tomorrow with unconditional support. Dedicated to Innovation & Excellence, we believe in providing innovative, professional and personalized services through better Solutions.
              </p>
            </motion.div>
          </div>
 
          {/* Core Values Section */}
          <div style={{ marginTop: '2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <h2 style={{ 
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '2.5rem', 
                fontWeight: 600, 
                color: 'var(--navy)',
                margin: 0
              }}>Core Values</h2>
              <div style={{ width: '40px', height: '1px', background: 'var(--primary)', margin: '1rem auto' }} />
            </div>
 
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: '2rem' }}>
              {values.map((v, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  style={{ 
                    background: 'var(--bg-color)', 
                    padding: 'var(--card-padding-md)', 
                    borderRadius: '2px', 
                    border: '1px solid var(--border-color)', 
                    textAlign: 'center',
                    transition: 'all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ background: 'rgba(197,168,128,0.08)', padding: '0.8rem', borderRadius: '2px', border: '1px solid var(--border-color)' }}>
                      {v.icon}
                    </div>
                  </div>
                  
                  <h3 style={{ 
                    fontSize: '1.15rem', 
                    fontWeight: 800, 
                    marginBottom: '0.8rem', 
                    color: 'var(--navy)',
                    letterSpacing: '1px',
                    textTransform: 'uppercase'
                  }}>{v.title}</h3>
                  
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.7 }}>{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 991px) {
          .vision-mission-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CoreValues;
