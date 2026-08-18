import { useState, useEffect } from 'react';
import { Briefcase, ArrowRight, FileText, Search, X, CheckCircle, User, Mail, Phone, Upload, Loader2, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getJobs, addApplicant } from '../utils/storage';
import { validateUploadedFile, checkFormRateLimit, validateEmail, validatePhone, sanitizeText } from '../utils/security';

const OpenPositions = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formError, setFormError] = useState<string>('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: ''
  });

  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    setJobs(getJobs());
  }, [isApplyModalOpen]);

  const handleOpenApply = (jobTitle: string) => {
    setSelectedJob(jobTitle);
    setIsApplyModalOpen(true);
    setIsSubmitted(false);
    setSelectedFile(null);
    setFormError('');
    setFormData({ fullName: '', email: '', phone: '', message: '' });
  };

  const handleCloseApply = () => {
    setIsApplyModalOpen(false);
    setSelectedFile(null);
    setFormError('');
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      message: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const validation = validateUploadedFile(file);
      if (!validation.valid) {
        setFormError(validation.error || 'Invalid file uploaded.');
        setSelectedFile(null);
      } else {
        setFormError('');
        setSelectedFile(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validation = validateUploadedFile(file);
      if (!validation.valid) {
        setFormError(validation.error || 'Invalid file uploaded.');
        setSelectedFile(null);
      } else {
        setFormError('');
        setSelectedFile(file);
      }
    }
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Rate limiting check
    const rateCheck = checkFormRateLimit(5);
    if (!rateCheck.allowed) {
      setFormError(`Security Rate Limit Active: Too many requests. Please wait ${rateCheck.retryAfterSec} seconds before submitting again.`);
      return;
    }

    if (!formData.fullName || !formData.email || !formData.phone || !selectedFile) {
      setFormError("Please fill in all required fields and upload your resume.");
      return;
    }

    if (!validateEmail(formData.email)) {
      setFormError("Security Error: Please provide a valid email address.");
      return;
    }

    if (!validatePhone(formData.phone)) {
      setFormError("Security Error: Please provide a valid phone number.");
      return;
    }

    const fileCheck = validateUploadedFile(selectedFile);
    if (!fileCheck.valid) {
      setFormError(fileCheck.error || "File security check failed.");
      return;
    }
    
    setIsParsing(true);
    
    setTimeout(() => {
      addApplicant({
        jobTitle: selectedJob,
        fullName: sanitizeText(formData.fullName),
        email: sanitizeText(formData.email),
        phone: sanitizeText(formData.phone),
        resumeName: fileCheck.safeName || selectedFile.name,
        resumeSize: `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`,
        message: sanitizeText(formData.message),
        adminNotes: ''
      });
      setIsParsing(false);
      setIsSubmitted(true);
    }, 1500);
  };

  // Filter logic
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          job.skills.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ background: 'var(--bg-color)', minHeight: '100vh', paddingTop: '150px', paddingBottom: '8rem', overflow: 'hidden', position: 'relative' }}>
      {/* Blueprint Grid Lines Overlay */}
      <div className="architectural-grid" />

      {/* Decorative vertical blueprint line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '15%',
        width: '1px',
        height: '100%',
        background: 'linear-gradient(to bottom, rgba(197, 168, 128, 0.08) 0%, rgba(197, 168, 128, 0.01) 100%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        
        {/* Page Title */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span className="section-subtitle">MY CAREER</span>
          <h1 style={{ 
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(2.8rem, 6vw, 4.2rem)',
            fontWeight: 500,
            lineHeight: 1.1,
            color: 'var(--navy)',
            margin: '0.5rem 0'
          }}>
            Open <span style={{ fontStyle: 'italic', color: 'var(--primary)' }}>Positions</span>
          </h1>
          <div style={{ width: '80px', height: '2px', background: 'var(--primary)', margin: '1.5rem auto 0' }} />
          <p style={{ color: 'var(--text-secondary)', maxWidth: '750px', margin: '2rem auto 0', fontSize: '1.05rem', lineHeight: 1.75 }}>
            Join our dynamic team! Explore our current openings below. If you find a role matching your skill set, use our Quick Apply tool to submit your profile.
          </p>
        </div>

        {/* Filter Controls */}
        <div style={{
          background: 'var(--surface-color)',
          border: '1px solid var(--border-color)',
          borderRadius: '2px',
          padding: '2rem',
          marginBottom: '3rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          boxShadow: '0 10px 30px rgba(11, 17, 32, 0.02)'
        }}>
          {/* Search bar */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={18} color="var(--primary)" style={{ position: 'absolute', left: '1.2rem' }} />
            <input 
              type="text"
              placeholder="Search by role or key skills (e.g. React, Casting)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.9rem 1.2rem 0.9rem 3rem',
                borderRadius: '2px',
                border: '1px solid var(--border-color)',
                outline: 'none',
                background: 'var(--bg-color)',
                color: 'var(--text-primary)',
                fontSize: '0.95rem',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '1.2rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--navy)', letterSpacing: '1px', textTransform: 'uppercase', marginRight: '0.5rem' }}>Department:</span>
            {['All', 'Engineering', 'IT'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={{
                  padding: '0.5rem 1.5rem',
                  borderRadius: '2px',
                  border: '1px solid',
                  borderColor: selectedCategory === category ? 'var(--primary)' : 'var(--border-color)',
                  background: selectedCategory === category ? 'var(--navy)' : 'transparent',
                  color: selectedCategory === category ? '#fff' : 'var(--text-secondary)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)'
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Jobs Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(400px, 100%), 1fr))', 
          gap: '2.5rem' 
        }}>
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                style={{
                  background: 'var(--surface-color)',
                  borderRadius: '2px',
                  padding: 'var(--card-padding-md)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  transition: 'all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(11,17,32,0.04)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Corner Line */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '12px', height: '12px', borderTop: '2px solid var(--primary)', borderLeft: '2px solid var(--primary)' }} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div style={{ background: 'rgba(197,168,128,0.08)', padding: '0.8rem', borderRadius: '2px', border: '1px solid var(--border-color)', color: 'var(--primary)' }}>
                    <Briefcase size={22} />
                  </div>
                  <span style={{ 
                    border: '1px solid var(--border-color)', 
                    padding: '0.4rem 1rem', 
                    borderRadius: '2px', 
                    fontSize: '0.75rem', 
                    fontWeight: 800, 
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    color: 'var(--navy)',
                    background: 'var(--bg-color)'
                  }}>
                    {job.type}
                  </span>
                </div>
                
                <h3 style={{ 
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1.8rem', 
                  fontWeight: 600, 
                  color: 'var(--navy)', 
                  marginBottom: '0.5rem' 
                }}>
                  {job.title}
                </h3>
                
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.92rem', fontWeight: 600 }}>
                  <span style={{ width: '6px', height: '6px', background: 'var(--primary)', borderRadius: '50%', display: 'inline-block' }} />
                  {job.location}
                </p>

                {/* Meta Badges Grid */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '2.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Experience required:</span>
                    <span style={{ color: 'var(--navy)', fontWeight: 800 }}>{job.experience}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.82rem' }}>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Core skills:</span>
                    <span style={{ color: 'var(--navy)', fontWeight: 800, letterSpacing: '0.3px' }}>{job.skills}</span>
                  </div>
                </div>
   
                <div style={{ marginTop: 'auto', display: 'flex', gap: '1rem' }}>
                  <button 
                    onClick={() => handleOpenApply(job.title)}
                    className="btn btn-primary" 
                    style={{ flex: 1, padding: '0.9rem', fontSize: '0.8rem' }}
                  >
                    Apply Now <ArrowRight size={14} />
                  </button>
                  {job.viewLink !== '#' && (
                    <a 
                      href={job.viewLink} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline" 
                      style={{ padding: '0.9rem', width: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      title="View Description"
                    >
                      <FileText size={16} />
                    </a>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', border: '1px dashed var(--border-color)' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>No open positions match your search or filter.</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                style={{
                  marginTop: '1rem',
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary)',
                  fontWeight: 800,
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
 
        {/* Spontaneous Application */}
        <div style={{ 
          marginTop: '5rem', 
          textAlign: 'center', 
          padding: 'var(--card-padding-lg)', 
          background: 'var(--surface-color)', 
          borderRadius: '2px', 
          border: '1px dashed var(--primary)',
          position: 'relative'
        }}>
          <h3 style={{ 
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '2rem', 
            fontWeight: 600, 
            marginBottom: '1rem', 
            color: 'var(--navy)' 
          }}>Don't see a fit?</h3>
          
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.02rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
            Send us your resume anyway and we'll keep you in mind for future roles.
          </p>
          
          <button 
            onClick={() => handleOpenApply("Spontaneous Application (General)")}
            className="btn btn-outline" 
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2.5rem' }}
          >
            Submit Resume <ArrowRight size={14} />
          </button>
        </div>

      </div>

      {/* Slide-in Quick Apply Modal */}
      <AnimatePresence>
        {isApplyModalOpen && (
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
                padding: '3rem 2.5rem',
                maxWidth: '550px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                position: 'relative',
                boxShadow: '0 30px 60px rgba(11, 17, 32, 0.3)',
                textAlign: 'left'
              }}
            >
              {/* Corner fine line accent */}
              <div style={{ position: 'absolute', top: 0, left: 0, width: '15px', height: '15px', borderTop: '2px solid var(--primary)', borderLeft: '2px solid var(--primary)' }} />
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: '15px', height: '15px', borderBottom: '2px solid var(--primary)', borderRight: '2px solid var(--primary)' }} />
              
              <button 
                onClick={handleCloseApply}
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
                aria-label="Close apply modal"
              >
                <X size={20} />
              </button>

               {!isSubmitted ? (
                isParsing ? (
                  <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                      style={{ display: 'inline-block', marginBottom: '1.8rem', color: 'var(--primary)' }}
                    >
                      <Loader2 size={44} />
                    </motion.div>
                    <h3 style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: '2.2rem',
                      color: 'var(--navy)',
                      marginBottom: '0.8rem',
                      fontWeight: 500
                    }}>Analyzing Resume...</h3>
                    <p style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.95rem',
                      lineHeight: 1.6,
                      maxWidth: '350px',
                      margin: '0 auto'
                    }}>
                      Our ATS scoring engine is scanning your CV keywords, mapping skill qualifications, and grading suitability.
                    </p>
                  </div>
                ) : (
                  <>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: 800, 
                      color: 'var(--primary)', 
                      letterSpacing: '2px', 
                      textTransform: 'uppercase',
                      display: 'block',
                      marginBottom: '0.5rem'
                    }}>Quick Application</span>
                    
                    <h3 style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: '2rem',
                      color: 'var(--navy)',
                      marginBottom: '1.8rem',
                      fontWeight: 600,
                      lineHeight: 1.2
                    }}>Applying for: <span style={{ fontStyle: 'italic', color: 'var(--primary)' }}>{selectedJob}</span></h3>

                    {formError && (
                      <div style={{
                        background: '#FEF2F2',
                        border: '1px solid #FCA5A5',
                        borderRadius: '4px',
                        padding: '0.8rem 1rem',
                        marginBottom: '1rem',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.6rem',
                        color: '#991B1B',
                        fontSize: '0.85rem'
                      }}>
                        <ShieldAlert size={18} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div>{formError}</div>
                      </div>
                    )}

                    <form onSubmit={handleApplySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                      
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 800, fontSize: '0.7rem', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--navy)' }}>Full Name *</label>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                          <User size={16} color="var(--primary)" style={{ position: 'absolute', left: '1rem' }} />
                          <input 
                            type="text" 
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            placeholder="John Doe" 
                            style={{ 
                              width: '100%', 
                              padding: '0.8rem 1rem 0.8rem 2.8rem', 
                              borderRadius: '2px', 
                              border: '1px solid var(--border-color)', 
                              outline: 'none', 
                              background: 'var(--bg-color)',
                              color: 'var(--text-primary)',
                              fontSize: '0.9rem',
                              transition: 'border-color 0.3s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 800, fontSize: '0.7rem', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--navy)' }}>Email Address *</label>
                          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <Mail size={16} color="var(--primary)" style={{ position: 'absolute', left: '1rem' }} />
                            <input 
                              type="email" 
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              placeholder="john@example.com" 
                              style={{ 
                                width: '100%', 
                                padding: '0.8rem 1rem 0.8rem 2.8rem', 
                                borderRadius: '2px', 
                                border: '1px solid var(--border-color)', 
                                outline: 'none', 
                                background: 'var(--bg-color)',
                                color: 'var(--text-primary)',
                                fontSize: '0.9rem',
                                transition: 'border-color 0.3s'
                              }}
                              onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                              onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                            />
                          </div>
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 800, fontSize: '0.7rem', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--navy)' }}>Phone Number *</label>
                          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <Phone size={16} color="var(--primary)" style={{ position: 'absolute', left: '1rem' }} />
                            <input 
                              type="tel" 
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              required
                              placeholder="+91 XXXXX XXXXX" 
                              style={{ 
                                width: '100%', 
                                padding: '0.8rem 1rem 0.8rem 2.8rem', 
                                borderRadius: '2px', 
                                border: '1px solid var(--border-color)', 
                                outline: 'none', 
                                background: 'var(--bg-color)',
                                color: 'var(--text-primary)',
                                fontSize: '0.9rem',
                                transition: 'border-color 0.3s'
                              }}
                              onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                              onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 800, fontSize: '0.7rem', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--navy)' }}>Upload Resume (PDF / Word) *</label>
                        <div 
                          onDragEnter={handleDrag}
                          onDragOver={handleDrag}
                          onDragLeave={handleDrag}
                          onDrop={handleDrop}
                          style={{
                            border: `2px dashed ${dragActive ? 'var(--primary)' : 'var(--border-color)'}`,
                            borderRadius: '2px',
                            padding: '2rem 1.2rem',
                            textAlign: 'center',
                            background: dragActive ? 'rgba(197, 168, 128, 0.04)' : 'var(--bg-color)',
                            cursor: 'pointer',
                            position: 'relative',
                            transition: 'all 0.3s'
                          }}
                        >
                          <input 
                            type="file"
                            accept=".pdf,.docx,.doc"
                            onChange={handleFileChange}
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              opacity: 0,
                              cursor: 'pointer'
                            }}
                          />
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
                            <Upload size={22} color="var(--primary)" />
                            {selectedFile ? (
                              <div>
                                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)' }}>{selectedFile.name}</span>
                                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block', marginTop: '0.1rem' }}>
                                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Click or drag to replace
                                </span>
                              </div>
                            ) : (
                              <div>
                                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy)' }}>Drag & drop your resume file here</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginTop: '0.2rem' }}>
                                  Supports PDF, DOCX (Max 5MB)
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 800, fontSize: '0.7rem', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--navy)' }}>Brief Cover Message (Optional)</label>
                        <textarea 
                          rows={3} 
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Tell us why you are a great fit..." 
                          style={{ 
                            width: '100%', 
                            padding: '0.8rem 1.2rem', 
                            borderRadius: '2px', 
                            border: '1px solid var(--border-color)', 
                            outline: 'none', 
                            background: 'var(--bg-color)',
                            color: 'var(--text-primary)',
                            fontSize: '0.9rem',
                            resize: 'vertical',
                            transition: 'border-color 0.3s'
                          }}
                          onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                          onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                        ></textarea>
                      </div>

                      <button 
                        type="submit"
                        className="btn btn-primary" 
                        style={{ 
                          width: '100%', 
                          padding: '1rem', 
                          fontSize: '0.85rem',
                          marginTop: '1rem'
                        }}
                      >
                        Submit Application & Scan Profile <ArrowRight size={14} />
                      </button>
                    </form>
                  </>
                )
              ) : (
                <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                  <div style={{
                    display: 'inline-flex',
                    background: 'rgba(197, 168, 128, 0.1)',
                    color: 'var(--primary)',
                    padding: '1.2rem',
                    borderRadius: '50%',
                    marginBottom: '1.8rem',
                    border: '1px solid var(--border-color)'
                  }}>
                    <CheckCircle size={44} />
                  </div>

                  <h3 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '2.4rem',
                    color: 'var(--navy)',
                    marginBottom: '1rem',
                    fontWeight: 500,
                    lineHeight: 1.2
                  }}>Application Sent!</h3>

                  <p style={{
                    color: 'var(--text-secondary)',
                    lineHeight: 1.7,
                    fontSize: '1rem',
                    marginBottom: '2.5rem'
                  }}>
                    Thank you for applying for the <strong>{selectedJob}</strong> position. Our recruiting team will review your CV and contact you shortly if your skills match our requirements.
                  </p>

                  <button
                    onClick={handleCloseApply}
                    className="btn btn-primary"
                    style={{
                      width: '100%',
                      padding: '1.1rem',
                      fontSize: '0.85rem',
                      letterSpacing: '1px'
                    }}
                  >
                    Close & Return
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OpenPositions;
