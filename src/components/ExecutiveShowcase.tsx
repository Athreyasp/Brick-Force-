import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ShieldCheck, Cpu, Award, Activity, Plus } from 'lucide-react';

interface Capability {
  id: string;
  title: string;
  icon: React.ReactNode;
  tagline: string;
  description: string;
  metric: string;
  metricLabel: string;
  features: string[];
  bgAccent: string;
}

const ExecutiveShowcase = () => {
  const [activeTab, setActiveTab] = useState<string>('exec-search');

  const capabilities: Capability[] = [
    {
      id: 'exec-search',
      title: 'Executive & Leadership Search',
      icon: <Users size={22} />,
      tagline: 'Securing Visionary Leadership',
      description: 'Discreet, elite recruitment for C-suite, Middle, and Upper Management levels. We utilize our 360-degree feedback framework to map competency, cultural alignment, and strategic success.',
      metric: '98.5%',
      metricLabel: 'Retainer Success Rate',
      features: [
        'Gen-X, Y, Z Bespoke Talent Mapping',
        '360-Degree Executive Chemistry Scrutiny',
        'Confidential Succession Planning Frameworks'
      ],
      bgAccent: 'rgba(197, 168, 128, 0.08)'
    },
    {
      id: 'compliance',
      title: 'Statutory Compliance & Audits',
      icon: <ShieldCheck size={22} />,
      tagline: 'Mitigating Corporate & Operational Risk',
      description: 'End-to-end statutory and regulatory operational review, protecting enterprise values and mitigating corporate risk across federal and state guidelines.',
      metric: '100%',
      metricLabel: 'Audit Compliance Rate',
      features: [
        'Federal & State Statutory Auditing',
        'Comprehensive HR Risk Mitigation Mapping',
        'Ethics & Corporate Governance Alignment'
      ],
      bgAccent: 'rgba(197, 168, 128, 0.08)'
    },
    {
      id: 'it-consulting',
      title: 'Enterprise IT Infrastructure',
      icon: <Cpu size={22} />,
      tagline: 'Scaling Digital Capabilities',
      description: 'Scaling network operations, virtualization, and server hardware under L1, L2, L3 outsourcing models. We leverage state-of-the-art tech systems for strategic competitive advantage.',
      metric: '99.99%',
      metricLabel: 'System SLA Availability',
      features: [
        'Data Center & Virtualization Infrastructure',
        'L1, L2, L3 Outsourced Technical Experts',
        'Global Compliance Server Ops Maintenance'
      ],
      bgAccent: 'rgba(197, 168, 128, 0.08)'
    },
    {
      id: 'upskilling',
      title: 'Corporate Transformation',
      icon: <Award size={22} />,
      tagline: 'Maximizing Human Capital Value',
      description: 'Conceiving behavioral and functional training programs targeted at organizational up-skilling, from personality growth to total quality of life systems.',
      metric: '3.2x',
      metricLabel: 'ROI on Training Programs',
      features: [
        'Advanced Leadership Mentorship Pathways',
        'Lean Manufacturing & Kaizen Operations',
        'Behavioral Culture & Team Alignment'
      ],
      bgAccent: 'rgba(197, 168, 128, 0.08)'
    }
  ];

  const activeData = capabilities.find(c => c.id === activeTab) || capabilities[0];

  return (
    <section id="showcase" className="section" style={{ background: 'var(--bg-color)', position: 'relative', overflow: 'hidden', padding: '8rem 0' }}>
      {/* Signature Blueprint grid */}
      <div className="architectural-grid" />

      {/* Decorative vertical blueprint line */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: '25%',
        width: '1px',
        height: '100%',
        background: 'linear-gradient(to bottom, rgba(197, 168, 128, 0.08) 0%, rgba(197, 168, 128, 0.02) 100%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
          <span className="section-subtitle">THE STRATEGY MATRIX</span>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(2.8rem, 6vw, 4.2rem)',
            fontWeight: 500,
            lineHeight: 1.1,
            color: 'var(--navy)',
            margin: '0.5rem 0 0 0'
          }}>
            Interactive <span style={{ fontStyle: 'italic', color: 'var(--primary)' }}>Capabilities Ledger</span>
          </h2>
          <div style={{ width: '80px', height: '2px', background: 'var(--primary)', margin: '1.5rem auto 0' }} />
          <p style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '2rem auto 0', fontSize: '1.05rem', lineHeight: 1.75 }}>
            Select a strategic segment below to visualize the operational framework, metrics, and core features that set our services beyond expectations.
          </p>
        </div>

        {/* Interactive Grid */}
        <div className="showcase-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1.1fr 1.3fr',
          gap: '4.5rem',
          alignItems: 'start'
        }}>
          
          {/* Left Side: Ledger List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {capabilities.map((cap) => {
              const isActive = cap.id === activeTab;
              return (
                <div
                  key={cap.id}
                  onClick={() => setActiveTab(cap.id)}
                  style={{
                    background: isActive ? 'var(--navy)' : 'var(--surface-color)',
                    color: isActive ? '#fff' : 'var(--text-primary)',
                    padding: '2rem 1.8rem',
                    borderRadius: '2px',
                    border: '1px solid',
                    borderColor: isActive ? 'var(--primary)' : 'var(--border-color)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem',
                    position: 'relative',
                    transition: 'all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = 'var(--primary)';
                      e.currentTarget.style.background = 'var(--bg-color)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                      e.currentTarget.style.background = 'var(--surface-color)';
                    }
                  }}
                >
                  {/* Corner Accent Line */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '10px',
                    height: '10px',
                    borderTop: '2px solid var(--primary)',
                    borderLeft: '2px solid var(--primary)'
                  }} />

                  <div style={{
                    background: isActive ? 'rgba(197, 168, 128, 0.15)' : 'rgba(197, 168, 128, 0.08)',
                    color: 'var(--primary)',
                    padding: '0.6rem',
                    borderRadius: '2px',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexShrink: 0
                  }}>
                    {cap.icon}
                  </div>

                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '1.05rem',
                      fontWeight: 800,
                      letterSpacing: '0.5px',
                      margin: 0,
                      color: isActive ? '#fff' : 'var(--navy)'
                    }}>
                      {cap.title}
                    </h3>
                    <p style={{
                      fontSize: '0.8rem',
                      opacity: isActive ? 0.75 : 0.6,
                      margin: '0.2rem 0 0 0',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      color: isActive ? 'var(--primary)' : 'var(--text-secondary)'
                    }}>
                      {cap.tagline}
                    </p>
                  </div>

                  <div style={{
                    color: 'var(--primary)',
                    opacity: isActive ? 1 : 0.3,
                    transition: 'all 0.2s',
                    display: 'flex'
                  }}>
                    <Plus size={16} style={{ transform: isActive ? 'rotate(45deg)' : 'none', transition: 'transform 0.3s' }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Side: Blueprint Projection Screen */}
          <div style={{ position: 'relative' }}>
            {/* Elegant outer frame backing */}
            <div 
              className="blueprint-dashed-frame"
              style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                right: '-12px',
                bottom: '-12px',
                border: '1px dashed var(--primary)',
                borderRadius: '2px',
                zIndex: 0,
                opacity: 0.35
              }} 
            />

            <div style={{
              background: 'var(--surface-color)',
              border: '1px solid var(--border-color)',
              borderRadius: '2px',
              padding: 'var(--card-padding-lg)',
              position: 'relative',
              zIndex: 1,
              minHeight: '480px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 45px rgba(11,17,32,0.03)'
            }}>
              {/* Corner L-bracket */}
              <div style={{ position: 'absolute', top: 0, left: 0, width: '15px', height: '15px', borderTop: '2px solid var(--primary)', borderLeft: '2px solid var(--primary)' }} />
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: '15px', height: '15px', borderBottom: '2px solid var(--primary)', borderRight: '2px solid var(--primary)' }} />

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  style={{ display: 'flex', flexDirection: 'column', height: '100%', flex: 1 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--primary)', fontWeight: 800, fontSize: '0.78rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                    <Activity size={14} />
                    <span>Live Blueprint Analysis</span>
                  </div>

                  <h3 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '2.4rem',
                    fontWeight: 500,
                    color: 'var(--navy)',
                    margin: '0 0 1rem 0',
                    lineHeight: 1.2
                  }}>
                    {activeData.title}
                  </h3>

                  <p style={{
                    color: 'var(--text-secondary)',
                    lineHeight: 1.8,
                    fontSize: '1.02rem',
                    marginBottom: '2.5rem',
                    textAlign: 'justify'
                  }}>
                    {activeData.description}
                  </p>

                  {/* Symmetrical Grid for Metrics & Features */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1.1fr 1fr',
                    gap: '2.5rem',
                    marginTop: 'auto',
                    borderTop: '1px solid var(--border-color)',
                    paddingTop: '2.5rem'
                  }} className="blueprint-detail-row">
                    
                    {/* Metric Visual */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <span style={{
                        fontSize: '3.6rem',
                        fontWeight: 700,
                        lineHeight: 0.95,
                        color: 'var(--primary-hover)'
                      }}>
                        {activeData.metric}
                      </span>
                      <span style={{
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        color: 'var(--navy)'
                      }}>
                        {activeData.metricLabel}
                      </span>
                    </div>

                    {/* Features checklist */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                      {activeData.features.map((feature, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'start', gap: '0.6rem' }}>
                          <div style={{ width: '4px', height: '4px', background: 'var(--primary)', borderRadius: '50%', marginTop: '6px', flexShrink: 0 }} />
                          <span style={{ fontSize: '0.86rem', color: 'var(--text-primary)', fontWeight: 700, lineHeight: 1.4 }}>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 991px) {
          .showcase-grid {
            grid-template-columns: 1fr !important;
            gap: 3.5rem !important;
          }
          .blueprint-detail-row {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
        @media (max-width: 768px) {
          .blueprint-dashed-frame {
            right: 0px !important;
            bottom: 0px !important;
            top: 8px !important;
            left: 8px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default ExecutiveShowcase;
