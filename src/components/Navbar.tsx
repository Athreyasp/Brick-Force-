import { useState, useEffect } from 'react';
import { Menu, X, PhoneCall, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  useEffect(() => {
    // Reset mobile menu state on navigation
    setIsMobileMenuOpen(false);
    setExpandedMenus({});
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show navbar if we scrolled up, or if we are near the top
      if (currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    show: { 
      opacity: 1, 
      x: 0, 
      transition: { 
        type: 'spring' as const, 
        stiffness: 260, 
        damping: 20 
      } 
    }
  };

  const navLinks = [
    { name: 'HOME', href: '/' },
    { 
      name: 'ABOUT US', 
      href: '/about-us',
      subLinks: [
        { name: 'Company Profile', href: '/about-us' },
        { name: 'Core Values', href: '/about-us/core-values' },
        { name: 'Quality', href: '/about-us/quality' },
        { name: 'Board of Directors', href: '/about-us/board-of-directors' },
        { name: 'Clients & Recognition', href: '/about-us/clients-recognition' }
      ]
    },
    { 
      name: 'SOLUTIONS', 
      href: '/solutions-services',
      subLinks: [
        { name: 'Overview', href: '/solutions-services' },
        { name: 'Human Resources', href: '/solutions-services/human-resource' },
        { name: 'Skills & Leadership', href: '/solutions-services/skills-leadership' }
      ]
    },
    { name: 'CAREERS', href: '/my-career' },
    { name: 'CONTACT', href: '/connect-with-us' }
  ];

  return (
    <>
      <div style={{
        position: 'fixed',
        top: '12px',
        left: 0,
        right: 0,
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
        padding: '0 20px',
        transform: isVisible ? 'translateY(0)' : 'translateY(-100px)',
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        <motion.nav 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="navbar-main"
          style={{
            background: 'rgba(250, 249, 246, 0.9)', // Beautiful warm translucent alabaster
            backdropFilter: 'blur(24px)',
            borderRadius: '12px', // Premium soft architectural curves
            padding: '0.6rem 2.2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1.8rem',
            boxShadow: '0 20px 50px rgba(11,17,32,0.08), 0 0 0 1px rgba(197,168,128,0.15)',
            border: 'none',
            maxWidth: '1300px',
            width: '95%',
            justifyContent: 'space-between',
            transition: 'all 0.3s ease'
          }}
        >
          {/* Logo Section */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <img 
              src="/logo.avif" 
              alt="Brick Force Logo" 
              style={{ width: '36px', height: '36px', objectFit: 'contain' }}
            />
            <span style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '1.5px', color: 'var(--navy)', textTransform: 'uppercase' }}>
              BRICK FORCE
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="desktop-nav" style={{ display: 'none' }}>
            <ul className="desktop-nav-list" style={{ display: 'flex', gap: '1.5rem', listStyle: 'none', margin: 0, padding: 0, alignItems: 'center' }}>
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href || (link.subLinks?.some(sub => location.pathname === sub.href));
                return (
                  <li 
                    key={link.name} 
                    style={{ position: 'relative', padding: '0.2rem 0' }}
                    onMouseEnter={() => {
                      setHoveredLink(link.name);
                      if (link.subLinks) setActiveDropdown(link.name);
                    }}
                    onMouseLeave={() => {
                      setHoveredLink(null);
                      setActiveDropdown(null);
                    }}
                  >
                    <AnimatePresence>
                      {hoveredLink === link.name && (
                        <motion.div
                          layoutId="navHoverHighlight"
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(197, 168, 128, 0.08)',
                            borderRadius: '6px',
                            border: '1px solid rgba(197, 168, 128, 0.15)',
                            zIndex: -1,
                          }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </AnimatePresence>

                    <motion.div whileTap={{ scale: 0.98 }} style={{ position: 'relative', zIndex: 1 }}>
                      <Link 
                        to={link.href} 
                        style={{ 
                          fontWeight: 700, 
                          fontSize: '0.78rem',
                          letterSpacing: '1.2px',
                          color: isActive ? 'var(--primary)' : 'var(--navy)',
                          padding: '0.5rem 0.9rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          textDecoration: 'none',
                          transition: 'color 0.2s ease',
                          whiteSpace: 'nowrap'
                        }} 
                      >
                        {link.name}
                        {link.subLinks && (
                          <ChevronDown 
                            size={12} 
                            style={{ 
                              transform: activeDropdown === link.name ? 'rotate(180deg)' : 'rotate(0)', 
                              transition: 'transform 0.2s', 
                              color: isActive ? 'var(--primary)' : 'var(--primary-hover)' 
                            }} 
                          />
                        )}
                      </Link>
                    </motion.div>

                    {isActive && !hoveredLink && (
                      <motion.div 
                        layoutId="activeUnderline"
                        style={{
                          position: 'absolute',
                          bottom: '0px',
                          left: '0.9rem',
                          right: '0.9rem',
                          height: '2px',
                          background: 'var(--primary)',
                          borderRadius: '1px'
                        }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      />
                    )}

                    <AnimatePresence>
                      {link.subLinks && activeDropdown === link.name && (
                        <motion.div
                          initial={{ opacity: 0, y: 15, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 15, scale: 0.95 }}
                          transition={{ duration: 0.2, ease: 'easeOut' }}
                          style={{
                            position: 'absolute',
                            top: '100%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            background: 'rgba(250, 249, 246, 0.98)',
                            backdropFilter: 'blur(20px)',
                            boxShadow: '0 20px 45px rgba(11,17,32,0.12), 0 0 0 1px rgba(197,168,128,0.15)',
                            borderRadius: '8px',
                            borderTop: '3px solid var(--primary)',
                            padding: '0.8rem 0',
                            minWidth: '240px',
                            zIndex: 1001,
                            marginTop: '12px'
                          }}
                        >
                          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {link.subLinks.map(sub => (
                              <li key={sub.name}>
                                <Link
                                  to={sub.href}
                                  className="sub-link-item"
                                >
                                  <span>{sub.name}</span>
                                  <span 
                                    className="dropdown-arrow"
                                    style={{ 
                                      opacity: 0, 
                                      fontSize: '0.7rem', 
                                      color: 'var(--primary)', 
                                      transform: 'translateX(-5px)', 
                                      transition: 'all 0.2s ease' 
                                    }}
                                  >
                                    →
                                  </span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contact Button */}
          <div className="desktop-nav" style={{ display: 'none' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ position: 'relative', display: 'flex', height: '8px', width: '8px' }}>
                        <span className="ping-dot" style={{
                          animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
                          position: 'absolute',
                          height: '100%',
                          width: '100%',
                          borderRadius: '9999px',
                          backgroundColor: 'var(--primary)',
                          opacity: 0.75
                        }} />
                        <span style={{
                          position: 'relative',
                          borderRadius: '9999px',
                          height: '8px',
                          width: '8px',
                          backgroundColor: 'var(--primary)'
                        }} />
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--navy)', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                        <PhoneCall size={12} color="var(--primary)" />
                        <span>+91 97691 14460</span>
                      </div>
                  </div>
                  <Link 
                    to="/connect-with-us" 
                    className="btn-hire"
                    style={{ 
                      padding: '0.55rem 1.4rem', 
                      fontSize: '0.75rem', 
                      fontWeight: 800,
                      letterSpacing: '1px',
                      borderRadius: '6px',
                      background: 'var(--navy)',
                      border: '1px solid var(--primary)',
                      color: '#fff',
                      textDecoration: 'none',
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      boxShadow: '0 4px 15px rgba(11,17,32,0.1)'
                    }}
                  >
                    HIRE US
                  </Link>
             </div>
          </div>

          <button 
            className="mobile-toggle"
            style={{ display: 'none', background: 'transparent', color: 'var(--navy)', border: 'none', cursor: 'pointer' }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </motion.nav>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mobile-menu-overlay"
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(11, 17, 32, 0.65)',
                backdropFilter: 'blur(8px)',
                zIndex: 1050
              }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Premium Slide-out Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: '320px',
                maxWidth: '85vw',
                background: 'var(--navy)',
                color: '#FAF9F6',
                zIndex: 1100,
                boxShadow: '-15px 0 45px rgba(11,17,32,0.3)',
                borderLeft: '1px solid rgba(197, 168, 128, 0.15)',
                padding: '2.5rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto'
              }}
            >
              {/* Close Button Row */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2.5rem' }}>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  style={{ background: 'none', border: 'none', color: '#FAF9F6', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                >
                  <X size={28} />
                </button>
              </div>

              {/* Navigation Links with stagger motion */}
              <motion.ul 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
              >
                {navLinks.map(link => {
                  const hasSubLinks = !!link.subLinks;
                  const isExpanded = !!expandedMenus[link.name];

                  return (
                    <motion.li 
                      variants={itemVariants}
                      key={link.name} 
                      style={{ display: 'flex', flexDirection: 'column' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <Link 
                          to={link.href} 
                          style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '1px', color: '#FAF9F6', textDecoration: 'none' }}
                          onClick={(e) => {
                            if (hasSubLinks) {
                              e.preventDefault();
                              setExpandedMenus(prev => ({ ...prev, [link.name]: !prev[link.name] }));
                            } else {
                              setIsMobileMenuOpen(false);
                            }
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                          onMouseLeave={(e) => e.currentTarget.style.color = '#FAF9F6'}
                        >
                          {link.name}
                        </Link>
                        {hasSubLinks && (
                          <button
                            onClick={() => setExpandedMenus(prev => ({ ...prev, [link.name]: !prev[link.name] }))}
                            style={{ 
                              background: 'none', 
                              border: 'none', 
                              color: 'var(--primary)', 
                              cursor: 'pointer', 
                              padding: '0.4rem', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center' 
                            }}
                          >
                            <ChevronDown size={18} style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                          </button>
                        )}
                      </div>

                      {/* Expandable Submenu */}
                      {hasSubLinks && isExpanded && (
                        <ul style={{ 
                          listStyle: 'none', 
                          paddingLeft: '1.2rem', 
                          marginTop: '0.8rem', 
                          display: 'flex', 
                          flexDirection: 'column', 
                          gap: '0.9rem', 
                          borderLeft: '1px solid rgba(197, 168, 128, 0.15)',
                          marginBottom: '0.5rem' 
                        }}>
                          {link.subLinks.map(sub => (
                            <li key={sub.name}>
                              <Link
                                  to={sub.href}
                                  style={{ 
                                    fontSize: '0.88rem', 
                                    fontWeight: 700, 
                                    color: 'rgba(250, 249, 246, 0.7)', 
                                    textDecoration: 'none', 
                                    letterSpacing: '0.5px',
                                    transition: 'color 0.2s'
                                  }}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(250, 249, 246, 0.7)'}
                              >
                                {sub.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </motion.li>
                  );
                })}
              </motion.ul>

              {/* Mobile Drawer Bottom Call-to-action */}
              <div style={{ marginTop: 'auto', paddingTop: '3rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', borderTop: '1px solid rgba(197, 168, 128, 0.15)', paddingTop: '2rem' }}>
                  <p style={{ color: 'rgba(250, 249, 246, 0.55)', fontSize: '0.75rem', lineHeight: '1.6', letterSpacing: '0.5px', margin: 0 }}>
                    BRICK FORCE CONSULTING<br />
                    Executive Search & HR Solutions
                  </p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#FAF9F6', fontSize: '0.82rem', fontWeight: 800, letterSpacing: '0.3px', whiteSpace: 'nowrap' }}>
                    <PhoneCall size={12} color="var(--primary)" />
                    <span>+91 97691 14460</span>
                  </div>
                  <Link 
                    to="/connect-with-us" 
                    style={{ 
                      padding: '0.8rem', 
                      fontSize: '0.8rem', 
                      fontWeight: 800,
                      letterSpacing: '1px',
                      textAlign: 'center',
                      background: 'transparent',
                      border: '1px solid var(--primary)',
                      color: '#FAF9F6',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--primary)';
                      e.currentTarget.style.color = 'var(--navy)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#FAF9F6';
                    }}
                  >
                    HIRE US
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .sub-link-item {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          padding: 0.7rem 1.6rem !important;
          font-size: 0.82rem !important;
          font-weight: 700 !important;
          letter-spacing: 0.8px !important;
          color: var(--navy) !important;
          text-decoration: none !important;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .sub-link-item:hover {
          background: rgba(197, 168, 128, 0.06) !important;
          color: var(--primary) !important;
          padding-left: 1.8rem !important;
        }
        .sub-link-item:hover .dropdown-arrow {
          opacity: 1 !important;
          transform: translateX(0) !important;
        }
        .btn-hire:hover {
          background: var(--primary) !important;
          color: var(--navy) !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 6px 20px rgba(197, 168, 128, 0.25) !important;
        }
        @media (min-width: 992px) {
          .desktop-nav { display: block !important; }
          .mobile-toggle { display: none !important; }
        }
        @media (min-width: 992px) and (max-width: 1200px) {
          .navbar-main {
            gap: 1.5rem !important;
            padding: 0.9rem 1.5rem !important;
          }
          .desktop-nav-list {
            gap: 1.25rem !important;
          }
        }
        @media (max-width: 991px) {
          .mobile-toggle { display: block !important; }
        }
        @media (max-width: 768px) {
          .navbar-main {
            padding: 0.8rem 1.25rem !important;
            gap: 1.5rem !important;
            width: 92% !important;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;
