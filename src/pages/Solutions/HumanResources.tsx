import { motion } from 'framer-motion';
import { Users, Briefcase, TrendingUp, ShieldCheck, ClipboardCheck } from 'lucide-react';

const HumanResources = () => {
  const sections = [
    {
      title: "BRICK FORCE (Gen - Z)",
      icon: <TrendingUp size={24} color="var(--primary)" />,
      desc: "Generation Z are predicted to be highly connected and tech-driven. We fulfill hiring at entry levels like Diploma Engineer Trainees, Commercial Trainees, and Management Trainees. We ensure accuracy, assessments, and adherence to verification processes to get the best energy for your firm."
    },
    {
      title: "BRICK FORCE (Gen - Y)",
      icon: <Users size={24} color="var(--primary)" />,
      desc: "Millennials provide the solidity and focus required for organizations to achieve their goals. We follow a strict multi-stage process of selection to present the most appropriate profiles for Middle Management Level, groomed for succession planning."
    },
    {
      title: "BRICK FORCE (Gen - X)",
      icon: <ShieldCheck size={24} color="var(--primary)" />,
      desc: "Executive Search & Leadership Hiring. We manage discreet discussions and 360-degree feedback for business heads and management positions, scrutinizing people, market, and commercial management skills."
    }
  ];

  const consultingActivities = [
    "Organization Structuring – Roles, Grades, Career Path",
    "Statutory Compliances Requirement",
    "Compensation & Best HR practices benchmarking",
    "Payroll Management",
    "Recruitment System Design",
    "Employee Policy Manual",
    "Organizational Employee Engagement Surveys",
    "Employee Exit Management Survey"
  ];

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
        
        {/* Editorial Title */}
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
            Human <span style={{ fontStyle: 'italic', color: 'var(--primary)' }}>Resources</span>
          </h1>
          <div style={{ width: '80px', height: '2px', background: 'var(--primary)', margin: '1.5rem auto 0' }} />
          <p style={{ color: 'var(--text-secondary)', maxWidth: '750px', margin: '2rem auto 0', fontSize: '1.05rem', lineHeight: 1.75 }}>
            Our consulting division provides solutions when you want to either outsource HR activities or design a professional HR environment within the company.
          </p>
        </div>

        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '6rem' }}>
          
          {/* Gen X/Y/Z Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: '2.5rem' }}>
            {sections.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                style={{ 
                  background: 'var(--surface-color)', 
                  padding: 'var(--card-padding-md)', 
                  borderRadius: '2px', 
                  border: '1px solid var(--border-color)', 
                  position: 'relative',
                  transition: 'all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.background = 'var(--bg-color)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.background = 'var(--surface-color)';
                }}
              >
                {/* Corner line accent */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '12px', height: '12px', borderTop: '2px solid var(--primary)', borderLeft: '2px solid var(--primary)' }} />
                
                <div style={{ marginBottom: '1.8rem', display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{ background: 'rgba(197,168,128,0.08)', padding: '0.6rem', borderRadius: '2px', border: '1px solid var(--border-color)' }}>
                    {s.icon}
                  </div>
                </div>
                
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 800, 
                  marginBottom: '1rem', 
                  color: 'var(--navy)',
                  letterSpacing: '0.5px'
                }}>{s.title}</h3>
                
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem', margin: 0, textAlign: 'justify' }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* MSME segment consulting */}
          <section style={{ 
            background: 'var(--bg-color)', 
            padding: 'var(--card-padding-lg)', 
            borderRadius: '2px', 
            border: '1px solid var(--border-color)',
            position: 'relative'
          }}>
            {/* Corner line accent */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '15px', height: '15px', borderTop: '2px solid var(--primary)', borderLeft: '2px solid var(--primary)' }} />
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ background: 'rgba(197,168,128,0.08)', padding: '0.5rem', borderRadius: '2px', border: '1px solid var(--border-color)' }}>
                <Briefcase size={24} color="var(--primary)" />
              </div>
              <h2 style={{ 
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '2.2rem', 
                fontWeight: 600, 
                color: 'var(--navy)',
                margin: 0
              }}>MSME Segment Targeted Consulting</h2>
            </div>
            
            <p style={{ color: 'var(--text-primary)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '3rem', textAlign: 'justify' }}>
              Specifically targeted at the MSME segment, we bring expertise to design HR systems, policies, and processes that help you scale your business. We partner in your progress to make the journey smooth.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: '1.5rem' }}>
              {consultingActivities.map((activity, i) => (
                <div 
                  key={i} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.8rem', 
                    padding: '1.2rem', 
                    background: 'var(--surface-color)', 
                    borderRadius: '2px', 
                    border: '1px solid var(--border-color)',
                    borderLeft: '3px solid var(--primary)',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.background = 'var(--bg-color)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.background = 'var(--surface-color)';
                  }}
                >
                  <ClipboardCheck size={16} color="var(--primary)" />
                  <span style={{ fontWeight: 800, color: 'var(--navy)', fontSize: '0.85rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{activity}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Dual panel bottom layouts */}
          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(450px, 100%), 1fr))', gap: '3rem' }}>
            
            {/* HRO - Deep Navy */}
            <div style={{ 
              background: 'var(--navy)', 
              padding: 'var(--card-padding-lg)', 
              borderRadius: '2px', 
              color: '#fff',
              border: '1px solid var(--primary)',
              position: 'relative'
            }}>
              <div style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', bottom: '10px', border: '1px dashed rgba(197,168,128,0.15)', pointerEvents: 'none' }} />
              
              <h3 style={{ 
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '2rem', 
                fontWeight: 500, 
                marginBottom: '1.5rem',
                color: 'var(--primary)'
              }}>HR Outsourcing (HRO)</h3>
              
              <p style={{ lineHeight: 1.8, opacity: 0.85, fontSize: '0.98rem', textAlign: 'justify', margin: 0 }}>
                We shoulder the entire HR load of the MSME segment, enabling clients to focus on core business. We handle the entire spectrum from Hiring to Payroll and Exit Formalities.
              </p>
            </div>

            {/* Compliance - Cream Panel */}
            <div style={{ 
              background: 'var(--surface-color)', 
              padding: 'var(--card-padding-lg)', 
              borderRadius: '2px', 
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              position: 'relative'
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '12px', height: '12px', borderTop: '2px solid var(--primary)', borderLeft: '2px solid var(--primary)' }} />
              
              <h3 style={{ 
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '2rem', 
                fontWeight: 600, 
                marginBottom: '1.5rem',
                color: 'var(--navy)'
              }}>Compliance & Audits</h3>
              
              <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)', fontSize: '0.98rem', textAlign: 'justify', margin: 0 }}>
                Our 'HR Compliance Audit' and Operational Review will tell you exactly where your company is at risk and how to fix it, ensuring you stay compliant with federal and state regulations.
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default HumanResources;
