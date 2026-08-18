import { motion } from 'framer-motion';
import { ShieldCheck, Target, Zap, HeartHandshake } from 'lucide-react';

const Quality = () => {
  const objectives = [
    {
      title: "Client-Centric HR Management",
      icon: <Target size={24} color="var(--primary)" />,
      text: "Develop each individual and client as HR management."
    },
    {
      title: "Efficiency",
      icon: <Zap size={24} color="var(--primary)" />,
      text: "Provide timely & efficient services to clients."
    },
    {
      title: "Simple Processes",
      icon: <ShieldCheck size={24} color="var(--primary)" />,
      text: "Build people processes which are simple, expedient and result oriented."
    },
    {
      title: "Mentorship",
      icon: <HeartHandshake size={24} color="var(--primary)" />,
      text: "Be a Facilitator, Guide and Mentor."
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
        right: '10%',
        width: '1px',
        height: '100%',
        background: 'linear-gradient(to bottom, rgba(197, 168, 128, 0.08) 0%, rgba(197, 168, 128, 0.01) 100%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        
        {/* Editorial Title */}
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <span className="section-subtitle">OUR COMMITMENT</span>
          <h1 style={{ 
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(2.8rem, 6vw, 4.2rem)',
            fontWeight: 500,
            lineHeight: 1.1,
            color: 'var(--navy)',
            margin: '0.5rem 0'
          }}>
            Quality & <span style={{ fontStyle: 'italic', color: 'var(--primary)' }}>Ethics</span>
          </h1>
          <div style={{ width: '80px', height: '2px', background: 'var(--primary)', margin: '1.5rem auto 0' }} />
        </div>

        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '5rem' }}>
          
          {/* Main Statement */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ 
              background: 'var(--surface-color)', 
              padding: 'var(--card-padding-lg)', 
              borderRadius: '2px', 
              border: '1px solid var(--border-color)', 
              textAlign: 'center',
              position: 'relative'
            }}
          >
            {/* Gold Corner Accent */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '15px', height: '15px', borderTop: '2px solid var(--primary)', borderLeft: '2px solid var(--primary)' }} />
            
            <h2 style={{ 
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '2rem', 
              fontWeight: 600, 
              marginBottom: '1.5rem', 
              color: 'var(--navy)'
            }}>Our People First Approach</h2>
            
            <p style={{ color: 'var(--text-primary)', lineHeight: 1.85, fontSize: '1.05rem', textAlign: 'justify', margin: 0 }}>
              We firmly believe people are our most important assets. At BRICK FORCE, we strive to build a competent team who are creative, dynamic, committed, and responsible in their actions, continuously excelling in driving higher performance and highest ethics for employers and clients.
            </p>
          </motion.div>
 
          {/* Objectives Grid */}
          <div>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <h2 style={{ 
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '2.5rem', 
                fontWeight: 600, 
                color: 'var(--navy)',
                margin: 0
              }}>Quality Objectives</h2>
              <div style={{ width: '40px', height: '1px', background: 'var(--primary)', margin: '1rem auto' }} />
            </div>
 
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(350px, 100%), 1fr))', gap: '2rem' }}>
              {objectives.map((obj, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  style={{ 
                    background: 'var(--bg-color)', 
                    padding: '2.5rem 2rem', 
                    borderRadius: '2px', 
                    border: '1px solid var(--border-color)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1.5rem', 
                    borderLeft: '3px solid var(--primary)',
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
                  <div style={{ flexShrink: 0, background: 'rgba(197,168,128,0.08)', padding: '0.6rem', borderRadius: '2px', border: '1px solid var(--border-color)' }}>
                    {obj.icon}
                  </div>
                  <div>
                    <h3 style={{ 
                      fontSize: '1.1rem', 
                      fontWeight: 800, 
                      marginBottom: '0.3rem', 
                      color: 'var(--navy)',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase'
                    }}>{obj.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>{obj.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
 
          {/* Ethical Culture - Deep Navy Backdrop */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ 
              background: 'var(--navy)', 
              padding: 'var(--card-padding-lg)', 
              borderRadius: '2px', 
              color: '#fff', 
              textAlign: 'center',
              border: '1px solid var(--primary)',
              position: 'relative'
            }}
          >
            {/* Decorative Corner lines inside */}
            <div style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', bottom: '10px', border: '1px dashed rgba(197,168,128,0.2)', pointerEvents: 'none' }} />

            <h2 style={{ 
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '2.2rem', 
              fontWeight: 500, 
              marginBottom: '1.5rem',
              color: 'var(--primary)'
            }}>Ethical Culture & Governance</h2>
            
            <p style={{ fontSize: '1.05rem', opacity: 0.85, lineHeight: 1.85, maxWidth: '700px', margin: '0 auto', textAlign: 'justify' }}>
              The Board of Directors embrace principles of integrity, honesty, and fair dealing. We have adopted strong practices that ensure our company is managed with the objective of building value for clients over the long term. We believe our strong governance is illustrative of the ethical culture that has always existed at BRICK FORCE.
            </p>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Quality;
