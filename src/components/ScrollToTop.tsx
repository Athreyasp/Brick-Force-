import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Show button when page is scrolled down 400px
  const toggleVisibility = () => {
    if (window.scrollY > 400) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ duration: 0.3 }}
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '40px',
            right: '40px',
            zIndex: 999,
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'var(--primary)',
            color: 'var(--navy)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(197, 168, 128, 0.4)',
            transition: 'background 0.3s ease, color 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--navy)';
            e.currentTarget.style.color = 'var(--primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--primary)';
            e.currentTarget.style.color = 'var(--navy)';
          }}
          aria-label="Scroll to top"
        >
          <ArrowUp size={24} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
