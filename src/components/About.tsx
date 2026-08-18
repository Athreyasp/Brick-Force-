import { useEffect, useRef } from 'react';
import { Target, Shield, Users } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const values = [
    {
      icon: <Target size={36} color="var(--primary)" />,
      title: "Core Values",
      description: "Committed to driving business value across all industry verticals with integrity and innovation."
    },
    {
      icon: <Shield size={36} color="var(--primary)" />,
      title: "Quality",
      description: "Delivering user-friendly solutions that maximize ROI and improve system availability."
    },
    {
      icon: <Users size={36} color="var(--primary)" />,
      title: "Expertise",
      description: "In-house experts pioneering HR and IT infrastructure solutions on various platforms."
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header fade-up
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 40 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1.2,
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );

      // Cards stagger reveal
      if (cardsRef.current) {
        const cards = cardsRef.current.children;
        gsap.fromTo(cards,
          { opacity: 0, y: 50, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.15,
            duration: 1.2,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleCardMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      y: -8,
      borderColor: '#c5a880',
      boxShadow: '0 20px 40px rgba(197, 168, 128, 0.08)',
      duration: 0.4,
      ease: 'power2.out'
    });
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      y: 0,
      borderColor: 'var(--border-color)',
      boxShadow: 'none',
      duration: 0.4,
      ease: 'power2.out'
    });
  };

  return (
    <section ref={containerRef} id="about" className="section" style={{ background: 'var(--surface-color)', position: 'relative', overflow: 'hidden' }}>
      {/* Structural layout coordinate details */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '10%',
        width: '1px',
        height: '100%',
        background: 'rgba(197, 168, 128, 0.05)',
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div ref={headerRef} style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <span className="section-subtitle">ABOUT US</span>
          <h2 className="section-title">Trusted Solution Hub</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '750px', margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.8 }}>
            BRICK FORCE Consulting Services Pvt. Ltd. established in 2016, headquartered at Bangalore. Today we aim to be one of the trusted solution hubs for our clients when it comes to people and technology, keeping our objective in the space of IT Consulting, HR Solutions & Services across industries.
          </p>
        </div>

        <div 
          ref={cardsRef}
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', 
            gap: '2.5rem' 
          }}
        >
          {values.map((value, index) => (
            <div
              key={index}
              onMouseEnter={handleCardMouseEnter}
              onMouseLeave={handleCardMouseLeave}
              style={{
                background: 'var(--bg-color)',
                padding: 'var(--card-padding-md)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                textAlign: 'left',
                border: '1px solid var(--border-color)',
                borderRadius: '2px',
                position: 'relative',
                cursor: 'pointer'
              }}
            >
              {/* Corner fine line accent */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '12px',
                height: '12px',
                borderTop: '2px solid var(--primary)',
                borderLeft: '2px solid var(--primary)'
              }} />

              <div style={{ marginBottom: '1.8rem', background: 'var(--surface-color)', padding: '0.8rem', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {value.icon}
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 800, color: 'var(--navy)', letterSpacing: '1px', textTransform: 'uppercase' }}>{value.title}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
