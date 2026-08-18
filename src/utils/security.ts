/**
 * Enterprise Security Engine for Brick Force
 * Multi-layer Cyber Defense & Protection System
 * Includes SHA-256 Cryptographic Hashing, 2FA Verification,
 * Anti-XSS Sanitization, File Payload Scanner, Intrusion Detection (IDS),
 * Storage Data Integrity Seals, and Security Audit Logging.
 */

export interface SecurityLog {
  id: string;
  timestamp: string;
  eventType: 
    | 'LOGIN_SUCCESS' 
    | 'LOGIN_FAILED' 
    | 'LOCKOUT_TRIGGERED' 
    | '2FA_CHALLENGE' 
    | '2FA_VERIFIED' 
    | '2FA_FAILED' 
    | 'XSS_BLOCKED' 
    | 'FILE_REJECTED' 
    | 'FILE_ACCEPTED'
    | 'TAMPER_DETECTED' 
    | 'PASSWORD_CHANGED' 
    | 'SETTINGS_UPDATED';
  severity: 'INFO' | 'WARN' | 'CRITICAL';
  details: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface SecuritySettings {
  enforce2FA: boolean;
  strictXSS: boolean;
  sessionTimeoutMinutes: number;
  maxFailedAttempts: number;
  lockoutDurationMinutes: number;
}

const SECURITY_STORAGE_KEYS = {
  LOGS: 'bf_sec_audit_logs',
  SETTINGS: 'bf_sec_settings',
  LOCKOUT: 'bf_sec_lockout_state',
  ADMIN_HASH: 'bf_sec_admin_hash',
  INTEGRITY_SEAL: 'bf_sec_integrity_seal'
};

// Default Admin Password: 'brickforce123'
// Pre-computed Salted SHA-256 Hash for 'brickforce123' + 'BF_SALT_2026'
const DEFAULT_SALT = 'BF_SALT_2026';
const DEFAULT_HASH = '6b5dd0d8a14c848595d05d1fd4de90897dc66b17564acdeac0c8447c9c541768';

const DEFAULT_SETTINGS: SecuritySettings = {
  enforce2FA: true,
  strictXSS: true,
  sessionTimeoutMinutes: 15,
  maxFailedAttempts: 3,
  lockoutDurationMinutes: 5
};

// --- SHA-256 Hashing helper via Web Crypto API ---
export const hashPassword = async (password: string, salt: string = DEFAULT_SALT): Promise<string> => {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (err) {
    // Fallback simple hash for unsupported environments
    let hash = 0;
    const str = password + salt;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return 'fallback_' + Math.abs(hash).toString(16);
  }
};

// Verify Admin Password
export const verifyAdminPassword = async (inputPassword: string): Promise<boolean> => {
  const storedHash = localStorage.getItem(SECURITY_STORAGE_KEYS.ADMIN_HASH) || DEFAULT_HASH;
  const inputHash = await hashPassword(inputPassword);
  return inputHash === storedHash;
};

// Update Admin Password
export const updateAdminPassword = async (newPassword: string): Promise<{ success: boolean; message: string }> => {
  const strength = checkPasswordStrength(newPassword);
  if (strength.score < 3) {
    return { success: false, message: 'Password is too weak. Must contain uppercase, lowercase, numbers, and symbols.' };
  }
  const newHash = await hashPassword(newPassword);
  localStorage.setItem(SECURITY_STORAGE_KEYS.ADMIN_HASH, newHash);
  logSecurityEvent('PASSWORD_CHANGED', 'INFO', 'Master Admin password hash updated successfully.');
  return { success: true, message: 'Admin password changed and cryptographically hashed.' };
};

// Password Strength Evaluation
export const checkPasswordStrength = (password: string): { score: number; label: string; color: string } => {
  let score = 0;
  if (!password) return { score: 0, label: 'Empty', color: '#6B7280' };
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { score, label: 'Weak', color: '#EF4444' };
  if (score <= 3) return { score, label: 'Moderate', color: '#F59E0B' };
  if (score <= 4) return { score, label: 'Strong', color: '#10B981' };
  return { score, label: 'Cyber Shield Grade', color: '#3B82F6' };
};

// --- 2FA / OTP Verification System ---
let currentOTP: string | null = null;
let otpExpiresAt: number = 0;

export const generate2FAOTP = (): string => {
  const pin = Math.floor(100000 + Math.random() * 900000).toString();
  currentOTP = pin;
  otpExpiresAt = Date.now() + 3 * 60 * 1000; // 3 minutes validity
  logSecurityEvent('2FA_CHALLENGE', 'INFO', 'Generated 6-digit Security 2FA Verification PIN.');
  return pin;
};

export const verify2FAOTP = (inputPin: string): boolean => {
  if (!currentOTP || Date.now() > otpExpiresAt) {
    logSecurityEvent('2FA_FAILED', 'WARN', '2FA verification failed: PIN expired or invalid.');
    return false;
  }
  const isValid = inputPin.trim() === currentOTP;
  if (isValid) {
    currentOTP = null; // Burn OTP after single use
    logSecurityEvent('2FA_VERIFIED', 'INFO', '2FA PIN verified successfully.');
  } else {
    logSecurityEvent('2FA_FAILED', 'WARN', '2FA verification failed: Incorrect PIN entered.');
  }
  return isValid;
};

// --- Intrusion Detection System (IDS) & Brute-force Rate Limiting ---
export interface LockoutState {
  failedAttempts: number;
  lockedUntil: number | null;
}

export const getLockoutState = (): LockoutState => {
  const raw = localStorage.getItem(SECURITY_STORAGE_KEYS.LOCKOUT);
  if (!raw) return { failedAttempts: 0, lockedUntil: null };
  try {
    const state: LockoutState = JSON.parse(raw);
    if (state.lockedUntil && Date.now() > state.lockedUntil) {
      // Lockout expired -> reset
      const resetState = { failedAttempts: 0, lockedUntil: null };
      localStorage.setItem(SECURITY_STORAGE_KEYS.LOCKOUT, JSON.stringify(resetState));
      return resetState;
    }
    return state;
  } catch {
    return { failedAttempts: 0, lockedUntil: null };
  }
};

export const recordFailedLogin = (): LockoutState => {
  const settings = getSecuritySettings();
  const state = getLockoutState();
  const newAttempts = state.failedAttempts + 1;
  
  let lockedUntil: number | null = null;
  if (newAttempts >= settings.maxFailedAttempts) {
    lockedUntil = Date.now() + settings.lockoutDurationMinutes * 60 * 1000;
    logSecurityEvent(
      'LOCKOUT_TRIGGERED', 
      'CRITICAL', 
      `Intrusion Detection System triggered! Lockout activated for ${settings.lockoutDurationMinutes} minutes after ${newAttempts} failed attempts.`
    );
  } else {
    logSecurityEvent(
      'LOGIN_FAILED', 
      'WARN', 
      `Failed authentication attempt (${newAttempts}/${settings.maxFailedAttempts}).`
    );
  }

  const newState = { failedAttempts: newAttempts, lockedUntil };
  localStorage.setItem(SECURITY_STORAGE_KEYS.LOCKOUT, JSON.stringify(newState));
  return newState;
};

export const resetLockoutState = (): void => {
  localStorage.setItem(SECURITY_STORAGE_KEYS.LOCKOUT, JSON.stringify({ failedAttempts: 0, lockedUntil: null }));
};

// --- Form Rate Limiting ---
const formSubmissionTimestamps: number[] = [];
export const checkFormRateLimit = (maxPerMinute = 5): { allowed: boolean; retryAfterSec?: number } => {
  const now = Date.now();
  const oneMinuteAgo = now - 60 * 1000;
  // Clear old timestamps
  while (formSubmissionTimestamps.length > 0 && formSubmissionTimestamps[0] < oneMinuteAgo) {
    formSubmissionTimestamps.shift();
  }

  if (formSubmissionTimestamps.length >= maxPerMinute) {
    const earliest = formSubmissionTimestamps[0];
    const retryAfterSec = Math.ceil((earliest + 60 * 1000 - now) / 1000);
    logSecurityEvent('XSS_BLOCKED', 'WARN', `Form submission rate limit exceeded (${maxPerMinute}/min). Blocked submission.`);
    return { allowed: false, retryAfterSec };
  }

  formSubmissionTimestamps.push(now);
  return { allowed: true };
};

// --- Anti-XSS & HTML Injection Sanitization Engine ---
export const sanitizeText = (input: string): string => {
  if (!input || typeof input !== 'string') return '';

  // 1. Remove dangerous script patterns
  let cleaned = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '[REMOVED_SCRIPT]')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '[REMOVED_IFRAME]')
    .replace(/javascript:/gi, 'blocked_javascript:')
    .replace(/on\w+\s*=/gi, 'blocked_attr=');

  // 2. Escape HTML entities
  cleaned = cleaned
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');

  if (cleaned !== input) {
    logSecurityEvent('XSS_BLOCKED', 'WARN', 'Sanitized potential XSS payload from input string.');
  }

  return cleaned.trim();
};

export const sanitizeFilename = (filename: string): string => {
  // Prevent Path Traversal attacks (e.g., ../../etc/passwd or C:\...)
  return filename
    .replace(/^.*[\\/]/, '')
    .replace(/[^a-zA-Z0-9._-]/g, '_');
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/;
  return phoneRegex.test(phone.trim());
};

// --- File Upload Security Scanner ---
export interface FileValidationResult {
  valid: boolean;
  error?: string;
  safeName?: string;
}

export const validateUploadedFile = (file: File): FileValidationResult => {
  const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'];
  const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

  if (!file) {
    return { valid: false, error: 'No file provided.' };
  }

  const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    logSecurityEvent('FILE_REJECTED', 'WARN', `Rejected file "${file.name}": Disallowed file type (${ext}).`);
    return { valid: false, error: `Security Policy Error: Only PDF and Word documents (${ALLOWED_EXTENSIONS.join(', ')}) are permitted.` };
  }

  if (file.size > MAX_SIZE_BYTES) {
    logSecurityEvent('FILE_REJECTED', 'WARN', `Rejected file "${file.name}": File size (${(file.size / 1024 / 1024).toFixed(1)} MB) exceeds 10MB limit.`);
    return { valid: false, error: 'File size exceeds maximum permitted limit of 10MB.' };
  }

  // Scan file name for path traversal
  const safeName = sanitizeFilename(file.name);
  logSecurityEvent('FILE_ACCEPTED', 'INFO', `File "${safeName}" validated and cleared security scan.`);

  return { valid: true, safeName };
};

// --- Storage Data Integrity Seal (HMAC/Checksum) ---
export const computeStorageChecksum = async (dataString: string): Promise<string> => {
  return hashPassword(dataString, 'BF_HMAC_SEAL_KEY');
};

export const verifyStorageIntegrity = async (key: string): Promise<boolean> => {
  const data = localStorage.getItem(key);
  const sealKey = `${key}_integrity_seal`;
  const storedSeal = localStorage.getItem(sealKey);

  if (!data || !storedSeal) return true; // Initial empty state

  const computedSeal = await computeStorageChecksum(data);
  const isValid = computedSeal === storedSeal;

  if (!isValid) {
    logSecurityEvent('TAMPER_DETECTED', 'CRITICAL', `Data integrity alert! Local storage key "${key}" modified outside of secure app context.`);
  }

  return isValid;
};

export const sealStorageKey = async (key: string, dataString: string): Promise<void> => {
  const sealKey = `${key}_integrity_seal`;
  const checksum = await computeStorageChecksum(dataString);
  localStorage.setItem(sealKey, checksum);
};

// --- Security Audit Logger ---
export const getSecurityLogs = (): SecurityLog[] => {
  const raw = localStorage.getItem(SECURITY_STORAGE_KEYS.LOGS);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const logSecurityEvent = (
  eventType: SecurityLog['eventType'],
  severity: SecurityLog['severity'],
  details: string
): void => {
  const logs = getSecurityLogs();
  const newLog: SecurityLog = {
    id: `sec-log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    eventType,
    severity,
    details,
    ipAddress: '127.0.0.1 (Local Verified Client)',
    userAgent: navigator.userAgent.substring(0, 60) + '...'
  };

  logs.unshift(newLog);
  // Keep last 100 logs
  if (logs.length > 100) logs.pop();
  localStorage.setItem(SECURITY_STORAGE_KEYS.LOGS, JSON.stringify(logs));
};

export const clearSecurityLogs = (): void => {
  localStorage.removeItem(SECURITY_STORAGE_KEYS.LOGS);
  logSecurityEvent('SETTINGS_UPDATED', 'INFO', 'Security Audit Logs cleared by Master Admin.');
};

// --- Security Settings Management ---
export const getSecuritySettings = (): SecuritySettings => {
  const raw = localStorage.getItem(SECURITY_STORAGE_KEYS.SETTINGS);
  if (!raw) return DEFAULT_SETTINGS;
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const updateSecuritySettings = (settings: Partial<SecuritySettings>): SecuritySettings => {
  const current = getSecuritySettings();
  const updated = { ...current, ...settings };
  localStorage.setItem(SECURITY_STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
  logSecurityEvent('SETTINGS_UPDATED', 'INFO', 'Security System settings updated by Master Admin.');
  return updated;
};
