import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Preloader = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power4.out' }
      });

      // Stage 1: Entrance
      tl.fromTo(contentRef.current, 
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2 }
      );

      // Stage 2: Logo and Text pulse
      tl.fromTo(logoRef.current,
        { rotation: -10 },
        { rotation: 0, duration: 1.4, ease: 'elastic.out(1, 0.5)' },
        '-=0.8'
      );

      // Stage 3: Split text zoom exit reveal
      tl.to(contentRef.current, {
        scale: 1.1,
        opacity: 0,
        duration: 0.8,
        delay: 0.5,
        ease: 'power3.inOut'
      });

      // Stage 4: Screen clip path wipe upwards exit
      tl.to(containerRef.current, {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
        duration: 1.2,
        ease: 'power4.inOut'
      }, '-=0.2');

    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'var(--bg-color)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
      }}
    >
      <div
        ref={contentRef}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', transformOrigin: 'center center' }}
      >
        <img 
          ref={logoRef}
          src="/logo.avif" 
          alt="Brick Force Logo" 
          style={{ width: '120px', height: '120px', objectFit: 'contain' }}
        />
        
        <h1 
          ref={textRef}
          style={{ 
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '3.5rem',
            fontWeight: 600,
            color: 'var(--navy)',
            letterSpacing: '3px',
            margin: 0
          }}
        >
          BRICK <span style={{ color: 'var(--primary)', fontStyle: 'italic', fontWeight: 500 }}>FORCE</span>
        </h1>
      </div>
    </div>
  );
};

export default Preloader;
