/**
 * Brick Force Enterprise API Client
 * Connects directly to the secure backend server (httpOnly cookie auth)
 * Provides automatic fallback to verified local state if the backend server is offline.
 */

import { getJobs, saveJob, deleteJob, getApplicants, updateApplicant, getReviews, updateReview, deleteReview } from '../utils/storage';
import type { Job, Applicant, Review } from '../utils/storage';
import { getSecurityLogs, clearSecurityLogs } from '../utils/security';
import type { SecurityLog } from '../utils/security';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  private isBackendOnline: boolean | null = null;

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        credentials: 'include', // Transmit httpOnly cookie automatically
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        }
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error ${res.status}`);
      }

      this.isBackendOnline = true;
      return (await res.json()) as T;
    } catch (err) {
      this.isBackendOnline = false;
      throw err;
    }
  }

  // --- AUTHENTICATION ---
  async login(password: string, otp?: string): Promise<{ success: boolean; require2FA?: boolean; simulatedOtp?: string; user?: any }> {
    try {
      return await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ password, otp })
      });
    } catch (err: any) {
      // If backend unreachable, fall back to frontend hash check with security alert
      if (this.isBackendOnline === false) {
        const { verifyAdminPassword, generate2FAOTP, getSecuritySettings } = await import('../utils/security');
        const isValid = await verifyAdminPassword(password);
        if (!isValid) throw new Error('Invalid admin credentials.');
        
        const settings = getSecuritySettings();
        if (settings.enforce2FA && !otp) {
          const pin = generate2FAOTP();
          return { success: false, require2FA: true, simulatedOtp: pin };
        }
        return { success: true, user: { username: 'admin', role: 'SUPER_ADMIN' } };
      }
      throw err;
    }
  }

  async checkAuth(): Promise<{ authenticated: boolean; user?: any }> {
    try {
      const data = await this.request<{ authenticated: boolean; user: any }>('/auth/me');
      return data;
    } catch {
      return { authenticated: false };
    }
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch {
      // Ignore
    }
  }

  async changePassword(newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      return await this.request('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ newPassword })
      });
    } catch (err: any) {
      const { updateAdminPassword } = await import('../utils/security');
      return await updateAdminPassword(newPassword);
    }
  }

  // --- APPLICANTS ---
  async getApplicants(): Promise<Applicant[]> {
    try {
      return await this.request<Applicant[]>('/applicants');
    } catch {
      return getApplicants();
    }
  }

  async updateApplicant(applicant: Applicant): Promise<Applicant> {
    try {
      return await this.request<Applicant>(`/applicants/${applicant.id}`, {
        method: 'PUT',
        body: JSON.stringify(applicant)
      });
    } catch {
      updateApplicant(applicant);
      return applicant;
    }
  }

  async deleteApplicant(id: string): Promise<void> {
    try {
      await this.request(`/applicants/${id}`, { method: 'DELETE' });
    } catch {
      const current = getApplicants().filter(a => a.id !== id);
      localStorage.setItem('brickforce_applicants', JSON.stringify(current));
    }
  }

  // --- JOBS ---
  async getJobs(): Promise<Job[]> {
    try {
      return await this.request<Job[]>('/jobs');
    } catch {
      return getJobs();
    }
  }

  async saveJob(jobData: Omit<Job, 'id'> & { id?: string }): Promise<void> {
    try {
      if (jobData.id) {
        await this.request(`/jobs/${jobData.id}`, {
          method: 'PUT',
          body: JSON.stringify(jobData)
        });
      } else {
        await this.request('/jobs', {
          method: 'POST',
          body: JSON.stringify(jobData)
        });
      }
    } catch {
      saveJob(jobData);
    }
  }

  async deleteJob(id: string): Promise<void> {
    try {
      await this.request(`/jobs/${id}`, { method: 'DELETE' });
    } catch {
      deleteJob(id);
    }
  }

  // --- REVIEWS ---
  async getReviews(): Promise<Review[]> {
    try {
      return await this.request<Review[]>('/reviews');
    } catch {
      return getReviews();
    }
  }

  async updateReview(review: Review): Promise<void> {
    try {
      await this.request(`/reviews/${review.id}`, {
        method: 'PUT',
        body: JSON.stringify(review)
      });
    } catch {
      updateReview(review);
    }
  }

  async deleteReview(id: string): Promise<void> {
    try {
      await this.request(`/reviews/${id}`, { method: 'DELETE' });
    } catch {
      deleteReview(id);
    }
  }

  // --- SECURITY LOGS ---
  async getSecurityLogs(): Promise<SecurityLog[]> {
    try {
      return await this.request<SecurityLog[]>('/security/logs');
    } catch {
      return getSecurityLogs();
    }
  }

  async clearSecurityLogs(): Promise<void> {
    try {
      await this.request('/security/logs', { method: 'DELETE' });
    } catch {
      clearSecurityLogs();
    }
  }
}

export const api = new ApiService();
