import { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLSpanElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const btnGroupRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Text entrance timelines
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      tl.fromTo(gridRef.current, 
        { opacity: 0, scale: 1.05 },
        { opacity: 1, scale: 1, duration: 2.2 }
      );

      tl.fromTo(subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1 },
        '-=1.6'
      );

      // Split title into words and stagger them
      if (titleRef.current) {
        const words = titleRef.current.innerText.split(' ');
        titleRef.current.innerHTML = words.map(w => `<span style="display:inline-block; opacity:0; transform:translateY(30px);">${w}</span>`).join(' ');
        const spans = titleRef.current.querySelectorAll('span');
        tl.to(spans, {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 1.2
        }, '-=0.8');
      }

      tl.fromTo(descRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2 },
        '-=0.8'
      );

      tl.fromTo(btnGroupRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1 },
        '-=0.8'
      );

      tl.fromTo(imageContainerRef.current,
        { opacity: 0, scale: 0.95, y: 40 },
        { opacity: 1, scale: 1, y: 0, duration: 1.6 },
        '-=1.4'
      );

      tl.fromTo(badgeRef.current,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 1.2, ease: 'elastic.out(1, 0.6)' },
        '-=0.8'
      );

      // 2. Mouse Move Parallax Effect
      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const xPercent = (clientX / window.innerWidth - 0.5) * 2; // -1 to 1
        const yPercent = (clientY / window.innerHeight - 0.5) * 2;

        // Drift background grid slightly
        gsap.to(gridRef.current, {
          x: xPercent * 15,
          y: yPercent * 15,
          duration: 1,
          ease: 'power2.out'
        });

        // Drift hero image in opposite direction
        gsap.to(imageContainerRef.current, {
          x: xPercent * -10,
          y: yPercent * -10,
          duration: 1,
          ease: 'power2.out'
        });

        // Drift luxury badge
        gsap.to(badgeRef.current, {
          x: xPercent * 8,
          y: yPercent * 8,
          duration: 1.2,
          ease: 'power2.out'
        });
      };

      window.addEventListener('mousemove', handleMouseMove);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} id="home" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      paddingTop: '120px',
      overflow: 'hidden',
      background: 'var(--bg-color)'
    }}>
      {/* Premium Blueprint Background Grid */}
      <div ref={gridRef} className="architectural-grid" />

      {/* Decorative vertical blueprint line */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: '15%',
        width: '1px',
        height: '100%',
        background: 'linear-gradient(to bottom, rgba(197, 168, 128, 0.08) 0%, rgba(197, 168, 128, 0.02) 100%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="hero-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(400px, 100%), 1fr))', 
          gap: '4rem', 
          alignItems: 'center' 
        }}>
          
          <div>
            <span ref={subtitleRef} style={{ 
              display: 'inline-block',
              padding: '0.4rem 1.2rem', 
              background: 'rgba(197,168,128,0.08)', 
              color: 'var(--primary)',
              borderRadius: '2px',
              fontWeight: 800,
              fontSize: '0.75rem',
              letterSpacing: '3px',
              marginBottom: '1.5rem',
              textTransform: 'uppercase',
              border: '1px solid var(--border-color)'
            }}>
              Beyond Expectations
            </span>
            
            <h1 ref={titleRef} style={{ 
              fontSize: 'var(--font-size-hero)', 
              fontWeight: 800, 
              lineHeight: 1.05,
              marginBottom: '1.5rem',
              color: 'var(--navy)',
              letterSpacing: '-1.5px',
              fontFamily: "'Outfit', sans-serif"
            }}>
              Empowering Business Through Excellence
            </h1>
            
            <p ref={descRef} style={{ 
              fontSize: '1.1rem', 
              color: 'var(--text-secondary)',
              marginBottom: '2.5rem',
              lineHeight: 1.8,
              maxWidth: '550px'
            }}>
              We use our expertise to provide user-friendly solutions that enhance productivity, process improvements, and people retention for industry leaders.
            </p>

            <div ref={btnGroupRef} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link 
                to="/about-us" 
                className="btn btn-primary" 
                style={{ 
                  padding: '1.1rem 2.5rem', 
                  display: 'flex', 
                  gap: '0.8rem', 
                  alignItems: 'center', 
                  boxShadow: '0 10px 25px rgba(11,17,32,0.1)',
                  border: '1px solid var(--navy)'
                }}
              >
                Discover Our Story <ArrowRight size={18} />
              </Link>
              <Link 
                to="/solutions-services" 
                className="btn btn-outline" 
                style={{ 
                  padding: '1.1rem 2.5rem', 
                  border: '1px solid var(--navy)', 
                  color: 'var(--navy)' 
                }}
              >
                View Services
              </Link>
            </div>
          </div>

          <div ref={imageContainerRef} style={{ position: 'relative' }}>
            {/* Architectural Shadow Box */}
            <div style={{
              position: 'absolute',
              top: '8%',
              left: '8%',
              right: '-4%',
              bottom: '-4%',
              border: '1px solid var(--border-color)',
              background: 'var(--navy)',
              borderRadius: '4px',
              zIndex: -1,
              opacity: 0.95
            }} />
            
            <img 
              src="/images/hero_home.png" 
              alt="Corporate Team" 
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '2px',
                boxShadow: '0 20px 40px rgba(11,17,32,0.06)',
                display: 'block',
                border: '1px solid var(--border-color)'
              }}
            />
            {/* Floating Luxury Status Badge */}
            <div
              ref={badgeRef}
              className="retention-badge"
              style={{
                position: 'absolute',
                bottom: '8%',
                left: '-8%',
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(10px)',
                padding: '1.2rem 2rem',
                borderRadius: '2px',
                border: '1px solid var(--border-color)',
                boxShadow: '0 15px 35px rgba(11,17,32,0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <div style={{ background: 'var(--primary)', width: '8px', height: '8px', borderRadius: '50%' }} />
              <span style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--navy)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                99% Client Retention
              </span>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid {
            gap: 2.5rem !important;
          }
          .retention-badge {
            left: 1rem !important;
            bottom: 1rem !important;
            padding: 0.8rem 1.25rem !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
