import { useEffect, useRef } from 'react';
import { Briefcase, Award, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Services = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const services = [
    {
      icon: <Briefcase size={36} color="var(--primary)" />,
      title: "Human Resources",
      description: "End-to-end HR solutions designed to attract, retain, and develop top talent for your organization.",
      link: "/solutions-services/human-resource"
    },
    {
      icon: <Award size={36} color="var(--primary)" />,
      title: "Skills & Leadership",
      description: "Empowering your workforce through comprehensive training programs and leadership development.",
      link: "/solutions-services/skills-leadership"
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header zoom-reveal
      gsap.fromTo(headerRef.current,
        { opacity: 0, scale: 0.95 },
        { 
          opacity: 1, 
          scale: 1, 
          duration: 1.2,
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );

      // Service cards slide-reveals from left/right
      if (cardsRef.current) {
        const cards = cardsRef.current.children;
        
        // HR card (left entrance)
        gsap.fromTo(cards[0],
          { opacity: 0, x: -40 },
          {
            opacity: 1,
            x: 0,
            duration: 1.2,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          }
        );

        // Skills card (right entrance)
        gsap.fromTo(cards[1],
          { opacity: 0, x: 40 },
          {
            opacity: 1,
            x: 0,
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

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      borderColor: 'var(--primary)',
      background: 'var(--bg-color)',
      boxShadow: '0 25px 50px rgba(197, 168, 128, 0.08)',
      y: -6,
      duration: 0.4,
      ease: 'power2.out'
    });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      borderColor: 'var(--border-color)',
      background: 'var(--surface-color)',
      boxShadow: 'none',
      y: 0,
      duration: 0.4,
      ease: 'power2.out'
    });
  };

  return (
    <section ref={containerRef} id="services" className="section" style={{ background: 'var(--bg-color)', position: 'relative', overflow: 'hidden' }}>
      {/* Blueprint Grid Lines Overlay */}
      <div className="architectural-grid" />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div ref={headerRef} style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <span className="section-subtitle">SOLUTIONS & SERVICES</span>
          <h2 className="section-title">Our Expertise</h2>
          <div style={{ width: '60px', height: '2px', background: 'var(--primary)', margin: '0 auto' }} />
        </div>

        <div 
          ref={cardsRef}
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', 
            gap: '2.5rem' 
          }}
        >
          {services.map((service, index) => (
            <div
              key={index}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{
                background: 'var(--surface-color)',
                borderRadius: '2px',
                padding: 'var(--card-padding-md)',
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
                textAlign: 'left',
                position: 'relative'
              }}
            >
              <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ background: 'rgba(197,168,128,0.08)', padding: '0.8rem', borderRadius: '2px', border: '1px solid var(--border-color)' }}>
                  {service.icon}
                </div>
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '1rem', fontWeight: 800, color: 'var(--navy)', letterSpacing: '0.5px' }}>{service.title}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '2rem', fontSize: '0.95rem' }}>
                {service.description}
              </p>
              <a href={service.link} style={{ 
                color: 'var(--navy)', 
                fontWeight: 700, 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                fontSize: '0.8rem',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--navy)'}
              >
                Learn More <ArrowRight size={14} style={{ color: 'var(--primary)' }} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
