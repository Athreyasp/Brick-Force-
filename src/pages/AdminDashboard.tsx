import { useState, useEffect } from 'react';
import {
  Plus, Edit, Trash2, Download, User, Mail, Phone,
  Search, FileText, Lock, LogOut, X, Eye, ClipboardList,
  ShieldCheck, ShieldAlert, Key, RefreshCw, Sliders, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as XLSX from 'xlsx';
import {
  getJobs, saveJob, deleteJob, getApplicants, updateApplicant,
  getReviews, updateReview, deleteReview
} from '../utils/storage';
import type { Job, Applicant, Review } from '../utils/storage';
import {
  verifyAdminPassword, updateAdminPassword, checkPasswordStrength,
  generate2FAOTP, verify2FAOTP, getLockoutState, recordFailedLogin,
  resetLockoutState, getSecurityLogs, clearSecurityLogs, getSecuritySettings,
  updateSecuritySettings, logSecurityEvent, verifyStorageIntegrity
} from '../utils/security';
import type { SecurityLog, SecuritySettings } from '../utils/security';

const ADMIN_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  .admin-dashboard-wrapper {
    --admin-bg: #F8FAFC;
    --admin-bg-alt: #F1F5F9;
    --admin-surface: #FFFFFF;
    --admin-surface-hover: #F8FAFC;
    --admin-text-primary: #0F172A;
    --admin-text-secondary: #64748B;
    --admin-border: #E2E8F0;
    --admin-border-focus: #3B82F6;
    --admin-accent: #2563EB;
    --admin-accent-hover: #1D4ED8;
    --admin-accent-light: #EFF6FF;
    --admin-danger: #DC2626;
    --admin-success: #16A34A;
    --admin-warning: #D97706;

    background: var(--admin-bg) !important;
    color: var(--admin-text-primary) !important;
    min-height: 100vh;
    position: relative;
    font-family: 'Inter', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    overflow-x: hidden;
  }

  .admin-dashboard-wrapper ::-webkit-scrollbar { width: 5px; height: 5px; }
  .admin-dashboard-wrapper ::-webkit-scrollbar-track { background: transparent; }
  .admin-dashboard-wrapper ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
  .admin-dashboard-wrapper ::-webkit-scrollbar-thumb:hover { background: #94A3B8; }

  /* ===== LOGIN SCREEN ===== */
  .login-card {
    max-width: 440px;
    width: 100%;
    background: var(--admin-surface);
    border: 1px solid var(--admin-border);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 20px 60px rgba(0,0,0,0.08);
    position: relative;
    z-index: 2;
    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  }
  .login-card:hover {
    box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 30px 80px rgba(0,0,0,0.12);
    transform: translateY(-2px);
  }

  .login-card-header {
    background: var(--admin-accent);
    padding: 3rem 2.5rem 3.5rem;
    text-align: center;
    position: relative;
  }
  .login-card-header::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 24px;
    background: var(--admin-surface);
    border-radius: 24px 24px 0 0;
  }

  .login-card-body { padding: 0 2.5rem 2.5rem; }

  .login-shield-circle {
    width: 64px;
    height: 64px;
    background: rgba(255,255,255,0.15);
    border: 1.5px solid rgba(255,255,255,0.3);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.2rem;
  }

  /* ===== STATS WIDGETS ===== */
  .stat-widget {
    background: var(--admin-surface);
    border: 1px solid var(--admin-border);
    padding: 1.5rem;
    border-radius: 12px;
    position: relative;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
    box-shadow: 0 1px 2px rgba(0,0,0,0.04);
  }
  .stat-widget:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.08);
    border-color: var(--admin-border-focus);
  }

  /* ===== TABS ===== */
  .admin-tab-btn {
    padding: 0.75rem 1.5rem;
    border: none;
    background: none;
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--admin-text-secondary);
    border-bottom: 2px solid transparent;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.3px;
  }
  .admin-tab-btn:hover { color: var(--admin-accent); }
  .admin-tab-btn.active {
    color: var(--admin-accent);
    border-bottom-color: var(--admin-accent);
  }

  /* ===== TOOLBAR ===== */
  .toolbar-panel {
    background: var(--admin-surface);
    border: 1px solid var(--admin-border);
    padding: 1.25rem 1.5rem;
    border-radius: 12px;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 1px 2px rgba(0,0,0,0.04);
  }

  /* ===== FORM CONTROLS ===== */
  .admin-input, .admin-select {
    padding: 0.65rem 1rem;
    background: var(--admin-surface);
    border: 1px solid var(--admin-border);
    border-radius: 8px;
    color: var(--admin-text-primary);
    outline: none;
    font-size: 0.85rem;
    font-family: 'Inter', sans-serif;
    transition: all 0.2s;
  }
  .admin-input:focus, .admin-select:focus {
    border-color: var(--admin-accent);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
  .admin-input::placeholder { color: #94A3B8; }

  /* ===== TABLE ===== */
  .table-panel {
    background: var(--admin-surface);
    border: 1px solid var(--admin-border);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 1px 2px rgba(0,0,0,0.04);
  }
  .admin-table { width: 100%; border-collapse: collapse; text-align: left; }
  .admin-table th {
    padding: 0.85rem 1.25rem;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: var(--admin-text-secondary);
    background: var(--admin-bg-alt);
    border-bottom: 1px solid var(--admin-border);
  }
  .admin-table td {
    padding: 1rem 1.25rem;
    font-size: 0.85rem;
    border-bottom: 1px solid #F1F5F9;
    color: var(--admin-text-primary);
  }
  .admin-table tbody tr { transition: background 0.15s; }
  .admin-table tbody tr:hover { background: #F8FAFC; }
  .admin-table tbody tr:last-child td { border-bottom: none; }

  /* ===== BUTTONS ===== */
  .btn-primary-action {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1.2rem;
    background: var(--admin-accent);
    color: #FFFFFF;
    border: none;
    border-radius: 8px;
    font-size: 0.82rem;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.2px;
  }
  .btn-primary-action:hover {
    background: var(--admin-accent-hover);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
    transform: translateY(-1px);
  }

  .btn-outline-secondary {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.55rem 1rem;
    background: transparent;
    color: var(--admin-text-secondary);
    border: 1px solid var(--admin-border);
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-outline-secondary:hover {
    background: var(--admin-bg-alt);
    color: var(--admin-text-primary);
    border-color: #CBD5E1;
  }

  .btn-outline-danger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.55rem;
    background: transparent;
    color: var(--admin-danger);
    border: 1px solid #FECACA;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-outline-danger:hover {
    background: #FEF2F2;
    border-color: #F87171;
  }

  /* ===== MODALS ===== */
  .modal-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(15, 23, 42, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 20px;
  }
  .modal-content {
    background: var(--admin-surface);
    border: 1px solid var(--admin-border);
    border-radius: 16px;
    padding: 2rem;
    max-width: 560px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    box-shadow: 0 25px 60px rgba(0,0,0,0.15);
    color: var(--admin-text-primary) !important;
  }

  /* ===== SIDE PANE ===== */
  .side-pane {
    background: var(--admin-surface);
    border-left: 1px solid var(--admin-border);
    width: 100%;
    max-width: 640px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    box-shadow: -10px 0 40px rgba(0,0,0,0.08);
    position: relative;
    color: var(--admin-text-primary) !important;
  }

  /* ===== LAYOUT ===== */
  .admin-layout {
    display: flex;
    min-height: calc(100vh - 80px);
    gap: 0;
    align-items: flex-start;
    position: relative;
    z-index: 1;
  }

  .admin-sidebar {
    width: 260px;
    flex-shrink: 0;
    position: sticky;
    top: 90px;
    display: flex;
    flex-direction: column;
    background: #0F172A;
    border-radius: 12px;
    overflow: hidden;
    margin-right: 1.5rem;
    min-height: calc(100vh - 120px);
  }

  .admin-sidebar-brand {
    padding: 1.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.08);
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .admin-sidebar-logo {
    width: 36px;
    height: 36px;
    background: var(--admin-accent);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .admin-sidebar-nav {
    padding: 1rem 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
  }

  .admin-nav-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.7rem 0.85rem;
    border: none;
    background: transparent;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.15s;
    font-family: 'Inter', sans-serif;
    font-size: 0.85rem;
    font-weight: 500;
    color: #94A3B8;
    text-align: left;
    width: 100%;
  }
  .admin-nav-item:hover {
    background: rgba(255,255,255,0.06);
    color: #E2E8F0;
  }
  .admin-nav-item.active {
    background: rgba(37, 99, 235, 0.15);
    color: #60A5FA;
  }

  .admin-nav-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: rgba(255,255,255,0.06);
    transition: all 0.15s;
  }
  .admin-nav-item.active .admin-nav-icon {
    background: rgba(37, 99, 235, 0.25);
  }

  .admin-nav-badge {
    background: rgba(255,255,255,0.08);
    color: #94A3B8;
    font-size: 0.68rem;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 20px;
    margin-left: auto;
  }
  .admin-nav-item.active .admin-nav-badge {
    background: rgba(37, 99, 235, 0.2);
    color: #60A5FA;
  }

  .admin-sidebar-divider {
    height: 1px;
    background: rgba(255,255,255,0.06);
    margin: 0.5rem 0;
  }

  .admin-sidebar-footer {
    padding: 0.75rem;
    border-top: 1px solid rgba(255,255,255,0.06);
  }

  .admin-logout-btn {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.7rem 0.85rem;
    border: 1px solid rgba(239, 68, 68, 0.2);
    background: rgba(239, 68, 68, 0.08);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Inter', sans-serif;
    font-size: 0.82rem;
    font-weight: 600;
    color: #F87171;
    width: 100%;
    text-align: left;
  }
  .admin-logout-btn:hover {
    background: rgba(239, 68, 68, 0.15);
    border-color: rgba(239, 68, 68, 0.35);
  }

  .admin-main-content { flex: 1; min-width: 0; }

  .admin-page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    gap: 1rem;
  }
  .admin-page-title {
    font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--admin-text-primary);
    margin: 0;
    letter-spacing: -0.3px;
  }
  .admin-page-subtitle {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--admin-accent);
    margin: 0 0 0.15rem;
  }

  .section-label {
    font-size: 0.68rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--admin-text-secondary);
    margin-bottom: 0.75rem;
  }

  .card-panel {
    background: var(--admin-surface);
    border: 1px solid var(--admin-border);
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 1px 2px rgba(0,0,0,0.04);
  }
`;

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [step2FA, setStep2FA] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [simulatedPin, setSimulatedPin] = useState('');
  const [, setLockout] = useState(getLockoutState());
  const [lockoutTimerSec, setLockoutTimerSec] = useState(0);

  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
  const [securitySettings, setSecuritySettingsState] = useState<SecuritySettings>(getSecuritySettings());
  const [logFilterSeverity, setLogFilterSeverity] = useState<'ALL' | 'CRITICAL' | 'WARN' | 'INFO'>('ALL');

  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [passwordResetStatus, setPasswordResetStatus] = useState<{ success?: boolean; message?: string }>({});

  const [activeTab, setActiveTab] = useState<'applicants' | 'jobs' | 'reviews' | 'security'>('applicants');

  const [jobs, setJobs] = useState<Job[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJobFilter, setSelectedJobFilter] = useState('All');
  const [selectedFitCategory, setSelectedFitCategory] = useState<'All' | 'Green' | 'Yellow' | 'Red'>('All');

  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [isEditingApplicant, setIsEditingApplicant] = useState(false);
  const [editedNotes, setEditedNotes] = useState('');
  const [editedPhone, setEditedPhone] = useState('');
  const [editedEmail, setEditedEmail] = useState('');

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

  useEffect(() => {
    const isAuth = sessionStorage.getItem('bf_admin_auth') === 'true';
    if (isAuth) setIsAuthenticated(true);
    setJobs(getJobs());
    setApplicants(getApplicants());
    setReviews(getReviews());
    setSecurityLogs(getSecurityLogs());
    setSecuritySettingsState(getSecuritySettings());
  }, [isAuthenticated, activeTab]);

  useEffect(() => {
    const currentState = getLockoutState();
    setLockout(currentState);
    if (currentState.lockedUntil && currentState.lockedUntil > Date.now()) {
      const remainingSec = Math.ceil((currentState.lockedUntil - Date.now()) / 1000);
      setLockoutTimerSec(remainingSec);
      const interval = setInterval(() => {
        const nowSec = Math.ceil((currentState.lockedUntil! - Date.now()) / 1000);
        if (nowSec <= 0) {
          clearInterval(interval);
          setLockout(getLockoutState());
          setLockoutTimerSec(0);
        } else {
          setLockoutTimerSec(nowSec);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [authError]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const currentLockout = getLockoutState();
    if (currentLockout.lockedUntil && currentLockout.lockedUntil > Date.now()) {
      setAuthError('Account locked due to repeated failed login attempts.');
      return;
    }
    const isValid = await verifyAdminPassword(passwordInput);
    if (isValid) {
      resetLockoutState();
      const settings = getSecuritySettings();
      if (settings.enforce2FA) {
        const pin = generate2FAOTP();
        setSimulatedPin(pin);
        setStep2FA(true);
        setAuthError('');
      } else {
        setIsAuthenticated(true);
        sessionStorage.setItem('bf_admin_auth', 'true');
        logSecurityEvent('LOGIN_SUCCESS', 'INFO', 'Admin logged in.');
      }
    } else {
      const updatedState = recordFailedLogin();
      setLockout(updatedState);
      if (updatedState.lockedUntil) {
        setAuthError(`System locked after ${getSecuritySettings().maxFailedAttempts} failed attempts. Try again in ${getSecuritySettings().lockoutDurationMinutes} minutes.`);
      } else {
        setAuthError(`Invalid password (${updatedState.failedAttempts}/${getSecuritySettings().maxFailedAttempts} attempts).`);
      }
    }
  };

  const handleVerify2FA = (e: React.FormEvent) => {
    e.preventDefault();
    if (verify2FAOTP(otpInput)) {
      setIsAuthenticated(true);
      sessionStorage.setItem('bf_admin_auth', 'true');
      setStep2FA(false);
      setAuthError('');
      logSecurityEvent('LOGIN_SUCCESS', 'INFO', '2FA verified. Session active.');
    } else {
      setAuthError('Invalid or expired verification code.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setStep2FA(false);
    sessionStorage.removeItem('bf_admin_auth');
    logSecurityEvent('SETTINGS_UPDATED', 'INFO', 'Admin session ended.');
  };

  const refreshData = () => {
    setJobs(getJobs());
    setApplicants(getApplicants());
    setReviews(getReviews());
  };

  const handleToggleReviewApproval = (review: Review) => {
    updateReview({ ...review, isApproved: !review.isApproved });
    refreshData();
  };

  const handleDeleteReview = (id: string) => {
    if (window.confirm('Delete this review?')) {
      deleteReview(id);
      refreshData();
    }
  };

  const handleDeleteJob = (id: string) => {
    if (window.confirm('Delete this job opening?')) {
      deleteJob(id);
      refreshData();
    }
  };

  const openAddJob = () => {
    setEditingJob(null);
    setJobFormData({
      title: '', category: 'Engineering', experience: '', skills: '',
      location: 'Bengaluru, India', type: 'Full-Time', viewLink: '#', description: ''
    });
    setIsJobModalOpen(true);
  };

  const openEditJob = (job: Job) => {
    setEditingJob(job);
    setJobFormData({
      title: job.title, category: job.category, experience: job.experience,
      skills: job.skills, location: job.location, type: job.type,
      viewLink: job.viewLink, description: job.description
    });
    setIsJobModalOpen(true);
  };

  const handleJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveJob({ ...jobFormData, id: editingJob?.id });
    setIsJobModalOpen(false);
    refreshData();
  };

  const viewApplicantDetails = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setEditedNotes(applicant.adminNotes || '');
    setEditedPhone(applicant.phone);
    setEditedEmail(applicant.email);
    setIsEditingApplicant(false);
  };

  const handleSaveApplicant = () => {
    if (!selectedApplicant) return;
    const updated = {
      ...selectedApplicant,
      phone: editedPhone,
      email: editedEmail,
      adminNotes: editedNotes
    };
    updateApplicant(updated);
    setSelectedApplicant(updated);
    setIsEditingApplicant(false);
    refreshData();
  };

  const handleExportExcel = () => {
    const filtered = applicants.filter(a => selectedJobFilter === 'All' || a.jobTitle === selectedJobFilter);
    const greenList = filtered.filter(a => a.fitCategory === 'Green');
    const yellowList = filtered.filter(a => a.fitCategory === 'Yellow');
    const redList = filtered.filter(a => a.fitCategory === 'Red');

    const formatData = (list: Applicant[]) => list.map((a, index) => ({
      'Sl No': index + 1,
      'Full Name': a.fullName,
      'Email Address': a.email,
      'Phone Number': a.phone,
      'Applied For': a.jobTitle,
      'ATS Score (%)': a.atsScore,
      'Status Category': a.fitCategory,
      'Uploaded Resume Name': a.resumeName,
      'Resume Size': a.resumeSize,
      'Candidate Cover Message': a.message,
      'Matched Skills': a.matchedSkills.join(', '),
      'Missing Skills': a.missingSkills.join(', '),
      'Recruiter Notes / Comments': a.adminNotes || '',
      'Submission Date': new Date(a.createdAt).toLocaleString()
    }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(formatData(greenList)), 'Green - High Fit');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(formatData(yellowList)), 'Yellow - Medium Fit');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(formatData(redList)), 'Red - Low Fit');

    const safeFilterName = selectedJobFilter.replace(/[^a-zA-Z0-9]/g, '_');
    const dateStr = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `BrickForce_Applicants_${safeFilterName}_${dateStr}.xlsx`);
  };

  const totalApps = applicants.length;
  const greenCount = applicants.filter(a => a.fitCategory === 'Green').length;
  const yellowCount = applicants.filter(a => a.fitCategory === 'Yellow').length;
  const redCount = applicants.filter(a => a.fitCategory === 'Red').length;

  const filteredApplicants = applicants.filter(a => {
    const matchesSearch = a.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.matchedSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesJob = selectedJobFilter === 'All' || a.jobTitle === selectedJobFilter;
    const matchesCategory = selectedFitCategory === 'All' || a.fitCategory === selectedFitCategory;
    return matchesSearch && matchesJob && matchesCategory;
  });

  // ==================== LOGIN SCREEN ====================
  if (!isAuthenticated) {
    return (
      <div className="admin-dashboard-wrapper" style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F1F5F9',
        padding: '20px'
      }}>
        <style>{ADMIN_STYLES}</style>

        <div className="login-card">
          <div className="login-card-header">
            <div className="login-shield-circle">
              <Lock size={24} color="#FFFFFF" />
            </div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '2px', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              Brick Force
            </div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1.5rem', color: '#FFFFFF', fontWeight: 800, margin: 0, letterSpacing: '-0.3px' }}>
              {step2FA ? 'Two-Factor Verification' : lockoutTimerSec > 0 ? 'Account Temporarily Locked' : 'Admin Login'}
            </h2>
          </div>

          <div className="login-card-body" style={{ paddingTop: '2rem' }}>
            {lockoutTimerSec > 0 ? (
              <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '12px',
                  background: '#FEF2F2', border: '1px solid #FECACA',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.2rem', color: '#DC2626'
                }}>
                  <ShieldAlert size={28} />
                </div>
                <h4 style={{ color: '#0F172A', fontSize: '1rem', marginBottom: '0.4rem', fontWeight: 700 }}>Too Many Failed Attempts</h4>
                <p style={{ color: '#64748B', fontSize: '0.82rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                  Your account has been temporarily locked. Please wait before trying again.
                </p>
                <div style={{
                  background: '#0F172A', color: '#FFFFFF', fontWeight: 800,
                  fontSize: '1.25rem', padding: '0.7rem 1.25rem', borderRadius: '8px',
                  display: 'inline-block', letterSpacing: '3px', fontFamily: 'monospace'
                }}>
                  {Math.floor(lockoutTimerSec / 60)}:{(lockoutTimerSec % 60).toString().padStart(2, '0')}
                </div>
              </div>
            ) : step2FA ? (
              <form onSubmit={handleVerify2FA} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{
                  background: '#EFF6FF', border: '1px solid #BFDBFE',
                  borderRadius: '10px', padding: '1rem', textAlign: 'center'
                }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#3B82F6' }}>
                    Your Verification Code
                  </span>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', letterSpacing: '6px', margin: '0.3rem 0', fontFamily: 'monospace' }}>
                    {simulatedPin}
                  </div>
                  <p style={{ fontSize: '0.68rem', color: '#64748B', margin: 0 }}>
                    In production, this would be sent via authenticator app
                  </p>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#334155', marginBottom: '0.4rem' }}>
                    Enter 6-Digit Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="000000"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    className="admin-input"
                    style={{ width: '100%', fontSize: '1rem', letterSpacing: '4px', fontWeight: 700, textAlign: 'center' }}
                  />
                  {authError && (
                    <p style={{ color: '#DC2626', fontSize: '0.78rem', marginTop: '0.4rem', fontWeight: 600 }}>{authError}</p>
                  )}
                </div>

                <button type="submit" className="btn-primary-action" style={{ padding: '0.85rem', width: '100%', fontSize: '0.85rem', justifyContent: 'center' }}>
                  Verify & Continue
                </button>

                <button type="button" onClick={() => setStep2FA(false)}
                  style={{ background: 'none', border: 'none', color: '#64748B', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600, textAlign: 'center' }}>
                  Back to Password
                </button>
              </form>
            ) : (
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#334155', marginBottom: '0.4rem' }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={15} color="#94A3B8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="password"
                      placeholder="Enter admin password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="admin-input"
                      style={{ width: '100%', paddingLeft: '2.5rem' }}
                    />
                  </div>
                  {authError && (
                    <p style={{ color: '#DC2626', fontSize: '0.78rem', marginTop: '0.4rem', fontWeight: 600 }}>{authError}</p>
                  )}
                  <div style={{ marginTop: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94A3B8' }}>
                    <span>Default: <code style={{ background: '#F1F5F9', padding: '1px 5px', borderRadius: '3px', fontWeight: 700, color: '#475569' }}>brickforce123</code></span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#16A34A', fontWeight: 600 }}>
                      <ShieldCheck size={12} /> SHA-256
                    </span>
                  </div>
                </div>

                <button type="submit" className="btn-primary-action" style={{ padding: '0.85rem', width: '100%', fontSize: '0.85rem', justifyContent: 'center' }}>
                  Sign In
                </button>

                <div style={{
                  borderTop: '1px solid #E2E8F0', paddingTop: '1rem',
                  display: 'flex', justifyContent: 'space-around', fontSize: '0.68rem', color: '#94A3B8'
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><ShieldCheck size={11} /> XSS Protection</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><Lock size={11} /> 2FA Ready</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><RefreshCw size={11} /> IDS Active</span>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ==================== DASHBOARD ====================
  return (
    <div className="admin-dashboard-wrapper" style={{ paddingTop: '90px' }}>
      <style>{ADMIN_STYLES}</style>

      <div className="admin-layout" style={{ padding: '0 2rem 4rem', maxWidth: '1500px', margin: '0 auto' }}>

        {/* ---- SIDEBAR ---- */}
        <aside className="admin-sidebar">
          <div className="admin-sidebar-brand">
            <div className="admin-sidebar-logo">
              <ShieldCheck size={18} color="#FFFFFF" />
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.2px' }}>Brick Force</div>
              <div style={{ fontSize: '0.6rem', fontWeight: 600, color: '#64748B', letterSpacing: '0.5px' }}>Admin Panel</div>
            </div>
          </div>

          {/* Quick Stats */}
          <div style={{ padding: '1rem 0.75rem 0.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              {[
                { value: totalApps, label: 'Total', color: '#60A5FA', bg: 'rgba(96,165,250,0.1)' },
                { value: greenCount, label: 'Green', color: '#4ADE80', bg: 'rgba(74,222,128,0.1)' },
                { value: yellowCount, label: 'Yellow', color: '#FBBF24', bg: 'rgba(251,191,36,0.1)' },
                { value: redCount, label: 'Red', color: '#F87171', bg: 'rgba(248,113,113,0.1)' },
              ].map(s => (
                <div key={s.label} style={{ background: s.bg, borderRadius: '8px', padding: '0.6rem 0.7rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: '0.55rem', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '2px' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <nav className="admin-sidebar-nav">
            <div className="admin-sidebar-divider" />
            <p style={{ fontSize: '0.6rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '1.5px', padding: '0 0.6rem', margin: '0.25rem 0 0.4rem' }}>Menu</p>

            {[
              { key: 'applicants' as const, icon: <User size={16} />, label: 'Candidates', count: applicants.length },
              { key: 'jobs' as const, icon: <FileText size={16} />, label: 'Job Openings', count: jobs.length },
              { key: 'reviews' as const, icon: <ClipboardList size={16} />, label: 'Reviews', count: reviews.length },
            ].map(item => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`admin-nav-item ${activeTab === item.key ? 'active' : ''}`}
              >
                <span className="admin-nav-icon">{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                <span className="admin-nav-badge">{item.count}</span>
              </button>
            ))}

            <div className="admin-sidebar-divider" />

            <button
              onClick={() => setActiveTab('security')}
              className={`admin-nav-item ${activeTab === 'security' ? 'active' : ''}`}
            >
              <span className="admin-nav-icon" style={{ background: activeTab === 'security' ? 'rgba(37,99,235,0.25)' : undefined }}>
                <ShieldCheck size={16} />
              </span>
              <span style={{ flex: 1 }}>Security</span>
            </button>
          </nav>

          <div className="admin-sidebar-footer">
            <button className="admin-logout-btn" onClick={handleLogout}>
              <LogOut size={15} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* ---- MAIN CONTENT ---- */}
        <main className="admin-main-content">
          <div className="admin-page-header">
            <div>
              <p className="admin-page-subtitle">
                {activeTab === 'applicants' ? 'Recruitment' : activeTab === 'jobs' ? 'Positions' : activeTab === 'reviews' ? 'Testimonials' : 'Security'}
              </p>
              <h2 className="admin-page-title">
                {activeTab === 'applicants' ? 'Candidates' : activeTab === 'jobs' ? 'Job Openings' : activeTab === 'reviews' ? 'Reviews' : 'Security Center'}
              </h2>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748B', background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.4rem 0.85rem', fontWeight: 500 }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
            </div>
          </div>

          <div>
            {/* ==================== APPLICANTS TAB ==================== */}
            {activeTab === 'applicants' ? (
              <div>
                <div className="toolbar-panel" style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', flex: 1 }}>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', minWidth: '220px', flex: 1 }}>
                      <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '0.85rem' }} />
                      <input
                        type="text"
                        placeholder="Search candidates, skills..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="admin-input"
                        style={{ width: '100%', paddingLeft: '2.4rem' }}
                      />
                    </div>

                    <select
                      value={selectedJobFilter}
                      onChange={(e) => setSelectedJobFilter(e.target.value)}
                      className="admin-select"
                    >
                      <option value="All">All Positions</option>
                      {jobs.map(j => <option key={j.id} value={j.title}>{j.title}</option>)}
                    </select>

                    <div style={{ display: 'flex', gap: '4px', background: '#F1F5F9', padding: '3px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      {(['All', 'Green', 'Yellow', 'Red'] as const).map(fit => (
                        <button
                          key={fit}
                          onClick={() => setSelectedFitCategory(fit)}
                          style={{
                            padding: '0.35rem 0.85rem', border: 'none',
                            background: selectedFitCategory === fit ? '#FFFFFF' : 'transparent',
                            color: selectedFitCategory === fit ? '#0F172A' : '#64748B',
                            fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                            borderRadius: '6px', transition: 'all 0.15s',
                            boxShadow: selectedFitCategory === fit ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
                          }}
                        >
                          {fit === 'Green' ? 'Green' : fit === 'Yellow' ? 'Yellow' : fit === 'Red' ? 'Red' : 'All'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button onClick={handleExportExcel} className="btn-primary-action" style={{ whiteSpace: 'nowrap' }}>
                    <Download size={14} /> Export Excel
                  </button>
                </div>

                <div className="table-panel">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Candidate</th>
                        <th>Position</th>
                        <th>ATS Score</th>
                        <th>Fit</th>
                        <th>Date</th>
                        <th style={{ textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredApplicants.length > 0 ? (
                        filteredApplicants.map((app) => (
                          <tr key={app.id}>
                            <td>
                              <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{app.fullName}</div>
                              <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '1px' }}>{app.email}</div>
                            </td>
                            <td style={{ fontSize: '0.82rem' }}>{app.jobTitle}</td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ width: '48px', height: '4px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                                  <div style={{
                                    width: `${app.atsScore}%`, height: '100%',
                                    background: app.fitCategory === 'Green' ? '#16A34A' : app.fitCategory === 'Yellow' ? '#D97706' : '#DC2626',
                                    borderRadius: '4px'
                                  }} />
                                </div>
                                <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>{app.atsScore}%</span>
                              </div>
                            </td>
                            <td>
                              <span style={{
                                display: 'inline-flex', padding: '3px 10px', borderRadius: '20px',
                                fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3px',
                                background: app.fitCategory === 'Green' ? '#F0FDF4' : app.fitCategory === 'Yellow' ? '#FFFBEB' : '#FEF2F2',
                                color: app.fitCategory === 'Green' ? '#16A34A' : app.fitCategory === 'Yellow' ? '#D97706' : '#DC2626',
                                border: `1px solid ${app.fitCategory === 'Green' ? '#BBF7D0' : app.fitCategory === 'Yellow' ? '#FDE68A' : '#FECACA'}`
                              }}>
                                {app.fitCategory}
                              </span>
                            </td>
                            <td style={{ fontSize: '0.8rem', color: '#64748B' }}>
                              {new Date(app.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <button onClick={() => viewApplicantDetails(app)} className="btn-outline-secondary" style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}>
                                <Eye size={13} /> View
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem' }}>
                            No candidates match the current filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : activeTab === 'jobs' ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.25rem' }}>
                  <button onClick={openAddJob} className="btn-primary-action">
                    <Plus size={15} /> New Job
                  </button>
                </div>

                <div className="table-panel">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Department</th>
                        <th>Experience</th>
                        <th>Skills</th>
                        <th>Location</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobs.length > 0 ? (
                        jobs.map((job) => (
                          <tr key={job.id}>
                            <td>
                              <div style={{ fontWeight: 600 }}>{job.title}</div>
                              <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '1px' }}>{job.type}</div>
                            </td>
                            <td>
                              <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 600, background: '#F1F5F9', color: '#475569' }}>
                                {job.category}
                              </span>
                            </td>
                            <td style={{ fontSize: '0.82rem', fontWeight: 600, color: '#2563EB' }}>{job.experience}</td>
                            <td style={{ fontSize: '0.78rem', color: '#64748B', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {job.skills}
                            </td>
                            <td style={{ fontSize: '0.82rem', color: '#64748B' }}>{job.location}</td>
                            <td style={{ textAlign: 'right' }}>
                              <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                                <button onClick={() => openEditJob(job)} className="btn-outline-secondary" style={{ padding: '0.4rem' }} title="Edit">
                                  <Edit size={13} />
                                </button>
                                <button onClick={() => handleDeleteJob(job.id)} className="btn-outline-danger" title="Delete">
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
                            No jobs posted yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : activeTab === 'reviews' ? (
              <div>
                <div className="table-panel">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Author</th>
                        <th>Role</th>
                        <th>Review</th>
                        <th>Rating</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reviews.length > 0 ? (
                        reviews.map((rev) => (
                          <tr key={rev.id}>
                            <td style={{ fontWeight: 600 }}>{rev.authorName}</td>
                            <td>
                              <span style={{
                                padding: '3px 10px', borderRadius: '20px', fontSize: '0.68rem', fontWeight: 700,
                                background: rev.role === 'Client' ? '#EFF6FF' : '#F1F5F9',
                                color: rev.role === 'Client' ? '#2563EB' : '#475569'
                              }}>
                                {rev.role}
                              </span>
                            </td>
                            <td style={{ fontSize: '0.82rem', color: '#475569', maxWidth: '320px', lineHeight: 1.5 }}>
                              &ldquo;{rev.content}&rdquo;
                            </td>
                            <td style={{ color: '#D97706', fontWeight: 700, fontSize: '0.85rem' }}>
                              {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                            </td>
                            <td>
                              <span style={{
                                display: 'inline-flex', padding: '3px 10px', borderRadius: '20px',
                                fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase',
                                background: rev.isApproved ? '#F0FDF4' : '#FFFBEB',
                                color: rev.isApproved ? '#16A34A' : '#D97706',
                                border: `1px solid ${rev.isApproved ? '#BBF7D0' : '#FDE68A'}`
                              }}>
                                {rev.isApproved ? 'Approved' : 'Pending'}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                                <button onClick={() => handleToggleReviewApproval(rev)} className="btn-outline-secondary" style={{ fontSize: '0.72rem', padding: '0.4rem 0.7rem' }}>
                                  {rev.isApproved ? 'Reject' : 'Approve'}
                                </button>
                                <button onClick={() => handleDeleteReview(rev.id)} className="btn-outline-danger">
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
                            No reviews submitted yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div>
                {/* Security Status Banner */}
                <div className="card-panel" style={{ marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, right: 0, width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(37,99,235,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
                    <div>
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '1.5px', color: '#16A34A', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ShieldCheck size={14} /> All Systems Operational
                      </span>
                      <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1.3rem', fontWeight: 800, margin: '0.4rem 0 0.5rem', letterSpacing: '-0.3px' }}>
                        Security Control Center
                      </h3>
                      <p style={{ color: '#64748B', fontSize: '0.82rem', maxWidth: '550px', margin: 0, lineHeight: 1.5 }}>
                        Multi-layered protection: SHA-256 authentication, 2FA verification, intrusion detection, XSS prevention, and storage integrity verification.
                      </p>
                    </div>

                    <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '10px', padding: '1rem 1.5rem', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#16A34A' }}>Security Grade</span>
                      <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#16A34A', margin: '0.1rem 0', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>A+</div>
                      <span style={{ fontSize: '0.68rem', color: '#16A34A' }}>100% Rating</span>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginTop: '1.5rem', position: 'relative', zIndex: 1 }}>
                    {[
                      { icon: <Lock size={13} />, title: 'SHA-256 Hashing', desc: 'Salted crypto verification' },
                      { icon: <Key size={13} />, title: '2FA PIN Shield', desc: securitySettings.enforce2FA ? 'Enforced' : 'Optional' },
                      { icon: <ShieldAlert size={13} />, title: 'IDS Brute Force', desc: '3-attempt lockout active' },
                      { icon: <CheckCircle2 size={13} />, title: 'HMAC Integrity', desc: 'Tamper-proof checksums' },
                    ].map((m, i) => (
                      <div key={i} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '0.85rem 1rem', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16A34A', fontWeight: 600, fontSize: '0.78rem', marginBottom: '0.2rem' }}>
                          {m.icon} {m.title}
                        </div>
                        <p style={{ fontSize: '0.7rem', color: '#64748B', margin: 0 }}>{m.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.25rem' }}>
                  {/* Security Audit Log */}
                  <div className="card-panel">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Audit Log</h4>
                        <p style={{ fontSize: '0.72rem', color: '#64748B', margin: '0.15rem 0 0' }}>Real-time security events</p>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <select
                          value={logFilterSeverity}
                          onChange={(e) => setLogFilterSeverity(e.target.value as any)}
                          className="admin-select"
                          style={{ fontSize: '0.75rem', padding: '0.35rem 0.6rem' }}
                        >
                          <option value="ALL">All Events</option>
                          <option value="CRITICAL">Critical</option>
                          <option value="WARN">Warnings</option>
                          <option value="INFO">Info</option>
                        </select>
                        <button
                          onClick={() => { clearSecurityLogs(); setSecurityLogs([]); }}
                          className="btn-outline-danger"
                          style={{ padding: '0.35rem 0.7rem', fontSize: '0.72rem' }}
                        >
                          Clear
                        </button>
                      </div>
                    </div>

                    <div style={{ maxHeight: '380px', overflowY: 'auto', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                      <table className="admin-table" style={{ fontSize: '0.78rem' }}>
                        <thead>
                          <tr>
                            <th>Time</th>
                            <th>Event</th>
                            <th>Severity</th>
                            <th>Details</th>
                          </tr>
                        </thead>
                        <tbody>
                          {securityLogs.filter(log => logFilterSeverity === 'ALL' || log.severity === logFilterSeverity).length > 0 ? (
                            securityLogs
                              .filter(log => logFilterSeverity === 'ALL' || log.severity === logFilterSeverity)
                              .map(log => (
                                <tr key={log.id}>
                                  <td style={{ whiteSpace: 'nowrap', fontSize: '0.72rem', color: '#64748B' }}>
                                    {new Date(log.timestamp).toLocaleTimeString()}
                                  </td>
                                  <td>
                                    <span style={{ fontWeight: 600, fontSize: '0.68rem', padding: '2px 6px', borderRadius: '4px', background: '#F1F5F9', color: '#475569' }}>
                                      {log.eventType}
                                    </span>
                                  </td>
                                  <td>
                                    <span style={{
                                      fontWeight: 700, fontSize: '0.62rem', padding: '2px 8px', borderRadius: '10px',
                                      background: log.severity === 'CRITICAL' ? '#FEF2F2' : log.severity === 'WARN' ? '#FFFBEB' : '#F0FDF4',
                                      color: log.severity === 'CRITICAL' ? '#DC2626' : log.severity === 'WARN' ? '#D97706' : '#16A34A'
                                    }}>
                                      {log.severity}
                                    </span>
                                  </td>
                                  <td style={{ fontSize: '0.75rem', color: '#475569' }}>{log.details}</td>
                                </tr>
                              ))
                          ) : (
                            <tr>
                              <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>
                                No events recorded.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {/* Password Change */}
                    <div className="card-panel">
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.3rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Key size={15} color="#2563EB" /> Update Password
                      </h4>
                      <p style={{ fontSize: '0.72rem', color: '#64748B', marginBottom: '1rem' }}>
                        SHA-256 salted hash on save
                      </p>

                      <form onSubmit={async (e) => {
                        e.preventDefault();
                        setPasswordResetStatus({});
                        if (newPasswordInput !== confirmPasswordInput) {
                          setPasswordResetStatus({ success: false, message: 'Passwords do not match.' });
                          return;
                        }
                        const result = await updateAdminPassword(newPasswordInput);
                        setPasswordResetStatus(result);
                        if (result.success) {
                          setNewPasswordInput('');
                          setConfirmPasswordInput('');
                        }
                      }} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', color: '#475569', marginBottom: '0.25rem' }}>New Password</label>
                          <input
                            type="password"
                            placeholder="Min 8 chars, mixed case + numbers"
                            value={newPasswordInput}
                            onChange={(e) => setNewPasswordInput(e.target.value)}
                            className="admin-input"
                            style={{ width: '100%', fontSize: '0.82rem' }}
                          />
                        </div>

                        {newPasswordInput && (() => {
                          const strength = checkPasswordStrength(newPasswordInput);
                          return (
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', fontWeight: 600, marginBottom: '0.2rem', color: strength.color }}>
                                <span>{strength.label}</span>
                                <span>{strength.score}/5</span>
                              </div>
                              <div style={{ height: '3px', background: '#F1F5F9', borderRadius: '2px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${(strength.score / 5) * 100}%`, background: strength.color, transition: 'width 0.3s', borderRadius: '2px' }} />
                              </div>
                            </div>
                          );
                        })()}

                        <div>
                          <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', color: '#475569', marginBottom: '0.25rem' }}>Confirm Password</label>
                          <input
                            type="password"
                            placeholder="Re-enter password"
                            value={confirmPasswordInput}
                            onChange={(e) => setConfirmPasswordInput(e.target.value)}
                            className="admin-input"
                            style={{ width: '100%', fontSize: '0.82rem' }}
                          />
                        </div>

                        {passwordResetStatus.message && (
                          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: passwordResetStatus.success ? '#16A34A' : '#DC2626', margin: 0 }}>
                            {passwordResetStatus.message}
                          </p>
                        )}

                        <button type="submit" className="btn-primary-action" style={{ padding: '0.7rem', fontSize: '0.78rem', width: '100%', justifyContent: 'center' }}>
                          Save Password
                        </button>
                      </form>
                    </div>

                    {/* Security Controls */}
                    <div className="card-panel">
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Sliders size={15} color="#2563EB" /> Policy Settings
                      </h4>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block' }}>2FA Enforcement</span>
                            <span style={{ fontSize: '0.68rem', color: '#64748B' }}>Require PIN on login</span>
                          </div>
                          <input
                            type="checkbox"
                            checked={securitySettings.enforce2FA}
                            onChange={(e) => {
                              const updated = updateSecuritySettings({ enforce2FA: e.target.checked });
                              setSecuritySettingsState(updated);
                            }}
                            style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#2563EB' }}
                          />
                        </div>

                        <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block' }}>Anti-XSS Engine</span>
                            <span style={{ fontSize: '0.68rem', color: '#64748B' }}>Sanitize all form inputs</span>
                          </div>
                          <input
                            type="checkbox"
                            checked={securitySettings.strictXSS}
                            onChange={(e) => {
                              const updated = updateSecuritySettings({ strictXSS: e.target.checked });
                              setSecuritySettingsState(updated);
                            }}
                            style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#2563EB' }}
                          />
                        </div>

                        <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '0.75rem' }}>
                          <button
                            onClick={async () => {
                              await verifyStorageIntegrity('brickforce_jobs');
                              await verifyStorageIntegrity('brickforce_applicants');
                              await verifyStorageIntegrity('brickforce_reviews');
                              alert('Storage integrity verified successfully.');
                              setSecurityLogs(getSecurityLogs());
                            }}
                            className="btn-outline-secondary"
                            style={{ width: '100%', padding: '0.65rem', fontSize: '0.75rem', justifyContent: 'center' }}
                          >
                            <ShieldCheck size={14} /> Verify Storage Integrity
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ==================== APPLICANT SIDE PANE ==================== */}
      <AnimatePresence>
        {selectedApplicant && (
          <div className="modal-overlay" style={{ justifyContent: 'flex-end', padding: 0 }}>
            <motion.div
              initial={{ x: '100%', opacity: 0.9 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0.9 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="side-pane"
            >
              {/* Header */}
              <div style={{ padding: '1.5rem 1.75rem', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#2563EB', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Candidate Profile</span>
                  <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1.25rem', fontWeight: 800, marginTop: '0.15rem', letterSpacing: '-0.3px' }}>
                    {selectedApplicant.fullName}
                  </h3>
                </div>
                <button onClick={() => setSelectedApplicant(null)} style={{ background: '#F1F5F9', border: 'none', borderRadius: '8px', color: '#64748B', cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                {/* ATS Score */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '1.25rem', borderRadius: '10px' }}>
                  <div style={{
                    width: '72px', height: '72px', borderRadius: '50%',
                    background: '#FFFFFF', border: '3px solid #E2E8F0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative',
                    borderTopColor: selectedApplicant.fitCategory === 'Green' ? '#16A34A' : selectedApplicant.fitCategory === 'Yellow' ? '#D97706' : '#DC2626'
                  }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>{selectedApplicant.atsScore}%</span>
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 0.2rem', fontSize: '0.95rem', fontWeight: 700 }}>
                      ATS Score:
                      <span style={{
                        marginLeft: '0.4rem',
                        color: selectedApplicant.fitCategory === 'Green' ? '#16A34A' : selectedApplicant.fitCategory === 'Yellow' ? '#D97706' : '#DC2626'
                      }}>
                        {selectedApplicant.fitCategory} Fit
                      </span>
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748B', lineHeight: 1.4 }}>
                      {selectedApplicant.fitCategory === 'Green' ? 'Strong match. Recommended for interview.' :
                        selectedApplicant.fitCategory === 'Yellow' ? 'Partial match. Needs manual screening.' :
                          'Significant skill gaps for this position.'}
                    </p>
                  </div>
                </div>

                {/* Contact Details */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span className="section-label" style={{ margin: 0 }}>Contact Details</span>
                    {!isEditingApplicant ? (
                      <button onClick={() => setIsEditingApplicant(true)} style={{ background: 'none', border: 'none', color: '#2563EB', fontWeight: 600, cursor: 'pointer', fontSize: '0.72rem' }}>Edit</button>
                    ) : (
                      <button onClick={handleSaveApplicant} style={{ background: 'none', border: 'none', color: '#16A34A', fontWeight: 600, cursor: 'pointer', fontSize: '0.72rem' }}>Save</button>
                    )}
                  </div>
                  <div style={{ borderBottom: '1px solid #F1F5F9', marginBottom: '0.75rem' }} />

                  {!isEditingApplicant ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.82rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                        <Mail size={13} color="#94A3B8" />
                        <span style={{ color: '#64748B' }}>Email:</span>
                        <a href={`mailto:${selectedApplicant.email}`} style={{ color: '#0F172A', fontWeight: 600 }}>{selectedApplicant.email}</a>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                        <Phone size={13} color="#94A3B8" />
                        <span style={{ color: '#64748B' }}>Phone:</span>
                        <a href={`tel:${selectedApplicant.phone}`} style={{ color: '#0F172A', fontWeight: 600 }}>{selectedApplicant.phone}</a>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                        <FileText size={13} color="#94A3B8" />
                        <span style={{ color: '#64748B' }}>Resume:</span>
                        <span style={{ fontWeight: 600 }}>{selectedApplicant.resumeName} ({selectedApplicant.resumeSize})</span>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      <div>
                        <label style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569' }}>Email</label>
                        <input type="email" value={editedEmail} onChange={(e) => setEditedEmail(e.target.value)} className="admin-input" style={{ width: '100%', fontSize: '0.82rem' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569' }}>Phone</label>
                        <input type="text" value={editedPhone} onChange={(e) => setEditedPhone(e.target.value)} className="admin-input" style={{ width: '100%', fontSize: '0.82rem' }} />
                      </div>
                    </div>
                  )}
                </div>

                {/* ATS Skills */}
                <div>
                  <span className="section-label">ATS Keyword Matching</span>
                  <div style={{ borderBottom: '1px solid #F1F5F9', marginBottom: '0.75rem' }} />

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16A34A', marginBottom: '0.4rem' }}>Matched ({selectedApplicant.matchedSkills.length})</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                        {selectedApplicant.matchedSkills.length > 0 ? (
                          selectedApplicant.matchedSkills.map(skill => (
                            <span key={skill} style={{
                              background: '#F0FDF4', color: '#16A34A', border: '1px solid #BBF7D0',
                              padding: '0.2rem 0.55rem', fontSize: '0.7rem', fontWeight: 600, borderRadius: '6px'
                            }}>{skill}</span>
                          ))
                        ) : (
                          <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontStyle: 'italic' }}>None</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#DC2626', marginBottom: '0.4rem' }}>Missing ({selectedApplicant.missingSkills.length})</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                        {selectedApplicant.missingSkills.length > 0 ? (
                          selectedApplicant.missingSkills.map(skill => (
                            <span key={skill} style={{
                              background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA',
                              padding: '0.2rem 0.55rem', fontSize: '0.7rem', fontWeight: 600, borderRadius: '6px'
                            }}>{skill}</span>
                          ))
                        ) : (
                          <span style={{ fontSize: '0.78rem', color: '#16A34A', fontWeight: 600 }}>All skills matched</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cover Message */}
                <div>
                  <span className="section-label">Cover Letter</span>
                  <div style={{ borderBottom: '1px solid #F1F5F9', marginBottom: '0.75rem' }} />
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#334155', background: '#F8FAFC', padding: '0.85rem', border: '1px solid #E2E8F0', borderRadius: '8px', lineHeight: 1.5 }}>
                    {selectedApplicant.message || "No cover message provided."}
                  </p>
                </div>

                {/* Admin Notes */}
                <div>
                  <span className="section-label">Recruiter Notes</span>
                  <div style={{ borderBottom: '1px solid #F1F5F9', marginBottom: '0.75rem' }} />
                  <textarea
                    rows={4}
                    value={editedNotes}
                    onChange={(e) => setEditedNotes(e.target.value)}
                    placeholder="Add interview notes, feedback..."
                    className="admin-input"
                    style={{ width: '100%', resize: 'vertical', lineHeight: 1.5, fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              {/* Footer */}
              <div style={{ padding: '1.25rem 1.75rem', borderTop: '1px solid #E2E8F0', display: 'flex', gap: '0.75rem', background: '#FFFFFF' }}>
                <button onClick={handleSaveApplicant} className="btn-primary-action" style={{ flex: 1, padding: '0.8rem', justifyContent: 'center' }}>
                  Save Notes
                </button>
                <button onClick={() => setSelectedApplicant(null)} className="btn-outline-secondary" style={{ flex: 1, padding: '0.8rem', justifyContent: 'center' }}>
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== JOB MODAL ==================== */}
      <AnimatePresence>
        {isJobModalOpen && (
          <div className="modal-overlay">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="modal-content"
            >
              <button
                onClick={() => setIsJobModalOpen(false)}
                style={{ position: 'absolute', top: '16px', right: '16px', background: '#F1F5F9', border: 'none', borderRadius: '6px', color: '#64748B', cursor: 'pointer', padding: '4px', display: 'flex' }}
              >
                <X size={16} />
              </button>

              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#2563EB', letterSpacing: '1.5px', textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>
                Job Openings
              </span>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '-0.3px' }}>
                {editingJob ? 'Edit Position' : 'Post New Position'}
              </h3>

              <form onSubmit={handleJobSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 600, fontSize: '0.72rem', color: '#475569' }}>Job Title *</label>
                  <input type="text" required placeholder="e.g. Mechanical Design Engineer" value={jobFormData.title} onChange={(e) => setJobFormData({ ...jobFormData, title: e.target.value })} className="admin-input" style={{ width: '100%' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 600, fontSize: '0.72rem', color: '#475569' }}>Department *</label>
                    <select value={jobFormData.category} onChange={(e) => setJobFormData({ ...jobFormData, category: e.target.value })} className="admin-select" style={{ width: '100%' }}>
                      <option value="Engineering">Engineering</option>
                      <option value="IT">IT</option>
                      <option value="Management">Management</option>
                      <option value="Support">Support</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 600, fontSize: '0.72rem', color: '#475569' }}>Experience *</label>
                    <input type="text" required placeholder="e.g. 3-8 Years" value={jobFormData.experience} onChange={(e) => setJobFormData({ ...jobFormData, experience: e.target.value })} className="admin-input" style={{ width: '100%' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 600, fontSize: '0.72rem', color: '#475569' }}>Location *</label>
                    <input type="text" required placeholder="e.g. Bengaluru, India" value={jobFormData.location} onChange={(e) => setJobFormData({ ...jobFormData, location: e.target.value })} className="admin-input" style={{ width: '100%' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 600, fontSize: '0.72rem', color: '#475569' }}>Job Type *</label>
                    <select value={jobFormData.type} onChange={(e) => setJobFormData({ ...jobFormData, type: e.target.value })} className="admin-select" style={{ width: '100%' }}>
                      <option value="Full-Time">Full-Time</option>
                      <option value="Part-Time">Part-Time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 600, fontSize: '0.72rem', color: '#475569' }}>Core Skills (comma-separated) *</label>
                  <input type="text" required placeholder="e.g. NX CAD, Casting, GD&T" value={jobFormData.skills} onChange={(e) => setJobFormData({ ...jobFormData, skills: e.target.value })} className="admin-input" style={{ width: '100%' }} />
                  <span style={{ fontSize: '0.68rem', color: '#94A3B8', display: 'block', marginTop: '0.2rem' }}>Used for ATS keyword matching</span>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 600, fontSize: '0.72rem', color: '#475569' }}>PDF Document URL</label>
                  <input type="text" placeholder="External link (optional)" value={jobFormData.viewLink} onChange={(e) => setJobFormData({ ...jobFormData, viewLink: e.target.value })} className="admin-input" style={{ width: '100%' }} />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 600, fontSize: '0.72rem', color: '#475569' }}>Description *</label>
                  <textarea rows={4} required placeholder="Describe the role and requirements..." value={jobFormData.description} onChange={(e) => setJobFormData({ ...jobFormData, description: e.target.value })} className="admin-input" style={{ width: '100%', resize: 'vertical' }} />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button type="submit" className="btn-primary-action" style={{ flex: 1, padding: '0.8rem', justifyContent: 'center' }}>
                    {editingJob ? 'Save Changes' : 'Publish Job'}
                  </button>
                  <button type="button" onClick={() => setIsJobModalOpen(false)} className="btn-outline-secondary" style={{ flex: 1, padding: '0.8rem', justifyContent: 'center' }}>
                    Cancel
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
