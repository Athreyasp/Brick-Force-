import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Solutions = () => {
  const services = [
    "Executive & Professional Search across levels and roles in all Industries/Vertical/Sectors",
    "Complete End-2-End Campus-to-Corporate and Talent Acquisition Support",
    "Resources Outsourcing of both Permanent & Temporary (IT, BFSI, Functional domain, Sales/Marketing, F&A and HR)",
    "Cost Plus HR Model & Execution",
    "HR Operations support (On Boarding to disengagement process)",
    "HR Shared Services Support (payroll, IT etc.,)",
    "HR Advisory to START-UPs / 2 or 3-tier industries across in India on all processes definition, policies etc.,",
    "Process Audits of HR Statutory & Compliance with Governance",
    "Planning, Execution and support on Merger & Acquisition of HR Streams",
    "Leadership & Talent development in the areas of Technical, Behavioral and functional domain",
    "Out source of Foreign Language translators or translation support",
    "HR Process developments and improvements",
    "Design & development of HRMS / HR IT Systems for a greater employee connect",
    "Design, Implementation and assistance in Talent Management"
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
        
        {/* Editorial Title */}
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <span className="section-subtitle">SOLUTIONS & SERVICES</span>
          <h1 style={{ 
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(2.8rem, 6vw, 4.2rem)',
            fontWeight: 500,
            lineHeight: 1.1,
            color: 'var(--navy)',
            margin: '0.5rem 0'
          }}>
            Our <span style={{ fontStyle: 'italic', color: 'var(--primary)' }}>Expertise</span>
          </h1>
          <div style={{ width: '80px', height: '2px', background: 'var(--primary)', margin: '1.5rem auto 0' }} />
        </div>

        {/* Intro Section */}
        <div className="solutions-intro-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
          gap: '5rem', 
          alignItems: 'center',
          marginBottom: '6rem'
        }}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="drop-cap" style={{ color: 'var(--text-primary)', fontSize: '1.05rem', lineHeight: 1.85, marginBottom: '1.5rem', textAlign: 'justify' }}>
              Our extensive knowledge & experiences in human resources is coupled with an expert team of consultants and specialists, who are engaged in creating the new dimension of people-to-industry connect.
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.85, textAlign: 'justify' }}>
              This signifies a greater importance of Human Capital Investment for clients across various functional domains and technologies, ensuring long-term sustainability and growth.
            </p>
          </motion.div>
          
          {/* Studio Framed Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ position: 'relative' }}
          >
            <div style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              right: '-12px',
              bottom: '-12px',
              border: '1px solid var(--primary)',
              borderRadius: '2px',
              background: 'var(--navy)',
              zIndex: -1
            }} />
            
            <img 
              src="/images/solutions_tech.png" 
              alt="Technology & Innovation" 
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
        </div>

        {/* Services Offerings Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '2rem' 
        }}>
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (index % 3) * 0.1, duration: 0.6 }}
              style={{
                background: 'var(--surface-color)',
                padding: '2.5rem 2rem',
                borderRadius: '2px',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1.2rem',
                transition: 'all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.background = 'var(--bg-color)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(11,17,32,0.05)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.background = 'var(--surface-color)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Corner fine line accent */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '10px',
                height: '10px',
                borderTop: '2px solid var(--primary)',
                borderLeft: '2px solid var(--primary)'
              }} />

              <div style={{ flexShrink: 0 }}>
                <div style={{ background: 'rgba(197,168,128,0.08)', padding: '0.4rem', borderRadius: '2px', border: '1px solid var(--border-color)' }}>
                  <CheckCircle2 size={18} color="var(--primary)" />
                </div>
              </div>
              
              <p style={{ color: 'var(--text-primary)', fontWeight: 800, lineHeight: 1.6, fontSize: '0.92rem', margin: 0 }}>
                {service}
              </p>
            </motion.div>
          ))}
        </div>

      </div>

      <style>{`
        @media (max-width: 991px) {
          .solutions-intro-grid {
            grid-template-columns: 1fr !important;
            gap: 4rem !important;
            margin-bottom: 4rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Solutions;
