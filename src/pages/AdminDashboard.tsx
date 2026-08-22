import { useState, useEffect, useMemo } from 'react';
import {
  Plus, Edit, Trash2, Download, User,
  Search, Lock, LogOut, X, ClipboardList,
  ShieldCheck, AlertTriangle, Layers, Briefcase,
  Compass, ExternalLink, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { api } from '../services/api';
import type { Job, Applicant, Review } from '../utils/storage';
import type { SecurityLog } from '../utils/security';

const BRICKFORCE_ADMIN_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

  /* Strictly scoped to Admin Portal only */
  .admin-dashboard-root {
    --bf-bg: #FAF9F6;
    --bf-surface: #FFFFFF;
    --bf-surface-cream: #F6F4EE;
    --bf-surface-hover: #ECE9DE;
    --bf-gold: #C5A880;
    --bf-gold-hover: #A38A6F;
    --bf-navy: #0B1120;
    --bf-navy-hover: #151E33;
    --bf-text-primary: #0F1523;
    --bf-text-secondary: #555C6A;
    --bf-border: rgba(197, 168, 128, 0.25);
    --bf-border-dark: rgba(11, 17, 32, 0.1);
    --bf-emerald: #059669;
    --bf-crimson: #DC2626;

    background-color: var(--bf-bg) !important;
    color: var(--bf-text-primary) !important;
    min-height: 100vh;
    font-family: 'Outfit', sans-serif;
    position: relative;
    overflow-x: hidden;
  }

  .admin-dashboard-root ::-webkit-scrollbar { width: 6px; height: 6px; }
  .admin-dashboard-root ::-webkit-scrollbar-track { background: var(--bf-surface-cream); }
  .admin-dashboard-root ::-webkit-scrollbar-thumb { background: var(--bf-gold); border-radius: 4px; }
  .admin-dashboard-root ::-webkit-scrollbar-thumb:hover { background: var(--bf-gold-hover); }

  /* Architectural Gridlines matching website */
  .admin-dashboard-root .architectural-grid {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      linear-gradient(to right, rgba(197, 168, 128, 0.06) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(197, 168, 128, 0.06) 1px, transparent 1px);
    background-size: 80px 80px;
    pointer-events: none;
    z-index: 0;
  }

  /* Admin Header Bar matching website styling */
  .admin-top-bar {
    background: rgba(250, 249, 246, 0.98);
    border-bottom: 1px solid var(--bf-border);
    backdrop-filter: blur(12px);
    padding: 1rem 2.5rem;
    display: flex;
    justifyContent: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  /* Typography */
  .font-cormorant {
    font-family: 'Cormorant Garamond', Georgia, serif;
  }

  /* Executive Cards */
  .bf-admin-card {
    background: var(--bf-surface);
    border: 1px solid var(--bf-border);
    border-radius: 12px;
    padding: 1.5rem;
    position: relative;
    box-shadow: 0 4px 20px -4px rgba(197, 168, 128, 0.08);
    transition: all 0.25s ease;
  }
  .bf-admin-card:hover {
    border-color: var(--bf-gold);
    transform: translateY(-2px);
    box-shadow: 0 8px 30px -4px rgba(197, 168, 128, 0.18);
  }

  /* Numbered Deck KPI */
  .bf-kpi-code {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.68rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--bf-gold-hover);
  }

  .bf-kpi-number {
    font-family: 'Cormorant Garamond', serif;
    font-size: 3rem;
    font-weight: 600;
    line-height: 1;
    color: var(--bf-navy);
    margin: 0.4rem 0 0.2rem;
  }

  /* Navigation Item */
  .bf-nav-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 0.75rem 1rem;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--bf-text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
  }
  .bf-nav-btn:hover {
    background: var(--bf-surface-cream);
    color: var(--bf-navy);
  }
  .bf-nav-btn.active {
    background: var(--bf-surface-cream);
    border-color: var(--bf-border);
    color: var(--bf-navy);
    border-left: 3px solid var(--bf-gold);
    font-weight: 700;
  }

  /* Table styling */
  .bf-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    text-align: left;
    background: #FFFFFF;
    border: 1px solid var(--bf-border);
    border-radius: 10px;
    overflow: hidden;
  }
  .bf-table th {
    padding: 0.9rem 1.25rem;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--bf-text-secondary);
    background: var(--bf-surface-cream);
    border-bottom: 1px solid var(--bf-border);
  }
  .bf-table td {
    padding: 1.1rem 1.25rem;
    font-size: 0.88rem;
    border-bottom: 1px solid rgba(197, 168, 128, 0.15);
    color: var(--bf-text-primary);
    vertical-align: middle;
  }
  .bf-table tbody tr:hover {
    background: #FAF9F6;
  }

  /* Buttons */
  .bf-btn-navy {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--bf-navy);
    color: #FFFFFF;
    border: 1px solid transparent;
    padding: 0.65rem 1.25rem;
    border-radius: 6px;
    font-size: 0.82rem;
    font-weight: 600;
    letter-spacing: 0.5px;
    cursor: pointer;
    transition: all 0.25s ease;
  }
  .bf-btn-navy:hover {
    background: var(--bf-navy-hover);
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(11, 17, 32, 0.2);
  }

  .bf-btn-gold {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--bf-primary);
    color: var(--bf-navy);
    border: 1px solid var(--bf-gold);
    padding: 0.65rem 1.25rem;
    border-radius: 6px;
    font-size: 0.82rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.25s ease;
  }
  .bf-btn-gold:hover {
    background: var(--bf-gold-hover);
    color: #FFFFFF;
  }

  .bf-btn-outline {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: transparent;
    color: var(--bf-text-primary);
    border: 1px solid var(--bf-border);
    padding: 0.6rem 1rem;
    border-radius: 6px;
    font-size: 0.82rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .bf-btn-outline:hover {
    background: var(--bf-surface-cream);
    border-color: var(--bf-gold);
  }

  /* Inputs */
  .bf-input {
    background: #FFFFFF;
    border: 1px solid var(--bf-border);
    border-radius: 6px;
    color: var(--bf-text-primary);
    padding: 0.7rem 1rem;
    font-size: 0.85rem;
    outline: none;
    transition: all 0.2s;
    font-family: inherit;
  }
  .bf-input:focus {
    border-color: var(--bf-gold);
    box-shadow: 0 0 0 3px rgba(197, 168, 128, 0.2);
  }
`;

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [step2FA, setStep2FA] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [simulatedPin, setSimulatedPin] = useState('');

  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'applicants' | 'graph' | 'jobs' | 'reviews' | 'security'>('overview');

  // Data Stores
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJobFilter, setSelectedJobFilter] = useState('All');
  const [selectedFitCategory, setSelectedFitCategory] = useState<'All' | 'Green' | 'Yellow' | 'Red'>('All');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('Engineering');

  // Drawer / Modals
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [applicantNotes, setApplicantNotes] = useState('');

  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [jobFormData, setJobFormData] = useState({
    title: '',
    category: 'Engineering',
    experience: '',
    skills: '',
    location: 'Bengaluru, India',
    type: 'Full-Time',
    viewLink: '#',
    description: ''
  });

  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [passwordChangeStatus, setPasswordChangeStatus] = useState<{ success?: boolean; message?: string }>({});

  const refreshAllData = async () => {
    try {
      const [fetchedJobs, fetchedApplicants, fetchedReviews, fetchedLogs] = await Promise.all([
        api.getJobs(),
        api.getApplicants(),
        api.getReviews(),
        api.getSecurityLogs()
      ]);
      setJobs(fetchedJobs);
      setApplicants(fetchedApplicants);
      setReviews(fetchedReviews);
      setSecurityLogs(fetchedLogs);
    } catch {
      // Handled
    }
  };

  useEffect(() => {
    api.checkAuth().then(({ authenticated }) => {
      if (authenticated) {
        setIsAuthenticated(true);
      } else if (sessionStorage.getItem('bf_admin_auth') === 'true') {
        setIsAuthenticated(true);
      }
    });
    refreshAllData();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      refreshAllData();
    }
  }, [isAuthenticated, activeTab]);

  // Auth Handlers
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await api.login(passwordInput);
      if (res.require2FA) {
        setSimulatedPin(res.simulatedOtp || '849201');
        setStep2FA(true);
      } else if (res.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('bf_admin_auth', 'true');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Invalid credentials.');
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await api.login(passwordInput, otpInput);
      if (res.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('bf_admin_auth', 'true');
        setStep2FA(false);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Invalid 2FA verification code.');
    }
  };

  const handleLogout = async () => {
    await api.logout();
    setIsAuthenticated(false);
    setStep2FA(false);
    sessionStorage.removeItem('bf_admin_auth');
  };

  // Applicant Actions
  const handleUpdateApplicantNotes = async () => {
    if (!selectedApplicant) return;
    const updated = { ...selectedApplicant, adminNotes: applicantNotes };
    await api.updateApplicant(updated);
    setSelectedApplicant(updated);
    setIsEditingNotes(false);
    refreshAllData();
  };

  const handleApplicantStageChange = async (applicant: Applicant, newCategory: 'Green' | 'Yellow' | 'Red') => {
    const updated = { ...applicant, fitCategory: newCategory };
    await api.updateApplicant(updated);
    if (selectedApplicant?.id === applicant.id) {
      setSelectedApplicant(updated);
    }
    refreshAllData();
  };

  const handleDeleteApplicant = async (id: string) => {
    if (window.confirm('Delete candidate application?')) {
      await api.deleteApplicant(id);
      if (selectedApplicant?.id === id) setSelectedApplicant(null);
      refreshAllData();
    }
  };

  // Job Actions
  const handleOpenAddJob = () => {
    setEditingJob(null);
    setJobFormData({
      title: '',
      category: 'Engineering',
      experience: '',
      skills: '',
      location: 'Bengaluru, India',
      type: 'Full-Time',
      viewLink: '#',
      description: ''
    });
    setIsJobModalOpen(true);
  };

  const handleOpenEditJob = (job: Job) => {
    setEditingJob(job);
    setJobFormData({
      title: job.title,
      category: job.category,
      experience: job.experience,
      skills: job.skills,
      location: job.location,
      type: job.type,
      viewLink: job.viewLink,
      description: job.description
    });
    setIsJobModalOpen(true);
  };

  const handleSaveJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.saveJob({ ...jobFormData, id: editingJob?.id });
    setIsJobModalOpen(false);
    refreshAllData();
  };

  const handleDeleteJob = async (id: string) => {
    if (window.confirm('Delete job requisition?')) {
      await api.deleteJob(id);
      refreshAllData();
    }
  };

  // Review Actions
  const handleToggleReview = async (review: Review) => {
    await api.updateReview({ ...review, isApproved: !review.isApproved });
    refreshAllData();
  };

  const handleDeleteReview = async (id: string) => {
    if (window.confirm('Delete client testimonial?')) {
      await api.deleteReview(id);
      refreshAllData();
    }
  };

  // Excel Export
  const handleExportExcel = () => {
    const formatData = (list: Applicant[]) => list.map((a, index) => ({
      'Sl No': index + 1,
      'Full Name': a.fullName,
      'Email Address': a.email,
      'Phone Number': a.phone,
      'Applied Requisition': a.jobTitle,
      'ATS Score (%)': a.atsScore,
      'Classification Fit': a.fitCategory,
      'Resume File': a.resumeName,
      'Matched Core Skills': a.matchedSkills.join(', '),
      'Missing Skills': a.missingSkills.join(', '),
      'Recruiter Confidential Notes': a.adminNotes || '',
      'Date Submitted': new Date(a.createdAt).toLocaleString()
    }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(formatData(applicants)), 'All Candidates');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(formatData(applicants.filter(a => a.fitCategory === 'Green'))), 'High Fit Candidates');
    XLSX.writeFile(wb, `BrickForce_Executive_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Computed Metrics
  const totalApplicants = applicants.length;
  const greenApplicants = useMemo(() => applicants.filter(a => a.fitCategory === 'Green'), [applicants]);
  const yellowApplicants = useMemo(() => applicants.filter(a => a.fitCategory === 'Yellow'), [applicants]);
  const redApplicants = useMemo(() => applicants.filter(a => a.fitCategory === 'Red'), [applicants]);

  const avgAtsScore = useMemo(() => {
    if (applicants.length === 0) return 0;
    const total = applicants.reduce((acc, curr) => acc + (curr.atsScore || 0), 0);
    return Math.round(total / applicants.length);
  }, [applicants]);

  const filteredApplicants = useMemo(() => {
    return applicants.filter(a => {
      const matchesSearch =
        a.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.matchedSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        a.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesJob = selectedJobFilter === 'All' || a.jobTitle === selectedJobFilter;
      const matchesFit = selectedFitCategory === 'All' || a.fitCategory === selectedFitCategory;

      return matchesSearch && matchesJob && matchesFit;
    });
  }, [applicants, searchQuery, selectedJobFilter, selectedFitCategory]);

  // =========================================================================
  // LOGIN SCREEN (MATCHING WEBSITE BRAND IDENTITY)
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="admin-dashboard-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem' }}>
        <div className="architectural-grid" />
        <style>{BRICKFORCE_ADMIN_STYLES}</style>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          style={{
            maxWidth: '460px',
            width: '100%',
            background: '#FFFFFF',
            border: '1px solid var(--bf-border)',
            borderRadius: '16px',
            padding: '3rem 2.5rem',
            boxShadow: '0 20px 50px -10px rgba(197, 168, 128, 0.25)',
            position: 'relative',
            zIndex: 10
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{
              width: '58px',
              height: '58px',
              borderRadius: '12px',
              background: 'var(--bf-surface-cream)',
              border: '1px solid var(--bf-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              color: 'var(--bf-gold-hover)'
            }}>
              <ShieldCheck size={28} />
            </div>

            <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--bf-gold-hover)', display: 'block', marginBottom: '0.4rem' }}>
              Brick Force Executive
            </span>
            <h1 className="font-cormorant" style={{ fontSize: '2.4rem', fontWeight: 500, margin: 0, color: 'var(--bf-navy)' }}>
              {step2FA ? 'Two-Factor Verification' : 'Admin Portal'}
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--bf-text-secondary)', marginTop: '0.3rem' }}>
              {step2FA ? 'Enter your 6-digit authorization code' : 'Protected PBKDF2 Zero-Trust Gateway'}
            </p>
          </div>

          {/* Form */}
          {step2FA ? (
            <form onSubmit={handleVerify2FA} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ background: 'var(--bf-surface-cream)', border: '1px solid var(--bf-border)', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--bf-gold-hover)' }}>
                  Verification PIN
                </span>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--bf-navy)', letterSpacing: '6px', fontFamily: "'JetBrains Mono', monospace", margin: '0.3rem 0' }}>
                  {simulatedPin}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--bf-text-secondary)', marginBottom: '0.4rem' }}>
                  Confirm Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="000000"
                  className="bf-input"
                  style={{ width: '100%', textAlign: 'center', fontSize: '1.3rem', letterSpacing: '6px', fontFamily: 'monospace' }}
                  autoFocus
                />
              </div>

              {authError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#DC2626', fontSize: '0.8rem', background: '#FEF2F2', border: '1px solid #FECACA', padding: '0.75rem', borderRadius: '6px' }}>
                  <AlertTriangle size={15} /> {authError}
                </div>
              )}

              <button type="submit" className="bf-btn-navy" style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}>
                Verify & Enter Console
              </button>

              <button type="button" onClick={() => setStep2FA(false)} style={{ background: 'none', border: 'none', color: 'var(--bf-text-secondary)', fontSize: '0.8rem', cursor: 'pointer', textAlign: 'center' }}>
                Back to password
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--bf-text-secondary)', marginBottom: '0.4rem' }}>
                  Master Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="var(--bf-gold-hover)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="password"
                    placeholder="Enter admin password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="bf-input"
                    style={{ width: '100%', paddingLeft: '2.75rem' }}
                    autoFocus
                  />
                </div>
              </div>

              {authError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#DC2626', fontSize: '0.8rem', background: '#FEF2F2', border: '1px solid #FECACA', padding: '0.75rem', borderRadius: '6px' }}>
                  <AlertTriangle size={15} /> {authError}
                </div>
              )}

              <button type="submit" className="bf-btn-navy" style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}>
                Sign In to Console
              </button>

              <div style={{ borderTop: '1px solid var(--bf-border)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--bf-text-secondary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--bf-emerald)', fontWeight: 600 }}>
                  <ShieldCheck size={14} /> Zero-Trust Backend
                </span>
                <span>PBKDF2-SHA512</span>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    );
  }

  // =========================================================================
  // MAIN EXECUTIVE ADMIN PORTAL (ALIGNED WITH BRICK FORCE WEBSITE DESIGN)
  // =========================================================================
  return (
    <div className="admin-dashboard-root" style={{ minHeight: '100vh' }}>
      <div className="architectural-grid" />
      <style>{BRICKFORCE_ADMIN_STYLES}</style>

      {/* Bespoke Admin Header */}
      <header className="admin-top-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'var(--bf-navy)',
              color: 'var(--bf-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.1rem',
              fontFamily: "'Cormorant Garamond', serif"
            }}>
              BF
            </div>
            <div>
              <div className="font-cormorant" style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--bf-navy)', lineHeight: 1.1 }}>
                Brick Force
              </div>
              <span style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--bf-gold-hover)' }}>
                Executive Console
              </span>
            </div>
          </Link>

          {/* Search bar */}
          <div style={{ position: 'relative', width: '320px' }}>
            <Search size={14} color="var(--bf-text-secondary)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search candidate, skill, requisition..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bf-input"
              style={{ width: '100%', padding: '0.5rem 1rem 0.5rem 2.3rem', fontSize: '0.82rem', background: 'var(--bf-surface-cream)' }}
            />
          </div>
        </div>

        {/* Header Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link to="/" className="bf-btn-outline" style={{ fontSize: '0.78rem' }}>
            <ExternalLink size={13} /> View Website
          </Link>

          <button onClick={handleExportExcel} className="bf-btn-outline" style={{ fontSize: '0.78rem' }}>
            <Download size={13} color="var(--bf-gold-hover)" /> Export Excel
          </button>

          <button onClick={handleOpenAddJob} className="bf-btn-navy" style={{ fontSize: '0.78rem' }}>
            <Plus size={14} /> Post Requisition
          </button>

          <button onClick={handleLogout} className="bf-btn-outline" style={{ color: '#DC2626', borderColor: 'rgba(220, 38, 38, 0.2)' }} title="Sign Out">
            <LogOut size={14} />
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2.5rem 2rem 5rem', position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2.5rem', alignItems: 'start' }}>

        {/* SIDEBAR NAVIGATION */}
        <aside style={{ position: 'sticky', top: '90px' }}>
          <div style={{
            background: 'var(--bf-surface)',
            border: '1px solid var(--bf-border)',
            borderRadius: '12px',
            padding: '1.25rem',
            boxShadow: '0 4px 20px -4px rgba(197, 168, 128, 0.08)'
          }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--bf-gold-hover)', display: 'block', padding: '0.4rem 0.6rem 0.8rem' }}>
              Management Deck
            </span>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {[
                { id: 'overview' as const, label: 'Executive Overview', icon: <Layers size={16} />, count: null },
                { id: 'applicants' as const, label: 'Candidate Pipeline', icon: <User size={16} />, count: totalApplicants },
                { id: 'graph' as const, label: 'Skill Cartogram', icon: <Compass size={16} />, count: null },
                { id: 'jobs' as const, label: 'Job Requisitions', icon: <Briefcase size={16} />, count: jobs.length },
                { id: 'reviews' as const, label: 'Testimonials', icon: <ClipboardList size={16} />, count: reviews.length },
                { id: 'security' as const, label: 'Security & Audit', icon: <ShieldCheck size={16} />, count: null },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`bf-nav-btn ${activeTab === tab.id ? 'active' : ''}`}
                >
                  <span style={{ color: activeTab === tab.id ? 'var(--bf-gold-hover)' : 'var(--bf-text-secondary)' }}>{tab.icon}</span>
                  <span style={{ flex: 1 }}>{tab.label}</span>
                  {tab.count !== null && (
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '999px',
                      background: activeTab === tab.id ? 'var(--bf-gold)' : 'var(--bf-surface-cream)',
                      color: activeTab === tab.id ? '#FFFFFF' : 'var(--bf-navy)'
                    }}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            <div style={{ borderTop: '1px solid var(--bf-border)', marginTop: '1.5rem', paddingTop: '1rem' }}>
              <div style={{ background: 'var(--bf-surface-cream)', borderRadius: '8px', padding: '0.85rem', border: '1px solid var(--bf-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--bf-emerald)', marginBottom: '3px' }}>
                  <ShieldCheck size={14} /> Zero-Trust Active
                </div>
                <p style={{ fontSize: '0.7rem', color: 'var(--bf-text-secondary)', margin: 0, lineHeight: 1.4 }}>
                  Backend authentication & encrypted candidate records active.
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main style={{ minWidth: 0 }}>

          {/* ========================================================================= */}
          {/* TAB 1: EXECUTIVE OVERVIEW */}
          {/* ========================================================================= */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

              {/* Editorial Header */}
              <div>
                <span className="section-subtitle" style={{ fontSize: '0.78rem', color: 'var(--bf-gold-hover)', letterSpacing: '2px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.4rem', display: 'block' }}>
                  Intelligence Brief · {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
                <h1 className="font-cormorant" style={{ fontSize: '2.8rem', fontWeight: 500, color: 'var(--bf-navy)', margin: '0 0 0.5rem', lineHeight: 1.1 }}>
                  Executive Talent Portfolio
                </h1>
                <p style={{ fontSize: '0.95rem', color: 'var(--bf-text-secondary)', margin: 0, maxWidth: '750px', lineHeight: 1.6 }}>
                  Strategic oversight of executive acquisitions, candidate ATS pipeline metrics, and open career requisitions.
                </p>
              </div>

              {/* 4 Numbered KPI Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
                <div className="bf-admin-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="bf-kpi-code">§01 · TOTAL TALENT</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--bf-emerald)' }}>+8.2%</span>
                  </div>
                  <div className="bf-kpi-number">{totalApplicants}</div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--bf-text-secondary)' }}>Dossiers ingested</span>
                </div>

                <div className="bf-admin-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="bf-kpi-code">§02 · HIGH-FIT MATCH</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--bf-gold-hover)' }}>ATS &gt; 85%</span>
                  </div>
                  <div className="bf-kpi-number" style={{ color: 'var(--bf-gold-hover)' }}>
                    {totalApplicants > 0 ? Math.round((greenApplicants.length / totalApplicants) * 100) : 0}%
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--bf-text-secondary)' }}>{greenApplicants.length} High-fit candidates</span>
                </div>

                <div className="bf-admin-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="bf-kpi-code">§03 · MEAN ATS BENCHMARK</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--bf-navy)' }}>Skill alignment</span>
                  </div>
                  <div className="bf-kpi-number">{avgAtsScore}%</div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--bf-text-secondary)' }}>Average scoring curve</span>
                </div>

                <div className="bf-admin-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="bf-kpi-code">§04 · REQUISITIONS</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--bf-emerald)' }}>Live</span>
                  </div>
                  <div className="bf-kpi-number">{jobs.length}</div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--bf-text-secondary)' }}>Positions on Careers portal</span>
                </div>
              </div>

              {/* Department Talent Cartogram & Candidate Spotlight */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.5rem' }}>

                {/* Cartogram Grid */}
                <div className="bf-admin-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div>
                      <h3 className="font-cormorant" style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--bf-navy)', margin: 0 }}>
                        Department Talent Density Cartogram
                      </h3>
                      <p style={{ fontSize: '0.8rem', color: 'var(--bf-text-secondary)', margin: '2px 0 0' }}>
                        Select a department node to filter candidate volume
                      </p>
                    </div>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', fontWeight: 700, color: 'var(--bf-gold-hover)' }}>
                      Selected: {selectedDepartment}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    {['Engineering', 'Product', 'Human Resources', 'Executive', 'Operations', 'Finance'].map(dept => {
                      const count = applicants.filter(a => {
                        const matchingJob = jobs.find(j => j.title === a.jobTitle);
                        return matchingJob?.category === dept || dept === 'Engineering';
                      }).length;
                      const isSelected = selectedDepartment === dept;

                      return (
                        <div
                          key={dept}
                          onClick={() => setSelectedDepartment(dept)}
                          style={{
                            background: isSelected ? 'var(--bf-navy)' : 'var(--bf-surface-cream)',
                            border: `1px solid ${isSelected ? 'var(--bf-gold)' : 'var(--bf-border)'}`,
                            borderRadius: '10px',
                            padding: '1.25rem 1rem',
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: isSelected ? 'var(--bf-gold)' : 'var(--bf-text-secondary)', marginBottom: '4px' }}>
                            {dept}
                          </div>
                          <div className="font-cormorant" style={{ fontSize: '2rem', fontWeight: 600, color: isSelected ? '#FFFFFF' : 'var(--bf-navy)', lineHeight: 1 }}>
                            {count}
                          </div>
                          <span style={{ fontSize: '0.68rem', color: isSelected ? '#CBD5E1' : '#94A3B8' }}>Dossiers</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Top Spotlight Candidate */}
                <div className="bf-admin-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--bf-gold-hover)' }}>
                        ★ Top Candidate Spotlight
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--bf-text-secondary)', fontFamily: 'monospace' }}>#001</span>
                    </div>

                    {greenApplicants.length > 0 ? (
                      <div>
                        <h4 className="font-cormorant" style={{ fontSize: '1.8rem', fontWeight: 600, color: 'var(--bf-navy)', margin: '0 0 0.2rem' }}>
                          {greenApplicants[0].fullName}
                        </h4>
                        <div style={{ fontSize: '0.85rem', color: 'var(--bf-text-secondary)', marginBottom: '1rem' }}>
                          Requisition: <strong>{greenApplicants[0].jobTitle}</strong>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', background: 'var(--bf-surface-cream)', border: '1px solid var(--bf-border)', borderRadius: '8px', padding: '0.85rem', marginBottom: '1rem' }}>
                          <div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--bf-text-secondary)' }}>ATS SCORE</div>
                            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--bf-emerald)' }}>{greenApplicants[0].atsScore}%</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--bf-text-secondary)' }}>CLASSIFICATION</div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--bf-navy)', marginTop: '4px' }}>High Fit</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--bf-text-secondary)' }}>MATCHED</div>
                            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--bf-navy)' }}>{greenApplicants[0].matchedSkills.length}</div>
                          </div>
                        </div>

                        <p style={{ fontSize: '0.82rem', color: 'var(--bf-text-secondary)', lineHeight: 1.5, margin: 0 }}>
                          Comprehensive profile match with verified technical skill alignment. Recommended for priority interview scheduling.
                        </p>
                      </div>
                    ) : (
                      <div style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--bf-text-secondary)' }}>
                        No high-fit candidate in the queue.
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      if (greenApplicants[0]) {
                        setSelectedApplicant(greenApplicants[0]);
                        setApplicantNotes(greenApplicants[0].adminNotes || '');
                      }
                    }}
                    className="bf-btn-navy"
                    style={{ width: '100%', justifyContent: 'center', marginTop: '1.25rem' }}
                  >
                    Inspect Candidate Dossier <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* Recent Applications Master Table */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                  <h3 className="font-cormorant" style={{ fontSize: '1.6rem', fontWeight: 600, color: 'var(--bf-navy)', margin: 0 }}>
                    Recent Ingestion Stream
                  </h3>
                  <button
                    onClick={() => setActiveTab('applicants')}
                    style={{ background: 'none', border: 'none', color: 'var(--bf-gold-hover)', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    View All Candidates <ArrowRight size={14} />
                  </button>
                </div>

                <table className="bf-table">
                  <thead>
                    <tr>
                      <th>Candidate Name</th>
                      <th>Applied Requisition</th>
                      <th>ATS Score</th>
                      <th>Fit Category</th>
                      <th>Ingested Date</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applicants.slice(0, 5).map(applicant => (
                      <tr key={applicant.id}>
                        <td>
                          <div style={{ fontWeight: 700, color: 'var(--bf-navy)' }}>{applicant.fullName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--bf-text-secondary)' }}>{applicant.email}</div>
                        </td>
                        <td style={{ color: 'var(--bf-text-secondary)' }}>{applicant.jobTitle}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 700, color: applicant.fitCategory === 'Green' ? 'var(--bf-emerald)' : applicant.fitCategory === 'Yellow' ? 'var(--bf-gold-hover)' : '#DC2626' }}>
                              {applicant.atsScore}%
                            </span>
                          </div>
                        </td>
                        <td>
                          <span style={{
                            padding: '3px 10px',
                            borderRadius: '999px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            background: applicant.fitCategory === 'Green' ? '#F0FDF4' : applicant.fitCategory === 'Yellow' ? '#FFFBEB' : '#FEF2F2',
                            color: applicant.fitCategory === 'Green' ? 'var(--bf-emerald)' : applicant.fitCategory === 'Yellow' ? 'var(--bf-gold-hover)' : '#DC2626',
                            border: `1px solid ${applicant.fitCategory === 'Green' ? '#BBF7D0' : applicant.fitCategory === 'Yellow' ? '#FDE68A' : '#FECACA'}`
                          }}>
                            {applicant.fitCategory} Fit
                          </span>
                        </td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--bf-text-secondary)' }}>
                          {new Date(applicant.createdAt).toLocaleDateString()}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            onClick={() => {
                              setSelectedApplicant(applicant);
                              setApplicantNotes(applicant.adminNotes || '');
                            }}
                            className="bf-btn-outline"
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem' }}
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: CANDIDATE PIPELINE */}
          {/* ========================================================================= */}
          {activeTab === 'applicants' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 className="font-cormorant" style={{ fontSize: '2.4rem', fontWeight: 500, color: 'var(--bf-navy)', margin: 0 }}>
                    Candidate Portfolio Register
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--bf-text-secondary)', margin: 0 }}>
                    {filteredApplicants.length} Candidates actively enrolled across all requisitions
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <select
                    value={selectedJobFilter}
                    onChange={(e) => setSelectedJobFilter(e.target.value)}
                    className="bf-input"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}
                  >
                    <option value="All">All Requisitions</option>
                    {jobs.map(j => <option key={j.id} value={j.title}>{j.title}</option>)}
                  </select>

                  <div style={{ display: 'flex', background: 'var(--bf-surface-cream)', padding: '3px', borderRadius: '6px', border: '1px solid var(--bf-border)' }}>
                    {(['All', 'Green', 'Yellow', 'Red'] as const).map(fit => (
                      <button
                        key={fit}
                        onClick={() => setSelectedFitCategory(fit)}
                        style={{
                          padding: '0.4rem 0.85rem',
                          border: 'none',
                          background: selectedFitCategory === fit ? '#FFFFFF' : 'transparent',
                          color: selectedFitCategory === fit ? 'var(--bf-navy)' : 'var(--bf-text-secondary)',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          borderRadius: '4px',
                          boxShadow: selectedFitCategory === fit ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
                        }}
                      >
                        {fit}
                      </button>
                    ))}
                  </div>

                  <button onClick={handleExportExcel} className="bf-btn-navy" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                    <Download size={13} /> Export Excel
                  </button>
                </div>
              </div>

              <table className="bf-table">
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Target Requisition</th>
                    <th>ATS Score</th>
                    <th>Classification</th>
                    <th>Submission Date</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplicants.length > 0 ? (
                    filteredApplicants.map(applicant => (
                      <tr key={applicant.id}>
                        <td>
                          <div style={{ fontWeight: 700, color: 'var(--bf-navy)' }}>{applicant.fullName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--bf-text-secondary)' }}>{applicant.email}</div>
                        </td>
                        <td style={{ color: 'var(--bf-text-secondary)' }}>{applicant.jobTitle}</td>
                        <td>
                          <span style={{ fontWeight: 700, color: applicant.fitCategory === 'Green' ? 'var(--bf-emerald)' : applicant.fitCategory === 'Yellow' ? 'var(--bf-gold-hover)' : '#DC2626' }}>
                            {applicant.atsScore}%
                          </span>
                        </td>
                        <td>
                          <span style={{
                            padding: '3px 10px',
                            borderRadius: '999px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            background: applicant.fitCategory === 'Green' ? '#F0FDF4' : applicant.fitCategory === 'Yellow' ? '#FFFBEB' : '#FEF2F2',
                            color: applicant.fitCategory === 'Green' ? 'var(--bf-emerald)' : applicant.fitCategory === 'Yellow' ? 'var(--bf-gold-hover)' : '#DC2626',
                            border: `1px solid ${applicant.fitCategory === 'Green' ? '#BBF7D0' : applicant.fitCategory === 'Yellow' ? '#FDE68A' : '#FECACA'}`
                          }}>
                            {applicant.fitCategory} Fit
                          </span>
                        </td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--bf-text-secondary)' }}>
                          {new Date(applicant.createdAt).toLocaleDateString()}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              onClick={() => {
                                setSelectedApplicant(applicant);
                                setApplicantNotes(applicant.adminNotes || '');
                              }}
                              className="bf-btn-outline"
                              style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem' }}
                            >
                              Inspect Dossier
                            </button>
                            <button
                              onClick={() => handleDeleteApplicant(applicant.id)}
                              style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '0.4rem 0.6rem', borderRadius: '6px', cursor: 'pointer' }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--bf-text-secondary)' }}>
                        No candidates match the active filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: SKILL CARTOGRAM */}
          {/* ========================================================================= */}
          {activeTab === 'graph' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h2 className="font-cormorant" style={{ fontSize: '2.4rem', fontWeight: 500, color: 'var(--bf-navy)', margin: 0 }}>
                  Strategic Skill Cartogram & Telemetry
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--bf-text-secondary)', margin: 0 }}>
                  Multi-dimensional talent distribution and keyword coverage analysis
                </p>
              </div>

              <div className="bf-admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
                  {[
                    { label: 'Engineering Core Stack', score: '94.2%', desc: 'React, TypeScript, Node.js, Python, AWS', color: 'var(--bf-navy)' },
                    { label: 'Cloud Architecture', score: '82.0%', desc: 'Docker, Kubernetes, Microservices, CI/CD', color: 'var(--bf-gold-hover)' },
                    { label: 'Executive & Strategy', score: '68.5%', desc: 'Organizational Leadership, Talent P&L', color: 'var(--bf-emerald)' },
                  ].map((item, idx) => (
                    <div key={idx} style={{ background: 'var(--bf-surface-cream)', border: '1px solid var(--bf-border)', padding: '1.25rem', borderRadius: '10px' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--bf-gold-hover)' }}>{item.label}</span>
                      <div className="font-cormorant" style={{ fontSize: '2.4rem', fontWeight: 600, color: item.color, margin: '0.2rem 0' }}>{item.score}</div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--bf-text-secondary)' }}>{item.desc}</span>
                    </div>
                  ))}
                </div>

                <div>
                  <h4 className="font-cormorant" style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--bf-navy)', margin: '0 0 1rem' }}>
                    Skill Cluster Density Chart
                  </h4>

                  <div style={{ height: '200px', background: 'var(--bf-surface-cream)', border: '1px solid var(--bf-border)', borderRadius: '10px', padding: '1.5rem', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', gap: '1rem' }}>
                    {[
                      { skill: 'React / TypeScript', val: 92 },
                      { skill: 'Node.js / Express', val: 78 },
                      { skill: 'Python / ML', val: 65 },
                      { skill: 'Cloud / AWS', val: 84 },
                      { skill: 'UI / UX Design', val: 70 },
                      { skill: 'HR Leadership', val: 55 },
                    ].map(bar => (
                      <div key={bar.skill} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1 }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--bf-navy)' }}>{bar.val}%</span>
                        <div style={{ width: '100%', maxWidth: '45px', height: `${bar.val * 1.3}px`, background: 'var(--bf-navy)', borderRadius: '4px 4px 0 0' }} />
                        <span style={{ fontSize: '0.72rem', color: 'var(--bf-text-secondary)', textAlign: 'center' }}>{bar.skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: JOB REQUISITIONS */}
          {/* ========================================================================= */}
          {activeTab === 'jobs' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 className="font-cormorant" style={{ fontSize: '2.4rem', fontWeight: 500, color: 'var(--bf-navy)', margin: 0 }}>
                    Career Requisitions Portfolio
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--bf-text-secondary)', margin: 0 }}>
                    {jobs.length} Active job openings published on the public careers portal
                  </p>
                </div>

                <button onClick={handleOpenAddJob} className="bf-btn-navy">
                  <Plus size={15} /> Post New Requisition
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {jobs.map(job => (
                  <div key={job.id} className="bf-admin-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: 'var(--bf-surface-cream)', color: 'var(--bf-gold-hover)', textTransform: 'uppercase' }}>
                          {job.category}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--bf-text-secondary)' }}>{job.type}</span>
                      </div>

                      <h3 className="font-cormorant" style={{ fontSize: '1.6rem', fontWeight: 600, color: 'var(--bf-navy)', margin: '0 0 0.3rem' }}>
                        {job.title}
                      </h3>
                      <div style={{ fontSize: '0.78rem', color: 'var(--bf-text-secondary)', marginBottom: '0.75rem' }}>
                        📍 {job.location} · 💼 {job.experience}
                      </div>

                      <p style={{ fontSize: '0.85rem', color: 'var(--bf-text-secondary)', lineHeight: 1.5, margin: '0 0 1rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {job.description}
                      </p>
                    </div>

                    <div style={{ borderTop: '1px solid var(--bf-border)', paddingTop: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--bf-navy)', fontWeight: 600 }}>
                        {applicants.filter(a => a.jobTitle === job.title).length} Candidates
                      </span>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => handleOpenEditJob(job)} className="bf-btn-outline" style={{ padding: '0.35rem 0.6rem' }} title="Edit">
                          <Edit size={13} />
                        </button>
                        <button onClick={() => handleDeleteJob(job.id)} style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '0.35rem 0.6rem', borderRadius: '6px', cursor: 'pointer' }} title="Delete">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: TESTIMONIALS */}
          {/* ========================================================================= */}
          {activeTab === 'reviews' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h2 className="font-cormorant" style={{ fontSize: '2.4rem', fontWeight: 500, color: 'var(--bf-navy)', margin: 0 }}>
                  Testimonial Moderation
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--bf-text-secondary)', margin: 0 }}>
                  Verify and approve client and candidate feedback for public showcase
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {reviews.map(rev => (
                  <div key={rev.id} className="bf-admin-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: 'var(--bf-surface-cream)', color: 'var(--bf-gold-hover)' }}>
                          {rev.role}
                        </span>
                        <span style={{ color: 'var(--bf-gold-hover)', fontWeight: 800 }}>{'★'.repeat(rev.rating)}</span>
                      </div>

                      <p style={{ fontSize: '0.9rem', color: 'var(--bf-text-primary)', fontStyle: 'italic', lineHeight: 1.5, margin: '0 0 1rem' }}>
                        &ldquo;{rev.content}&rdquo;
                      </p>

                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--bf-navy)' }}>{rev.authorName}</div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--bf-border)', paddingTop: '0.85rem', marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: rev.isApproved ? 'var(--bf-emerald)' : 'var(--bf-gold-hover)' }}>
                        {rev.isApproved ? '● Live on Website' : '● Pending Approval'}
                      </span>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => handleToggleReview(rev)} className="bf-btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
                          {rev.isApproved ? 'Hide' : 'Approve'}
                        </button>
                        <button onClick={() => handleDeleteReview(rev.id)} style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '0.35rem 0.55rem', borderRadius: '6px', cursor: 'pointer' }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 6: SECURITY & AUDIT */}
          {/* ========================================================================= */}
          {activeTab === 'security' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h2 className="font-cormorant" style={{ fontSize: '2.4rem', fontWeight: 500, color: 'var(--bf-navy)', margin: 0 }}>
                  Security & Audit Center
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--bf-text-secondary)', margin: 0 }}>
                  Zero-Trust backend protection · PBKDF2 cryptographic hashing · httpOnly cookies
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
                {/* Audit Logs */}
                <div className="bf-admin-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 className="font-cormorant" style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--bf-navy)', margin: 0 }}>
                      Live Security Audit Stream
                    </h3>
                    <button onClick={async () => { await api.clearSecurityLogs(); refreshAllData(); }} style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '0.3rem 0.65rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>
                      Clear Stream
                    </button>
                  </div>

                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <table className="bf-table" style={{ fontSize: '0.78rem' }}>
                      <thead>
                        <tr>
                          <th>Timestamp</th>
                          <th>Event</th>
                          <th>Severity</th>
                          <th>Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {securityLogs.map(log => (
                          <tr key={log.id}>
                            <td style={{ color: 'var(--bf-text-secondary)', whiteSpace: 'nowrap' }}>
                              {new Date(log.timestamp).toLocaleTimeString()}
                            </td>
                            <td>
                              <span style={{ fontWeight: 700, fontSize: '0.7rem', padding: '2px 6px', background: 'var(--bf-surface-cream)', borderRadius: '4px' }}>
                                {log.eventType}
                              </span>
                            </td>
                            <td>
                              <span style={{
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                padding: '2px 6px',
                                borderRadius: '4px',
                                background: log.severity === 'CRITICAL' ? '#FEF2F2' : log.severity === 'WARN' ? '#FFFBEB' : '#ECFDF5',
                                color: log.severity === 'CRITICAL' ? '#DC2626' : log.severity === 'WARN' ? '#D97706' : '#059669'
                              }}>
                                {log.severity}
                              </span>
                            </td>
                            <td style={{ color: 'var(--bf-text-primary)' }}>{log.details}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Password Rotation */}
                <div className="bf-admin-card">
                  <h3 className="font-cormorant" style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--bf-navy)', margin: '0 0 0.4rem' }}>
                    Rotate Master Password
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--bf-text-secondary)', marginBottom: '1.25rem' }}>
                    Server re-hashes credentials with 10,000 PBKDF2 rounds.
                  </p>

                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    setPasswordChangeStatus({});
                    if (newPasswordInput !== confirmPasswordInput) {
                      setPasswordChangeStatus({ success: false, message: 'Passwords do not match.' });
                      return;
                    }
                    const res = await api.changePassword(newPasswordInput);
                    setPasswordChangeStatus(res);
                    if (res.success) {
                      setNewPasswordInput('');
                      setConfirmPasswordInput('');
                    }
                  }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--bf-text-secondary)', marginBottom: '0.3rem' }}>
                        New Password
                      </label>
                      <input
                        type="password"
                        placeholder="Min 8 characters"
                        value={newPasswordInput}
                        onChange={(e) => setNewPasswordInput(e.target.value)}
                        className="bf-input"
                        style={{ width: '100%' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--bf-text-secondary)', marginBottom: '0.3rem' }}>
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        placeholder="Re-enter password"
                        value={confirmPasswordInput}
                        onChange={(e) => setConfirmPasswordInput(e.target.value)}
                        className="bf-input"
                        style={{ width: '100%' }}
                      />
                    </div>

                    {passwordChangeStatus.message && (
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: passwordChangeStatus.success ? 'var(--bf-emerald)' : '#DC2626' }}>
                        {passwordChangeStatus.message}
                      </div>
                    )}

                    <button type="submit" className="bf-btn-navy" style={{ width: '100%', justifyContent: 'center' }}>
                      Re-Hash Password
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* CANDIDATE DOSSIER SLIDE-OVER DRAWER */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedApplicant && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(11, 17, 32, 0.45)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', justifyContent: 'flex-end' }}>
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 260 }}
              style={{
                width: '100%',
                maxWidth: '620px',
                height: '100vh',
                background: '#FFFFFF',
                borderLeft: '1px solid var(--bf-border)',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '-10px 0 40px rgba(11, 17, 32, 0.15)'
              }}
            >
              {/* Drawer Header */}
              <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--bf-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--bf-gold-hover)' }}>
                    Candidate Profile Dossier
                  </span>
                  <h2 className="font-cormorant" style={{ fontSize: '2rem', fontWeight: 500, color: 'var(--bf-navy)', margin: 0 }}>
                    {selectedApplicant.fullName}
                  </h2>
                </div>
                <button onClick={() => setSelectedApplicant(null)} style={{ background: 'var(--bf-surface-cream)', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}>
                  <X size={18} />
                </button>
              </div>

              {/* Drawer Body */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ background: 'var(--bf-surface-cream)', border: '1px solid var(--bf-border)', borderRadius: '10px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div className="font-cormorant" style={{ fontSize: '2.5rem', fontWeight: 700, color: selectedApplicant.fitCategory === 'Green' ? 'var(--bf-emerald)' : selectedApplicant.fitCategory === 'Yellow' ? 'var(--bf-gold-hover)' : '#DC2626' }}>
                    {selectedApplicant.atsScore}%
                  </div>
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--bf-navy)' }}>{selectedApplicant.jobTitle}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--bf-text-secondary)' }}>
                      Classification: <strong>{selectedApplicant.fitCategory} Fit</strong>
                    </div>
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--bf-gold-hover)', display: 'block', marginBottom: '0.4rem' }}>
                    Contact Information
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div style={{ background: 'var(--bf-surface-cream)', border: '1px solid var(--bf-border)', padding: '0.85rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--bf-text-secondary)', display: 'block', fontSize: '0.7rem' }}>Email Address</span>
                      <strong>{selectedApplicant.email}</strong>
                    </div>
                    <div style={{ background: 'var(--bf-surface-cream)', border: '1px solid var(--bf-border)', padding: '0.85rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--bf-text-secondary)', display: 'block', fontSize: '0.7rem' }}>Phone Number</span>
                      <strong>{selectedApplicant.phone}</strong>
                    </div>
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--bf-gold-hover)', display: 'block', marginBottom: '0.4rem' }}>
                    Skill Coverage Matrix
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '0.6rem' }}>
                    {selectedApplicant.matchedSkills.map((s, i) => (
                      <span key={i} style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '4px', background: '#F0FDF4', color: 'var(--bf-emerald)', border: '1px solid #BBF7D0', fontWeight: 600 }}>
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {selectedApplicant.missingSkills.map((s, i) => (
                      <span key={i} style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '4px', background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', fontWeight: 600 }}>
                        ✗ {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--bf-gold-hover)' }}>
                      Recruiter Confidential Notes
                    </span>
                    {!isEditingNotes ? (
                      <button onClick={() => setIsEditingNotes(true)} style={{ background: 'none', border: 'none', color: 'var(--bf-navy)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                        Edit Notes
                      </button>
                    ) : (
                      <button onClick={handleUpdateApplicantNotes} style={{ background: 'none', border: 'none', color: 'var(--bf-emerald)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                        Save Notes
                      </button>
                    )}
                  </div>

                  {isEditingNotes ? (
                    <textarea
                      value={applicantNotes}
                      onChange={(e) => setApplicantNotes(e.target.value)}
                      rows={4}
                      className="bf-input"
                      style={{ width: '100%' }}
                    />
                  ) : (
                    <div style={{ background: 'var(--bf-surface-cream)', border: '1px solid var(--bf-border)', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem', color: selectedApplicant.adminNotes ? 'var(--bf-text-primary)' : 'var(--bf-text-secondary)', fontStyle: selectedApplicant.adminNotes ? 'normal' : 'italic' }}>
                      {selectedApplicant.adminNotes || 'No notes added yet.'}
                    </div>
                  )}
                </div>
              </div>

              {/* Drawer Footer */}
              <div style={{ padding: '1.25rem 2rem', borderTop: '1px solid var(--bf-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bf-surface-cream)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--bf-text-secondary)' }}>Resume: {selectedApplicant.resumeName}</span>
                <button onClick={() => handleDeleteApplicant(selectedApplicant.id)} style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '0.45rem 0.85rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
                  <Trash2 size={13} style={{ marginRight: '4px' }} /> Delete Dossier
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* REQUISITION STUDIO MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isJobModalOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(11, 17, 32, 0.45)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{
                maxWidth: '600px',
                width: '100%',
                background: '#FFFFFF',
                border: '1px solid var(--bf-border)',
                borderRadius: '16px',
                padding: '2.5rem',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 25px 60px rgba(11, 17, 32, 0.15)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 className="font-cormorant" style={{ fontSize: '2rem', fontWeight: 500, color: 'var(--bf-navy)', margin: 0 }}>
                  {editingJob ? 'Edit Career Requisition' : 'Create Career Requisition'}
                </h3>
                <button onClick={() => setIsJobModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveJobSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--bf-text-secondary)', marginBottom: '0.3rem' }}>Position Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lead Full Stack Architect"
                    value={jobFormData.title}
                    onChange={(e) => setJobFormData({ ...jobFormData, title: e.target.value })}
                    className="bf-input"
                    style={{ width: '100%' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--bf-text-secondary)', marginBottom: '0.3rem' }}>Department</label>
                    <select
                      value={jobFormData.category}
                      onChange={(e) => setJobFormData({ ...jobFormData, category: e.target.value })}
                      className="bf-input"
                      style={{ width: '100%', background: '#FFF' }}
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Executive">Executive</option>
                      <option value="Product">Product</option>
                      <option value="Human Resources">Human Resources</option>
                      <option value="Finance">Finance</option>
                      <option value="Operations">Operations</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--bf-text-secondary)', marginBottom: '0.3rem' }}>Type</label>
                    <select
                      value={jobFormData.type}
                      onChange={(e) => setJobFormData({ ...jobFormData, type: e.target.value })}
                      className="bf-input"
                      style={{ width: '100%', background: '#FFF' }}
                    >
                      <option value="Full-Time">Full-Time</option>
                      <option value="Part-Time">Part-Time</option>
                      <option value="Contract">Contract</option>
                      <option value="Executive Leadership">Executive Leadership</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--bf-text-secondary)', marginBottom: '0.3rem' }}>Experience</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 5+ Years"
                      value={jobFormData.experience}
                      onChange={(e) => setJobFormData({ ...jobFormData, experience: e.target.value })}
                      className="bf-input"
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--bf-text-secondary)', marginBottom: '0.3rem' }}>Location</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bengaluru, India"
                      value={jobFormData.location}
                      onChange={(e) => setJobFormData({ ...jobFormData, location: e.target.value })}
                      className="bf-input"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--bf-text-secondary)', marginBottom: '0.3rem' }}>Required Skills (Comma separated)</label>
                  <input
                    type="text"
                    required
                    placeholder="React, TypeScript, Node.js, Python, AWS"
                    value={jobFormData.skills}
                    onChange={(e) => setJobFormData({ ...jobFormData, skills: e.target.value })}
                    className="bf-input"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--bf-text-secondary)', marginBottom: '0.3rem' }}>Description</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide overview of responsibilities, criteria, compensation..."
                    value={jobFormData.description}
                    onChange={(e) => setJobFormData({ ...jobFormData, description: e.target.value })}
                    className="bf-input"
                    style={{ width: '100%', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                  <button type="button" onClick={() => setIsJobModalOpen(false)} className="bf-btn-outline">
                    Cancel
                  </button>
                  <button type="submit" className="bf-btn-navy">
                    {editingJob ? 'Update Requisition' : 'Publish Requisition'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
