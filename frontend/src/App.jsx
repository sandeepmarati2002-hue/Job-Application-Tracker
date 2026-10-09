import React, { useState, useMemo, useEffect, useRef } from 'react';
import './App.css';
import StatCard from './components/StatCard';
import ApplicationCard from './components/ApplicationCard';
import ApplicationModal from './components/ApplicationModal';
import ApplicationDetailModal from './components/ApplicationDetailModal';
import { checkHealth, applicationsApi, interviewsApi, authApi } from './services/api';
import KanbanBoard from './components/KanbanBoard';
import AnalyticsCharts from './components/AnalyticsCharts';
import AuthModal from './components/AuthModal';
import StageFilterPills from './components/StageFilterPills';
import NotificationDropdown from './components/NotificationDropdown';
import ShortcutsModal from './components/ShortcutsModal';
import ProfileEditModal from './components/ProfileEditModal';
import { exportToCSV, exportToJSON } from './utils/exportUtils';
import {
  Briefcase,
  LayoutDashboard,
  Calendar,
  User,
  Plus,
  Search,
  Filter,
  TrendingUp,
  Award,
  XCircle,
  SlidersHorizontal,
  RefreshCw,
  CheckCircle,
  Sun,
  Moon,
  Download,
  Kanban,
  LayoutGrid,
  LogOut,
  ChevronDown,
  X,
  Keyboard,
  MapPin,
  Mail,
  DollarSign,
  Code,
  Globe,
  ExternalLink,
  Edit3,
  Check,
  Tag,
  Sparkles,
} from 'lucide-react';

function GithubIcon({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedinIcon({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

// Production sample seed data so freshers and interviewers immediately see a rich dashboard
const INITIAL_APPLICATIONS = [
  {
    id: 1,
    company: 'Google',
    role: 'Software Engineer Intern',
    location: 'Bangalore, India (Hybrid)',
    salary: '₹1,00,000/month',
    job_url: 'https://careers.google.com',
    status: 'Interview',
    application_date: '2026-09-15',
    description: 'Applied via employee referral. Resume shortlisted for SWE Winter/Summer 2027.',
    interviews: [
      {
        id: 101,
        interview_type: 'Online Assessment (OA)',
        interview_date: '2026-09-22T10:00:00',
        interviewer: 'Automated Platform',
        notes: '2 DSA problems (Graphs and Dynamic Programming). Both test suites passed.',
        result: 'Passed',
      },
      {
        id: 102,
        interview_type: 'Technical Round 1 (DSA)',
        interview_date: '2026-10-05T14:30:00',
        interviewer: 'Senior Staff SDE',
        notes: 'Upcoming: Binary Trees, Dijkstra algorithm, and time complexity tradeoffs.',
        result: 'Pending',
      },
    ],
  },
  {
    id: 2,
    company: 'Microsoft',
    role: 'SDE-1 (Full Stack)',
    location: 'Hyderabad, India',
    salary: '₹18,00,000/year',
    job_url: 'https://careers.microsoft.com',
    status: 'Assessment',
    application_date: '2026-09-18',
    description: 'Codility online coding test link received. 3 algorithmic tasks.',
    interviews: [
      {
        id: 103,
        interview_type: 'Online Assessment (OA)',
        interview_date: '2026-10-02T18:00:00',
        interviewer: 'Codility',
        notes: 'Preparing sliding window and prefix sum patterns.',
        result: 'Pending',
      },
    ],
  },
  {
    id: 3,
    company: 'Razorpay',
    role: 'Backend Engineering Intern',
    location: 'Bangalore, India',
    salary: '₹45,000/month',
    job_url: 'https://razorpay.com/jobs',
    status: 'Offer',
    application_date: '2026-08-28',
    description: 'Selected! Offer letter received for Python/FastAPI payment gateway engineering team.',
    interviews: [
      {
        id: 104,
        interview_type: 'Technical Round 1 (DSA)',
        interview_date: '2026-09-05T11:00:00',
        interviewer: 'Priya Sharma (Tech Lead)',
        notes: 'API rate limiter design, caching with Redis, Python concurrency.',
        result: 'Passed',
      },
      {
        id: 105,
        interview_type: 'Managerial & Culture',
        interview_date: '2026-09-12T16:00:00',
        interviewer: 'Engineering Manager',
        notes: 'Discussed past projects, internship expectations, team values.',
        result: 'Passed',
      },
    ],
  },
  {
    id: 4,
    company: 'Amazon',
    role: 'Software Development Engineer',
    location: 'Hyderabad, India',
    salary: '₹16,50,000/year',
    job_url: 'https://amazon.jobs',
    status: 'Rejected',
    application_date: '2026-08-10',
    description: 'OA completed. Received automated rejection email after 2 weeks.',
    interviews: [
      {
        id: 106,
        interview_type: 'Online Assessment (OA)',
        interview_date: '2026-08-18T09:00:00',
        interviewer: 'HackerRank',
        notes: 'Array manipulation and debugging section.',
        result: 'Failed',
      },
    ],
  },
  {
    id: 5,
    company: 'Atlassian',
    role: 'Graduate Software Developer',
    location: 'Remote, India',
    salary: '₹22,00,000/year',
    job_url: 'https://atlassian.com/careers',
    status: 'Applied',
    application_date: '2026-09-28',
    description: 'Submitted application on careers portal with customized resume.',
    interviews: [],
  },
  {
    id: 6,
    company: 'Uber',
    role: 'Software Development Engineer (Backend)',
    location: 'Bangalore, India',
    salary: '₹24,00,000/year',
    job_url: 'https://uber.com/careers',
    status: 'Interview',
    application_date: '2026-09-20',
    description: 'Referred by Tech Lead for Core Services team (Go / Kafka / Microservices).',
    interviews: [
      {
        id: 107,
        interview_type: 'Online Assessment (OA)',
        interview_date: '2026-09-25T14:00:00',
        interviewer: 'HackerRank',
        notes: '3 Algorithmic problems on graphs, heaps, and string manipulation. All test cases passed.',
        result: 'Passed',
      },
      {
        id: 108,
        interview_type: 'Technical Round 1 (DSA)',
        interview_date: '2026-10-06T11:00:00',
        interviewer: 'Arjun Nair (Senior SDE)',
        notes: 'Concurrency problem on rate limiter and LRU cache with TTL.',
        result: 'Passed',
      },
      {
        id: 109,
        interview_type: 'System Design Round',
        interview_date: '2026-10-15T15:00:00',
        interviewer: 'Staff Engineer',
        notes: 'Design Uber Ride Matching service with real-time geospatial indexing.',
        result: 'Pending',
      },
    ],
  },
  {
    id: 7,
    company: 'Stripe',
    role: 'Full Stack Engineer - Developer Infrastructure',
    location: 'Remote, India',
    salary: '₹28,00,000/year',
    job_url: 'https://stripe.com/jobs',
    status: 'Assessment',
    application_date: '2026-10-01',
    description: 'Applied directly through Stripe jobs page. Resume screened.',
    interviews: [
      {
        id: 110,
        interview_type: 'Take-home Technical Assessment',
        interview_date: '2026-10-10T16:00:00',
        interviewer: 'Stripe Automated Suite',
        notes: 'Building an idempotent webhook event consumer with retry backoff.',
        result: 'Pending',
      },
    ],
  },
  {
    id: 8,
    company: 'Swiggy',
    role: 'SDE-2 (Platform Engineering)',
    location: 'Bangalore, India',
    salary: '₹26,00,000/year',
    job_url: 'https://swiggy.com/careers',
    status: 'Offer',
    application_date: '2026-08-15',
    description: 'Official offer letter received for the Delivery Fulfillment Platform team.',
    interviews: [
      {
        id: 111,
        interview_type: 'Online Assessment (OA)',
        interview_date: '2026-08-20T10:00:00',
        interviewer: 'Mettl',
        notes: 'DP and Segment Trees. 100% score.',
        result: 'Passed',
      },
      {
        id: 112,
        interview_type: 'Technical Round 1 (DSA & Low-Level Design)',
        interview_date: '2026-08-28T14:00:00',
        interviewer: 'Vikram Shenoy',
        notes: 'Designed Splitwise application with clean SOLID principles.',
        result: 'Passed',
      },
      {
        id: 113,
        interview_type: 'Technical Round 2 (High-Level System Design)',
        interview_date: '2026-09-04T16:00:00',
        interviewer: 'Principal Architect',
        notes: 'Real-time order tracking architecture with WebSockets & Redis Pub/Sub.',
        result: 'Passed',
      },
      {
        id: 114,
        interview_type: 'Bar Raiser / Culture Fit',
        interview_date: '2026-09-10T11:30:00',
        interviewer: 'VP of Engineering',
        notes: 'Discussion on mentorship, leadership, and operational incident resolution.',
        result: 'Passed',
      },
    ],
  },
  {
    id: 9,
    company: 'Flipkart',
    role: 'Software Development Engineer - I',
    location: 'Bangalore, India',
    salary: '₹17,50,000/year',
    job_url: 'https://flipkartcareers.com',
    status: 'Applied',
    application_date: '2026-10-04',
    description: 'Applied via campus recruitment drive for Big Billion Days scaling operations.',
    interviews: [],
  },
  {
    id: 10,
    company: 'Oracle',
    role: 'Cloud Software Engineer',
    location: 'Hyderabad, India',
    salary: '₹15,00,000/year',
    job_url: 'https://oracle.com/careers',
    status: 'Withdrawn',
    application_date: '2026-09-01',
    description: 'Decided to withdraw after receiving competing offers with better alignment.',
    interviews: [
      {
        id: 115,
        interview_type: 'Online Assessment (OA)',
        interview_date: '2026-09-08T11:00:00',
        interviewer: 'HackerRank',
        notes: 'SQL queries and Java fundamentals.',
        result: 'Passed',
      },
    ],
  },
  {
    id: 11,
    company: 'Zomato',
    role: 'Backend Engineer (Python / Go)',
    location: 'Gurgaon, India (Hybrid)',
    salary: '₹20,00,000/year',
    job_url: 'https://zomato.com/careers',
    status: 'Applied',
    application_date: '2026-10-07',
    description: 'Applied for Dineline and Live events backend microservices.',
    interviews: [],
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('interviews'); // dashboard | applications | interviews | profile
  const [applications, setApplications] = useState(INITIAL_APPLICATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('date-desc'); // date-desc | date-asc | company-asc
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'kanban'
  const [theme, setTheme] = useState(() => localStorage.getItem('jobtrack_theme') || 'light');
  const [apiStatus, setApiStatus] = useState({ online: false, checking: true });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Global search input ref & interview-specific search state
  const globalSearchRef = useRef(null);
  const [interviewSearchQuery, setInterviewSearchQuery] = useState('');
  const [interviewResultFilter, setInterviewResultFilter] = useState('ALL');

  // Core Interface Modals & Panels State
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);

  // Global keyboard shortcuts helper (1-4 navigation, N new app, D theme, G/B view, ? cheatsheet, Esc close)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isInput =
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.isContentEditable;

      // Escape closes open modals & menus regardless of active element
      if (e.key === 'Escape') {
        setIsAddModalOpen(false);
        setSelectedApplication(null);
        setIsShortcutsOpen(false);
        setIsProfileEditOpen(false);
        setIsAuthModalOpen(false);
        setExportMenuOpen(false);
        return;
      }

      // Search shortcut (Ctrl + K or /)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        globalSearchRef.current?.focus();
        return;
      }
      if (e.key === '/' && !isInput) {
        e.preventDefault();
        globalSearchRef.current?.focus();
        return;
      }

      // If user is currently typing in an input/textarea, ignore single-character shortcuts
      if (isInput) return;

      // Shortcuts Modal toggle (?)
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
        return;
      }

      // Tab Navigation shortcuts (1: Dashboard, 2: Applications, 3: Interviews, 4: Profile)
      if (e.key === '1') {
        setActiveTab('dashboard');
      } else if (e.key === '2') {
        setActiveTab('applications');
      } else if (e.key === '3') {
        setActiveTab('interviews');
      } else if (e.key === '4') {
        setActiveTab('profile');
      } else if (e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setEditingApplication(null);
        setIsAddModalOpen(true);
      } else if (e.key.toLowerCase() === 'd') {
        e.preventDefault();
        toggleTheme();
      } else if (e.key.toLowerCase() === 'l') {
        e.preventDefault();
        handleLogout();
      } else if (e.key.toLowerCase() === 'g' && activeTab === 'applications') {
        e.preventDefault();
        setViewMode('grid');
      } else if (e.key.toLowerCase() === 'b' && activeTab === 'applications') {
        e.preventDefault();
        setViewMode('kanban');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab]);

  // Sync theme with DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('jobtrack_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  // Fetch applications from FastAPI backend
  const loadApplications = async (showFeedback = false) => {
    setIsRefreshing(true);
    try {
      const data = await applicationsApi.getAll();
      if (Array.isArray(data) && data.length > 0) {
        setApplications(data);
        if (showFeedback) showToast('Synchronized with FastAPI backend');
      }
    } catch (err) {
      console.warn('Backend fetch failed, maintaining local state:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Polling FastAPI backend health check
  useEffect(() => {
    let isMounted = true;
    const verifyApi = async () => {
      const res = await checkHealth();
      if (isMounted) {
        setApiStatus((prev) => {
          if (res.online && !prev.online) {
            loadApplications(false);
          }
          return { online: res.online, checking: false };
        });
      }
    };
    verifyApi();
    const interval = setInterval(verifyApi, 6000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Initial load if online
  useEffect(() => {
    loadApplications(false);
  }, []);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);

  // User Profile State & Persistence
  const [profileData, setProfileData] = useState(() => {
    try {
      const saved = localStorage.getItem('jobtrack_profile_data');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      name: 'Sandeep Kumar',
      email: 'sandeep.dev@example.com',
      role: 'Full Stack Engineer / MCA Candidate',
      bio: 'Aspiring software engineer specializing in FastAPI backend architectures, React interactive frontends, and relational database modeling. Passionate about solving complex algorithms and distributed system design.',
      location: 'Bangalore, India (Hybrid / Remote)',
      targetSalary: '₹18 - ₹24 LPA',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      leetcode: 'https://leetcode.com',
      portfolio: 'https://sandeep-portfolio.dev',
      joined: 'October 2026',
    };
  });

  // Candidate Skill Tags State & Persistence
  const [skills, setSkills] = useState(() => {
    try {
      const saved = localStorage.getItem('jobtrack_profile_skills');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      'Python',
      'FastAPI',
      'React',
      'PostgreSQL',
      'Data Structures & Algorithms',
      'System Design',
      'Docker',
      'REST APIs',
      'Git & CI/CD',
    ];
  });
  const [newSkillInput, setNewSkillInput] = useState('');

  const handleAddSkill = (skillToAdd) => {
    const trimmed = (skillToAdd || newSkillInput).trim();
    if (!trimmed) return;
    if (skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      showToast(`"${trimmed}" is already in your skills`);
      return;
    }
    const updated = [...skills, trimmed];
    setSkills(updated);
    localStorage.setItem('jobtrack_profile_skills', JSON.stringify(updated));
    setNewSkillInput('');
    showToast(`Added ${trimmed} to profile skills`);
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updated = skills.filter((s) => s !== skillToRemove);
    setSkills(updated);
    localStorage.setItem('jobtrack_profile_skills', JSON.stringify(updated));
    showToast(`Removed ${skillToRemove}`);
  };

  const handleSaveProfile = (newProfile) => {
    setProfileData((prev) => {
      const updated = { ...prev, ...newProfile };
      localStorage.setItem('jobtrack_profile_data', JSON.stringify(updated));
      return updated;
    });
    showToast('Candidate profile updated');
  };

  const handleLogout = () => {
    authApi.logout();
    setProfileData({
      name: 'Guest User',
      email: 'guest@example.com',
      role: 'Job Seeker',
      bio: 'Signed out. Sign in to synchronize your profile and applications.',
      location: 'Bangalore, India',
      targetSalary: '₹18 - ₹24 LPA',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      leetcode: 'https://leetcode.com',
      portfolio: '',
      joined: 'October 2026',
    });
    localStorage.removeItem('jobtrack_profile_data');
    showToast('Account logged out (Key: L)');
  };

  // Verify stored session on mount
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const profile = await authApi.getProfile();
          if (profile && profile.name) {
            setProfileData((prev) => ({
              ...prev,
              name: profile.name,
              email: profile.email,
            }));
          }
        } catch {
          // Token expired or invalid
          localStorage.removeItem('access_token');
        }
      }
    };
    fetchUser();
  }, []);

  // Calculate Real-time Dashboard Analytics
  const stats = useMemo(() => {
    const total = applications.length;
    const applied = applications.filter((a) => a.status === 'Applied').length;
    const assessment = applications.filter((a) => a.status === 'Assessment').length;
    const interview = applications.filter((a) => a.status === 'Interview').length;
    const offer = applications.filter((a) => a.status === 'Offer').length;
    const rejected = applications.filter((a) => a.status === 'Rejected').length;
    const withdrawn = applications.filter((a) => a.status === 'Withdrawn').length;

    // Conversion rate calculations
    const interviewCount = interview + offer;
    const interviewRate = total > 0 ? ((interviewCount / total) * 100).toFixed(1) : '0.0';
    const offerRate = total > 0 ? ((offer / total) * 100).toFixed(1) : '0.0';
    const rejectionRate = total > 0 ? ((rejected / total) * 100).toFixed(1) : '0.0';

    return {
      total,
      applied,
      assessment,
      interview,
      offer,
      rejected,
      withdrawn,
      interviewRate,
      offerRate,
      rejectionRate,
    };
  }, [applications]);

  // Filter & Search Logic (Comprehensive Deep Search)
  const filteredApplications = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return applications
      .filter((app) => {
        let matchesSearch = true;
        if (q) {
          const matchCompany = app.company?.toLowerCase().includes(q);
          const matchRole = app.role?.toLowerCase().includes(q);
          const matchLocation = app.location?.toLowerCase().includes(q);
          const matchSalary = app.salary?.toLowerCase().includes(q);
          const matchDescription = app.description?.toLowerCase().includes(q);
          const matchInterviews = (app.interviews || []).some(
            (iv) =>
              iv.interview_type?.toLowerCase().includes(q) ||
              iv.interviewer?.toLowerCase().includes(q) ||
              iv.notes?.toLowerCase().includes(q) ||
              iv.result?.toLowerCase().includes(q)
          );
          matchesSearch =
            matchCompany ||
            matchRole ||
            matchLocation ||
            matchSalary ||
            matchDescription ||
            matchInterviews;
        }

        const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') {
          return new Date(b.application_date || 0) - new Date(a.application_date || 0);
        }
        if (sortBy === 'date-asc') {
          return new Date(a.application_date || 0) - new Date(b.application_date || 0);
        }
        if (sortBy === 'company-asc') {
          return a.company.localeCompare(b.company);
        }
        return 0;
      });
  }, [applications, searchQuery, statusFilter, sortBy]);

  // All Scheduled Interviews across applications
  const allInterviews = useMemo(() => {
    const list = [];
    applications.forEach((app) => {
      (app.interviews || []).forEach((iv) => {
        list.push({
          ...iv,
          company: app.company,
          role: app.role,
          appId: app.id,
          appStatus: app.status,
        });
      });
    });
    return list.sort((a, b) => new Date(a.interview_date) - new Date(b.interview_date));
  }, [applications]);

  // Filtered Interviews with dedicated search & result filters
  const filteredInterviews = useMemo(() => {
    const q = interviewSearchQuery.toLowerCase().trim();
    return allInterviews.filter((iv) => {
      let matchesSearch = true;
      if (q) {
        matchesSearch =
          iv.company?.toLowerCase().includes(q) ||
          iv.role?.toLowerCase().includes(q) ||
          iv.interview_type?.toLowerCase().includes(q) ||
          iv.interviewer?.toLowerCase().includes(q) ||
          iv.notes?.toLowerCase().includes(q) ||
          iv.result?.toLowerCase().includes(q);
      }
      const matchesResult =
        interviewResultFilter === 'ALL' || iv.result === interviewResultFilter;
      return matchesSearch && matchesResult;
    });
  }, [allInterviews, interviewSearchQuery, interviewResultFilter]);

  // CRUD Handlers
  const handleSaveApplication = async (formData) => {
    try {
      if (editingApplication) {
        let updatedApp = { ...editingApplication, ...formData };
        if (apiStatus.online) {
          try {
            updatedApp = await applicationsApi.update(editingApplication.id, formData);
          } catch (err) {
            console.error('Backend update error:', err);
          }
        }
        setApplications((prev) =>
          prev.map((app) => (app.id === editingApplication.id ? { ...app, ...updatedApp } : app))
        );
        showToast(`Saved updates for ${formData.company}`);
        setEditingApplication(null);
      } else {
        let newApp = {
          ...formData,
          id: Date.now(),
          interviews: [],
        };
        if (apiStatus.online) {
          try {
            newApp = await applicationsApi.create(formData);
          } catch (err) {
            console.error('Backend create error:', err);
          }
        }
        setApplications((prev) => [newApp, ...prev]);
        showToast(`Added application for ${formData.company}`);
      }
    } finally {
      setIsAddModalOpen(false);
    }
  };

  const handleDeleteApplication = async (id) => {
    if (window.confirm('Are you sure you want to delete this application and all its interview logs?')) {
      if (apiStatus.online) {
        try {
          await applicationsApi.delete(id);
        } catch (err) {
          console.error('Backend delete error:', err);
        }
      }
      setApplications((prev) => prev.filter((app) => app.id !== id));
      if (selectedApplication && selectedApplication.id === id) {
        setSelectedApplication(null);
      }
      showToast('Application deleted successfully');
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    if (apiStatus.online) {
      try {
        await applicationsApi.update(appId, { status: newStatus });
      } catch (err) {
        console.error('Backend status update error:', err);
      }
    }
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: newStatus } : app))
    );
    if (selectedApplication && selectedApplication.id === appId) {
      setSelectedApplication((prev) => ({ ...prev, status: newStatus }));
    }
    showToast(`Status updated to ${newStatus}`);
  };

  const handleAddInterview = async (appId, interviewData) => {
    let newRound = {
      ...interviewData,
      id: Date.now(),
    };
    if (apiStatus.online) {
      try {
        newRound = await interviewsApi.create(appId, interviewData);
      } catch (err) {
        console.error('Backend add interview error:', err);
      }
    }
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          const updatedRounds = [...(app.interviews || []), newRound];
          return { ...app, interviews: updatedRounds };
        }
        return app;
      })
    );
    if (selectedApplication && selectedApplication.id === appId) {
      setSelectedApplication((prev) => ({
        ...prev,
        interviews: [...(prev.interviews || []), newRound],
      }));
    }
    showToast('Interview round scheduled');
  };

  const handleDeleteInterview = async (appId, interviewId) => {
    if (apiStatus.online) {
      try {
        await interviewsApi.delete(interviewId);
      } catch (err) {
        console.error('Backend delete interview error:', err);
      }
    }
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          return {
            ...app,
            interviews: (app.interviews || []).filter((iv) => iv.id !== interviewId),
          };
        }
        return app;
      })
    );
    if (selectedApplication && selectedApplication.id === appId) {
      setSelectedApplication((prev) => ({
        ...prev,
        interviews: (prev.interviews || []).filter((iv) => iv.id !== interviewId),
      }));
    }
    showToast('Interview round removed');
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">
            <Briefcase size={20} />
          </div>
          <span className="brand-title">JobTrack</span>
        </div>

        <nav className="sidebar-nav">
          <button
            id="nav-tab-dashboard"
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>

          <button
            id="nav-tab-applications"
            className={`nav-item ${activeTab === 'applications' ? 'active' : ''}`}
            onClick={() => setActiveTab('applications')}
          >
            <Briefcase size={18} />
            <span>Applications ({applications.length})</span>
          </button>

          <button
            id="nav-tab-interviews"
            className={`nav-item ${activeTab === 'interviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('interviews')}
          >
            <Calendar size={18} />
            <span>Interviews</span>
          </button>

          <button
            id="nav-tab-profile"
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} />
            <span>My Profile</span>
          </button>
        </nav>

        <div
          id="btn-sidebar-user"
          className="sidebar-user"
          style={{ cursor: 'pointer' }}
          onClick={() => setIsAuthModalOpen(true)}
          title="Click to switch or sign in to candidate account"
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="user-avatar">{profileData.name.slice(0, 2).toUpperCase()}</div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{profileData.name}</div>
                <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>{profileData.email}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                id="btn-sidebar-logout"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLogout();
                }}
                title="Account Logout (Key: L)"
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '5px',
                  borderRadius: 'var(--radius-sm)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#ef4444';
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-muted)';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Wrapper */}
      <div className="main-wrapper">
        {/* Top Header */}
        <header className="topbar">
          <h1 className="page-title">
            {activeTab === 'dashboard' && 'Dashboard Overview'}
            {activeTab === 'applications' && 'Job Applications'}
            {activeTab === 'interviews' && 'Interview Timeline'}
            {activeTab === 'profile' && 'Candidate Profile'}
          </h1>

          {/* Global Search Bar with Shortcut hint and instant clear */}
          <div className="topbar-search">
            <Search size={16} className="topbar-search-icon" />
            <input
              id="input-global-search"
              ref={globalSearchRef}
              type="text"
              placeholder="Search applications, roles, notes..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab === 'dashboard' || activeTab === 'profile') {
                  setActiveTab('applications');
                }
              }}
              className="topbar-search-input"
            />
            {searchQuery ? (
              <button
                id="btn-clear-global-search"
                onClick={() => setSearchQuery('')}
                className="topbar-search-clear"
                title="Clear search"
              >
                <X size={14} />
              </button>
            ) : (
              <span className="topbar-search-kbd">Ctrl K</span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Notification Center Popover */}
            <NotificationDropdown
              applications={applications}
              onSelectApplication={(app) => setSelectedApplication(app)}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />

            {/* Keyboard Shortcuts Helper Button */}
            <button
              id="btn-shortcuts-toggle"
              onClick={() => setIsShortcutsOpen(true)}
              className="btn btn-secondary"
              title="Keyboard Shortcuts (?)"
              style={{ padding: '7px 10px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              <Keyboard size={15} />
              <span style={{ fontSize: '0.76rem', fontWeight: 700 }}>?</span>
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              id="btn-theme-toggle"
              onClick={toggleTheme}
              className="btn btn-secondary"
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              style={{ padding: '7px 10px', display: 'inline-flex', alignItems: 'center' }}
            >
              {theme === 'light' ? <Moon size={15} /> : <Sun size={15} color="#f59e0b" />}
            </button>

            {/* Sync / Refresh Button */}
            <button
              id="btn-sync-backend"
              onClick={() => loadApplications(true)}
              className="btn btn-secondary"
              title="Sync with backend"
              style={{ padding: '7px 10px', display: 'inline-flex', alignItems: 'center' }}
            >
              <RefreshCw size={15} className={isRefreshing ? 'spin-icon' : ''} />
            </button>

            {/* Data Export Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                id="btn-export-dropdown"
                onClick={() => setExportMenuOpen((prev) => !prev)}
                className="btn btn-secondary"
                title="Export applications data"
                style={{ padding: '7px 12px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
              >
                <Download size={15} />
                <span style={{ fontSize: '0.82rem' }}>Export</span>
                <ChevronDown size={13} />
              </button>

              {exportMenuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '110%',
                    zIndex: 100,
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-lg)',
                    minWidth: '160px',
                    padding: '6px',
                  }}
                  onMouseLeave={() => setExportMenuOpen(false)}
                >
                  <button
                    id="btn-export-csv"
                    onClick={() => {
                      exportToCSV(applications);
                      setExportMenuOpen(false);
                      showToast('Exported applications to CSV');
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 12px',
                      background: 'none',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: 'var(--text-main)',
                      cursor: 'pointer',
                    }}
                    className="dropdown-item-hover"
                  >
                    📊 Export as CSV
                  </button>
                  <button
                    id="btn-export-json"
                    onClick={() => {
                      exportToJSON(applications);
                      setExportMenuOpen(false);
                      showToast('Exported applications to JSON backup');
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 12px',
                      background: 'none',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: 'var(--text-main)',
                      cursor: 'pointer',
                    }}
                    className="dropdown-item-hover"
                  >
                    💾 Export as JSON
                  </button>
                </div>
              )}
            </div>

            <button
              id="btn-add-application"
              onClick={() => {
                setEditingApplication(null);
                setIsAddModalOpen(true);
              }}
              className="btn btn-primary"
            >
              <Plus size={16} />
              <span>Add Application</span>
            </button>
          </div>
        </header>

        {/* Dynamic Page Views */}
        <main className="page-content">
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div>
              {/* Conversion Metrics */}
              <div className="stats-grid">
                <StatCard
                  label="Total Applications"
                  value={stats.total}
                  icon={<Briefcase size={22} />}
                  color="#4f46e5"
                  bg="#eef2ff"
                />
                <StatCard
                  label="Interview Conversion"
                  value={`${stats.interviewRate}%`}
                  icon={<TrendingUp size={22} />}
                  color="#d97706"
                  bg="#fffbeb"
                />
                <StatCard
                  label="Offer Rate"
                  value={`${stats.offerRate}%`}
                  icon={<Award size={22} />}
                  color="#059669"
                  bg="#ecfdf5"
                />
                <StatCard
                  label="Rejection Rate"
                  value={`${stats.rejectionRate}%`}
                  icon={<XCircle size={22} />}
                  color="#e11d48"
                  bg="#fff1f2"
                />
              </div>

              {/* Advanced Recruitment Funnel & Geographic Hubs */}
              <AnalyticsCharts applications={applications} stats={stats} />

              {/* Status Breakdown Chips */}
              <div className="card" style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>
                  Stage Breakdown
                </h3>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '120px', padding: '12px', background: 'var(--status-applied-bg)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--status-applied-text)', fontWeight: 600 }}>Applied</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--status-applied-text)' }}>{stats.applied}</div>
                  </div>

                  <div style={{ flex: 1, minWidth: '120px', padding: '12px', background: 'var(--status-assessment-bg)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--status-assessment-text)', fontWeight: 600 }}>Assessment</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--status-assessment-text)' }}>{stats.assessment}</div>
                  </div>

                  <div style={{ flex: 1, minWidth: '120px', padding: '12px', background: 'var(--status-interview-bg)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--status-interview-text)', fontWeight: 600 }}>Interview</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--status-interview-text)' }}>{stats.interview}</div>
                  </div>

                  <div style={{ flex: 1, minWidth: '120px', padding: '12px', background: 'var(--status-offer-bg)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--status-offer-text)', fontWeight: 600 }}>Offer</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--status-offer-text)' }}>{stats.offer}</div>
                  </div>

                  <div style={{ flex: 1, minWidth: '120px', padding: '12px', background: 'var(--status-rejected-bg)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--status-rejected-text)', fontWeight: 600 }}>Rejected</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--status-rejected-text)' }}>{stats.rejected}</div>
                  </div>
                </div>
              </div>

              {/* Recent Applications Section */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recent Applications</h3>
                <button
                  onClick={() => setActiveTab('applications')}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.82rem', padding: '6px 12px' }}
                >
                  View All ({applications.length})
                </button>
              </div>

              <div className="applications-grid">
                {applications.slice(0, 3).map((app) => (
                  <ApplicationCard
                    key={app.id}
                    application={app}
                    onSelect={(selected) => setSelectedApplication(selected)}
                    onEdit={(toEdit) => {
                      setEditingApplication(toEdit);
                      setIsAddModalOpen(true);
                    }}
                    onDelete={handleDeleteApplication}
                  />
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: APPLICATIONS LIST & SEARCH/FILTER */}
          {activeTab === 'applications' && (
            <div>
              {/* Search, Filter, Sort Controls */}
              <div className="action-bar">
                <div className="search-box">
                  <Search size={18} className="search-icon" />
                  <input
                    id="input-applications-search"
                    type="text"
                    placeholder="Search company, role, location, salary, notes..."
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      id="btn-clear-app-search"
                      onClick={() => setSearchQuery('')}
                      className="search-clear-btn"
                      title="Clear search"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>

                <div className="filter-group">
                  <span className="search-count-badge">
                    {filteredApplications.length} of {applications.length}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Filter size={16} color="var(--text-muted)" />
                    <select
                      id="select-status-filter"
                      className="form-select"
                      style={{ width: 'auto', padding: '8px 12px', fontSize: '0.85rem' }}
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="ALL">All Statuses ({applications.length})</option>
                      <option value="Applied">Applied</option>
                      <option value="Assessment">Assessment</option>
                      <option value="Interview">Interview</option>
                      <option value="Offer">Offer</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Withdrawn">Withdrawn</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <SlidersHorizontal size={16} color="var(--text-muted)" />
                    <select
                      id="select-sort-by"
                      className="form-select"
                      style={{ width: 'auto', padding: '8px 12px', fontSize: '0.85rem' }}
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="date-desc">Newest First</option>
                      <option value="date-asc">Oldest First</option>
                      <option value="company-asc">Company (A-Z)</option>
                    </select>
                  </div>

                  {/* View Mode Toggle: Grid vs Kanban */}
                  <div className="view-mode-toggle">
                    <button
                      id="btn-view-grid"
                      className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
                      onClick={() => setViewMode('grid')}
                      title="Grid Card View (Press G)"
                    >
                      <LayoutGrid size={15} />
                      <span>Grid</span>
                    </button>
                    <button
                      id="btn-view-kanban"
                      className={`view-mode-btn ${viewMode === 'kanban' ? 'active' : ''}`}
                      onClick={() => setViewMode('kanban')}
                      title="Drag & Drop Kanban Board (Press B)"
                    >
                      <Kanban size={15} />
                      <span>Kanban</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Interactive Stage Filter Pills Bar */}
              <StageFilterPills
                applications={applications}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
              />

              {/* Kanban View vs Grid View */}
              {viewMode === 'kanban' ? (
                <KanbanBoard
                  applications={filteredApplications}
                  onSelect={(selected) => setSelectedApplication(selected)}
                  onEdit={(toEdit) => {
                    setEditingApplication(toEdit);
                    setIsAddModalOpen(true);
                  }}
                  onDelete={handleDeleteApplication}
                  onStatusChange={handleStatusChange}
                  onAddNewInColumn={(colStatus) => {
                    setEditingApplication({ status: colStatus });
                    setIsAddModalOpen(true);
                  }}
                />
              ) : filteredApplications.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <Search size={28} />
                  </div>
                  <h3 className="empty-title">No matching applications found</h3>
                  <p className="empty-desc">
                    Try changing your search term or clearing the status filter.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('ALL');
                    }}
                    className="btn btn-secondary"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="applications-grid">
                  {filteredApplications.map((app) => (
                    <ApplicationCard
                      key={app.id}
                      application={app}
                      onSelect={(selected) => setSelectedApplication(selected)}
                      onEdit={(toEdit) => {
                        setEditingApplication(toEdit);
                        setIsAddModalOpen(true);
                      }}
                      onDelete={handleDeleteApplication}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: INTERVIEWS */}
          {activeTab === 'interviews' && (
            <div>
              <div className="card" style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>
                  Interview Schedule & History
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  A consolidated timeline of all assessment deadlines and technical/HR interview rounds across your applications.
                </p>
              </div>

              {/* Dedicated Interview Search and Filter Bar */}
              <div className="action-bar">
                <div className="search-box">
                  <Search size={18} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search company, role, interviewer, round type, notes..."
                    className="search-input"
                    value={interviewSearchQuery}
                    onChange={(e) => setInterviewSearchQuery(e.target.value)}
                  />
                  {interviewSearchQuery && (
                    <button
                      onClick={() => setInterviewSearchQuery('')}
                      className="search-clear-btn"
                      title="Clear interview search"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>

                <div className="filter-group">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Filter size={16} color="var(--text-muted)" />
                    <select
                      className="form-select"
                      style={{ width: 'auto', padding: '8px 12px', fontSize: '0.85rem' }}
                      value={interviewResultFilter}
                      onChange={(e) => setInterviewResultFilter(e.target.value)}
                    >
                      <option value="ALL">All Results ({allInterviews.length})</option>
                      <option value="Pending">Pending</option>
                      <option value="Passed">Passed</option>
                      <option value="Failed">Failed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                  <span className="search-count-badge">
                    Showing {filteredInterviews.length} of {allInterviews.length} rounds
                  </span>
                </div>
              </div>

              {allInterviews.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <Calendar size={28} />
                  </div>
                  <h3 className="empty-title">No Interviews Scheduled</h3>
                  <p className="empty-desc">
                    Log an interview round on any application card to see your schedule here.
                  </p>
                </div>
              ) : filteredInterviews.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <Search size={28} />
                  </div>
                  <h3 className="empty-title">No matching interviews found</h3>
                  <p className="empty-desc">
                    Try changing your search term or clearing the result filter.
                  </p>
                  <button
                    onClick={() => {
                      setInterviewSearchQuery('');
                      setInterviewResultFilter('ALL');
                    }}
                    className="btn btn-secondary"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '16px' }}>
                  {filteredInterviews.map((iv) => (
                    <div
                      key={iv.id}
                      className="card"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px' }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '1.05rem', fontWeight: 800 }}>{iv.company}</span>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>&bull; {iv.role}</span>
                        </div>
                        <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--primary)', marginTop: '4px' }}>
                          {iv.interview_type}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          📅 {new Date(iv.interview_date).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' })}
                          {iv.interviewer && ` | Interviewer: ${iv.interviewer}`}
                        </div>
                        {iv.notes && (
                          <div style={{ fontSize: '0.82rem', marginTop: '8px', color: 'var(--text-main)', background: 'var(--bg-subtle)', padding: '6px 12px', borderRadius: '4px' }}>
                            {iv.notes}
                          </div>
                        )}
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          padding: '4px 12px',
                          borderRadius: 'var(--radius-full)',
                          background: iv.result === 'Passed' ? '#ecfdf5' : iv.result === 'Failed' ? '#fff1f2' : '#fffbeb',
                          color: iv.result === 'Passed' ? '#047857' : iv.result === 'Failed' ? '#be123c' : '#b45309',
                        }}>
                          {iv.result}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PROFILE */}
          {activeTab === 'profile' && (
            <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Profile Header Card */}
              <div className="card">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div
                      style={{
                        width: '72px',
                        height: '72px',
                        borderRadius: 'var(--radius-full)',
                        background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.6rem',
                        fontWeight: 800,
                        boxShadow: '0 6px 16px rgba(79, 70, 229, 0.35)',
                        border: '3px solid var(--bg-surface)',
                      }}
                    >
                      {profileData.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
                          {profileData.name}
                        </h2>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '3px 10px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            background: '#ecfdf5',
                            color: '#059669',
                            border: '1px solid #a7f3d0',
                          }}
                        >
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                          Actively Interviewing
                        </span>
                      </div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', fontWeight: 600, marginTop: '2px' }}>
                        {profileData.role}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '6px', flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Mail size={13} />
                          {profileData.email}
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={13} />
                          {profileData.location}
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <DollarSign size={13} />
                          Target: {profileData.targetSalary}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      id="btn-edit-profile"
                      onClick={() => setIsProfileEditOpen(true)}
                      className="btn btn-secondary"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px' }}
                    >
                      <Edit3 size={15} />
                      <span>Edit Profile</span>
                    </button>

                    <button
                      id="btn-account-logout-profile"
                      onClick={handleLogout}
                      className="btn btn-secondary"
                      title="Account Logout (Shortcut Key: L)"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 14px',
                        color: 'var(--status-rejected-text, #ef4444)',
                        borderColor: 'var(--border-light)',
                      }}
                    >
                      <LogOut size={15} />
                      <span>Account Logout</span>
                      <kbd style={{ fontSize: '0.65rem', padding: '2px 5px', borderRadius: '4px', background: 'var(--bg-subtle)', border: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>L</kbd>
                    </button>
                  </div>
                </div>

                {/* Candidate Stats Metrics Bar */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                    gap: '12px',
                    marginTop: '24px',
                    paddingTop: '20px',
                    borderTop: '1px solid var(--border-light)',
                  }}
                >
                  <div style={{ padding: '10px 14px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Applications</div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary)', marginTop: '2px' }}>
                      {applications.length}
                    </div>
                  </div>
                  <div style={{ padding: '10px 14px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Interviews</div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#8b5cf6', marginTop: '2px' }}>
                      {allInterviews.length}
                    </div>
                  </div>
                  <div style={{ padding: '10px 14px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Offers</div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#059669', marginTop: '2px' }}>
                      {stats.offer}
                    </div>
                  </div>
                  <div style={{ padding: '10px 14px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Conversion</div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#d97706', marginTop: '2px' }}>
                      {stats.interviewRate}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Skills & Tech Stack Card */}
              <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Tag size={18} color="var(--primary)" />
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Technical Skills & Technologies</h3>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 7px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 'var(--radius-full)' }}>
                      {skills.length} skills
                    </span>
                  </div>
                </div>

                <div className="skills-cloud">
                  {skills.map((skill) => (
                    <span key={skill} className="skill-tag">
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="skill-tag-remove"
                        title={`Remove ${skill}`}
                        aria-label={`Remove skill ${skill}`}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Add Custom Skill Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddSkill();
                  }}
                  className="skill-add-row"
                >
                  <input
                    id="input-add-skill"
                    type="text"
                    className="skill-add-input"
                    placeholder="Add a new skill (e.g. Redis, Kubernetes, Next.js, GraphQL)..."
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                  />
                  <button
                    id="btn-add-skill"
                    type="submit"
                    className="btn btn-primary"
                    style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                  >
                    <Plus size={14} />
                    <span>Add</span>
                  </button>
                </form>

                {/* Quick Recommended Skill Suggestions */}
                <div className="skill-recs-row">
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-subtle)', fontWeight: 600 }}>
                    Suggestions:
                  </span>
                  {[
                    'TypeScript',
                    'Next.js',
                    'Redis',
                    'Docker',
                    'GraphQL',
                    'AWS',
                    'System Design',
                    'Microservices',
                    'TailwindCSS',
                  ].map((s) => (
                    <button
                      key={s}
                      type="button"
                      className="skill-rec-chip"
                      onClick={() => handleAddSkill(s)}
                    >
                      + {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Portfolio & Social Profiles Card */}
              <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Globe size={18} color="var(--primary)" />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Candidate Portfolio & Online Presence</h3>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Recruiters and hiring managers can access your live code repositories and technical writeups.
                </p>

                <div className="portfolio-links-grid">
                  <a
                    href={profileData.github || 'https://github.com'}
                    target="_blank"
                    rel="noreferrer"
                    className="portfolio-link-card"
                    id="link-candidate-github"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <GithubIcon size={18} color="currentColor" />
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>GitHub</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Code Repositories & OSS</div>
                      </div>
                    </div>
                    <ExternalLink size={14} color="var(--text-subtle)" />
                  </a>

                  <a
                    href={profileData.linkedin || 'https://linkedin.com'}
                    target="_blank"
                    rel="noreferrer"
                    className="portfolio-link-card"
                    id="link-candidate-linkedin"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <LinkedinIcon size={18} color="#0077b5" />
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>LinkedIn</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Professional Network</div>
                      </div>
                    </div>
                    <ExternalLink size={14} color="var(--text-subtle)" />
                  </a>

                  <a
                    href={profileData.leetcode || 'https://leetcode.com'}
                    target="_blank"
                    rel="noreferrer"
                    className="portfolio-link-card"
                    id="link-candidate-leetcode"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Code size={18} color="#f59e0b" />
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>LeetCode</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Problem Solving & DSA</div>
                      </div>
                    </div>
                    <ExternalLink size={14} color="var(--text-subtle)" />
                  </a>

                  <a
                    href={profileData.portfolio || 'https://sandeep-portfolio.dev'}
                    target="_blank"
                    rel="noreferrer"
                    className="portfolio-link-card"
                    id="link-candidate-portfolio"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Globe size={18} color="#10b981" />
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Personal Website</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Projects & Resume</div>
                      </div>
                    </div>
                    <ExternalLink size={14} color="var(--text-subtle)" />
                  </a>
                </div>
              </div>

              {/* Bio & Career Objectives */}
              <div className="card">
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '8px' }}>
                  Professional Bio & Career Objective
                </h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                  {profileData.bio}
                </p>
                <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-subtle)' }}>
                    Profile active since {profileData.joined || 'October 2026'}
                  </span>
                  <button
                    onClick={() => setIsProfileEditOpen(true)}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.78rem', padding: '5px 10px' }}
                  >
                    Update Bio
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL 1: ADD / EDIT APPLICATION */}
      <ApplicationModal
        key={editingApplication ? `edit-${editingApplication.id}` : 'new-app'}
        isOpen={isAddModalOpen}
        initialData={editingApplication}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingApplication(null);
        }}
        onSave={handleSaveApplication}
      />

      {/* MODAL 2: APPLICATION DETAILS & INTERVIEWS */}
      <ApplicationDetailModal
        isOpen={!!selectedApplication}
        application={selectedApplication}
        onClose={() => setSelectedApplication(null)}
        onStatusChange={handleStatusChange}
        onAddInterview={handleAddInterview}
        onDeleteInterview={handleDeleteInterview}
      />

      {/* MODAL 3: CANDIDATE AUTH / ACCOUNT MODAL */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={profileData}
        onLogout={handleLogout}
        onAuthSuccess={(user) => {
          setProfileData((prev) => ({
            ...prev,
            name: user.name,
            email: user.email,
          }));
          showToast(`Welcome back, ${user.name}!`);
          loadApplications(false);
        }}
      />

      {/* MODAL 4: KEYBOARD SHORTCUTS CHEATSHEET */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* MODAL 5: EDIT CANDIDATE PROFILE & PORTFOLIO */}
      <ProfileEditModal
        isOpen={isProfileEditOpen}
        profile={profileData}
        onClose={() => setIsProfileEditOpen(false)}
        onSave={handleSaveProfile}
        onLogout={handleLogout}
      />

      {/* FLOATING TOAST NOTIFICATIONS */}
      {toast && (
        <div className="toast-container">
          <div className="toast toast-success">
            <CheckCircle size={18} color="#10b981" />
            <span>{toast}</span>
          </div>
        </div>
      )}
    </div>
  );
}
