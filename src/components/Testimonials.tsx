import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Plus, X, CheckCircle, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { getReviews, addReview } from '../utils/storage';
import type { Review } from '../utils/storage';
import { checkFormRateLimit, sanitizeText } from '../utils/security';

const Testimonials = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const [progress, setProgress] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [secError, setSecError] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    authorName: '',
    role: 'Candidate' as 'Candidate' | 'Client',
    rating: 5,
    content: ''
  });

  // Load reviews on mount and when modal opens/closes
  useEffect(() => {
    const allReviews = getReviews();
    const approved = allReviews.filter(r => r.isApproved);
    setReviews(approved);
  }, [isModalOpen]);

  // Adjust activeIndex if it exceeds reviews array bounds
  useEffect(() => {
    if (reviews.length > 0 && activeIndex >= reviews.length) {
      setActiveIndex(0);
    }
  }, [reviews, activeIndex]);

  // Autoplay functionality with integrated progress ticks
  useEffect(() => {
    if (reviews.length <= 1 || isHovered) return;
    const intervalTime = 50; // update progress every 50ms
    const step = (intervalTime / 5000) * 100; // progress step for 5000ms total

    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          setDirection(1);
          setActiveIndex((prev) => (prev + 1) % reviews.length);
          return 0;
        }
        return p + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [reviews, isHovered]);

  const handleNext = () => {
    if (reviews.length === 0) return;
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % reviews.length);
    setProgress(0);
  };

  const handlePrev = () => {
    if (reviews.length === 0) return;
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    setProgress(0);
  };

  const handleDotClick = (index: number) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
    setProgress(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSecError('');

    const rateCheck = checkFormRateLimit(5);
    if (!rateCheck.allowed) {
      setSecError(`Security Rate Limit: Please wait ${rateCheck.retryAfterSec} seconds before submitting another review.`);
      return;
    }

    if (!formData.authorName || !formData.content) {
      setSecError('Please fill out all required fields.');
      return;
    }
    
    addReview({
      ...formData,
      authorName: sanitizeText(formData.authorName),
      content: sanitizeText(formData.content)
    });
    setIsSubmitted(true);
    
    // Clear form
    setFormData({
      authorName: '',
      role: 'Candidate',
      rating: 5,
      content: ''
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsSubmitted(false);
  };

  // Helper to extract first and last initials from name
  const getInitials = (name: string) => {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Framer Motion slide-fade transition variants based on direction
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 120 : -120,
      opacity: 0,
      scale: 0.98
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring' as const, stiffness: 260, damping: 26 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 }
      }
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -120 : 120,
      opacity: 0,
      scale: 0.98,
      transition: {
        x: { type: 'spring' as const, stiffness: 260, damping: 26 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 }
      }
    })
  };

  return (
    <section id="testimonials" className="section" style={{ background: 'var(--surface-color)', position: 'relative', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '6rem 0' }}>
      
      {/* Testimonial styles containing animation keyframes, pulse effects, and media queries */}
      <style>{`
        @keyframes arrowPulse {
          0% {
            box-shadow: 0 0 0 0 rgba(197, 168, 128, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(197, 168, 128, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(197, 168, 128, 0);
          }
        }
        
        .testimonial-card-container {
          position: relative;
          max-width: 850px;
          margin: 0 auto;
        }

        .testimonial-card {
          background: var(--bg-color); 
          border: 1px solid var(--border-color); 
          padding: 3.5rem 3rem; 
          border-radius: 4px; 
          text-align: center;
          box-shadow: 0 20px 40px rgba(11,17,32,0.02);
          min-height: 290px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          z-index: 2;
        }

        .testimonial-card:hover {
          transform: translateY(-5px);
          border-color: rgba(197, 168, 128, 0.5);
          box-shadow: 0 30px 60px rgba(197, 168, 128, 0.08);
        }

        .testimonial-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(250, 249, 246, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid var(--border-color);
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--navy);
          box-shadow: 0 6px 20px rgba(11, 17, 32, 0.08);
          z-index: 10;
          transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
          animation: arrowPulse 2s infinite;
        }

        .testimonial-arrow-left {
          left: -70px;
        }

        .testimonial-arrow-right {
          right: -70px;
        }

        .testimonial-arrow:hover {
          background: var(--navy);
          color: var(--primary);
          border-color: var(--primary);
          transform: translateY(-50%) scale(1.1);
          box-shadow: 0 10px 25px rgba(197, 168, 128, 0.25);
          animation: none;
        }

        @media (max-width: 1024px) {
          .testimonial-arrow-left {
            left: 15px;
          }
          .testimonial-arrow-right {
            right: 15px;
          }
          .testimonial-arrow {
            background: rgba(250, 249, 246, 0.98);
            box-shadow: 0 4px 15px rgba(11, 17, 32, 0.15);
          }
        }

        @media (max-width: 768px) {
          .testimonial-card {
            padding: 3rem 1.5rem 5.5rem 1.5rem !important; /* spacing for navigation arrows inside card */
            min-height: 320px;
          }
          .testimonial-arrow {
            top: auto;
            bottom: 18px;
            transform: none;
          }
          .testimonial-arrow-left {
            left: 20px;
          }
          .testimonial-arrow-right {
            right: 20px;
          }
          .testimonial-arrow:hover {
            transform: scale(1.05);
          }
        }
      `}</style>

      {/* Blueprint Grid Lines Overlay */}
      <div className="architectural-grid" />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span className="section-subtitle">FEEDBACK & REVIEWS</span>
          <h2 className="section-title" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            What They Say <span style={{ fontStyle: 'italic', color: 'var(--primary)' }}>About Us</span>
          </h2>
          <div style={{ width: '60px', height: '2px', background: 'var(--primary)', margin: '1rem auto 0' }} />
        </div>

        {reviews.length > 0 ? (
          <div className="testimonial-card-container">
            
            {/* Glowing radial blur background for premium visual depth */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80%',
              height: '80%',
              background: 'radial-gradient(circle, rgba(197, 168, 128, 0.08) 0%, rgba(197, 168, 128, 0) 70%)',
              pointerEvents: 'none',
              zIndex: 0,
              filter: 'blur(30px)'
            }} />

            {/* Quote Icon Graphic with custom floating motion animation */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              style={{ position: 'absolute', top: '-40px', left: '-20px', opacity: 0.06, color: 'var(--primary)', pointerEvents: 'none', zIndex: 1 }}
            >
              <Quote size={130} />
            </motion.div>

            {/* Testimonial Card with progress indicator and hover control */}
            <div 
              className="testimonial-card"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <AnimatePresence mode="wait" custom={direction} initial={false}>
                <motion.div
                  key={activeIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', zIndex: 2 }}
                >
                  {/* Star Rating */}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.3rem', marginBottom: '1.2rem', color: 'var(--primary)' }}>
                    {Array.from({ length: reviews[activeIndex]?.rating || 5 }).map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>

                  {/* Review Message Text */}
                  <p style={{
                    fontSize: 'clamp(1.05rem, 2.5vw, 1.25rem)',
                    lineHeight: 1.8,
                    color: 'var(--navy)',
                    fontStyle: 'italic',
                    fontFamily: "'Cormorant Garamond', serif",
                    marginBottom: '1.8rem',
                    fontWeight: 500
                  }}>
                    "{reviews[activeIndex]?.content}"
                  </p>

                  {/* Styled Initials Avatar */}
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-hover) 100%)',
                    border: '1.5px solid var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.8rem',
                    boxShadow: '0 8px 20px rgba(11, 17, 32, 0.08)',
                    color: 'var(--primary)',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    letterSpacing: '1px'
                  }}>
                    {getInitials(reviews[activeIndex]?.authorName)}
                  </div>

                  {/* Author Name & Designation Role */}
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--navy)', margin: '0 0 0.2rem 0', letterSpacing: '0.5px' }}>
                      {reviews[activeIndex]?.authorName}
                    </h4>
                    <span style={{ 
                      fontSize: '0.68rem', 
                      fontWeight: 800, 
                      color: 'var(--primary)', 
                      letterSpacing: '1px', 
                      textTransform: 'uppercase',
                      background: 'rgba(197, 168, 128, 0.08)',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '2px',
                      border: '1px solid var(--border-color)',
                      display: 'inline-block'
                    }}>
                      {reviews[activeIndex]?.role}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Sleek Autoplay Progress Line at card bottom */}
              {reviews.length > 1 && (
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  height: '3px',
                  background: 'linear-gradient(to right, var(--primary), var(--primary-hover))',
                  width: `${progress}%`,
                  boxShadow: '0 0 8px var(--primary)',
                  transition: 'width 50ms linear',
                  zIndex: 5
                }} />
              )}
            </div>

            {/* Left/Right Arrow Navigation Buttons with pulsing halos */}
            {reviews.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="testimonial-arrow testimonial-arrow-left"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={handleNext}
                  className="testimonial-arrow testimonial-arrow-right"
                  aria-label="Next testimonial"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {/* Slider Dots Navigation indicators */}
            {reviews.length > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', marginTop: '2rem', zIndex: 5, position: 'relative' }}>
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleDotClick(i)}
                    style={{
                      width: activeIndex === i ? '24px' : '8px',
                      height: '8px',
                      borderRadius: '4px',
                      background: activeIndex === i ? 'var(--primary)' : 'var(--border-color)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem', border: '1px dashed var(--border-color)', maxWidth: '500px', margin: '0 auto' }}>
            <p style={{ color: 'var(--text-secondary)' }}>No client or candidate feedback has been approved yet.</p>
          </div>
        )}

        {/* CTA Button to trigger review creation modal */}
        <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-outline"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.9rem 2.2rem', fontSize: '0.8rem' }}
          >
            <Plus size={14} /> Write an Experience Review
          </button>
        </div>

      </div>

      {/* Review Submission Modal overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(11, 17, 32, 0.65)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              style={{
                background: 'var(--surface-color)',
                border: '1px solid var(--primary)',
                borderRadius: '2px',
                padding: '2.5rem 2rem',
                maxWidth: '500px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                position: 'relative',
                boxShadow: '0 30px 60px rgba(11, 17, 32, 0.3)',
                textAlign: 'left'
              }}
            >
              {/* Corner fine line accents */}
              <div style={{ position: 'absolute', top: 0, left: 0, width: '15px', height: '15px', borderTop: '2px solid var(--primary)', borderLeft: '2px solid var(--primary)' }} />
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: '15px', height: '15px', borderBottom: '2px solid var(--primary)', borderRight: '2px solid var(--primary)' }} />

              <button 
                onClick={handleCloseModal}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '5px'
                }}
              >
                <X size={20} />
              </button>

              {!isSubmitted ? (
                <>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '0.3rem' }}>
                    Share Your Story
                  </span>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', color: 'var(--navy)', fontWeight: 600, marginBottom: '1.5rem' }}>
                    Submit Testimonial
                  </h3>

                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 800, fontSize: '0.7rem', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--navy)' }}>Your Full Name *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="John Doe"
                        value={formData.authorName}
                        onChange={(e) => setFormData({...formData, authorName: e.target.value})}
                        style={{ 
                          width: '100%', 
                          padding: '0.8rem', 
                          borderRadius: '2px', 
                          border: '1px solid var(--border-color)', 
                          outline: 'none', 
                          background: 'var(--bg-color)',
                          color: 'var(--text-primary)',
                          fontSize: '0.9rem'
                        }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 800, fontSize: '0.7rem', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--navy)' }}>I am a... *</label>
                        <select
                          value={formData.role}
                          onChange={(e) => setFormData({...formData, role: e.target.value as 'Candidate' | 'Client'})}
                          style={{ 
                            width: '100%', 
                            padding: '0.8rem', 
                            borderRadius: '2px', 
                            border: '1px solid var(--border-color)', 
                            outline: 'none', 
                            background: 'var(--bg-color)',
                            color: 'var(--text-primary)',
                            fontSize: '0.9rem',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="Candidate">Candidate</option>
                          <option value="Client">Client / Partner</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 800, fontSize: '0.7rem', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--navy)' }}>Rating *</label>
                        <select
                          value={formData.rating}
                          onChange={(e) => setFormData({...formData, rating: Number(e.target.value)})}
                          style={{ 
                            width: '100%', 
                            padding: '0.8rem', 
                            borderRadius: '2px', 
                            border: '1px solid var(--border-color)', 
                            outline: 'none', 
                            background: 'var(--bg-color)',
                            color: 'var(--text-primary)',
                            fontSize: '0.9rem',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="5">★★★★★ (5 Stars)</option>
                          <option value="4">★★★★☆ (4 Stars)</option>
                          <option value="3">★★★☆☆ (3 Stars)</option>
                          <option value="2">★★☆☆☆ (2 Stars)</option>
                          <option value="1">★☆☆☆☆ (1 Star)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 800, fontSize: '0.7rem', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--navy)' }}>Review Message *</label>
                      <textarea 
                        rows={4} 
                        required
                        placeholder="Write your experience with Brick Force services..."
                        value={formData.content}
                        onChange={(e) => setFormData({...formData, content: e.target.value})}
                        style={{ 
                          width: '100%', 
                          padding: '0.8rem', 
                          borderRadius: '2px', 
                          border: '1px solid var(--border-color)', 
                          outline: 'none', 
                          background: 'var(--bg-color)',
                          color: 'var(--text-primary)',
                          fontSize: '0.9rem',
                          resize: 'none'
                        }}
                      ></textarea>
                    </div>

                    {secError && (
                      <p style={{ color: '#E15A5A', fontSize: '0.8rem', fontWeight: 600, margin: '0.2rem 0' }}>{secError}</p>
                    )}

                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      style={{ width: '100%', padding: '1rem', fontSize: '0.85rem', marginTop: '0.5rem' }}
                    >
                      Publish Feedback
                    </button>
                  </form>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                  <div style={{
                    display: 'inline-flex',
                    background: 'rgba(76, 175, 80, 0.08)',
                    color: '#4CAF50',
                    padding: '1.2rem',
                    borderRadius: '50%',
                    marginBottom: '1.8rem',
                    border: '1px solid rgba(76, 175, 80, 0.2)'
                  }}>
                    <CheckCircle size={44} />
                  </div>

                  <h3 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '2.2rem',
                    color: 'var(--navy)',
                    marginBottom: '1rem',
                    fontWeight: 500,
                    lineHeight: 1.2
                  }}>Review Received!</h3>

                  <p style={{
                    color: 'var(--text-secondary)',
                    lineHeight: 1.7,
                    fontSize: '0.95rem',
                    marginBottom: '2.5rem'
                  }}>
                    Thank you, your review was successfully submitted. For security reasons, it will be published to the website after client approval in the admin panel.
                  </p>

                  <button
                    onClick={handleCloseModal}
                    className="btn btn-primary"
                    style={{
                      width: '100%',
                      padding: '1.1rem',
                      fontSize: '0.85rem'
                    }}
                  >
                    Finish & Close
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Testimonials;
