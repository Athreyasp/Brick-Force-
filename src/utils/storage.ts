import { sanitizeText, sealStorageKey, verifyStorageIntegrity } from './security';

export interface Job {
  id: string;
  title: string;
  category: string;
  experience: string;
  skills: string; // Comma-separated
  type: string;
  location: string;
  viewLink: string;
  description: string;
}

export interface Applicant {
  id: string;
  jobTitle: string;
  fullName: string;
  email: string;
  phone: string;
  resumeName: string;
  resumeSize: string;
  message: string;
  atsScore: number;
  fitCategory: 'Green' | 'Yellow' | 'Red';
  matchedSkills: string[];
  missingSkills: string[];
  adminNotes: string;
  createdAt: string;
}

export interface Review {
  id: string;
  authorName: string;
  role: 'Candidate' | 'Client';
  rating: number;
  content: string;
  isApproved: boolean;
  createdAt: string;
}

const STORAGE_KEYS = {
  JOBS: 'brickforce_jobs',
  APPLICANTS: 'brickforce_applicants',
  REVIEWS: 'brickforce_reviews'
};

const DEFAULT_JOBS: Job[] = [
  {
    id: 'job-1',
    title: 'MDE (NX & Casting)',
    category: 'Engineering',
    experience: '3-8 Years',
    skills: 'NX CAD, Casting, Tool Design, GD&T, Teamcenter',
    type: 'Full-Time',
    location: 'Bengaluru, India',
    viewLink: 'https://www.brickforcecs.com/_files/ugd/68d97d_6aba61977b504a6a9647ba1d72488fb6.pdf?index=true',
    description: 'We are seeking an experienced Manufacturing Design Engineer specializing in Siemens NX and Casting designs. The ideal candidate has strong casting tooling design knowledge, experience in GD&T, and drafting conventions.'
  },
  {
    id: 'job-2',
    title: 'Load Engineer',
    category: 'Engineering',
    experience: '2-5 Years',
    skills: 'Load Calculation, FEM, Mathcad, Wind Turbine, Structural Analysis',
    type: 'Full-Time',
    location: 'Bengaluru, India',
    viewLink: 'https://www.brickforcecs.com/_files/ugd/68d97d_663e93a385b14723a14d49421922272a.pdf',
    description: 'Looking for a Load Engineer to perform structural load calculations and structural analysis. Experience with Wind Turbine loads, FEM software, and Mathcad is highly preferred.'
  },
  {
    id: 'job-3',
    title: 'Web Developer',
    category: 'IT',
    experience: '1-4 Years',
    skills: 'React.js, CSS, JavaScript, HTML5, TypeScript, TailwindCSS',
    type: 'Full-Time',
    location: 'Bengaluru, India',
    viewLink: 'https://www.brickforcecs.com/_files/ugd/68d97d_4a6af86580c049a9bca0b44bb527142e.pdf',
    description: 'Seeking a frontend Web Developer to build beautiful, responsive web applications. Must be proficient in React.js, TypeScript, CSS layout techniques, and modern bundle tools.'
  },
  {
    id: 'job-4',
    title: 'Test Automation Engineer',
    category: 'IT',
    experience: '3-6 Years',
    skills: 'Selenium, Java, TestNG, Jenkins, Git, API Testing',
    type: 'Full-Time',
    location: 'Bengaluru, India',
    viewLink: '#',
    description: 'We are looking for a Test Automation Engineer to design, build, and maintain automation testing scripts using Selenium with Java. Knowledge of CI/CD integration using Jenkins is a major plus.'
  }
];

const DEFAULT_APPLICANTS: Applicant[] = [
  {
    id: 'app-1',
    jobTitle: 'Web Developer',
    fullName: 'Rahul Sen',
    email: 'rahul.sen@gmail.com',
    phone: '+91 98765 43210',
    resumeName: 'Rahul_Sen_Resume_WebDev.pdf',
    resumeSize: '1.2 MB',
    message: 'I have 3 years of experience in React.js, TypeScript, and CSS, and I love building modern, clean responsive designs. I would love to join your team!',
    atsScore: 92,
    fitCategory: 'Green',
    matchedSkills: ['React.js', 'TypeScript', 'JavaScript', 'CSS', 'HTML5'],
    missingSkills: ['TailwindCSS'],
    adminNotes: 'Excellent portfolio. Strong UI coding skills shown in his demo projects. Recommended for interview.',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
  },
  {
    id: 'app-2',
    jobTitle: 'MDE (NX & Casting)',
    fullName: 'Amith Hegde',
    email: 'amith.hegde@outlook.com',
    phone: '+91 87654 32109',
    resumeName: 'Amith_Hegde_CV_Engineering.pdf',
    resumeSize: '2.4 MB',
    message: 'Hello, I have worked as a design associate for 4 years. I am comfortable with Siemens NX casting, though I have only basic experience in GD&T.',
    atsScore: 68,
    fitCategory: 'Yellow',
    matchedSkills: ['NX CAD', 'Casting', 'Tool Design'],
    missingSkills: ['GD&T', 'Teamcenter'],
    adminNotes: 'Good experience with NX casting. Needs technical screening on GD&T and Teamcenter details.',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
  },
  {
    id: 'app-3',
    jobTitle: 'Test Automation Engineer',
    fullName: 'Priya Sharma',
    email: 'priya.sharma@yahoo.com',
    phone: '+91 76543 21098',
    resumeName: 'Priya_S_Resume.pdf',
    resumeSize: '850 KB',
    message: 'I am a manual QA looking to transition into automation. I know basic Git and API manual testing.',
    atsScore: 38,
    fitCategory: 'Red',
    matchedSkills: ['Git'],
    missingSkills: ['Selenium', 'Java', 'TestNG', 'Jenkins', 'API Testing'],
    adminNotes: 'Mainly manual experience. Lacks Selenium and Java automation capabilities required for this role.',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() // 6 hours ago
  }
];

// Initialize storage with default values if empty
export const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.JOBS)) {
    const jobsStr = JSON.stringify(DEFAULT_JOBS);
    localStorage.setItem(STORAGE_KEYS.JOBS, jobsStr);
    sealStorageKey(STORAGE_KEYS.JOBS, jobsStr);
  }
  if (!localStorage.getItem(STORAGE_KEYS.APPLICANTS)) {
    const appsStr = JSON.stringify(DEFAULT_APPLICANTS);
    localStorage.setItem(STORAGE_KEYS.APPLICANTS, appsStr);
    sealStorageKey(STORAGE_KEYS.APPLICANTS, appsStr);
  }
  if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
    const revsStr = JSON.stringify(DEFAULT_REVIEWS);
    localStorage.setItem(STORAGE_KEYS.REVIEWS, revsStr);
    sealStorageKey(STORAGE_KEYS.REVIEWS, revsStr);
  }

  // Verify storage integrity in background
  verifyStorageIntegrity(STORAGE_KEYS.JOBS);
  verifyStorageIntegrity(STORAGE_KEYS.APPLICANTS);
  verifyStorageIntegrity(STORAGE_KEYS.REVIEWS);
};

const DEFAULT_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    authorName: 'Vikram Aditya',
    role: 'Candidate',
    rating: 5,
    content: 'Through Brick Force, I landed my dream job as an MDE casting engineer. The interview prep guidelines and quick feedback cycles were super helpful!',
    isApproved: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'rev-2',
    authorName: 'Sunita Rao',
    role: 'Client',
    rating: 5,
    content: 'Brick Force Group has been our go-to staffing partner for technical engineering roles. Their candidates are highly aligned to our core requirements. Recommended!',
    isApproved: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Jobs CRUD
export const getJobs = (): Job[] => {
  initializeStorage();
  const jobsJson = localStorage.getItem(STORAGE_KEYS.JOBS);
  return jobsJson ? JSON.parse(jobsJson) : [];
};

export const saveJob = (job: Omit<Job, 'id'> & { id?: string }): Job => {
  const jobs = getJobs();
  let savedJob: Job;

  const sanitizedJob = {
    ...job,
    title: sanitizeText(job.title),
    category: sanitizeText(job.category),
    experience: sanitizeText(job.experience),
    skills: sanitizeText(job.skills),
    type: sanitizeText(job.type),
    location: sanitizeText(job.location),
    description: sanitizeText(job.description)
  };

  if (sanitizedJob.id) {
    // Edit existing
    const index = jobs.findIndex(j => j.id === sanitizedJob.id);
    if (index !== -1) {
      jobs[index] = { ...jobs[index], ...sanitizedJob } as Job;
    }
    savedJob = jobs.find(j => j.id === sanitizedJob.id) as Job;
  } else {
    // Create new
    const newId = `job-${Date.now()}`;
    savedJob = { ...sanitizedJob, id: newId } as Job;
    jobs.push(savedJob);
  }

  const jobsStr = JSON.stringify(jobs);
  localStorage.setItem(STORAGE_KEYS.JOBS, jobsStr);
  sealStorageKey(STORAGE_KEYS.JOBS, jobsStr);
  return savedJob;
};

export const deleteJob = (id: string): void => {
  const jobs = getJobs();
  const filtered = jobs.filter(j => j.id !== id);
  const jobsStr = JSON.stringify(filtered);
  localStorage.setItem(STORAGE_KEYS.JOBS, jobsStr);
  sealStorageKey(STORAGE_KEYS.JOBS, jobsStr);
};

// Applicants CRU
export const getApplicants = (): Applicant[] => {
  initializeStorage();
  const applicantsJson = localStorage.getItem(STORAGE_KEYS.APPLICANTS);
  return applicantsJson ? JSON.parse(applicantsJson) : [];
};

export const addApplicant = (applicant: Omit<Applicant, 'id' | 'atsScore' | 'fitCategory' | 'matchedSkills' | 'missingSkills' | 'createdAt'>): Applicant => {
  const applicants = getApplicants();
  const jobs = getJobs();

  // Sanitize applicant details against XSS
  const sanitizedApplicant = {
    ...applicant,
    fullName: sanitizeText(applicant.fullName),
    email: sanitizeText(applicant.email),
    phone: sanitizeText(applicant.phone),
    resumeName: sanitizeText(applicant.resumeName),
    message: sanitizeText(applicant.message),
    adminNotes: sanitizeText(applicant.adminNotes || '')
  };

  // Find job to get skills
  const job = jobs.find(j => j.title === sanitizedApplicant.jobTitle);
  const jobSkills = job ? job.skills : '';

  // Extract simulated keywords from file name + cover letter to run parser
  const textContext = `${sanitizedApplicant.resumeName} ${sanitizedApplicant.fullName} ${sanitizedApplicant.message}`;
  const atsResults = calculateATSScore(textContext, jobSkills);

  const newApplicant: Applicant = {
    ...sanitizedApplicant,
    id: `app-${Date.now()}`,
    atsScore: atsResults.score,
    fitCategory: atsResults.fitCategory,
    matchedSkills: atsResults.matchedSkills,
    missingSkills: atsResults.missingSkills,
    createdAt: new Date().toISOString()
  };

  applicants.push(newApplicant);
  const appsStr = JSON.stringify(applicants);
  localStorage.setItem(STORAGE_KEYS.APPLICANTS, appsStr);
  sealStorageKey(STORAGE_KEYS.APPLICANTS, appsStr);
  return newApplicant;
};

export const updateApplicant = (applicant: Applicant): Applicant => {
  const applicants = getApplicants();
  const index = applicants.findIndex(a => a.id === applicant.id);
  if (index !== -1) {
    applicants[index] = applicant;
    localStorage.setItem(STORAGE_KEYS.APPLICANTS, JSON.stringify(applicants));
  }
  return applicant;
};

// ATS Core Scoring Function
export const calculateATSScore = (
  textContext: string,
  jobSkills: string
): {
  score: number;
  fitCategory: 'Green' | 'Yellow' | 'Red';
  matchedSkills: string[];
  missingSkills: string[];
} => {
  if (!jobSkills) {
    return {
      score: 50,
      fitCategory: 'Yellow',
      matchedSkills: [],
      missingSkills: []
    };
  }

  const skillsList = jobSkills.split(',').map(s => s.trim().toLowerCase());
  const words = textContext.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, ' ').split(/\s+/);

  const matched: string[] = [];
  const missing: string[] = [];

  skillsList.forEach(skill => {
    // Check if the skill word exists in file metadata or context text
    if (words.includes(skill) || textContext.toLowerCase().includes(skill)) {
      matched.push(skill);
    } else {
      missing.push(skill);
    }
  });

  const skillMatchPercentage = skillsList.length > 0
    ? (matched.length / skillsList.length) * 100
    : 100;

  // Add random factors based on quality of application (experience keywords)
  let extraScore = 0;
  const qualityKeywords = ['experience', 'project', 'team', 'lead', 'design', 'develop', 'manage', 'degree', 'engineer', 'senior'];
  qualityKeywords.forEach(kw => {
    if (textContext.toLowerCase().includes(kw)) {
      extraScore += 3;
    }
  });

  // Calculate final score
  const baseScore = skillMatchPercentage * 0.75 + extraScore;
  // Ensure the score is realistic (between 15 and 100)
  const finalScore = Math.min(100, Math.max(15, Math.round(baseScore)));

  let fitCategory: 'Green' | 'Yellow' | 'Red' = 'Red';
  if (finalScore >= 80) fitCategory = 'Green';
  else if (finalScore >= 50) fitCategory = 'Yellow';

  // Capitalize properly for return
  const originalSkills = jobSkills.split(',').map(s => s.trim());
  const finalMatched = originalSkills.filter(s => matched.includes(s.toLowerCase()));
  const finalMissing = originalSkills.filter(s => missing.includes(s.toLowerCase()));

  return {
    score: finalScore,
    fitCategory,
    matchedSkills: finalMatched,
    missingSkills: finalMissing
  };
};

// Reviews CRUD
export const getReviews = (): Review[] => {
  initializeStorage();
  const json = localStorage.getItem(STORAGE_KEYS.REVIEWS);
  return json ? JSON.parse(json) : [];
};

export const addReview = (review: Omit<Review, 'id' | 'isApproved' | 'createdAt'>): Review => {
  const reviews = getReviews();
  const sanitizedReview: Review = {
    ...review,
    authorName: sanitizeText(review.authorName),
    content: sanitizeText(review.content),
    id: `rev-${Date.now()}`,
    isApproved: false, // Requires admin approval by default
    createdAt: new Date().toISOString()
  };
  reviews.push(sanitizedReview);
  const revsStr = JSON.stringify(reviews);
  localStorage.setItem(STORAGE_KEYS.REVIEWS, revsStr);
  sealStorageKey(STORAGE_KEYS.REVIEWS, revsStr);
  return sanitizedReview;
};

export const updateReview = (review: Review): Review => {
  const reviews = getReviews();
  const index = reviews.findIndex(r => r.id === review.id);
  if (index !== -1) {
    reviews[index] = {
      ...review,
      authorName: sanitizeText(review.authorName),
      content: sanitizeText(review.content)
    };
    const revsStr = JSON.stringify(reviews);
    localStorage.setItem(STORAGE_KEYS.REVIEWS, revsStr);
    sealStorageKey(STORAGE_KEYS.REVIEWS, revsStr);
  }
  return review;
};

export const deleteReview = (id: string): void => {
  const reviews = getReviews();
  const filtered = reviews.filter(r => r.id !== id);
  const revsStr = JSON.stringify(filtered);
  localStorage.setItem(STORAGE_KEYS.REVIEWS, revsStr);
  sealStorageKey(STORAGE_KEYS.REVIEWS, revsStr);
};
