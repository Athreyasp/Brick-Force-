import { motion } from 'framer-motion';
import { Users, BarChart, CheckCircle } from 'lucide-react';

const SkillsLeadership = () => {
  const behavioralTrainings = [
    "Communication Skills", "Time Management", "Stress Management", "Team Work",
    "Result Orientation", "Personality Development", "Emotional Intelligence",
    "Total Quality of Life", "Anti-Sexual Harassment Awareness", "Effective First-Time Manager",
    "Collaborations - Building Bridges", "Leading & Coaching Skills", "One Team - One Goal",
    "People & Culture Transformation"
  ];

  const functionalPrograms = [
    "Fire & Safety", "Occupational Health", "Lean Manufacturing", "Kaizen",
    "Six Sigma", "TQM", "Service Excellence"
  ];

  const levels = [
    { level: "Level 1: Basic", desc: "Can perform the task only under supervision, needs hand-holding." },
    { level: "Level 2: Advance", desc: "Can independently perform the task." },
    { level: "Level 3: Expert", desc: "Can independently drive and fix problems, troubleshoot and also develop others." },
    { level: "Level 4: Master", desc: "Can be guide / mentor in area of expertise, command and control overall management." }
  ];

  return (
    <div style={{ background: 'var(--bg-color)', minHeight: '100vh', paddingTop: '150px', paddingBottom: '8rem', overflow: 'hidden', position: 'relative' }}>
      {/* Blueprint Grid Lines Overlay */}
      <div className="architectural-grid" />

      {/* Decorative vertical blueprint line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '10%',
        width: '1px',
        height: '100%',
        background: 'linear-gradient(to bottom, rgba(197, 168, 128, 0.08) 0%, rgba(197, 168, 128, 0.01) 100%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        
        {/* Page Title */}
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <span className="section-subtitle">OUR SOLUTIONS</span>
          <h1 style={{ 
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(2.8rem, 6vw, 4.2rem)',
            fontWeight: 500,
            lineHeight: 1.1,
            color: 'var(--navy)',
            margin: '0.5rem 0'
          }}>
            Skills & <span style={{ fontStyle: 'italic', color: 'var(--primary)' }}>Leadership</span>
          </h1>
          <div style={{ width: '80px', height: '2px', background: 'var(--primary)', margin: '1.5rem auto 0' }} />
          <p style={{ color: 'var(--text-secondary)', maxWidth: '750px', margin: '2rem auto 0', fontSize: '1.05rem', lineHeight: 1.75 }}>
            Refining, inculcating, and revisiting skills to keep pace with the market or global demand.
          </p>
        </div>

        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '6rem' }}>
          
          {/* Training & Development Model */}
          <section>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <h2 style={{ 
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '2.5rem', 
                fontWeight: 600, 
                color: 'var(--navy)',
                margin: 0
              }}>Training & Development Model</h2>
              <div style={{ width: '40px', height: '1px', background: 'var(--primary)', margin: '1rem auto' }} />
            </div>

            <div style={{ 
              background: 'var(--surface-color)', 
              padding: 'var(--card-padding-lg)', 
              borderRadius: '2px', 
              border: '1px solid var(--border-color)',
              position: 'relative'
            }}>
              {/* Corner Line */}
              <div style={{ position: 'absolute', top: 0, left: 0, width: '15px', height: '15px', borderTop: '2px solid var(--primary)', borderLeft: '2px solid var(--primary)' }} />
              
              <p style={{ color: 'var(--text-primary)', fontSize: '1.05rem', lineHeight: 1.85, marginBottom: '3rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto 3rem' }}>
                Programs are conceived with the prime objective of enhancing effectiveness & productivity through continuous self-awareness and learning.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))', gap: '2rem' }}>
                {levels.map((l, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.6 }}
                    style={{ 
                      background: 'var(--bg-color)', 
                      padding: '2.5rem 1.5rem', 
                      borderRadius: '2px', 
                      textAlign: 'center', 
                      border: '1px solid var(--border-color)',
                      borderTop: '3px solid var(--primary)',
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
                    <h4 style={{ color: 'var(--navy)', fontWeight: 800, fontSize: '0.9rem', marginBottom: '1rem', letterSpacing: '1px', textTransform: 'uppercase' }}>{l.level}</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.75, margin: 0 }}>{l.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
 
          {/* Behavioral & Functional Grid */}
          <div className="skills-main-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(450px, 100%), 1fr))', gap: '3rem' }}>
            
            {/* Behavioral */}
            <section style={{ 
              background: 'var(--surface-color)', 
              padding: 'var(--card-padding-lg)', 
              borderRadius: '2px', 
              border: '1px solid var(--border-color)',
              position: 'relative'
            }}>
              {/* Corner Line */}
              <div style={{ position: 'absolute', top: 0, left: 0, width: '12px', height: '12px', borderTop: '2px solid var(--primary)', borderLeft: '2px solid var(--primary)' }} />
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                <div style={{ background: 'rgba(197,168,128,0.08)', padding: '0.5rem', borderRadius: '2px', border: '1px solid var(--border-color)' }}>
                  <Users size={22} color="var(--primary)" />
                </div>
                <h3 style={{ 
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1.8rem', 
                  fontWeight: 600, 
                  color: 'var(--navy)',
                  margin: 0
                }}>Behavioral Trainings</h3>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', gap: '1.2rem' }}>
                {behavioralTrainings.map((t, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-primary)', fontSize: '0.92rem', fontWeight: 600 }}>
                    <CheckCircle size={14} color="var(--primary)" />
                    {t}
                  </div>
                ))}
              </div>
            </section>
 
            {/* Functional */}
            <section style={{ 
              background: 'var(--surface-color)', 
              padding: 'var(--card-padding-lg)', 
              borderRadius: '2px', 
              border: '1px solid var(--border-color)',
              position: 'relative'
            }}>
              {/* Corner Line */}
              <div style={{ position: 'absolute', top: 0, left: 0, width: '12px', height: '12px', borderTop: '2px solid var(--primary)', borderLeft: '2px solid var(--primary)' }} />
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                <div style={{ background: 'rgba(197,168,128,0.08)', padding: '0.5rem', borderRadius: '2px', border: '1px solid var(--border-color)' }}>
                  <BarChart size={22} color="var(--primary)" />
                </div>
                <h3 style={{ 
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1.8rem', 
                  fontWeight: 600, 
                  color: 'var(--navy)',
                  margin: 0
                }}>Functional Programs</h3>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.2rem' }}>
                {functionalPrograms.map((t, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-primary)', fontSize: '0.92rem', fontWeight: 600 }}>
                    <CheckCircle size={14} color="var(--primary)" />
                    {t}
                  </div>
                ))}
              </div>
            </section>
          </div>
 
          {/* Complete Outsourced Training Solutions - Deep Navy */}
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
            <div style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', bottom: '10px', border: '1px dashed rgba(197,168,128,0.2)', pointerEvents: 'none' }} />
            
            <h3 style={{ 
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '2.4rem', 
              fontWeight: 500, 
              marginBottom: '2.5rem',
              color: 'var(--primary)'
            }}>Complete Outsourced Training Solutions</h3>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.2rem' }}>
              {[
                "Training Need Identification", "Training Need Assessment", 
                "Training Design & Delivery", "Training Calendar", 
                "Training Effectiveness", "ROI on Training"
              ].map((item, i) => (
                <div 
                  key={i} 
                  style={{ 
                    background: 'rgba(197, 168, 128, 0.08)', 
                    padding: '0.9rem 1.8rem', 
                    borderRadius: '2px', 
                    border: '1px solid rgba(197, 168, 128, 0.25)', 
                    fontSize: '0.85rem',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    fontWeight: 800,
                    color: 'var(--primary)',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#fff';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(197, 168, 128, 0.25)';
                    e.currentTarget.style.background = 'rgba(197, 168, 128, 0.08)';
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>

      <style>{`
        @media (max-width: 991px) {
          .skills-main-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SkillsLeadership;
